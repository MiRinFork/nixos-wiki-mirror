<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: WordPress -->

[WordPress](https://wordpress.org) is a self-hosted content management web application, especially designed for blogging but also a good way to start creating your own website. It can be customized with themes and a built-in site editor and further extended with plugins.

## Installation

A simple local setup of WordPress can be enabled with the following setup

``` nix
services.wordpress.sites."localhost" = {};
```

Visit <http://localhost> to setup your new WordPress instance. By default, a MariaDB server is configured automatically so you won't have to setup the database backend.

## Configuration

It is possible to configure the WordPress `wp-config.php` file declarative using the `settings` option. See examples below and [upstream documentation](https://developer.wordpress.org/apis/wp-config-php) for available settings.

### Language

The default language of the WordPress module will be English. It is possible to enable additional language support for languages which are [already packaged](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=wordpressPackages.languages). Using `settings` you can configure the default language. In this example, we're going to enable the German language.

``` nix
services.wordpress.sites."localhost" = {
  languages = [ pkgs.wordpressPackages.languages.de_DE ];
  settings = {
    WPLANG = "de_DE";
  };
};
```

Alternatively you can package your own language files following this example:

``` nix
{ pkgs, ... }: let

  wordpress-language-de = pkgs.stdenv.mkDerivation {
    name = "wordpress-${pkgs.wordpress.version}-language-de";
    src = pkgs.fetchurl {
      url = "https://de.wordpress.org/wordpress-${pkgs.wordpress.version}-de_DE.tar.gz";
      hash = "sha256-dlas0rXTSV4JAl8f/UyMbig57yURRYRhTMtJwF9g8h0=";
    };
    installPhase = "mkdir -p $out; cp -r ./wp-content/languages/* $out/";
  };

in {

  services.wordpress.sites."localhost".languages = [ wordpress-language-de ];

}
```

Consult the [translation portal](https://translate.wordpress.org) of WordPress for the specific country and language codes available. This example is using the code `de_DE` (Germany/German) in the source URL and also the `settings` part.

### Themes and plugins

Themes and plugins which are [already packaged](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=wordpressPackages) can be integrated like this:

``` nix
services.wordpress.sites."localhost" = {
  themes = {
    inherit (pkgs.wordpressPackages.themes)
      twentytwentythree;
  };
  plugins = {
    inherit (pkgs.wordpressPackages.plugins) 
      antispam-bee
      opengraph;
  };
};
```

Manually package a WordPress theme or plugin can be accomplished like this:

``` nix
let

wordpress-theme-responsive = pkgs.stdenv.mkDerivation rec {
  name = "responsive";
  version = "4.7.9";
  src = pkgs.fetchzip {
    url = "https://downloads.wordpress.org/theme/responsive.${version}.zip";
    hash = "sha256-7K/pwD1KAuipeOAOLXd2wqOUEhwk+uNGIllVWzDHzp0=";
  };
  installPhase = "mkdir -p $out; cp -R * $out/";
};

in {

  services.wordpress.sites."localhost" = {
    themes = {
      inherit wordpress-theme-responsive;
    };
  };

}
```

You can package any available WordPress extension, for example from the [official theme](https://wordpress.org/themes) or [plugin repository](https://wordpress.org/plugins). Be sure to replace the *name*, url and *sha256* part according to your desired extension.

If you want to automatically enable and activate the *responsive* theme, add this `settings` line

``` nix
settings = {
  WP_DEFAULT_THEME = "responsive";
};
```

In case you want to automatically enable and activate the plugin, in this example *akismet*, you can add following to `extraConfig`

``` nix
extraConfig = ''
  if ( !defined('ABSPATH') )
    define('ABSPATH', dirname(__FILE__) . '/');
  require_once(ABSPATH . 'wp-settings.php');
  require_once ABSPATH . 'wp-admin/includes/plugin.php';
  activate_plugin( 'akismet/akismet.php' );
'';
```

### Max upload filesize

The following example configuration changes the max upload filesize limit to 1GB for the WordPress instance with the hostname `localhost`. Change the <a href="phpfpm" class="wikilink" title="phpfpm">phpfpm</a> pool name according to your hostname.

``` nix
services.phpfpm.pools."wordpress-localhost".phpOptions = ''
  upload_max_filesize=1G
  post_max_size=1G
'';
```

### Mail delivery

Mail clients like <a href="Msmtp" class="wikilink" title="Msmtp">Msmtp</a> can be used to configure mail delivery for WordPress. This can be useful for sending registration mails or notifications for new comments etc.

By default WordPress will use the sender mail `wordpress@example.org` where *example.org* is the primary domain name configured for the WordPress instance. By installing and using the plugin [static-mail-sender-configurator](https://wordpress.org/plugins/static-mail-sender-configurator/) it is possible to declaratively configure and change the sender address, for example to `noreply@example.org`.

``` nix
services.wordpress.sites."example.org" = {
  plugins = {
    inherit (pkgs.wordpressPackages.plugins)
      static-mail-sender-configurator;
  };
  extraConfig = ''
      // Enable the plugin 
      if ( !defined('ABSPATH') )
        define('ABSPATH', dirname(__FILE__) . '/');
      require_once(ABSPATH . 'wp-settings.php');
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
      activate_plugin( 'static-mail-sender-configurator/static-mail-sender-configurator.php' );
  '';
  settings = {
    # Change sender mail address
    WP_MAIL_FROM = "noreply@localhost";
  };
};
```

## Maintenance

### Upgrading

WordPress automatically performs an database and software upgrade as soon as a new package version is installed. Major version upgrades of the `pkgs.wordpress` package are performed between every new NixOS release. In case you wish to switch to a newer major WordPress version while staying on your latest NixOS version, you can choose between WordPress package versions available in the repository.

For example switch to WordPress 6.4 instead of the the default WordPress package:

``` nix
services.wordpress.sites."example.org" = {
  package = pkgs.wordpress6_4;
};
```

### Using wp-cli

wp-cli is a command line tool to configure and manage WordPress instances. The following example command creates a administration account with the name `test` and the password `test123`

``` bash
sudo -u wordpress HOME=/var/lib/wordpress/example.org nix run nixpkgs#wp-cli -- --path=/nix/store/wxzcmjfkyk5nfk7vidzbz1mz28wnfl5b-wordpress-example.org-6.1.1/share/wordpress user create test test@example.org --role=administrator --user_pass=test123
```

Change the home directory `/var/lib/wordpress/example.org` according to your instance domain name. The WordPress root directory is specified with `--path` and can be found in the generated web server configuration.

## Tips and tricks

### Force https-URLs behind reverse proxy

In case you're running WordPress behind a reverse proxy which offers a SSL/https connection to the outside, you can force WordPress to use the https protocol

``` nix
services.wordpress.sites."localhost" = {
  settings = {
    # Needed to run behind reverse proxy
    FORCE_SSL_ADMIN = true;
  };
  extraConfig = ''
    $_SERVER['HTTPS']='on';
  '';
};
```

### Search engine optimization (SEO)

**Meta information**

The WordPress plugin [Yoast SEO](https://wordpress.org/plugins/wordpress-seo) helps you to configure meta information of your WordPress page. You can install it like this

``` nix
services.wordpress.sites."example.org" = {
  plugins = {
    inherit (pkgs.wordpressPackages.plugins)
      wordpress-seo;
  };
};
```

After enabling the plugin in the WordPress admin interface, finish the first-time installation wizard of Yoast SEO. In most cases the free features offered by the plugin should be sufficient, so you won't have to register or enable any premium extensions. Other integrations which are not needed can be disabled in *Yoast SEO -\> Integrations*.

It's worth tweaking settings in *Yoast SEO -\> Search Appearance*. Especially configuring a social image and organization logo including name and description is useful if your page gets shared and indexed.

SEO optimization can be performed page wise. In the page editor you'll find SEO analysis and tips on the right pane.

**Picture compression**

Your website gets better ranking for search engines if it is optimized to load fast. The WordPress plugin [webp-express](https://wordpress.org/plugins/webp-express) compresses your existing and future images automatically into a modern efficient image format and reduces their file size.

Following example installs the plugin and adds an additional writeable directory to the WordPress package, otherwise the plugin will fail due to permission issues. This hack only works for one specific instance, in this example for *example.org*. Replace the site name on all occurrences.

``` nix
services.wordpress.sites."example.org" = {
  plugins = {
    inherit (pkgs.wordpressPackages.plugins)
      webp-express;
  };
};

nixpkgs.overlays = [
  (self: super: {
    wordpress = super.wordpress.overrideAttrs (oldAttrs: rec {
      installPhase = oldAttrs.installPhase + ''
        ln -s /var/lib/wordpress/example.org/webp-express $out/share/wordpress/wp-content/webp-express
      '';
    });
  })
];

systemd.tmpfiles.rules = [
  "d '/var/lib/wordpress/example.org/webp-express' 0750 wordpress wwwrun - -"
];
```

In the WordPress administrator interface go to *Settings -\> WebP Express*. One possible configuration which is suitable for the NixOS module could be

- Scope: Uploads only (we cannot convert theme files)
- Destination folder: Mingled (save webp converted images in the same place as original files)
- File extension: Set to ".webp"
- Destination structure: Image roots
- Disable all .htaccess rules (doesn't apply for any web server)
- Convert on upload: yes (future uploads will be converted to webp file format)
- Alter HTML: Replace image URLs (we'll only reference compressed webp images on the page)
- Reference webps that haven't been converted yet: Yes
- How to replace: The complete page

Further click on *Bulk convert* to convert all existing images.

**Lazy load images**

Using the WordPress plugin [Jetpack](https://wordpress.org/plugins/jetpack), it is possible to enable lazy loading of images. That means, images only visible in the current view of the web browser are loaded. This will speed up initial page load.

``` nix
services.wordpress.sites."example.org" = {
  plugins = {
    inherit (pkgs.wordpressPackages.plugins)
      jetpack;
  };
};
```

After enabling the plugin, in the WordPress admin interface go to *Jetpack -\> Settings -\> Performance* and ensure that lazy loading of Images is enabled. Note that Jetpack comes with a lot of optional modules which should be disabled if not used. On the same page go to *Debug* in the bottom menu and click on the last link offering the list of all modules. Disable all modules you don't need instead of *Lazy Images*.

**Webserver text compression**

Compressing text served by the web server enhances page loading times. This example enables text compression on the webserver <a href="Nginx" class="wikilink" title="Nginx">Nginx</a>. Please refer upstream documentation in case you're going to use a different web server for your WordPress setup.

``` nix
services.nginx.extraConfig = ''
  gzip on;
  gzip_vary on;
  gzip_comp_level 4;
  gzip_min_length 256;
  gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
  gzip_types application/atom+xml application/javascript application/json application/ld+json application/manifest+json application/rss+xml application/vnd.geo+json application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/bmp image/svg+xml image/x-icon text/cache-manifest text/css text/plain text/vcard text/vnd.rim.location.xloc text/vtt text/x-component text/x-cross-domain-policy;
'';
```

**Minify and merge Javascript and CSS**

Page load can further optimized by minify and merge Javascript and CSS files. The plugin [merge-minify-refresh](https://wordpress.org/plugins/merge-minify-refresh) can be used to achieve this. The following example installs the plugin and creates an additional directory required for the plugin to work. This hack is specified for one specific instance for the domain *example.org* (replace all occurrences with your preferred domain name). Don't forget to enable the plugin in the WordPress admin interface.

``` nix
services.wordpress.sites."example.org" = {
  plugins = {
    inherit (pkgs.wordpressPackages.plugins)
      merge-minify-refresh;
  };
};

nixpkgs.overlays = [
  (self: super: {
    wordpress = super.wordpress.overrideAttrs (oldAttrs: rec {
      installPhase = oldAttrs.installPhase + ''
        ln -s /var/lib/wordpress/example.org/mmr $out/share/wordpress/wp-content/mmr
      '';
    });
  })
];

systemd.tmpfiles.rules = [
  "d '/var/lib/wordpress/example.org/mmr' 0750 wordpress wwwrun - -"
];
```

**Useful online tools**

There are some resources which might be useful to check the SEO score of your page

- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [seobility SEO Checker](https://www.seobility.net/en/seocheck)

### Security hardening

By enabling these two plugins, your WordPress login is protected by a simple numeric captcha and the xml-rpc api, used by alternative WordPress clients, gets disabled.

``` nix
services.wordpress.sites."example.org" = {

  plugins = {
    inherit (pkgs.wordpressPackages.plugins)
      disable-xml-rpc
      simple-login-captcha;
  };
  extraConfig = ''
      // Enable the plugin 
      if ( !defined('ABSPATH') )
        define('ABSPATH', dirname(__FILE__) . '/');
      require_once(ABSPATH . 'wp-settings.php');
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
      activate_plugin( 'disable-xml-rpc/disable-xml-rpc.php' );
      activate_plugin( 'simple-login-captcha/simple-login-captcha.php' );
  '';
};
```

## Troubleshooting

### Enable logging

To enable logging add the following lines to `settings` and `extraConfig`

``` nix
services.wordpress.sites."localhost" = {
  settings = {
    WP_DEBUG = true;
    WP_DEBUG_LOG = true;
  };
  extraConfig = ''
    ini_set( 'error_log', '/var/lib/wordpress/localhost/debug.log' );
  '';
};
```

Since the default location to the folder `wp-content` is not writable, we redirect the log file path to `/var/lib/wordpress/localhost/debug.log`. All error messages will be stored there. Change the folder name *localhost* to the name of your site.

In case you want to print error messages directly in your browser, append following line

``` nix
services.wordpress.sites."localhost" = {
  extraConfig = ''
    @ini_set( 'display_errors', 1 );
  '';
```

Please note that this exposes sensible information about your server setup therefore this option should not be enabled in production.

## Known issues

There are some known issues regarding the WordPress module on NixOS

- Some plugins assume an absolute persistent path which Nix doesn't provide <https://github.com/NixOS/nixpkgs/issues/210895>
- The wp-content root nor the plugin directories are writeable which prevents some plugins to work <https://github.com/NixOS/nixpkgs/issues/150951>
- The wordpressPackages set misses translation files for themes and plugins. This means only the English interface will be available <https://github.com/helsinki-systems/wp4nix/issues/2>
- Plugins and themes are managed by the NixOS module. Manually updating or installing them through the WordPress web interface is not supported at the moment

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
