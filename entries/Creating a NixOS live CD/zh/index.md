<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Creating a NixOS live CD/zh -->

<span id="Motivation"></span>

## 起因

<div lang="en" dir="ltr" class="mw-content-ltr">

Creating a modified NixOS LiveCD out of an existing working NixOS installation has a number of benefits:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Ensures authenticity.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- No need for internet access.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- It is easy to add your own packages and configuration changes to the image.

</div>

<span id="Building"></span>

## 构建

<div lang="en" dir="ltr" class="mw-content-ltr">

Building minimal NixOS installation CD with the `nix-build` command by creating this `iso.nix`-file. In this example with <a href="Neovim" class="wikilink" title="Neovim">Neovim</a> preinstalled.

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

Build the image via:

</div>

``` bash
nix-build '<nixpkgs/nixos>' -A config.system.build.isoImage -I nixos-config=iso.nix
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Alternatively, use Nix <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> to generate a ISO installation image, using the `nixos-24.05` branch as nixpkgs source:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The following commands will generate the iso-image:

</div>

``` console

# nix build path:$PWD
```

<div lang="en" dir="ltr" class="mw-content-ltr">

The resulting image can be found in `result`:

</div>

``` console
$ ls result/iso/
nixos-24.05.20240721.63d37cc-x86_64-linux.iso
```

<span id="Testing_the_image"></span>

### 测试镜像

<div lang="en" dir="ltr" class="mw-content-ltr">

To inspect the contents of the ISO image:

</div>

``` console
$ mkdir mnt
$ sudo mount -o loop result/iso/nixos-*.iso mnt
$ ls mnt
boot  EFI  isolinux  nix-store.squashfs  version.txt
$ umount mnt
```

<div lang="en" dir="ltr" class="mw-content-ltr">

To boot the ISO image in an emulator:

</div>

``` console
$ nix-shell -p qemu
$ qemu-system-x86_64 -enable-kvm -m 256 -cdrom result/iso/nixos-*.iso
```

### SSH

在您的 `iso.nix` 中：

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

<div lang="en" dir="ltr" class="mw-content-ltr">

Static IP addresses can be set in the image itself. This can be useful for VPS installation.

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

The build process is slow because of compression.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Here are some timings for `nix-build`:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

| squashfsCompression             | Time | Size |
|---------------------------------|------|------|
| `lz4`                           | 100s | 59%  |
| `gzip -Xcompression-level 1`    | 105s | 52%  |
| `gzip`                          | 210s | 49%  |
| `xz -Xdict-size 100%` (default) | 450s | 43%  |

Compression results

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See also: [mksquashfs benchmarks](https://gist.github.com/baryluk/70a99b5f26df4671378dd05afef97fce)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you don't care about file size, you can use a faster compression by adding this to your `iso.nix`:

</div>

``` nix
{
  isoImage.squashfsCompression = "gzip -Xcompression-level 1";
}
```

<span id="See_also"></span>

## 另见

<div lang="en" dir="ltr" class="mw-content-ltr">

- [NixOS Manual: Building a NixOS (Live) ISO](https://nixos.org/manual/nixos/stable/index.html#sec-building-image).

</div>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
