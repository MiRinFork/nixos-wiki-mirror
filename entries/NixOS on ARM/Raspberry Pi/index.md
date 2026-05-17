<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi Family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="raspberry_pi_3_glamour.jpg" title="A Raspberry Pi 3 with enclosure." width="256" />
<figcaption>A Raspberry Pi 3 with enclosure.</figcaption>
</figure></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv6</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 2</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv7</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 3</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64 + ARMv7</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 4</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64 + ARMv7</p></td>
</tr>
<tr>
<td colspan="2"><p>Raspberry Pi 5</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64 + ARMv7</p></td>
</tr>
</tbody>
</table>

</div>

The Raspberry Pi family of devices is a series of single-board computers made by the Raspberry Pi Foundation. They are all based on Broadcom System-on-a-chip (SOCs).

## Status

Only the *Raspberry Pi 3 Family* is supported upstream, with the AArch64 effort. Other Raspberry Pis are part of **@dezgeg**'s porting efforts to ARMv6 and ARMv7.

The Linux kernel in use, except for the Raspberry Pi 1 family, is the mainline Linux kernel, and not the Raspberry Pi Foundation's fork. This could reduce compatibility with some add-on boards or third-party libraries<sup>\[expanded explanation needed\]</sup>.

The following table is intended to be updated by the NixOS contributors with the current status of the boards. For a list of products, \[<https://www.raspberrypi.org/products/> see the *Products Archive\]*.

<table>
<thead>
<tr>
<th><p>Board name</p></th>
<th><p>Architecture</p></th>
<th><p>Support</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="3" style="text-align: left;"><p>Raspberry Pi 1</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 1 Model B</p></td>
<td rowspan="5" style="vertical-align: middle;"><p>armv6</p></td>
<td><p>C</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 1 Model A+</p></td>
<td><p>C*</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 1 Model B+</p></td>
<td><p>C</p></td>
</tr>
<tr>
<td><p>Raspberry Pi Zero</p></td>
<td><p>C*</p></td>
</tr>
<tr>
<td><p>Raspberry Pi Zero W</p></td>
<td><p>C</p></td>
</tr>
<tr>
<td colspan="3" style="text-align: left;"><p>Raspberry Pi 2</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 2 Model B</p></td>
<td><p>armv7</p></td>
<td><p>C</p></td>
</tr>
<tr>
<td colspan="3" style="text-align: left;"><p>Raspberry Pi 3</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 3 Model B</p></td>
<td rowspan="3" style="vertical-align: middle;"><p>AArch64<br />
<em>+ armv7</em></p></td>
<td><p>YES</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 3 Model B+</p></td>
<td><p>YES</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 3 Model A+</p></td>
<td><p>?</p></td>
</tr>
<tr>
<td colspan="3" style="text-align: left;"><p>Raspberry Pi 4</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 4 Model B</p></td>
<td><p>AArch64<br />
<em>+ armv7</em></p></td>
<td><p>YES</p></td>
</tr>
<tr>
<td colspan="3" style="text-align: left;"><p>Raspberry Pi 400</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 400</p></td>
<td><p>AArch64<br />
<em>+ armv7</em></p></td>
<td><p>Yes (only with kernel &gt;= 6.1)</p></td>
</tr>
<tr>
<td colspan="3"><p>Raspberry Pi 5</p></td>
</tr>
<tr>
<td><p>Raspberry Pi 5</p></td>
<td><p>AArch64<br />
<em>+ armv7</em></p></td>
<td><p>C*</p></td>
</tr>
</tbody>
</table>

*Support*

- YES: Supported architecture by Nixpkgs downstream and tested to be working.
- C: Community supported, and tested to be working.
- C\*: Community supported, unverified but should be working.
- ? : Unverified, unknown if it will work.

The Raspberry Pi 3 Family is only supported as **AArch64**. Use as armv7 is community supported.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image and install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

### Raspberry Pi (1)

The ARMv6 image boots out-of-the-box.

### Raspberry Pi 2

The ARMv7 image should boot out-of-the-box, though the author hasn't personally tested this.

### Raspberry Pi 3 / 3B+

Both the AArch64 and ARMv7 images boot out-of-the-box. Using the 64-bit AArch64 image is highly recommended, as the availability of binaries is much better and allows the use of the 64-bit instruction set.

For the UART console, edit `/extlinux/extlinux.conf` on the boot partition of the SD card to set `console=ttyS1,115200n8` in the kernel boot parameters, and use the following GPIO Pins with an USB-TTL connector:

    GND         - 3rd in top row, black cable
    GPIO 14 TXD - 4th in top row, white cable
    GPIO 15 RXD - 5th in top row, green cable

Use `nix-shell -p screen --run "screen /dev/ttyUSB0 115200"` to connect to the console.

``` nix
{
  hardware.enableRedistributableFirmware = true;
  networking.wireless.enable = true;
}
```

#### HDMI output issue with kernel 5.4 (NixOS 20.03 or NixOS unstable)

(Unverified for 5.5 or 5.6)

Some users have reported that the 5.4 kernel "hung at Starting kernel..." . In all cases where it was possible to investigate, it was found that the device did boot, but that the HDMI out didn't function as expected.

It looks like it may be a setup-dependent issue, as a 20.03 image with 5.4 was verified as working.

If your setup is having the issue, first report on with the Raspberry Pi model (important to note whether it is a plus or non-plus) and the kind of display used with the HDMI out, including whether it is using adapters or not.

Then, you can work around the issue by configuring your system to use the 4.19 kernel (previous LTS) using one of the following tricks.

1.  Use the serial console to configure the system, and `nixos-rebuild boot` it.
2.  Use a 19.09 image, specify the kernel in its configuration and upgrade to 20.03
3.  Boot the image, poweroff blindly using a keyboard, edit on another computer `/home/nixos/.ssh/authorized_keys` from the SD to add your key file, chmod as 600, unmount, boot the Raspberry Pi and find it on your network by some means.

<!-- -->

    {
      boot.kernelPackages = pkgs.linuxPackages_4_19;
    }

### Raspberry Pi 4

*See* <a href="NixOS_on_ARM/Raspberry_Pi_4" class="wikilink" title="NixOS on ARM/Raspberry Pi 4">NixOS on ARM/Raspberry Pi 4</a>

### Raspberry Pi 5

*See* <a href="NixOS_on_ARM/Raspberry_Pi_5" class="wikilink" title="NixOS on ARM/Raspberry Pi 5">NixOS on ARM/Raspberry Pi 5</a>

## Audio

In addition to the usual config, it might be required to enable audio support explicitly in the firmwareConfig.

## Serial console

Your `configuration.nix` will need to add `console=ttyS1,115200n8` to the `boot.kernelParams` configuration to use the serial console.

If the Raspberry Pi downstream kernel is used the serial interface is named `serial0` instead.

## Bluetooth

The bluetooth controller is by default connected via a UART device (`/dev/ttyAMA0` on the RPi4) and needs to be enabled through `btattach`:

## Camera

For the camera to work, you will need to add the following code to your configuration.nix:

To make the camera available as v4l device under `/dev/video0` the `bcm2835-v4l2` kernel module need to be loaded. This can be done by adding the following code to your configuration.nix:

## Binary Cache

Depending on the architecture used, binary caches availability varies. Binary caches instructions are on the main <a href="NixOS_on_ARM#Binary_cache" class="wikilink" title="NixOS on ARM">NixOS on ARM</a> page. The following table describes the architectures supported by each board.

<table>
<thead>
<tr>
<th><p>Raspberry Pi 1</p></th>
<th><p>armv6</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Raspberry Pi 2</p></td>
<td><p>armv7</p></td>
</tr>
<tr>
<td rowspan="2" style="vertical-align: middle;"><p>Raspberry Pi 3</p></td>
<td><p>armv7</p></td>
</tr>
<tr>
<td><p>AArch64</p></td>
</tr>
<tr>
<td rowspan="2" style="vertical-align: middle;"><p>Raspberry Pi 4</p></td>
<td><p>armv7</p></td>
</tr>
<tr>
<td><p>AArch64</p></td>
</tr>
</tbody>
</table>

## Kernel selection

By default NixOS uses the official Linux kernel released by kernel.org (a "mainline" kernel, e.g. `pkgs.linuxPackages`). This works fine on a Raspberry Pi, and is the better-tested option.

It is also possible to use a kernel released by the Raspberry Pi Foundation (a "vendor" kernel, e.g. `pkgs.linuxPackages_rpi3`). This may be preferable if you're using an add-on board that the mainline kernel does not have drivers for.

You can select your kernel by setting `boot.kernelPackages`.

## Notes about the boot process

The Raspberry Pi's stage 1 bootloader (in ROM) loads the stage 2 bootloader (bootcode.bin) from the first VFAT partition on the SD card. The NixOS aarch64 SD card image includes a VFAT partition (labelled `FIRMWARE`) with the stage 2 bootloader and configuration that loads U-Boot. U-Boot then continues from the second partition (labelled `NIXOS_SD`).

It takes approximately 1 minute to boot a Pi 3B.

There are 2 primary options for booting a Raspberry Pi:

### Boot option 1: `boot.loader.generic-extlinux-compatible`

This configuration is the most similar to the way that NixOS works on other devices. The downside is that NixOS won't attempt to manage anything associated with the first and second stage bootloaders (e.g. config.txt).

You can feel better about this by thinking about this configuration as similar to BIOS settings.

``` nix
boot.loader.grub.enable = false;
boot.loader.generic-extlinux-compatible.enable = true;
```

### Boot option 2: `boot.loader.raspberryPi`

This configuration assumes that the VFAT firmware partition is mounted to /boot. If it isn't, options like `boot.loader.raspberryPi.firmwareConfig` will write their configuration to the wrong partition and have no effect.

``` nix
boot.loader.grub.enable = false;
boot.loader.raspberryPi.enable = true;
boot.loader.raspberryPi.uboot.enable = true;
```

### Raspberry Pi (all versions)

USB keyboards and HDMI displays should work, though some issues have been reported (see Troubleshooting below).

Using the 3.3v serial port via the pin headers (exact location depends on hardware version) will get u-boot output and, when configured, a Linux kernel console.

## Device trees

Raspberry Pi add-on hardware often requires a device tree overlay. On other OSes this is usually set up using a `dtoverlay=` option in config.txt on the firmware partition. This approach can be made to work on NixOS with some combination of bootloader and kernel, but it may be easier and more explicit to use NixOS' `hardware.deviceTree` option to compile the overlay directly into the device tree.

A device tree config looks something like this:

``` nix
hardware.deviceTree = {
    enable = true;
    overlays = [
      {
        name = "hifiberry-dacplus";
        dtsText = ''
/dts-v1/;
/plugin/;
/ {
       compatible = "brcm,bcm2835";

// ... etc.
'';
      };
    ];
  };
```

This will apply the overlay to all `.dtb` files with a matching `compatible` line.

After rebooting you can check if the overlay has been applied by looking for it in the output of `dtc --sort /proc/device-tree`.

dtoverlay may fail with `FDT_ERR_NOTFOUND` on some Raspberry Pi device tree overlays. In this case dtmerge should be used instead. There is a Nix overlay to use dtmerge for applying device tree overlays: <https://github.com/NixOS/nixos-hardware/blob/429f232fe1dc398c5afea19a51aad6931ee0fb89/raspberry-pi/4/apply-overlays-dtmerge.nix>

## Troubleshooting

### Power issues

Especially with the power-hungry Raspberry Pi 3, it is important to have a [sufficient enough power supply](https://www.raspberrypi.org/documentation/hardware/raspberrypi/power/README.md) or unexpected behaviour may occur; this may include:

- Lightning bolt on HDMI output "breaking" the display.
- Screen switching back to u-boot text
  - Fixable temporarily when power is sufficient by switching VT (alt+F2 / alt+F1)
- Random hangs

This is a hard problem. It is caused by the Raspberry Pi warning about power issues, but the current drivers (as of Linux 4.14) have a hard time dealing with it properly. If the power supply is rated properly AND the cable is not incurring too much power losses, it may be required to disable the lightning bolt indicator so the display driver isn't messed up.[^1] The lightning bolt indicator can be disabled by adding the line `avoid_warnings=1` in config.txt[^2]

### WiFi / WLAN

For a possible solution to 802.11 wireless connectivity issues, see: <https://github.com/NixOS/nixpkgs/issues/82462#issuecomment-604634627>

### HDMI

HDMI issues have been observed on the 18.09 AArch64 image. The display would hang on "Starting Kernel...", then act as if the HDMI cable was unplugged. Re-plugging the HDMI cable after boot fixed the issue, as did a different monitor and HDMI cable.

#### Early boot messages

To show boot messages from initrd with the mainline kernel, add this to `configuration.nix`.

``` nix
{
  boot.initrd.kernelModules = [ "vc4" "bcm2835_dma" "i2c_bcm2835" ];
}
```

### Raspberry Pi 3B+ HDMI output issues

As of 2019/08/19, the u-boot build and kernel build can disagree about the name of the dtb file for the Raspberry Pi 3B+. This happens because the upstream filename has changed, and the built u-boot has hardcoded expectations for the filename to load.

For now, do not use `linuxPackages_latest`, use the default `linuxPackages` which is the latest LTS, 4.19, which is known to be compatible.

See .

### Additional Troubleshooting

Additional troubleshooting information may be found [at elinux.org](https://elinux.org/R-Pi_Troubleshooting).

<hr />

[^1]: <https://logs.nix.samueldr.com/nixos/2017-12-20#1513784657-1513784714>;

[^2]: <https://www.raspberrypi.org/documentation/configuration/config-txt/README.md>
