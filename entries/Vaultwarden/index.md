<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vaultwarden -->

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) is an alternative server implementation of the Bitwarden Client API, written in <a href="Rust" class="wikilink" title="Rust">Rust</a> and compatible with [official Bitwarden clients](https://bitwarden.com/download/), allowing you to self-host your own password manager backend.

## Example Configuration

``` nix
services.vaultwarden = {
    enable = true;
    backupDir = "/var/local/vaultwarden/backup";
    # in order to avoid having  ADMIN_TOKEN in the nix store it can be also set with the help of an environment file
    # be aware that this file must be created by hand (or via secrets management like sops)
    environmentFile = "/var/lib/vaultwarden/vaultwarden.env";
    config = {
        # Refer to https://github.com/dani-garcia/vaultwarden/blob/main/.env.template
        DOMAIN = "https://bitwarden.example.com";
        SIGNUPS_ALLOWED = false;

        ROCKET_ADDRESS = "127.0.0.1";
        ROCKET_PORT = 8222;
        ROCKET_LOG = "critical";

        # This example assumes a mailserver running on localhost,
        # thus without transport encryption.
        # If you use an external mail server, follow:
        #   https://github.com/dani-garcia/vaultwarden/wiki/SMTP-configuration
        SMTP_HOST = "127.0.0.1";
        SMTP_PORT = 25;
        SMTP_SECURITY = off;

        SMTP_FROM = "admin@bitwarden.example.com";
        SMTP_FROM_NAME = "example.com Bitwarden server";
    };
};
```

## Reverse Proxy Setup (recommended)

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

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
