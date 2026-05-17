<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NextDNS -->

[NextDNS](https://nextdns.io/) is a commercial DNS provider with a subscription model. The DNS resolution is highly configurable.

# Installation and configuration

It is necessary to install the nextdns package in addition to enabling the service. Otherwise it is not possible to (de-)activate it.

``` nixos
environment.systemPackages = with pkgs; [ nextdns ];
```

To install NextDNS it is also necessary to enable the service and supply the link to the subdomain of the configuration (abcdef will use abcdef.dns.nextdns.io). The cache-size is optional. Default for cache-size is not using a cache at all.

``` nixos
services.nextdns = {

 enable = true;
 arguments = [ "-config" "abcdef" "-cache-size" "10MB" ];

};
```

# Activation

NextDNS needs to be activated after a NixOS rebuild. It can be activated manually or by configuration.

## Manual activation

``` bash
sudo nextdns activate
```

## Activation by configuration

``` nixos
systemd.services.nextdns-activate = {
    script = ''
      /run/current-system/sw/bin/nextdns activate
    '';
    after = [ "nextdns.service" ];
    wantedBy = [ "multi-user.target" ];
  };
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
