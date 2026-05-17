<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Oracle Cloud -->

This guide describes how to install NixOS on [Oracle Cloud](https://cloud.oracle.com/), including IPv6 configuration.

## Installation

Create the instance with Oracle Linux 9 as base image. Then follow the steps in <a href="Install_NixOS_on_a_Server_With_a_Different_Filesystem" class="wikilink" title="Install NixOS on a Server With a Different Filesystem">Install NixOS on a Server With a Different Filesystem</a>.

There are other methods that may also work, see [this Discourse thread](https://discourse.nixos.org/t/nixos-on-free-oracle-cloud-arm-a1/17474).

## Configuration

### Bootloader

systemd-boot works well. `net.ifnames=0` is optional, but recommended for more predictable interface names.

``` nix
boot.loader.systemd-boot.enable = true;
boot.loader.efi.canTouchEfiVariables = true;
boot.kernelParams = [ "net.ifnames=0" ];
```

### Networking

#### Oracle Cloud web interface

IPv4 setup is handled by the configuration wizard.

To set up IPv6, your Virtual Cloud Network (VCN) must have an IPv6 prefix assigned.

<figure>
<img src="Oc-vcn-cidr.png" title="Oc-vcn-cidr.png" />
<figcaption>Oc-vcn-cidr.png</figcaption>
</figure>

The VCN's Route Table(s) must have an entry for IPv6 traffic.

<figure>
<img src="Oc-vcn-route-table.png" title="Oc-vcn-route-table.png" />
<figcaption>Oc-vcn-route-table.png</figcaption>
</figure>

The VCN's subnet for your instance must have an IPv6 prefix assigned. ![](Oc-vcn-subnet-ipv6-prefixes.png "Oc-vcn-subnet-ipv6-prefixes.png")

Make sure your security list has equivalent rules for IPv4 and IPv6 if you want your services to be reachable via both versions.

#### NixOS configuration.nix

``` nix
networking = {
  hostName = "(your hostname here)";
  defaultGateway = "10.0.0.1";
  # Use Quad9's DNS (or replace by your preferred DNS provider)
  nameservers = [
    "9.9.9.9"
    "149.112.112.112"
    "2620:fe::fe"
    "2620:fe::9"
  ];
  interfaces.eth0 = {
    ipv4.addresses = [
      {
        # Use IP address configured in the Oracle Cloud web interface
        address = "10.0.0.90";
        prefixLength = 24;
      }
    ];
    # Only "required" for IPv6, can be false if only IPv4 is needed
    useDHCP = true;
  };
  # Note: you also need to configure open ports in the Oracle Cloud web interface
  # (Virtual Cloud Network -> Security Lists -> Ingress Rules)
  firewall = {
    # (both optional)
    logRefusedConnections = false;
    rejectPackets = true;
  };
};
```

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
