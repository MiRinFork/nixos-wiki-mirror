<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on LoongArch -->

NixOS does not provide official support for LoongArch architectures. For the loongarch64-linux architecture, however, community support is available through the [Nix4Loong](https://nix4loong.cn/en) project.

## Installation

For the loongarch64-linux architecture, graphical and minimal installation ISOs are available from [Installation — Nix4Loong](https://nix4loong.cn/en/installation#nixos).

Once the ISO image is downloaded, refer to <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a> to get started.

## Binary cache

Nix4Loong provides a binary cache with infrastructure support from Matrix at Sun Yat-sen University. An additional mirror is also maintained by the Nanjing University Linux Users Group:

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
