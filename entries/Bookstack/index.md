<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bookstack -->

[BookStack](https://www.bookstackapp.com/) is a platform for organising and storing information.

## Installation

To install BookStack, add the following to your NixOS configuration:

``` nixos
services.bookstack.enable = true;
```

[More options](https://search.nixos.org/options?channel=unstable&query=services.bookstack) are available.

## Configuration

BookStack requires some configuration to get working. You'll need to set up a secret and a database to connect to.

### App secret

BookStack requires an app secret, primarily used for encryption. You can generate a valid app key using the following command:

``` bash
echo base64:$(nix run nixpkgs#openssl -- rand -base64 32)
```

Write this value to a file owned by the `bookstack` user in the `bookstack` group, perhaps using a secret manager such as <a href="Agenix" class="wikilink" title="Agenix">Agenix</a>, and provide its path to Bookstack:

``` nixos
services.bookstack.settings.APP_KEY_FILE = "path-to-your-secret";
```

And using <a href="Agenix" class="wikilink" title="Agenix">Agenix</a>,

``` nixos
services.bookstack.settings.APP_KEY_FILE = config.age.secrets.bookstack-appkey.path;
```

### Database

BookStack uses a MySQL (MariaDB) as a DBMS. Connection parameters are provided via `services.bookstack.settings`. To point at a database running locally, your configuration might look like this:

``` nixos
services.bookstack.settings.DB_HOST = "localhost";
services.bookstack.settings.DB_PORT = 3306;
services.bookstack.settings.DB_USERNAME = "bookstack";
services.bookstack.settings.DB_DATABASE = "bookstack";
services.bookstack.settings.DB_SOCKET = "/run/mysqld/mysqld.sock";
 
```

A locally-running database can be be configured with the following:

``` nixos
services.mysql = {
  enable = true;
  package = pkgs.mariadb;
  settings.mysqld.character-set-server = "utf8mb4";
  ensureDatabases = [ "bookstack" ];
  ensureUsers = [{
    name = "bookstack";
    ensurePermissions = {
      "bookstack.*" = "ALL PRIVILEGES";
    };
  }];
};
```

### Serving

BookStack needs to know the domain on which it runs and the URL used to access it:

``` nixos
services.bookstack.hostname = "kb.example.com";
services.bookstack.settings.APP_URL = "http://kb.example.com";
```

To go further, it is useful to know that BookStack uses Laravel. So, for example, to use S3 instead of the local filesystem, check Laravel's documentation on file storage and the service definition.

## Tips and tricks

### Changing the default port Nginx listens on

``` nixos
services.bookstack.nginx.listen = [
 { addr = "[::]"; port = 8080; ssl = false;}
 { addr = "0.0.0.0"; port = 8080; ssl = false;}
 { addr = "[::]"; port = 8443; ssl = true;}
 { addr = "0.0.0.0"; port = 8443; ssl = true;}
]
```

## Troubleshooting

### "No such file or directory" in bookstack-setup

You need to connect Bookstack to a MySQL database, the service definition can install and configure one on your system with `services.bookstack.database.createLocally = true;`, otherwise you need to configure it yourself.

### "An unknown error occurred" when viewing your wiki in a browser

If you set up BookStack with NixOS \< 25.11, you might have used an un-prefixed base64-encoded app key. Make sure your app key file contents include the "base64:" prefix.

### Logs locations

With the default settings, BookStack logs can be found under `/var/lib/bookstack/storage/logs/`.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
