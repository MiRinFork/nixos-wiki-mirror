<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Phpfpm -->

[php-fpm](https://www.php.net/manual/en/install.fpm.php) is a fastcgi interface for php.

## Configuration for nginx

This configuration will set up phpfpm for serving php files from `${dataDir}`. Import this from your `configuration.nix`.

``` nix
{ pkgs, lib, config, ... }:
let
  app = "phpdemo";
  domain = "${app}.example.com";
  dataDir = "/srv/http/${domain}";
in {
  services.phpfpm.pools.${app} = {
    user = app;
    settings = {
      "listen.owner" = config.services.nginx.user;
      "pm" = "dynamic";
      "pm.max_children" = 32;
      "pm.max_requests" = 500;
      "pm.start_servers" = 2;
      "pm.min_spare_servers" = 2;
      "pm.max_spare_servers" = 5;
      "php_admin_value[error_log]" = "stderr";
      "php_admin_flag[log_errors]" = true;
      "catch_workers_output" = true;
    };
    phpEnv."PATH" = lib.makeBinPath [ pkgs.php ];
  };
  services.nginx = {
    enable = true;
    virtualHosts.${domain}.locations."/" = {
      root = dataDir;
      extraConfig = ''
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:${config.services.phpfpm.pools.${app}.socket};
        include ${pkgs.nginx}/conf/fastcgi.conf;
      '';
     };
  };
  users.users.${app} = {
    isSystemUser = true;
    createHome = true;
    home = dataDir;
    group  = app;
  };
  users.groups.${app} = {};
}
```

### Escaping special chars

When using regular expressions in `locations` blocks, be ware of the [need to escape some special chars](https://nixos.org/manual/nix/stable/language/values.html#type-string) like `\`.

i.e. `locations."~ ^(.+\.php)(.*)$" = {` should be escaped to `locations."~ ^(.+\\.php)(.*)$" = {`

Otherwise file names like *gly**php**ro.css* will be matched and parsed by the php interpreter. Which likely fails with an access error because of php-fpms [security.limit_extensions](https://www.php.net/manual/en/install.fpm.configuration.php).

See also <a href="Nginx" class="wikilink" title=" the nginx article"> the nginx article</a>.

## PHP Extensions

To use certain PHP extensions you will need to configure them in the `php.ini`-configuration of phpfpm via `services.phpfpm.phpOptions` or `services.phpfpm.pools.${pool}.phpOptions`:

``` nix
{
  services.phpfpm.phpOptions = ''
    extension=${pkgs.phpExtensions.redis}/lib/php/extensions/redis.so
    extension=${pkgs.phpExtensions.apcu}/lib/php/extensions/apcu.so
  '';
}
```

<a href="Category:PHP" class="wikilink" title="Category:PHP">Category:PHP</a>
