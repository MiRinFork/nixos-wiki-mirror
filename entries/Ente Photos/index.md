<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ente Photos -->

[Ente](https://ente.io) is a self-hostable Google Photos alternative with S3 support and client for web and all major platforms.

The server API server (museum) and the web frontend (ente-web) can be deployed independently and are provided as two separate packages in nixpkgs. It is also possible to deploy only the API server and use a desktop or mobile client only, the frontend is not mandatory.

# Setup

Following configuration will enable a basic API server instance.

``` nix
services.museum = {
  enable = true;
  settings = { 
  # TODO add example
  };
  credentialsFile = "/path/to/secrets/creds.yaml";
  environmentFile = "/path/to/env";
};
```

To host the web client as well, the files from the frontend package (ente-web) can be directly served using a webserver like nginx or caddy.

``` nix
services.nginx = {
  enable = true;
  virtualHosts."photos.example.com" = {
    enableACME = true;
    forceSSL = true;
    root = pkgs.ente-web;
  };
};
```

# Tips and tricks

The web-client, the desktop-client and the mobile clients (iOS, Android) all allow using custom, self-hosted servers. To create an account or log into your own server **Tap or click the logo in the welcome screen 7 times**. This will bring up a setting where you can specify a non-official Ente API server.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
