<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Orange Pi 5 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi 5</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Orange Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>vendor's u-boot</p></td>
</tr>
<tr>
<td><p>Startup order</p></td>
<td><p>SPI NOR Flash, SD, NVMe</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:ryan4yin" class="wikilink" title="ryan4yin">ryan4yin</a></p></td>
</tr>
</tbody>
</table>

</div>

# Orange PI 5

The Orange Pi 5 is a Single-Board Computer with a Rockchip RK3588s SoC.

## System configuration

None of the basic components (Kernel, HW acceleration drivers) are available from upstream NixOS.

Building a working system requires additional configuration.

### @ryan4yin's flake

A minimal flake that makes NixOS running on Orange Pi 5: <https://github.com/ryan4yin/nixos-rk3588>

# Orange PI 5B

The next version of OPI5 which added eMMC and WIFI/BT by default.

Flake: <https://github.com/fb87/nixos-orangepi-5x/blob/v5.10.x/flake.nix>

This flake which is extended version of <a href="User:ryan4yin" class="wikilink" title="ryan4yin">ryan4yin</a> by adding bootloader by default to create the bootable SDImage( The prebuilt <https://github.com/fb87/nixos-orangepi-5x/releases/download/v0.1.0/nixos-sd-image-23.05.20230613.c702c94-aarch64-linux.img.zst> can already be used).

Note: bootloader requires \`python2\` which is no longer receiving updates since 2020. The \`NIXPKGS_ALLOW_INSECURE=1\` has to be passed in order to build.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
