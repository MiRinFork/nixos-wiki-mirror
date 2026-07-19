<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PHP -->

\_\_TOC\_\_

See also:

- [PHP User Guide in the nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#ssec-php-user-guide).
- <a href="phpfpm" class="wikilink" title="phpfpm">phpfpm</a> on this wiki

## Install

``` nix>
environment.systemPackages = with pkgs; [ php ];
</syntaxhighlight>

See <code>nix search php</code> (<code>nix search nixpkgs php</code> with [[Flakes]]) for additional versions like <code>php74</code>, etc.

== Configuration ==

=== Setting custom php.ini configurations ===

The `buildEnv` attribute on php can add extra configuration options. For instance, to set a memory_limit in the NixOS configuration.nix:

<syntaxhighlight lang=
```

environment.systemPackages =

` let`  
`   php = pkgs.php.buildEnv { extraConfig = "memory_limit = 2G"; };`  
` in [`  
`   php`  
` ];`

</syntaxhighlight>

In case of using php-fpm, the following example enables error reporting. Use this only in development environments

``` nix>
services.phpfpm.phpOptions = ''
  display_errors = on;
'';
</syntaxhighlight>

=== Setting custom plugins and php.ini configurations ===

In this example we install the [[xdebug]] extension, and add a php.ini directive to enable it.

<syntaxhighlight lang=
```

environment.systemPackages = \[

` (pkgs.php.buildEnv {`  
`   extensions = ({ enabled, all }: enabled ++ (with all; [`  
`     xdebug`  
`   ]));`  
`   extraConfig = ''`  
`     xdebug.mode=debug`  
`   '';`  
` })`

\];

</syntaxhighlight>

You can see the full list of extensions e.g. with:

``` nix
$ nix repl
 
nix-repl> pkgs = import <nixpkgs> {}            
 
nix-repl> builtins.attrNames pkgs.phpExtensions
```

## Apache, plugins, settings

Here's how to configure Apache to use a particular PHP configuration/version/etc

``` nix
# in /etc/nixos/configuration.nix (not inside systemPackages)
services.httpd.phpPackage = pkgs.php.buildEnv {
  extensions = ({ enabled, all }: enabled ++ (with all; [
    xdebug
  ]));
  extraConfig = ''
    xdebug.mode=debug
  '';
};
```

## OCI image

Here's an example on how to build an OCI image running a PHP application:

Using nginx:

\<syntaxhighlight lang="nix\> packages = let

` src = ./.;`  
` php = pkgs.php81;`

in {

` app = php.buildComposerProject {`  
`   inherit src;`

`   pname = "app-demo";`  
`   version = "1.0.0";`

`   vendorHash = "sha256-SrE51k3nC5idaDHNxiNM7NIbIERIf8abrCzFEdxOQWA=";`  
` };`

` oci-image = let`  
`   nginxPort = "8000";`  
`   nginxWebRoot = "${self'.packages.app}/share/php/app-demo/public";`

`   nginxConf = pkgs.writeText "nginx.conf" ''`  
`     user nobody nobody;`  
`     daemon off;`  
`     error_log /dev/stdout info;`  
`     pid /dev/null;`  
`     events {}`  
`     http {`  
`       access_log /dev/stdout;`  
`       server {`  
`         listen ${nginxPort};`  
`         index index.php index.html;`  
`         charset utf-8;`

`         add_header X-Frame-Options "SAMEORIGIN";`  
`         add_header X-Content-Type-Options "nosniff";`  
`         location / {`  
`           root ${nginxWebRoot};`  
`           try_files $uri $uri/ /index.php?$query_string;`  
`         }`  
`         location ~ \.php$ {`  
`           root ${nginxWebRoot};`  
`           fastcgi_pass 127.0.0.1:9000;`  
`           fastcgi_split_path_info ^(.+\.php)(/.+)$;`  
`           include ${pkgs.nginx}/conf/fastcgi_params;`  
`           include ${pkgs.nginx}/conf/fastcgi.conf;`  
`         }`  
`       }`  
`     }`  
`   '';`  
` in`  
` pkgs.dockerTools.buildLayeredImage {`  
`   name = self'.packages.app.pname;`  
`   tag = "latest";`

`   contents = [`  
`     php`  
`     pkgs.nginx`  
`     pkgs.fakeNss`  
`     (pkgs.writeScriptBin "start-server" ''`  
`       #!${pkgs.runtimeShell}`  
`       php-fpm -y /etc/php-fpm.d/www.conf.default & nginx -c ${nginxConf};`  
`     '')`  
`   ];`

`   extraCommands = ''`  
`     mkdir -p var/log/nginx`  
`     mkdir -p var/cache/nginx`  
`     mkdir -p tmp`  
`     chmod 1777 tmp`  
`   '';`

`   config = {`  
`     Cmd = [ "start-server" ];`  
`     ExposedPorts = {`  
`       "${nginxPort}/tcp" = {};`  
`     };`  
`   };`  
` };`

};

</syntaxhighlight>

Using Caddy:

\<syntaxhighlight lang="nix\> packages = let

`         src = ./.;`  
`         php = pkgs.php1;`

in {

` app = php.buildComposerProject {`  
`   inherit src;`

`   pname = "app-demo";`  
`   version = "1.0.0";`

`   vendorHash = "sha256-SrE51k3nC5idaDHNxiNM7NIbIERIf8abrCzFEdxOQWA=";`  
` };`

` oci-image = let`  
`   webport = "8000";`  
`   webroot = "${self'.packages.app}/share/php/app-demo/public";`

`   caddyFile = pkgs.writeText "Caddyfile" ''`  
`   :${webport}`  
`   root * ${webroot}`  
`   log`  
`   encode gzip`  
`   php_fastcgi 127.0.0.1:9000`  
`   file_server`  
`   '';`  
` in`  
` pkgs.dockerTools.buildLayeredImage {`  
`   name = self'.packages.app.pname;`  
`   tag = "latest";`

`   contents = [`  
`     php`  
`     pkgs.caddy`  
`     pkgs.fakeNss`  
`     (pkgs.writeScriptBin "start-server" ''`  
`       #!${pkgs.runtimeShell}`  
`       php-fpm -D -y /etc/php-fpm.d/www.conf.default`  
`       caddy run --adapter caddyfile --config ${caddyFile}`  
`     '')`  
`   ];`

`   extraCommands = ''`  
`     mkdir -p tmp`  
`     chmod 1777 tmp`  
`   '';`

`   config = {`  
`     Cmd = [ "start-server" ];`  
`     ExposedPorts = {`  
`       "${webport}/tcp" = {};`  
`     };`  
`   };`  
` };`

};

</syntaxhighlight>

## Use php Packages with Extensions in a nix-shell

To use php packages with some extensions enabled, create a `shell.nix` similar to the following:

\<syntaxhighlight lang="nix\> { pkgs ? import <nixpkgs> { } }: let

` phpEnv = pkgs.php.buildEnv {`  
`   extensions = { enabled, all }: enabled ++ (with all; [ xsl ]);`  
`   extraConfig = "memory_limit=-1";`  
` };`

in pkgs.mkShell {

` buildInputs = with pkgs; [`  
`   phpEnv`  
`   phpEnv.packages.composer`  
`   symfony-cli`  
` ];`

}

</syntaxhighlight>

## Troubleshooting

### Memcached Extension Isn't Enabled

Using `phpExtensions.memcached` inside of `environment.systemPackages` will lead to the memcached php extension not being enabled in the `php.ini` file. Here's how to fix it:

\<syntaxhighlight lang="nix\> let

` # Replace pkgs.php with the php version you want; ex pkgs.php83`  
` php = pkgs.php.buildEnv {`  
`   extensions = { enabled, all }: enabled ++ (with all; [ memcached ]); `  
` };`

in {

` environment.systemPackages = with pkgs; [ php ];`

}

</syntaxhighlight>

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:PHP" class="wikilink" title="Category:PHP">Category:PHP</a>
