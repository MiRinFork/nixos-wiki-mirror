<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Jetson TK1 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Jetson TK1</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv7</p></td>
</tr>
</tbody>
</table>

</div>

## Status

**@dezgeg**'s porting efforts to ARMv7 should work.

## Board-specific installation notes

The proprietary NVIDIA bootloader can only boot NVIDIA's L4T kernel, so it needs to be replaced by flashing U-Boot on the board's eMMC via the recovery USB port. The easiest way to do that is to use tegra-uboot-flasher-scripts, though unfortunately that's currently not packaged in NixOS. Once U-Boot is flashed, the ARMv7 image will boot out-of-the-box.

To get the ARMv7 image, follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a>.

Finally, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

## Notes about the boot process

Only serial console (via the DB-9 connector) is supported.
