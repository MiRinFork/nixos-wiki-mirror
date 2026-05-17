<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/OLIMEX Teres-A64 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>OLIMEX Teres-A64</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Teres-A64-glamour.png" title="The King Himself" width="256" />
<figcaption>The King Himself</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>OLIMEX, Ltd</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Upstream U-Boot<a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>SD, eMMC</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:KREYREN" class="wikilink" title="KREYREN">KREYREN</a></p></td>
</tr>
</tbody>
</table>
<section id="footnotes" class="footnotes footnotes-end-of-document" role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><a href="https://github.com/NixOS/nixpkgs/pull/240827">https://github.com/NixOS/nixpkgs/pull/240827</a><a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></li>
</ol>
</section>

</div>

Teres-1 (often referred as teres-a64) is an open-source hardware and software netbook design based on the Allwinner A64 SoC.

It can boot from SD or from the included and slow af eMMC module (insane people use only).

## Status

Stable, production-ready and suitable for mission critical environment

For U-Boot use armbian's distribution as currently the nixos's version is outdated and broken

## Installation instructions

### UEFI (recommended)

Refer to the nixos.org download page and download the installer to your preference, then proceed to follow instructions in the [NixOS manual on how to flash the installer](https://nixos.org/manual/nixos/stable/) on e.g. USB drive

### EXTLINUX (legacy)

## Serial console

Serial console can be accessed by default on BAUM 115200 using the [TERES-USB-DEBUG](https://www.olimex.com/Products/DIY-Laptop/KITS/TERES-USB-DEBUG/) cable (or make one it's 3 pole jack with pl2303 converter, can be made work off of single board computer, etc..) in headphone jack port and accessed through:

`   $ picocom -b BAUD /dev/SERIAL-DEVICE # Often set as /dev/ttyUSB0 @ baud of 115200`

Currently the sdcard has set this by fault, but if you use custom configuration and want to maintain the serial console functionality then you need to append it to the kernel CLI through:

`   boot.kernelParams = ["console=ttyS0,115200n8"];`

## Compatibility notes

<table>
<thead>
<tr>
<th colspan="2" style="background: var(--color-inverted)"><p>Mainline kernel on NixOS</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>HDMI</p></td>
<td><ul>
<li>Works</li>
</ul></td>
</tr>
<tr>
<td><p>Display</p></td>
<td><ul>
<li>Expected to work without issues with exceptions, see sunxi wiki</li>
</ul></td>
</tr>
<tr>
<td><p>WiFi/Bluetooth</p></td>
<td><ul>
<li>Works, currently requires non-libre firmware for RTL8723BS which is projected to be mitigated</li>
</ul></td>
</tr>
<tr>
<td><p>Audio (reproductors)</p></td>
<td><ul>
<li>Unknown</li>
</ul></td>
</tr>
<tr>
<td><p>Audio (audio jack)</p></td>
<td><ul>
<li>Unknown</li>
</ul></td>
</tr>
<tr>
<td><p>3D Acceleration</p></td>
<td><ul>
<li>Works</li>
</ul></td>
</tr>
<tr>
<td><p>Webcam</p></td>
<td><ul>
<li>Unknown</li>
</ul></td>
</tr>
<tr>
<td><p>Touchpad</p></td>
<td><ul>
<li>Works</li>
</ul></td>
</tr>
<tr>
<td><p>Keyboard</p></td>
<td><ul>
<li>Works</li>
</ul></td>
</tr>
<tr>
<td><p>SdCard reader</p></td>
<td><ul>
<li>Works</li>
</ul></td>
</tr>
<tr>
<td><p>FOSS Bootloader</p></td>
<td><ul>
<li>Works - U-Boot/TowBoot</li>
</ul></td>
</tr>
</tbody>
</table>

### Kernels

#### Downstream Kernel

## USB booting with U-Boot

You will need to either have mainline U-Boot installed to the eMMC or to an SD card.

Stop the boot process when prompted (by pressing a key). Then, do the following:

    Hit any key to stop autoboot:  0
    => setenv boot_targets usb0
    => boot

This sets the boot order for this boot only. U-Boot can boot (among others) either of the NixOS sd-image or EFI iso from USB.

## Notes

Refer to the device's sunxi-linux wiki page for more details: <https://linux-sunxi.org/Olimex_Teres-A64>

For u-boot installation refer to the u-boot documentation for AllWinner devices: <https://docs.u-boot.org/en/stable/board/allwinner/sunxi.html#installing-on-a-micro-sd-card>

For TowBoot installation refer to the TowBoot wiki:

## Resources

0\. [The Sunxi Linux Wiki Page for the device](https://linux-sunxi.org/Olimex_Teres-A64)

1\. [Official product page](https://www.olimex.com/Products/DIY-Laptop/)

2\. [linux-sunxi wiki page](https://linux-sunxi.org/A64)

3\. [U-Boot documentation for the SoC](https://u-boot.readthedocs.io/en/latest/board/allwinner/sunxi.html)

4\. [Armbian product page for Teres](https://www.armbian.com/olimex-teres-a64)

5\. [Teres-A64 section on the OLIMEX forum](https://www.olimex.com/forum/index.php?board=39.0)
