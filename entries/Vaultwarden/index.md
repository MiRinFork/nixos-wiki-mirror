<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vaultwarden -->

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) is an alternative server implementation of the Bitwarden Client API, written in <a href="Rust" class="wikilink" title="Rust">Rust</a> and compatible with [official Bitwarden clients](https://bitwarden.com/download/), allowing you to self-host your own password manager backend.

## Example Configuration with SQlite

``` nix
services.vaultwarden = {
    enable = true;
    backupDir = "/var/local/vaultwarden/backup";
    # in order to avoid having  ADMIN_TOKEN in the nix store it can be also set with the help of an environment file
    # be aware that this file must be created by hand (or via secrets management like sops or agenix)
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

## Example Configuration with Postgresql (recommended for production)

``` nix
services.vaultwarden = {
    enable = true;
    # Needed to enable postgresql
    package = pkgs.vaultwarden-postgresql;
    dbBackend = "postgresql";

    # automatically inject Nginx and Postgres config
    configureNginx = true;
    configurePostgres = true;
    domain = bitwarden.example.com;

    # in order to avoid having ADMIN_TOKEN and SMTP_PASSWORD in the nix store, it can also be set with the help of an environment file
    # be aware that this file must be created by hand (or via secrets management like sops)
    environmentFile = "/var/lib/vaultwarden/vaultwarden.env";
    config = {
        # Refer to https://github.com/dani-garcia/vaultwarden/blob/main/.env.template
        SIGNUPS_ALLOWED = false;

        ROCKET_ADDRESS = "127.0.0.1";
        ROCKET_PORT = 8222;
        ROCKET_LOG = "critical";

        # This example assumes an external mailserver, for more information see:
        #   https://github.com/dani-garcia/vaultwarden/wiki/SMTP-configuration
        # Note: don't forget to add SMTP_PASSWORD in your env file
        SMTP_HOST = "smtp.example.com";
        SMTP_SECURITY = "force_tls";
        SMTP_FROM = "bitwarden@example.com";
        SMTP_FROM_NAME = "example.com Bitwarden server";
    };
};
```

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
