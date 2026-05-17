<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Radarr -->

[Radarr](https://radarr.video/) is a movie collection manager for Usenet and BitTorrent users. It can monitor multiple RSS feeds for new movies and will interface with clients and indexers to grab, sort, and rename them. It can also be configured to automatically upgrade the quality of existing files in the library when a better quality format becomes available. Note that only one type of a given movie is supported. If you want both an 4k version and 1080p version of a given movie you will need multiple instances.

# Setup

Radarr is best installed as a service on NixOS in your configuration.nix.

A basic install can be done using the following options:

``` nix
services.radarr = {
  enable = true;
  openFirewall = true;
};
```

The `openFirewall` option is used to open port `7878` on the host firewall.

# Further configuration

Radarr can be further configured using NixOS options.

``` nix
services.radarr = {
  #...
  user = "user";
  group = "group";
  dataDir = "path/to/directory";
};
```

Both the `user` and `group` options are used to specify which user and group is used to run Radarr. The `dataDir` option specifies the directory where Radarr stores its data files, and can be set to a custom location. When setting the `dataDir` option, be careful of permissions as a specified user still needs the correct read/write permissions in this directory.

# Postgresql configuration

Radarr uses SQLite by default. It can be configured to use PostgreSQL.

``` nix
services.radarr = {
  #...
  settings = {
    postgres.host = "127.0.0.1";
    postgres.logdb = "radarr-log";
    postgres.maindb = "radarr-main";
    postgres.password = config.services.radarr.user;
    # Not secure if the port is exposed
    postgres.user = config.services.radarr.user;
    server.port = 7878;
  };
};

services.postgresql = {
  authentication = ''
    # this is for local database access with psql
    local all all trust
    # this is for radarr to connect
    host all ${config.services.radarr.user} 127.0.0.1/32 trust
    host all ${config.services.radarr.user} ::1/128      trust
  '';
  enable = true;
  ensureDatabases = [
    "radarr-log"
    "radarr-main"
  ];
  ensureUsers = [
    {
      name = config.services.radarr.user;
      # required for table creation
      ensureClauses.superuser = true;
    }
  ];
};
```

This is a minimal configuration to ensure that the necessary databases are created and accessible to Radarr. See the [Radarr Postgres Setup](https://wiki.servarr.com/radarr/postgres-setup) wiki page for information about the databases necessary, supported versions, and migrations. See the [Radarr Environment Variables](https://wiki.servarr.com/radarr/environment-variables) wiki page for information about settings.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
