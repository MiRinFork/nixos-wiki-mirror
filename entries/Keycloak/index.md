<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Keycloak -->

**[Keycloak](https://keycloak.org/)** (<a href="wikipedia:en:Keycloak" class="wikilink" title="Wikipedia">Wikipedia</a>) is identity and access management software, and can serve as an authentication server for applications (providing support for OpenID Connect, OAuth 2.0, and SAML).

For official documentation on Keycloak please consult the [NixOS manual](https://nixos.org/manual/nixos/stable/index.html#module-services-keycloak).

## Setup

Following configuration will enable a minimal and insecure Keycloak instance for **testing purpose**.

``` nix
environment.etc."keycloak-database-pass".text = "PWD";
services.keycloak = {
  enable = true;
  settings = {
    hostname = "localhost";
    http-enabled = true;
    hostname-strict-https = false;
  };
  database.passwordFile = "/etc/keycloak-database-pass";
};
```

After applying the configuration the Keycloak management interface will be available at <http://localhost>. Login with username `admin` and password `changeme`.

## Configuration

### Importing realms

Using the realmFiles option, it is possible provision a realm from a JSON file or previous JSON export.

``` nix
{ ... }: let

  realm = {
    realm = "OIDCDemo";
    enabled = true;
    clients = [{
      clientId = "mydemo";
      rootUrl = "http://localhost:8080";
    }];
    users = [{
      enabled = true;
      firstName = "Christian";
      lastName = "Bauer";
      username = "cbauer";
      email = "cbauer@localhost";
      credentials = [{
        type = "password";
        temporary = false;
        value = "changeme";
      }];
    }];
  };

in {

  services.keycloak = {
    realmFiles = [
      (pkgs.writeText "OIDCDemo.json" (builtins.toJSON realm))
    ];
  };

}
```

## Tips and tricks

### Installation in subdirectory

Keycloak may be installed in a subdirectory of a domain. Thus you don't need to configure and expose a subdomain. For example with the following configuration, remember to edit `domain.tld`, reflecting your used domain.

### Keycloak themes on NixOS

You need to create a package for your custom theme and configure the keycloak service to use it

Here is a what a basic theme will look like :

`   - configuration.nix`  
`   - keycloak`  
`       - custom_theme`  
`           - login`  
`               - resources`  
`                   - css`  
`                       - custom.css `  
`                  - theme.properties`  
`       - default.nix <- set of packages to be imported in your configuration.nix`  
`       - keycloak_custom_theme.nix <- package for your theme`

#### Create a theme

#### Create a package

#### Create a packages set

#### Configure your keycloak service

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
