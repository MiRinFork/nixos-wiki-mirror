<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Unbound -->

[Unbound](https://www.nlnetlabs.nl/projects/unbound/about/) is a DNS server. Quoting the official project page:

Unbound is a validating, recursive, caching DNS resolver. It is designed to be fast and lean and incorporates modern features based on open standards.

## Minimal configuration. DNS resolver

In this case our DNS queries are not encrypted upstream because the internet root name servers do not support DNS-over-TLS (DoT) or DNS-over-HTTPS (DoH).

``` nixos
services.unbound = {
  enable = true;
  # next line is optional (RFC7816)
  settings.server.qname-minimisation = true;
};
```

Test if it's working

    $ nslookup nixos.org localhost
    $ systemctl status unbound.service
    $ cat /etc/unbound/unbound.conf

If during the configuration our computer stops resolving DNS and we lose connectivity, we can manually set the line `nameserver 9.9.9.9` doing `sudo nano /etc/resolv.conf`. Now we can rebuild our system.

## DNS forwarder with blocklists

In this configuration we are using DoT to reach Quad9 and Cloudflare public DNS resolvers, in addition, we are filtering the results with a list that blocks adds and improves privacy and security (as Pi-hole does).

``` nixos
services.unbound = {
  enable = true;

  settings.server = {
    # Our Unbound server IP
    interface = [ "192.168.1.2" ];
    # IPs allowed to query
    access-control = [ "192.168.1.0/24 allow" ];
    # Enable RPZ
    module-config = "'respip validator iterator'";
  };

  settings.rpz = [{
    name = "hageziPro";
    url = "https://cdn.jsdelivr.net/gh/hagezi/dns-blocklists@latest/rpz/pro.txt";
  }];

  settings.forward-zone = [{
    name = ".";
    forward-tls-upstream = true;
    forward-addr = [
      "9.9.9.9@853#dns.quad9.net"
      "149.112.112.112@853#dns.quad9.net"
      "1.1.1.1@853#cloudflare-dns.com"
      "1.0.0.1@853#cloudflare-dns.com"
    ];
  }];
};
```

## Further reading

- [Official project page](https://www.nlnetlabs.nl/projects/unbound/about/)
- <https://unbound.docs.nlnetlabs.nl/en/latest/>
- [ArchWiki page](https://wiki.archlinux.org/title/Unbound)

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
