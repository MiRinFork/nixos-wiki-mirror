<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mattermost -->

[Mattermost](https://mattermost.com/) is an open source, self-hosted Slack-alternative. As an alternative to proprietary SaaS messaging, Mattermost brings all your team communication into one place, making it searchable and accessible anywhere.[^1]

## Installation

Add `mattermost` to your `environment.systemPackages`.

``` nix
environment.systemPackages = with pkgs; [
  mattermost
];
```

## Setup

### Mattermost

To setup Mattermost, you need to enable its service, and provide it with a site url.

``` nix
services.mattermost = {
  enable = true;
  siteUrl = "https://mattermost.example.com"; # Set this to the URL you will be hosting the site on.
};
```

After a rebuild, Mattermost will now be accessible at [`http://127.0.0.1:8065`](http://127.0.0.1:8065). To set it up to match your `siteUrl`, follow the Nginx config below.

### Nginx

While optional, if you are hosting Mattermost alongside other web services, or need SSL (https), you will likely want to set up a web server like Nginx.

#### Installation

Add `nginx` to your `environment.systemPackages`.

``` nix
environment.systemPackages = with pkgs; [
  mattermost
  nginx
];
```

#### Setup

The following is an example Nginx setup that enables SSL, and configures `mattermost.example.com` to route to Mattermost.

``` nix
# Allow ports 80 and 443 for Nginx
networking.firewall.allowedTCPPorts = [ 80 443 ];

# Set up for SSL certification
security.acme = {
  acceptTerms = true;
  defaults.email = "webmaster@example.com"; # Replace with your preferred email address.
};

# Configure Nginx
services.nginx = {
  enable = true;
  recommendedProxySettings = true;
  recommendedTlsSettings = true;    
  virtualHosts = {
    # Replace with the domain from your siteUrl
    "mattermost.example.com" = {
      forceSSL = true; # Enforce SSL for the site
      enableACME = true; # Enable SSL for the site
      locations."/" = {
        proxyPass = "http://127.0.0.1:8065"; # Route to Mattermost
        proxyWebsockets = true;
      };
    };
  };
};
```

After a rebuild, Mattermost will now be accessible at `siteUrl` (assuming you have configured your DNS).

## References

<references />

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>

[^1]: <https://wiki.archlinux.org/title/Mattermost>
