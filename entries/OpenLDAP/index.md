<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenLDAP -->

[OpenLDAP](https://www.openldap.org) is a free, open-source implementation of the Lightweight Directory Access Protocol (LDAP).

### Setup

A minimal local testing server can be run with following configuration

``` nix
services.openldap = {
  enable = true;

  /* enable plain connections only */
  urlList = [ "ldap:///" ];

  settings = {
    attrs = {
      olcLogLevel = "conns config";
    };

    children = {
      "cn=schema".includes = [
        "${pkgs.openldap}/etc/schema/core.ldif"
        "${pkgs.openldap}/etc/schema/cosine.ldif"
        "${pkgs.openldap}/etc/schema/inetorgperson.ldif"
      ];

      "olcDatabase={1}mdb".attrs = {
        objectClass = [ "olcDatabaseConfig" "olcMdbConfig" ];

        olcDatabase = "{1}mdb";
        olcDbDirectory = "/var/lib/openldap/data";

        olcSuffix = "dc=example,dc=com";

        /* your admin account, do not use writeText on a production system */
        olcRootDN = "cn=admin,dc=example,dc=com";
        olcRootPW.path = pkgs.writeText "olcRootPW" "pass";

        olcAccess = [
          /* custom access rules for userPassword attributes */
          ''{0}to attrs=userPassword
              by self write
              by anonymous auth
              by * none''

          /* allow read on anything else */
          ''{1}to *
              by * read''
        ];
      };
    };
  };
};
```

Checkout <https://www.openldap.org/doc/admin26/slapdconf2.html> for more information.

### Setting up a server with SSL certs via ACME

``` nix
  services.openldap = {
    enable = true;

    /* enable plain and secure connections */
    urlList = [ "ldap:///" "ldaps:///" ];

    settings = {
      attrs = {
        olcLogLevel = "conns config";

        /* settings for acme ssl */
        olcTLSCACertificateFile = "/var/lib/acme/${your-host-name}/full.pem";
        olcTLSCertificateFile = "/var/lib/acme/${your-host-name}/cert.pem";
        olcTLSCertificateKeyFile = "/var/lib/acme/${your-host-name}/key.pem";
        olcTLSCipherSuite = "HIGH:MEDIUM:+3DES:+RC4:+aNULL";
        olcTLSCRLCheck = "none";
        olcTLSVerifyClient = "never";
        olcTLSProtocolMin = "3.1";
      };

      children = {
        "cn=schema".includes = [
          "${pkgs.openldap}/etc/schema/core.ldif"
          "${pkgs.openldap}/etc/schema/cosine.ldif"
          "${pkgs.openldap}/etc/schema/inetorgperson.ldif"
        ];

        "olcDatabase={1}mdb".attrs = {
          objectClass = [ "olcDatabaseConfig" "olcMdbConfig" ];

          olcDatabase = "{1}mdb";
          olcDbDirectory = "/var/lib/openldap/data";

          olcSuffix = "dc=example,dc=com";

          /* your admin account, do not use writeText on a production system */
          olcRootDN = "cn=admin,dc=example,dc=com";
          olcRootPW.path = pkgs.writeText "olcRootPW" "pass";

          olcAccess = [
            /* custom access rules for userPassword attributes */
            ''{0}to attrs=userPassword
                by self write
                by anonymous auth
                by * none''

            /* allow read on anything else */
            ''{1}to *
                by * read''
          ];
        };
      };
    };
  };

  /* ensure openldap is launched after certificates are created */
  systemd.services.openldap = {
    wants = [ "acme-${your-host-name}.service" ];
    after = [ "acme-${your-host-name}.service" ];
  };

  security.acme.acceptTerms = true;
  security.acme.defaults.email = "your-email@example.com";

  /* make acme certificates accessible by openldap */
  security.acme.defaults.group = "certs";
  users.groups.certs.members = [ "openldap" ];

  /* trigger the actual certificate generation for your hostname */
  security.acme.certs."${your-host-name}" = {
    extraDomainNames = [];
  };

  /* example using hetzner dns to run letsencrypt verification */
  security.acme.defaults.dnsProvider = "hetzner";
  security.acme.defaults.credentialsFile = pkgs.writeText "credentialsFile" ''
    HETZNER_API_KEY=<your-hetzner-dns-api-key>
  '';
```

### Overlays

It is also possible to add OpenLDAP overlays to your NixOS configuration. For example, you can directly add the very useful "memberof" and "ppolicy" overlays such like this :

``` nix
  services.openldap = {
    enable = true;

    /* enable plain and secure connections */
    urlList = [ "ldap:///" "ldaps:///" ];

    settings = {
      attrs = {
        olcLogLevel = "conns config";

        /* settings for acme ssl */
        olcTLSCACertificateFile = "/var/lib/acme/${your-host-name}/full.pem";
        olcTLSCertificateFile = "/var/lib/acme/${your-host-name}/cert.pem";
        olcTLSCertificateKeyFile = "/var/lib/acme/${your-host-name}/key.pem";
        olcTLSCipherSuite = "HIGH:MEDIUM:+3DES:+RC4:+aNULL";
        olcTLSCRLCheck = "none";
        olcTLSVerifyClient = "never";
        olcTLSProtocolMin = "3.1";
      };

      children = {
        "cn=schema".includes = [
          "${pkgs.openldap}/etc/schema/core.ldif"
          "${pkgs.openldap}/etc/schema/cosine.ldif"
          "${pkgs.openldap}/etc/schema/inetorgperson.ldif"
        ];

        "olcDatabase={1}mdb" = {
          attrs = {
            objectClass = [ "olcDatabaseConfig" "olcMdbConfig" ];

            olcDatabase = "{1}mdb";
            olcDbDirectory = "/var/lib/openldap/data";

            olcSuffix = "dc=example,dc=com";

            /* your admin account, do not use writeText on a production system */
            olcRootDN = "cn=admin,dc=example,dc=com";
            olcRootPW.path = pkgs.writeText "olcRootPW" "pass";

            olcAccess = [
              /* custom access rules for userPassword attributes */
              ''{0}to attrs=userPassword
                  by self write
                  by anonymous auth
                  by * none''

              /* allow read on anything else */
              ''{1}to *
                  by * read''
            ];
          };

          children = {
            "olcOverlay={2}ppolicy".attrs = {
              objectClass = [ "olcOverlayConfig" "olcPPolicyConfig" "top" ];
              olcOverlay = "{2}ppolicy";
              olcPPolicyHashCleartext = "TRUE";
            };

            "olcOverlay={3}memberof".attrs = {
              objectClass = [ "olcOverlayConfig" "olcMemberOf" "top" ];
              olcOverlay = "{3}memberof";
              olcMemberOfRefInt = "TRUE";
              olcMemberOfDangling = "ignore";
              olcMemberOfGroupOC = "groupOfNames";
              olcMemberOfMemberAD = "member";
              olcMemberOfMemberOfAD = "memberOf";
            };

            "olcOverlay={4}refint".attrs = {
              objectClass = [ "olcOverlayConfig" "olcRefintConfig" "top" ];
              olcOverlay = "{4}refint";
              olcRefintAttribute = "memberof member manager owner";
            };
          };
        };
      };
    };
  };
```

You can see the list of schemas and overlays that can be directly used without any further work in `$[pkgs.openldap}/etc/schema`.

### Setting up a server (officially deprecated)

Use with the configuration file:

``` nix
{
  services.openldap = {
    enable = true;
    dataDir = "/var/lib/openldap";
    urlList = [ "ldap:///" "ldapi:///" ]; # Add ldaps to this list to listen with SSL (requires configured certificates)
    suffix = "dc=nixos,dc=org";
    rootdn = "cn=admin,dc=nixos,dc=org";
    rootpw = "water"; # Or use rootpwFile
    # See https://www.openldap.org/doc/admin24/slapdconfig.html
    extraDatabaseConfig = ''
      access to dn.base="dc=nixos,dc=org" by * read
      # Add your own ACLs here…
      # Drop everything that wasn't handled by previous ACLs:
      access to * by * none

      index objectClass eq
      index uid eq
      index mail sub
      # Accelerates replication if you use it
      index entryCSN eq
      index entryUUID eq
    '';
    # Setting this causes OpenLDAP to drop the entire database on startup and write the contents of
    # of this LDIF string into the database. This ensures that only nix-managed content is found in the
    # database. Note that if a lot of entries are created in conjunction with a lot of indexes, this might hurt
    # startup performance.
    # Also, you can set `readonly on` in `extraDatabaseConfig` to ensure nobody writes data that will be
    # lost.
    declarativeContents = "…";
  };
}
```

To use the not-deprecated configuration directory, the recommended way is to create a simple configuration file and convert it using `slaptest`. This however is out of scope for this page. Also, using the configuration directory means you cannot use the `extra…` options from the example above. To switch to the configuration directory (also known as OLC), just set `configDir` to a directory that already contains such OLC configuration.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
