<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/networkd -->

[systemd-networkd](https://www.freedesktop.org/software/systemd/man/systemd-networkd.html) is the network configuration component of the <a href="systemd" class="wikilink" title="systemd">systemd</a> software suite. It is well integrated into NixOS below and should be preferred over options for most use cases, since it receives far superior maintenance.

Configuration for networkd is split into three sections.

- reconfigures existing network devices

  - <https://www.freedesktop.org/software/systemd/man/systemd.link.html>
  - actually implemented by udev, not networkd

- creates virtual network devices

  - <https://www.freedesktop.org/software/systemd/man/systemd.netdev.html>

- configures network devices

  - <https://www.freedesktop.org/software/systemd/man/systemd.network.html>

In most simple scenarios configuring existing network devices is what you want to do.

## Basics

### When to use

Use systemd-networkd for setups that rely on static configuration, that doesn't change much during its lifetime, that does not require varying profiles for a single interface. Common examples are:

- Servers/Routers
- Always-On VPN Tunnels

Following that logic, it is less suitable to

- Varying WLAN profiles
- Selectively used VPN tunnels

These use cases are better served by <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> and its various frontends, that provides a better integrated user experience for various desktop systems.

### Enabling

To be able to use networkd configuration, it needs to be enabled first.

``` nix
systemd.network.enable = true;
```

Some guides will mention the option, which in addition to enabling systemd-networkd, also offers translation of some and options into networkd. If you can write your complete network setup in native networkd configuration, you should stay away from that option.

### Configuring

The configuration of networkd happens through one or multiple configuration files per interface stored in `/etc/systemd/network`.

The following declaration in your NixOS configuration

``` nix
systemd.network.networks."10-lan" = {
  matchConfig.Name = "lan";
  networkConfig.DHCP = "ipv4";
};
```

renders the following network configuration:

Note that we usually prefix the configuration file with a number. This can be important, because networkd collects all available configuration files, then sorts them alphanumerically, and uses the first match for each interface as its configuration. This happens separately for `.link`, `.netdev` and `.network` files, so that you can have one configuration of each type per interface.

### Debugging

When things don't work as expected, the journal for `systemd-networkd.service` should be consulted. Unfortunately, by default the log is not very useful in its default loglevel. Increasing the loglevel can be done using the `SYSTEMD_LOG_LEVEL` environment variable.

``` nix
systemd.services."systemd-networkd".environment.SYSTEMD_LOG_LEVEL = "debug";
```

Log level can also be changed at runtime with

``` console
$ systemctl service-log-level systemd-networkd.service debug
$ # or
$ systemctl service-log-level systemd-networkd.service info
```

### Limitations

Some limitations might be surprising, so it is probably helpful to get them out of the way early.

- - Executed by udev and only applied on boot

- - Does not modify properties (e.g., MTU, VLAN ID, VXLAN ID, Wireguard Peers) of existing netdevs
    - <https://github.com/systemd/systemd/issues/9627>
    - This should be fixed as of systemd v257 (https://github.com/systemd/systemd/pull/34909)

### network-online.target

While `network.target` only requires the network management stack to be up, which means it does not care about network interfaces being configured, the `network-online.target` waits until a defined set of network interfaces are in a state, that by its configuration is considered online.

When networkd is enabled, the `network-online.target` is implemented through the `systemd-networkd-wait-online.service`, which makes sure interfaces configured through networkd are in their expected operational state.

The current operational state of network interfaces can be learned from `networkctl`.

``` console
$ networkctl
IDX LINK          TYPE     OPERATIONAL SETUP     
  1 lo            loopback carrier     unmanaged
  2 enp10s0       ether    routable    unmanaged
  3 wlp9s0        wlan     no-carrier  unmanaged
```

For most network interfaces that will mean that they have `routable` network connectivity, but in more complex setups some links may be content with more simple states like `carrier` or `enslaved`. Interfaces that are managed by networkd, but not always in use, shouldn't be required for `network-online.target`

``` nix
systemd.network.networks."50-enp3s0" = {
  matchConfig.Name = "enp3s0";
  # acquire a DHCP lease on link up
  networkConfig.DHCP = "yes";
  # this port is not always connected and not required to be online
  linkConfig.RequiredForOnline = "no";
};
```

Note that the default value for `linkConfig.RequiredForOnline` is unexpectedly `"yes"`, which often leads to a failing `network-online.target`.

Setting individual interfaces to `"no"` is a perfectly valid choice and should be considered, before disabling the `systemd-networkd-wait-online.service` entirely, because a working `network-online.target` is required for some services to properly start without race conditions.

Also consider enabling the `systemd.network.wait-online.anyInterface` option, which makes networkd consider the network online when any interface is online, as opposed to all that have a positive value for `linkConfig.RequiredForOnline`. This is useful on portable machines with a wired and a wireless interface, for example.

Recommended documentation:

- [Network Configuration Synchronization Points](https://systemd.io/NETWORK_ONLINE/)
- [RequiredForOnline=](https://www.freedesktop.org/software/systemd/man/systemd.network.html#RequiredForOnline=)
- [List of operational interface states](https://www.freedesktop.org/software/systemd/man/networkctl.html#%0A%20%20%20%20%20%20%20%20%20%20list%0A%20%20%20%20%20%20%20%20%20%20PATTERN%E2%80%A6%0A%20%20%20%20%20%20%20%20)

## Examples

Examples should be concise and give proper hints on how to achieve a reliably working `network-online.target`.

### Interface Naming

The name of an interface can be changed based on different matches. This is useful for pretty names (e.g. wan, lan), but also if you want to make sure that your interface name never changes. This might be useful because even with predictable interface naming your interface name can change, for example when you add a new PCIe card and indexing changes, or due to kernel changes the way your mainboard gets interpreted changes.

``` nix
systemd.network.links."10-wan" = {
  # Check systemd.link(5) for other matchers
  matchConfig.Path = "pci-0000:09:00.0";
  linkConfig.Name = "wan";
};
```

### DHCP/RA

Common scenario for dynamic configuration, DHCP for IPv4 and router advertisements for IPv6 connectivity. Make `network-online.target` wait until addresses and routes are configured.

``` nix
systemd.network.networks."10-wan" = {
  matchConfig.Name = "enp1s0";
  networkConfig = {
    # start a DHCP Client for IPv4 Addressing/Routing
    DHCP = "ipv4";
    # accept Router Advertisements for Stateless IPv6 Autoconfiguraton (SLAAC)
    IPv6AcceptRA = true;
  };
  # make routing on this interface a dependency for network-online.target
  linkConfig.RequiredForOnline = "routable";
};
```

### Static

Apply a static address and routing configuration onto `enp1s0`.

When the gateway is not on the same prefix as the address configured, as is customary on some cloud providers, you usually also need to set `GatewayOnLink`, to indicate the gateway is directly reachable on the interface.

``` nix
systemd.network.networks."10-wan" = {
  # match the interface by name
  matchConfig.Name = "enp1s0";
  address = [
    # configure addresses including subnet mask
    "192.0.2.100/24"
    "2001:DB8::2/64"
  ];
  routes = [
    # create default routes for both IPv6 and IPv4
    { Gateway = "fe80::1"; }
    { Gateway = "192.0.2.1"; }
    # or when the gateway is not on the same network
    {
      Gateway = "172.31.1.1";
      GatewayOnLink = true;
    }
  ];
  # make the routes on this interface a dependency for network-online.target
  linkConfig.RequiredForOnline = "routable";
};
```

### VLAN

VLANs can be configured on top of hardlinks as well as virtual links, like bonding interfaces. They provide separate logical networks over physical links.

In this example we tag two VLANs with Ids 10 and 20 on a physical link `enp1s0`. The VLAN interfaces become available as `vlan10` and `vlan20` and can receive additional configuration.

``` nix
systemd.network = {
  netdevs = {
    "20-vlan10" = {
      netdevConfig = {
        Kind = "vlan";
        Name = "vlan10";
      };
      vlanConfig.Id = 10;
    };
    "20-vlan20" = {
      netdevConfig = {
        Kind = "vlan";
        Name = "vlan20";
      };
      vlanConfig.Id = 20;
    };
  };

  networks = {
    "30-enp1s0" = {
      matchConfig.Name = "enp1s0";
      # tag vlan on this link
      vlan = [
        "vlan10"
        "vlan20"
      ];
      networkConfig.LinkLocalAddressing = "no";
      linkConfig.RequiredForOnline = "carrier";
    };
    "40-vlan10" = {
      matchConfig.Name = "vlan10";
      # add relevant configuration here
    };
    "40-vlan20" = {
      matchConfig.Name = "vlan20";
      # add relevant configuration here
    };
  };
};
```

### Bridge

Given multiple interfaces, that are connected into a bridge will act like a common switch and forward Ethernet frames between all connected bridge ports. The Linux bridge supports various features, like spanning tree, bridge port isolation or acting as a multicast router.

The configuration on top of the bridge interface depends on the desired functionality, e.g., configuring an IP address would make the bridge host reachable on the Ethernet segment.

Recommended documentation:

- [\[Bridge\] configuration reference](https://www.freedesktop.org/software/systemd/man/systemd.network.html#%5BBridge%5D%20Section%20Options)

``` nix
systemd.network = {
  netdevs = {
     # Create the bridge interface
     "20-br0" = {
       netdevConfig = {
         Kind = "bridge";
         Name = "br0";
       };
     };
  };
  networks = {
    # Connect the bridge ports to the bridge
    "30-enp1s0" = {
      matchConfig.Name = "enp1s0";
      networkConfig.Bridge = "br0";
      linkConfig.RequiredForOnline = "enslaved";
    };
    "30-enp2s0" = {
      matchConfig.Name = "enp2s0";
      networkConfig.Bridge = "br0";
      linkConfig.RequiredForOnline = "enslaved";
    };
    # Configure the bridge for its desired function
    "40-br0" = {
      matchConfig.Name = "br0";
      bridgeConfig = {};
      # Disable address autoconfig when no IP configuration is required
      #networkConfig.LinkLocalAddressing = "no";
      linkConfig = {
        # or "routable" with IP addresses configured
        RequiredForOnline = "carrier";
      };
    };
  };
};
```

### Bonding

<div style="margin-left: 2em; margin-bottom:1em">

*More details: <a href="Networking#Link_aggregation" class="wikilink" title="Networking#Link aggregation">Networking#Link aggregation</a>*

</div>

Given two hardlinks `enp2s0` and `enp3s0` create a virtual `bond0` interface using Dynamic LACP (802.3ad), hashing outgoing packets using a packet's layer 3/4 (network/transport layer in the OSI model) information.

``` nix
systemd.network = {
  netdevs = {
    "10-bond0" = {
      netdevConfig = {
        Kind = "bond";
        Name = "bond0";
      };
      bondConfig = {
        Mode = "802.3ad";
        TransmitHashPolicy = "layer3+4";
      };
    };
  };
  networks = {
    "30-enp2s0" = {
      matchConfig.Name = "enp2s0";
      networkConfig.Bond = "bond0";
    };
    "30-enp3s0" = {
      matchConfig.Name = "enp3s0";
      networkConfig.Bond = "bond0";
    };
    "40-bond0" = {
      matchConfig.Name = "bond0";
      linkConfig = {
        RequiredForOnline = "carrier";
      };
      networkConfig.LinkLocalAddressing = "no";
    };
  };
};
```

### Router Advertisement

Router advertisements are way to allow clients to achieve stateless autoconfiguration (SLAAC). The most prominent setup is where the router announces a prefix onto a LAN segment, which the receiving client can use to set up an address on that prefix, and configure the sender as its default gateway.

In this example the router will announce a static IPv6 prefix on the `lan` interface from it's automatically configured link local address on that link. The router does not generally require a unique local or globally reachable address on the link, unless you also want to host services like DNS and NTP on that LAN segment.

Recommended documentation:

- [\[IPv6SendRa\] configuration reference](https://www.freedesktop.org/software/systemd/man/systemd.network.html#%5BIPv6SendRA%5D%20Section%20Options)

``` nix
systemd.network = {
  networks = {
    "30-lan" = {
      matchConfig.Name = "lan";
      address = [ "2001:db8:1122:3344::1/64" ];
      networkConfig = {
        IPv6SendRA = true;
      };
      ipv6Prefixes = [
        {
          # Announce a static prefix
          ipv6PrefixConfig.Prefix = "2001:db8:1122:3344::/64";
        }
      ];
      ipv6SendRAConfig = {
        # Provide a DNS resolver
        EmitDNS = true;
        DNS = "2001:db8:1122:3344::1";
      };
    };
  };
};
```

An extended form of this setup uses DHCPv6 prefix delegation to acquire a dynamic prefix over a WAN link, which then gets distributed onto designated LAN segments.

### WireGuard

WireGuard can also be set up using `systemd.network.netdevs`. More details can be found at <a href="WireGuard#Setting_up_WireGuard_with_systemd-networkd" class="wikilink" title="WireGuard#Setting up WireGuard with systemd-networkd">WireGuard#Setting up WireGuard with systemd-networkd</a>.

## User configurations

This section allows references to actual user configurations. They show how individual configuration snippets get integrated as a whole and serve as real world examples.

*When adding new links, please describe the primary features of your setup and against which NixOS version it was last updated.*

- [NixOS 22.11 VDSL Router (VLANs on top of Bonding, IPv6 Prefix-Delegation, pppd Integration)](https://gist.github.com/mweinelt/b78f7046145dbaeab4e42bf55663ef44) by [mweinelt](https://github.com/mweinelt)
- [NixOS Unstable (25.04) Router (ipv4/ipv6 dual stack, dnssec+dnsovertls, NTP-rs)](https://github.com/philipwilk/nixos/blob/4fec9d73bfa7b1ecb490186522de38d25ee81e69/homelab/router/systemd.nix) by [philipwilk](https://github.com/philipwilk)

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
