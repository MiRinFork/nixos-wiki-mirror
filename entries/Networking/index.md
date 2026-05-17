<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Networking -->

Networking config always goes in your system configuration. This can be done declaratively as shown in the following sections or through non-declarative tools such as <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a>.

## Configuration

### Wireless networks

See <a href="wpa_supplicant" class="wikilink" title="wpa_supplicant">wpa_supplicant</a> / <a href="Iwd" class="wikilink" title="Iwd">Iwd</a>.

### Static IP for network adapter

The following example configures a static IPv4 and IPv6 address and a default gateway for the interface `ens3`

``` nix
networking = {
  interfaces.ens3 = {
    ipv6.addresses = [{
      address = "2a01:4f8:1c1b:16d0::1";
      prefixLength = 64;
    }];
    ipv4.addresses = [{
      address = "192.0.2.2";
      prefixLength = 24;
    }];
  };
  defaultGateway = {
    address = "192.0.2.1";
    interface = "ens3";
  };
  defaultGateway6 = {
    address = "fe80::1";
    interface = "ens3";
  };
};
```

### Hosts file

To edit `/etc/hosts` just add something like this to your `configuration.nix`:

``` nix
networking.hosts = {
  "127.0.0.2" = ["other-localhost"];
  "192.0.2.1" = ["mail.example.com" "imap.example.com"];
};
```

### Port forwarding

In this example we're going to forward the port `80` via NAT from our internal network interface `ens3` to the host `10.100.0.3` on our external interface `wg0`.

``` nix
networking = {
  firewall = {
    enable = true;
    allowedTCPPorts = [ 80 ];
  };
  nat = {
    enable = true;
    internalInterfaces = [ "ens3" ];
    externalInterface = "wg0";
    forwardPorts = [
      {
        sourcePort = 80;
        proto = "tcp";
        destination = "10.100.0.3:80";
      }
    ];
  };
  # Previous section is equivalent to :
  nftables = {
    enable = true;
    ruleset = ''
        table ip nat {
          chain PREROUTING {
            type nat hook prerouting priority dstnat; policy accept;
            iifname "ens3" tcp dport 80 dnat to 10.100.0.3:80
          }
        }
    '';
  };
};
```

For IPv6 port forwarding, the example would look like this. Incoming connections on the address `2001:db8::` and port `80` will be forwarded to `[fe80::1234:5678:9abc:def0]:80`.

``` nix
networking = {
  firewall = {
    enable = true;
    allowedTCPPorts = [ 80 ];
  };
  nat = {
    enable = true;
    internalInterfaces = [ "ens3" ];
    externalInterface = "wg0";
    enableIPv6 = true;
    internalIPv6s = [ "2001:db8::/64" ];
    externalIPv6 = "fe80::1234:5678:9abc:def0";
    forwardPorts = [
      {
        sourcePort = 80;
        proto = "tcp";
        destination = "fe80::1234:5678:9abc:def0]:80";
      }
    ];
  };
  # Previous section is equivalent to :
  nftables = {
    enable = true;
    ruleset = ''
        table ip6 nat {
          chain PREROUTING {
            type nat hook prerouting priority dstnat; policy accept;
            iifname "ens3" ip6 daddr [2001:db8::] tcp dport 80 dnat to [fe80::1234:5678:9abc:def0]:80
          }
        }
    '';
  };
};
```

### Virtualization

Sometimes complex network configurations with VPNs or firewall rules you may need extra configurations in order for your VMs to have network access. It is recommended to use more granular control over the ports instead of simply allowing the entire interface.

``` nix
networking = {
  firewall = {
    enable = true;
    
    # Allows the entire interface through the firewall.
    # trustedInterfaces = [
    #   "virbr0"
    # ];

    # Allows individual ports through the firewall.
    interfaces = {
      virbr0 = {
        allowedUDPPorts = [
          # DNS
          53
          # DHCP
          67
          # You may want to allow more ports such as ipv6 and other services here.
        ];
      };
    };
  };
  nat = {
    enable = true;

    internalInterfaces = [
      "virbr0"
    ];
  };
};
```

## IPv6

### Prefix delegation with fixed DUID

Sometimes the hosting provider manages IPv6 networks via a so-called *DUID* or *clientid*. This snippet is required to make the network routable:

``` nix
{ config, pkgs, ... }:

let
  # Get this from your hosting provider
  clientid = "00:11:22:33:44:55:66:77:88:99";
  interface = "enp2s0";
  subnet =  "56";
  network = "2001:bbb:3333:1111::/${subnet}";
  own_ip =  "2001:bbb:3333:1111::1/${subnet}";
in {
  # ... snip ...

  networking.enableIPv6 = true;
  networking.useDHCP = true;
  networking.dhcpcd.persistent = true;
  networking.dhcpcd.extraConfig = ''
    clientid "${clientid}"
    noipv6rs
    interface ${interface}
    ia_pd 1/${network} ${interface}
    static ip6_address=${own_ip}
  '';
  environment.etc."dhcpcd.duid".text = clientid;

}
```

Source: [gleber gist for online.net IPv6 config in NixOS](https://gist.github.com/gleber/9429ea43e6beb114250c3529b5c9d522)

Note: Recent versions of dhcpcd move the duid file to /var/db/dcpcd/duid. For that to work, you have to replace the above environment.etc line with something like:

``` nix
systemd.services.dhcpcd.preStart = ''
  cp ${pkgs.writeText "duid" "<ID>"} /var/db/dhcpcd/duid
'';
```

### IPv6-mostly

For IPv6 mostly networks the situation in Linux is a little bit dire. A 464XLAT CLAT implementation on the client device has to be running.

For example run clatd:

``` nix
{
  services.clatd.enable = true;
}
```

Caveats:

- disable IPv4 manually for DHCPv4 clients that do not accept Option 108 (IPv6-Only Preferred Option)
- set NAT64 prefix manually, if client doesn't support RA/PREF64 (RFC 8781) or DNS64 (RFC 7050):

``` nix
{
  services.clatd.settings = {
    plat-prefix = "64:ff9b::/96";
  };
}
```

- clatd needs to be restarted, if the network has changed

Sources:

- <https://labs.ripe.net/author/ondrej_caletka_1/deploying-ipv6-mostly-access-networks/>
- <https://ripe85.ripe.net/presentations/9-RIPE85-Deploying_IPv6_mostly.pdf>
- <https://github.com/systemd/systemd/issues/23674>
- <https://github.com/toreanderson/clatd>
- <https://gist.github.com/oskar456/d898bf2e11b642757800a5ccdc2415aa>
- <https://fosdem.org/2024/schedule/event/fosdem-2024-1798-improving-ipv6-only-experience-on-linux/>
- <https://nlnet.nl/project/IPv6-monostack/>

## VLANs

Refer to [ in the manual](https://nixos.org/manual/nixos/stable/options.html#opt-networking.vlans).

Below is a complete networking example showing two interfaces, one with VLAN trunk tagging and one without.

is a normal network interface at with no VLAN information.

is the virtual LAN trunk with two tagged VLANs, and .

is in the network and is in the network.

The should be unique among your machines, [as mentioned in the manual](https://nixos.org/manual/nixos/stable/options.html#opt-networking.hostId).

Complete networking section example:

``` nix
    networking = {
      hostId = "deadb33f";
      hostName = "nixos";
      domain = "example.com";
      dhcpcd.enable = false;
      interfaces.enp2s1.ipv4.addresses = [{
        address = "192.168.1.2";
        prefixLength = 28;
      }];
      vlans = {
        vlan100 = { id=100; interface="enp2s0"; };
        vlan101 = { id=101; interface="enp2s0"; };
      };
      interfaces.vlan100.ipv4.addresses = [{
        address = "10.1.1.2";
        prefixLength = 24;
      }];
      interfaces.vlan101.ipv4.addresses = [{
        address = "10.10.10.3";
        prefixLength = 24;
      }];
      defaultGateway = "192.168.1.1";
      nameservers = [ "1.1.1.1" "8.8.8.8" ];
    };
```

## Link aggregation

[**Link aggregation**](https://en.wikipedia.org/wiki/Link_aggregation), also known as **bonding** or **trunking** is the combining of multiple network links in parallel. This guide focuses on creating a Link Aggregation Group (**LAG**, **bond**, or **trunk**) using LACP (Link Aggregation Content Protocol).

| Bonding mode | Description | Switch configuration |
|----|----|----|
| `balance-rr` | **Default**. Transmit packets round-robin. | Requires static EtherChannel enabled, not LACP-negotiated. |
| `active-backup` | Recommended for fault tolerance when 802.3ad isn't available. Only one slave in the bond in active. If it fails, another one is picked to be active. | No configuration required on the switch. |
| `balance-xor` | Transmit packets based on the selected transmit hash policy. | Requires static EtherChannel enabled, not LACP-negotiated. |
| `broadcast` | Transmit everything on all slave interfaces. | Requires static EtherChannel enabled, not LACP-negotiated. |
| `802.3ad` | **Recommended**. IEEE 802.3ad Dynamic link aggregation. Transmits packets based on the selected transmit hash policy. | Requires LACP-negotiated EtherChannel enabled. In simpler terms, dynamic LACP. |
| `balance-tlb` | Adaptive transmit load balancing | No configuration required on the switch. |
| `balance-alb` | Adaptive load balancing | No configuration required on the switch. |

Bonding modes

### NetworkManager

### systemd-networkd and scripted networking

See <a href="Systemd/networkd#Bonding" class="wikilink" title="Systemd/networkd#Bonding">Systemd/networkd#Bonding</a> for more detailed configuration possibilities.

### Teaming

Using the teaming driver provides more configuration capabilities since more descision-making is done in userspace [^1].

## References

<references />

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>

[^1]: <https://github.com/jpirko/libteam/wiki/Bonding-vs.-Team-features>
