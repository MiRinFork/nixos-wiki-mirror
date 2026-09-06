<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenConnect -->

[OpenConnect](https://www.infradead.org/openconnect/) is a free, open‑source client‑to‑site VPN that works with many commercial SSL‑VPN gateways, such as Cisco AnyConnect, Palo Alto GlobalProtect, Pulse Secure (including Pulse Connect Secure), Juniper Network Connect, Fortinet, F5 and Array Networks.

## Setup

Following example configures a permanent VPN connection using OpenConnect using the protocol `anyconnect`.

``` nix
networking.openconnect.interfaces.myvpn = {
  gateway = "vpn-ac.uni-heidelberg.de/2fa";
  protocol = "anyconnect";
  user = "myuser";
  passwordFile = "/etc/secrets/openconnect-secret";
  extraOptions = {
    useragent = "AnyConnect";
    non-inter = true;
  };
};
```

Further you can also provide TOTP secrets for two-factor-authentications (which should be <u>avoided in production</u> environments since it decreases the security concept drastically) and use `vpn-slice` to achieve split tunneling instead of routing all traffic through the VPN gateway.

``` nix
networking.openconnect.interfaces.myvpn = {
  [...]
  extraOptions = {
    token-mode = "totp";
    token-secret = "base32:ABC123";
    script = "${lib.getExe pkgs.vpn-slice} --no-ns-hosts --no-host-names 129.206.0.0/16";
  };
};
```

We need to add `--no-ns-hosts --no-host-names` to `vpn-slice` since on NixOS `/etc/hosts` is read-only.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:VPN" class="wikilink" title="Category:VPN">Category:VPN</a>
