<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/NanoPi-R6C -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>NanoPi-R6C &amp; NanoPi-R6S</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="NanoPi-R6C.jpg" title="NanoPi-R6C SBC" width="256" />
<figcaption>NanoPi-R6C SBC</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>FriendlyElec</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p><a href="https://github.com/edk2-porting/edk2-rk3588">EDK2 UEFI firmware for Rockchip RK3588 platforms</a> or <a href="https://github.com/friendlyarm/uboot-rockchip/tree/nanopi6-v2017.09">Original FriendlyARM U-Boot</a></p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>official: eMMC, SD Card</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="https://github.com/jakubgs">jakubgs</a></p></td>
</tr>
</tbody>
</table>

</div>

## Hardware

NanoPi-R6C and R6S are single board computers built around the Rockchip RK3588S SoC.

- **CPU**: ARM Cortex-A76 and Cortex-A55
- **GPU**: Mali-G610 MP4
- **RAM**: 4GB/8GB LPDDR4X at 2133MHz
- **MMC**: None or 32GB eMMC
- **NET**: Native Gigabit Ethernet, PCIe 2.5G Ethernet
- **USB**: 1x USB 3.0 Type-A, 1x USB 2.0 Type-A
- **PCIe**: 1x M.2 Key M connector with PCIe 2.1 x1

## Status

The board boots systems like [Armbian](https://www.armbian.com/nanopi-r6s/) from USB pendrive or microSD reader out of the box. But stock NixOS `arch64` images do not boot correctly due to lack of correct DTS file called `rockchip-nanopi6.dtb`. You can see details of research into the boot process [here](https://github.com/jakubgs/nixos-config/issues/3).

The official documentation, which is comprehensive, can be found on [the FriendlyElec wiki](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_R6C).

U-Boot for this board can be compiled from source, and an example of how that can be done with Nix is [here](https://github.com/jakubgs/nixos-config/blob/2452a88bf70815ba4380757612ce29d2a49da6bf/hosts/arael/uboot.nix). But the best way to manage booting on this device is using the [EDK2 UEFI firmware](https://github.com/edk2-porting/edk2-rk3588) which supports booting from all available storage options, including NVMe, and works well both with [standard NixOS ISO images](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal.aarch64-linux) as well as Armbian ones.

## Board Specific Installation Notes

### UEFI Firmware

Boot into a working Linux system, like [Armbian](https://www.armbian.com/nanopi-r6s/) using USB pendrive or SD Card, then simply write the [UEFI image](https://github.com/edk2-porting/edk2-rk3588/releases/download/v0.9.1/nanopi-r6c_UEFI_Release_v0.9.1.img) to the eMMC:

``` bash
wget https://github.com/edk2-porting/edk2-rk3588/releases/download/v0.9.1/nanopi-r6c_UEFI_Release_v0.9.1.img
sudo dd if=nanopi-r6c_UEFI_Release_v0.9.1.img of=/dev/mmcblk2 bs=1M
```

Once that has been done the UEFI firmware should be visible via UART console or over HDMI after reboot:

<figure>
<img src="NanoPi-R6C_UEFI_Firmware.png" title="NanoPi-R6C UEFI Firmware screen" width="600" />
<figcaption>NanoPi-R6C UEFI Firmware screen</figcaption>
</figure>

In **Boot Manager** You can select what device to boot from this time and in **Boot Maintenance Manager** You can configure permanent boot order.

Keep in mind this example uses the image for R6C and you'll need the right UEFI image for R6S.

### Booting NixOS

Since [EDK2 UEFI firmware does not support extlinux](https://github.com/edk2-porting/edk2-rk3588/issues/88) an [ISO `aarch64` image](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal.aarch64-linux) needs to be used to successfully boot NixOS.

Currently NixOS images can see the NVMe without issues, but eMMC storage is unavailable.

### Installing NixOS

A very basic partition layout could look like this:

``` bash
format() {
  DEV="${1}" # First argument is NVMe path.
  wipefs -a "${DEV}"
  parted -s --align optimal "${DEV}" -- mklabel gpt;
  parted -s --align optimal "${DEV}" -- mkpart 'EFI'  2MB   6GiB  set 1 esp on;
  parted -s --align optimal "${DEV}" -- mkpart 'SWAP' 6GiB  16GiB;
  parted -s --align optimal "${DEV}" -- mkpart 'ROOT' 16GiB '100%';
  parted -s --align optimal "${DEV}" -- print;
  mkswap    "${DEV}p2";
  mkfs.vfat "${DEV}p1";
  mkfs.ext4 "${DEV}p3";
}
```

Just call it it with `format /dev/nvme0n1` and then mount your partitions:

``` bash
swapon /dev/nvme0n1p2
mount  /dev/nvme0n1p3 /mnt
mkdir /mnt/boot
mount  /dev/nvme0n1p1 /mnt/boot
```

And you can continue with the installation as you normally would. A [working bootloader configuration](https://github.com/jakubgs/nixos-config/blob/16cc3ccf5448259e6d88a24bdfa70ee2f455e200/hosts/arael/configuration.nix#L21-L33) looks like this:

``` nix
  boot.loader = {
    efi.canTouchEfiVariables = true;
    systemd-boot.enable = true;
    grub.enable = false;
  };
```

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
