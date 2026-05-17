<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Orange Pi Zero Plus2 H5 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi Zero Plus2 (H5)</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Orange-pi-zero-plus-two-h5_20180922_165004.jpg" title="An Orange Pi Zero Plus2 (H5)." width="256" />
<figcaption>An Orange Pi Zero Plus2 (H5).</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Xunlong / Orange Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p><a href="https://hydra.nixos.org/job/nixpkgs/trunk/ubootOrangePiZeroPlus2H5.aarch64-linux">Upstream u-boot</a><a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></p></td>
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
<li id="fn1"><a href="https://github.com/NixOS/nixpkgs/pull/47187">https://github.com/NixOS/nixpkgs/pull/47187</a><a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></li>
</ol>
</section>

</div>

## Status

Upstream NixOS AArch64 image will boot on the Orange Pi Zero Plus2 (H5), using the proper upstream u-boot.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image on an SD card.

U-Boot needs to be copied to specific sectors on the microSD card with `dd`. Download u-boot for the board, and copy it to the correct location with (again, replace `/dev/sdX` with the correct path to the SD card device):

``` bash
sudo dd if=u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

## Wireless

The wireless does not currently work using the upstream firmware from the firmware-linux-nonfree package. However there is a version of the firmware which does work in the Armbian [firmware repository](https://github.com/armbian/firmware). See [here](https://github.com/Thra11/nixpkgs/commit/f55c75458821de4af189d6e43ce497cb52694bb1) for an example of how the firmware from this repository can be added to nixpkgs, such that it overrides the upstream files.

## Compatibility notes

- Using the upstream kernel at 4.18, HDMI does work currently.

## Resources

- [Official product page](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-Zero-Plus-2.html)
- [linux-sunxi wiki page](http://linux-sunxi.org/Xunlong_Orange_Pi_Zero_Plus_2)
