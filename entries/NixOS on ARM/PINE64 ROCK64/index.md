<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/PINE64 ROCK64 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>PINE64 ROCK64</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="ROCK64.jpg" title="A PINE64 Rock64." width="256" />
<figcaption>A PINE64 Rock64.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>PINE64 (Pine Microsystems Inc.)</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Upstream U-Boot</p></td>
</tr>
<tr>
<td><p>Boot options</p></td>
<td><p>microSD, eMMC, SPI NOR Flash</p></td>
</tr>
</tbody>
</table>

</div>

The ROCK64 is a single board computer built around the Rockchip RK3328 SoC.

There are three models of the board, with 1, 2 or 4 GB of RAM. It can boot from an microSD card or an eMMC. It also has a 128 Mbit SPI flash (not populated on recently manufactured boards) that can be used to store the bootloader.

## Status

This board has upstream U-Boot and kernel support, although the mainline kernel may still be missing some features. NixOS can be installed using manual partitioning and `nixos-install` or by modifying the aarch64 installation image as described in the next section.

U-Boot for this board is packaged in nixpkgs, and Hydra builds can be found here:

<https://hydra.nixos.org/job/nixpkgs/trunk/ubootRock64.aarch64-linux>

This bootloader is not entirely open, incorporating a binary blob for the tertiary program loader (TPL). If your have nix installed you can download the latest version with (This command also works on different architectures since it can be downloaded from the binary cache):

``` console
$ nix-build '<nixpkgs>' -A ubootRock64 --argstr system aarch64-linux
$ ls -la result
-r--r--r-- 2 root root    107683 Jan  1  1970 idbloader.img
dr-xr-xr-x 1 root root        40 Jan  1  1970 nix-support
-r--r--r-- 2 root root    789504 Jan  1  1970 u-boot.itb
```

## Board-specific installation notes

U-Boot needs to be copied to specific sectors on the microSD card, eMMC or image with `dd`. This can be done either by using a prebuilt image or by manually formatting the storage.

### Using Prebuilt Images

You can use [nixos-aarch64-images](https://github.com/Mic92/nixos-aarch64-images) to get an ROCK64 compatible disk image.

### Manually Formatting

To manually format your storage, first install the NIXOS ARM 64 image by following the instructions here. Download and flash the SD Card/SBC image to your SD Card

<a href="NixOS_on_ARM#SD_card_images_(SBCs_and_similar_platforms)" class="wikilink" title="NixOS_on_ARM#SD card images (SBCs and similar platforms)">NixOS_on_ARM#SD card images (SBCs and similar platforms)</a>

Next, download/build U-Boot for the board, and write `idbloader.img` and `u-boot.itb` to the storage. As mentioned previously, Hydra builds can be found here:

<https://hydra.nixos.org/job/nixpkgs/trunk/ubootRock64.aarch64-linux>

Replace in the command below `/dev/mmcblkX` with the correct device to the sdcard i.e. `/dev/mmcblk0`. You can use the `lsblk` command to get a list of all devices:

``` bash
dd if=idbloader.img of=/dev/mmcblkX conv=fsync,notrunc bs=512 seek=64
dd if=u-boot.itb of=/dev/mmcblkX conv=fsync,notrunc bs=512 seek=16384
```

This will make the first partition of the installation device unmountable and it can be deleted, but the space needs to be kept to not overwrite the bootloader with another filesystem.

### uboot Memory Issues

If you are facing memory issues, kernel panics, kernel oops or general system instability while using the uboot images above (especially with the Rock64 version 2), you can use the ubootRock64v2 image instead, which improves system stability by lowering the memory clock speed at the cost of memory bandwidth.

Hydra builds can be found here (note the v2) <https://hydra.nixos.org/job/nixpkgs/trunk/ubootRock64v2.aarch64-linux>

Simply follow the manual formatting instructions as above.

## Serial console

The ROCK64 uses a GPIO pinout compatible with the Raspberry Pi 2 and newer. This means that the following pins can be used to connect a serial adapter:

<table>
<thead>
<tr>
<th colspan="2" style="background: var(--color-inverted)"><p>Pi-2 Bus</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Pin</p></td>
<td><p>Function</p></td>
</tr>
<tr>
<td><p>6</p></td>
<td><p>GND</p></td>
</tr>
<tr>
<td><p>8</p></td>
<td><p>UART0_TX</p></td>
</tr>
<tr>
<td><p>10</p></td>
<td><p>UART0_RX</p></td>
</tr>
</tbody>
</table>

The serial console runs at 1500000 baud in the bootloader. When using the standard NixOS aarch64 sd image, set `console=tty1 console=ttyS2,1500000n8` as kernel option in `extlinux/extlinux.conf` on the boot partition of the sdimage to get a serial linux console (tty1 is for standard HDMI output and ttyS2 is for the serial, baud rate setting is optional, simple console=ttyS2 seems to be working fine too). For debugging, `console=uart8250,mmio32,0xff130000` should give you an early UART console, before the full serial console is up.

From the host computer run (update /dev/ttyUSB0 with your USB-to-serial device)

`minicom -b 1500000 -8 -D /dev/ttyUSB0 --color=on`

## Compatibility notes

|  |  |  |
|----|----|----|
|  | Mainline kernel | ayufan-rock64/linux-mainline-kernel |
| Ethernet | Works | Works |
| USB | As of 5.4, USB 3.0 does not work | Works |
| HDMI | Video works, Sound does not | Works |

### Downstream kernel

To use all hardware functionality, it is currently necessary to use a downstream kernel:

- [ayufan-rock64/linux-kernel](https://github.com/ayufan-rock64/linux-kernel) 4.4 based on Rockchip BSP
- [ayufan-rock64/linux-mainline-kernel](https://github.com/ayufan-rock64/linux-mainline-kernel) mainline based, with potentially fewer hardware features supported. This kernel is not based on a kernel stable branch, so it may have more bugs (unrelated to the hardware).

Mic92 has packaged the mainline kernel in his [NUR](https://github.com/nix-community/NUR) packages repository:

``` nix
 boot.kernelPackages = pkgs.nur.repos.mic92.linuxPackages_ayufan;
```

This provides sound over HDMI, which the default kernel does not.

### Initrd fails to unpack during boot

The old vendor U-Boot 2017.09 did not leave enough room between the kernel and initrd, causing recent kernels to overwrite the beginning of the initrd. This can be fixed by increasing `ramdisk_addr_r` in the U-Boot console, or using upstream U-Boot.

Here is how to achieve in the uboot console (hit enter during boot to access it):

    => print ramdisk_addr_r # this prints the old value
    ramdisk_addr_r=0x06000000
    => set ramdisk_addr_r 0x07000000 # this sets a new value
    => saveenv # this persist the the configuration
    => boot # than you can normally boot, if it still fails, you can try to increase the ramdisk_addr_r value further

## Video decoding

MPV has support for the rockchip hardware decoder, it is used by default when playing a file. Without this decoder videos will likely stutter during playing. To use his for example in [kodi](https://kodi.tv/), add the following configuration in `.kodi/userdata/playercorefactory.xml`

``` xml
<playercorefactory>
        <players>
                <player name="MPV" type="ExternalPlayer" audio="false" video="true">
                        <filename>mpv</filename>
                        <args>--fs=yes "{1}"</args>
                        <hidexbmc>true</hidexbmc>
                </player>
        </players>
        <rules action="prepend">
                <rule video="true" player="MPV"/>
        </rules>
</playercorefactory>
```

When using kodi it is also recommend to use kodi-wayland rather than the x11 variant to reduce the CPU usage. Mic92 has an [example configuration](https://github.com/Mic92/dotfiles/blob/d457b53a1c032b84147113b8cd1be1383facd68e/nixos/rock/modules/kodi.nix#L22).

## Resources

- [Official product page](https://pine64.org/devices/rock64/)
