<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vikunja -->

[Vikunja](https://vikunja.io/) is a self-hostable to-do app with advanced scheduling and collaboration features. A bare minimum configuration with sqlite and a local web interface on <http://localhost:3000> looks like:

``` nix
{
  services.vikunja = {
    enable = true;
    frontendScheme = "http";
    frontendHostname = "localhost";    
  };
}
```

When accessed for the first time, you will be prompted to create an administrator account where additional users can be managed. The full list of options available can be found on the official [nixos option search](https://search.nixos.org/options?query=vikunja). For instance, to expose the web interface via nginx:

``` nix
# file path: ./modules/vikunja.nix
{ hostname, port ? 3456, ... }: { ... }:

{
  services.vikunja = {
    enable = true;
    # Nginx proxy will handle SSL encryption for us
    frontendScheme = "http";
    frontendHostname = hostname;
    port = port;
    settings = {
      service = {
        # If enabled, Vikunja will send an email to everyone who is either 
        # assigned to a task or created it when a task reminder is due.
        enableemailreminders = false;
        # Whether to let new users registering themselves or not
        enableregistration = false;
        # The maximum size clients will be able to request for user avatars.
        # If clients request a size bigger than this, it will be changed on the fly.
        maxavatarsize = 4096;
        # The duration of the issued JWT tokens in seconds.
        jwtttl = 2592000;
        # The duration of the "remember me" time in seconds. When the login request is
        # made with the long param set, the token returned will be valid for this period.
        jwtttllong = 25920000;
        maxitemsperpage = 100;
      };
    };
  };
  services.nginx.virtualHosts.${hostname} = {
    enableACME = true;
    forceSSL = true;
    locations."/" = {
      proxyPass = "http://[::1]:${toString port}";
      proxyWebsockets = true;
      recommendedProxySettings = true;
      extraConfig = ''
        client_max_body_size 5000M;
        proxy_read_timeout   600s;
        proxy_send_timeout   600s;
        send_timeout         600s;
      '';
    };
  };
}
```

And then this module can be imported with the desired arguments passed in:

``` nix
# configuration.nix
{
  imports = [
    (import ./hardware-configuration.nix)
    (import ./modules/vikunja.nix { hostname = "vikunja.example.com"; })
  ];

  # Presumably your nginx-related configuration is stored in an isolated module and not the top-level configuration.nix

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  security.acme = {
    acceptTerms = true;
    defaults.email = "foo@bar.com";
  };

  services.nginx = {
    enable = true;
    recommendedGzipSettings = true;
    recommendedOptimisation = true;
    recommendedTlsSettings = true;
  };
}
```

For a more granular configuration of Vikunja itself or to extend the feature set with service integrations (mailer, Prometheus metric monitoring, etc) see the [Vikunja config documentation](https://vikunja.io/docs/config-options/).

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
