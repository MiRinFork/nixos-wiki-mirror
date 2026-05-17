<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dolibarr ERP & CRM -->

Dolibarr ERP CRM is a modern software package to manage your company or foundation's activity . Configuration is handled using the options.

## First login for preinstalled installs

Assuming that `myhost.org` resolves to the ip address of your host, port 80 has been opened and `/run/keys/dolibarr-db-ini-password` contains the plain-text password for the dolibarr mysql user.

``` nix
services.dolibarr = {
  enable = true;
  domain = "myhost.org";
  preInstalled = true;
  initialDbPasswordFile = "/run/keys/dolibarr-db-ini-password";
};
```

This will configure dolibarr to serve on `myhost.org`, a prefilled database will be provisioned. The following credentials will be configured for the dolibarr admin user:

| Login    | `dolibarrlogin`         |
|----------|-------------------------|
| Password | `123dolibarrlogin_pass` |

Once you're logged in, please make sure to change those default credentials.

## First login for manual installs

### Configure the database (unless `initialDbPasswordFile`)

If you've provided a non-null value for `services.dolibarr.initialDbPasswordFile`, please skip to the next step. Otherwise, you'll have to create the `dolibarr` user and configure its password in mysql before going on. This can simply be done with:

    $ mysql -u root # root is passwordless by default
    MariaDB [(none)]>CREATE USER IF NOT EXISTS 'dolibarr'@'localhost' IDENTIFIED WITH mysql_native_password;
    MariaDB [(none)]>GRANT ALL PRIVILEGES ON dolibarr.* TO 'dolibarr'@'localhost';
    MariaDB [(none)]>SET PASSWORD FOR 'dolibarr'@'localhost' = PASSWORD('mytopsecretpassword');

Now that the database is configured, we can open dolibarr in the browser.

### Start dolibarr install

Go to dolibarr's url in the browser with path /install. If we follow the previous example, the url should be [`http://mydolibarurl/install`](http://mydolibarurl/install).

#### Check page (1st)

On the check page a form should propose different installation options, choose the `FreshInstall` option at the bottom of the list and click on `Start`.

#### Install page (2nd)

On the install page :

- set the `Directory to store uploaded and generated documents` to `/var/lib/dolibarr/documents` (unless you know what you're doing)
- ensure the `Database name` is `dolibarr`
- ensure the `Driver type` is `mysqli`
- ensure the `Database server` is `localhost`
- ensure the `Database port` is `3306`
- ensure the Database `Login` is `dolibarr`
- ensure the Database password for `dolibarr` is the same as the one you've configured manually or with

#### Install step 1 (3rd)

Nothing to do here, just check that the displayed data is correct and continue.

#### Install step 2 (4th)

Again, nothing to do here, just check that the displayed data is correct and continue.

#### Install step 4 (5th) (no that's not a typo XD)

Setup your dolibarr admin user's login and password.

#### Install step 5 (6th)

That's it, you're done, dolibarr is installed.

## Nixops integration

If you're willing to deploy dolibarr threw [NixOps](https://nixos.org/nixops/manual), you can use its key capabilities to delegate the configuration of the database entirely with the help of the option. Here is a nixops machine configuration:

``` nix
{
  deployment = {
    keys.dolibarr-db-ini-password = {
      text = "123dolibarr_pass";
      user = "root";
      group = "root";
      permissions = "0440";
    };
  };

  services.dolibarr = {
    enable = true;
    domain = "146.190.238.159";
    preInstalled = true;
    initialDbPasswordFile = "/run/keys/dolibarr-db-ini-password";
  };
}
```

## Development

The option is made possible by automatically filling the install page form and then dumping the dolibarr database to a file. The dolibarr nixosTests is made for that (and to test if dolibarr still works obviously). To generate a new dump for a preinstalled database, just run:

    $ nix-build -A nixosTests.dolibarr
    $ file result/result/dolibarr-db.sql

The dump file will be stored in `./result/dolibarr-db.sql`

## See more

- [Official Documentation](https://www.dolibarr.org/documentation-home.php)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
