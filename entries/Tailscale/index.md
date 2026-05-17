<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tailscale -->

## Basic setup

To enable Tailscale, add the following to your configuration:

After enabling, you can login to your Tailscale account with:

``` console
# tailscale login
```

If you are using features like subnet routers or exit nodes you will also need to set `services.tailscale.useRoutingFeatures` to "server", "client" or "both" depending on the role of your machine.

For more configuration option, refer to [`services.tailscale`](https://search.nixos.org/options?show=services.tailscale) .

## Native nftables Support (Modern Setup)

Recent versions of NixOS encourage the use of <a href="nftables" class="wikilink" title="nftables">nftables</a> over legacy iptables. Tailscale can be configured to use \`nftables\` natively, which avoids conflicts and kernel module bloat.

This configuration forces the \`nftables\` backend and optimizes the service startup:

``` nixos
{ config, pkgs, ... }:

{
  # 1. Enable the service and the firewall
  services.tailscale.enable = true;
  networking.nftables.enable = true;
  networking.firewall = {
    enable = true;
    # Always allow traffic from your Tailscale network
    trustedInterfaces = [ "tailscale0" ];
    # Allow the Tailscale UDP port through the firewall
    allowedUDPPorts = [ config.services.tailscale.port ];
  };

  # 2. Force tailscaled to use nftables (Critical for clean nftables-only systems)
  # This avoids the "iptables-compat" translation layer issues.
  systemd.services.tailscaled.serviceConfig.Environment = [ 
    "TS_DEBUG_FIREWALL_MODE=nftables" 
  ];

  # 3. Optimization: Prevent systemd from waiting for network online 
  # (Optional but recommended for faster boot with VPNs)
  systemd.network.wait-online.enable = false; 
  boot.initrd.systemd.network.wait-online.enable = false;
}
```

## Split DNS

Tailscale supports "Split DNS" where you can access local services (not exposed to the internet) on a different network (e.g. your friend's house) as if you are in that local network.

See KTZ Systems Split DNS overview: <https://www.youtube.com/watch?v=Uzcs97XcxiE>

Combined with Let's Encrypt using the "DNS-01" challenge you can get browser-trusted HTTPS certificates for local services (not exposed to the internet) and access them with Tailscale from anywhere.

See Wolfgang's Channel Local HTTPS overview: <https://www.youtube.com/watch?v=qlcVx-k-02E>

## Configuring TLS

Per [Enabling HTTPS in the Tailscale documentation](https://tailscale.com/kb/1153/enabling-https/?q=tls#provision-tls-certificates-for-your-devices), run the following:

As an alternative, you can set up [Caddy](https://wiki.nixos.org/wiki/Caddy) to create and manage SSL certs automatically as [Caddy recognizes Tailscale urls](https://tailscale.com/kb/1190/caddy-certificates). After replacing <MACHINE_NAME>, <TAILNET_NAME>, <port> with your tailscale machine name, tailscale tailnet name, and the port of the local service you want to forward, you can add the following to your `configuration.nix`:

``` nixos
services.caddy = {
  enable = true;
  virtualHosts."<MACHINE_NAME>.<TAILNET_NAME>".extraConfig = ''
    reverse_proxy 127.0.0.1:<port>
  '';
};
# Allow the Caddy user(and service) to edit certs
services.tailscale.permitCertUid = "caddy"; 
```

## Known issues

### IPv6

If you encounter issues with IPv6 not working through your NixOS-based exit node, this might be an issue with the Tailscale client's detection of whether IPv6 NAT is supported. This is the "checkSupportsV6NAT" function in the Tailscale codebase. Enabling `networking.nftables.enable = true;` and then rebooting may fix this issue if you are using iptables.

### DNS

There is also a known issue with DNS when using the default NixOS configuration; see [GitHub issue 4254](https://github.com/tailscale/tailscale/issues/4254). Enabling <a href="systemd-resolved" class="wikilink" title="systemd-resolved">systemd-resolved</a> seems to be some part of the solution to this problem, as well as ensuring that DHCP is not enabled on the "tailscale0" network interface. Please see the GitHub issue for more information.

### No internet when using exit node

When you turn on exit nodes, NixOS's reverse path filter immediately starts dropping all incoming traffic related to wireguard tunnels, tailscale's control plane connection, etc. etc. The quick fix for NixOS users is to set the following option in your NixOS config:

`networking.firewall.checkReversePath = "loose";`

[Issue in Tailscale tracker](https://github.com/tailscale/tailscale/issues/4432#issuecomment-1112819111)

### Some utils/applets asks root auth every time

Some GUI applets/utilities cannot control as a regular user and prompt for a password for every action/not connecting. Assigning the user as an operator fixes this:

**Note:** There is currently a bug with the above command documented in: <https://github.com/tailscale/tailscale/issues/18294>

The workaround is to login and set the operator as part of connecting to tailscale. This section can be removed once the issue is resolved.

grep -i operator}}

## Running multiple Tailnet-accessible services on a single machine

The essence is to run multiple daemons on a machine, with the additional daemons using userspace networking rather than , which seems to intercept connections to all Tailscale IPs on a machine. Basically for an additional service run the following commands:

/var/lib/tailscale/tailscaled-tt_rss \$ sudo mkdir -p \${STATE_DIRECTORY} \$ sudo env STATE_DIRECTORY{{=}}\${STATE_DIRECTORY} tailscaled --statedir{{=}}\${STATE_DIRECTORY} --socket{{=}}\${STATE_DIRECTORY}/tailscaled.sock --port{{=}}0 --tun{{=}}user \$ sudo tailscale --socket{{=}}\${STATE_DIRECTORY}/tailscaled.sock up --auth-key{{=}}tskey-key-MYSERVICE_KEY_FROM_TAILSCALE_ADMIN_CONSOLE --hostname{{=}}MYSERVICE --reset }}

## Using Userspace Networking (experimental)

Tailscale inside containers can use [userspace networking mode](https://tailscale.com/kb/1112/userspace-networking) to avoid needing host tunnel device permissions.

This can be accomplished by setting `services.tailscale.interfaceName = "userspace-networking";` in your NixOS config.

## Optimize the performance of subnet routers and exit nodes

Tailscale gives [recommendations](https://tailscale.com/kb/1320/performance-best-practices#enable-on-each-boot) on how to optimize UDP throughput. For high-throughput nodes (like subnet routers), disabling UDP Generic Receive Offload (GRO) on the physical interface is recommended to prevent packet drops.

In NixOS, this can be automated using \`networkd-dispatcher\` to ensure the setting persists across reboots and network changes.

``` nixos
# In environment.systemPackages, ensure you have pkgs.ethtool
services.networkd-dispatcher = {
  enable = true;
  rules."50-tailscale-optimizations" = {
    onState = [ "routable" ];
    script = ''
      ${pkgs.ethtool}/bin/ethtool -K eth0 rx-udp-gro-forwarding on rx-gro-list off
    '';
  };
};
```

*Note: Replace \`eth0\` with your actual WAN interface name (e.g. \`ens192\`).*
