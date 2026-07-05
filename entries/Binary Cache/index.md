<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Binary Cache -->

A binary cache builds Nix packages and caches the result for other machines. Any machine with Nix installed can be a binary cache for another one, no matter the operating system.

## Setting up a binary cache with attic and caddy

Here's a snippet enabling [Attic](https://github.com/zhaofengli/attic) and [Caddy](https://caddyserver.com/).

Please refer to the [Attic documentation](https://docs.attic.rs/) to set it up correctly. The goal here is to show how those two services can be used together to provide a solid solution.

``` nix
{
  networking.firewall = {
    allowedTCPPorts = [ 8080 ];
  };

  services = {
    atticd = {
      enable = true;
      settings = {
        listen = "127.0.0.1:8081";
      };
      # Path to an EnvironmentFile containing required environment variables:
      # ATTIC_SERVER_TOKEN_RS256_SECRET_BASE64: The base64-encoded RSA PEM PKCS1 of the RS256 JWT secret. Generate it with openssl genrsa -traditional 4096 | base64 -w0.
      environmentFile = "/root/.attic-env-file";
    };

    # Inspired from:
    # 1. https://github.com/phanirithvij/system/blob/main/nixos/applications/nix/selfhosted/proxy-cache.nix
    # 2. https://github.com/rnl-dei/nixrnl/blob/master/profiles/proxy-cache.nix
    caddy = {
      enable = true;

      package = pkgs.caddy.withPlugins {
        plugins = [ "github.com/caddyserver/cache-handler@v0.16.0" ];
        hash = "sha256-CecAx6KelOHEDiOKDTKLlDcnWtRNnDzBw1AzgN5JaFw=";
      };

      globalConfig = ''
        order cache before rewrite
        cache {
          # Global default cache duration (if not overridden below)
          ttl 1h
          log_level debug
        }
      '';

      virtualHosts.":8080" = {
        extraConfig = ''
          log {
            format console
          }

          # Nix cache info endpoint
          @nix_cache_info path /nix-cache-info
          handle @nix_cache_info {
            header Cache-Control "public, max-age=300"

            # 2. Tell Caddy's internal cache to hold this for 5 minutes
            cache {
              ttl 300s
            }

            reverse_proxy https://cache.nixos.org {
              header_up Host cache.nixos.org
            }
          }

          # NAR files (the actual packages)
          @nar path /nar/*
          handle @nar {
            header Cache-Control "public, max-age=31536000, immutable"

            # Cache the actual nar packages for a year
            cache {
              ttl 8760h
            }

            reverse_proxy https://cache.nixos.org {
              header_up Host cache.nixos.org
            }
          }

          # Narinfo files (metadata about packages)
          @narinfo path_regexp ^/[^/]+\.narinfo$
          handle @narinfo {
            header Cache-Control "public, max-age=86400"

            # Narinfo can change, so cache them locally for 24 hours
            cache {
              ttl 24h
            }

            reverse_proxy https://cache.nixos.org {
              header_up Host cache.nixos.org
            }
          }

          # Fallback for other requests
          handle {
            # We omit the `cache` directive here so Caddy doesn't interfere
            # with Attic's API operations or package pushing (PUT/POST requests).
            reverse_proxy 127.0.0.1:8081
          }
        '';
      };
    };
  };
};
```

## Setting up a binary cache with nix-serve and nginx

This tutorial explains how to setup a machine as a binary cache for other machines, serving the nix store on TCP port 80 with signing turned on. It assumes that an service is already running, that port 80 is open,[^1] and that the hostname resolves to the server.[^2]

### 1. Generating a signing key

Follow the generation process at <a href="Signing_store_paths#Signing_Key" class="wikilink" title="Signing store paths#Signing Key">Signing store paths#Signing Key</a>, replacing the example hostname with your own. In this tutorial, signs packages on the fly when it serves them so any <a href="Nix_(package_manager)" class="wikilink" title="Nix">Nix</a> configuration isn't required.

### 2. Activating 

is the service that serves the binary cache protocol via HTTP.

To start it on NixOS:

``` nix
services.nix-serve = {
  enable = true;

  # Note: You don't need to give nix-serve ownership of the file because systemd reads it.
  secretKeyFile = "/var/secrets/nix-cache-priv-key";
};
```

To start it on a non-NixOS machine at boot, add to :

    NIX_SECRET_KEY_FILE=/var/secrets/nix-cache-priv-key
    @reboot /home/USER/.nix-profile/bin/nix-serve --listen :5000 --error-log /var/log/nix-serve.log --pid /var/run/nix-serve.pid --user USER --daemonize

will by default serve on port 5000. We are not going to open a firewall port for it, because we will let redirect to it.

### 3. Creating a virtual hostname in 

We redirect the HTTP(s) traffic from port 80 to . As is capable of serving only on IPv4, redirecting is also useful to make the binary cache available on IPv6.

``` nix
services.nginx = {
  enable = true;
  recommendedProxySettings = true;
  virtualHosts = {
    # ... existing hosts config etc. ...
    "binarycache.example.com" = {
      locations."/".proxyPass = "http://${config.services.nix-serve.bindAddress}:${toString config.services.nix-serve.port}";
    };
  };
};
```

Add HTTPS settings to this config if possible.[^3] This tutorial will simply continue with insecure HTTP.

To set up Nginx on a non-NixOS machine, create for example :

``` nginx
server {
    listen      80 default_server;
    listen      [::]:80 default_server;
            
    location / {
        proxy_pass  http://127.0.0.1:5000;
    }
}
```

### 4. Testing

To apply the previous settings to your NixOS machine, run:

``` shell-session
# nixos-rebuild switch
```

Check the general availability:

``` shell-session
$ curl http://binarycache.example.com/nix-cache-info
StoreDir: /nix/store
WantMassQuery: 1
Priority: 30
```

On the binary cache server, build some package:

``` shell-session
$ nix-build '<nixpkgs>' -A pkgs.hello
/nix/store/gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10
```

To verify the signing on the fly, make sure the following request contains a line:

``` shell-session
$ curl http://binarycache.example.com/gdh8165b7rg4y53v64chjys7mbbw89f9.narinfo
StorePath: /nix/store/gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10
URL: nar/gdh8165b7rg4y53v64chjys7mbbw89f9.nar
Compression: none
NarHash: sha256:0mkfk4iad66xkld3b7x34n9kxri9lrpkgk8m17p97alacx54h5c7
NarSize: 205920
References: 6yaj6n8l925xxfbcd65gzqx3dz7idrnn-glibc-2.27 gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10
Deriver: r6h5b3wy0kwx38rn6s6qmmfq0svcnf86-hello-2.10.drv
Sig: binarycache.example.com:EmAANryZ1FFHGmz5P+HXLSDbc0KckkBEAkHsht7gEIOUXZk9yhhZSBV+eSX9Kj+db/b36qmYmffgiOZbAe21Ag==
```

Next, with the public key that was generated to , setup a client machine to use the binary cache, and see if Nix successfully fetches the cached package.

## Using a binary cache

To configure Nix to use a certain binary cache, refer to the Nix manual.[^4] Add the binary cache as substituter (see the option ) and the public key to the trusted keys (see ).

Permanent use of binary cache:

``` nix
# /etc/nixos/configuration.nix

  nix = {
    settings = {
      substituters = [
        "http://binarycache.example.com"
        "https://nix-community.cachix.org"
        "https://cache.nixos.org/"
      ];
      trusted-public-keys = [
        "binarycache.example.com-1:dsafdafDFW123fdasfa123124FADSAD"
        "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
      ];
    };
  };
```

As described on [search.nixos.org](https://search.nixos.org/options?show=nix.settings.substituters&type=packages&query=substituters) by default https://cache.nixos.org/ is added to the substituters. You may need to use lib.mkForce to override this and ensure your substituter is the primary choice.

``` nix
# /etc/nixos/configuration.nix


{ config, lib, pkgs, ... }:

{
  nix = {
    settings = {
      substituters = lib.mkForce [
        "http://binarycache.example.com"
      ];
      trusted-public-keys = [
        "binarycache.example.com-1:dsafdafDFW123fdasfa123124FADSAD"
      ];
    };
  };
}
```

Temporary use of binary cache:

``` bash
$ nix-store -r /nix/store/gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10 --option substituters http://binarycache.example.com --option trusted-public-keys binarycache.example.com:dsafdafDFW123fdasfa123124FADSAD
these paths will be fetched (0.00 MiB download, 24.04 MiB unpacked):
  /nix/store/7gx4kiv5m0i7d7qkixq2cwzbr10lvxwc-glibc-2.27
  /nix/store/gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10
copying path '/nix/store/7gx4kiv5m0i7d7qkixq2cwzbr10lvxwc-glibc-2.27' from 'http://binarycache.example.com'...
copying path '/nix/store/gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10' from 'http://binarycache.example.com'...
warning: you did not specify '--add-root'; the result might be removed by the garbage collector
/nix/store/gdh8165b7rg4y53v64chjys7mbbw89f9-hello-2.10
```

### Using a binary cache on non-NixOS installations

To use a binary cache with a Nix that has been installed on an operating system other than NixOS (e.g. Ubuntu or macOS) will need to be edited manually. This can be done by adding something similar to the following lines to :

    trusted-public-keys = nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs= cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY=
    trusted-substituters = https://nix-community.cachix.org https://cache.nixos.org
    trusted-users = root @wheel

Note that not all of that information is needed, see the manual for the respective options ([trusted-public-keys](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-trusted-public-keys), [trusted-substituters](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-trusted-substituters), [trusted-users](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-trusted-users)).

With the options set correctly, a user can benefit permanently from a substituter by add the following to their

    substituters = https://nix-community.cachix.org https://cache.nixos.org

or temporarily as explained above.

### Binary cache hint in Flakes

You can place a hint to your binary cache in your Flake so when someone builds an output of your Flake, the nix command will ask interactively to trust the specified binary cache.

``` nix
{
  nixConfig = {
    extra-substituters = [
      "https://colmena.cachix.org"
    ];
    extra-trusted-public-keys = [
      "colmena.cachix.org-1:7BzpDnjjH8ki2CT3f6GdOk7QAzPOl+1t3LvTLXqYcSg="
    ];
  };
  outputs = { ... }: {
    ...
  };
}
```

### Binary cache priority

Each binary cache has a priority field. A lower number indicates a higher priority.

``` shell-session

$curl https://cache.nixos.org/nix-cache-info
StoreDir: /nix/store
WantMassQuery: 1
Priority: 40
```

You may want to override this value by appending `?priority=n` at the end of the cache url.

``` nix
substituters = https://nix-community.cachix.org?priority=1 https://cache.nixos.org?priority=2
```

## Populating a binary cache

As the cache is served from the nix store of the machine serving the binary cache, one option is to build the packages directly on that machine.

Another option is to build the packages on a separate machine and push them only when all the checks pass using :

``` bash
$ nix copy --to ssh://binarycache.example.com PACKAGE
```

For details see the [Sharing Packages Between Machines](https://nixos.org/manual/nix/stable/package-management/sharing-packages.html) in the Nix manual.

## Signing Existing Packages

It is also possible to sign all the packages that already exist in the nix store of the machine serving the binary cache to make them immediately available.

`$ nix store sign --extra-experimental-features nix-command --all --key-file /var/cache-priv-key.pem`

Note : As of NixOS 24.11 is required for if this is not in your configuration.nix.

## Hosted binary cache

<https://cachix.org> provides hosted binary caches starting with a free plan for public caches.

## How to check if content is on a binary cache

We can use **curl** to check if a binary cache contains a given derivation. *curl <https://cache/store_hash.narinfo>*

``` bash
$ curl https://fzakaria.cachix.org/949dxjmz632id67hjic04x6f3ljldzxh.narinfo

StorePath: /nix/store/949dxjmz632id67hjic04x6f3ljldzxh-mvn2nix-0.1
URL: nar/4026897ef85219b5b697c1c4ef30d50275423857cb7a81e138c4b1025f550935.nar.xz
Compression: xz
FileHash: sha256:4026897ef85219b5b697c1c4ef30d50275423857cb7a81e138c4b1025f550935
FileSize: 24392
NarHash: sha256:0kk3d8rk82ynqwg8isk83hvq8vszh4354fqg4hhaz40kd49rmm9n
NarSize: 29208
References: 2hhmmj0vbb5d181nfx2mx3p7k54q44ij-apache-maven-3.6.3 6737cq9nvp4k5r70qcgf61004r0l2g3v-bash-4.4-p23 949dxjmz632id67hjic04x6f3ljldzxh-mvn2nix-0.1 hrlxlk768vy5rgl6hc4xiba6gxg6s0yz-mvn2nix-0.1-dependencies qybd7j6v7kb7yhizc7gklgg3lyrxf38y-openjdk-headless-11.0.8+10
Deriver: 585w6p8rclbvz97fwgixvfgnh5493ia2-mvn2nix-0.1.drv
Sig: fzakaria.cachix.org-1:MkOrZCa9qdxHFdE2mtFRsbEzmLUgWGgSrqD3advKfdHLW+SKxj/V2n6+4a/qy6dhCoR+gWQfGzda/jNkER10CQ==
```

Or use *nix path-info*:

``` bash
$ nix path-info -r /nix/store/sb7nbfcc1ca6j0d0v18f7qzwlsyvi8fz-ocaml-4.10.0 --store https://cache.nixos.org/
[0.0 MiB DL] querying libunistring-0.9.10 on https://cache.nixos.org/nix/store/0gc9dr71ldp79cla2qbl3kwdd4ig46pi-linux-headers-5.5
/nix/store/2jysm3dfsgby5sw5jgj43qjrb5v79ms9-bash-4.4-p23
/nix/store/4wy9j24psf9ny4di3anjs7yk2fvfb0gq-glibc-2.31-dev
/nix/store/4z79ipgxqn80ns7mpax25zmb77i3ndfw-gawk-5.1.0
/nix/store/9df65igwjmf2wbw0gbrrgair6piqjgmi-glibc-2.31
/nix/store/czc3c1apx55s37qx4vadqhn3fhikchxi-libunistring-0.9.10
/nix/store/fgn3sih5vi7543jcw389a7qqax8nwkhz-glibc-2.31-bin
/nix/store/sb7nbfcc1ca6j0d0v18f7qzwlsyvi8fz-ocaml-4.10.0
/nix/store/xim9l8hym4iga6d4azam4m0k0p1nw2rm-libidn2-2.3.0
```

Example: Fetch metadata of `bash`

    curl https://cache.nixos.org/$(readlink -f $(which bash) | cut -c12-43).narinfo

## Command Line Options

It is also possible to pass and on the command line if they are not in or you want to use a particular binary cache server.

`$ nix-build --option substituters "http://binarycache.example.com" --option trusted-public-keys "binarycache.example.com-1:dsafdafDFW123fdasfa123124FADSAD" '`<nixpkgs>`' -A pkgs.PACKAGE`

`$ nixos-rebuild --option substituters "http://binarycache.example.com" --option trusted-public-keys "binarycache.example.com-1:dsafdafDFW123fdasfa123124FADSAD" switch`

To do an offline install (providing your binary cache contains all the packages required);

`$ nixos-install --option substituters "http://binarycache.example.com" --option trusted-public-keys "binarycache.example.com-1:dsafdafDFW123fdasfa123124FADSAD"`

## See also

<references group="cf."/>

- [How to use binary cache in NixOS](https://discourse.nixos.org/t/how-to-use-binary-cache-in-nixos/5202/4)

<!-- -->

- [attic: Multi-tenant Nix Binary Cache](https://github.com/zhaofengli/attic)

<!-- -->

- [Nix Binary Cache for MacOS/Nix-Darwin with Attic](https://discourse.nixos.org/t/nix-binary-cache-for-macos-nix-darwin-with-attic/40118)

[^1]: 

[^2]:

[^3]:

[^4]: [Nix Manual, 21. Files](https://nixos.org/nix/manual/#ch-files)
