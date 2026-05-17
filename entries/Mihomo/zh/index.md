<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mihomo/zh -->

<languages/> **[mihomo](https://github.com/MetaCubeX/mihomo/tree/Alpha)**（原名clash-meta）是广泛使用的反审查代理工具。

在 NixOS 上启用 mihomo 服务：

``` nix
services.mihomo = {
  enable = true;
  configFile = "/path/to/config.yaml";
  #...
};
```

<span id="TUN_Mode"></span>

### TUN 模式

注意：[tunMode option](https://search.nixos.org/options?channel=unstable&show=services.mihomo.tunMode&from=0&size=50&sort=relevance&type=packages&query=mihomo)仅为服务提供必要的权限。 如果你需要真正的使用TUN,你需要修改**configFile**。详见[official documentation](https://wiki.metacubex.one/config/inbound/listeners/tun/?h=tun)。

<span id="Troubleshooting"></span>

### 故障排除

如果在使用透明代理时遇到问题：

- 使用 `dmesg` 检查内核日志
- 如果看到大量关于特定网络设备的 refuse 消息：
  - NixOS 默认启用了防火墙，关掉防火墙再尝试
  - 如关掉防火墙后问题解决得到解决，可以依次尝试：
    - 将 tun 设备添加到 `trustedInterfaces`
    - 禁用 `checkReversePath`
- 如果看到大量关于特定端口的 refuse 消息：
  - 如果你正在使用 tproxy 透明代理，尝试在防火墙中允许 tproxy 端口。

<span id="See_also"></span>

## 更多参考

<div lang="en" dir="ltr" class="mw-content-ltr">

- [NixOS installation and usage under a censored network (zh-cn)](https://blog.nyaw.xyz/nixos-inwall-install)

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
