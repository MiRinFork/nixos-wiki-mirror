<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nebula -->

[Nebula](https://github.com/slackhq/nebula) is a meshing overlay network made as an open-source program by Slack. You can seamlessly mesh hundreds, thousands, or more machines across the globe, using minimal changes to your process.

Nebula runs by assigning a number of nodes the role of "lighthouse". These nodes should be assigned a public global IP address - any kind of NAT or port forwarding is likely to render your lighthouses useless. A minimal \$5/mo cloud machine is good enough to run as a lighthouse node, and luckily no traffic passes through those nodes; they only broker the peer-to-peer connections of the other nodes in your mesh.

## Lighthouse Node

In Nebula, a "lighthouse" is a signaling node accessible through a public IP address, using UDP port 4242.

Because you're likely using a cloud server option for your lighthouse, there is a chance you'll be unable to use NixOS on that node. Double check the <a href="NixOS_friendly_hosters" class="wikilink" title=" NixOS friendly hosters article"> NixOS friendly hosters article</a> your options for running NixOS in the cloud\], or choose a secondary distribution and look for the `nebula` package, and go through [the Quick Start guide](https://nebula.defined.net/docs/guides/quick-start/).

A simple lighthouse configuration may look like:

``` nix
  environment.systemPackages = with pkgs; [ nebula ];
  services.nebula.networks.mesh = {
    enable = true;
    isLighthouse = true;
    cert = "/etc/nebula/beacon.crt"; # The name of this lighthouse is beacon.
    key = "/etc/nebula/beacon.key";
    ca = "/etc/nebula/ca.crt";
  };
```

A node configuration may look like:

``` nix
  environment.systemPackages = with pkgs; [ nebula ];
  services.nebula.networks.mesh = {
    enable = true;
    isLighthouse = false;
    lighthouses = [ "192.168.100.1" ];
    settings = {
        cipher= "aes";
        };
    cert = "/etc/nebula/host.crt";
    key = "/etc/nebula/host.key";
    ca = "/etc/nebula/ca.crt";
    staticHostMap = {
        "192.168.100.1" = [
                "PUBLICLIGHTHOUSEIPHERE:4242"
                ];
        };
    firewall.outbound = [
  {
    host = "any";
    port = "any";
    proto = "any";
  }
];
    firewall.inbound = [
  {
    host = "any";
    port = "any";
    proto = "any";
  }
];
  };
```

The configuration files in \`/etc/nebula\` need to be readable by the Nebula service:

``` bash
sudo chmod --reference /etc/nix /etc/nebula
sudo chmod --reference /etc/nix/nix.conf /etc/nebula/*
```

Here is a quick process for making a certificate authority (`ca`) and a certificate for a lighthouse node, called "`beacon`".

``` bash
> mkdir ~/mesh && cd ~/mesh
> nebula-cert ca -name mesh
> nebula-cert sign -ca-crt ./ca.crt -ca-key ./ca.key -name beacon -ip 10.0.0.1
> ls
ca.crt  ca.key  node.crt  node.key
```

Of these four files produced, you should do as much as you can to keep `ca.key` secure.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
