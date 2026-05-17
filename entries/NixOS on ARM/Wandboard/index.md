<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Wandboard -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Wandboard Family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" class="title"><p>Solo/Dual/Quad</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv7</p></td>
</tr>
</tbody>
</table>

</div>

## Status

**@dezgeg**'s porting efforts to ARMv7 should work.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image.

U-Boot and its SPL need to be copied to specific sectors on the microSD card with dd. Download U-Boot & SPL for the board (`uboot-wandboard_defconfig-2017.03_u-boot.img`, `uboot-wandboard_defconfig-2017.03_SPL`), and copy them to the correct location with (again, replace /dev/sdX with the correct path to the SD card device):

``` bash
sudo dd if=uboot-wandboard_defconfig-2017.03_SPL        of=/dev/sdX seek=1 bs=1k
sudo dd if=uboot-wandboard_defconfig-2017.03_u-boot.img of=/dev/sdX seek=69 bs=1k
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

## Notes about the boot process

Only serial console (via the DB-9 connector) is supported.
