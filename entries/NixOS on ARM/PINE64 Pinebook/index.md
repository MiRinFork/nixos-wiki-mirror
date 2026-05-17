<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/PINE64 Pinebook -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>PINEBOOK</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Pinebook-a64-11-glamour.jpg" title="A Pinebook 11&quot;." width="256" />
<figcaption>A Pinebook 11".</figcaption>
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
<td><p>Upstream U-Boot<a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>SD, eMMC</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td></td>
</tr>
</tbody>
</table>
<section id="footnotes" class="footnotes footnotes-end-of-document" role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><a href="https://github.com/NixOS/nixpkgs/pull/61652">https://github.com/NixOS/nixpkgs/pull/61652</a><a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></li>
</ol>
</section>

</div>

The Pinebook (sometimes referred as pinebook-a64) is a laptop design based on the Allwinner A64 SoC. It was available in two sizes, 11.6" and 14", but is now only available as 11.6". The 11.6" has two resolutions, first models had a 1366×768 panel, while the more recent ones have a 1920×1080 panel.

It can boot from SD or from an included and replaceable eMMC module.

## Status

Upstream NixOS AArch64 image boots on the PINE A64-LTS, using the proper upstream U-Boot.

U-boot support [has been added 2019-05-18](https://github.com/NixOS/nixpkgs/pull/61652). The bootloader has not been built for now.

## Installation instructions

### Partitioning

The internal storage needs to be partitioned in a way that that the bootloader will not interfere with nor be interfered by a partition.

Then, continue installation using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

#### By copying the sd image internally

This is an easy solution, that also allows booting and installing as one would from an SD card on a generic Allwinner platform. Simply `dd` the SD image to the internal storage. The internal storage is likely to be `/dev/mmcblk2`.

#### MBR partition scheme

#### GPT partition scheme

The <a href="NixOS_on_ARM/Allwinner/GPT_Installation" class="wikilink" title="Allwinner/GPT Installation">Allwinner/GPT Installation</a> page explains how to create a GPT partition table while allowing the isntallation of u-boot at the required offset.

## Serial console

Details about the pinout for the headphone jack are available [on the PINE64 wiki](https://wiki.pine64.org/wiki/Pinebook#Pinebook_Schematics_and_Certifications). It is [also available on their store](https://pine64.com/product/pinebook-pinephone-pinetab-serial-console/). The serial settings are the usual Allwinner settings.

On early models<sup>\[Which?\]</sup> serial needs to be toggled via software. On recent models, a physical switch is present on the main board. The linux-sunxi wiki's Pinebook page [has details about serial access](http://linux-sunxi.org/Pine_Pinebook#Adding_a_serial_port).

## Compatibility notes

<table>
<thead>
<tr>
<th colspan="2" style="background: var(--color-inverted)"><p>Mainline kernel</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>HDMI</p></td>
<td><ul>
<li>Hasn't been tested.</li>
</ul></td>
</tr>
</tbody>
</table>

### Downstream kernel

## USB booting with u-boot

You will need to either have mainline U-Boot installed to the eMMC or to an SD card.

Stop the boot process when prompted (by pressing a key). Then, do the following:

    Hit any key to stop autoboot:  0
    => setenv boot_targets usb0
    => boot

This sets the boot order for this boot only. U-Boot can boot (among others) either of the NixOS sd-image or EFI iso from USB.

## Resources

- [Official product page](https://www.pine64.org/pinebook/)
- [linux-sunxi wiki page](https://linux-sunxi.org/Pine_Pinebook)
