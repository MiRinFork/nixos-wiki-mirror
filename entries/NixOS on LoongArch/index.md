<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on LoongArch -->

NixOS does not provide official support for LoongArch architectures. Nixpkgs supports the `loongarch64-linux` architecture as a Tier 3 platform, and community support for NixOS is available through the [Nix4Loong](https://nix4loong.cn/en) project. The `loongarch32-linux` architecture is not supported by Nixpkgs.

## Supported hardware

Nixpkgs requires a 64-bit LoongArch processor supporting at least the `la64v1.0` feature baseline for native builds. Compatible processors include the Loongson 3A5000, 3C5000 series, 3A6000, 3B6000 series, 3C6000 series, and 2K3000. The 2K0300 does not meet this requirement. For older MIPS-based processors, such as the 3A4000, see <a href="NixOS_on_MIPS" class="wikilink" title="NixOS on MIPS">NixOS on MIPS</a>.

NixOS also expects UEFI firmware compatible with the new-world LoongArch boot protocol. Older firmware may require additional patches. Updating the device firmware to the [latest version](https://loongfans.cn/en/devices) is recommended.

## Installation

Graphical and minimal NixOS installation ISOs are available from [Installation — Nix4Loong](https://nix4loong.cn/en/installation#nixos). The images are generic, although compatibility depends on firmware and kernel support.

Once the ISO image is downloaded and booted, refer to <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a> to get started.

## Binary cache

Nix4Loong provides a binary cache with infrastructure support from [Matrix](https://matrix.sysu.edu.cn/about/) at Sun Yat-sen University. An additional mirror is also maintained by the Nanjing University Linux Users Group:

``` nix
nix.settings = {
  substituters = [
    "https://cache.nix4loong.cn" # "https://mirror.sysu.edu.cn/nix4loong/store"
    "https://mirrors.nju.edu.cn/nix4loong/store"
  ];
  trusted-public-keys = [
    "cache.nix4loong.cn-1:zmkwLihdSUyy6OFSVgvK3br0EaUEczLiJgDfvOmm3pA="
  ];
};
```

## Hydra

Nix4Loong maintains a [Hydra instance](https://hydra.nix4loong.cn) that tracks the master and staging-next branches, as well as their corresponding release branches. The Hydra jobs are defined in the [Nix4Loong/hydra-jobs](https://github.com/Nix4Loong/hydra-jobs) repository.

## Linux kernel

Nixpkgs supports Linux kernels for LoongArch starting with Linux 6.16. Mainline kernels should generally work for most purposes, though newer kernel versions (such as `linuxPackages_latest`) are preferred for better hardware support.

For additional hardware compatibility and fixes, Nix4Loong maintains a [patched Linux kernel](https://github.com/Nix4Loong/nix-loongarch-kernel) incorporating some of the [downstream patches](https://loongfans.cn/en/sdk#unmerged-patches) for LoongArch. It can be integrated into NixOS configurations using the provided module or overlay.
