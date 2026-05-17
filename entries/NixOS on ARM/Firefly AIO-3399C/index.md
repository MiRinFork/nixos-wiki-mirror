<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Firefly AIO-3399C -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Firefly AIO-3399C</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Firefly_AIO-3399C.png" title="A Firefly AIO-3399C attached to LVDS" width="256" />
<figcaption>A Firefly AIO-3399C attached to LVDS</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Firefly</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>u-boot with ARM trusted boot and Rockchip Miniloader</p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>official: eMMC</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:makefu" class="wikilink" title="makefu">makefu</a></p></td>
</tr>
</tbody>
</table>

</div>

## Status

The board **boots NixOS from eMMC** with the downstream u-boot and Rockchip trusted boot blob. Also flashing Rockchip tertiary bootloader (\*\*idbloader\*\*).

Additionally image provided by firefly on [the chinese download page](http://www.t-firefly.com/doc/download/54.html), click on **Ubuntu (GPT)**. The image has also been uploaded to [archive.org](https://archive.org/details/AIO-3399C).

The official documentation, which is a pretty good state, can be found at [the wiki of firefly](http://wiki.t-firefly.com/en/AIO-3399C/).

## Serial console

On the board there are 3 pins which have a 2.54mm pitch, this is the debug console with the text DEBUG on it. Starting from the middle to the side of the board:

- GND (Black Wire)
- RX (White Wire)
- TX (Green Wire)
- VCC, only the silver trace point and not a pin

Baud rate is `1500000` Connect to it via:

``` bash
nix-shell -p picocom --run "picocom -b 1500000 /dev/ttyUSB0"
```

When you build your own image, you need the following extra kernel command-line parameters to get serial output:

``` nix
{
  boot.kernelParams = lib.mkForce ["console=ttyS2,1500000n8" "earlycon=uart8250,mmio32,0xff1a0000" "earlyprintk"];
}
```

Make sure you disable other consoles (tty0) as they seem to interfere with the output.

## Board-specific installation notes

### Installation onto eMMC

#### boot parts

For booting the Image you will need the following parts:

1.  idbloader (rockchip proprietary)
2.  u-boot customized by firefly
3.  ARM Trusted image customized for working with uboot

The whole setup can be built by hand with the following scripts originally from user **samueldr**.

``` bash
git clone https://github.com/makefu/ROC-RK3399-PC-overlay.git builder && cd builder
nix-build -A pkgsCross.aarch64-multiplatform.AIO-3399C.firmware
ls result/
cp result/{idbloader.img,uboot.img,trust.img} .
```

#### boot and rootfs

The latest linux kernel (4.19 and up) is working with this board. Instead of building the image yourself you can fetch the latest sd-image from hydra and dd the created images onto the separate partitions. You can find all the successful builds in [hydra @ nixos:release-18.09-aarch64:nixos.sd_image.aarch64-linux](https://hydra.nixos.org/job/nixos/release-18.09-aarch64/nixos.sd_image.aarch64-linux)

``` bash
# get the latest link directly from hydra
wget https://hydra.nixos.org/build/89033499/download/1/nixos-sd-image-18.09.2227.ea0820818a7-aarch64-linux.img -O sd.img
udisksctl loop-setup -f sd.img -r
dd if=/dev/loop0p1 boot.img
dd if=/dev/loop0p2 root.img
```

#### Bringing the device into Rockchip loader mode

The board can easily be flashed by booting the device into the Rockchip *loader* mode. The device exposes the emmc with the rockusb protocol to a connected host pc.

To bring the device in the loader mode:

1.  Disconnect from power
2.  Connect USB-C from the board to your computer
3.  Hold 'Recovery' button pressed
4.  Connect power, wait for 2 (or more) seconds
5.  Short press the 'reset' button and release the 'Recovery' button afterwards

#### flashing all boot parts

``` bash
# You should have the following files available:
$ ls *.img
boot.img root.img trust.img uboot.img idbloader.img

# enter loader or maskrom mode
nix-build -A AIO-3399C.upgrade_tool
# optional: re-flash the rockchip loader, haven't tested
# result/bin/upgrade_tool UL idbloader.img
result/bin/upgrade_tool di -u uboot.img -t trust.img -boot ./boot.img -rootfs root.img
result/bin/upgrade_tool rd # reset
```

Now cross fingers, the system should boot into NixOS now, the getty BAUD rate will change to `115200`.

## Compatibility notes

See the [Rockchip compatibility matrix](http://opensource.rock-chips.com/wiki_Status_Matrix). Uboot requires the Rockchip Miniloader and an arm trusted boot image.

### Downstream kernel

The downstream kernel sources can be found on github at [1](https://github.com/FireflyTeam/kernel). The stable kernel branch they are maintaining is `4.4`, however mainline 4.19 is already work according to the [Rockchip compatibility matrix](http://opensource.rock-chips.com/wiki_Status_Matrix).

### u-boot

Firefly maintains an own u-boot fork at [2](https://github.com/FireflyTeam/u-boot).

### Firefly upgrade_tool

Firefly provides an `upgrade_tool` which is a modified [rock-chip upgrade tool](http://opensource.rock-chips.com/wiki_Upgradetool). Using the upstream tool however may result in weird errors like being unable to flash the image or being unable to erase the flash. To be sure use the [archive.org mirror](https://archive.org/details/AIO-3399C).

However, because the software is essentially a blob, you will need to either patchelf the thing or use **steam-run**:

``` bash
nix-shell -p steam-run --run "steam-run ./upgrade_tool"
```

I tried flashing with the open-source rkflashtool (in the same repo as the u-boot stuff), however i was unable to actually connect to the device neither in "loader" nor in "maskrom" mode. I resorted to using the closed source blob `upgrade_tool` which works directly.

### Rockchip MaskROM Mode

Maskrom mode is a way to get extended privileges when flashing but you need to shorten two trace points on the board. Follow [the official documentation](https://wiki.t-firefly.com/en/AIO-3399C/04-maskrom_mode.html). However the loader mode should be enough for most things.

## Resources

- [Official product page](http://en.t-firefly.com/product/industry/aio_3399c)
- [Firefly Wiki Page for the AIO-3399c](http://wiki.t-firefly.com/en/AIO-3399C/)

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
