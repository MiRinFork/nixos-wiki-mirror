<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Apple Silicon Macs -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Apple Silicon Macs</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Apple</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Asahi Linux Project m1n1 + U-Boot</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:tpwrules" class="wikilink" title="tpwrules">tpwrules</a></p></td>
</tr>
</tbody>
</table>

</div>

Apple Silicon Macs are supported in large part by the efforts of the [Asahi Linux project](https://asahilinux.org/). All [M1 Macs](https://github.com/AsahiLinux/docs/wiki/M1-Series-Feature-Support) and most [M2 Macs](https://github.com/AsahiLinux/docs/wiki/M2-Series-Feature-Support) are supported currently, with [M3 Mac](https://github.com/AsahiLinux/docs/wiki/M3-Series-Feature-Support) support in progress.

## Status

NixOS should be at least as well supported as the official Asahi Linux distribution. Enough hardware works currently for a pleasant desktop and laptop Linux experience, including booting off the internal NVMe drive.

## Board Specific Installation Notes

Apple's boot and security architecture is complex, but abstracting all that away into a standard UEFI environment is handled by the Asahi Linux installer and project. Those who want to learn more may want to read [Introduction to Apple Silicon](https://github.com/AsahiLinux/docs/wiki/Introduction-to-Apple-Silicon).

Currently, not enough hardware support is upstream for the official NixOS installer to work properly on Apple Silicon Macs. A [comprehensive guide](https://github.com/tpwrules/nixos-apple-silicon/blob/main/docs/uefi-standalone.md) to using the Asahi Linux installer to install NixOS with a customized NixOS ISO is available.

### Touchbar

Certain Macbook Pro models from 2020-2022 may include the Apple touchbar. Out of the box, the touchbar will be completely blank when running NixOS. The touchbar can be re-enabled by adding the following option to your configuration:

``` nix
{
  hardware.apple.touchBar.enable = true;
}
```

This will enable basic function row emulation using the [tiny-dfr](https://github.com/AsahiLinux/tiny-dfr) package provided by the [Asahi Linux project](https://asahilinux.org/).

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
