<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/ODROID-C2 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Hardkernel ODROID-C2</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="ODROID-C2.jpg" title="An ODROID-C2." width="256" />
<figcaption>An ODROID-C2.</figcaption>
</figure></td>
</tr>
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
<td><p>Upstream U-Boot</p></td>
</tr>
<tr>
<td><p>Boot options</p></td>
<td><p>SD, eMMC</p></td>
</tr>
</tbody>
</table>

</div>

## Status

Mainline kernel from NixOS has been reported as working[^1]. A non-specified build from mainline u-boot also has been reported to work.

## Board-specific installation notes

Note this assumes u-boot is in partition 1 of your board's connected eMMC. If you haven't done that yet, you can build it with nix and then write it this fusing script (using an emmc/usb adapter) [download and extract](http://mirror.archlinuxarm.org/aarch64/alarm/uboot-odroid-c2-mainline-2019.07-1-aarch64.pkg.tar.xz) (replace /dev/sdX with the device for the eMMC):

``` bash
nix-build '<nixpkgs>' -A pkgsCross.aarch64-multiplatform.ubootOdroidC2
cd result
bash /path/to/extracted/boot/sd_fusing.sh /dev/sdX
```

1.  Download the sd-image from Hydra at <https://hydra.nixos.org/job/nixos/release-22.05-aarch64/nixos.sd_image.aarch64-linux/latest>
2.  Copy it to the SD card
3.  Mount first partition to /mnt with `sudo mount /dev/mmcblk0p1 /mnt`
4.  Edit /mnt/extlinux/extlinux.conf and delete all the console=tty.... arguments in the APPEND line
5.  Add `console=ttyAML0,115200n8` to the end of the APPEND line

it will look something like this:

``` bash
$ cat  /mnt/extlinux/extlinux.conf
# Generated file, all changes will be lost on nixos-rebuild!

# Change this to e.g. nixos-42 to temporarily boot to an older configuration.
DEFAULT nixos-default

MENU TITLE ------------------------------------------------------------
TIMEOUT 30

LABEL nixos-default
  MENU LABEL NixOS - Default
  LINUX ../nixos/gz1chw67hj8fj2b3xdrkv1nxrv8jvdzv-linux-4.19.13-Image
  INITRD ../nixos/4gifkl2yv2g58nxmf6z68y42s70xrsg0-initrd-initrd
  FDTDIR ../nixos/gz1chw67hj8fj2b3xdrkv1nxrv8jvdzv-linux-4.19.13-dtbs
  APPEND systemConfig=/nix/store/...-nixos-system-nixos-xxx.xxx.xxx.xxx init=/nix/store/...-nixos-system-nixos-xx.xx.xxxx.xxx init loglevel=7 cma=32M console=ttyAML0,115200n8
```

and then boot the sdcard.

Once booted, partition your on-board emmc like:

    Device         Boot    Start      End  Sectors  Size Id Type
    /dev/mmcblk0p1          2048   264191   262144  128M  c W95 FAT32 (LBA)
    /dev/mmcblk0p2 *      264192 50595839 50331648   24G 83 Linux
    /dev/mmcblk0p3      50595840 61071359 10475520    5G 83 Linux

note \*\*p2\*\* is bootable.

``` console
$ mkfs.ext4 /dev/mmcblk0p2
$ mkswap /dev/mmcblk0p3
$ swapon /dev/mmcblk0p3
$ mount /dev/mmcblk0p2 /mnt
$ nixos-generate-config /mnt
$ nixos-install
$ reboot
```

## Serial console

I used minicom to access the serial console:

    $ cat /etc/minirc.odroid-c2 
    # Machine-generated file - use "minicom -s" to change parameters.
    pu port             /dev/ttyUSB0
    pu lock             /var/lock
    pu rtscts           No

then run `sudo minicom` to access the console.

## Xorg

Nixos 20.03 should install all modules needed for this to work but at least two changes should be made to the xorg configuration:

    services.xserver.videoDrivers = [ "modesetting"  ];
      services.xserver.extraConfig = ''
        Section "OutputClass"
            Identifier "Meson"
            MatchDriver "meson"
            Driver "modesetting"
            Option "PrimaryGPU" "true"
        EndSection
      '';

The HW cursor support was very laggy when tried on 20.03 so enabling the software cursor may be desired:

    services.xserver.deviceSection = "Option \"SWcursor\" \"on\"";

## Resources

- [Official product page](https://www.hardkernel.com/shop/odroid-c2/)
- NixOS Image Build for [Odroid-C2 by George Whewell](https://github.com/georgewhewell/nixos-nanopim3/blob/master/hardware/boards/odroid-c2.nix)

[^1]: <https://logs.nix.samueldr.com/nixos-aarch64/2018-01-25#863144>;
