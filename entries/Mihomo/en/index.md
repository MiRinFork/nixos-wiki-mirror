<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mihomo/en -->

<languages/> **[mihomo](https://github.com/MetaCubeX/mihomo/tree/Alpha)** (formerly known as clash-meta), is a widely-used anti-censorship proxy application.

Enable mihomo service on NixOS:

``` nix
services.mihomo = {
  enable = true;
  configFile = "/path/to/config.yaml";
  #...
};
```

### TUN Mode

NOTICE: The [tunMode option](https://search.nixos.org/options?channel=unstable&show=services.mihomo.tunMode&from=0&size=50&sort=relevance&type=packages&query=mihomo) in NixOS module only grants necessary permissions for the service. To actually enable TUN, you need to edit the **configFile**. See [official documentation](https://wiki.metacubex.one/config/inbound/listeners/tun/?h=tun).

### Troubleshooting

If encountering issues with transparent proxy:

- Check kernel logs with `dmesg`
- If seeing massive "refuse" messages for specific network devices:
  - NixOS enables firewall by default, try disabling firewall
  - If problem is solved, try sequentially:
    - Add tun device to `trustedInterfaces`
    - Disable `checkReversePath`
- If seeing massive "refuse" messages for specific ports:
  - Try allow the tproxy port in firewall if you're trying tproxy transparent proxy.

## See also

- [NixOS installation and usage under a censored network (zh-cn)](https://blog.nyaw.xyz/nixos-inwall-install)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
