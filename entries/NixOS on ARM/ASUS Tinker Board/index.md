<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/ASUS Tinker Board -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>NixOS on TinkerBoard</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>ASUS</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv7</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Upstream u-boot</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:tomberek" class="wikilink" title="tomberek">tomberek</a></p></td>
</tr>
</tbody>
</table>

</div>

## Status

**@dezgeg**'s porting efforts to ARMv7 works on the TinkerBoard, with some modification for u-boot and DTB paths. Support for this board is a work in progress. Please contact me (<a href="User:tomberek" class="wikilink" title="@tomberek">@tomberek</a>) for comments/thoughts/feedback/etc.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image on an SD card.

The Tinker Board seems to look for U-Boot at a specific offset rather than in a file. So copy the initial 4MB from the TinkerOS image and then copy it to the NixOS image while skipping the MBR/partition table in the first 512 bytes. It turns out the bootstrap section of the MBR is also needed, so copy that as well.

These commands may use either the /dev/sdX or the file images and later copied to SD cards - this was discovered iteratively, thus was performed on the sd cards directly. Use with caution. (Assumes `/dev/sdc` is TinkerOS and `/dev/sdb` is NixOS images or devices respectively).

``` bash
dd if=/dev/sdc of=tinker_sector bs=512k count=8 status=progress # grab tinker initial sectors
dd if=tinker_sector of=/dev/sdb bs=512 skip=1 seek=1 count=8191 # copy the img and env blobs
dd of=/dev/sdb if=tinker_sector bs=428 count=1 # bootstrap code from begining of MBR
```

It turns out that getting into U-Boot using the TinkerOS image, halting the boot process, replacing SD cards with the NixOS image fails, but the error message suggests the extlinux merely has a different name for the DTB than NixOS has packaged. Simply copy from the nixos dtb file \`/boot/nixos/<hash>-dtbs/rk3288-tinker.dtb\` to \`rockchip-tinker_rk3288.dtb\`.

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## Serial console

Your configuration.nix will need to modify the default `boot.kernelParams` configuration to use the serial console.

## TODO

- Build U-boot from upstream
- upload images/blobs
- host binary cache

## Resources

- <a href="NixOS_on_ARM" class="wikilink" title="NixOS_on_ARM">NixOS_on_ARM</a>
- [Official ASUS website](https://www.asus.com/us/Single-Board-Computer/Tinker-Board/)
