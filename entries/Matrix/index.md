<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Matrix -->

[Matrix](https://matrix.org) defines a set of open APIs for decentralised communication, suitable for securely publishing, persisting and subscribing to data over a global open federation of servers with no single point of control. Uses include Instant Messaging (IM), Voice over IP (VoIP) signalling, Internet of Things (IoT) communication, and bridging together existing communication silos - providing the basis of a new open real-time communication ecosystem.

This article extends the documentation in [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-matrix).

## Joining the community on Matrix

You can read more about the different rooms on <a href="MatrixRooms" class="wikilink" title="MatrixRooms">MatrixRooms</a> and join them either from [https://matrix.to/#/#community:nixos.org](https://matrix.to/#/#community:nixos.org) or directly from your client.

An unofficial service provides Matrix accounts for members of the NixOS organization on GitHub: <https://discourse.nixos.org/t/matrix-account-hosting-for-nix-os-hackers/14036>

## Clients

### Desktop clients

The clients `element-desktop` [1](https://element.io/) and `fractal` [2](https://gitlab.gnome.org/World/fractal) are known to work and are kept up to date.

Other clients packaged in Nixpkgs, such as `matrix-commander`, `neochat`, `nheko`, depend directly or transitively on the insecure `olm` library susceptible to various security vulnerabilities.[3](https://nvd.nist.gov/vuln/detail/CVE-2024-45191)[4](https://nvd.nist.gov/vuln/detail/CVE-2024-45193)[5](https://nvd.nist.gov/vuln/detail/CVE-2024-45192)

If this is not a concern, the guide to [install insecure packages](https://nixos.org/manual/nixpkgs/stable/#sec-allow-insecure) may be followed.

### Web clients

There is a web version of the client [Element](https://element.io/), `element-web` on Nixpkgs, which you can use as a regular web application. See [the NixOS manual entry](https://nixos.org/nixos/manual/index.html#module-services-matrix-element-web).

``` nixos
{
  services.nginx.enable = true;

  # See https://nixos.org/manual/nixos/stable/index.html#module-services-matrix-element-web
  services.nginx.virtualHosts."localhost" = {
    listen = [{
      addr = "[::1]";
      port = yourPort;
    }];
    root = pkgs.element-web.override {
      # See https://github.com/element-hq/element-web/blob/develop/config.sample.json
      conf = {
        default_theme = "dark";
      };
    };
  };
}
```

Alternatively, you can write a script to start the web client on demand.

``` nix
let
  # port = yourPort;
  web-dir = pkgs.element-web.override {
    conf = {
      default_theme = "dark";
      show_labs_settings = true;
    };
  };
  element-web = pkgs.writeScriptBin "element-web" ''
    #!${pkgs.bash}/bin/bash
    set -e
    ${pkgs.python3}/bin/python3 -m http.server ${port} -b ::1 -d ${web-dir}
  '';
in
{
  home.sessionPath = [ "${element-web}/bin" ];
}
```

## Homeservers

### Conduit

``` nixos
{
  # See https://search.nixos.org/options?channel=unstable&query=services.matrix-conduit.
  # and https://docs.conduit.rs/configuration.html
  services.matrix-conduit = {
    enable = true;
    settings.global = {
      # allow_registration = true;
      # You will need this token when creating your first account.
      # registration_token = "A S3CR3T TOKEN";
      # server_name = yourDomainName;
      # port = yourPort;
      address = "::1";
      database_backend = "rocksdb";
      
      # See https://docs.conduit.rs/turn.html, and https://github.com/element-hq/synapse/blob/develop/docs/turn-howto.md for more details
      # turn_uris = [
      #  "turn:your.turn.url?transport=udp"
      #  "turn:your.turn.url?transport=tcp"
      # ];
      # turn_secret = "your secret";
    };
  };
}
```

### Synapse

[Synapse](https://element-hq.github.io/synapse/latest/welcome_and_overview.html) has an associated module exposing the [services.matrix-synapse.\* options](https://search.nixos.org/options?query=services.matrix-synapse). See [the NixOS manual entry](https://nixos.org/nixos/manual/index.html#module-services-matrix-synapse) for a complete configuration example.

#### Coturn with Synapse

For WebRTC calls to work when both callers are behind a NAT, you need to provide a turn server for clients to use. Here is an example configuration, inspired from [this configuration file](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/roles/custom/matrix-coturn/templates/turnserver.conf.j2).

``` nix
{config, pkgs, lib, ...}: {
  # enable coturn
  services.coturn = rec {
    enable = true;
    no-cli = true;
    no-tcp-relay = true;
    min-port = 49000;
    max-port = 50000;
    use-auth-secret = true;
    static-auth-secret = "will be world readable for local users :(";
    realm = "turn.example.com";
    cert = "${config.security.acme.certs.${realm}.directory}/full.pem";
    pkey = "${config.security.acme.certs.${realm}.directory}/key.pem";
    extraConfig = ''
      # for debugging
      verbose
      # ban private IP ranges
      no-multicast-peers
      denied-peer-ip=0.0.0.0-0.255.255.255
      denied-peer-ip=10.0.0.0-10.255.255.255
      denied-peer-ip=100.64.0.0-100.127.255.255
      denied-peer-ip=127.0.0.0-127.255.255.255
      denied-peer-ip=169.254.0.0-169.254.255.255
      denied-peer-ip=172.16.0.0-172.31.255.255
      denied-peer-ip=192.0.0.0-192.0.0.255
      denied-peer-ip=192.0.2.0-192.0.2.255
      denied-peer-ip=192.88.99.0-192.88.99.255
      denied-peer-ip=192.168.0.0-192.168.255.255
      denied-peer-ip=198.18.0.0-198.19.255.255
      denied-peer-ip=198.51.100.0-198.51.100.255
      denied-peer-ip=203.0.113.0-203.0.113.255
      denied-peer-ip=240.0.0.0-255.255.255.255
      denied-peer-ip=::1
      denied-peer-ip=64:ff9b::-64:ff9b::ffff:ffff
      denied-peer-ip=::ffff:0.0.0.0-::ffff:255.255.255.255
      denied-peer-ip=100::-100::ffff:ffff:ffff:ffff
      denied-peer-ip=2001::-2001:1ff:ffff:ffff:ffff:ffff:ffff:ffff
      denied-peer-ip=2002::-2002:ffff:ffff:ffff:ffff:ffff:ffff:ffff
      denied-peer-ip=fc00::-fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff
      denied-peer-ip=fe80::-febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff
    '';
  };
  # open the firewall
  networking.firewall = {
    interfaces.enp2s0 = let
      range = with config.services.coturn; lib.singleton {
        from = min-port;
        to = max-port;
      };
    in
    {
      allowedUDPPortRanges = range;
      allowedUDPPorts = [ 3478 5349 ];
      allowedTCPPortRanges = [ ];
      allowedTCPPorts = [ 3478 5349 ];
    };
  };
  # get a certificate
  security.acme.certs.${config.services.coturn.realm} = {
    /* insert here the right configuration to obtain a certificate */
    postRun = "systemctl restart coturn.service";
    group = "turnserver";
  };
  # configure synapse to point users to coturn
  services.matrix-synapse.settings = with config.services.coturn; {
    turn_uris = ["turn:${realm}:3478?transport=udp" "turn:${realm}:3478?transport=tcp"];
    turn_shared_secret = static-auth-secret;
    turn_user_lifetime = "1h";
  };
}
```

#### Synapse with Workers

There's an external module to automatically set up synapse and configure nginx with workers: <https://github.com/dali99/nixos-matrix-modules>

#### Synapse Admin with Caddy

Setting up [Synapse Admin](https://github.com/etkecc/synapse-admin) with <a href="Caddy" class="wikilink" title="Caddy">Caddy</a> is quite easy!

The example uses the newer `pkgs.synapse-admin-etkecc` which may not be what you want if you have heard of the old one which is available at: `pkgs.synapse-admin`

## Homeserver Independent

### Livekit

In order to set up element call or for calls to work in Element X it is necessary to set up and announce livekit. To set up livekit for matrix in nixos use

``` nix
{ config, lib, pkgs, ... }: let
  keyFile = "/run/livekit.key";
in {
  services.livekit = {
    enable = true;
    openFirewall = true;
    settings.room.auto_create = false;
    inherit keyFile;
  };
  services.lk-jwt-service = {
    enable = true;
    # can be on the same virtualHost as synapse
    livekitUrl = "wss://domain.tld/livekit/sfu";
    inherit keyFile;
  };
  # generate the key when needed
  systemd.services.livekit-key = {
    before = [ "lk-jwt-service.service" "livekit.service" ];
    wantedBy = [ "multi-user.target" ];
    path = with pkgs; [ livekit coreutils gawk ];
    script = ''
        echo "Key missing, generating key"
        echo "lk-jwt-service: $(livekit-server generate-keys | tail -1 | awk '{print $3}')" > "${keyFile}"
    '';
    serviceConfig.Type = "oneshot";
    unitConfig.ConditionPathExists = "!${keyFile}";
  };
  # restrict access to livekit room creation to a homeserver
  systemd.services.lk-jwt-service.environment.LIVEKIT_FULL_ACCESS_HOMESERVERS = "domain.tld";
  services.nginx.virtualHosts."domain.tld".locations = {
    "^~ /livekit/jwt/" = {
      priority = 400;
      proxyPass = "http://[::1]:${toString config.services.lk-jwt-service.port}/";
    };
    "^~ /livekit/sfu/" = {
      extraConfig = ''
        proxy_send_timeout 120;
        proxy_read_timeout 120;
        proxy_buffering off;

        proxy_set_header Accept-Encoding gzip;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
      '';
      priority = 400;
      proxyPass = "http://[::1]:${toString config.services.livekit.settings.port}/";
      proxyWebsockets = true;
    };
  };
}
```

Furthermore, it is necessary to announce the service with a `domain.tld/.well-known/matrix/client` which needs to be served as `Content-Type application/json` (calls in Element X might not work without the content-type) and contain

``` json
{
  "m.homeserver": {
    "base_url": "https://domain.tld"
  },
  "m.identity_server": {
    "base_url": "https://vector.im"
  },
  "org.matrix.msc3575.proxy": {
    "url": "https://domain.tld"
  },
  "org.matrix.msc4143.rtc_foci": [
    {
       "type": "livekit",    "livekit_service_url": "https://domain.tld/livekit/jwt"
    }
  ]
}
```

### Matrix Authentication Service (MAS)

> MAS module is only available since nixos 26.11

The Matrix Authentication Service (MAS) is an OAuth 2.1 and OpenID Connect provider designed for Matrix homeservers. It is intended to become the authentication component used by Matrix homeservers implementing MSC3861.

MAS provides a modern authentication layer for Matrix and enables features such as:

- Single Sign-On (SSO) using external OpenID Connect providers;
- Account management independent from the homeserver implementation;
- Passwordless deployments relying entirely on upstream identity providers;
- Future Matrix authentication features based on MSC3861 and MSC4108.

MAS stores its own state in PostgreSQL and communicates with the homeserver using a shared secret.

#### Basic configuration

A minimal configuration can be achieved with:

``` nixos
# MAS part
services.matrix-authentication-service = {
  enable = true;
  createDatabase = true;
  credentials."matrix_secret" = config.age.secrets.mas_matrix_secret.path;
  settings = {
    http.public_base = "https://auth.example.com/";
    http.issuer = "https://auth.example.com/";
    matrix = {
      homeserver = "example.com";
      endpoint = "http://127.0.0.1:8008/";
      secret_file = "/run/credentials/matrix-authentication-service.service/matrix_secret";
    };
  };
};
# Synapse part
services.matrix-synapse.settings = {
  matrix_authentication_service = {
    enabled = true;
    endpoint = "http://127.0.0.1:8089/";
    secret_path = config.age.secrets.mas_matrix_secret.path;
  };
};
```

The following parameters are required:

- `matrix.homeserver` should match the Synapse `server_name`.
- `matrix.endpoint` must point to the homeserver's internal HTTP endpoint.
- `matrix.secret_file` contains the shared secret used by MAS to authenticate to Synapse.
  - The secret should be a long, randomly generated value. For example: `openssl rand -hex 32`

<!-- -->

- `http.public_base` is the public URL used by clients to reach MAS.

#### Using an upstream OpenID Connect provider

MAS can delegate authentication to an external OpenID Connect provider.

The example below configures MAS to authenticate users through Authelia and disables the internal password database.

``` nixos
services.matrix-authentication-service = {
  enable = true;
  settings = {
    passwords.enabled = false;
    upstream_oauth2.providers = [
      {
        id = "XXXX";
        human_name = "Authelia";
        issuer = "https://auth.example.com";
        client_id = "xxxxxxxx";
        client_secret_file = "/run/credentials/matrix-authentication-service.service/xxxx";
        # client_secret = "xxxxxxxx";
        token_endpoint_auth_method = "client_secret_basic";
        discovery_mode = "insecure";
        fetch_userinfo = true;
        scope = "openid profile email";
        claims_imports = {
          localpart = {
            action = "require";
            template = "{{ user.preferred_username }}";
          };
          displayname = {
            action = "suggest";
            template = "{{ user.name }}";
          };
          email = {
            action = "suggest";
            template = "{{ user.email }}";
            set_email_verification = "always";
          };
        };
      }
    ];
  };
};
```

An OpenID Connect client must also be declared in Authelia:

``` nixos
{
  client_name = "Matrix";

  client_id = "<client-id>";
  client_secret = "<client-secret>";

  public = false;

  authorization_policy = "two_factor";

  redirect_uris = [
    "https://auth.example.com/upstream/callback/XXXX"
  ];

  scopes = [
    "openid"
    "profile"
    "email"
    "offline_access"
  ];

  grant_types = [
    "authorization_code"
    "refresh_token"
  ];

  response_types = [ "code" ];
}
```

With this setup:

- Users authenticate against Authelia.
- MAS consumes the OIDC claims exposed by Authelia.
- Matrix accounts are associated with the imported `preferred_username`, display name and email address.
- No password is stored locally in MAS.

#### Secret management

Secrets such as encryption keys, OIDC client secrets, and Matrix shared secrets should not be stored in the Nix store.

Please use a secret management solution: <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison of secret managing schemes">Comparison of secret managing schemes</a>

See the [MAS configuration reference](https://search.nixos.org/options?channel=unstable&query=matrix-authentication-service) for the complete list of available options.

#### Example configuration

This configuration is provided for demonstration purposes only (mas+synapse+authelia with agenix for secret management): <https://github.com/hatch01/flake/blob/df086206d148ee4120bc57d3e62ccb4883d4d0ec/apps/matrix/mas.nix>

## Application services (a.k.a. bridges)

Bridges allow you to connect Matrix to a third-party platform (like Discord, Telegram, etc.), and interact seamlessly. See [here](https://matrix.org/ecosystem/bridges/) for a list of currently supported bridges.

### mautrix-telegram

Full configuration reference: <https://github.com/tulir/mautrix-telegram/blob/master/mautrix_telegram/example-config.yaml>

Example NixOS config:

``` nix
{
  services.matrix-synapse = {
    enable = true;
    settings.app_service_config_files = [
      # The registration file is automatically generated after starting the
      # appservice for the first time.
      # cp /var/lib/mautrix-telegram/telegram-registration.yaml \
      #   /var/lib/matrix-synapse/
      # chown matrix-synapse:matrix-synapse \
      #   /var/lib/matrix-synapse/telegram-registration.yaml
      "/var/lib/matrix-synapse/telegram-registration.yaml"
    ];
    # ...
  };

  services.mautrix-telegram = {
    enable = true;

    # file containing the appservice and telegram tokens
    environmentFile = "/etc/secrets/mautrix-telegram.env";

    # The appservice is pre-configured to use SQLite by default.
    # It's also possible to use PostgreSQL.
    settings = {
      homeserver = {
        address = "http://localhost:8008";
        domain = "domain.tld";
      };
      appservice = {
        provisioning.enabled = false;
        id = "telegram";
        public = {
          enabled = true;
          prefix = "/public";
          external = "http://domain.tld:8080/public";
        };

        # The service uses SQLite by default, but it's also possible to use
        # PostgreSQL instead:
        #database = "postgresql:///mautrix-telegram?host=/run/postgresql";
      };
      bridge = {
        relaybot.authless_portals = false;
        permissions = {
          "@someadmin:domain.tld" = "admin";
        };

        # Animated stickers conversion requires additional packages in the
        # service's path.
        # If this isn't a fresh installation, clearing the bridge's uploaded
        # file cache might be necessary (make a database backup first!):
        # delete from telegram_file where \
        #   mime_type in ('application/gzip', 'application/octet-stream')
        animated_sticker = {
          target = "gif";
          args = {
            width = 256;
            height = 256;
            fps = 30;               # only for webm
            background = "020202";  # only for gif, transparency not supported
          };
        };
      };
    };
  };

  systemd.services.mautrix-telegram.path = with pkgs; [
    lottieconverter  # for animated stickers conversion, unfree package
    ffmpeg           # if converting animated stickers to webm (very slow!)
  ];
}
```

### mautrix-whatsapp

Packaged as [mautrix-whatsapp](https://search.nixos.org/packages?query=mautrix-whatsapp).

### matrix-appservice-irc

NixOS-specific module options: TODO link to the search results once it's landed

Full configuration reference: <https://github.com/matrix-org/matrix-appservice-irc/blob/develop/config.sample.yaml>

Upstream documentation: <https://matrix-org.github.io/matrix-appservice-irc/latest/introduction.html>

Example configuration:

``` nix
services.matrix-appservice-irc = {
  enable = true;
  registrationUrl = "https://ircbridge.mydomain.com"; # Or localhost

  # Everything from here is passed to the appservice
  settings = {
    homeserver.url = "https://matrix.mydomain.com"; # Or localhost
    homeserver.domain = "mydomain.com";

    # Bridge settings for Freenode. You can bridge multiple services.
    ircService.servers."chat.freenode.net" = {
      name = "freenode";
      port = 6697;
      ssl = true;
      dynamicChannels = {
        enabled = true;
        aliasTemplate = "#irc_$CHANNEL";
        groupId = "+irc:localhost";
      };
      matrixClients = {
        userTemplate = "@irc_$NICK";
      };
      ircClients = {
        nickTemplate = "$LOCALPART[m]";
        allowNickChanges = true;
      };

      membershipLists = {
        enabled = true;
        global = {
          ircToMatrix = {
            initial = true;
            incremental = true;
          };
          matrixToIrc = {
            initial = true;
            incremental = true;
          };
        };
      };
    };
  };
};
```

This example configuration creates a bridge for only one IRC network, Freenode. Some options are set to make an example, but you absolutely \*should\* read the whole configuration documentation and set all options you want before starting. The example options show you how to adapt the room/user name space template for the use case where you only have one IRC server bridged, and also enables increased membership sync because it is disabled on the official Freenode bridge.

The appservice automatically creates a registration file under `/var/lib/matrix-appservice-irc/registration.yml` and keeps it up to date. If your homeserver is not located on the same machine and NixOS installation, you must absolutely make sure to synchronize that file over to the home server after each modification and keep both in sync.

### matrix-appservice-discord

Full configuration reference: <https://github.com/Half-Shot/matrix-appservice-discord/blob/master/config/config.sample.yaml>

Example NixOS config:

``` nix
{
  services.matrix-synapse = {
    enable = true;
    app_service_config_files = [
      # The registration file is automatically generated after starting the
      # appservice for the first time.
      # cp /var/lib/matrix-appservice-discord/discord-registration.yaml \
      #   /var/lib/matrix-synapse/
      # chown matrix-synapse:matrix-synapse \
      #   /var/lib/matrix-synapse/discord-registration.yaml
      "/var/lib/matrix-synapse/discord-registration.yaml"
    ];
    # ...
  };

  services.matrix-appservice-discord = {
    enable = true;
    environmentFile = /etc/keyring/matrix-appservice-discord/tokens.env;
    # The appservice is pre-configured to use SQLite by default.
    # It's also possible to use PostgreSQL.
    settings = {
      bridge = {
        domain = "test.tld";
        homeserverUrl = "https://public.endpoint.test.tld";
      };

      # The service uses SQLite by default, but it's also possible to use
      # PostgreSQL instead:
      #database = {
      #  filename = ""; # empty value to disable sqlite
      #  connString = "socket:/run/postgresql?db=matrix-appservice-discord";
      #};
    };
  };
}
```

## See also

- <a href="Mjolnir" class="wikilink" title="Mjolnir">Mjolnir</a> - a Matrix moderation tool
- [The Nix Matrix Subsystem chat room, on Matrix](https://matrix.to/#/!vxTmkuJzhGPsMdkAOc:transformierende-gesellschaft.org?via=transformierende-gesellschaft.org)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
