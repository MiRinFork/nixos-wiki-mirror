<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PostgreSQL -->

[PostgreSQL](https://www.postgresql.org/) also known as Postgres, is a free and open-source relational database management system (RDBMS) emphasizing extensibility and SQL compliance.

This article extends the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-postgresql).

### Getting started

To try out Postgresql add the following minimal example to your <a href="NixOS_modules" class="wikilink" title=" NixOS module"> NixOS module</a>:

``` nix
{
  # ...
  config.services.postgresql = {
    enable = true;
    ensureDatabases = [ "mydatabase" ];
    authentication = pkgs.lib.mkOverride 10 ''
      #type database  DBuser  auth-method
      local all       all     trust
    '';
  };
}  
```

This will setup Postgresql with a default DB superuser/admin "postgres", a database "mydatabase" and let every DB user have access to it without a password through a "local" Unix socket "/var/run/postgresql" (TCP/IP is disabled by default because it's less performant and less secure).

- [Available NixOS Postgresql service options](https://search.nixos.org/options?query=services.postgresql)

It's also possible to setup PostgreSQL with <a href="Nix_Darwin" class="wikilink" title="Nix Darwin">Nix Darwin</a> similar to how you would on NixOS, see the [options](https://daiderd.com/nix-darwin/manual/index.html#opt-services.postgresql.enable).

###### Beginner's Note:

If you are studying Postgres by following its [official tutorial](https://www.postgresql.org/docs/current/tutorial.html), you would find that the `pg_config` executable is missing [1](https://github.com/NixOS/nixpkgs/issues/408785). To obtain `pg_config`, use the `pg_config` attribute of the `postgresql` package as in:

``` nix
{
  # ...
  config.services.postgresql.package = pkgs.postgresql.pg_config;
}  
```

### Verify setup

You can use `psql` that comes with Postgres in the terminal to verify that the DB setup is as expected:

``` bash
 $ sudo -u postgres psql
psql
Type "help" for help.

postgres=# 
```

We have to switch to a system user like "postgres" with `sudo -u postgres`, because by default `psql` logs you into the DB user of the same name as the current Linux/system user. By default, NixOS creates a system and DB user names "postgres". So the line `postgres=#` shows that we are now logged-in as DB user "postgres".

Inside `psql` here the most frequent commands are:

List all databases running on this Postgres instance with `\l`:

``` bash
postgres=# \l
                                   List of databases
    Name    |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges    
------------+----------+----------+-------------+-------------+------------------------
 mydatabase | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =Tc/postgres          +
            |          |          |             |             | postgres=CTc/postgres +
            |          |          |             |             | rustnixos=CTc/postgres
 postgres   | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | 
 template0  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres           +
            |          |          |             |             | postgres=CTc/postgres
 template1  | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres           +
            |          |          |             |             | postgres=CTc/postgres
(4 rows)
```

List all DB users (also called "roles" in Postgres) with `\du`:

``` bash
postgres=# \du
                                   List of roles
 Role name |                         Attributes                         | Member of 
-----------+------------------------------------------------------------+-----------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
```

List all authentication rules (called an "pg_hba.conf" file in Postgres ) with `table pg_hba_file_rules;`:

``` bash
postgres=# table pg_hba_file_rules;
 line_number | type  | database | user_name | address | netmask | auth_method | options | error 
-------------+-------+----------+-----------+---------+---------+-------------+---------+-------
           1 | local | {all}    | {all}     |         |         | peer        |         | 
(1 row)
```

- [Official Postgres authentication pg_hba.conf documentation](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)

### Allow TCP/IP connections

This example shows how to roll out a database with a default user and password:

``` nix
services.postgresql = {
  enable = true;
  ensureDatabases = [ "mydatabase" ];
  enableTCPIP = true;
  # port = 5432;
  authentication = pkgs.lib.mkOverride 10 ''
    #type database DBuser origin-address auth-method
    local all      all     trust
    # ... other auth rules ...

    # ipv4
    host  all      all     127.0.0.1/32   trust
    # ipv6
    host  all      all     ::1/128        trust
  '';
  initialScript = pkgs.writeText "backend-initScript" ''
    CREATE ROLE nixcloud WITH LOGIN PASSWORD 'nixcloud' CREATEDB;
    CREATE DATABASE nixcloud;
    GRANT ALL PRIVILEGES ON DATABASE nixcloud TO nixcloud;
  '';
};
```

This will allow "host" based authentification only from other webservices on the same computer ("127.0.0.1"), although any DB user will have access to any database.

### Set the Postgresql versions

By default, NixOS uses whatever Postgres version shipped as default for your [system.stateVersion](https://search.nixos.org/options?show=system.stateVersion).

To use a different or more recent version, you can manually set one of the [available Nixpkgs Postgresql versions](https://search.nixos.org/packages?query=postgresql_):

``` nix
services.postgresql = {
  enable = true;
  package = pkgs.postgresql_15;
  # ...
};
```

Note that changing the package version does not trigger any automatic migrations of your existing databases — follow <a href="#Major_upgrades" class="wikilink" title="#Major upgrades">#Major upgrades</a> to migrate existing databases.

### Security

Letting every system and DB user have access to all data is dangerous. Postgres supports several layers of protection. One is to **prefer "local" connections using Unix sockets**, that aren't accessible from the internet, whenever Postgres and your client app run on the same server.

#### Harden authentication

We can **limit what system user can connect**.

Postgres supports ["user name maps"](https://www.postgresql.org/docs/current/auth-username-maps.html), which limit which system users can log in as which DB user:

``` nix
services.postgresql = {
  enable = true;
  ensureDatabases = [ "mydatabase" ];
 
  identMap = ''
    # ArbitraryMapName systemUser DBUser
       superuser_map      root      postgres
       superuser_map      postgres  postgres
       # Let other names login as themselves
       superuser_map      /^(.*)$   \1
  '';
};
```

This map can have an arbitrary name and defines which system user can login as which DB user. Every other user and combination is rejected. For example, with the above mapping if we are logged-in as system user "root" but want enter the DB as DB user "postgres" we would be allowed:

``` nix
root$ psql -U postgres
# ok
```

#### Limit Access

Once logged-in we can **limit what DB users can access**. With the `authentication` we can limit what DB user can access which databases. A good default setting is as follows:

``` nix
services.postgresql = {
  enable = true;
  ensureDatabases = [ "mydatabase" ];
  authentication = pkgs.lib.mkOverride 10 ''
    #type database  DBuser  auth-method optional_ident_map
    local sameuser  all     peer        map=superuser_map
  '';
};
```

With "sameuser" Postgres will allow DB user access only to databases of the same name. E.g. DB user "mydatabase" will get access to database "mydatabase" and nothing else. The part `map=superuser_map` is optional. One exception is the DB user "postgres", which by default is a superuser/admin with access to everything.

### Monitoring

A <a href="Prometheus" class="wikilink" title="Prometheus">Prometheus</a> exporter is available to export metrics to Prometheus-compatible storage.

``` nix
services.prometheus.exporters.postgres = {
    enable = true;
    listenAddress = "0.0.0.0";
    port = 9187;
};
```

[See all available options for services.prometheus.exporters.postgres](https://search.nixos.org/options?show=services.prometheus.exporters.postgres.dataSourceName&from=0&size=50&sort=relevance&type=packages&query=services.prometheus.exporters.postgres)

## Remote Access

### TLS

To turn TLS on in recent versions of postgres it's pretty easy. Their [docs](https://www.postgresql.org/docs/current/ssl-tcp.html) are pretty good.

Create a simple cert just to make it work. If you are doing this in production, you need to provide your own server.crt and server.key in the main PGDATA dir (~postgres).

In a shell:

``` nix
cd ~postgres
sudo -u postgres openssl req -new -x509 -days 365 -nodes -text -out server.crt  -keyout server.key -subj "/CN=dbhost.yourdomain.com"
chmod og-rwx server.key
```

Then in your nix configuration:

``` nix
services.postgresql = {
    enable = true;
    package = pkgs.postgresql_16;
    enableTCPIP = true;
    ensureDatabases = [ "tootieapp" ];
    settings = {
        ssl = true;
    };
    authentication = pkgs.lib.mkOverride 10 ''
      #type database  DBuser  auth-method
      local all       all     trust
      host  sameuser    all     127.0.0.1/32 scram-sha-256
      host  sameuser    all     ::1/128 scram-sha-256
    '';
  };
```

the \`sameuser\` mentioned in the authentication section requires the database name be the same as the username, which you may not want, you can change that to \`all\` to allow an authenticated user the ability to connect to any database.

\`scram-sha-256\` is the require a password option, but you can authenticate a variety of different ways, see the official docs for other options as part of pg_hba.conf.

### User creation

NixOS can declaratively create or manage Postgres users with passwords.

Postgres allows specifying the password as plaintext, MD5 hash or SCRAM-SHA-256 hash. For declarative configuration, the recommended format is SCRAM-SHA-256 and a hash can be obtained from a valid password for example using the following script:

``` python3
#!/usr/bin/env nix-shell
#! nix-shell -i python3 -p "python3.withPackages (ps: [ps.scramp])"
import scramp, base64

PASSWORD = 'secure_password123!'

m = scramp.ScramMechanism()
salt, stored_key, server_key, iteration_count = m.make_auth_info(PASSWORD)
print(f"SCRAM-SHA-256${iteration_count}:{base64.b64encode(salt).decode()}${base64.b64encode(stored_key).decode()}:{base64.b64encode(server_key).decode()}")
```

Using this hash, we can then extend the above configuration as follows:

``` nix
services.postgresql = {
  enable = true;
  package = pkgs.postgresql_16;
  enableTCPIP = true;
  ensureDatabases = [ "tootieapp" ];
  settings = {
      ssl = true;
  };
  authentication = pkgs.lib.mkOverride 10 ''
    #type database  DBuser  auth-method
    local all       all     trust
    host  sameuser    all     127.0.0.1/32 scram-sha-256
    host  sameuser    all     ::1/128 scram-sha-256
  '';
  ensureUsers = [
    {
      name = "tootieapp";
      ensureDBOwnership = true;
      ensureClauses = {
        login = true;
        password = "SCRAM-SHA-256$4096:lB4tguN+gvNVSqk0zGRPHQ==$zh48o1bb9tuRjvGQHh/CeobEyUI4u91rp0K9who8m3I=:mHxc6obGad8/g65+V3C84UQGHIK41Gfx32+xXSZiOss=";
      };
    }
  ];
};
```

For more details on how to create hashes from valid passwords also refer to <https://gist.github.com/jkatz/e0a1f52f66fa03b732945f6eb94d9c21>

## Debugging with `psql`

To debug the SQL statements futher, one can use **systemctl cat postgresql** and see the **ExecStartPost=/nix/store/rnv1v95bbf2lsy9ncwg7jdwj2s71sqra-unit-script/bin/postgresql-post-start** line. Then open it with \`cat\` on the shell and see the **psql** command.

Then execute the complete statement on the shell, as:

    /nix/store/3mqha1naji34i6iv78i90hc20dx0hld9-sudo-1.8.20p2/bin/sudo -u postgres psql -f "/nix/store/az5nglyw7j94blxwkn2rmpi2p6z9fbmy-backend-initScript" --port=5432 -d postgres
    psql:/nix/store/az5nglyw7j94blxwkn2rmpi2p6z9fbmy-backend-initScript:1: ERROR:  syntax error at or near "-"
    LINE 1: CREATE ROLE nixcloud-admin WITH LOGIN PASSWORD 'nixcloud' CR...
                                ^
    psql:/nix/store/az5nglyw7j94blxwkn2rmpi2p6z9fbmy-backend-initScript:2: ERROR:  database "nixcloud-db1" already exists
    psql:/nix/store/az5nglyw7j94blxwkn2rmpi2p6z9fbmy-backend-initScript:3: ERROR:  syntax error at or near "-"
    LINE 1: ...ALL PRIVILEGES ON DATABASE "nixcloud-db1" TO nixcloud-admin;
                                                                    ^

## Troubleshooting

### Connection rejected with "Role does not exist"

``` nix
$ psql
psql: error: connection to server on socket "/run/postgresql/.s.PGSQL.5432" failed: FATAL:  role "root" does not exist
```

You are trying to login as a system user ("root" in this example) that has no DB user of the same name. Try `psql -U postgres` or `sudo -u postgres psql` to log in as a different DB user.

### Connection rejected with "Peer authentication failed"

``` nix
root$ psql -U postgres
psql: error: connection to server on socket "/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "postgres"
```

You are trying to login as a DB user ("postgres" in this example) for which your current system user ("root" in this example) has no permission to switch to. Check your "user name map" in the `identMap` section.

### WARNING: database "XXX" has a collation version mismatch

The complete error which appears in the system log might look similar to this

    WARNING:  database "outline" has a collation version mismatch
    DETAIL:  The database was created using collation version 2.35, but the operating system provides version 2.38.
    HINT:  Rebuild all objects in this database that use the default collation and run ALTER DATABASE outline REFRESH COLLATION VERSION, or build PostgreSQL with the right library version.

To fix it, run following commands in the psql console. Replace the database name `outline` with the name of the database which you want to migrate

    sudo -u postgres psql
    postgres=# \c outline;
    outline=# REINDEX DATABASE outline;
    outline=# ALTER DATABASE outline REFRESH COLLATION VERSION;

## Major upgrades

If you're using NixOS' modules for PostgreSQL and find yourself in a boot/switch after a major bump of it, you'll need to upgrade your cluster.

Let the service successfully start once, and then stop it. Upon completion, proceed with the following command, substituting the numbers 15 and 16 with the respective versions you previously used and the more recent one:

    sudo -u postgres pg_upgrade -b "$(nix build --no-link --print-out-paths nixpkgs#postgresql_15.out)/bin" -B /run/current-system/sw/bin -d /var/lib/postgresql/15 -D /var/lib/postgresql/16

If this fails with the `Only the install user can be defined in the new cluster` message, you might have some luck using `initdb` to create the data directory by hand instead of relying on the `postgresql` systemd service to do that.

Following the example above - upgrading to Postgresql 16 - you'd do:

    rm -rf /var/lib/postgresql/16  
    sudo -u postgres initdb -D /var/lib/postgresql/16
    sudo -u postgres pg_upgrade ...

Triple check you're not actually `rm -rf`'ing your actual (previous) database! This is meant to remove only the empty database created by the newer Postgresql version, so that `initdb` starts with a clean slate.

[NixOS manual](https://nixos.org/manual/nixos/stable/#module-postgresql) also contains useful information about this kind of upgrades.

=== Upgrading versions \<18 to \>=18 === Starting with v18, `initdb` defaults to enabling data checksums. This will prevent you from being able to upgrade from previous versions that did not have checksumming enabled, as `pg_upgrade` requires matching cluster checksum settings[^1].

To maintain compatibility with a previous database, you may disable checksumming when creating the new database by using the appropriate option, `initdb --no-data-checksums ...`.

Alternatively, you can enable checksumming on the previous database with relatively little effort using `pg_checksums --pgdata={OLD_DATA_DIR} --enable --progress`. This must be done using the binary from the current postgres version, not from the version you wish to upgrade to.

## See also

- [Available NixOS service options](https://search.nixos.org/options?query=services.postgresql)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Database" class="wikilink" title="Category:Database">Category:Database</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>

[^1]: <https://www.postgresql.org/docs/release/18.0/>
