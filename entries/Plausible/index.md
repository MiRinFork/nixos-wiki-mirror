<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plausible -->

[Plausible](https://plausible.io/) is a privacy-friendly alternative to Google analytics.

## Setup

At first, a secret key is needed to be generated. This can be done with e.g.

``` bash
openssl rand -base64 64
```

After that, `plausible` can be deployed like this:

``` nix
services.plausible = {
  enable = true;
  adminUser = {
    # activate is used to skip the email verification of the admin-user that's
    # automatically created by plausible. This is only supported if
    # postgresql is configured by the module. This is done by default, but
    # can be turned off with services.plausible.database.postgres.setup.
    activate = true;
    email = "admin@localhost";
    passwordFile = "/run/secrets/plausible-admin-pwd";
  };
  server = {
    baseUrl = "http://analytics.example.org";
    # secretKeybaseFile is a path to the file which contains the secret generated
    # with openssl as described above.
    secretKeybaseFile = "/run/secrets/plausible-secret-key-base";
  };
};
```

After applying the configuration Plausible will be available at <http://localhost:8000>.

## Usage

### Adding users

The easiest way is to temporarily enable registration with the setting

``` nix
services.plausible = {
  server = {
    [...]
    disableRegistration = false;
  };
};
```

Then go to <http://localhost:8000/register> to add additional users and sites.

## See also

- Documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-plausible).

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
