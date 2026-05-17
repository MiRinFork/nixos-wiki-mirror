<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PhotoPrism -->

## What is PhotoPrism

[PhotoPrism](https://www.photoprism.app/) is an AI-Powered Photos App for the Decentralized Web. It makes use of the latest technologies to tag and find pictures automatically without getting in your way. You can run it at home, on a private server, or in the cloud.

**Functionality:**

- Browse all your photos and videos without worrying about RAW conversion, duplicates or video formats
- Easily find specific pictures using powerful search filters
- Includes four high-resolution world maps to bring back the memories of your favorite trips
- Play Live Photos by hovering over them in albums and search results
- Recognizes the faces of your family and friends
- Automatic classification of pictures based on their content and location

## Setup PhotoPrism

To install PhotoPrism add to your `configuration.nix`:

``` nix
  # Photoprism
  services.photoprism = {
    enable = true;
    port = 2342;
    originalsPath = "/var/lib/private/photoprism/originals";
    address = "0.0.0.0";
    settings = {
      PHOTOPRISM_ADMIN_USER = "admin";
      PHOTOPRISM_ADMIN_PASSWORD = "...";
      PHOTOPRISM_DEFAULT_LOCALE = "en";
      PHOTOPRISM_DATABASE_DRIVER = "mysql";
      PHOTOPRISM_DATABASE_NAME = "photoprism";
      PHOTOPRISM_DATABASE_SERVER = "/run/mysqld/mysqld.sock";
      PHOTOPRISM_DATABASE_USER = "photoprism";
      PHOTOPRISM_SITE_URL = "http://sub.domain.tld:2342";
      PHOTOPRISM_SITE_TITLE = "My PhotoPrism";
    };
  };
```

**Notes:**

- PhotoPrism can be run on `sqlite3` but performance will be horrible. That's why `MySQL resp. MariaDB` should be used.
- The `originalsPath` must be set and in required to be inside the `/var/lib/private/photoprism` directory. Otherwise `SystemD` will complain. Further below you'll find instruction on howto to effectively store Photoprism and the `Originals` in another location.
- Instead of providing the admin password as settings, you could also use a password file using `services.photoprism.passwordFile`
- The address should be `0.0.0.0` to listen to everything.
- You can set a lot more photoprism settings. The complete list of options (except the ones for sponsors) can be found [here](https://docs.photoprism.app/getting-started/config-options/).
- Because we use the socket for the database, no database user password is required to specify.
- Make sure there are no unexpected files or folders in `/`. Otherwise Photoprism will complain and not start.

## Setup MariaDB / MySQL

To setup MariaDB / MySQL with PhotoPrism, you can use a code snippet like the following in your `configuration.nix`:

``` nix
  # MySQL
  services.mysql = {
    enable = true;
    dataDir = "/data/mysql";
    package = pkgs.mariadb;
    ensureDatabases = [ "photoprism" ];
    ensureUsers = [ {
      name = "photoprism";
      ensurePermissions = {
        "photoprism.*" = "ALL PRIVILEGES";
      };
    } ];
  };
```

**Notes:**

- By default MySQL is used. If you want to use MariaDB instead, use the `services.mysql.package = pkgs.mariadb` directive.
- By default the data is stored in `/var/lib/mysql`. If you want to alter the location, use the `services.mysql.dataDir` directive.
- The `ensureDatabases` directive ensures that the specified databases exist. Removing such a created database from the list, will not delete it. This means that databases created once through this option or otherwise have to be removed manually. This will ensure, you don't accidentally delete all your PhotoPrism data.
- Make sure that the database user for your PhotoPrism database matches with the one specified in the PhotoPrism settings.

## Setup nginx reverse proxy

As Photoprism runs on its own port, you do want to setup a reverse proxy. That way you can omit the port and also use secure connections when accessing it.

``` nix
  # NGINX
  services.nginx = {
    enable = true;
    recommendedTlsSettings = true;
    recommendedOptimisation = true;
    recommendedGzipSettings = true;
    recommendedProxySettings = true;
    clientMaxBodySize = "500m";
    virtualHosts = {
      "sub.domain.tld" = {
        forceSSL = true;
        enableACME = true;
        http2 = true;
        locations."/" = {
          proxyPass = "http://127.0.0.1:2342";
          proxyWebsockets = true;
          extraConfig = ''
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_buffering off;
            proxy_http_version 1.1;
          '';
        };
      };
    };
  };
```

**Notes:**

- The `clientMaxBodySize` is the maximum size of a client request body. If this size is exceeded, Nginx returns a 413 Request entity too large HTTP error. This setting is particularly important for uploads especially video files.
- With the `proxyPass` directive nginx will access PhotoPrism. This way, you can also use SSL certificates (freely issued by Let's Encrypt through the acme protocol).

## Storing user data in specific location

NixOS allows you to seperate specific user data from other data that gets accumulated over time. Graham Christensen has written an excellent [blog post](https://grahamc.com/blog/erase-your-darlings/) on how to achieve that with ZFS. This is also possible with other CoW filesystems that have snapshot functionality. Such a setup requires you to specifically *opt-in* into keeping data.

On of the problem is that PhotoPrism stores it's actual data by default in `/var/lib/private/PhotoPrism`. SystemD is picky about the `/var/lib/private` folder. It won't allow symlinks there, but you can actually bind mount folders.

Specify the bind mounts in your `/etc/nixos/hard-wareconfiguration.nix` like this:

``` nix
  fileSystems."/var/lib/private/photoprism" =
    { device = "/data/photoprism";
      options = [ "bind" ];
    };
```

If you want to have the `originals` folder somewhere else, you can just add it also as seperate bind mount:

``` nix
  fileSystems."/var/lib/private/photoprism" =
    { device = "/data/photoprism";
      options = [ "bind" ];
    };

  fileSystems."/var/lib/private/photoprism/originals" =
    { device = "/data/originals";
      options = [ "bind" ];
    };
```

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>
