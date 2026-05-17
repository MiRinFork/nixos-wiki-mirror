<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Radxa ROCK5 Model B -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p><a href="https://radxa.com/rock5b/">Radxa ROCK 5B</a></p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Radxa_ROCK_5B.jpg" title="Radxa R SBC" width="256" />
<figcaption>Radxa R SBC</figcaption>
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
<td><p>Vendor BSP</p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>SPI NOR Flash, eMMC, SD</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="https://github.com/jakubgs">jakubgs</a></p></td>
</tr>
</tbody>
</table>

</div>

The [Radxa ROCK 5B](https://wiki.radxa.com/Rock5/5B) is a Single-Board Computer with a Rockchip RK3588 SoC.

- **CPU**: ARM Cortex-A76 and Cortex-A55
- **GPU**: Mali-G610 MP4
- **RAM**: 4GB/8GB/16GB LPDDR4X at 2133MHz
- **MMC**: eMMC Connector for up to 512GB
- **NET**: 2.5 Gigabit Ethernet
- **USB**: 2x USB 3.1 Type-A, 2x USB 2.0 Type-A
- **PCIe**: M.2 Key E connector with PCIe 2.1 x1, M.2 Key M connector with PCIe 3.0 x4

## Status

Support of this system is YMMV (your mileage may vary), and depends on vendor-provided BSP (Board Support Package) based components.

Two kinds of bootloaders are available in different variants:

- U-Boot
  - [Mainline](https://github.com/u-boot/u-boot/) - Supports all storage boot options, including NVMe
  - [Vendor](https://dl.radxa.com/rock5/sw/images/loader/rock-5b/) - Works well for eMMC and SD card boot, not for NVMe.
  - [Not-TowBoot](https://github.com/samueldr/Tow-Boot/tree/wip/rock5-vendor) - Supports eMMC and SD card, NVMe sometimes.
    - Vendor U-Boot built using the TowBoot build infrastructure
- EDK2/TianoCore
  - [EDK2 UEFI Firmware](https://github.com/edk2-porting/edk2-rk3588) - Supports all storage boot options, including NVMe.

The official hardware documentation can be found [on the Radxa wiki](https://wiki.radxa.com/Rock5/hardware/5b).

## Bootloader Firmware

### Vendor U-Boot Firmware

Booting the system with the vendor-provided platform firmware may not work due to a [known issue in older U-Boot](https://github.com/samueldr/u-boot/commit/a0af72272b8db4b5d83df2f14ad950d3e30b3e04).

If using the vendor-provided platform firmware is desired, [renaming the kernel derivation to a shorter name](https://gitlab.com/K900/nix/-/blob/1ae5db476aee96fab9c445d7b690a8f5cf7fbe75/hacks/orangepi5/kernel/default.nix#L20) should allow boot to succeed.

### Community UEFI Firmware

The best available bootloader is [EDK2 UEFI firmware for Rockchip RK3588 platforms](https://github.com/edk2-porting/edk2-rk3588). The [v0.9.1](https://github.com/edk2-porting/edk2-rk3588/releases/tag/v0.9.1) release is confirmed working.

In order to flash this bootloader we'll need to download two files:

- [`rk3588_spl_loader_v1.15.113.bin`](https://dl.radxa.com/rock5/sw/images/loader/rock-5b/release/rk3588_spl_loader_v1.15.113.bin) - SPI bootloader image.
- [`rock-5b_UEFI_Release_v0.9.1.img`](https://github.com/edk2-porting/edk2-rk3588/releases/download/v0.9.1/rock-5b_UEFI_Release_v0.9.1.img) - UEFI bootloader image.

Then use the `rkdeveloptool` tool in version `1.32` or higher as described in [SPI flashing documentation](https://wiki.radxa.com/Rock5/install/spi):

``` bash
 > nix-shell -p rkdeveloptool

[nix-shell:~/rk3588]$ rkdeveloptool --version
rkdeveloptool ver 1.32

[nix-shell:~/rk3588]$ sudo rkdeveloptool db rk3588_spl_loader_v1.08.111.bin
Downloading bootloader succeeded.

[nix-shell:~/rk3588]$ sudo rkdeveloptool wl 0 rock-5b_UEFI_Release_v0.9.1.img
Write LBA from file (100%)

[nix-shell:~/rk3588]$ sudo rkdeveloptool rd
```

Now the device has a graphical bootloader available when pressing `Escape` at boot time:

<figure>
<img src="Radxa_ROCK_5B_UEFI_Firmware.png" title="NanoPi-R6C UEFI Firmware screen" width="600" />
<figcaption>NanoPi-R6C UEFI Firmware screen</figcaption>
</figure>

### Community U-Boot Firmware

A WIP tree to build U-Boot using the infrastructure for Tow-Boot is available. (The end-result is <em>not</em> a proper Tow-Boot build.)

- <https://github.com/samueldr/Tow-Boot/tree/wip/rock5-vendor>

This uses \[<https://github.com/u-boot/u-boot/compare/d892cca08d5da230a6690f504ba7a06044b840c8>...samueldr:u-boot:wip/rock5/not-tb-2023-03-30 a fork with some fixes\], so that an installation on the SPI Flash will work, and allow OS booting from NVMe, eMMC or SD. NVMe support may be YMMV depending on the specific hardware.

The [board-specific README](https://github.com/samueldr/Tow-Boot/blob/wip/rock5-vendor/boards/radxa-rock5b/README.md) has further notes.

Using from shared storage (SD, eMMC) or from SPI should work, and both are as supported.

To build:

``` bash
nix-build -A radxa-rock5b
```

The SD or eMMC shared storage image can be flashed as usual:

``` bash
dd if=shared.disk-image.img of=/dev/XXX bs=1M oflag=direct,sync status=progress
```

The SPI image <strong>cannot</strong> be installed using the usual installer. For now you should [follow the vendor instructions](https://wiki.radxa.com/Rock5/install/spi) to write the `binaries/Tow-Boot.spi.bin` file to SPI. In other words using `rkdeveloptool` for the installation, or any other way to write to SPI flash.

## System configuration

A [working bootloader configuration](https://github.com/jakubgs/nixos-config/blob/16cc3ccf5448259e6d88a24bdfa70ee2f455e200/hosts/arael/configuration.nix#L21-L33) looks like this:

``` nix
  boot.loader = {
    efi.canTouchEfiVariables = true;
    systemd-boot.enable = true;
    grub.enable = false;
  };
```

The current NixOS 23.05 release with 6.1 Linux kernel detects NVMe but not the eMMC.

### @aciceri's flake

Nix flake for building OS image: <https://github.com/aciceri/rock5b-nixos>

Flash result to a new second legacy bootable ext4 partition on the installation media

Boot into system:

``` bash
sudo nixos-rebuild switch --flake github:jonahbron/config/aciceri-rebooted-into-this#rock5b
```

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
