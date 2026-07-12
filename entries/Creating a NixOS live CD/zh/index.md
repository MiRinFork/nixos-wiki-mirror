<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Creating a NixOS live CD/zh -->

<span id="Motivation"></span>

## 起因

从已安装的NixOS系统中创建一个自定义的 NixOS Live CD 有许多优势：

- 确保可信度

<!-- -->

- 无需访问互联网

<!-- -->

- 很容易向镜像中添加自己的包和配置

<span id="Building"></span>

## 构建

创建`iso.nix`文件，并使用`nix-build`命令来构建最小化的NixOS安装镜像。如下示例中预装了<a href="Neovim" class="wikilink" title="Neovim">Neovim</a>。

``` nix
{ config, pkgs, ... }:
{
  imports = [
    <nixpkgs/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix>

    # Provide an initial copy of the NixOS channel so that the user
    # doesn't need to run "nix-channel --update" first.
    <nixpkgs/nixos/modules/installer/cd-dvd/channel.nix>
  ];
  environment.systemPackages = [ pkgs.neovim ];
}
```

通过以下命令构建镜像：

``` bash
nix-build '<nixpkgs/nixos>' -A config.system.build.isoImage -I nixos-config=iso.nix
```

另外，也可以使用<a href="Flakes" class="wikilink" title="Flakes">Flakes</a>来生成ISO安装镜像。示例中使用`nixos-24.05`作为nixpkgs源。

用以下命令生成iso镜像:

``` console

# nix build path:$PWD
```

生成的镜像文件可以在`result`中找到

``` console
$ ls result/iso/
nixos-24.05.20240721.63d37cc-x86_64-linux.iso
```

<span id="Testing_the_image"></span>

### 测试镜像

查看ISO镜像中的内容：

``` console
$ mkdir mnt
$ sudo mount -o loop result/iso/nixos-*.iso mnt
$ ls mnt
boot  EFI  isolinux  nix-store.squashfs  version.txt
$ umount mnt
```

在模拟器中启动镜像：

``` console
$ nix-shell -p qemu
$ qemu-system-x86_64 -enable-kvm -m 256 -cdrom result/iso/nixos-*.iso
```

### SSH

在你的 `iso.nix` 中添加：

``` nix
{
  ...
  # Enable SSH in the boot process.
  systemd.services.sshd.wantedBy = pkgs.lib.mkForce [ "multi-user.target" ];
  users.users.root.openssh.authorizedKeys.keys = [
    "ssh-ed25519 AaAeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee username@host"
  ];
  ...
}
```

<span id="Static_IP_Address"></span>

### 静态 IP 地址

你可以直接在镜像中设置好静态IP地址。这对于在VPS上进行安装可能会很有帮助。

``` nix
{
  ...
  networking = {
    usePredictableInterfaceNames = false;
    interfaces.eth0.ipv4.addresses = [{
      address = "64.137.201.46";
      prefixLength = 24;
    }];
    defaultGateway = "64.137.201.1";
    nameservers = [ "8.8.8.8" ];
  };
  ...
}
```

<span id="Building_faster"></span>

### 更快速的构建

构建过程缓慢的原因是压缩。

以下是`nix-build`使用的一些压缩方式的用时测试结果：

| squashfsCompression             | 用时 | 大小 |
|---------------------------------|------|------|
| `lz4`                           | 100s | 59%  |
| `gzip -Xcompression-level 1`    | 105s | 52%  |
| `gzip`                          | 210s | 49%  |
| `xz -Xdict-size 100%` (default) | 450s | 43%  |

压缩测试结果

<div lang="en" dir="ltr" class="mw-content-ltr">

See also: [mksquashfs benchmarks](https://gist.github.com/baryluk/70a99b5f26df4671378dd05afef97fce)

</div>

如果你并不在意文件大小，可以在你的`iso.nix`中添加如下内容以使用更快的压缩方式：

``` nix
{
  isoImage.squashfsCompression = "gzip -Xcompression-level 1";
}
```

<span id="See_also"></span>

## 另见

- [NixOS 手册: 构建一个 NixOS (Live) ISO](https://nixos.org/manual/nixos/stable/index.html#sec-building-image).

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
