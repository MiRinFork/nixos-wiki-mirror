<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Amazon EC2/zh -->

<languages /> Amazon EC2 是一个广泛使用的云部署平台，隶属于亚马逊网络服务 (AWS)。NixOS 主要通过 AMI 和 [nixos-generators](https://github.com/nix-community/nixos-generators) 项目支持该平台。

<span id="Public_NixOS_AMIs"></span>

## 公共 NixOS AMIs

AWS 上可用的 NixOS AMI 列表位于 [此处](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/amazon-ec2-amis.nix)，更新的列表位于：[此处](https://nixos.github.io/amis/)（参见 [此讨论线程](https://discourse.nixos.org/t/ami-for-nixos-23-11/36860/7)）。

这些 AMI 的默认用户是 `root`。没有默认密码，而是使用在 EC2 创建过程中选择的 SSH 密钥进行身份验证。

<span id="Creating_a_NixOS_AMI"></span>

## 创建 NixOS AMI

目前，[nixos-generators](https://github.com/nix-community/nixos-generators) 项目是创建您自己的 NixOS AMI 的最佳方法。请遵循 `nixos-generators` 提供的说明，然后遵循 [AWS 提供的介绍](https://docs.aws.amazon.com/vm-import/latest/userguide/what-is-vmimport.html)。

<span id="Additional_Resources"></span>

## 其他资源

[在 EC2 上构建和导入 NixOS AMI](http://jackkelly.name/blog/archives/2020/08/30/building_and_importing_nixos_amis_on_ec2/) 作者：Jack Kelly

<span id="Troubleshooting"></span>

## 故障排除

<span id="SSH_Asks_For_Password"></span>

### SSH 要求输入密码

通过 SSH 连接到新启动的 EC2 实例时，可能会要求输入密码。这似乎是因为 `amazon-init` systemd 服务仍在读取用户数据。请退出当前的 SSH 连接，并在几分钟后重试。

<a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
