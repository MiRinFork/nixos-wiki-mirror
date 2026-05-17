<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kanboard -->

[Kanboard](https://github.com/kanboard/kanboard) is a free and open-source project management software that uses the Kanban methodology. It provides a simple, self-hosted web interface to visualize tasks, workflows, and project progress. Kanboard supports multiple authentication backends and database systems, including SQLite, MySQL, and PostgreSQL.

### Using PostgreSQL with Unix Socket

Kanboard supports PostgreSQL as an alternative to SQLite. To use PostgreSQL as the database backend, enable and configure both services as shown below:

``` nixos
{ config, ... }:

let
  cfg = config.services.kanboard;
  db = {
    user = cfg.user;
    name = "kanboard";
  };
in
{
  services.kanboard = {
    enable = true;

    # Configure Kanboard to use PostgreSQL
    settings = {
      DB_DRIVER = "postgres";
      DB_HOSTNAME = "/var/run/postgresql";
      DB_USERNAME = db.user;
      DB_NAME = db.name;
    };
  };

  services.postgresql = {
    enable = true;
    ensureDatabases = [ db.name ];
    ensureUsers = [
      {
        name = db.user;
        ensureDBOwnership = true;
      }
    ];
  };
}
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
