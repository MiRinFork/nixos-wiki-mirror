<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vaultwarden -->

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) is an alternative server implementation of the Bitwarden Client API, written in <a href="Rust" class="wikilink" title="Rust">Rust</a> and compatible with [official Bitwarden clients](https://bitwarden.com/download/), allowing you to self-host your own password manager backend.

## Example Configuration with SQlite

## Example Configuration with Postgresql (recommended for production)

To enable proper SSL certificate look at ACME wiki entry: <https://wiki.nixos.org/wiki/ACME>

## Reverse Proxy Setup (only needed if \`configureNginx\` is not set)

### Caddy

``` nix
services.caddy.virtualHosts."bitwarden.example.com".extraConfig = ''
    encode zstd gzip

    reverse_proxy :${toString config.services.vaultwarden.config.ROCKET_PORT} {
        header_up X-Real-IP {remote_host}
    }
'';
```

### Nginx

``` nix
services.nginx.virtualHosts."bitwarden.example.com" = {
    enableACME = true;
    forceSSL = true;
    locations."/" = {
        proxyPass = "http://127.0.0.1:${toString config.services.vaultwarden.config.ROCKET_PORT}";
        proxyWebsockets = true;
    };
};
```

## Access your server

Set the ADMIN_TOKEN in your env file to be able to create your first user using the \`/admin\` endpoint. For example: <https://bitwarden.example.com/admin> And use ADMIN_TOKEN to login and create your first admin user. Then you can remove the token from the env file and use your admin user directly.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
