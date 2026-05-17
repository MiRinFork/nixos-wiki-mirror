<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/ODROID-HC4 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Hardkernel ODROID-HC4</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Hardkernel</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>U-Boot</p></td>
</tr>
<tr>
<td><p>Boot options</p></td>
<td><p>microSD (SATA?)</p></td>
</tr>
</tbody>
</table>

</div>

## Status

Mostly working, but some manual steps needed to get it running.

U-boot support in NixPkgs is currently in review: [NixPkgs Pull Request \#101454](https://github.com/NixOS/nixpkgs/pull/101454)

## Board-specific installation notes

### Petitboot removal

Petitboot is installed on the SPI memory of the Odroid HC4 from factory. To be able to load an upstreamed version of U-Boot without having to press a hardware button at each boot, you may remove it. **Please proceed with caution, this will make Hardkernel images unbootable!**

From the Petitboot, go for “Exit to shell” and enter these commands to remove Petitboot:

``` bash
flash_eraseall /dev/mtd0
flash_eraseall /dev/mtd1
flash_eraseall /dev/mtd2
flash_eraseall /dev/mtd3
```

This will make your SPI flash memory empty and the device will now start from SD on next boot.

See [this Odroid forum topic](https://forum.odroid.com/viewtopic.php?f=207&t=40906) to restore Petitboot.

### NixOS installation

1.  First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the latest stable installer image.
2.  Uncompress the .zst file. One may use the `unzstd` command (equivalent to `zstd -d`) on supported machines. The zstd commands can be accessed from the `zstd` package.
3.  Patch this image (.img file) with U-Boot for Odroid HC4.
4.  Clone content of samueldr's wip/odroidc4 branch, edit the defconfig file, and build

git clone <https://github.com/samueldr/nixpkgs> --depth 1 -b wip/odroidc4 && cd nixpkgs test "\$(uname)" '==' 'Darwin' && sed -i '' 's/defconfig = "odroid-c4_defconfig"/defconfig = "odroid-hc4_defconfig"/' pkgs/misc/uboot/default.nix \|\| sed -i 's/defconfig = "odroid-c4_defconfig"/defconfig = "odroid-hc4_defconfig"/' pkgs/misc/uboot/default.nix nix-build -I "nixpkgs=\$PWD" -A pkgsCross.aarch64-multiplatform.ubootOdroidC4 sudo dd if=result/u-boot.bin of=PATH/TO/nixos-sd-image-21.05.XXXX.XXXXXXXX-aarch64-linux.img conv=fsync,notrunc bs=512 seek=1

</syntaxhighlight>

1.  Flash the modified SD image file (.img) to a microSD card. **This will erase all the data on the card!**

## Known issues

### Fan doesn't work by default

You need to use software fan control (via `fancontrol`) for this. You may refer to <a href="https://github.com/NixOS/nixos-hardware/blob/master/hardkernel/odroid-hc4/default.nix_nixos-hardware_Odroid_HC4_module" class="wikilink" title="https://github.com/NixOS/nixos-hardware/blob/master/hardkernel/odroid-hc4/default.nix nixos-hardware Odroid HC4 module">https://github.com/NixOS/nixos-hardware/blob/master/hardkernel/odroid-hc4/default.nix nixos-hardware Odroid HC4 module</a> for `fancontrol` configuration.

## No HDMI audio by default

After enabling ALSA you should see a sound card named "ODROID-HC4". Audio is not correctly routed by default so you might need to open alsa-mixer and change:

- `FRDDR_A SINK 1 SEL` to `OUT 1`
- `FRDDR_A SRC 1 EN` to on
- `TDMOUT_B SRC SEL` to `IN 0`
- `TOHDMITX` to on
- `TOHDMITX I2S SRC` to `I2S B`

After these changes, `speaker-test -c 2` should output white noise.

## Resources

- [Official product page](https://www.hardkernel.com/shop/odroid-hc4/)
- [NixOS configuration for the ODROID HC4 microcomputer by considerate](https://github.com/considerate/nixos-odroidhc4/)
- [Armbian Odroid HC4](https://www.armbian.com/odroid-hc4/)
- [U-Boot for Odroid C4 documentation](https://u-boot.readthedocs.io/en/latest/board/amlogic/odroid-c4.html)

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
