<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Drupal -->

[Drupal](https://drupal.org/) is a self-hosted content management system with an eye towards enterprise usage, custom development, internationalization, accessibility, and open source software. It has a large ecosystem of [user-contributed plugins](https://drupal.org/project/project_module) and [themes](https://www.drupal.org/project/project_theme) that can be used to extend its capabilities, the vast majority of of which are free to use and do not feature any standing subscription costs.

## Installation

A simple installation can be implemented with the following setup

``` nix
services.drupal.enable = true;
```

This will spin up a simple Drupal installation at <http://localhost> using nginx and MYSQL.

This configuration is functionally identical to writing:

``` nix
services.drupal = {
  enable = true;
  sites = {
    "localhost" = {
      enable = true;
    };
  };
};
```

### After Installation

After installing Drupal using nix, visit the hostname you configured in a web browser and inspect the website. If this is your first time accessing this environment, and you haven't manually imported a database, you will probably need to go through the standard Drupal UI installation process.

> **Note:** If you install Drupal using the UI, Drupal will make some changes to the `settings.php` file located at `/var/lib/drupal/`<hostname>`/sites/default/settings.php`. These changes **will be overridden** next time you rebuild your Drupal project from a newer source. In order to preserve these changes, make sure to add the automatically generated PHP to the `extraConfig` attribute of your configuration file. You can usually find this located at the bottom of the `settings.php` file.
>
> ``` nix
>
> # Example code, do not use this directly. Instead, copy the contents at the end of your settings.php file and place them here.
> services.drupal.sites."localhost".extraConfig = ''
> // Automatically generated code from Drupal install time.
> $databases['default']['default'] = array (
>   'database' => 'drupal',
>   'username' => 'drupal',
>   'password' => 'drupal',
>   'prefix' => "",
>   'host' => 'localhost',
>   'port' => '3306',
>   'isolation_level' => 'READ COMMITTED',
>   'driver' => 'mysql',
>   'namespace' => 'Drupal\\mysql\\Driver\\Database\\mysql',
>   'autoload' => 'core/modules/mysql/src/Driver/Database/mysql/',
> );
> '';
> ```

#### Capturing Server Resources Before Your Next Rebuild

After installing Drupal on NixOS using the admin UI, you will want to export the MYSQL database of your website and export the Drupal site configuration. Doing both steps makes it possible to implement continuous integration and continuous delivery on the environment you just created.

Backing up your Drupal configuration (with git or similar) and database is recommended, especially after a successful install of a new Drupal instance.

> **Warning:** When using a Drupal package that has an existing set of configuration in the config sync directory (or using the configRoot option in nix), it is **mandatory** to import a working SQL database from another working installation. Failing to do so will cause your website to not function correctly.
>
> The advised development workflow for starting a Drupal website (or websites) on NixOS is to do the following
>
> 1.  Install a new instance of Drupal on NixOS. The configRoot option should be disabled.
> 2.  Once the installation is complete, export the database, and export the configuration. See the sections below on the recommended way to do both of these tasks.
> 3.  Integrate the contents of the config sync directory (located, by default, at /var/lib/drupal/<hostname>/config) back into your upstream Drupal package.
> 4.  During your next rebuild, make sure to import any configuration changes by visiting **Manage \> Configuration \> Development \> Configuration synchronization** in the Drupal admin.
> 5.  If you intend on deploying this exact same site elsewhere, take regular backups of your database.
> 6.  Deploy your saved database and the source code into a new instance of Drupal on NixOS at the same time to avoid a chicken-and-egg scenario.

##### Exporting The Database

As root, you can export the database to a local backup using bash script like this.

``` bash
DATE="$(date +'%F-%T')"
BACKUP_DIR="/var/lib/drupal/sql-backups/$DRUPAL_HOSTNAME" # Replace the hostname with your Drupal hostname from services.drupal.sites.<hostname>.

mkdir -p "$BACKUP_DIR"

# Replace the variables in this line with the values defined in your services.drupal configuration.
mariadb-dump -u root -$DB_NAME -P $DB_PORT -h $DB_HOST | gzip > "$BACKUP_DIR/$DATE-$DRUPAL_HOSTNAME-auto-backup.sql.gz"
```

> **Note:** The `$DB_NAME`, `$DB_PORT`, and `$DB_HOST` variables in the above script need to be replaced with actual values from your Drupal configuration. By default, these values are `drupal`, `3306`, and `localhost`, respectively.
>
> Likewise, replace instances of `$DRUPAL_HOSTNAME` with the hostname you defined under `services.drupal.sites.`<hostname>

##### Exporting The Configuration

Refer to this guide on Drupal.org for how to [export your configuration yamls](https://www.drupal.org/docs/administering-a-drupal-site/configuration-management/managing-your-sites-configuration).

Drupal uses the files in the config sync directory as a way to implement the concept of "migrations" that you find in many other web frameworks like Ruby on Rails or Django. Whenever you change certain settings in the backend of your website, Drupal can export those database changes into a file to preserve that change in code. Config changes made on a lower environment can then be pushed up to a higher environment as code and imported to change the database in a predictable way.

Configuration on a Drupal instance in NixOS will be synchronized to the location defined by the `configSyncDir` option in your nix configuration. By default, this location is set to `/var/lib/drupal/`<hostname>`/config/sync`.

When you export your Drupal configuration on NixOS, make sure to save this configuration in another location immediately afterward, or it may be overridden on the next rebuild or on the next reboot.

Generally, you should integrate the config you export from the NixOS environment back into a git repo that also contains your Drupal source code. This will ensure that the Drupal instance you deploy into NixOS can import any config changes from git.

If your Drupal package comes with configuration in a config sync directory (or similar), make sure to tell NixOS where to find it with this expression.

``` nix
# Tell NixOS where to look for the config sync directory in the Drupal package.
services.drupal.sites."my-host-name.local".configRoot = "/config";

# The contents of the /config directory (defined above) will be copied into the path defined by the configSyncDir setting MINUS the trailing "/sync" path, if it exists.
services.drupal.sites."my-host-name.local".configSyncDir = "/var/lib/drupal/my-host-name.local/config/sync";
```

If you use the default setting for `configSyncDir`, you can simply add the first line of code and substitute your hostname.

## Configuration

### Configuration Using settings.php

Drupal uses a file called `settings.php` to configure the application at a low level. If you use the NixOS-provided Drupal package instead of a custom package, you may want to change some of these settings.

You can do this by writing pure PHP into the `services.drupal.sites.`<name>`.extraSettings` key

``` nix
services.drupal = {
  enable = true;
  sites = {
    "localhost" = {
      enable = true;
      extraConfig = ''
        // These settings will be printed as pure PHP into a file visible to settings.php.
        // These settings will be appended to, and thus override, any existing settings
        // at the same namespace.
        $config['user.settings']['anonymous'] = 'Visitor';
        $settings['entity_update_backup'] = TRUE;
      '';
    };
  };
};
```

### Webserver Configuration

You can use either <a href="nginx" class="wikilink" title="nginx">nginx</a> or <a href="caddy" class="wikilink" title="caddy">caddy</a> as the webserver, but only one may be used at a time. All Drupal installations on NixOS will use the same configured webserver, though webserver configuration may be customized for each installation.

Nginx is the default webserver, though you can use caddy by writing this configuration

``` nix
services.drupal.webserver = "caddy";
```

#### How To Access Files In The State Directory As A Regular User

At install time, a small set of user-editable files get copied to `/var/lib/drupal/`<sitname> and are free to be changed by system users so long as they have been added to the webserver group. If the user has not been added to the webserver group, they will be denied access to any resources.

The group name you must use depends on your currently configured webserver settings. Once you make your changes, you must log in and back out again, or change your current group using `newgrp`.

##### For Nginx

``` nix
users.users.<user>.extraGroups = ["nginx"];
```

##### For Caddy

``` nix
users.users.<user>.extraGroups = ["caddy"];
```

### Database Configuration

The NixOS implementation of Drupal uses MySQL as the primary database, however you can [add other databases using settings.php](https://www.drupal.org/docs/7/creating-custom-modules/howtos/how-to-connect-to-multiple-databases-within-drupal#s-drupal-8). Refer to the <a href="Drupal#Configuration_Using_settings.php" class="wikilink" title="Configuration Using settings.php">Configuration Using settings.php</a> section above for instructions on how to add extra settings to `settings.php`.

Using nix, you can configure the database that gets created in NixOS at install time by using this configuration interface:

``` nix
services.drupal = {
  enable = true;
  sites = {
    "localhost" = {
      enable = true;
      database = {
        user = "database_user";                # Default is "drupal"
        tablePrefix = "tblprfx_";              # Not set by default
        socket = /path/to/mysqld/mysqld.sock;  # Default is /run/mysqld/mysqld.sock
        port = 3306;                           # Default is 3306  
        passwordFile = /path/to/password/file; # Not set by default
        name = "database_name";                # Default is "drupal"
        host = "database.host.local";          # Default is localhost
        createLocally = true;                  # Set to false if you want to use a remote DB
      };
    };
  };
};
```

> **Note:** The database settings configured in NixOS will merely create the database, they will not instruct a new Drupal installation where to find the database. Either define your database settings in `settings.php`, or see <a href="Drupal#After_Installation" class="wikilink" title=" After Installation"> After Installation</a> for an example of how to do this with nix.

### Hostname Configuration

The hostname string configured under `services.drupal.sites.`<sitename> can be used to create a publicly accessible hostname for your website. However, the Drupal service does not do this by default.

In order to modify your `/etc/hosts` file, use this configuration in conjunction with your site config.

``` nix
services.drupal = {
  enable = true;
  sites = {
    "mysite.com" = {
      enable = true;
    };
  };
};

# Enumerate our custom host into /etc/hosts
networking.hosts = {
  "127.0.0.1" = ["localhost" "mysite.com"];
};
```

## State Directory

The state directory is a small set of user-editable files that gets installed into `/var/lib/drupal/`<sitename> when the Drupal service is first activated. It contains a truncated Drupal file tree where system users can upload and manage certain files that affect the state of the web application.

This is the file structure you can find at a typical installation

``` bash
$ pwd
/var/lib/drupal/localhost
$ ls
config  modules  private  sites  themes
```

Files in this directory, because of their tendency to change during run time, cannot live inside of `/nix/store`, so they are placed here instead.

The webserver is the default owner of all files in the state directory and regular users are not permitted to access this directory by default. However, users who belong to the webserver group may edit or upload files.

Refer to <a href="Drupal#How_To_Access_Files_In_The_State_Directory_As_A_Regular_User" class="wikilink" title="How To Access Files In The State Directory As A Regular User">How To Access Files In The State Directory As A Regular User</a> for more information on how to add users to the webserver group.

### Uploading Modules and Themes

The `modules` and `themes` directories of the state directory are symlinked directly to the Drupal installation in the nix store. Users can upload both [modules and themes](https://www.drupal.org/docs/user_guide/en/extend-manual-install.html) to these directories and Drupal will detect them.

This is not the officially [recommended method](https://www.drupal.org/docs/extending-drupal/installing-modules) for installing contributed modules and themes, or modules and themes that have third-party dependencies. However, this functionality has been preserved both as an escape hatch, and to provide an easy way to manage a simple Drupal install that doesn't rely exclusively on [composer](https://getcomposer.org/).

### Changing The Location Of The State Directory

If you want the state directory to be located in a different part of the system, you can use the following configuration to change where it is created

``` nix
services.drupal.sites."localhost".stateDir = /path/to/custom/state/dir;
```

> **Note**: Changing the state directory does not automatically change the location of the `modules`, `themes`, `config`, or `files` directories. You can override those locations by using the `modulesDir` and `themesDir`, `configDir`, `filesDir` keys, accordingly.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:PHP" class="wikilink" title="Category:PHP">Category:PHP</a>
