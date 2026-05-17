<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/PINE64 ROCKPro64 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>PINE64 ROCKPro64</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="ROCKPro64.jpg" title="A PINE64 ROCKPro64." width="256" />
<figcaption>A PINE64 ROCKPro64.</figcaption>
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

The ROCKPro64 is a powerful single board computer built around the Rockchip RK3399 SoC.

There are two models of the board, with 2 or 4 GB of RAM. It can boot from an microSD card or an eMMC. It also has a 128 Mbit SPI flash that can be used to store the bootloader.

## Status

This board has upstream U-Boot and kernel support, although the mainline kernel may still be missing some features. NixOS can be installed using manual partitioning and `nixos-install` or by modifying the aarch64 installation image as described in the next section.

U-Boot for this board is packaged in nixpkgs, and Hydra builds can be found here: <https://hydra.nixos.org/job/nixpkgs/trunk/ubootRockPro64.aarch64-linux>

It can also be <a href="NixOS_on_ARM#Compiling_through_binfmt_QEMU" class="wikilink" title=" cross compiled"> cross compiled</a> with

``` bash
nix-build '<nixpkgs>' --argstr system aarch64-linux -A ubootRockPro64 --out-link ubootRockPro64
```

## Board-specific installation notes

You can use [nixos-aarch64-images](https://github.com/Mic92/nixos-aarch64-images) to get an rockpro64 compatible disk image or running the commands manually as described below:

U-Boot needs to be copied to specific sectors on the microSD card, eMMC or image with `dd`. Download/build U-Boot for the board, and write `idbloader.img` and `u-boot.itb` to the correct locations with (replace `/dev/mmcblkX` with the correct path to the card or image):

``` bash
dd if=idbloader.img of=/dev/mmcblkX conv=fsync,notrunc bs=512 seek=64
dd if=u-boot.itb of=/dev/mmcblkX conv=fsync,notrunc bs=512 seek=16384
```

On many kernels, the ethernet driver cannot handle hardware check-summing of large packets, therefore this feature must be disabled for the ethernet to be stable. This can be done with the following NixOS configuration:

``` nix
networking.localCommands = ''
  ${pkgs.ethtool}/bin/ethtool -K eth0 rx off tx off
'';
```

## Serial console

The ROCKPro64 uses a GPIO pinout compatible with the Raspberry Pi 2 and newer. This means that the following pins can be used to connect a serial adapter:

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

See <https://wiki.pine64.org/wiki/ROCKPro64#GPIO_Pins> for list of all pins

The serial console runs at 1500000 baud in the bootloader.

To connect check your `dmesg` for an identifier of the serial console:

    [78635.965459] usb 2-1: new full-speed USB device number 8 using xhci_hcd
    [78636.119008] usb 2-1: New USB device found, idVendor=1a86, idProduct=7523, bcdDevice= 2.63
    [78636.119017] usb 2-1: New USB device strings: Mfr=0, Product=2, SerialNumber=0
    [78636.119022] usb 2-1: Product: USB2.0-Serial
    [78636.127103] ch341 2-1:1.0: ch341-uart converter detected
    [78636.142043] usb 2-1: ch341-uart converter now attached to ttyUSB0

In our example that coresponds to the `ttyUSB0` which makes a new device available at `/dev/ttyUSB0` to which you can connect using for (example) `picocom`:

``` console
# Connect to /dev/ttyUSB0 at baud 1500000
$ nix-shell -p picocom --run "picocom /dev/ttyUSB0 -b 1500000"
```

See <https://wiki.pine64.org/wiki/ROCKPro64#Setup_a_Serial_Console_.28UART.29> for more information on setting up the serial console

## Resources

- [Official product page](https://www.pine64.org/rockpro64/)
