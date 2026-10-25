<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Harmonia -->

[harmonia](https://github.com/nix-community/harmonia) is a small utility to serve a Nix store as a <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>, allowing it to be used as a substituter by other Nix installations.

### Setup

First generate required public and private store keys, in this example for the domain `cache.example.org`.

``` bash
mkdir -p /var/lib/harmonia
nix-store --generate-binary-cache-key cache.example.org-1 \
  /var/lib/harmonia/cache-priv-key.pem \
  /var/lib/harmonia/cache-pub-key.pem
```

Add following snippet to your system configuration and apply it.

``` nix
services.harmonia = {
  cache.enable = true;
  signKeyPaths = [ "/var/lib/harmonia/cache-priv-key.pem" ];
};
```

The cache will be served on <http://127.0.0.1:5000>. It should be served with a web server such as <a href="Caddy" class="wikilink" title="Caddy">Caddy</a>.

``` nix
services.caddy = {
  enable = true;
  openFirewall = true;
  virtualHosts."cache.example.org".extraConfig = ''
    reverse_proxy 127.0.0.1:5000
  '';
};
```

Visit <https://cache.example.org> where you'll also find instructions on how to setup the cache on a client.
