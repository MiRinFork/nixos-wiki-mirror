<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mysql -->

[MySQL](https://www.mysql.com) and [MariaDB](https://mariadb.org) are installed via the same services.mysql configuration.

- MySQL is a widely used open source relational database management system (RDBMS) that offers various features, tools, and services for data warehousing, analytics, machine learning, and more.
- MariaDB is a popular and stable fork of MySQL that is compatible with MySQL and has additional enhancements and features.

# Setup MySQL

Setup and enable Mysql database daemon (in this example: latest stable version in nixpkgs)

``` nix
services.mysql = {
  enable = true;
  package = pkgs.mysql;
};
```

# Setup MariaDB

Setup and enable MariaDB database daemon (in this example: version 11.0)

``` nix
services.mysql = {
  enable = true;
  package = pkgs.mariadb_110;
};
```

# Tips

install [mycli](https://github.com/dbcli/mycli) to get autocompletion when working with mysql/mariadb

``` nix
environment.systemPackages = [ pkgs.mycli ];
```

# Maintenance

## Upgrade

NixOS will not run `mysql_upgrade` automatically for you after upgrading to a new major version, because it is a "dangerous" operation (can lead to data corruption) and users are strongly advised (by MariaDB upstream) to backup their database before running `mysql_upgrade`.

``` nix
mysqldump -u root -p --all-databases > alldb.sql
```

After backup is completed, you can proceed with the upgrade process

``` nix
mysql_upgrade
```

<a href="Category:Database" class="wikilink" title="Category:Database">Category:Database</a>
