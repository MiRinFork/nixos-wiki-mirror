<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi 3 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi 3 Family</p></th>
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
<td><p>Manufacturer</p></td>
<td><p>Raspberry Pi Foundation</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Custom or U-Boot</p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>SD, USB*</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 3B</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2837</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 3B+</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2837B0</p></td>
</tr>
</tbody>
</table>

</div>

The Raspberry Pi family of devices is a series of single-board computers made by the Raspberry Pi Foundation. They are all based on Broadcom System-on-a-chip (SOCs).

## Status

The default Linux kernel in use, is the mainline Linux kernel, and not the Raspberry Pi Foundation's fork. This could reduce compatibility with some add-on boards or third-party libraries<sup>\[expanded explanation needed\]</sup>.

The Raspberry Pi 3 Family is only supported as **AArch64**. Use as armv7 is community supported.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image and install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

### Raspberry Pi 3B and 3B+

Both the AArch64 and ARMv7 images boot out-of-the-box. Using the 64-bit AArch64 image is highly recommended, as the availability of binaries is much better and allows the use of the 64-bit instruction set.

For the UART console, edit `/extlinux/extlinux.conf` on the main partition of the SD card to set `console=ttyS1,115200n8` in the kernel boot parameters, making sure to replace the existing `console=ttyS0,115200n8` parameter. Use the following GPIO Pins with an USB-TTL connector:

    GND         - 3rd in top row, black cable
    GPIO 14 TXD - 4th in top row, white cable
    GPIO 15 RXD - 5th in top row, green cable

Use `nix-shell -p screen --run "screen /dev/ttyUSB0 115200"` (or `nix run nixpkgs#screen -- /dev/ttyUSB0 115200` if you're using nix flakes) to connect to the console.

``` nix
{
  hardware.enableRedistributableFirmware = true;
  networking.wireless.enable = true;
}
```

## Tools

The raspberry tools are available in the `libraspberrypi` package and include commands like `vcgencmd` to measure temperature and CPU frequency.

## Audio

In addition to the usual config, you will need to enable audio support explicitly in the firmwareConfig.

## Serial console

Your `configuration.nix` will need to add `console=ttyS1,115200n8` to the `boot.kernelParams` configuration to use the serial console.

If the Raspberry Pi downstream kernel is used the serial interface is named `serial0` instead.

### Early boot

Raspberry Pi 3's UART rate is tied to the GPU core frequency, set by default to 400MHz on Raspberry Pi 3 and later. This results in garbled serial output in bootloaders. Setting `core_freq=250` in `config.txt` solves this issue (as per [thread on the Raspberry Pi forum](https://forums.raspberrypi.com/viewtopic.php?p=942203#p942203)).

It can be done declaratively as such:

Note that this [may have a negative impact on performance](https://github.com/RealVNC/raspi-documentation/blob/fc6b4711f91791db7acd19ae743fcfddc9c89546/configuration/config-txt/overclocking.md#overclocking-options):

> Frequency of the GPU processor core in MHz. It has an impact on CPU performance because it drives the L2 cache and memory bus.

## Bluetooth

The bluetooth controller is by default connected to the UART device at `/dev/ttyAMA0` and needs to be enabled through `btattach`:

## Camera

For the camera to work, you will need to add the following code to your configuration.nix:

To make the camera available as v4l device under `/dev/video0` the `bcm2835-v4l2` kernel module need to be loaded. This can be done by adding the following code to your configuration.nix:

## Notes about the boot process

It takes approximately 1 minute to boot a Pi 3B.

USB keyboards and HDMI displays should work, though some issues have been reported (see Troubleshooting below).

Using the 3.3v serial port via the pin headers (exact location depends on hardware version) will get u-boot output and, when configured, a Linux kernel console.

### Updating U-Boot

[These steps can be followed to update the platform firmware.](https://github.com/NixOS/nixpkgs/issues/82455#issuecomment-959797355)

## Troubleshooting

### Power issues

Especially with the power-hungry Raspberry Pi 3, it is important to have a [sufficient enough power supply](https://www.raspberrypi.org/documentation/hardware/raspberrypi/power/README.md) or *weirdness* may happen. Weirdness may include:

- Lightning bolt on HDMI output "breaking" the display.
- Screen switching back to u-boot text
  - Fixable temporarily when power is sufficient by switching VT (alt+F2 / alt+F1)
- Random hangs

This problem is a hard problem. It is caused by the Raspberry Pi warning about power issues, but the current drivers (as of Linux 4.14) have a hard time dealing with it properly. If the power supply is rated properly AND the cable is not incurring too much power losses, it may be required to disable the lightning bolt indicator so the display driver isn't messed up.[^1] The lightning bolt indicator can be disabled by adding the line `avoid_warnings=1` in config.txt[^2]

### WiFi / WLAN

For a possible solution to 802.11 wireless connectivity issues, see: <https://github.com/NixOS/nixpkgs/issues/82462#issuecomment-604634627>

In case `wlan0` is missing, try overlaying an older `firmwareLinuxNonfree` confirmed to be working:

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

### HDMI output issue with kernel ~6.1 (NixOS 23.05 or NixOS unstable)

When using HDMI and hardware acceleration (e.g. Kodi), an application may fail to start and/or crash with a dmesg like:

    [232195.380745] [drm:vc4_bo_create [vc4]] *ERROR* Failed to allocate from CMA:
    [232195.380751] [drm]                         kernel:    432kb BOs (1)
    [232195.380755] [drm]                           dumb:  69064kb BOs (14)

    [306160.152488] cma: cma_alloc: alloc failed, req-size: 142 pages, ret: -16
    [306160.152498] [vc_sm_cma_ioctl_alloc]: dma_alloc_coherent alloc of 581632 bytes failed
    [306160.152501] [vc_sm_cma_ioctl_alloc]: something failed - cleanup. ret -12
    [317686.623989] [drm:vc4_bo_create [vc4]] *ERROR* Failed to allocate from CMA:
    [317686.623998] [drm]                           dumb:  74752kb BOs (16)

A workaround is to increase the pre-allocated CMA space (which, as of writing, defaults to 65M):

For more information see a post in raspberry pi forum[^3] and thios github issue[^4].

[^1]: <https://logs.nix.samueldr.com/nixos/2017-12-20#1513784657-1513784714>;

[^2]: <https://www.raspberrypi.org/documentation/configuration/config-txt/README.md>

[^3]: <https://forums.raspberrypi.com/viewtopic.php?t=285068>

[^4]: <https://github.com/raspberrypi/linux/issues/3861>
