<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Libre Computer ROC-RK3328-CC -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Libre Computer ROC-RK3328-CC</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="ROC-RK3328-CC.png" title="A Libre Computer ROC-RK3328-CC." width="256" />
<figcaption>A Libre Computer ROC-RK3328-CC.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Firefly for Libre Computer</p></td>
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

The ROC-RK3328-CC (Renegade) is a single board computer built around the Rockchip RK3328 SoC. It is very similar to the <a href="NixOS_on_ARM/PINE64_ROCK64" class="wikilink" title="ROCK64">ROCK64</a>.

There are three models of the board, with 1, 2 or 4 GB of RAM. It can boot from an microSD card or an eMMC. It also has a 128 Mbit SPI flash that can be used to store the bootloader.

## Status

This board has upstream U-Boot and kernel support, although the mainline kernel may still be missing some features. NixOS can be installed using manual partitioning and `nixos-install` or by modifying the aarch64 installation image as described in the next section.

U-Boot for this board is packaged in nixpkgs, and Hydra builds can be found here:

<https://hydra.nixos.org/job/nixpkgs/trunk/ubootRock64.aarch64-linux>

This bootloader is not entirely open, incorporating a binary blob for the tertiary program loader (TPL). If you have nix installed, you can download the latest version with (This command also works on different architectures since it can be downloaded from the binary cache):

``` console
$ nix-build '<nixpkgs>' -A ubootRock64 --argstr system aarch64-linux
$ ls -la result
-r--r--r-- 2 root root    107683 Jan  1  1970 idbloader.img
dr-xr-xr-x 1 root root        40 Jan  1  1970 nix-support
-r--r--r-- 2 root root    789504 Jan  1  1970 u-boot.itb
```

## Board-specific installation notes

U-Boot needs to be copied to specific sectors on the microSD card, eMMC or image with `dd`.

You can use [nixos-aarch64-images](https://github.com/Mic92/nixos-aarch64-images) to get an rock64 compatible disk image or running the commands manually.

Download/build U-Boot for the board, and write `idbloader.img` and `u-boot.itb`. Replace in the command below `/dev/mmcblkX` with the correct device to the sdcard i.e. `/dev/mmcblk0`. You can use the `lsblk` command to get a list of all devices:

``` bash
dd if=idbloader.img of=/dev/mmcblkX conv=fsync,notrunc bs=512 seek=64
dd if=u-boot.itb of=/dev/mmcblkX conv=fsync,notrunc bs=512 seek=16384
```

This will make the first partition of the installation device unmountable and it can be deleted, but the space needs to be kept to not overwrite the bootloader with another filesystem.

## Build your own image natively

You can customize image by using the following snippet.

``` nix
# save as sd-image.nix somewhere
{ ... }: {
  # only needed for crosscompilation
  nixpkgs.crossSystem = lib.systems.elaborate lib.systems.examples.aarch64-multiplatform;

  imports = [
    <nixpkgs/nixos/modules/installer/sd-card/sd-image-aarch64.nix>
  ];

  nixpkgs.config.allowUnfree = true; # needed for ubootRock64
  # at the time of writing the u-boot version from FireFly hasn't been successfully ported yet
  # so we use the one from Rock64
  sdImage.postBuildCommands = with pkgs; ''
    dd if=${ubootRock64}/idbloader.img of=$img conv=fsync,notrunc bs=512 seek=64
    dd if=${ubootRock64}/u-boot.itb of=$img conv=fsync,notrunc bs=512 seek=16384
  '';

  # put your own configuration here, for example ssh keys:
  users.extraUsers.root.openssh.authorizedKeys.keys = [
     "ssh-ed25519 AAAAC3NzaC1lZDI1.... username@tld"
  ];
}
```

Then build with:

``` shell
$ nix-build '<nixpkgs/nixos>' \
    -A config.system.build.sdImage \
    -I nixpkgs=https://github.com/NixOS/nixpkgs/archive/9bc841fec1c0e8b9772afa29f934d2c7ce57da8e.tar.gz \ # pinned to nixos-unstable on 2022-03-23
    -I nixos-config=./sd-image.nix
```

## USB

To enable USB power *GPIO1_D2* must be pulled high. D2 translates to 26 (D=4, 4\*8+2=26). Normally this is configured in the device tree, which gets loaded at boot time. At the time of writing, the ROC-RK3328-CC version of u-boot hasn't been ported to nixpkgs yet, so this is most easily done with the following systemd service.

``` nix
  systemd.services."usb-enable" = {
    enable = true;
    script = "${pkgs.libgpiod}/bin/gpioset 1 26=1";
    wantedBy = [ "default.target" ];
  };
```

## Serial console

The ROC-RK3328-CC uses a GPIO pinout compatible with the Raspberry Pi 2 and newer. This means that the following pins can be used to connect a serial adapter:

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

`nix-shell -p python3Packages.pyserial --run 'python3 -m serial.tools.miniterm --exit-char 24 --raw /dev/ttyUSB0 1500000'`

## Compatibility notes

|          |                                  |
|----------|----------------------------------|
|          | Mainline kernel                  |
| Ethernet | Works                            |
| USB      | As of 5.4, USB 3.0 does not work |
| HDMI     | Video works, Sound does not      |

## Resources

- [Official product page](https://www.libre.computer/products/rk3328/)
- [Official Getting Started Guide](https://roc-rk3328-cc.readthedocs.io/en/latest/intro.html)

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
