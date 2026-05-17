<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Netbird -->

[Netbird](https://netbird.io/) is an open-source, peer-to-peer VPN powered by [Wireguard](https://www.wireguard.com/). The network's access controls and coordination are handled by a management server, which can either be the Netbird company's instance or a self-hosted instance.

## Setup

### Basic Client Setup

To set up a Netbird client (peer), you will need to first create a setup key as described in the [Netbird setup key documentation](https://docs.netbird.io/manage/peers/register-machines-using-setup-keys).

Then, add the following to your NixOS module and rebuild your system:

``` nix
{
  services.netbird.clients.wt0 = {

    # Automatically login to your Netbird network with a setup key
    # This is mostly useful for server computers.
    # For manual setup instructions, see the wiki page section below.
    login = {
      enable = true;

      # Path to a file containing the setup key for your peer
      # NOTE: if your setup key is reusable, make sure it is not copied to the Nix store.
      setupKeyFile = "/path/to/your/setup-key";
    };

    # Port used to listen to wireguard connections
    port = 51821;

    # Set this to true if you want the GUI client
    ui.enable = false;

    # This opens ports required for direct connection without a relay
    openFirewall = true;

    # This opens necessary firewall ports in the Netbird client's network interface
    openInternalFirewall = true;
  };
}
```

The above configuration will create a command called `netbird-wt0` available on PATH.

If you did not enable the `login` configuration above, you will need to manually login using the command: `netbird-wt0 login`

Once logged in, you can confirm the peer's connection using the command: `netbird-wt0 status`

### Routing Peer Setup

To set up a routing peer, follow the <a href="#Basic_Client_Setup" class="wikilink" title="#Basic Client Setup">#Basic Client Setup</a>, then add the following line to your NixOS module:

``` nix
services.netbird.useRoutingFeatures = "both";
```

This enables IP forwarding, which is required for routing peers.

### Management Server Setup

## Configuration

#### DNS Resolution

To get [Netbird's client-side DNS resolution](https://docs.netbird.io/manage/dns#client-side-how-peers-resolve-dns) to work, you must use <a href="Systemd/resolved" class="wikilink" title="systemd-resolved">systemd-resolved</a> for your system's DNS by adding:

    services.resolved.enable = true;

## Troubleshooting

For issues setting up a client, consult the official [Netbird "Troubleshooting client issues" documentation](https://docs.netbird.io/help/troubleshooting-client).

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
