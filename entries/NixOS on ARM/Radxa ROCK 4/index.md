<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Radxa ROCK 4 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p><a href="https://radxa.com/products/rock4/">Radxa ROCK 4</a></p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Radxa_ROCK_4BP.jpg" title="Radxa Rock 4" width="256" />
<figcaption>Radxa Rock 4</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p><a href="https://radxa.com/">Radxa</a></p></td>
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
<td><p>Boot order</p></td>
<td><p>SPI NOR Flash, eMMC, SD</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="https://github.com/msgilligan">msgilligan</a></p></td>
</tr>
</tbody>
</table>

</div>

The [Radxa ROCK 4B+](https://radxa.com/products/rock4/4bp) is a Single-Board Computer with a Rockchip RK3399 SoC.

- **CPU**: ARM Cortex-A72 and Cortex-A53
- **GPU**: Mali-T860 MP4
- **RAM**: 2GB/4GB LPDDR4
- **MMC**: eMMC Connector for up to 128GB
- **NET**: 1 Gigabit Ethernet
- **USB**: 1x USB3 OTG/HOST Type-A, 1x USB 3 Type-A, 2x USB 2 Type-A
- **PCIe**: M.2 M Key M connector (4-lane PCIe 2.1) supports NVMe SSD

The [nixos-rockchip](https://github.com/nabam/nixos-rockchip) SD-card images have been tested with both the ROCK 4B+ and ROCK 4 SE variants.

## Status

Support of this system is YMMV (your mileage may vary).

U-Boot bootloaders are available in different variants:

- U-Boot
  - [Mainline](https://github.com/u-boot/u-boot/) - Supports ?? boot options
  - [Nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/pkgs/misc/uboot/default.nix) - tested by @ryjelsum, seemingly working but not thoroughly used

The official hardware documentation can be found [on the Radxa Documentation site](https://docs.radxa.com/en/rock4).

## Bootloader Firmware

### U-Boot Firmware

- `nixos-rockchip` uses the mainline U-Boot repository.
- As an alternative for using nixos-rockchip, There is also support for ROCK 4 U-Boot in Nixpkgs.

This build of u-boot is built using the defconfig from u-boot's repositories, so it should be equivalent to 'stock' u-boot, but be aware there may be unknown differences, as it has not been thoroughly tested. The following command will build the u-boot bootloader with Nix on a non-aarch64 system, and output its path as a 'result' symlink in the current directory:

`nix-build '`<nixpkgs>`' -A pkgsCross.aarch64-multiplatform.ubootRockPi4`

This will build u-boot as two separate files, `idbloader.img` and `u-boot.itb`. To flash the bootloader, follow the directions provided in u-boot's repos for [how to transfer these files to storage (SD card or EMMC) for usage](https://github.com/u-boot/u-boot/blob/af69289d61876d8e62449ee2da2dc6683bcb8198/doc/README.rockchip#L486).

`sudo dd if=idbloader.img of=/dev/sdc seek=64; sudo dd if=u-boot.itb of=/dev/sdc seek=16384`

After this, take special care to leave the first ~16mb of the target disk unpartitioned during installation, as this will contain u-boot and overwriting this region will overwrite the bootloader.

The stock UEFI ISO boots fine for installation purposes. If you wish to flash directly to SD/EMMC, the extlinux 'sdimage' may require a minor u-boot env change (`env set ramdisk_addr_r 0x06800000`, `env save`) in order to boot, but should work after this change has been made.

#### SPI flash installation from SD card

In Nixpkgs only SD card binaries are built by default. To get U-Boot binary for SPI flash and change other relevant settings the image needs to be built with overrides. To include `u-boot-rockchip-spi.bin` in `result/` folder it needs to added to the `filesToInstall`. Also included here is `u-boot-rockchip.bin` which includes `idbloader.img` and `u-boot.itb` in a single file.

By default this image is meant for Rock (Pi) 4A board. You might want to change this to another Rock 4 family board like Rock (Pi) 4C by setting `defconfig` to be `"rock-pi-4c-rk3399_defconfig"` or Rock 4SE with `"rock-4se-rk3399_defconfig"`. Another option is `extraConfig` where you can add overrides of defconfigs for example to use Rock (Pi) 4A defconfig but change device tree path to plus version of the boards by changing `CONFIG_DEFAULT_DEVICE_TREE` and `CONFIG_DEFAULT_FDT_FILE`.

Lastly at least on Rock (Pi) 4C there seems to be an issue upstream with a diagnostic blue LED turned on preventing SPI flash access. Here is a patch included to fix this in `extraPatches`.

``` bash
nix-build -E "
with import <nixpkgs> { };
pkgsCross.aarch64-multiplatform.ubootRockPi4.override {
  defconfig = \"rock-pi-4c-rk3399_defconfig\";
  filesToInstall = [ \"u-boot-rockchip.bin\" \"u-boot-rockchip-spi.bin\" ];
  extraPatches = [ (fetchpatch {
    url=\"https://gist.githubusercontent.com/Diamondtroller/e82d1c4a8b55beac26cc38209414a8b8/raw/ae4795cd4bf690c575fafa6b98714c47d548da1d/spi.patch\";
    hash=\"sha256-rEbmywPeOR5smIRhYUwcsfPeK+LiEMO2b3lmwrnJ+k4=\";
    }) ];
}"
```

After building U-Boot images SD card needs to be modified to have two partitions. One partition is meant for U-Boot, which will be the environment to flash the SPI chip, while second partition will contain the U-Boot binary file suitable for SPI chip. Create file system for second partition. Start of the first partition shouldn't be changed, other values can be changed as long as the files fit.

``` bash
echo -e 'label: gpt\nunit: sectors\nsector-size: 512\nfirst-lba:64\n\nstart=64, size=16M, name="U-Boot"\nsize=8M, name="Payload"' | sudo sfdisk /dev/mmcblk0
sudo mkfs.ext4 /dev/mmcblk0p2
```

Here are provided commands to copy the file to the second partition.

``` bash
mkdir /tmp/mnt
sudo mount /dev/mmcblk0p2 /tmp/mnt
sudo cp result/u-boot-rockchip-spi.bin /tmp/mnt
sudo umount /dev/mmcblk0p2
```

And here is the command to write U-Boot to the first partition.

``` bash
sudo dd if=result/u-boot-rockchip.bin of=/dev/mmcblk0p1 bs=1M
```

Insert the SD card into your board and boot into it. In case where you have corrupted or non-booting U-Boot in the flash you need to short SPI clock pin. Pin 25 is the ground pin and pin 23 is the SPI clock pin, connect those. You can see diagram of pins in [official docs](https://docs.radxa.com/en/rock4/hardware/rock4-gpio). However when you have booted into the U-Boot on SD card, this wire should be removed to access the flash. The idea is to prevent BootROM from trying to boot off of SPI flash. You can read about bootflow more in [Rockchip wiki](https://opensource.rock-chips.com/wiki_Boot_option#Boot_flow). When the board has booted into U-Boot enter these commands based on [U-Boot docs](https://docs.u-boot.org/en/latest/board/rockchip/rockchip.html#spi):

1.  probe the SPI flash for reading and writing, you should get SF: followed by info about SPI flash chip.
2.  load u-boot-rockchip-spi.bin file from mmc (SD card) on bus 1, partition 2 to the memory just after U-Boot.
3.  write to the SPI flash the contents of the file which are loaded into the memory.

<!-- -->

    => sf probe
    => load mmc 1:2 $kernel_addr_r u-boot-rockchip-spi.bin
    => sf update $fileaddr 0 $filesize

## System configuration

The following directions are for usage with `nixos-rockchip`.

Use the instructions in the [README](https://github.com/nabam/nixos-rockchip/blob/main/README.md).

Use the following command to build the Rock 4B image:

``` bash
nix build .#RadxaRock4
```

or for the Rock 4SE:

``` bash
nix build .#RadxaRock4SE
```

### nabam/nixos-rockchip GitHub Project

[nabam/nixos-rockchip](https://github.com/nabam/nixos-rockchip) is a Nix flake for building several Rockchip SBC images, including Rock 4B and Rock 4SE.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
