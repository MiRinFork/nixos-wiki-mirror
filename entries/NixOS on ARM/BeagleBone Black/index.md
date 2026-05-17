<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/BeagleBone Black -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>BeagleBone Black</p></th>
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

U-Boot and its SPL (called the MLO) need to be copied to specific sectors on the microSD card with dd. Download U-Boot & MLO for the board (`uboot-am335x_boneblack_defconfig-2017.03_u-boot.img`, `uboot-am335x_boneblack_defconfig-2017.03_MLO`), and copy them to the correct location with (again, replace /dev/sdX with the correct path to the SD card device):

``` bash
sudo dd if=uboot-am335x_boneblack_defconfig-2017.03_MLO        of=/dev/sdX count=1 seek=1 bs=128k
sudo dd if=uboot-am335x_boneblack_defconfig-2017.03_u-boot.img of=/dev/sdX count=2 seek=1 bs=384k
```

In case there is a valid boot loader on the eMMC of the board and the NixOS U-Boot isn't getting launched, try holding the button labeled 'S2' when resetting the board. Also the boot ROM might have a size limitation on the microSD cards used for booting; the author wasn't able to get a 64 GB SDXC card working but a 8 GB SDHC card worked.

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

## Notes about the boot process

Only serial console (via the 6-pin FTDI pin header) is supported.
