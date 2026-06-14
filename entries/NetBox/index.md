<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NetBox -->

[](https://netbox.dev/) is a network infrastructure documentation tool. It is a web application and this <a href="Module" class="wikilink" title="Module">Module</a> can be installed and configured via several options.

## Setup

### Setup Secret Key

Netbox uses a secret key to derive new hashes for passwords and HTTP cookies [1](https://docs.netbox.dev/en/stable/configuration/required-parameters/#secret_key).

You should **NOT** share this key outside the configuration (i.e. in /nix/store) and it must be at least 50 characters long:

``` bash
mkdir -p /var/lib/netbox/
nix-shell -p openssl
openssl rand -hex 50 > /var/lib/netbox/secret-key-file
# For netbox 4.5
$(find /nix/store -name generate_secret_key.py) > /var/lib/netbox/api-token-peppers-file
```

### Configuration

#### Basic Configuration

The module will automatically set up a Redis instance and a PostgreSQL database.

``` nix
{ config, ... }: {

  networking.firewall.allowedTCPPorts = [ 80 ];

  services.netbox = {
    enable = true;
    secretKeyFile = "/var/lib/netbox/secret-key-file";
    # For netbox 4.5
    apiTokenPeppersFile = "/var/lib/netbox/api-token-peppers-file";
    settings = {
      # DEBUG = true;   # use this if you hit the CSRF error.
      ALLOWED_HOSTS = [ "[::1]" ];  # from proxyPass (below)
      CSRF_TRUSTED_ORIGINS = [ "http://__YOUR_HOSTNAME_HERE__" ];  # CSRF error fix
    };
  };

  services.nginx = {
    enable = true;
    user = "netbox"; # otherwise nginx cant access netbox files
    recommendedProxySettings = true; # otherwise you will get CSRF error while login
    virtualHosts.<name> = {
      locations = {
        "/" = {
          proxyPass = "http://[::1]:8001";
          # proxyPass = "http://${config.services.netbox.listenAddress}:${toString config.services.netbox.port}";
        };
        "/static/" = { alias = "${config.services.netbox.dataDir}/static/"; };
      };
    };
  };
} 
```

#### With Transport encryption

``` nix
{ config, ... }: {

  networking.firewall.allowedTCPPorts = [ 80 443 ];

  services.netbox = {
    enable = true;
    secretKeyFile = "/var/lib/netbox/secret-key-file";
  };

  services.nginx = {
    enable = true;
    forceSSL = true;
    user = "netbox"; # otherwise nginx cant access netbox files
    recommendedProxySettings = true; # otherwise you will get CSRF error while login
    recommendedTlsSettings = true;
    enableACME = true;
    virtualHosts.<name> = {
      locations = {
        "/" = {
          proxyPass = "http://[::1]:8001";
          # proxyPass = "http://${config.services.netbox.listenAddress}:${toString config.services.netbox.port}";
        };
        "/static/" = { alias = "${config.services.netbox.dataDir}/static/"; };
      };
    };
  };

  security.acme = {
    [ ... ]
    acceptTerms = true;
  };

} 
```

For more acme settings and further instruction, please look here <a href="ACME" class="wikilink" title="ACME">ACME</a>.

For more nginx settings and further instruction, please look here <a href="Nginx" class="wikilink" title="Nginx.">Nginx.</a>

### Plugins

The NixOS module supports plugins from nixpkgs; currently about half of the [existing NetBox plugins](https://netboxlabs.com/plugins/) are packaged there. Until 26.05 these plugins are available as part of [python3Packages](https://search.nixos.org/packages?type=packages&query=python3Packages+netbox). Since 26.05 plugins can be found in the \[<https://search.nixos.org/packages?type=packages&query=netboxPlugins>. netboxPlugins\] package set. The documentation for plugins is being worked on and discussed in [\#261522](https://github.com/NixOS/nixpkgs/issues/261522).

To include a plugin:

``` nix
{ pkgs, ... }: {
  services.netbox = {
    plugins = ps: with ps; [ ps.netbox-reorder-rack ];
    settings.PLUGINS = ["netbox_reorder_rack"];
  };
}
```

The plugin identifier for

``` nix
services.netbox.settings.PLUGINS
```

is usually contained in the official documentation for the plugin. It usually is slightly different from the package name.

Some plugins depend on other plugins (e. g. netbox-config-backup on netbox-napalm-plugin, or netbox-peering-manager on netbox-routing) and some are incompatible with each other (e. g. netbox-bgp and netbox-routing).

### Setup Superuser

There will be no user after the installation, so you need to register one manually.

To do this, run:

``` bash
$ netbox-manage createsuperuser

Username (leave blank to use 'netbox'): 
Email address: 
Password: 
Password (again): 

Superuser created successfully.
```

You can now log in with the given credentials.

### Troubleshooting

#### CSRF aborted message at login

If you still get an CSRF aborted message while trying to log in after doing everything above, enable DEBUG mode to get a detailed description of the problem.

It could be these problem <https://stackoverflow.com/questions/11516635/django-does-not-send-csrf-token-again-after-browser-cookies-has-been-cleared> but I'm not sure.

## Documentation

- <https://netbox.dev/>
  - <https://docs.netbox.dev/>

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
