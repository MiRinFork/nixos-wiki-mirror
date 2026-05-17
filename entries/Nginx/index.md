<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nginx -->

[](https://nginx.org/) (<a href="wikipedia:en:{{PAGENAME}}" class="wikilink" title="wikipedia:en:{{PAGENAME}}">wikipedia:en:{{PAGENAME}}</a>) is a lightweight webserver.

## Installation

To install Nginx, add the following to your NixOS configuration: More options are available:

## Sample setups

#### Minimal raw html dummy page for testing `configuration.nix`

``` nix
services.nginx = {
  enable = true;
  virtualHosts.localhost = {
    locations."/" = {
      return = "200 '<html><body>It works</body></html>'";
      extraConfig = ''
        default_type text/html;
      '';
    };
  };
};
```

#### Static blog with ssl enforced in `configuration.nix`

``` nix
services.nginx = {
  enable = true;
  virtualHosts."blog.example.com" = {
    enableACME = true;
    forceSSL = true;
    root = "/var/www/blog";
  };
};

networking.firewall.allowedTCPPorts = [ 80 443 ];

security.acme = {
  # Accept the CA’s terms of service. The default provider is Let’s Encrypt, you can find their ToS at https://letsencrypt.org/repository/. 
  acceptTerms = true;
  # Optional: You can configure the email address used with Let's Encrypt.
  # This way you get renewal reminders (automated by NixOS) as well as expiration emails.
  defaults.email = "youremail@address.com";
};
```

#### LEMP stack

(Nginx/MySQL/PHP) in `configuration.nix`

``` nix
{ config, ...}: {
services.nginx = {
  enable = true;
  virtualHosts."blog.example.com" = {
    enableACME = true;
    forceSSL = true;
    root = "/var/www/blog";
    locations."~ \\.php$".extraConfig = ''
      fastcgi_pass  unix:${config.services.phpfpm.pools.mypool.socket};
      fastcgi_index index.php;
    '';
  };
};
services.mysql = {
  enable = true;
  package = pkgs.mariadb;
};
services.phpfpm.pools.mypool = {                                                                                                                                                                                                             
  user = "nobody";                                                                                                                                                                                                                           
  settings = {                                                                                                                                                                                                                               
    "pm" = "dynamic";            
    "listen.owner" = config.services.nginx.user;                                                                                                                                                                                                              
    "pm.max_children" = 5;                                                                                                                                                                                                                   
    "pm.start_servers" = 2;                                                                                                                                                                                                                  
    "pm.min_spare_servers" = 1;                                                                                                                                                                                                              
    "pm.max_spare_servers" = 3;                                                                                                                                                                                                              
    "pm.max_requests" = 500;                                                                                                                                                                                                                 
  };                                                                                                                                                                                                                                         
};
```

**Robots.txt**

If you want to set a robots.txt for your domain (or any subdomains), add this:

``` nix
locations."/robots.txt" = {
  extraConfig = ''
    rewrite ^/(.*)  $1;
    return 200 "User-agent: *\nDisallow: /";
  '';
};
```

#### HTTP Authentication

##### Basic Authentication

Nginx can require users to login using HTTP Basic Authentication. In NixOS, this is set using the \`basicAuth\` option:

``` nix
services.nginx = {
    virtualHosts."example.com" =  {
      basicAuth = { user = "password"; anotherUser = "..."; };
      ...
    };
};
```

##### Authentication via PAM

It is also possible to authenticate system users, e.g. users in the /etc/passwd file, by using the PAM module.

``` nix

  security.pam.services.nginx.setEnvironment = false;
  systemd.services.nginx.serviceConfig = {
    SupplementaryGroups = [ "shadow" ];
  };

  services.nginx = {
    enable = true;
    additionalModules = [ pkgs.nginxModules.pam ];
    ...
    virtualHosts."example.com".extraConfig = ''
      auth_pam  "Password Required";
      auth_pam_service_name "nginx";
    '';
    ...
    };
  };
```

#### TLS reverse proxy

This is a "minimal" example in terms of security, see below for more tips.

``` nix
services.nginx = {
    enable = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;
    # other Nginx options
    virtualHosts."example.com" =  {
      enableACME = true;
      forceSSL = true;
      locations."/" = {
        proxyPass = "http://127.0.0.1:12345";
        proxyWebsockets = true; # needed if you need to use WebSocket
        extraConfig =
          # required when the target is also TLS server with multiple hosts
          "proxy_ssl_server_name on;" +
          # required when the server wants to use HTTP Authentication
          "proxy_pass_header Authorization;"
          ;
      };
    };
};
```

#### Hardened setup with TLS and HSTS preloading

For testing your TLS configuration, you might want to visit [1](https://www.ssllabs.com/ssltest/index.html). If you configured preloading and want to apply for being included in the preloading list, check out [2](https://hstspreload.org/). Please read enough about preloading to understand the consequences, as it takes some effort to be removed from the list.

``` nix
services.nginx = {
    enable = true;

    # Use recommended settings
    recommendedGzipSettings = true;
    recommendedOptimisation = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;

    # Only allow PFS-enabled ciphers with AES256
    sslCiphers = "AES256+EECDH:AES256+EDH:!aNULL";
    
    appendHttpConfig = ''
      # Add HSTS header with preloading to HTTPS requests.
      # Adding this header to HTTP requests is discouraged
      map $scheme $hsts_header {
          https   "max-age=31536000; includeSubdomains; preload";
      }
      add_header Strict-Transport-Security $hsts_header;

      # Enable CSP for your services.
      #add_header Content-Security-Policy "script-src 'self'; object-src 'none'; base-uri 'none';" always;

      # Minimize information leaked to other domains
      add_header 'Referrer-Policy' 'origin-when-cross-origin';

      # Disable embedding as a frame
      add_header X-Frame-Options DENY;

      # Prevent injection of code in other mime types (XSS Attacks)
      add_header X-Content-Type-Options nosniff;

      # This might create errors
      proxy_cookie_path / "/; secure; HttpOnly; SameSite=strict";
    '';

    # Add any further config to match your needs, e.g.:
    virtualHosts = let
      base = locations: {
        inherit locations;

        forceSSL = true;
        enableACME = true;
      };
      proxy = port: base {
        "/".proxyPass = "http://127.0.0.1:" + toString(port) + "/";
      };
    in {
      # Define example.com as reverse-proxied service on 127.0.0.1:3000
      "example.com" = proxy 3000 // { default = true; };
    };
};
```

#### Using realIP when behind CloudFlare or other CDN

When Nginx is behind another proxy it won't know the true IP address of clients hitting it. It will then pass down those the proxy's IP address instead of the client IP address. By using the nginx realip module, we can ensure nginx knows the real client IP, and we can further inform nginx to only trust the HTTP header from valid upstream proxies.

In the following example, we are fetching the list of IPs directly from cloudflare and including a hash. This has some pros and cons. Nix will not attempt to download or update that file while it is in a nix store it trusts, but after a nix garbage collection, it will error if the list of proxies has changed informing you of that when you apply the config.

``` nix
  services.nginx.commonHttpConfig =
    let
      realIpsFromList = lib.strings.concatMapStringsSep "\n" (x: "set_real_ip_from  ${x};");
      fileToList = x: lib.strings.splitString "\n" (builtins.readFile x);
      cfipv4 = fileToList (pkgs.fetchurl {
        url = "https://www.cloudflare.com/ips-v4";
        sha256 = "0ywy9sg7spafi3gm9q5wb59lbiq0swvf0q3iazl0maq1pj1nsb7h";
      });
      cfipv6 = fileToList (pkgs.fetchurl {
        url = "https://www.cloudflare.com/ips-v6";
        sha256 = "1ad09hijignj6zlqvdjxv7rjj8567z357zfavv201b9vx3ikk7cy";
      });
    in
    ''
      ${realIpsFromList cfipv4}
      ${realIpsFromList cfipv6}
      real_ip_header CF-Connecting-IP;
    '';
```

#### UNIX socket reverse proxy

In order for nginx to be able to access UNIX sockets, you have to do some permission modifications.

``` nix
# Example service that supports listening to UNIX sockets
services.hedgedoc = {
  enable = true;
  settings.path = "/run/hedgedoc/hedgedoc.sock"
};

services.nginx = {
  enable = true;
  virtualHosts."example.com" = {
    enableACME = true;
    forceSSL = true;
    locations."/".proxyPass = "http://unix:/run/hedgedoc/hedgedoc.sock";
  };
};

# This is needed for nginx to be able to read other processes
# directories in `/run`. Else it will fail with (13: Permission denied)
systemd.services.nginx.serviceConfig.ProtectHome = false;

# Most services will create sockets with 660 permissions.
# This means you have to add nginx to their group.
users.groups.hedgedoc.members = [ "nginx" ];

# Alternatively, you can try to force the unit to create the socket with
# different permissions, if you have a reason for not wanting to add nginx
# to their group. This might not work, depending on how the program sets
# its permissions for the socket.
systemd.services.hedgedoc.serviceConfig.UMask = "0000";
```

## Modules

Nginx can be run with optional modules. You can add them like this:

`  services.nginx.package = (pkgs.nginx.override { modules = [ `  
`    pkgs.nginxModules.dav`  
`    pkgs.nginxModules.lua`  
`    ...`  
`  ]; });`

See [this](https://github.com/NixOS/nixpkgs/blob/master/pkgs/servers/http/nginx/modules.nix#L69) for a more comprehensive list of modules available via configuration.

## Let's Encrypt certificates

The nginx module for NixOS has native support for Let's Encrypt certificates; . The  explains it in detail.

### Minimal Internet Exposed Server Example

Assuming that `myhost.org` resolves to the IP address of your host and port 80 and 443 have been opened.

``` nix
services.nginx.enable = true;
services.nginx.virtualHosts."myhost.org" = {
    addSSL = true;
    enableACME = true;
    root = "/var/www/myhost.org";
};
security.acme = {
  acceptTerms = true;
  defaults.email = "foo@bar.com";
};
```

This will set up nginx to serve files for `myhost.org`, automatically request an ACME SSL Certificate using a "**HTTP-01**" challenge (meaning your server must be exposed to the internet) and will configure systemd timers to renew the certificate if required.

### Minimal Private Local LAN Server Example

We can also have a private server running in our local network (including VPN), that isn't reachable from the internet, but that still can get valid Let's Encrypt certificates that are accepted in a browser.

1\. We have to **modify DNS such that our domain** like `myhost.org` **resolves to the local IP address of our private server** and port 80 and 443 have been opened. [See this video tutorial](https://www.youtube.com/watch?v=qlcVx-k-02E) for an example on how to do that. Hint: You might need to **add an exception to your router** (definitely on Fritzboxes), because resolving to local IP address is usually blocked to prevent **"DNS rebind attacks"**.

2\. We have to setup the Let's Encrypt NixOS ACME services such that it uses an **API token in a secrets file** ([secrets for a server can be conveniently and securely deployed in NixOS with agenix](https://github.com/ryantm/agenix); just follow the tutorial) against our DNS provider to **prove from our server that we own the domain**. This way our server doesn't need to be exposed and reachable from the internet. NixOS ACME uses the [LEGO library](https://go-acme.github.io/lego/) to communicate to DNS providers (it supports a lot) and therefore we have to provide the token(s) in that library's secrets file format.

In the example we use Hetzner as our "dnsProvider" that only needs a single API token environment in our secrets file:

``` nix
HETZNER_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Other [DNS providers need like OVH](https://carjorvaz.com/posts/setting-up-wildcard-lets-encrypt-certificates-on-nixos/) require more environment variables.

See the section "**Credentials**" on what you have to specify in the secrets file: <https://go-acme.github.io/lego/dns/hetzner/>

See Hetzner guide on how to get an API token for its "DNS console": <https://docs.hetzner.com/dns-console/dns/general/api-access-token/>

3\. Point our virtualHost to the ACME entry.

``` nix
{
  services.nginx = {
    enable = true;
    # we can use the main domain or any subdomain that's mentioned by 
    # "extraDomainNames" in the acme certificate.
    virtualHosts."subdomain.example.org" = {
      # 3. Instead of "enableACME = true;" we
      # reuse the certificate from "security.acme.certs."example.org"
      # down below
      useACMEHost = "example.org";
      forceSSL = true;
      locations."/" = {
        return = "200 '<html><body>It works</body></html>'";
        extraConfig = ''
          default_type text/html;
        '';
      };
    };
  };

  security.acme.acceptTerms = true;
  security.acme.defaults.email = "info@example.org";

  # 2. Let NixOS generate a Let's Encrypt certificate that we can reuse
  # above for several virtualhosts above.
  security.acme.certs."example.org" = {
    domain = "example.org";
    extraDomainNames = [ "subdomain.example.org" ];
    # The LEGO DNS provider name. Depending on the provider, need different
    # contents in the credentialsFile below.
    dnsProvider = "hetzner";
    dnsPropagationCheck = true;
    # agenix will decrypt our secrets file (below) on the server and make it available
    # under /run/agenix/secrets/hetzner-dns-token (by default):
    # credentialsFile = "/run/agenix/secrets/hetzner-dns-token";
    credentialsFile = config.age.secrets."hetzner-dns-token.age".path;
  };
  
  # Let agenix know about and copy our (encrypted) DNS API token secrets file
  # (containing "HETZNER_API_KEY=...") to the server an decrypt it there.
  # Follow the agenix tutorial on how to encrypt a secrets file
  # to a .age file and how to setup your Nix flake to use it.
  age.secrets."hetzner-dns-token.age".file = .../hetzner-dns-token.age;

  users.users.nginx.extraGroups = [ "acme" ];
}
```

This will set up nginx to serve files for example.org, automatically request an ACME SSL Certificate using a "DNS-01" challenge (meaning **your server doesn't need to be exposed to the internet**, which is great for self-hosting) and will configure systemd timers to renew the certificate if required.

## Troubleshooting

### Read-only Filesystem for nginx upgrade to 20.09

With the upgrade to nixos-20.09 the nginx comes with extra hardening parameters, most prominently the restriction of write access to the Operating System Disk. When you see errors like `[emerg] open() "/var/spool/nginx/logs/binaergewitter.access.log" failed (30: Read-only file system)` you can add extra paths to nginx service like this:

``` nix
  systemd.services.nginx.serviceConfig.ReadWritePaths = [ "/var/spool/nginx/logs/" ];
```

### SIGTERM received from 1

If you turn debug logging on:

    services.nginx.logError = "stderr debug";

You may see this:

    [notice] 12383#12383: signal 15 (SIGTERM) received from 1, exiting

This means systemd is killing nginx for you, but systemd (in nixOS 20.09) isn't nice enough to tell you why it's happening. Chances are it's because your nginx config has daemon mode turned on, turn off daemon mode in your nginx config like so:

    daemon off;

And it should fix nginx so systemd won't go killing your nginx anymore.

### Escape special chars in Regular Expressions

Some nginx configuration options like `locations` allows the use of Regular Expressions. Be ware that you [need to escape some special chars](https://nixos.org/manual/nix/stable/language/values.html#type-string) like `\`, if provided by a double quoted `" "` string.

A common example found on the internet is:

``` nix
locations."~ ^(.+\.php)(.*)$"  = {
    ...
};
```

But in this case the `\.php` part will be parsed by Nix to `.php`. In RegEx the dot represents any character instead of the dot character itself. Thus the path /gly**php**ro.css will be matched, too. Additionaly to the intended match of `/somephpfile.php?param=value`.

To circumvent this error `\.php` has to be double escaped as `\\.php`

``` nix
locations."~ ^(.+\\.php)(.*)$"  = {
    ...
};
```

### General

Nginx is run as the systemd service nginx, so `systemctl status nginx` may say something useful. If you have a problem with configuration, you can find the configuration location in the `systemctl status`, it should be at `/nix/store/*-nginx.conf`.

## Replace dependencies like openssl

In wake of the 2022 OpenSSL library, Nix can support in mitigating the library by downgrading (or replacing) the SSL library. For this, the <a href="Overlay" class="wikilink" title="overlay">overlay</a> facility of nixpkgs can be used:

``` nix
nixpkgs.overlays = [ 
   (final: super: { 
        nginxStable = super.nginxStable.override { openssl = super.pkgs.libressl; }; 
    } ) 
];
```

When utilizing NixOS options the following configuration will also work:

``` nix
services.nginx.package = pkgs.nginxStable.override { openssl = pkgs.libressl; };
```

## Extra config

Apart native options, Nix allows to specify verbatim Nginx configuration. Some options are mutually exclusive.

Below table assumes "services.nginx." prefix for all options. These options allows to keep using Nix configuration file while taking advantage of Nginx features which are not representend in options.

| Options | Block | Behaviour |
|----|----|----|
| config | nginx.conf | Verbatim `nginx.conf` configuration |
| appendConfig | nginx.conf | Lines appended to the generated Nginx configuration file |
| httpConfig | http block | exclusive with the structured configuration via virtualHosts |
| appendHttpConfig | http block | lines appended. exclusive with using config and httpConfig |
| virtualHosts.<name>.extraConfig | server | These lines go to the end of the vhost verbatim. |
| virtualHosts.<name>.locations.<name>.extraConfig | server | These lines go to the end of the location verbatim |

## See more

- [Official Documentation](http://nginx.org/en/docs/)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
