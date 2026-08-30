<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RISC-V -->

## Supported devices

Table legend:

- SoC - <https://en.wikipedia.org/wiki/System_on_a_chip>
- ISA - <https://en.wikipedia.org/wiki/Instruction_set_architecture>

### Upstream (NixOS) supported devices

NixOS has no official support for riscv64-linux architecture on the nixpkgs-unstable and stable channel.

### Community supported devices

<div class="table">

| Manufacturer | Board | SoC | ISA | CPU | RAM | Storage |
|----|----|----|----|----|----|----|
| StarFive | <a href="NixOS_on_RISCV/VisionFive" class="wikilink" title="StarFive VisionFive">StarFive VisionFive</a> | JH7100 | RV64GC | 2× SiFive U74 @ 1.5 GHz | 8GB LPDDR4 | microSD |
| StarFive | <a href="NixOS_on_RISCV/VisionFive_2" class="wikilink" title="StarFive VisionFive 2">StarFive VisionFive 2</a> | JH7110 | RV64GC | 4× SiFive U74 @ 1.5 GHz | 2GB/4GB/8GB LPDDR4 | microSD, eMMC, M.2 M-Key |

</div>

#### Special Devices

It is possible to emulate a RISC-V platform with QEMU. Programs may occasionally crash on QEMU with a segmentation fault despite working on native RISC-V hardware.[^1][^2]

<div class="table">

| Manufacturer | Board | SoC | ISA | CPU | RAM | Storage |
|----|----|----|----|----|----|----|
| QEMU |  | — | Anything QEMU supports | Anything QEMU supports | Anything QEMU supports | Anything QEMU supports |

</div>

## Installation

### Getting the installer

#### SD card images (SBCs and similar platforms)

For `riscv64` it is possible to download images from the community.

- [Hifive Unmatched](https://github.com/zhaofengli/nixos-riscv64)
- [VisionFive 1](https://github.com/zhaofengli/nixos-riscv64)
- [VisionFive 2](https://github.com/NickCao/nixos-riscv)
- [STAR64](https://sr.ht/~fgaz/nixos-star64)
- [Lichee Pi 4A](https://github.com/ryan4yin/nixos-licheepi4a)

Build or download the image.

If the image has the extension `.zst`, it will need to be decompressed before writing to installation device. Use `nix-shell -p zstd --run "unzstd `<img-name>`.img.zst"` to decompress the image.

## Binary cache

Example configuration snippet which can be used to add a third-party binary cache with RISCV support

``` nix
nix.settings = {
  substituters = [
    "https://cache.ztier.in" # only nixos-unstable
  ];
  trusted-public-keys = [
    "cache.ztier.link-1:3P5j2ZB9dNgFFFVkCQWT3mh0E+S3rIWtZvoql64UaXM="
  ];
  experimental-features = [
    "nix-command"
    "flakes"
  ];
};
```

Known third-party binary caches with RISCV support:

- [misuzu](https://github.com/misuzu/nixos-vf2/blob/master/flake.nix#L3) (only for nixos-unstable)

## NixOS Support

All RISC-V platforms are experimental for the time being.

There is a dedicated room for the upstream effort on Matrix, [matrix:r/riscv:nixos.org](https://matrix.to/#/#riscv:nixos.org).

### Awaiting upstream RISC-V support

- [LuaJIT](https://github.com/LuaJIT/LuaJIT/issues/628)

## Resources

- <https://wiki.riscv.org/display/HOME/Language+Runtimes>
- <https://github.com/NixOS/nixos-hardware>

### Subpages

The following is a list of all sub-pages of the *NixOS on RISC-V* topic.

The following is a list of all sub-pages of the *Meetings/RISC-V*.

## References

[^1]: [Nixpkgs \#300550](https://github.com/NixOS/nixpkgs/issues/300550)

[^2]: [Nixpkgs \#300618](https://github.com/NixOS/nixpkgs/issues/300618)
