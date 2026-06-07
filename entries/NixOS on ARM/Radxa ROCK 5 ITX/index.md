<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Radxa ROCK 5 ITX -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p><a href="https://radxa.com/products/rock5/5itx">Radxa ROCK 5 ITX</a></p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Radxa_Rock_5_ITX.webp" title="Radxa R SBC" width="280" height="280" />
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
</tbody>
</table>

</div>

The [Radxa ROCK 5 ITX](https://docs.radxa.com/en/rock5/rock5itx) is a Single-Board Computer with a Rockchip RK3588 SoC.

- **CPU**: ARM Cortex-A76 and Cortex-A55
- **GPU**: Mali-G610MC4
- **RAM**: 4GB/8GB/16GB/32GB LPDDR5
- **MMC**: eMMC Connector
- **Storage**: 4x SATA Ports with Power Header
- **NET**: 2x 2.5 Gigabit Ethernet
- **USB**: 1x USB3.0 Type-C, 4x USB 3.0 Type-A, 2x USB 2.0 Type-A, 2x USB 2.0 Interface via Front USB header
- **PCIe**: M.2 Key M connector with PCIe 3.0 x2

## Status

Support of this system is YMMV (your mileage may vary), and depends on vendor-provided BSP (Board Support Package) based components.

Two kinds of bootloaders are available in different variants:

- U-Boot
  - [Mainline](https://github.com/u-boot/u-boot/)
  - [Vendor](https://dl.radxa.com/rock5/5itx/images/)
- EDK2/TianoCore
  - [EDK2 UEFI Firmware](https://github.com/edk2-porting/edk2-rk3588) - Recommended. Supports all storage boot options, including NVMe.

The official hardware documentation can be found [on the Radxa website](https://docs.radxa.com/en/rock5/rock5itx).

### Hardware status

- Video output is not supported by mainline kernel 6.12 or older when the device tree is loaded.
- USB to TTL serial cable is recommended for debugging purposes. Do not use `minicom` recommended by Radxa and instead use `screen /dev/ttyUSB0 1500000` for reliable UART connection.

## Bootloader Firmware

### Community UEFI Firmware

The best available bootloader is [EDK2 UEFI firmware for Rockchip RK3588 platforms](https://github.com/edk2-porting/edk2-rk3588). The [v0.11.2](https://github.com/edk2-porting/edk2-rk3588/releases/tag/v0.11.2) release is confirmed working.

In order to flash this bootloader we'll need to download two files:

- [`rk3588_spl_loader_v1.15.113.bin`](https://dl.radxa.com/rock5/sw/images/loader/rk3588_spl_loader_v1.15.113.bin) - SPI bootloader image.
- [`rock-5itx_UEFI_Release_v0.11.2.img`](https://github.com/edk2-porting/edk2-rk3588/releases/download/v0.11.2/rock-5-itx_UEFI_Release_v0.11.2.img) - UEFI bootloader image.

Then use the `rkdeveloptool` tool in as described in [SPI flashing documentation](https://docs.radxa.com/en/rock5/rock5itx/low-level-dev/maskrom/linux):

``` bash
 > nix-shell -p rkdeveloptool

[nix-shell:~/rk3588]$ sudo rkdeveloptool db rk3588_spl_loader_v1.15.113.bin
Downloading bootloader succeeded.

[nix-shell:~/rk3588]$ sudo rkdeveloptool wl 0 rock-5itx_UEFI_Release_v0.11.2.img
Write LBA from file (100%)

[nix-shell:~/rk3588]$ sudo rkdeveloptool rd
```

Now the device has a graphical bootloader available when pressing `Escape` at boot time:

## System configuration

### Installer ISO

A custom installer ISO is required to get video output for installation.

configuration.nix on x86 system:

`boot.binfmt.emulatedSystems = [ "aarch64-linux" ];`

iso.nix:

``` nix
{ pkgs, modulesPath, lib, ... }: {
  imports = [
    "${modulesPath}/installer/cd-dvd/installation-cd-minimal.nix"
  ];

  # use the latest Linux kernel
  boot.kernelPackages = pkgs.linuxPackages_latest;

  boot.initrd.kernelModules = [
    # Rockchip modules
    "rockchip_rga"
    "rockchip_saradc"
    "rockchip_thermal"
    "rockchipdrm"

    # GPU/Display modules
    "analogix_dp"
    "cec"
    "drm"
    "drm_kms_helper"
    "dw_hdmi"
    "dw_mipi_dsi"
    "gpu_sched"
    "panel_edp"
    "panel_simple"
    "panfrost"
    "pwm_bl"

    # USB / Type-C related modules
    "fusb302"
    "tcpm"
    "typec"

    # Misc. modules
    "cw2015_battery"
    "gpio_charger"
    "rtc_rk808"
  ];

  # kernelParams copy from Armbian's /boot/armbianEnv.txt & /boot/boot.cmd
  boot.kernelParams = [
    "rootwait"

    "earlycon" # enable early console, so we can see the boot messages via serial port / HDMI
    "consoleblank=0" # disable console blanking(screen saver)
    "console=ttyS2,1500000" # serial port
    "console=tty1" # HDMI
  ];

  # Needed for https://github.com/NixOS/nixpkgs/issues/58959
  boot.supportedFilesystems = lib.mkForce [ "btrfs" "reiserfs" "vfat" "f2fs" "xfs" "ntfs" "cifs" ];
}
```

Generate ISO:

``` bash
nix-shell -p nixos-generators --run "nixos-generate --format iso --system aarch64-linux --configuration ./iso.nix -o result"
```

### EDK2 settings

Enable Custom Device Tree mode by going to the configuration menu -\> `ACPI / Device Tree` and setting `Support DTB override & overlays` to `Enabled`.

### configuration.nix

``` nix
# Rock 5 ITX requires 6.12 or newer kernel
boot.kernelPackages = pkgs.linuxPackages_latest;
# Generate device tree into EFI partition
boot.loader.systemd-boot.extraFiles.${config.hardware.deviceTree.name} = "${config.hardware.deviceTree.package}/${config.hardware.deviceTree.name}";
hardware.deviceTree.enable = true;
hardware.deviceTree.name = "rockchip/rk3588-rock-5-itx.dtb";
hardware.deviceTree.filter = "*-rock-5-itx*.dtb";
boot.kernelParams = [ "dtb=/${config.hardware.deviceTree.name}" ];
```

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
