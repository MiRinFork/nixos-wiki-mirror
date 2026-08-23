<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FRRouting -->

[FRRouting](https://frrouting.org/) (FRR) is a free and open source Internet routing protocol suite for Linux and Unix platforms. It implements BGP, OSPF, RIP, IS-IS, PIM, LDP, BFD, Babel, PBR, OpenFabric and VRRP, with alpha support for EIGRP and NHRP.

### Configuration

The frr nixos module in nixpkgs does not currently support structured settings, the config or configFile options have to be used. The configuration is described in the frr documentation: [docs.frrouting.org](https://docs.frrouting.org/en/latest/index.html).

[github:secshellnet/frr.nix](https://github.com/secshellnet/frr.nix/) introduced settings for access-lists, prefix-lists and route-maps.

#### Monitoring

[prometheus-frr-exporter](https://github.com/tynany/frr_exporter) can be used to generate prometheus metrics. By default, the bfd, bgp, ospf, and route collectors are enabled. Review and adjust them to match your requirements. A complete list is available in the help page.

``` nixos
{
  services.prometheus.exporters.frr = {
    enable = true;
    disabledCollectors = [ "ospf" ];
    enabledCollectors = [
      "bgp6"
      "bgpl2vpn"
      "rpki"
    ];
  };
}
```

### Examples

Several example configurations have been implemented using the NixOS test framework in [github:secshellnet/nixos-tests](https://github.com/secshellnet/nixos-tests). These tests verify interoperability with other routing daemons (such as BIRD and GoBGP) and different networking implementations (like <a href="IfState" class="wikilink" title="IfState">IfState</a>, <a href="Systemd/networkd" class="wikilink" title="systemd-networkd">systemd-networkd</a>, <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> and <a href="Networking" class="wikilink" title="scripted networking">scripted networking</a>).
