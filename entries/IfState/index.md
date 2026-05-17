<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: IfState -->

[IfState](https://ifstate.net/2.0/) is a python 3 utility designed for declarative management of Linux network interfaces. It acts as a frontend to the kernel's Netlink interface, using the `pyroute2` library to configure network settings such as IP addresses, bridges, traffic control, and WireGuard in an idempotent manner—much like an `iproute2`/`ethtool`/`tc`/`wg` wrapper.

It is available since NixOS 25.11 (see <https://github.com/NixOS/nixpkgs/pull/431047>).

### Examples

You can find several examples on the [IfState website](https://ifstate.net/2.2/examples/). Some include NixOS configuration instructions, while the more complex examples are covered in detail here.

#### Network Namespaces (netns)

Network namespaces are a powerful feature in Linux that allow you to create isolated network environments. Each namespace has its own network interfaces, IP addresses, routing tables, and firewall rules. This isolation is particularly useful for scenarios like running systemd services or NixOS containers in separate network environments, enabling better control and security.

##### to isolate services / nixos-containers

You can bind specific systemd services to a network namespace, ensuring they operate in a controlled network environment without affecting the host or other services.

``` nixos
{
  systemd.services."<name>".serviceConfig.NetworkNamespacePath = "/var/run/netns/<netnsName>";
}
```

When using <a href="NixOS_Containers" class="wikilink" title="nixos-containers">nixos-containers</a>, network namespaces allow you to configure the network outside the container. This separation simplifies management and ensures the container’s network setup is independent of its internal configuration.

``` nixos
{
  containers."<name>".networkNamespace = "/var/run/netns/<netnsName>";
}
```

Network namespaces can be connected to other namespaces or the Global Routing Table (GRT) using virtual Ethernet interfaces (veth). This enables traffic forwarding and communication between isolated environments

The following example creates a pair of veth interfaces. One interface is placed inside the `example` network namespace and assigned a single IPv4 address. Its peer remains in the global routing table. The GRT is configured to reach the namespace’s IPv4 address via [IPv6 link-local routing](https://ungleich.ch/u/blog/how-to-route-ipv4-via-ipv6/). To make this possible, both veth interfaces are assigned specific MAC addresses chosen so that the automatically generated IPv6 link-local (EUI-64) addresses are predictable.

``` nixos
let
  address = "192.0.2.0/32";
  netns = "example";
in
{
  networking.ifstate.settings = {
    namespaces."${netns}" = {
      interfaces.veth0 = {
        addresses = [ address ];
        link = {
          state = "up";
          kind = "veth";
          peer = "veth1";
          peer_netns = null; # grt
          address = "12:de:ad:be:ef:00";
        };
      };
    };
    interfaces.veth1 = {
      link = {
        state = "up";
        kind = "veth";
        peer = "veth0";
        peer_netns = netns;
        address = "12:de:ad:be:ef:10";
      };
    };
    routing.routes = [
      {
        to = address;
        # generated eui64 local link address for mac address of container
        via = "fe80::10de:adff:febe:ef00";
        dev = "veth1";
      }
    ];
  };
}
```

##### to separate provider network from GRT

Another practical application could involve setting up a VPN gateway on a virtual server hosted by a provider. Imagine you’re using a WireGuard tunnel (`wg0`) to connect to a network that provides internet access, alongside a client peer WireGuard endpoint (`wg1`) that allows your personal devices to connect.

In this setup, you’d need to configure a default route through `wg0` to forward internet traffic via the first WireGuard tunnel. At the same time, you’d also require a default route to your provider’s network to ensure your server remains accessible from the internet—essential for your devices to connect to `wg1` and for `wg0` to maintain its peer connection.

To achieve this, you might want to isolate the provider network from your Global Routing Table (GRT) and bind the WireGuard endpoints. The `IfState` tool offers a link configuration option called `bind_netns`, which can be used with tunnel links (such as WireGuard, GRE, SIT, etc.) to implement this separation. ![](Ifstate-vpn-gw.png "Ifstate-vpn-gw.png")

**Important Note:** If `enp0s3` is your provider interface, this configuration will move it into an external network namespace that contains nothing except the bound WireGuard endpoint. As a result, you won’t be able to access systemd services like your SSH server without an active WireGuard connection. Plan accordingly to avoid losing access to critical services.

``` nixos
{
  networking.ifstate = {
    enable = true;
    settings = {
      namespaces.outside = {
        interfaces.enp0s3 = {
          # public ip addresses from your upstream provider
          addresses = [
            "198.51.100.10/26"
            "2001:db8::10/64"
          ];
          link = {
            state = "up";
            kind = "physical";
          };
          identify.perm_address = "00:00:5e:00:53:00";
        };
        routing.routes = [
          {
            to = "0.0.0.0/0";
            via = "198.51.100.62";
          }
          {
            to = "::/0";
            dev = "enp3s0";
            via = "fe80::1";
          }
        ];
      };
    };
    interfaces = {
      wg0 = {
        link = {
          state = "up";
          kind = "wireguard";

          # the connection to the peer will be established via the netns
          bind_netns = "outside";
        };
        # the tunnel addresses for your upstream wireguard
        addresses = [
          "203.0.113.100/25"
          "2001:db8:bad:c0de::100/128"
        ];
        wireguard = {
          listen_port = 40608;
          private_key = "!include /keys/wg0.priv";
          peers."4PG5bt3cXacnjKolLFYHDon5NIPmaBL/CNFUjOUUEGQ=" = {
            allowedips = [
              "0.0.0.0/0"
              "::/0"
            ];
            endpoint = "10.10.10.10:51820";
          };
        };
      };
      wg1 = {
        link = {
          state = "up";
          kind = "wireguard";

          # the wireguard listener will be bound in the netns
          bind_netns = "outside";
        };
        # the tunnel addresses for your own clients
        addresses = [
          "203.0.113.129/25"
          "2001:db8:dead:beef::1/128"
        ];
        wireguard = {
          listen_port = 20406;
          private_key = "!include /keys/wg1.priv";
          peers."GGavg2J9HdumqCgfpFXD85GYb6T0vWmtXBVQmlj9d0w=" = {
            allowedips = [
              "203.0.113.130/32"
              "2001:db8:dead:beef::2/128"
            ];
          };
        };
      };
    };
    routing.routes = [
      {
        to = "0.0.0.0/0";
        via = "203.0.113.1";
      }
      {
        to = "::/0";
        via = "2001:db8:bad:c0de::1";
      }
    ];
  };
}
```

#### DHCPv4

``` nixos
{ lib, pkgs, ... }:
{
  networking.ifstate = {
    enable = true;
    settings = {
      parameters.hooks.dhcp.script = pkgs.writeScript "ifstate-udhcp-wrapper-script.sh" ''
        ${lib.getExe' pkgs.busybox "udhcpc"} --quit --now -i $IFS_IFNAME -b --script ${pkgs.busybox}/default.script
      '';
      interfaces.eth1 = {
        addresses = [ ];
        hooks = [
          { name = "dhcp"; }
        ];
        link = {
          state = "up";
          kind = "physical";
        };
      };
    };
  };
}
```

### Known Issues

#### Firewall for netns

Currently the nixos modules for firewall configuration are not capable of configuring a firewall for a network namespace (see [github:nixpkgs/nixos#372414](https://github.com/NixOS/nixpkgs/issues/372414)).

It's possible to apply the nftables firewall ruleset in all network namespaces by adding the following nix configuration, but this comes with the limitation, that interface names have to be unique across all network namespaces.

``` nixos
# stolen from https://github.com/secshellnet/nixos/blob/main/modules/firewall.nix
{
  lib,
  pkgs,
  config,
  ...
}:
let
  netns = [ ]; # TODO add the network namespaces to apply the firewall ruleset to here
in
{
  systemd.services = builtins.listToAttrs (
    map (key: {
      name = "nftables@${key}";
      value =
        let
          cfg = config.systemd.services.nftables;
          map' = f: x: if lib.isList x then map f x else f x;
          mapFunc = file: "${lib.getExe' pkgs.iproute2 "ip"} netns exec %i ${file}";
        in
        {
          inherit (cfg)
            conflicts
            wants
            wantedBy
            reloadIfChanged
            ;
          description = "nftables firewall for network namespace %i";
          before = [ "network.target" ];
          after = [
            "network-setup.service"
            "network-pre.target"
            # netns must exist, before firewall rules can be applied
            "ifstate.service"
          ];
          serviceConfig = {
            inherit (cfg.serviceConfig) Type RemainAfterExit StateDirectory;
          }
          // builtins.listToAttrs (
            map
              (key: {
                name = key;
                value = map' mapFunc cfg.serviceConfig.${key};
              })
              [
                "ExecStart"
                "ExecStartPost"
                "ExecStop"
                "ExecReload"
              ]
          );
          unitConfig.DefaultDependencies = false;
        };
    }) netns
  );
}
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a>
