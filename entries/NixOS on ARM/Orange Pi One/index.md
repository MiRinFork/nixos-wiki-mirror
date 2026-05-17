<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Orange Pi One -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi One</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="orange_pi_one.jpg" title="Orange Pi One." width="256" />
<figcaption>Orange Pi One.</figcaption>
</figure></td>
</tr>
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
<td><p><a href="User:makefu" class="wikilink" title="makefu">makefu</a></p></td>
</tr>
<tr>
<td><p>URL</p></td>
<td><p><a href="http://linux-sunxi.org/Xunlong_Orange_Pi_One_%26_Lite">Sunxi Wiki</a></p></td>
</tr>
</tbody>
</table>

</div>

The Orange Pi One is an Xunlong SoC based on the Allwinner H3. As the board is on the market for quite some time and the device is relatively cheap, the community effort resulted in a better than average mainline support with the current kernel (5.0). Refer to the H3 column in the [SunXI Mainline Status Matrix](http://linux-sunxi.org/Mainlining_Effort#Status_Matrix).

## Status

**@dezgeg**'s porting efforts to ARMv7 works on the Orange Pi One, using the proper upstream u-boot.

Even though the upstream uboot does support the Orange Pi One, it is not part of nixpkgs. However with the new cross-compiler toolchain added with nixpkgs-18.09 it is straight forward to build the bootloader yourself.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image on an SD card.

U-Boot needs to be copied to specific sectors on the microSD card with `dd`. At first, build the u-boot for the device, then copy it to the correct location with (again, replace `/dev/sdX` with the correct path to the SD card device):

``` bash
nix-build -E 'let plat = ((import <nixpkgs> ){}).pkgsCross.armv7l-hf-multiplatform; in plat.buildUBoot{defconfig = "orangepi_one_defconfig"; extraMeta.platforms = ["armv7l-linux"]; filesToInstall = ["u-boot-sunxi-with-spl.bin"];}'
sudo dd if=result/uboot-orangepi_pc_defconfig-2017.11.nixpkgs.*.u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

Your configuration.nix will need to add `console=ttyS0,115200n8` to the `boot.kernelParams` configuration to use the serial console.

## Compatibility notes

- Ethernet works with 4.19 kernel
- HDMI should work since kernel 4.17 (untested)

## Resources

- [Official product page](http://www.orangepi.org/)
- [linux-sunxi wiki page](https://linux-sunxi.org/Xunlong_Orange_Pi_PC)
