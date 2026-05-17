<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nitrokey/zh -->

<languages/> 本文介绍了如何将 <a href="Wikipedia:Nitrokey" class="wikilink" title="Nitrokey">Nitrokey</a> 与 NixOS 一起使用

<span id="Installation"></span>

## 安装

您可能还希望添加 nitrokey udev 规则并启用 gpg 代理。

``` nix
services.udev.packages = [ pkgs.nitrokey-udev-rules ];
programs = {
  ssh.startAgent = false;
  gnupg.agent = {
    enable = true;
    enableSSHSupport = true;
  };
};
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
