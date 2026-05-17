<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bind -->

[BIND](https://www.isc.org/bind/) (Berkeley Internet Name Domain) is one of the most widely used DNS servers.

## Caching DNS resolver

If you are trying to setup bind as a simple DNS resolver, this can be configured using all the default options. You'll just need to enable the service:

``` nix
{ ... }:
{
  services.bind = {
    enable = true;
  };
}
```

## Serving DNS for Your Domain

To run BIND as the primary DNS server for your domain, you can start with this config:

``` nix
{ pkgs, ... }:
{
  services.bind = {
    enable = true;
    zones = {
      "example.com" = {
        master = true;
        file = pkgs.writeText "zone-example.com" ''
          $ORIGIN example.com.
          $TTL    1h
          @            IN      SOA     ns1 hostmaster (
                                           1    ; Serial
                                           3h   ; Refresh
                                           1h   ; Retry
                                           1w   ; Expire
                                           1h)  ; Negative Cache TTL
                       IN      NS      ns1
                       IN      NS      ns2

          @            IN      A       203.0.113.1
                       IN      AAAA    2001:db8:113::1
                       IN      MX      10 mail
                       IN      TXT     "v=spf1 mx"

          www          IN      A       203.0.113.1
                       IN      AAAA    2001:db8:113::1

          ns1          IN      A       203.0.113.4
                       IN      AAAA    2001:db8:113::4

          ns2          IN      A       198.51.100.5
                       IN      AAAA    2001:db8:5100::5
        '';
      };
    };
  };
}
```

You'll need to modify the zone file to match your use case. You can lookup other common setups in [BIND's documentation](https://bind9.readthedocs.io/en/stable/chapter3.html).

## Split DNS resolver

Split DNS allows you to manage privately resolving DNS records for a network, while also resolving queries for other websites. This is common in VPN setups, and it used by providers such as [tailscale](https://tailscale.com/learn/why-split-dns). You may want to configure the networks that can use BIND as a cache (using cacheNetworks) and the networks that can query your private hosted zones (using allowQuery).

``` nix
{ pkgs, ... }:
{
  services.bind = {
    enable = true;
    cacheNetworks = [ "127.0.0.0/24" "::1/128" "192.168.0.0/24" ];
    zones = {
      "example.com" = {
        master = true;
        allowQuery = [ "127.0.0.0/24" "::1/128" "192.168.0.0/24" ];
        file = pkgs.writeText "zone-example.com" ''
          ...
        '';
      };
    };
  };
}
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
