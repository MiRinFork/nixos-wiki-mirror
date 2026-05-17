<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Orange Pi PC -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi PC</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Xunlong / Orange Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv7</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Upstream u-boot</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td></td>
</tr>
</tbody>
</table>

</div>

## Status

**@dezgeg**'s porting efforts to ARMv7 works on the Orange Pi PC, using the proper upstream u-boot.

U-boot support [has been merged 2017-12-11](https://github.com/NixOS/nixpkgs/pull/32554).

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image on an SD card.

U-Boot needs to be copied to specific sectors on the microSD card with `dd`. Download u-boot for the board (`uboot-orangepi_pc_defconfig-2017.11.nixpkgs.*.u-boot-sunxi-with-spl.bin`), and copy it to the correct location with (again, replace `/dev/sdX` with the correct path to the SD card device):

``` bash
sudo dd if=uboot-orangepi_pc_defconfig-2017.11.nixpkgs.*.u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

Your configuration.nix will need to add `console=ttyS0,115200n8` to the `boot.kernelParams` configuration to use the serial console.

## Compatibility notes

- Using the upstream kernel at 4.13, neither HDMI nor Ethernet will work.
  - [\#29569 has a comment with a compatible linux kernel overlay derivation.](https://github.com/NixOS/nixpkgs/issues/29569#issuecomment-347023896)
  - Support for ethernet may land in 4.15.
  - HDMI support isn't in the maintainer's requirements, it may start working in the future.

## Resources

- [Official product page](http://www.orangepi.org)
- [linux-sunxi wiki page](https://linux-sunxi.org/Xunlong_Orange_Pi_PC)
