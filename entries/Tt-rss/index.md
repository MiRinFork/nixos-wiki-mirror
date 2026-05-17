<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tt-rss -->

[Tiny Tiny RSS](https://tt-rss.org/) is a free and open source web-based news feed (RSS/Atom) reader and aggregator.

\_\_TOC\_\_

## Install

\<syntaxhighlight lang="nix\> services.tt-rss = {

` enable = true;`  
` # to configure a nginx virtual host directly:`  
` virtualHost = "tt-rss.example.com";`  
` selfUrlPath = "`[`https://tt-rss.example.com`](https://tt-rss.example.com)`";`  
` # or for hosting on sub-path:`  
` selfUrlPath = "`[`https://example.com/tt-rss`](https://example.com/tt-rss)`";`

};

</syntaxhighlight>

### Using Caddy as web server instead of nginx

As of NixOS 24.11 the following configuration works, future versions of NixOS may expose this as native Caddy support for Tiny Tiny RSS instead:

``` nix
{ config, pkgs, lib, ... }:

let
    hostNames = [
        "tt-rss.example.com"
    ];
in {
    services.tt-rss = {
        enable = true;

        # Address at which Tiny Tiny RSS is publically exposed
        selfUrlPath = "https://${lib.lists.head hostNames}/";

        # Disable nginx integration as it will conflict with Caddy
        virtualHost = null;
    };

    # Caddy reverse proxy configuration
    services.caddy.virtualHosts.tt-rss = {
        hostName = lib.lists.head hostNames;
        serverAliases = lib.lists.tail hostNames;

        extraConfig = ''
            root * ${config.services.tt-rss.root}/www

            php_fastcgi * unix/${config.services.phpfpm.pools.${config.services.tt-rss.pool}.socket} {
                capture_stderr
            }

            file_server {
                browse
            }
        '';
    };

    # Workaround: Create PHP-FPM socket with Caddy user instead of non-existing nginx
    services.phpfpm.pools."${config.services.tt-rss.pool}".settings = {
        "listen.owner" = config.services.caddy.user;
        "listen.group" = config.services.caddy.group;
    };
}
```

## Configuration

By default tt-rss creates an **admin** user with password **password**. After logging in for the first time, do not forget to **change it**!

### Disabling the *admin* user completely

After installing and creating a new user, you can disable the *admin* by setting its access level to -2 [1](https://srv.tt-rss.org/ttrss-docs/classes/UserHelper.html#constant_ACCESS_LEVEL_DISABLED).

Either manually by running:

``` shell
sudo -u tt_rss nix-shell -p php \
  --run 'php /var/lib/tt-rss/www/update.php --user-set-access-level "admin:-2"'
```

You can even automate this to ensure it is always set to -2 by e.g. utilising a *PreStart* snippet:

``` nix
systemd.services.tt-rss.preStart = lib.mkAfter ''
  ${pkgs.php}/bin/php ${config.services.tt-rss.root}/www/update.php \
    --user-set-access-level "admin:-2"
'';
```

### Enabling TLS for nginx virtual host

Assuming you have ACME set-up for *example.com*:

``` nix
services.nginx.virtualHosts."${config.services.tt-rss.virtualHost}" = {
  forceSSL = true;
  useACMEHost = "example.com"
};
```

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
