<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Orange Pi 5 Plus -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi 5 Plus</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Orange Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>uboot 2024.1+</p></td>
</tr>
<tr>
<td><p>Startup order</p></td>
<td><p>SPI NOR Flash, SD, NVMe</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:ryan4yin" class="wikilink" title="ryan4yin">ryan4yin</a></p></td>
</tr>
</tbody>
</table>

</div>

# Orange PI 5 Plus

The Orange Pi 5 Plus is a Single-Board Computer with a Rockchip RK3588 SoC.

Note that rk3588 is the same as rk3588s, but with more I/O pins (Linux device trees for rk3588 include rk3588s).

## System configuration

Upstream nixpkgs provide kernel and u-boot for Orange Pi 5 Plus. The generic steps from <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a> apply to this board as well. Make sure the kernel you use is recent enough to support Pi 5 Plus though (6.12 and above are ok). Alternatively, you may use vendor-supplied components, flakes for which are provided by volunteers.

Join `#nixos-on-arm:nixos.org` Matrix channel to hang out with users that are running this board.

### Using upstream Components with U-Boot

1\. If you have installed U-Boot into on-board SPI flash, you should be able to directly boot generic aarch64 NixOS images.

2\. If you want to have U-Boot on your SD card, you need to dd it into aarch64 NixOS image at the right offsets. Find the `idbloader.img` and `u-boot.itb` binaries in [ubootOrangePi5Plus](https://search.nixos.org/packages?channel=25.11&show=ubootOrangePi5Plus) package and dd them into SD card image as shown below.

    dd if=idbloader.img of=sd-card.img seek=64 conv=fsync,notrunc
    dd if=u-boot.itb of=sd-card.img seek=16384 conv=fsync,notrunc

See the [example from gnull/nixos-rk3588](https://github.com/gnull/nixos-rk3588/tree/main/examples/upstream-opi) for a minimal complete configuration to build an SD card image with U-Boot installed (option 2 above). In addition to choosing an appropriate kernel and `dd`'ing U-Boot into the image, the example also sets kernel parameters to enable the serial console.

The [Mic92/nixos-aarch64-images](https://github.com/Mic92/nixos-aarch64-images) is another approach for installing U-Boot into aarch64 images (although with no direct support for OPi 5 Plus yet).

### Using Vendor-supplied Components with U-Boot

[gnull/nixos-rk3588](https://github.com/gnull/nixos-rk3588) (a maintained fork of the original by <a href="User:ryan4yin" class="wikilink" title="ryan4yin">ryan4yin</a>) is a flake that builds a working SD card image using vendor-supplied kernel and firmware. The kernel used here is older than the upstream Nixpkgs version, and may differ in some driver versions (the complete list of differences is not documented as of now). For example, vendor kernel uses RKNPU driver for NPU, while upstream kernel uses [rocket](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/accel/rocket?h=v6.18) driver — they provide different interfaces and are supported by different tools.

### Using UEFI

OPi 5 Plus supports booting NixOS with UEFI (such as [edk2](https://github.com/edk2-porting/edk2-rk3588)) instead of U-Boot. The [gnull/nixos-rk3588](https://github.com/gnull/nixos-rk3588) has an example (with known bugs [1](https://github.com/gnull/nixos-rk3588/issues/1)).

## Troubleshooting

### What to do when bootloader breaks (SPI)?

If you flash uBoot with incorrect bootloader, you may be unable to load anything else until uboot is fixed. Orange Pi 5 Plus supports maskrom mode with \`rkdeveloptool\`, as documented here: <https://forum.armbian.com/topic/26418-maskrom-erase-spi/#comment-175057>

## See Also

\- <https://github.com/NixOS/nixpkgs/pull/292667>

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
