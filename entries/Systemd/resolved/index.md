<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/resolved -->

[systemd-resolved](https://www.freedesktop.org/software/systemd/man/systemd-resolved.html) is a <a href="systemd" class="wikilink" title="systemd">systemd</a> service that provides network name resolution to local applications via a D-Bus interface, the resolve NSS service (nss-resolve(8)), and a local DNS stub listener on 127.0.0.53. See systemd-resolved(8) for the usage.

# Secure DNS and Captive Portal

Secure DNS will break most captive portals like those of public or hotel wifi access points, resulting in inability to gain internet access through such access points.

In that case, use `networkctl status ${wlan interface}` to show the default DNS provided by the network, and temporarily change nameserver inside `/etc/resolv.conf` from `127.0.0.53` to the provided one.

Alternatively, if you have Chromium installed, you can use the `programs.captive-browser.enable` Chromium wrapper, which is "Dedicated Chrome instance to log into captive portals without messing with DNS settings".

# Configuration Example: Enforce secure DNS

See also <a href="Encrypted_DNS" class="wikilink" title="Encrypted DNS">Encrypted DNS</a>.

The following configuration configures resolved daemon to use the public DNS resolver provided by [Cloudflare](https://www.cloudflare.com/learning/dns/what-is-1.1.1.1/). DNSSEC and DNS-over-TLS is enabled for authenticity and encryption.

``` nix
networking.nameservers = [
  "1.1.1.1"
  "1.0.0.1"
];

services.resolved = {
  enable = true;
  dnssec = "true";
  domains = [ "~." ];
  dnsovertls = "true";
  fallbackDns = [
    "1.1.1.1"
    "1.0.0.1"
  ];
};
```

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
