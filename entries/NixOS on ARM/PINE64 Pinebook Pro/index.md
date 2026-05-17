<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/PINE64 Pinebook Pro -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>PINEBOOK Pro</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Pinebook-Pro-glamour.jpg" title="A Pinebook Pro." width="256" />
<figcaption>A Pinebook Pro.</figcaption>
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
<td><p>U-Boot<a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>SPI, eMMC, SD</p></td>
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
<li id="fn1">Mainline patch: <a href="https://patchwork.ozlabs.org/patch/1194525/">https://patchwork.ozlabs.org/patch/1194525/</a><a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></li>
</ol>
</section>

</div>

The Pinebook Pro is a laptop design based on the Rockchip RK3399 SoC.

It can boot from SD or from an included and replaceable eMMC module.

## Status

Hardware support is partially complete and can be achieved using the overlay provided by [nixos-hardware](https://github.com/NixOS/nixos-hardware). A [README](https://github.com/NixOS/nixos-hardware/blob/master/pine64/pinebook-pro/README.md) with more information can be found into the specific device folder.

You can also consider looking at previous work:

- <https://github.com/Thra11/nixpkgs-overlays-rk3399>

There is more information in the respective READMEs, but the gist of it is that those repositories can be used to build a system image either through cross-compilation or native aarch64-linux build, with the usual caveats.

The repositories also serve as an overlay that can be used in your system configuration thereafter.

## Board-specific installation notes

1.  [Install the board-specific TowBoot to SPI](https://tow-boot.org/devices/pine64-pinebookPro.html)
2.  <a href="NixOS_on_ARM#SD_card_images_(SBCs_and_similar_platforms)" class="wikilink" title=" Get the generic aarch64 sd-image and boot from it"> Get the generic aarch64 sd-image and boot from it</a>
3.  Just follow the normal installation procedure

## Serial console

Details about the pinout for the headphone jack are available [on the PINE64 wiki](https://wiki.pine64.org/wiki/Pinebook#Pinebook_Schematics_and_Certifications). It is [also available on their store](https://pine64.com/product/14%e2%80%b3-pinebook-pro-linux-laptop-ansi-us-keyboard/). The serial settings are the usual Rockchip settings.

## Compatibility notes

- The keyboard may not send input when pressing mod4(pine key)+cursor combinations. This issue is resolved using the [revised keyboard firmware](https://github.com/jackhumbert/pinebook-pro-keyboard-updater.git).

## Resources

- [Official product page](https://www.pine64.org/pinebook-pro/)
- [Pinebook Pro @ Pine64 Wiki](https://wiki.pine64.org/index.php?title=Pinebook_Pro)
