<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Libre Computer AML-S905X-CC-V2 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>AML-S905X-CC-V2</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Libre Computer</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>U-Boot or UEFI</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:Programmerino" class="wikilink" title="Programmerino">Programmerino</a></p></td>
</tr>
</tbody>
</table>

</div>

## Status

The only tested installation method is using <a href="NixOS_on_ARM/UEFI" class="wikilink" title="NixOS_on_ARM/UEFI">NixOS_on_ARM/UEFI</a>, although limited testing with the [generic SD image](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.sd_image.aarch64-linux) also showed promise

## Board-specific installation notes

Follow the <a href="NixOS_on_ARM/UEFI" class="wikilink" title="generic UEFI installation steps">generic UEFI installation steps</a>, and make sure to use an image which has at least kernel 6.2 to avoid [networking issues](https://hub.libre.computer/t/s805x-1gb-version-boots-nice-but-not-its-512mb-brother/1600/13). [These images](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal_new_kernel_no_zfs.aarch64-linux) are recommended.

The biggest hurdle is making sure you have the latest bootloader installed. The easiest approach is to use [the official flashing tool](https://github.com/libre-computer-project/libretech-flash-tool/tree/master) on a microSD card (or potentially directly onto the SPI flash if you already have an OS booted), and then write the NixOS ISO to a USB drive. Although this isn't documented, it appears that the physical boot switch chooses whether to choose the bootloader from the flash memory or the microSD card. If you just flashed the new bootloader to a microSD card, make sure it is set in the position closest to the I/O (ethernet, USB ports, etc.), otherwise, set it to the opposite direction.

## Configuration

### Use latest kernel

As of writing, the stable LTS kernel is not 6.2+ and thus the default configuration.nix will cause [networking issues](https://hub.libre.computer/t/s805x-1gb-version-boots-nice-but-not-its-512mb-brother/1600/13). To avoid this, make the change below:

## Troubleshooting

### Selecting any boot option resets the board

You probably are not using the latest platform firmware, or the physical boot switch is not set correctly (and that is causing you to boot from the factory bootloader). See the instructions above.

### Squashfs errors

Use the copytoram boot option

<hr />

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
