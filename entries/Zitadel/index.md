<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zitadel -->

**[Zitadel](https://zitadel.com/)** is an open-source identity and access management platform built for the cloud-native era. It provides authentication, authorization, and user management with support for OIDC, SAML, MFA, and more.

## Setup (Native / Containerless)

The following configuration provides a complete, declarative setup for Zitadel with:

- <a href="PostgreSQL" class="wikilink" title="PostgreSQL">PostgreSQL</a> (no Docker)
- <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> reverse proxy using existing ACME certificates
- Declarative creation

## Configuration

Modify and save the configuration as `/etc/nixos/services/zitadel.n``ix`

nix

`{ config, pkgs, lib, ... }:`  
  
`let`  
`  # Root domain, using Wildcard Certificate as per https://wiki.nixos.org/wiki/ACME CloudFlare section`  
`  # If using per-domain certificates, change to the appropriate subdomain.`  
`  rootDomain = "example.com";`  
  
`  # Domain where Zitadel will be available.`  
`  # Change to rootDomain if using per-domain ACME certificates`  
`  zitadelDomain = "auth.${rootDomain}";`  
  
`  # Strong password for the dedicated PostgreSQL user`  
`  dbPassword = "make-sure-this-is-secure-and-long";`  
  
`  # Initial admin password for the Zitadel console`  
`  # Change this immediately after first login!`  
`  adminPassword = "change-this-immediately-to-a-strong-password";`  
  
`  # Email address for the initial admin user`  
`  initialAdminEmail = "admin@${rootDomain}";`  
  
`  # Internal port Zitadel listens on (chosen to avoid conflict with other services on port 80)`  
`  internalPort = 2080;`  
  
`  # External port when using TLS Enabled or for reverse proxy with external TLS mode`  
`  # Currently only works with 443, see https://github.com/zitadel/zitadel/issues/11380`  
`  externalPort = 443;`  
  
`  # false = HTTP, true = HTTPS`  
`  externalSecure = true;`  
  
`  # Zitadel TLS Mode (disabled, enabled, external)`  
`  tlsMode = "disabled";`  
  
`in`  
`{`  
`  # === PostgreSQL ===`  
`  services.postgresql = {`  
`    enable = true;`  
`    package = pkgs.postgresql_17;`  
  
`    ensureDatabases = [ "zitadel" ];`  
  
`    # Enable TCP/IP for localhost connections`  
`    enableTCPIP = true;`  
  
`    # Authentication rules`  
`    authentication = pkgs.lib.mkOverride 10 ''`  
`      # Local Unix socket connections use peer authentication`  
`      local   all             all                                     peer`  
  
`      # TCP localhost: allow zitadel user to connect to any database`  
`      host    all             zitadel         127.0.0.1/32            trust`  
`      host    all             zitadel         ::1/128                 trust`  
`    '';`  
  
`    # Initial database setup`  
`    initialScript = pkgs.writeText "zitadel-init.sql" ''`  
`      CREATE ROLE zitadel WITH LOGIN PASSWORD '${dbPassword}' CREATEDB CREATEROLE;`  
`      GRANT ALL PRIVILEGES ON DATABASE zitadel TO zitadel;`  
`    '';`  
  
`    settings = {`  
`      max_connections = 100;`  
`      shared_buffers = "256MB";`  
`    };`  
`  };`  
  
`  # Ensure the zitadel role always has CREATEROLE for migrations`  
`  systemd.services.zitadel-postgres-setup = {`  
`    description = "Ensure Zitadel PostgreSQL user has required privileges";`  
`    wantedBy = [ "multi-user.target" ];`  
`    after = [ "postgresql.service" ];`  
`    requires = [ "postgresql.service" ];`  
  
`    serviceConfig = {`  
`      Type = "oneshot";`  
`      RemainAfterExit = true;`  
`      User = "postgres";`  
`    };`  
  
`    script = ''`  
`      ${config.services.postgresql.package}/bin/psql -d postgres <<'EOF'`  
`        DO $$`  
`        BEGIN`  
`          IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'zitadel') THEN`  
`            CREATE ROLE zitadel WITH LOGIN PASSWORD '${dbPassword}' CREATEDB CREATEROLE;`  
`          ELSE`  
`            ALTER ROLE zitadel WITH PASSWORD '${dbPassword}' CREATEDB CREATEROLE;`  
`          END IF;`  
`        END`  
`        $$;`  
  
`        GRANT ALL PRIVILEGES ON DATABASE zitadel TO zitadel;`  
`      EOF`  
`    '';`  
`  };`  
  
`  # === Zitadel ===`  
`  services.zitadel = {`  
`    enable = true;`  
  
`    masterKeyFile = "/var/lib/zitadel/master.key";`  
  
`    tlsMode = tlsMode;`  
`    settings = {`  
`      Port = httpPort;`  
`      ExternalPort = httpsPort;`  
`      ExternalDomain = zitadelDomain;`  
`      ExternalSecure = externalSecure;`  
  
`      Database = {`  
`        postgres = {`  
`          Host = "127.0.0.1";`  
`          Port = 5432;`  
`          Database = "zitadel";`  
  
`          User = {`  
`            Username = "zitadel";`  
`            Password = dbPassword;`  
`            SSL = { Mode = "disable"; };`  
`          };`  
  
`          Admin = {`  
`            Username = "zitadel";`  
`            Password = dbPassword;`  
`            SSL = { Mode = "disable"; };`  
`          };`  
`        };`  
`      };`  
`    };`  
  
`    # Declarative first instance and admin user`  
`    steps = {`  
`      FirstInstance = {`  
`        InstanceName = "Zitadel";`  
`        Org = {`  
`          Human = {`  
`            UserName = "admin";`  
`            FirstName = "Admin";`  
`            LastName = "User";`  
`            DisplayName = "Administrator";`  
`            Password = adminPassword;`  
`            PasswordChangeRequired = false;`  
`            Email = {`  
`              Address = initialAdminEmail;`  
`              Verified = true;`  
`            };`  
`          };`  
`        };`  
`      };`  
`    };`  
`  };`  
  
`  # Generate persistent master key (only once)`  
`  system.activationScripts.zitadelMasterKey = lib.stringAfter [ "var" ] ''`  
`    mkdir -p /var/lib/zitadel`  
`    if [ ! -f /var/lib/zitadel/master.key ]; then`  
`      ${pkgs.coreutils}/bin/tr -dc 'A-Za-z0-9' `</dev/urandom | head -c 32 >` /var/lib/zitadel/master.key`  
`      chmod 400 /var/lib/zitadel/master.key`  
`      chown zitadel:zitadel /var/lib/zitadel/master.key || true`  
`      chown zitadel:zitadel /var/lib/zitadel || true`  
`    fi`  
`  '';`  
  
`  # === Nginx reverse proxy (HTTPS only) example ===`  
`  services.nginx.enable = true;`  
  
`  services.nginx.virtualHosts."${zitadelDomain}" = {`  
`    forceSSL = true;`  
`    sslCertificate = "/var/lib/acme/${rootDomain}/fullchain.pem";`  
`    sslCertificateKey = "/var/lib/acme/${rootDomain}/key.pem";`  
  
`    http2 = true;   # Enables HTTP/2 support`  
  
`    # Necessary for non-default HTTPS port`  
`    listen = [`  
`      { addr = "0.0.0.0"; port = externalPort; ssl = true; }`  
`      { addr = "[::]"; port = externalPort; ssl = true; }`  
`    ];`  
  
`      locations = {`  
`        # Zitadel Login V2 UI`  
`        "/ui/v2/login" = {`  
`          proxyPass = "http://127.0.0.1:${toString internalPort}";`  
`          extraConfig = ''`  
`            proxy_set_header Host $host;`  
`            proxy_set_header X-Real-IP $remote_addr;`  
`            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`  
`            proxy_set_header X-Forwarded-Proto $scheme;`  
`          '';`  
`        };`  
  
`        # gRPC for Console, API, etc.`  
`        "/" = {`  
`          extraConfig = ''`  
`            grpc_pass grpc://127.0.0.1:${toString internalPort};`  
`            grpc_set_header Host $host;`  
`            grpc_set_header X-Forwarded-Proto $scheme;`  
`          '';`  
`        };`  
`      };`  
`    };`  
`  };`  
  
`  systemd.services.zitadel = {`  
`    after = [ "postgresql.service" "zitadel-postgres-setup.service" ];`  
`    requires = [ "postgresql.service" "zitadel-postgres-setup.service" ];`  
`  };`  
`}`

Add the module to your configuration.nix:

nix

`imports = [ ./services/zitadel.nix ];`

After a successful rebuild, Zitadel will be available at https://auth.example.com (replace with your domain).

## Usage

Log in with username **admin** and the adminPassword you set. **Change the password** in the Zitadel console.

For further usage, refer to the official Zitadel documentation.

## Verification

Check that services are running:

Bash

``` bash
systemctl status zitadel-postgres-setup
systemctl status postgresql
systemctl status zitadel
systemctl status nginx
sudo tail /var/logs/ngnix/error.log
```

## Notes

- This setup uses trust authentication for the zitadel user on localhost for a single-machine deployment.
- The zitadel-postgres-setup service ensures the database user has the CREATEROLE attribute required by Zitadel's initialization.
- TLS termination happens at Nginx using existing ACME certificates

## See Also

<a href="ACME" class="wikilink" title="ACME">ACME</a>

<a href="Keycloak" class="wikilink" title="Keycloak">Keycloak</a>

[Zitadel Offical Homepage](https://zitadel.com/)

[Zitadel GitHub Issue Tracker](https://github.com/zitadel/zitadel/issues)
