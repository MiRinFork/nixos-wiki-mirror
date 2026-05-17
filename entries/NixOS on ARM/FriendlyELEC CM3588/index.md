<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/FriendlyELEC CM3588 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>FriendlyELEC CM3588</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="CM3588.jpg" title="A FriendlyELEC CM3588" width="256" height="256" />
<figcaption>A FriendlyELEC CM3588</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>FriendlyELEC</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Upstream U-Boot</p></td>
</tr>
<tr>
<td><p>Boot options</p></td>
<td><p>microSD, eMMC, SPI NOR Flash, NVMe</p></td>
</tr>
</tbody>
</table>

</div>

The CM3588 is a single board computer built around the Rockchip RK3358 SoC.

There are two configurations of the base version with 4GB RAM or 8GB RAM with 64GB eMMC. The CM3588 Plus variant uses LPDDR5 RAM (instead of LPDDR4) and comes in three configurations (16GB/64GB, 32GB/64GB, 32GB/256GB).

Both variants are typically used with the CM3588 NAS Kit; a daughter board providing 4x NVMe PCIe 3x1 slots, as well as a wealth of other I/O.

## Status

This board has upstream U-Boot and kernel support, in part thanks to Collabora's RK3358 mainlining efforts (more features may be present in their [downstream kernel](https://gitlab.collabora.com/hardware-enablement/rockchip-3588/notes-for-rockchip-3588/-/blob/main/mainline-status.md)). NixOS can be installed using manual partitioning and `nixos-install` or by modifying the aarch64 installation image as described in the next section.

U-Boot for this board is packaged in [nixpkgs](https://github.com/NixOS/nixpkgs/blob/7f39db5bee887aeb8fad4888ffcfaba78bb47992/pkgs/misc/uboot/default.nix#L217-L223) and builds in [Hydra](https://hydra.nixos.org/job/nixpkgs/trunk/ubootCM3588NAS.aarch64-linux).

## Installation

U-Boot needs to be copied to specific sectors on the microSD card, eMMC or image with `dd`. Use [nixos-aarch64-images](https://github.com/Mic92/nixos-aarch64-images) to build a CM3588-compatible image from the pre-built NixOS installation images: `$ nix-build -A cm3588NAS`. Mount and <a href="NixOS_on_ARM/Building_Images#Editing_the_image_manually" class="wikilink" title="edit image manually">edit image manually</a> to add an SSH key (see [networking in the installer](https://nixos.org/manual/nixos/stable/#sec-installation-manual-networking)).

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
