<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi 5 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi 5 family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Raspberry_Pi_5,_8_GB_RAM.jpg" title="A Raspberry Pi 5." width="256" />
<figcaption>A Raspberry Pi 5.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Raspberry Pi Ltd</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Stock boot method</p></td>
<td><p>Raspberry Pi EEPROM and firmware, U-Boot, and extlinux from microSD</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2712</p></td>
</tr>
<tr>
<td><p>Variants</p></td>
<td><p>Pi 5, Pi 500, Pi 500+, CM5, and CM5 Lite</p></td>
</tr>
</tbody>
</table>

</div>

The generic AArch64 SD image on `nixos-unstable` supports the **Raspberry Pi 5**, Raspberry Pi 500, Raspberry Pi 500+, Compute Module 5, and Compute Module 5 Lite. NixOS 26.05 images do not include the required Pi 5-family boot files, so use an image from `nixos-unstable`.[^1] The stock image boots from microSD through Raspberry Pi firmware, U-Boot, and extlinux.

## Installation

Use the unstable generic AArch64 SD image described on the <a href="NixOS_on_ARM/Raspberry_Pi#Installation" class="wikilink" title="family page">family page</a>. The image contains the device trees used by Raspberry Pi 5, Raspberry Pi 500, Raspberry Pi 500+, Compute Module 5, and Compute Module 5 Lite, together with a single 64-bit U-Boot binary for Raspberry Pi boards.[^2] Raspberry Pi 500 and Raspberry Pi 500+ share board type `0x19`, for which U-Boot selects `bcm2712-rpi-500.dtb`.[^3][^4] In a flake, import `nixos-hardware.nixosModules.raspberry-pi-5`. With channels, import `<nixos-hardware/raspberry-pi/5>`. The family page explains that a profile does not create an image or stage U-Boot.

## Kernel and hardware defaults

The profile selects a pinned kernel from Raspberry Pi's downstream Linux tree and limits device trees to BCM2712 Raspberry Pi boards. Its initrd includes NVMe, BCM2712 PCIe, RP1 clock, and support for the RP1 multifunction device. It disables GRUB and enables extlinux generation.[^5]

See <a href="NixOS_on_ARM/Raspberry_Pi#Board_profiles" class="wikilink" title="Board profiles">Board profiles</a> for Wi-Fi firmware requirements on custom systems.

### Graphics

The shared profile defaults request full VC4 KMS. For Xorg, the Pi 5 profile marks the VC4 modesetting device as the primary GPU. This configuration has not been tested with RP1-connected DPI, composite, or MIPI DSI displays.[^6] HDMI and other VC4 display configurations use `vc4-kms-v3d`. They do not require `vc4-kms-v3d-pi5`.

## Storage

The Pi 5 profile prepares Linux and the initrd to use PCIe and NVMe. This allows a system to load U-Boot, the kernel, and the initrd from microSD, then mount its root filesystem from NVMe.

This Linux support does not mean that released U-Boot can load the NixOS boot files from NVMe. In U-Boot v2026.07, `rpi_arm64_defconfig` enables PCIe enumeration but does not set `CONFIG_NVME_PCI` or run `nvme scan`.[^7] Its NVMe driver also lacks the PCIe inbound DMA address translation required on Pi 5. A July 2026 patch series proposes those changes, but they are not part of v2026.07.[^8]

The Pi EEPROM can discover NVMe media and may load `u-boot.bin` from it. Released U-Boot cannot then continue the normal extlinux flow from that device. Updating only the EEPROM does not remove this limitation. The stock U-Boot v2026.07 chain therefore does not support complete NVMe boot.

## Serial console

Pi 5 exposes its primary UART through the dedicated debug connector. Linux names the hardware device `/dev/ttyAMA10`, and `/dev/serial0` points to it.[^9]

The profile sets `enable_uart=0` for Pi 5 to prevent ghost UART input from interrupting U-Boot on affected boards.[^10] This example enables a serial console:

``` nix
{ lib, ... }:
{
  hardware.raspberry-pi.configtxt.settings.pi5.enable_uart = lib.mkForce true;
  boot.kernelParams = [ "console=ttyAMA10,115200n8" ];
}
```

Test U-Boot interaction after enabling the UART, and use a 3.3 V adapter designed for the Pi 5 debug connector.

## Power and cooling

Raspberry Pi recommends its 27 W USB-C supply for Pi 5. A 5 V, 3 A supply can boot the board, but it reduces the current available to USB devices and fan peripherals. Without a heatsink or fan, the Pi 5 may thermally throttle under sustained load.[^11]

## Alternative implementation

The <a href="NixOS_on_ARM/Raspberry_Pi#Alternative_implementations" class="wikilink" title="family page">family page</a> describes the [nvmd/nixos-raspberrypi](https://github.com/nvmd/nixos-raspberrypi) flake. Its module names and `boot.loader.raspberry-pi` options are not Nixpkgs or `nixos-hardware` APIs.

## UEFI

The [worproject/rpi5-uefi](https://github.com/worproject/rpi5-uefi) EDK2 port is an advanced alternative to U-Boot. The project was archived in February 2025 and is no longer maintained. Its support notice says that the final release was tested on early BCM2712C1 boards and reports problems with D0 boards and newer EEPROM firmware. It is therefore not the default Pi 5 installation path. For experiments, follow the archived project's limitations and the <a href="NixOS_on_ARM/UEFI" class="wikilink" title="general ARM UEFI instructions">general ARM UEFI instructions</a>.

## See also

- <a href="NixOS_on_ARM/Raspberry_Pi" class="wikilink" title="NixOS on ARM/Raspberry Pi">NixOS on ARM/Raspberry Pi</a>
- <a href="NixOS_on_ARM/Installation" class="wikilink" title="NixOS on ARM/Installation">NixOS on ARM/Installation</a>
- [Raspberry Pi NVMe documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#nvme-ssd-boot)

## References

<references />

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>

[^1]: [nixpkgs PR \#537862: sd-image-aarch64: support rpi5](https://github.com/NixOS/nixpkgs/pull/537862)

[^2]: [Nixpkgs generic AArch64 SD image module](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/installer/sd-card/sd-image-aarch64.nix)

[^3]: [Raspberry Pi revision codes](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#new-style-revision-codes)

[^4]: [U-Boot v2026.07 Raspberry Pi model table](https://github.com/u-boot/u-boot/blob/v2026.07/board/raspberrypi/rpi/rpi.c)

[^5]: [nixos-hardware Raspberry Pi 5 profile](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/5/default.nix)

[^6]:

[^7]: [U-Boot v2026.07 rpi_arm64_defconfig](https://github.com/u-boot/u-boot/blob/v2026.07/configs/rpi_arm64_defconfig)

[^8]: [U-Boot patch series: Fix NVMe, not only on Raspberry Pi 5](https://lists.denx.de/pipermail/u-boot/2026-July/624063.html)

[^9]: [Raspberry Pi UART documentation](https://www.raspberrypi.com/documentation/computers/configuration.html#configure-uarts)

[^10]: [nixos-hardware Raspberry Pi config.txt defaults](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/common/config-txt-defaults.nix)

[^11]: [Raspberry Pi power-supply documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#power-supply)
