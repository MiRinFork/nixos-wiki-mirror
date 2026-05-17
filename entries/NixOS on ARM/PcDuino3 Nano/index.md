<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/PcDuino3 Nano -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>pcDuino3 Nano</p></th>
</tr>
</thead>
<tbody>
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

U-Boot needs to be copied to specific sectors on the microSD card with dd. Download U-Boot for the board (`uboot-Linksprite_pcDuino3_Nano_defconfig-2015.07_u-boot-sunxi-with-spl.bin`), and copy it to the correct location with (again, replace `/dev/sdX` with the correct path to the SD card device):

``` bash
sudo dd if=uboot-Linksprite_pcDuino3_Nano_defconfig-2015.07_u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

## Notes about the boot process

USB keyboards and HDMI displays work perfectly. Also a 3.3v serial port via the 3-pin header works.
