<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Prosody -->

[Prosody](https://prosody.im/) is an open-source, modern XMPP server.

It is documented in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-prosody).

This page describes how to setup a walled-off Prosody instance for your organisation or family, with STUN/TURN support and http upload. This setup has server-to-server communication disabled.

# Set up DNS records for Prosody

See official Prosody documentation here [1](https://prosody.im/doc/dns).

- Domain of the xmpp address is the bare top level domain example.org. The bare top level domain has SRV records pointing to XMPP server xmpp.example.org.

<!-- -->

- XMPP server is hosted on xmpp.example.org.

<!-- -->

- XMPP services, such as STUN/TURN server, Multi-User Chat and HTTP upload are hosted at \*.xmpp.example.org. As \*.xmpp.example.org is not a direct subdomain of example.org, we need to set mod_disco to let XMPP client to discover the services.

``` nix
  services.prosody.disco_items = [
    {
      description = "http upload";
      url = "upload.xmpp.${domainName}";
    }
  ];
```

- STUN/TURN server is hosted on turn.xmpp.example.org.
- Multi-User Chat is hosted on muc.xmpp.example.org.
- HTTP upload server is hosted on upload.xmpp.example.org.

# SSL Certificate with ACME

This article assumes a working <a href="ACME" class="wikilink" title="ACME">ACME</a> configuration for certificate renewal.

``` nix
{
  config,
  ...
}:
let
  sslCertDir = config.security.acme.certs."example.org".directory;
  domainName = "example.org";
in
{
  # further prosody & coturn configuration goes here
  ...
}
```

# Set up Prosody

## Open firewall for client to server c2s

``` nix
  networking.firewall = {
    allowedTCPPorts = [
      # prosody client to server
      5222
      5223
    ];
  };
```

## Authentication and XMPP modules

``` nix
  services.prosody = {
    # this is a minimal server config with turn and http upload
    # all server to server connection are blocked
    enable = true;
    admins = [ "admin@${domainName}" ];
    allowRegistration = false;
    authentication = "internal_plain";
    s2sSecureAuth = true;
    c2sRequireEncryption = true;
    modules = {
      admin_adhoc = false;
      cloud_notify = false;
      pep = false;
      blocklist = false;
      bookmarks = false;
      dialback = false;
      ping = false;
      private = false;
      register = false;
      vcard_legacy = false;
    };
    xmppComplianceSuite = false;
  };
```

## Setup Multi User Conference module

``` nix

  services.prosody = {
    muc = [
      {
        domain = "muc.xmpp.${domainName}";
        restrictRoomCreation = false;
      }
    ];
  }
```

## Setup virtual host and ssl

``` nix
  services.prosody = {
    ssl = {
      cert = "${sslCertDir}/fullchain.pem";
      key = "${sslCertDir}/key.pem";
    };

    virtualHosts = {
      # xmpp server for "@example.org" is hosted on "xmpp.example.org"
      # use SRV records.
      "myvhost0" = {
        domain = "${domainName}";
        enabled = true;
      };
    };
  };
```

You also need to set proper file permissions on the cert directory and key files. See <a href="ACME#Integration_with_service_modules" class="wikilink" title="ACME#Integration_with_service_modules">ACME#Integration_with_service_modules</a>.

## Optional: use sqlite

``` nix
  services.prosody = {
    extraConfig = ''
      storage = "sql"
      sql = {
        driver = "SQLite3";
        database = "prosody.sqlite"; -- The database name to use. For SQLite3 this the database filename (relative to the data storage directory).
      }
    '';
  };
```

sqlite seems to be more performant than the default file-backed storage driver.

# Set up coturn

## Open firewall ports

``` nix
  networking.firewall = {
    allowedTCPPorts = [
      # prosody turn/stun with coturn
      # see /run/coturn/turnserver.cfg
      3478
      3479
      5349
      5350
    ];
    allowedUDPPorts = [
      # prosody turn/stun with coturn
      3478
      3479
      5349
      5350
    ];
    allowedUDPPortRanges = [
      # coturn
      {
        from = 49152;
        to = 65535;
      }
    ];
  };
```

## Set up coturn

``` nix
  age.secrets.prosody-coturn = {
    file = ./prosody-coturn.age;
    # -rw-r--r--
    mode = "644";
  };

  services.coturn = {
    # https://prosody.im/doc/coturn
    enable = true;
    listening-port = 3478;
    pkey = "${sslCertDir}/key.pem";
    cert = "${sslCertDir}/fullchain.pem";
    realm = "turn.xmpp.${domainName}";
    static-auth-secret-file = config.age.secrets.prosody-coturn.path;
    use-auth-secret = true;
  };
```

## Connect to prosody

``` nix
  services.prosody.virtualHosts."myvhost0".extraConfig = ''
    turn_external_host = "turn.xmpp.${domainName}"
    turn_external_secret = "unfortunately this is a inline password"
  '';
  services.prosody.extraModules = [ "turn_external" ];
```

# http upload with prosody-filer and nginx

Although newer prosody versions does not require external http upload to run, prosody-filer is still more performant than the built-in server. [2](https://github.com/ThomasLeister/prosody-filer/issues/39)

## Open firewall ports

``` nix
  networking.firewall = {
    allowedTCPPorts = [
      # prosody https upload
      443
    ];
  };
```

## Setup prosody-filer service

``` nix
  # set up directory for storing uploaded file
  systemd.services.prosody-filer.serviceConfig = {
    StateDirectory = "prosody-filer";
    RuntimeDirectory = "prosody-filer";
    RuntimeDirectoryMode = "0750";
  };

  services.prosody-filer = {
    enable = true;
    settings = {
      secret = "plain in line password";
      storeDir = "/var/lib/prosody-filer/uploads/";

      # this option refers to the upload url
      # https://upload.xmpp.${domainName}/upload/
      #                                  <------->
      # do not change this, else 404
      uploadSubDir = "upload/";
    };
  };
```

## Set up nginx virtual host

``` nix
  services.nginx = {
    clientMaxBodySize = "50m";
    virtualHosts."upload.xmpp.${domainName}" = {
      forceSSL = true;
      useACMEHost = "${domainName}";
      locations."/upload/" = {
        proxyPass = "http://localhost:5050/upload/";
        # config copied from https://github.com/ThomasLeister/prosody-filer/blob/develop/README.md
        extraConfig = ''
            proxy_request_buffering off;

          if ( $request_method = OPTIONS ) {
                  add_header Access-Control-Allow-Origin '*';
                  add_header Access-Control-Allow-Methods 'PUT, GET, OPTIONS, HEAD';
                  add_header Access-Control-Allow-Headers 'Authorization, Content-Type';
                  add_header Access-Control-Allow-Credentials 'true';
                  add_header Content-Length 0;
                  add_header Content-Type text/plain;
                  return 200;
          }
        '';
      };
    };
  };
```

## Connect filer to Prosody

``` nix
  services.prosody.extraConfig = ''
    Component "upload.xmpp.${domainName}" "http_upload_external"
    http_upload_external_secret = "should be the same pwd as above";
    http_upload_external_base_url = "https://upload.xmpp.${domainName}/upload/"
    http_upload_external_file_size_limit = 52428800
  '';
  services.prosody.disco_items = [
    {
      description = "http upload";
      url = "upload.xmpp.${domainName}";
    }
  ];

  # mod_http_upload_external is a community module
  # has to be installed via
  # https://modules.prosody.im/mod_http_upload_external.html#installation

  ## Clone Prosody Community Modules Repo
  # cd /var/lib/prosody
  # hg clone https://hg.prosody.im/prosody-modules/ prosody-modules
  # update plugins via hg pull --update
  services.prosody.extraPluginPaths = [
    "/var/lib/prosody/prosody-modules/mod_http_upload_external"
  ];
```

# Final Checkup

Run prosodyctl check to check for local configuration and DNS setup errors.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
