<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Encrypted DNS -->

By default, DNS traffic is sent in plain text over the internet; it can be monitored or spoofed by any party along the path, including your ISP. DNSSEC authenticates the DNS records themselves, but can't stop your ISP monitoring domains or dropping queries.

**Encrypted DNS** protocols aim to address this hole by encrypting queries and responses in transit between DNS resolvers and clients; the most widely deployed ones are <a href="wikipedia:DNS_over_HTTPS" class="wikilink" title="DNS over HTTPS">DNS over HTTPS</a> (DoH), <a href="wikipedia:DNS_over_TLS" class="wikilink" title="DNS over TLS">DNS over TLS</a> (DoT), and [DNSCrypt](https://dnscrypt.info/).

NixOS has modules for multiple encrypted DNS proxies, including [dnscrypt-proxy 2](https://github.com/DNSCrypt/dnscrypt-proxy), [dnsproxy](https://github.com/AdguardTeam/dnsproxy) and [Stubby](https://dnsprivacy.org/wiki/display/DP/DNS+Privacy+Daemon+-+Stubby). `services.dnscrypt-proxy` is generally recommended, as it has the widest protocol and feature support, and is written in a memory-safe language. For DNS over TLS (DoT) support, `services.dnsproxy` can be used. Detailed comparison of DNS proxies can be found on [ArchLinux Wiki](https://wiki.archlinux.org/title/Domain_name_resolution#DNS_servers).

## Setting nameservers

No matter what proxy you use, you should set your DNS nameservers statically and make sure that your network manager won't override your carefully set nameservers with some random settings it received over DHCP.

``` nix
{
  networking = {
    nameservers = [ "127.0.0.1" "::1" ];
    # If using dhcpcd:
    dhcpcd.extraConfig = "nohook resolv.conf";
    # If using NetworkManager:
    networkmanager.dns = "none";
  }

  # Make sure you don't have services.resolved.enable on.
}
```

If you'd prefer to keep using resolvconf then you can set `networking.resolvconf.useLocalResolver` instead. Note that it uses the IPv4 loopback address only.

## Secure DNS and Captive Portal

Secure DNS will break most captive portals like those of public or hotel wifi access points, resulting in inability to gain internet access through such access points.

In that case, use `networkctl status ${wlan interface}` to show the default DNS provided by the network, and temporarily change nameserver inside `/etc/resolv.conf` from `127.0.0.53` to the provided one.

Alternatively, if you have Chromium installed, you can use the `programs.captive-browser.enable` Chromium wrapper, which is "Dedicated Chrome instance to log into captive portals without messing with DNS settings".

## dnscrypt-proxy2

### Basic configuration

``` nixos
let
  hasIPv6Internet = true;
  StateDirectory = "dnscrypt-proxy";
in
{
  # See https://wiki.nixos.org/wiki/Encrypted_DNS
  services.dnscrypt-proxy = {
    enable = true;
    # See https://github.com/DNSCrypt/dnscrypt-proxy/blob/master/dnscrypt-proxy/example-dnscrypt-proxy.toml
    settings = {
      sources.public-resolvers = {
        urls = [
          "https://raw.githubusercontent.com/DNSCrypt/dnscrypt-resolvers/master/v3/public-resolvers.md"
          "https://download.dnscrypt.info/resolvers-list/v3/public-resolvers.md"
        ];
        minisign_key = "RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3"; # See https://github.com/DNSCrypt/dnscrypt-resolvers/blob/master/v3/public-resolvers.md
        cache_file = "/var/lib/${StateDirectory}/public-resolvers.md";
      };

      # Use servers reachable over IPv6 -- Do not enable if you don't have IPv6 connectivity
      ipv6_servers = hasIPv6Internet;
      block_ipv6 = ! (hasIPv6Internet);

      require_dnssec = true;
      require_nolog = false;
      require_nofilter = true;

      # If you want, choose a specific set of servers that come from your sources.
      # Here it's from https://github.com/DNSCrypt/dnscrypt-resolvers/blob/master/v3/public-resolvers.md
      # If you don't specify any, dnscrypt-proxy will automatically rank servers
      # that match your criteria and choose the best one.
      # server_names = [ ... ];
    };
  };

  systemd.services.dnscrypt-proxy.serviceConfig.StateDirectory = StateDirectory;
}
```

See [the upstream example configuration file](https://github.com/DNSCrypt/dnscrypt-proxy/blob/master/dnscrypt-proxy/example-dnscrypt-proxy.toml) for more configuration options.

### Blocklist

Fetch a blocklist file (e.g. oisd) as a flake input:

``` nixos
{ config, lib, pkgs, inputs, ... }:
let
  blocklist_base = builtins.readFile inputs.oisd;
  extraBlocklist = '''';
  blocklist_txt = pkgs.writeText "blocklist.txt" ''
    ${extraBlocklist}
    ${blocklist_base}
  '';
in
{
  services.dnscrypt-proxy.settings.blocked_names.blocked_names_file = blocklist_txt;
}
```

### Local network - Forwarding rules

Maybe you'd like queries for your local domain to go to your router, and not to an upstream DNS resolver. By doing so, names of your local online devices can be found. For this you have to create a file with [forwarding rules](https://github.com/DNSCrypt/dnscrypt-proxy/blob/master/dnscrypt-proxy/example-forwarding-rules.txt) which you then include in your config:

``` nix
{
  services.dnscrypt-proxy = {
    enable = true;
    settings = {
      ...
      forwarding_rules = "/etc/nixos/services/networking/forwarding-rules.txt";
      ...
    };
  };

  ....
}
```

### Using alongside another DNS server

DNS authoritative nameservers are tied to port 53, and the Linux `/etc/resolv.conf` doesn't allow specifying a different port for resolvers either. This leads to conflicts if you have another DNS server you need to expose externally on port 53 (e.g. an authoritative DNS server for your domains, or <a href="acme-dns" class="wikilink" title="acme-dns">acme-dns</a>), and can't easily run it on a separate IP to dnscrypt-proxy2 (e.g. your authoritative DNS server listens on `::`/`0.0.0.0`). You can resolve this by running the proxy on a different port and forwarding loopback traffic on port 53 to it:

``` nix
{
  networking.nameservers = [ "::1" ];

  services.dnscrypt-proxy = {
    enable = true;
    settings = {
      listen_addresses = [ "[::1]:51" ];
      # ...
    };
  };

  # Forward loopback traffic on port 53 to dnscrypt-proxy2.
  networking.firewall.extraCommands = ''
    ip6tables --table nat --flush OUTPUT
    ${lib.flip (lib.concatMapStringsSep "\n") [ "udp" "tcp" ] (proto: ''
      ip6tables --table nat --append OUTPUT \
        --protocol ${proto} --destination ::1 --destination-port 53 \
        --jump REDIRECT --to-ports 51
    '')}
  '';
}
```

Note that you can still access the other DNS server locally through the non-loopback interface (e.g. by using your server's external IP).

## dnsproxy

dnsproxy is a simple DNS proxy server with the widest protocol support.

### Example configuration

``` nix
{
  services.dnsproxy = {
    enable = true;
    settings = {
      # Plain DNS upstream
      upstream = [ "1.1.1.1:53" ];
      # DNS over TLS upstream
      upstream = [ "tls://dns.adguard.com" ];
      # DNS over HTTPS upstream
      upstream = [ "https://dns.adguard.com/dns-query" ];

      listen-addrs = [ "0.0.0.0" ];
      # Plain DNS server
      listen-ports = [ 53 ];
      # DNS over TLS server
      tls-port = [ 853 ];
      # DNS over HTTPS server
      https-port = [ 443 ];
      # Certificate for encrypted DNS server
      tls-crt = "/var/lib/acme/example.org/fullchain.pem";
      tls-key = "/var/lib/acme/example.org/key.pem";
    };
    # Additional launch flags
    flags = [ "--verbose" ];
  };
}
```

## Stubby

Stubby is a very lightweight resolver (40kb binary) that performs DNS-over-TLS, and nothing else. While stubby can be used as a system resolver on its own, it is typically combined with another resolver (such as unbound) to add caching and forwarding rules for local domains. See the [options documentation for `services.stubby.*`](https://search.nixos.org/options/?query=services.stubby) for configuration.

Example configuration for Cloudflare. Note that digests change and need to be updated:

``` nix
{
    services.stubby = {
      enable = true;
      settings = pkgs.stubby.passthru.settingsExample // {
        upstream_recursive_servers = [{
          address_data = "1.1.1.1";
          tls_auth_name = "cloudflare-dns.com";
          tls_pubkey_pinset = [{
            digest = "sha256";
            value = "GP8Knf7qBae+aIfythytMbYnL+yowaWVeD6MoLHkVRg=";
          }];
        } {
          address_data = "1.0.0.1";
          tls_auth_name = "cloudflare-dns.com";
          tls_pubkey_pinset = [{
            digest = "sha256";
            value = "GP8Knf7qBae+aIfythytMbYnL+yowaWVeD6MoLHkVRg=";
          }];
        }];
      };
    };
}
```

To update digests get the TLS certificate that signs the responses and calculate the digest:

``` console
$ echo | openssl s_client -connect '1.1.1.1:853' 2>/dev/null | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64
```

Or using `kdig` from `knot-dns`

``` console
$ kdig -d @1.1.1.1 +tls-ca +tls-host=one.one.one.one example.com
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
