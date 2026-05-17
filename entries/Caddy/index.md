<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Caddy -->

[Caddy](https://caddyserver.com/) is an efficient, HTTP/2 and HTTP/3 capable web server that can serve static and dynamic web pages. It can also be a reverse proxy to serve multiple web services under one server. Its main features are its simple config setup and automatic HTTPS: It will automatically request and renew a LetsEncrypt certificate so that users of your service get a Browser-trusted and secure connection.

## Setup

To try out Caddy add the following minimal example to your <a href="NixOS_modules" class="wikilink" title=" NixOS module"> NixOS module</a>:

``` nix
services.caddy = {
  enable = true;
  virtualHosts."localhost".extraConfig = ''
    tls internal
    respond "Hello, world!"
  '';
};
```

This snippet will let Caddy respond on [`http://localhost`](http://localhost) and [`https://localhost`](https://localhost) with a dummy text "Hello world!". When no port is mentioned on virtualhost like just `localhost` instead of `localhost:8080`, Caddy listens on `80` and `443` by default and redirects requests from port 80 (unsecured) to 443 (secured).

Use `curl -iLk localhost` to verify the configuration.

For SSL to work, just supply a public domain and ensure HTTP and HTTPS ports are accessible. Caddy will automatically configure TLS:

``` nix
services.caddy = {
  enable = true;
  virtualHosts."example.org".extraConfig = ''
    respond "Hello, world!"
  '';
}; 

networking.firewall.allowedTCPPorts = [ 80 443 ];
```

## Configuration

### Reverse proxy

The following snippet creates a reverse proxy for the domain `example.org`, redirecting all requests to `http://10.25.40.6`

``` nix
services.caddy = {
  enable = true;
  virtualHosts."example.org".extraConfig = ''
    reverse_proxy http://10.25.40.6
  '';
  virtualHosts."another.example.org".extraConfig = ''
    reverse_proxy unix//run/gunicorn.sock
  '';
};
```

In case you would like to forward the real client IP of the request to the backend, add following headers

``` nix
services.caddy = {
  virtualHosts."example.org".extraConfig = ''
    reverse_proxy http://10.25.40.6 {
      header_down X-Real-IP {http.request.remote}
      header_down X-Forwarded-For {http.request.remote}
    }
  '';
};
```

Fur further reverse proxy configuration, see [upstream documentation](https://caddyserver.com/docs/quick-starts/reverse-proxy).

### Redirect

Permanent redirect of `example.org` and `old.example.org` to `www.example.org`

``` nix
services.caddy = {
  enable = true;
  virtualHosts."example.org" = {
    extraConfig = ''
      redir https://www.example.org{uri} permanent
   '';
    serverAliases = [ "old.example.org" ];
};
```

### PHP FastCGI

Serving a PHP application in `/var/www` on <http://localhost> .

``` nix
services.caddy = {
  enable = true;
  virtualHosts."http://localhost" = {
    extraConfig = ''
      root    * /var/www
      file_server
      php_fastcgi unix/var/run/phpfpm/localhost.sock
    '';
  };
};
```

You'll need a <a href="Phpfpm" class="wikilink" title="PHP-FPM">PHP-FPM</a> socket listening on Unix socket path `/var/run/phpfpm/localhost.sock`.

### PHP support using FrankenPHP plugin

Instead of Caddy, the FrankenPHP package can be defined as drop-in replacement for the Caddy-service which will allow serving PHP applications without additional external process managers. In case you want to use FrankenPHP as an additional Caddy plugin, you can try this modifications

``` nix
nixpkgs.overlays = [
  (self: super: {
    phpWithEmbed = super.php.override {
      embedSupport = true;
      ztsSupport = true;
      staticSupport = super.stdenv.hostPlatform.isDarwin;
      zendSignalsSupport = false;
      zendMaxExecutionTimersSupport = super.stdenv.hostPlatform.isLinux;
    };
    caddy = super.caddy.overrideAttrs (oldAttrs: {
      buildInputs =
        (oldAttrs.buildInputs or [ ])
        ++ [
          self.watcher
          self.phpWithEmbed.unwrapped
          self.brotli
        ]
        ++ self.phpWithEmbed.unwrapped.buildInputs;
      preBuild = ''
        export CGO_CFLAGS="$(${self.phpWithEmbed.unwrapped.dev}/bin/php-config --includes)"
        export CGO_LDFLAGS="-DFRANKENPHP_VERSION=${self.frankenphp.version} \
          $(${self.phpWithEmbed.unwrapped.dev}/bin/php-config --ldflags) \
          $(${self.phpWithEmbed.unwrapped.dev}/bin/php-config --libs)"
      '';
    });
  })
];

services.caddy = {
  enable = true;
  package = pkgs.caddy.withPlugins {
    plugins = [
      "github.com/dunglas/frankenphp/caddy@v1.12.1"
    ];
    hash = "sha256-WWUg717C7VcW7hNDpyoMdNE37JXgyvEU0vmMtZQXFSY=";
  };
  virtualHosts."localhost".extraConfig = ''
    tls internal
    respond "Hello, world!"
  '';
};
```

### Plug-ins

Following example is adding the plugin powerdns in version 1.0.1 to your Caddy binary

``` nix
services.caddy = {
  enable = true;
  package = pkgs.caddy.withPlugins {
    plugins = [ "github.com/caddy-dns/powerdns@v1.0.1" ];
    hash = "sha256-F/jqR4iEsklJFycTjSaW8B/V3iTGqqGOzwYBUXxRKrc=";
  };
};
```

Get the correct hash by leaving the string empty at first and after rebuild, insert the hash which the build process calculated.

In case a plugin has no version tag, you'll have to query it first. In this example we'll do this for the plugin caddy-webdav

``` sh
$ go mod init temp
$ go get github.com/mholt/caddy-webdav
$ grep 'caddy-webdav' go.mod
        github.com/mholt/caddy-webdav v0.0.0-20241008162340-42168ba04c9d // indirect
```

Add this version string to your final config

``` nix
services.caddy = {
  enable = true;
  package = pkgs.caddy.withPlugins {
    plugins = [ "github.com/caddy-dns/caddy-webdav@v0.0.0-20241008162340-42168ba04c9d" ];
    hash = "sha256-F/jqR4iEsklJFycTjSaW8B/V3iTGqqGOzwYBUXxRKrc=";
  };
};
```

### uWSGI apps

Serving uWSGI apps with Caddy also requires a plugin, in this example we'll use [caddy-uwsgi-transport](https://github.com/wxh06/caddy-uwsgi-transport). See section above on how to fetch and update plugins.

``` nix
services.caddy = {
  package = pkgs.caddy.withPlugins {
    plugins = [ "github.com/BadAimWeeb/caddy-uwsgi-transport@v0.0.0-20240317192154-74a1008b9763" ];
    hash = "sha256-aEdletYtVFnQMlWL6YW4gUgrrTBatoCIuugA/yvMGmI=";
  };
  virtualHosts = {
    "myapp.example.org" = {
      extraConfig = ''
        reverse_proxy unix/${config.services.uwsgi.runDir}/myapp.sock {
          transport uwsgi
        }
      '';
  };
};
```

This example will serve a <a href="uWSGI" class="wikilink" title="uWSGI">uWSGI</a> app, provided by a unix socket file, on the host `myapp.example.org`.

### Caching

Caching can be enabled by adding the official [cache-handler plugin](https://github.com/caddyserver/cache-handler). Note that the corresponding hash and upstream version can change.

``` nix
services.caddy = {
  package = pkgs.caddy.withPlugins {
    plugins = [ "github.com/caddyserver/cache-handler@v0.16.0" ];
    hash = "sha256-XTFwYo3o7il3UfnE2QuJM+UoGTu0Yw+8ka0p9czdgEM=";
  };
  globalConfig = ''
    cache
  '';
  virtualHosts = {
    "example.org" = {
      extraConfig = ''
        cache
        reverse_proxy your-app:8080
      '';
  };
};
```

If you need to add caching to an existing virtual host entry, which was created by a module, you can prepend it by using `lib.mkBefore`

``` nix
services.caddy = {
  [...]
  virtualHosts."dokuwiki.example.org".extraConfig = lib.mkBefore ''
    cache {
      ttl 30m
      stale 1h
    ]
  '';
};
```

See [upstream documentation](https://github.com/caddyserver/cache-handler) for further configuration options.

### Passing environment variable secrets/configuring acme_dns

To prevent any secrets from being put in the nix store (any NixOS setting that writes a config in the Nix store will expose any secret in it), you can use the following setting

``` nixos
services.caddy = {
  enable = true;
  globalConfig = ''    
    acme_dns PROVIDER {
      api_key {$APIKEY}
      api_secret_key {$APISECRETKEY}
    }
  '';
};
systemd.services.caddy.serviceConfig.EnvironmentFile = ["/path/to/envfile"];
```

And then at **/path/to/envfile**:

    APIKEY=YOURKEY
    APISECRETKEY=OTHERKEY

## Troubleshooting

### Check used ports

To check if Caddy is running and listening as configured you can run `ss`:

``` console
$ sudo ss --listening --no-queues --numeric --processes --tcp --udp | grep 'Process\|caddy'
Netid State       Local Address:Port  Peer Address:Port Process
tcp   LISTEN          127.0.0.1:2019       0.0.0.0:*    users:(("caddy",pid=1000,fd=10))
tcp   LISTEN                  *:80               *:*    users:(("caddy",pid=1000,fd=11))
tcp   LISTEN                  *:443              *:*    users:(("caddy",pid=1000,fd=12))
udp   UNCONN                  *:443              *:*    users:(("caddy",pid=1000,fd=13))
```

The tcp (ipv4) socket port 2019 is Caddy's management endpoint, for when you want manage its config via web REST calls instead of Nix (ignore). The tcp6 (an ipv6 socket that also listens on ipv4) socket on port 80 (HTTP) and 443 (HTTPS) indicate that our virtualhost config was used.

### Virtualhost and real host not identical

When you connect to Caddy must ensure that the "Host" header matches the virtualhost entry of Caddy. For example, when testing locally a config like

``` nix
services.caddy = {
  enable = true;
  virtualHosts."example.org".extraConfig = ''
    respond "Hello, world!"
  '';
};
```

you must send the request against "localhost" and manually override the host header to "example.org":

``` bash
$ curl localhost -i -H "Host: example.org"
HTTP/1.1 308 Permanent Redirect
Connection: close
Location: https://example.org/
Server: Caddy
...
```

Above you also see the redirect from <http://localhost> to <https://example.org>; Caddy always redirects from the unsecure to the secure port of your virtualhost.

If the response is empty, try setting a port number like 80 and/or try a local TLS security certificate instead of global LetsEncrypt:

``` nix
services.caddy = {
  enable = true;
  virtualHosts."example.org:80".extraConfig = ''
    respond "Hello, world!"
    tls internal
  '';
};
```

With "tls internal" Caddy will generate a local certificate, which is good when testing locally and/or you don't have internet access (e.g. inside a nixos-container).

- [Caddy TLS settings documentation](https://caddyserver.com/docs/caddyfile/directives/tls)

## See also

- [Available NixOS service options](https://search.nixos.org/options?query=services.caddy)
- [Official Caddy documentation](https://caddyserver.com/docs/)
- [NixOS service definition](https://github.com/NixOS/nixpkgs/blob/nixos-23.05/nixos/modules/services/web-servers/caddy/default.nix)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
