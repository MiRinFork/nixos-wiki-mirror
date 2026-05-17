<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tenstorrent -->

[Tenstorrent](https://tenstorrent.com) is a company developing RISC-V based hardware accelerators for AI and ML. They're known for the Wormhole and Blackhole accelerator cards. They also have the TT-LoudBox and TT-QuietBox workstation systems.

## NixOS

NixOS support requires NixOS 25.11 or newer and it is as simple as enabling the module.

``` nix
{ config, ... }:
{
  hardware.tenstorrent.enable = true;
}
```

This gives you `tt-smi` and `tt-system-tools` along with the kernel driver and udev rules.

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
