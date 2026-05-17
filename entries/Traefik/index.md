<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Traefik -->

[Traefik](https://traefik.io) is a <a href="wikipedia:Reverse_proxy" class="wikilink" title="reverse proxy">reverse proxy</a> and <a href="wikipedia:Load_balancing_(computing)" class="wikilink" title="load balancer">load balancer</a>.

## Installation

To install Traefik, add the following to your NixOS configuration:

``` nixos
services.traefik.enable = true;
```

\[<https://search.nixos.org/options?show=services.traefik>. More options\] are available.

## Configuration

#### Using Nix

``` nixos
  services.traefik = {
    enable = true;

    staticConfigOptions = {
      entryPoints = {
        web = {
          address = ":80";
          asDefault = true;
          http.redirections.entrypoint = {
            to = "websecure";
            scheme = "https";
          };
        };

        websecure = {
          address = ":443";
          asDefault = true;
          http.tls.certResolver = "letsencrypt";
        };
      };

      log = {
        level = "INFO";
        filePath = "${config.services.traefik.dataDir}/traefik.log";
        format = "json";
      };

      certificatesResolvers.letsencrypt.acme = {
        email = "postmaster@YOUR.DOMAIN";
        storage = "${config.services.traefik.dataDir}/acme.json";
        httpChallenge.entryPoint = "web";
      };

      api.dashboard = true;
      # Access the Traefik dashboard on <Traefik IP>:8080 of your server
      # api.insecure = true;
    };

    dynamicConfigOptions = {
      http.routers = {};
      http.services = {};
    };
  };
```

#### Using non-Nix configuration files

If you are migrating from a Non-NixOS system, you might be interested in the `staticConfigFile` and `dynamicConfigFile` options.

You can set `staticConfigFile` like this:

``` nixos
services.traefik.staticConfigFile = ./static_config.toml;
```

But you need to be careful about how you set the `services.traefik.dynamicConfigFile` option, if you use a path like shown above, your file will end up in the <a href="Nix_store" class="wikilink" title="Nix store">Nix store</a>, and it will change every time you update your configuration, which means Traefik won't be able to reload with your changes automatically, which defeats the point of using the dynamic config file.

A way to avoid this is to use `etc.environment`:

``` nixos
# Note the quotes around the path!
services.traefik.dynamicConfigFile = "/etc/traefik/dynamic_config.toml";
# If you use staticConfigFile instead, update your file provider accordingly.
services.traefik.staticConfigOptions.providers.file.watch = true;

environment.etc."traefik/dynamic_config.toml" = {
    user = config.systemd.services.traefik.serviceConfig.User;
    group = config.systemd.services.traefik.serviceConfig.Group;
    mode = "400";
    text = ''
        # ...
    '';
    # Or,
    # source = ./dynamic_config.toml     
};
```

Additionally, you can not use a `...ConfigFile` option and a `...ConfigOptions` for either static or dynamic configuration. The file options always take precedence over the options options, which are ignored.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
