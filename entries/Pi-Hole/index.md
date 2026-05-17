<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Pi-Hole -->

[Pi-Hole](https://pi-hole.net/) is a DNS service that functions as network ad-blocker.

## Minimal Configuration Example

``` nix
services.pihole-ftl = {
  enable = true;
  settings = {
    # See <https://docs.pi-hole.net/ftldns/configfile/>

    # External DNS Servers quad9 and cloudflare
    dns.upstreams = [ "9.9.9.9" "1.1.1.1" ];

    # Optionally resolve local hosts (domain is optional)
    dns.hosts = [ "192.168.1.188 hostname.domain" ];
  };
};
```

Test if it's working

    $ systemctl status pihole-ftl.service
    $ nslookup nixos.org localhost
    $ nslookup hostname.domain localhost

## Adding lists and enabling web interface

``` nix
services.pihole-ftl = {
  enable = true;
  settings = {
    # See <https://docs.pi-hole.net/ftldns/configfile/>

    # External DNS Servers quad9 and cloudflare
    dns.upstreams = [ "9.9.9.9" "1.1.1.1" ];

    # Optionally resolve local hosts (domain is optional)
    dns.hosts = [ "192.168.1.188 hostname.domain" ];
  };

  lists = [    # Lists can be added via URL
    {
      url = "https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/pro.txt";
      type = "block";
      enabled = true;
      description = "hagezi blocklist";
    }
  ];
};

services.pihole-web = {
  enable = true;
  ports = [ "443s" ];
};
```

Test pihole web interface at <https://localhost:443>

Now you can set your router's DNS server to the IP of the host running pihole and blocked domains should not be resolved.
