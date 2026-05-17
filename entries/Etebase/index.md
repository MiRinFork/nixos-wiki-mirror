<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Etebase -->

[](https://www.etebase.com/) is an end-to-end encrypted backend as a service. Think Firebase, but encrypted in a way that only your users can access their data.

## Example configurations

- For the server to accept requests from a remote machine variable should be set as the server's subdomain/domain name and your proxy has to present a header.

- The django [secret key](https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-SECRET_KEY) is preferably a randomly generated key, the use of a secret managing scheme might prove useful. see <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Comparison_of_secret_managing_schemes">Comparison_of_secret_managing_schemes</a>.

- needs to be writeable by configured . If you're experiencing errors on initial setup, make sure there is no file at the filepath so that Etebase can generate it

### Nginx example

This is a basic configuration to run the Etebase server:

``` nixos
  networking.firewall.allowedTCPPorts = [ 443 ];
  services = {
    etebase-server = {
      enable = true;
      unixSocket = "/var/lib/etebase-server/etebase-server.sock"; 
      user = "etebase-server";
      settings = {
        global.debug = false;
        global.secret_file = "/path/to/secret";
        allowed_hosts.allowed_host1 = "etebase.your.domain";
      };
    };
    nginx = {
      enable = true;
      recommendedOptimisation = true;
      recommendedProxySettings = true;
      recommendedTlsSettings = true;
      recommendedGzipSettings = true;
      virtualHosts."etebase.your.domain" = {
        enableACME = true;
        forceSSL = true;
        locations."/".proxyPass = "http://unix:/var/lib/etebase-server/etebase-server.sock";
      };
    };
  };
```

### Caddy example

``` nixos
services.caddy = {
  enable = true;
  virtualHosts = {
    "etebase.your.domain".extraConfig = ''
      reverse_proxy 127.0.0.1:8001 {
        header_up Host {upstream_hostport}
      }
    '';
  };
};

services.etebase-server = {
  enable = true;
  settings = {
    allowed_hosts = {
      allowed_host2 = "etebase.your.domain";
      allowed_host1 = "127.0.0.1";
    };
    global.secret_file = "/path/to/secret";
  };
};
```

## Admin user

To use the Etebase server, the creation of an admin account is required. This requires manual intervention:

#### CLI Method

``` bash
sudo etebase-server createsuperuser
```

#### INI Method

First you need to find where the generated configuration file is located:

``` sh
ls /nix/store | grep etebase-server.ini 
```

As a super user, run this command: `ETEBASE_EASY_CONFIG_PATH=/path/to/etebase-server.ini etebase-server createsuperuser` and that should prompt you to create a user.

#### After

Login with these credentials to <https://etebase.your.domain/admin> and create users for your etebase clients through the GUI.

## See also

- <https://github.com/etesync/server#usage>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Django" class="wikilink" title="Category:Django">Category:Django</a>
