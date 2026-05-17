<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: WriteFreely -->

[WriteFreely](https://writefreely.org/) is a blogging platform with support for ActivityPub and is available in NixOS starting with release 22.11.

## Setup

To create your WriteFreely instance, enable the option .

``` nix
{
  services.writefreely = {
    # Create a WriteFreely instance.
    enable = true;

    # Create a WriteFreely admin account.
    admin.name = "my-username";
    
    # The public host name to serve.
    host = "blog.example.com";
  };
}
```

For more specific configuration, see the following sections.

### Admin Account

WriteFreely requires an admin account be created to access the web UI. This can be set using the options under .

``` nix
{
  services.writefreely = {
    enable = true;

    admin = {
      name = "my-username";
      # If not specified, a default password of "nixos" will be used. Your password can be
      # updated using the web interface.
      initialPasswordFile = "/path/to/password.txt";
    };
  };
}
```

### Database

WriteFreely supports multiple database engines. The NixOS module lets you select which you would like to use and enables easy provisioning of local databases. See the options under .

#### SQLite

The default database is SQLite. This can be configured with the following options.

``` nix
{
  services.writefreely = {
    enable = true;

    database = {
      # This is the default database type.
      type = "sqlite3";

      # This is the file name of the SQLite database, relative to the
      # stateDir (default: /var/lib/writefreely).
      filename = "writefreely.db";

      # The name of the database to create in SQLite.
      database = "writefreely";
    };
  };
}
```

#### MySQL

You can choose to use a <a href="Mysql" class="wikilink" title="MySQL">MySQL</a> database instead of SQLite.

##### Local MySQL

To create a local MySQL database, see the following example.

``` nix
{
  services.writefreely = {
    enable = true;

    database = {
      # Use the MySQL database engine.
      type = "mysql";

      # Run MySQL locally.
      createLocally = true;

      # Set a password for the database so WriteFreely can access it.
      passwordFile = "/path/to/password.txt";
    };
  };
}
```

##### Remote MySQL

To use a remote MySQL database, see the following example.

``` nix
{
  services.writefreely = {
    enable = true;

    database = {
      # Use the MySQL database engine.
      type = "mysql";

      # The name of the database to store data in.
      name = "writefreely";
      # The database user to connect as.
      user = "writefreely";
      # The database host to connect to.
      host = "10.0.0.1";
      # The port to connect to the database on.
      port = 3306;

      # Set a password for the database so WriteFreely can access it.
      passwordFile = "/path/to/password.txt";
    };
  };
}
```

### Nginx

<a href="Nginx" class="wikilink" title="Nginx">Nginx</a> can be used as a reverse proxy for your WriteFreely instance. This can be configured with the options under .

``` nix
{
  services.writefreely = {
    enable = true;

    nginx = {
      # Enable Nginx and configure it to serve WriteFreely.
      enable = true;

      # You can force users to connect with HTTPS.
      forceSSL = true;
    };
  };
}
```

### ACME

Automatic SSL certificates can be retrieved using <a href="ACME" class="wikilink" title="ACME">ACME</a>. When used with Nginx, the certificates will be managed by NixOS's default ACME configuration. When **not** using Nginx, WriteFreely will manage certificates itself.

``` nix
{
  services.writefreely = {
    enable = true;

    acme = {
      # Automatically fetch and configure SSL certs.
      enable = true;
    };
  };
}
```

### Settings

Settings for WriteFreely's configuration file `config.ini` can be set using the option . See the [WriteFreely documentation](https://writefreely.org/docs/latest/admin/config) for a list of settings.

``` nix
{
  services.writefreely = {
    enable = true;

    settings = {
      server = {
        port = 8080;
      };
    };
  };
}
```

<a href="Category:ActivityPub" class="wikilink" title="Category:ActivityPub">Category:ActivityPub</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
