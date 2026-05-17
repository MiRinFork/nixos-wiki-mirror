<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Deluge -->

[Deluge](https://deluge-torrent.org/) is a BitTorrent client.

## Basic Nix Configuration

``` nix
  services.deluge = {
   enable = true;
   web.enable = true;
  };
```

The web UI is then accessible on <http://localhost:8112>.

## How to set up Deluge in a separate network namespace with only a wireguard vpn interface:

First, creating a network namespace with wireguard vpn interface based on this [tutorial](https://discourse.nixos.org/t/setting-up-wireguard-in-a-network-namespace-for-selectively-routing-traffic-through-vpn/10252/8):

``` nix
  # creating network namespace
  systemd.services."netns@" = {
   description = "%I network namespace";
   before = [ "network.target" ];
   serviceConfig = {
     Type = "oneshot";
     RemainAfterExit = true;
     ExecStart = "${pkgs.iproute2}/bin/ip netns add %I";
     ExecStop = "${pkgs.iproute2}/bin/ip netns del %I";
   };
  };

  # setting up wireguard interface within network namespace
  systemd.services.wg = {
   description = "wg network interface";
   bindsTo = [ "netns@wg.service" ];
   requires = [ "network-online.target" ];
   after = [ "netns@wg.service" ];
   serviceConfig = {
     Type = "oneshot";
     RemainAfterExit = true;
     ExecStart = with pkgs; writers.writeBash "wg-up" ''
       set -e
       ${iproute2}/bin/ip link add wg0 type wireguard
       ${iproute2}/bin/ip link set wg0 netns wg
       ${iproute2}/bin/ip -n wg address add <ipv4 VPN addr/cidr> dev wg0
       # ${iproute2}/bin/ip -n wg -6 address add <ipv6 VPN addr/cidr> dev wg0
       ${iproute2}/bin/ip netns exec wg \
         ${wireguard-tools}/bin/wg setconf wg0 /root/myVPNprovider.conf
       ${iproute2}/bin/ip -n wg link set wg0 up
       # need to set lo up as network namespace is started with lo down
       ${iproute2}/bin/ip -n wg link set lo up
       ${iproute2}/bin/ip -n wg route add default dev wg0
       # ${iproute2}/bin/ip -n wg -6 route add default dev wg0
     '';
     ExecStop = with pkgs; writers.writeBash "wg-down" ''
       ${iproute2}/bin/ip -n wg route del default dev wg0
       # ${iproute2}/bin/ip -n wg -6 route del default dev wg0
       ${iproute2}/bin/ip -n wg link del wg0
     '';
   };
  };
```

Second, binding deluged to newly created network namespace and enabling connectivity of delugeweb (in root namespace) to delguded in seperate network namespace, based on this [tutorial](https://github.com/existentialtype/deluge-namespaced-wireguard):

``` nix
  # binding deluged to network namespace
  systemd.services.deluged.bindsTo = [ "netns@wg.service" ];
  systemd.services.deluged.requires = [ "network-online.target" "wg.service" ];
  systemd.services.deluged.serviceConfig.NetworkNamespacePath = [ "/var/run/netns/wg" ];

  # allowing delugeweb to access deluged in network namespace, a socket is necesarry
  systemd.sockets."proxy-to-deluged" = {
   enable = true;
   description = "Socket for Proxy to Deluge Daemon";
   listenStreams = [ "58846" ];
   wantedBy = [ "sockets.target" ];
  };

  # creating proxy service on socket, which forwards the same port from the root namespace to the isolated namespace
  systemd.services."proxy-to-deluged" = {
   enable = true;
   description = "Proxy to Deluge Daemon in Network Namespace";
   requires = [ "deluged.service" "proxy-to-deluged.socket" ];
   after = [ "deluged.service" "proxy-to-deluged.socket" ];
   unitConfig = { JoinsNamespaceOf = "deluged.service"; };
   serviceConfig = {
     User = "deluge";
     Group = "deluge";
     ExecStart = "${pkgs.systemd}/lib/systemd/systemd-socket-proxyd --exit-idle-time=5min 127.0.0.1:58846";
     PrivateNetwork = "yes";
   };
  };
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
