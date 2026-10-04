<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hister -->

Hister is a private, self hosted search engine for pages you visit and files you keep. It indexes their full contents so you can find information again from the web interface, terminal, API, or an AI assistant connected through MCP.[^1]

## Installation

The basic configuration of Hister is as following:

``` nixos
{ pkgs, config, ... }:
{
  # by default binds on 127.0.0.1:4433
  services.hister = {
    enable = true; 
}
```

The more advance configuration of Hister is as follow:

``` nixos
{ pkgs, config, ... }:
{
  services.hister = {
    enable = true;
    dataDir = "/var/lib/hister"; # where the database is stored 
    port = 4433;
    settings = {
      app = {
        search_url = "https://google.com/search?q={query}"; # can be changed to any address that follows that format.
        log_level = "info";
      };
      server = {
        address = "127.0.0.1:4433"; # to let other devices access, you can change the address to 0.0.0.0
        database = "db.sqlite3";
      };
      hotkeys.web = {
        "/" = "focus_search_input";
        "enter" = "open_result";
      };
    };
  };
}
```

## Servers and Public instances

Note that Hister’s server does not support HTTPS itself,[^2] if you wish to remotely access your Hister instance, you can either use a remote access service like Netbird[^3], or use a reverse proxy like Nginx.

If you have a domain, you can use this basic Nginx configuration:

``` nixos
  services.nginx = {
    enable = true;

    recommendedGzipSettings = true;
    recommendedOptimisation = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;

    virtualHosts."hister.example.com" = { # change to your domain
      enableACME = true;
      forceSSL = true;

      locations."/" = {
        proxyPass = "http://0.0.0.0:4433"; # change to the IP/port you set in the Hister config.
        proxyWebsockets = true;
      };
    };
  };

  security.acme = {   # will enabled https
    acceptTerms = true;
    defaults.email = "admin@youremail.address"; 
  };
```

If you are planning to have your Hister instance be accessible from a public website, you can add this to the Hister config ensure people can't read and/or write into your config without a password.

``` nixos
  app = {
    access_token = "access-password"; # changed as this will be the password to access the database
    public = true; # if set to true, the database will be read-only without the token. If set to false, the token will be required to view/write.
  };
```

[^1]: <https://hister.org/docs/intro>

[^2]: <https://hister.org/docs/server-setup#>:~:text=Hister%E2%80%99s%20server%20does%20not%20support%20HTTPS%20itself

[^3]: <https://netbird.io/>
