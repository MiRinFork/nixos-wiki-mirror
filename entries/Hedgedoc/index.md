<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hedgedoc -->

[Hedgedoc](https://hedgedoc.org/) is a is an open-source, web-based, self-hosted, collaborative markdown editor.

You can use it to easily collaborate on notes, graphs and even presentations in real-time. For this you can use a just the same link to the pad.

## Install and run hedgedoc

You can just enable it. There are 15 options in Nixpkgs to configure it.

``` nixos
  services.hedgedoc = {
    enable = true;
  };
```

## Usage with nginx reverse proxy

Hedgedoc itself provides a web server. In most cases you will use a web server like nginx to provide SSL and access to static hedgedoc files as well as the hedgedoc websocket. In a setup with a VM/internal machine on 192.168.1.100 and a public accessible reverse proxy/VM host running the „hedgedoc.example.com“ domain you will probably use a setup like this:

### Hedgedoc server (virtual machine/internal server)

Hedgedoc does not need more than a handful options for configuration.

``` nixos
  networking.firewall = {
    allowedTCPPorts = [ 8001 ];
  };
  services.hedgedoc = {
    enable = true;
    settings.domain = "hedgedoc.example.com";
    settings.port = 8001; 
    settings.host = "192.168.1.100"; # IP of the VM (or public IP of webserver)
    settings.protocolUseSSL = true;
    settings.allowOrigin = [
        "localhost"
        "hedgedoc.example.com"
    ];
  };
```

Notice: With this configuration hedgedoc is freely usable without authentification. In the current version of hedgedoc there is no admin backend. To have control about the users you can restrict usage by disabling self registration (allowEmailRegister) and guest access (allowAnonymous): Set both to false in services.hedgedoc.settings.

### Nginx reverse proxy (virtualization host/server with public IPv4)

The reverse proxy for `https://hedgedoc.example.com` with an internal hedgedoc server running on 192.168.1.100 will work with this:

``` nixos
services.nginx = {
    enable = true;

    # Use recommended settings
    recommendedGzipSettings = true;
    recommendedOptimisation = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;

    # Only allow PFS-enabled ciphers with AES256
    sslCiphers = "AES256+EECDH:AES256+EDH:!aNULL";

    virtualHosts."hedgedoc.example.com" = {
        forceSSL = true;
        enableACME = true;
        root = "/var/www/hedgedoc";
        locations."/".proxyPass = "http://192.168.1.100:8001";
        locations."/socket.io/" = {
          proxyPass = "http://192.168.1.100:8001";
          proxyWebsockets = true;
          extraConfig =
            "proxy_ssl_server_name on;";
        };
    };
  };
```

## Troubleshooting

(nothing yet)

## References

- Hedgedoc (site): <https://hedgedoc.org/>
- Hedgedoc Nixpgks options: <https://search.nixos.org/options?query=hedgedoc>
- Hedgedoc (sourcecode): <https://github.com/hedgedoc/hedgedoc>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
