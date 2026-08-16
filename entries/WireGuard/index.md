<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: WireGuard -->

# Configuration Modules

WireGuard-related NixOS options exist for the following networking modules:

- NetworkManager
- wg-quick
- networking.wireguard
- systemd.network

Depending on how your computer is configured, you need to refer to the relevant section for setting up WireGuard.

Different modules have different capabilities. systemd.network support routing traffic on a per user basis. For example, you can route all torrenting traffic through a wireguard tunnel, see below.

systemd.network is recommended due to its powerful configuration interface. wg-quick is suitable for common usage patterns. networking.wireguard seems to have issues with routing. NetworkManager does not support Proxy server setup, and is cumbersome to use.

Skip to Generate Keys section if you are in a hurry.

# Use cases

The first use case is Virtual Private Network, which makes several peers available on the same private subnet. This is the basis for the proxy configuration below.

The second use case is Internet proxy, which allows you to access the Internet via another peer.

## Secure DNS for the proxy client

You can use a secure DNS client such as knot dns resolver, which comes with a set of authenticated dns servers ips built in.

``` nix
{
  # knot dns resolver
  services.kresd.enable = true;

  # disable built-in dns
  services.resolved.enable = false;

  environment.etc."resolv.conf" = {
    mode = "0644";
    text = "nameserver ::1";
  };
}
```

Secure DNS hinders usage of captive portals. See <a href="systemd-resolved" class="wikilink" title="systemd-resolved">systemd-resolved</a> for solutions.

# AllowedIPs

Each peer can handle traffic destined for a certain IP range. This range is called AllowedIP.

Common forms of allowed IPs include

- 192.168.26.9/32, a single internal IPv4 address

- 192.168.26.0/24, a subnet

- fd31:bf08:57cb::9/128, a single internal IPv6 address

- fd31:bf08:57cb::/60, a subnet

- 0.0.0.0/0, entire IPv4 address space, for proxying

-   
    
  /0, entire IPv6 address space, for proxying

Notice that, in specifying its subnet mask, some configuration modules can automatically configure network routes.

Allowed IPs should be unique to each peer. If there are peers whose allowed IPs overlap, traffic will only reach one of them.

# UDP Port

The default port is 51820. Some literature recommends changing this port to circumvent blocking of WireGuard traffic.

WireGuard will choose a random port, if this option is not set.

# Generate keys

WireGuard works with public-private key pairs.

Computer (peer) is identified by its public key. Only connections from peers with known public keys are accepted. For this reason, you can not reuse keys on multiple peers.

To generate a private key, and derive the public key from it, you need the `wg` utility, available in `wireguard-tools` package.

After installation, use the following commands to generate keys:

    $ umask 077
    $ wg genkey > privatekey
    $ wg pubkey < privatekey > publickey

You need to generate a new key for each peer.

Make sure the private key has the correct file permission as required by the WireGuard service. Wrong file permission may cause the service to fail. Check system log to rule out this scenario.

You can use ryamtm/agenix to declaratively store and manage the WireGuard key.

For systemd.network:

      age.secrets.wg-key-vps = {
        file = "${inputs.self.outPath}/secrets/wg-key-vps.age";
        # for permission, see man systemd.netdev
        mode = "640";
        owner = "systemd-network";
        group = "systemd-network";
      };

# systemd.network

Credit: this section is adapted from ArchWiki. This section should fully support IPv4 and v6 dual stack.

## Peer setup

``` nix
{
  age.secrets.wg-key-vps = {
    file = "${inputs.self.outPath}/secrets/wg-key-vps.age";
    # for permission, see man systemd.netdev
    mode = "640";
    owner = "systemd-network";
    group = "systemd-network";
  };

  networking.firewall.allowedUDPPorts = [ 51820 ];

  networking.useNetworkd = true;

  systemd.network = {
    enable = true;

    networks."50-wg0" = {
      matchConfig.Name = "wg0";

      address = [
        # /32 and /128 specifies a single address
        # for use on this wg peer machine
        "fd31:bf08:57cb::7/128"
        "192.168.26.7/32"
      ];
    };

    netdevs."50-wg0" = {
      netdevConfig = {
        Kind = "wireguard";
        Name = "wg0";
      };

      wireguardConfig = {
        ListenPort = 51820;

        # ensure file is readable by `systemd-network` user
        PrivateKeyFile = config.age.secrets.wg-key-vps.path;

        # To automatically create routes for everything in AllowedIPs,
        # add RouteTable=main
        RouteTable = "main";

        # FirewallMark marks all packets send and received by wg0 
        # with the number 42, which can be used to define policy rules on these packets. 
        FirewallMark = 42;
      };
      wireguardPeers = [
        {
          # laptop wg conf
          PublicKey = "ronr+8v670J0CPb0xT5QLGMWDfE7+1g7HmC6YMdCIDk=";
          AllowedIPs = [
            "fd31:bf08:57cb::9/128"
            "192.168.26.9/32"
          ];
          Endpoint = "192.168.1.26:51820";

          # RouteTable can also be set in wireguardPeers
          # RouteTable in wireguardConfig will then be ignored.
          # RouteTable = 1000;
        }
      ];
    };
  };

}
```

## Proxy server setup

To route your internet traffic through the server, first check the name of your active network interface. This can be done through running this command:

    ip route get 9.9.9.9

and the result should be something similar to:

    9.9.9.9 via 192.168.1.1 dev enp2s0 src 192.168.1.35 uid 0

The item after `dev` is your active interface, in this case `enp2s0`.

After that, set up WireGuard the same way as the <a href="#Peer_setup" class="wikilink" title="peer setup">peer setup</a>, except do not include the `Endpoint` option. Then, add the following options to your configuration, using the active network interface you previously found for `externalInterface`:

``` nix
{
  networking.nat = {
    enable = true;
    enableIPv6 = true;
    externalInterface = "enp2s0";
    internalInterfaces = [ "wg0" ];
  };

  systemd.network = {
    enable = true;
    networks."50-wg0" = {
      networkConfig = {
        # do not use IPMasquerade,
        # unnecessary, causes problems with host ipv6
        IPv4Forwarding = true;
        IPv6Forwarding = true;
      };
    };
  };
}
```

## Proxy client setup

Same as peer setup, with the following addition:

### Disable rpfilter

``` nix
# NixOS firewall will block wg traffic because of rpfilter
networking.firewall.checkReversePath = "loose"; 
```

### Route DNS over wg0

This applies to systemd-resolved:

``` nix
  systemd.network = {
    networks."50-wg0" = {
      # only works with systemd-resolved
      domains = [ "~." ];
      dns = [ "{proxy server internal ip}" ];
      networkConfig = {
        DNSDefaultRoute = true;
      };
    };
  };
```

Note: Routing all DNS over WireGuard (i.e. Domains=~.) will prevent the DNS resolution of endpoints. Unless the peer domain is configured to be resolved on a specific network link.

To use a peer as a DNS server, specify its WireGuard tunnel's IP address(es) in the .network file using the DNS= option. For search domains use the Domains= option.

To use a peer as the only DNS server set DNSDefaultRoute=true and Domains=~. in the \[Network\] section of .network file's.

### Route all traffic over wg0, except endpoint

``` nix
  systemd.network = {
    netdevs."50-wg0" = {
      # FirewallMark simply marks all packets send and received by this wireguard 
      # interface with the number 42, which can be used to define policy rules on these packets. 
      wireguardConfig.FirewallMark = 42;

      wireguardPeers = [
        {
          AllowedIPs = [
            # proxy all traffic
            "::/0"
            "0.0.0.0/0"
          ];
          # can't use domain
          # Routing all DNS over WireGuard (i.e. Domains=~.) will prevent the DNS resolution of endpoints.
          Endpoint = "[2a01::1]:51820";

          # RouteTable line specifies that a new routing table with id 1000 is created
          # for the wireguard interface, and no rules are set on the main routing table.
          RouteTable = 1000;
        }
      ];
    };
    networks."50-wg0" = {
      routingPolicyRules = [
        # rule 1: redirect traffic
        {
          # apply rule to both v4 and v6
          Family = "both";

          # For all packets *not* marked with 42 (i.e. all non-wireguard/normal traffic), 
          InvertRule = true;
          FirewallMark = 42;

          # (... continued) we specify that the routing table 1000 must be used 
          # (which is the wireguard routing table). This rule routes all traffic through wireguard.
          # inside routingPolicyRules section is called Table, not RouteTable
          Table = 1000;

          # this routing policy rule has a lower priority (10) than
          # endpoint exclusion rule (5).
          Priority = 10;
        }


        # rule 2: exclude endpoint ip
        {
          # Use a routing policy rule to exclude the endpoint IP address,
          # so that wireguard can still connect to it.
          # it has a higher priority (5) than (10).

          # We exempt our endpoint with a higher priority by routing it
          # through the main table (Table=main is default). 
          To = "2a01::1/128";
          Priority = 5;
        }
      ];
    };
  };
```

### Exempting specific addresses

In order to exempt specific addresses (such as private LAN addresses) from routing over the WireGuard tunnel, add them to another RoutingPolicyRule with higher priority.

``` nix
  systemd.network.networks."50-wg0".routingPolicyRules = 
  [
    {
      To = "192.168.0.0/24";
      Priority = 9;
    }
  ]
```

### Manually start and stop wg0

The above steps will set up a `wg0` interface, managed by networkctl command.

You can start it by typing the following in your terminal:

``` sh
sudo networkctl up wg0
```

To stop the service:

``` sh
sudo networkctl down wg0
```

### Route for specific user

It may be desirable to route WAN traffic over the tunnel only for a specific user, for example, the transmission user in order to use the tunnel for torrent traffic.

Replace catch-all rules above, with user-specific rules below.

``` nix
  systemd.network.networks."50-wg0".routingPolicyRules = 
  [
    {
      # The lower priority rule (30001), matches all traffic generated
      # by the transmission user and routes it through table 1000 which is the wireguard table. 
      Table = 1000;
      User = "transmission";
      Priority = 30001;
      Family = "both";
    }

    {
      # The higher priority rule (30000), matches all traffic
      # generated by the transmission user
      # and routes it through the main table (no wireguard)
      # BUT only using rules with a prefix length larger than 0.
      #
      # This means the default 0.0.0.0/0 and ::/0 rules still apply
      #
      # Therefore, only traffic matching specific rules with non-zero prefix
      # (such as those defining the subnet of your local home network) of the main table
      # are routed through the main table. 

      Table = "main";
      User = "transmission";
      SuppressPrefixLength = 0;
      Priority = 30000;
      Family = "both";
    }
  ];
  # Configure port forwarding for Transmission under NAT
  networking.nat.forwardPorts = 
       [
         {
           destination = "10.0.0.1:80";
           proto = "tcp";
           sourcePort = 8080;
         }
         {
           destination = "[fc00::2]:80";
           proto = "tcp";
           sourcePort = 8080;
         }
       ];
```

## Test and Troubleshooting

Test the proxy with

`# ipv4`  
`$ curl -4 zx2c4.com/ip`  
  
`# ipv6`  
`$ curl -6 zx2c4.com/ip`

Check systemd-networkd log for any error and warning messages.

`$ journalctl -u systemd-networkd.service`

Invoke `wg` command from `wireguard-tools`.

Use `ip route` to inspect the route table

`$ ip route show table 1000`  
`default dev wg0 proto static scope link `

`$ ip route show table all`  
`... many entries ...`

`$ ip rule list`  
`10:    not from all fwmark 0x2a lookup 1000 proto static`

`$ ip route get  136.144.57.121`  
`136.144.57.121 dev wg0 table 1000 src 192.168.26.9 uid 1000 `

`$ ip route get 2600:1406::1`  
`2600:1406::1 from :: dev wg0 table 1000 proto static src fd31:bf08:57cb::9 metric 1024 pref medium`

# wg-quick

## Peer setup

``` nix
{
  networking.wg-quick.interfaces = {
    wg0 = {
      address = [ 
        "fd31:bf08:57cb::9/128"
        "192.168.26.9/32"
      ];
      # use dnscrypt, or proxy dns as described above
      dns = [ "127.0.0.1" ];
      privateKeyFile = config.age.secrets.wg-key-laptop.path;
      peers = [
        {
          # bt wg conf
          publicKey = "ejmbag/fcc9OLp8K62zfV0NCbp056DnA0qpNixLXwCo=";
          allowedIPs = [
            "fd31:bf08:57cb::8/128"
            "192.168.26.8/32"
          ];
          endpoint = "192.168.1.56:51820";
        }
      ];
    };
  };
}
```

## Proxy server setup

Same as peer setup, skip the endpoint option, with the following addition:

``` nix
{
  # enable NAT
  networking.nat = {
    enable = true;
    enableIPv6 = true;
    externalInterface = "ens6";
    internalInterfaces = [ "wg0" ];
  };

  networking.wg-quick.interfaces = {
    wg0 = {
      # This allows the wireguard server to route your traffic to the internet and hence be like a VPN
      postUp = ''
        ${pkgs.iptables}/bin/iptables -A FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/iptables -t nat -A POSTROUTING -s 10.0.0.1/24 -o eth0 -j MASQUERADE
        ${pkgs.iptables}/bin/ip6tables -A FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/ip6tables -t nat -A POSTROUTING -s fdc9:281f:04d7:9ee9::1/64 -o eth0 -j MASQUERADE
      '';

      # Undo the above
      preDown = ''
        ${pkgs.iptables}/bin/iptables -D FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/iptables -t nat -D POSTROUTING -s 10.0.0.1/24 -o eth0 -j MASQUERADE
        ${pkgs.iptables}/bin/ip6tables -D FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/ip6tables -t nat -D POSTROUTING -s fdc9:281f:04d7:9ee9::1/64 -o eth0 -j MASQUERADE
      '';
    };
  };
}
```

## Proxy client setup

Same as peer setup, specify proxy server ip or domain in the endpoint option. Use `[ "0.0.0.0/0" "::/0" ]` as allowed IPs.

Optionally, configure proxy server as DNS server as described above.

### Proxy DNS with dnsmasq

You can also use the proxy server as DNS server with dnsmasq.

``` nix
{
  networking.firewall = {
    allowedTCPPorts = [ 53 ];
    allowedUDPPorts = [ 53 ];
  };
  services = {
    dnsmasq = {
      enable = true;
      settings.interface = "wg0";
    };
  };
}
```

For wg-quick peer, use the following option

``` nix
{
  networking.wg-quick.interfaces.wg0.dns =
  [ {internal v4 & v6 ip addr of server} ];
}
```

## Manually start and stop wg-quick

The above steps will set up a `wg-quick-wg0.service` systemd unit.

You can start it by typing the following in your terminal:

``` sh
sudo systemctl start wg-quick-wg0.service
```

To stop the service:

``` sh
sudo systemctl stop wg-quick-wg0.service
```

## Reuse existing wg-quick config file

If you have WireGuard configuration files that you want to use as-is (similarly how you would configure WireGuard e.g. in [Debian](https://wiki.debian.org/WireGuard#Step_2_-_Configuration)), without converting them to a declarative NixOS configuration, you can also configure `wg-quick` to use them. For example, if you have a configuration file `/etc/nixos/wireguard/wg0.conf`, add the following line to your `configuration.nix`:

``` nix
networking.wg-quick.interfaces.wg0.configFile = "/etc/nixos/files/wireguard/wg0.conf";
```

This will set up a `wg-quick-wg0.service` systemd unit.

# networking.wireguard

Note: does not automatically configure routes, see comments.

## Peer setup

``` nix
{ config, ... }:
{
  age.secrets.wg-key-peer0 = {
    file = "./secrets/wg-key-peer0.age";
  };

  networking.firewall.allowedUDPPorts = [ 51820 ];

  networking.wireguard = {
    enable = true;
    interfaces = {
      # network interface name.
      # You can name the interface arbitrarily.
      wg0 = {
        # the IP address and subnet of this peer
        ips = [ "fd31:bf08:57cb::9/128" "192.168.26.9/32" ];

        # WireGuard Port
        # Must be accessible by peers
        listenPort = 51820;

        # Path to the private key file.
        #
        # Note: can also be included inline via the privateKey option,
        # but this makes the private key world-readable;
        # using privateKeyFile is recommended.
        privateKeyFile = config.age.secrets.wg-key-laptop.path;

        peers = [
          { 
            name = "home nas";
            publicKey = "ejmbag/fcc9OLp8K62zfV0NCbp056DnA0qpNixLXwCo=";
            allowedIPs = [
              "fd31:bf08:57cb::8/128"
              "192.168.26.8/32"
            ];
            endpoint = "192.168.1.56:51820";
            #  ToDo: route to endpoint not automatically configured
            # https://wiki.archlinux.org/index.php/WireGuard#Loop_routing
            # https://discourse.nixos.org/t/solved-minimal-firewall-setup-for-wireguard-client/7577
            # Send keepalives every 25 seconds. Important to keep NAT tables alive.
            # persistentKeepalive = 25;
          }
        ];
      };
    };
}
# it’s not imperative but it does not know how to do it :
# sudo ip route add 11.111.11.111 via 192.168.1.11 dev wlo1
# the ip adresse 11: external and 192: local.
```

## Proxy server setup

Same as peer setup, skip the endpoint option, with the following addition, Remember to update the internal IP addresses in the script:

``` nix
{
  # enable NAT
  networking.nat = {
    enable = true;
    enableIPv6 = true;
    externalInterface = "ens6";
    internalInterfaces = [ "wg0" ];
  };

  networking.wireguard.interfaces.wg0 = {
      # This allows the wireguard server to route your traffic to the internet and hence be like a VPN
      postSetup = ''
        ${pkgs.iptables}/bin/iptables -A FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/iptables -t nat -A POSTROUTING -s 10.0.0.1/24 -o eth0 -j MASQUERADE
        ${pkgs.iptables}/bin/ip6tables -A FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/ip6tables -t nat -A POSTROUTING -s fdc9:281f:04d7:9ee9::1/64 -o eth0 -j MASQUERADE
      '';

      # Undo the above
      postShutdown = ''
        ${pkgs.iptables}/bin/iptables -D FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/iptables -t nat -D POSTROUTING -s 10.0.0.1/24 -o eth0 -j MASQUERADE
        ${pkgs.iptables}/bin/ip6tables -D FORWARD -i wg0 -j ACCEPT
        ${pkgs.iptables}/bin/ip6tables -t nat -D POSTROUTING -s fdc9:281f:04d7:9ee9::1/64 -o eth0 -j MASQUERADE
      '';
  };
}
```

## Proxy client setup

Same as peer setup, specify proxy server ip or domain in the endpoint option. Use `[ "0.0.0.0/0" "::/0" ]` as allowed IPs.

# NetworkManager Proxy client setup

This is probably only useful on clients. Functionality is present in NetworkManager since version 1.20 but network-manager-applet can show and control wireguard connections since version 1.22 only (available since NixOS 21.05).

If you intend to route all your traffic through the wireguard tunnel, the default configuration of the NixOS firewall will block the traffic because of rpfilter. You can either disable rpfilter altogether:

``` nix
{ config, pkgs, lib, ... }:{
  networking.firewall.checkReversePath = false; 
}
```

In some cases not **false** but **"loose"** (with quotes) can work:

``` nix
{ config, pkgs, lib, ... }:{
  networking.firewall.checkReversePath = "loose"; 
}
```

Or you can adapt the rpfilter to ignore wireguard related traffic (replace 51820 by the port of your wireguard endpoint):

``` nix
{ config, pkgs, lib, ... }:{
  networking.firewall = {
   # if packets are still dropped, they will show up in dmesg
   logReversePathDrops = true;
   # wireguard trips rpfilter up
   extraCommands = ''
     ip46tables -t mangle -I nixos-fw-rpfilter -p udp -m udp --sport 51820 -j RETURN
     ip46tables -t mangle -I nixos-fw-rpfilter -p udp -m udp --dport 51820 -j RETURN
   '';
   extraStopCommands = ''
     ip46tables -t mangle -D nixos-fw-rpfilter -p udp -m udp --sport 51820 -j RETURN || true
     ip46tables -t mangle -D nixos-fw-rpfilter -p udp -m udp --dport 51820 -j RETURN || true
   '';
  };
}
```

Adding a wireguard connection to NetworkManager is not straightforward to do fully in gui, it is simpler to reuse a configuration file for wg-guick. For example:

    [Interface]
    # your own IP on the wireguard network
    Address = 10.0.0.3/24, fd4:8e3:226:2e0::3/64
    Table = auto
    PrivateKey = 0000000000000000000000000000000000000000000=

    [Peer]
    PublicKey = 1111111111111111111111111111111111111111111=
    # restrict this to the wireguard subnet if you don't want to route everything to the tunnel
    AllowedIPs = 0.0.0.0/0, ::/0
    # ip and port of the peer
    Endpoint = 1.2.3.4:51820

Then run

The new VPN connection should be available, you still have to click on it to activate it.

# Troubleshooting

## Tunnel does not automatically connect despite persistentKeepalive being set

When using the <i>privateKeyFile</i> instead of <i>privateKey</i> setting, the generated WireGuard config file sets <i>PersistentKeepalive</i> as normal, but instead uses the generated <i>PostUp</i> script to set the private key for the tunnel after the tunnel has been started. Apparently the tunnel only automatically connects when the keepalive is set at the same time (i.e. through the config file) as the private key, or afterwards. A workaround is to also set <i>PersistentKeepalive</i> through the PostUp script using the <i>wg</i> command:

``` nix
networking.wg-quick.interfaces = let
  publicKey = "...";
in {
  wg0 = {
    # ...
    privateKeyFile = "/path/to/keyfile";
    # this is what we use instead of persistentKeepalive, the resulting PostUp
    # script looks something like the following:
    #     wg set wg0 private-key <(cat /path/to/keyfile)
    #     wg set wg0 peer <public key> persistent-keepalive 25
    postUp = ["wg set wgnet0 peer ${publicKey} persistent-keepalive 25"];
    peers = [{
      inherit publicKey; # set publicKey to the publicKey we've defined above
      # ...

      # Use postUp instead of this setting because otherwise it doesn't auto
      # connect to the peer, apparently that doesn't happen if the private
      # key is set after the PersistentKeepalive setting which happens if
      # we load it from a file
      #persistentKeepalive = 25;
    }];
  };
};
```

## Server is reachable, but only some services are working

It might be, that the [MTU](https://en.wikipedia.org/wiki/Maximum_transmission_unit) of the network connecting the endpoints is smaller than the default (1500). By default the "option is set to" 1420, with an additional 80 due to wireguard overhead. Try adjusting it to something smaller:

``` nix
networking.wireguard.interfaces.wg0.mtu = 1000; 
#this is extremely small, bigger values can yield better performance.
#networking.wg-quick.interfaces.wg0.mtu = 1000; #if you use wq-quick
```

## wg-quick issues with NetworkManager

Try `systemd-resolved`

This fixed the issue of wg connecting to the peer but not being able to access the internet or LAN.

``` nix
networking.networkmanager.dns = "systemd-resolved";
services.resolved.enable = true;
```

# See also

- [WireGuard homepage](https://www.wireguard.com/)
- [Arch Wiki](https://wiki.archlinux.org/index.php/WireGuard) has an exhaustive guide, including troubleshooting tips
- [List of WireGuard options supported by NixOS](https://search.nixos.org/options?query=wireguard)
- [Blogpost by uint.one on replicating wg-quick with networkd](https://uint.one/posts/configuring-wireguard-using-systemd-networkd-on-nixos/)
- [Talk by @fpletz at NixCon 2018 about networkd and his WireGuard setup](https://www.youtube.com/watch?v=us7V2NvsQRA)
- [WireGuard Troubleshooting (on Web Archive)](https://web.archive.org/web/20210101230654/https://www.the-digital-life.com/wiki/wireguard-troubleshooting/) shows how to enable debug logs

# Additional routing setups

For documentation on more routing and topology setups, such as

- Point to Point Configuration,
- Hub and Spoke Configuration,
- Point to Site Configuration,
- Site to Site Configuration,

see [Pro Custodibus Documentation](https://docs.procustodibus.com/guide/wireguard/), [Mirror on Internet Archive](https://web.archive.org/web/20250920231827/https://docs.procustodibus.com/guide/wireguard/).

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:VPN" class="wikilink" title="Category:VPN">Category:VPN</a>
