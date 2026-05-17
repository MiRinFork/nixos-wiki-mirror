<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plex -->

[Plex media server](https://www.plex.tv/) allows you to aggregate all your personal media and access it anywhere you go. Enjoy your own content on all your devices with Plex.

## Basic setup

Plex is packaged in Nix. All you need is to edit your `configuration.nix`. A simple configuration looks like:

``` nix
services.plex = {
  enable = true;
  openFirewall = true;
};
```

After adding this to your `configuration.nix` just rebuild your system.

Of course there's some more [options](https://search.nixos.org/options?query=plex) that you can customize.

If your Plex media server is behind a router, you'll need to forward TCP port `32400` to your Plex media server.

Access Plex media server by browsing to [`http://lan_ip:32400/web`](http://lan_ip:32400/web)

### Allow Plex to read external drives

You might encounter permission issues when you try to access external drives if you haven't configured anything else with the server yet. If you haven't explicitly set up a mounting configuration for your drives and instead have your desktop environment (e.g. GNOME or KDE) automatically mount it when you try accessing it via their file explorers, Plex won't be able to access the drive. This is because the desktop environment mounts it to your user, while Plex runs by default as the "plex" user.

The easiest way to allow Plex to see these external drives is to change the Plex service's user . Here is an example:

``` nix
services.plex = {
  enable = true;
  openFirewall = true;
  user="yourusername";
};
```

If you have changed the user option after you have already installed Plex, you have to change the permissions of the folder /var/lib/plex via chown to the user you set it to by doing this:

``` nix
  sudo chown -R /var/lib/plex 
```

The alternative to this is to explicitly mount the drives via <a href="Filesystems" class="wikilink" title="Filesystems">Filesystems</a>. This takes more effort to set up and requires every new drive you want plex to see to be explicitly declared, but allows more control in what Plex is allowed to see.

## Clients

### Plex Media Player

[Plex Media Player](https://www.plex.tv/blog/plex-media-player-now-ambidextrous-free-kodi-said/) is Plex's media client, packaged in Nix as plex-media-player.

### Plex Desktop

Alternatively, a newer and more modern Plex client called Plex Desktop is packaged in Nix as plex-desktop.

To be able to sign in in Plex Desktop, you may need to set `xdg.portal.xdgOpenUsePortal = true;` in your NixOS configuration. [See this issue](https://github.com/NixOS/nixpkgs/issues/341968).

### Plexamp

Plex also provide Plexamp for music. It's packaged in Nix but (as of August 2024) only for x86_64.

## SSL access via Nginx reverse proxy

Because of several redirects within Plex media server it's not easy to make it accessible through SSL. The browser can complain, even if you have configured proper SSL certificates in your Plex setup.

Fortunately [Nginx](https://www.nginx.com/) can be used as a reverse proxy server to access Plex media server. Most of the configuration below comes from [kopfpilot](https://forums.plex.tv/t/how-to-setup-nginx-as-a-reverse-proxy-for-plex/212702/2) on the Plex forum.

``` nix
# Nginx Reverse SSL Proxy
services.nginx = {
  enable = true;
  # give a name to the virtual host. It also becomes the server name.
  virtualHosts."sub.domain.tld" = {
    # Since we want a secure connection, we force SSL
    forceSSL = true;

    # http2 can more performant for streaming: https://blog.cloudflare.com/introducing-http2/
    http2 = true;

    # Provide the ssl cert and key for the vhost
    sslCertificate = "/https-cert.pem";
    sslCertificateKey = "/https-key.pem";
    extraConfig = ''

      #Some players don't reopen a socket and playback stops totally instead of resuming after an extended pause
      send_timeout 100m;

      # Why this is important: https://blog.cloudflare.com/ocsp-stapling-how-cloudflare-just-made-ssl-30/
      ssl_stapling on;
      ssl_stapling_verify on;

      # Forward real ip and host to Plex
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Host $server_addr;
      proxy_set_header Referer $server_addr;
      proxy_set_header Origin $server_addr; 

      # Plex has A LOT of javascript, xml and html. This helps a lot, but if it causes playback issues with devices turn it off.
      gzip on;
      gzip_vary on;
      gzip_min_length 1000;
      gzip_proxied any;
      gzip_types text/plain text/css text/xml application/xml text/javascript application/x-javascript image/svg+xml;
      gzip_disable "MSIE [1-6]\.";

      # Nginx default client_max_body_size is 1MB, which breaks Camera Upload feature from the phones.
      # Increasing the limit fixes the issue. Anyhow, if 4K videos are expected to be uploaded, the size might need to be increased even more
      client_max_body_size 100M;

      # Plex headers
      proxy_set_header X-Plex-Client-Identifier $http_x_plex_client_identifier;
      proxy_set_header X-Plex-Device $http_x_plex_device;
      proxy_set_header X-Plex-Device-Name $http_x_plex_device_name;
      proxy_set_header X-Plex-Platform $http_x_plex_platform;
      proxy_set_header X-Plex-Platform-Version $http_x_plex_platform_version;
      proxy_set_header X-Plex-Product $http_x_plex_product;
      proxy_set_header X-Plex-Token $http_x_plex_token;
      proxy_set_header X-Plex-Version $http_x_plex_version;
      proxy_set_header X-Plex-Nocache $http_x_plex_nocache;
      proxy_set_header X-Plex-Provides $http_x_plex_provides;
      proxy_set_header X-Plex-Device-Vendor $http_x_plex_device_vendor;
      proxy_set_header X-Plex-Model $http_x_plex_model;

      # Buffering off send to the client as soon as the data is received from Plex.
      proxy_redirect off;
      proxy_buffering off;
    '';
    locations."/" = {
      proxyPass = "http://plex.domain.tld:32400/";
      proxyWebsockets = true;
    };
  };
};
```

In order to use that, basically set the vhost name from `sub.domain.tld` to your actual (sub)domain name. Also point to the right `sslCertificate` and `sslCertificateKey`. Finally set the `proxyPass` address to where your Plex media server is.

After applying the changes, just browse to [`https://sub.domain.tld/web`](https://sub.domain.tld/web). Of course use your actual (sub)domain name.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
