<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenCloud -->

### Installation and Configuration

#### OpenCloud

The snippet below enables the [OpenCloud](https://github.com/opencloud-eu) service and disables TLS between the proxy and OpenCloud (only recommended when using together with a reverse proxy, see below)

``` nix
  environment.etc."opencloud-admin-pass".text = ''
    IDM_ADMIN_PASSWORD=secure-password
  '';
  services.opencloud = {
    enable = true;
    url = "https://cloud.your.domain";
    address = "127.0.0.1";
    port = port;
    environment = {
      PROXY_TLS = "false"; # disable https when behind reverse-proxy
    };
    environmentFile = "/etc/opencloud-admin-pass";
  };
```

#### Nginx

This snippet enables the Nginx endpoint for OpenCloud.

``` nix
  services.nginx.virtualHosts = {
    "cloud.your.domain" = {
      enableACME = true;
      forceSSL = true;
      locations."/" = {
        proxyPass = "http://127.0.0.1:9200";
        proxyWebsockets = true;
        extraConfig = ''
          proxy_set_header Host $host;
        '';
      };
    };
  };
```

#### Radicale

OpenCloud doesn't natively support CalDAV and CardDAV but can serve as a proxy to a Radicale service.

``` nix
  services.opencloud.settings.proxy.additional_policies = [
    {
      name = "default";
      routes = [
        {
          endpoint = "/caldav/";
          backend = "127.0.0.1:5232";
          remote_user_header = "X-Remote-User";
          skip_x_access_token = true;
          additional_headers = [{"X-Script-Name" = "/caldav";}];
        }
        {
          endpoint = "/.well-known/caldav";
          backend = "127.0.0.1:5232";
          remote_user_header = "X-Remote-User";
          skip_x_access_token = true;
          additional_headers = [{"X-Script-Name" = "/caldav";}];
        }
        {
          endpoint = "/carddav/";
          backend = "127.0.0.1:5232";
          remote_user_header = "X-Remote-User";
          skip_x_access_token = true;
          additional_headers = [{"X-Script-Name" = "/carddav";}];
        }
        {
          endpoint = "/.well-known/carddav";
          backend = "127.0.0.1:5232";
          remote_user_header = "X-Remote-User";
          skip_x_access_token = true;
          additional_headers = [{"X-Script-Name" = "/carddav";}];
        }
      ];
    }
  ];

  services.radicale = {
    enable = true;
    settings = {
      server = {
        hosts = [ "127.0.0.1:5232" ];
        ssl = false; # disable SSL, only use when behind reverse proxy
      };
      auth = {
        type = "http_x_remote_user"; # disable authentication, and use the username that OpenCloud provides
      };
      web = {
        type = "none";
      };
      storage = {
        filesystem_folder = "/var/lib/radicale/collections";
        predefined_collections = builtins.toJSON {
          def-addressbook = {
            "D:displayname" = "OpenCloud Address Book";
            tag = "VADDRESSBOOK";
          };
          def-calendar = {
            "C:supported-calendar-component-set" = "VEVENT,VJOURNAL,VTODO";
            "D:displayname" = "OpenCloud Calendar";
            tag = "VCALENDAR";
          };
        };
      };
      logging = {
        level = "debug"; # optional, enable debug logging
        bad_put_request_content = true; # only if level=debug
        request_header_on_debug = true; # only if level=debug
        request_content_on_debug = true; # only if level=debug
        response_content_on_debug = true; # only if level=debug
      };
    };
  };
```

#### Collabora online

There are several quirks if you want a working WOPI setup with Collabora Online [1](https://www.collaboraonline.com/).

First, you can enable the wopi part of opencloud with :

    OC_ADD_RUN_SERVICES=collaboration
    COLLABORATION_APP_NAME=Office
    COLLABORATION_APP_PRODUCT=Collabora
    COLLABORATION_APP_ADDR=http://[::1]:9980
    COLLABORATION_APP_INSECURE=true

    COLLABORATION_WOPI_SRC=https://cloud.yourdomain.com
    COLLABORATION_APP_PROOF_DISABLE=true

The plain config equivalent is easy to find in [Opencloud's documentation](https://docs.opencloud.eu/docs/dev/server/services/collaboration/yaml-config).

Now when you launch OpenCloud with that, it will not allow Collabora to be embedded. For that, you need to override the CSP with the following options:

``` nix
{
  opencloud = {
    environmentFile = config.age.secrets.opencloudEnv.path; # The file with the env mentioned above
      settings = {
        # An override of the default CSP: every parameter has to be re-written, default can be found on opencloud's compose files
        csp = {                                      
          directives = {
            child-src = [
              "'self'"
            ];

            connect-src = [
              "'self'"
              "blob:"
              "https://\${COMPANION_DOMAIN|companion.opencloud.test}\${TRAEFIK_PORT_HTTPS}/"
              "wss://\${COMPANION_DOMAIN|companion.opencloud.test}\${TRAEFIK_PORT_HTTPS}/"
              "https://raw.githubusercontent.com/opencloud-eu/awesome-apps/"
              "https://\${IDP_DOMAIN|keycloak.opencloud.test}\${TRAEFIK_PORT_HTTPS}/"
              "https://update.opencloud.eu/"
            ];
            default-src = [
              "'none'"
            ];
            font-src = [
              "'self'"
            ];
            frame-ancestors = [
              "'self'"
            ];
            frame-src = [
              "'self'"
              "blob:"
              "https://embed.diagrams.net"
      
              # Here is the culprit, put your own office service's URL
              "https://office.yourdomain.com"

              # This is needed for the external-sites web extension when embedding sites
              "https://docs.opencloud.eu"
            ];
            img-src = [
              "'self'"
              "data:"
              "blob:"
              "https://raw.githubusercontent.com/opencloud-eu/awesome-apps/"
              "https://tile.openstreetmap.org/"
            ];
            manifest-src = [
              "'self'"
            ];

            media-src = [
              "'self'"
            ];

            object-src = [
              "'self'"
              "blob:"
            ];

            script-src = [
              "'self'"
              "'unsafe-inline'"
              "https://\${IDP_DOMAIN|keycloak.opencloud.test}\${TRAEFIK_PORT_HTTPS}/"
            ];

            style-src = [
              "'self'"
              "'unsafe-inline'"
            ];
          };
        };

        proxy = {
          # Tell your proxy to look at that CSP file you created
          csp_config_file_location = "/etc/opencloud/csp.yaml";           
            }
          ];
        };
      };
    };
  };
}
```

Now it works, you can open and edit your files, nice. However, when you open them, the font might not be appearing.

CollaboraOnline will likely list fonts from your system, but not be able to display them.

For this, you have 2 options : [run a font server on your server](https://github.com/CollaboraOnline/fontserver)

Or use bindings.

So what happens is that in order to be able to display your fonts, Collabora needs them to be installed not merely on its systemplate but also on the host, and it looks at a specific dir.

This snippet is the one I used :

``` nix
      fileSystems."/usr/share/fonts/collabora" =
        let
          fontDir = pkgs.symlinkJoin {
            name = "collabora-fonts";
            paths = with pkgs; [
              nerd-fonts.departure-mono
              corefonts
            ];
          };
        in
        {
          device = "${fontDir}/share/fonts";
          options = [ "bind" ];
        };
```
