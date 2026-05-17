<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Blocky -->

[Blocky](https://github.com/0xERR0R/blocky) is a DNS proxy and ad-blocker for the local network written in <a href="Go" class="wikilink" title="Go">Go</a>. It provides network wide adblocking similar to Pi-hole while offering additional features (and it's in nixpkgs).

## Configuration Examples

``` nix
services.blocky = {
    enable = true;
    settings = {
      ports.dns = 53; # Port for incoming DNS Queries.
      upstreams.groups.default = [
        "https://one.one.one.one/dns-query" # Using Cloudflare's DNS over HTTPS server for resolving queries.
      ];
      # For initially solving DoH/DoT Requests when no system Resolver is available.
      bootstrapDns = {
        upstream = "https://one.one.one.one/dns-query";
        ips = [ "1.1.1.1" "1.0.0.1" ];
      };
      #Enable Blocking of certain domains.
      blocking = {
        denylists = {
          #Adblocking
          ads = ["https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts"];
          #Another filter for blocking adult sites
          adult = ["https://blocklistproject.github.io/Lists/porn.txt"];
          #You can add additional categories
        };
        #Configure what block categories are used
        clientGroupsBlock = {
          default = [ "ads" ];
          kids-ipad = ["ads" "adult"];
        };
      };
    };
  };
```

## Adding Additional Functionality

To add a cache of DNS Requests and Prefetching add:

``` nix
caching = {
  minTime = "5m";
  maxTime = "30m";
  prefetching = true;
};
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
