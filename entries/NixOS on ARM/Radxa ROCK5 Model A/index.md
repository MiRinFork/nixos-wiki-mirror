<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Radxa ROCK5 Model A -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Rock 5 Model A</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Radxa</p></td>
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

# Rock 5A

The Rock 5A is a Single-Board Computer with a Rockchip RK3588s SoC.

## System configuration

None of the basic components (Kernel, HW acceleration drivers) are available from upstream NixOS.

Building a working system requires additional configuration.

### @ryan4yin's flake

A minimal flake that makes NixOS running on Orange Pi 5: <https://github.com/ryan4yin/nixos-rk3588>

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
