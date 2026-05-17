<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Kosagi Novena -->

We now have <https://github.com/novena-next/nixos-novena> repository that can be used to build Novena specific kernel and few other tools like `novena-eeprom` and `novena-usb-hub`.

Also check out <https://github.com/novena-next/docs> for general purpose documentation. This guide might move there at some point.

### Using generic image

<a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>

use generic `armv7l` image (`sd-image-armv7l-linux.img`)

### U-boot

Build u-boot according to

<a href="NixOS_on_ARM#Building_u-boot_from_your_NixOS_PC" class="wikilink" title="NixOS_on_ARM#Building_u-boot_from_your_NixOS_PC">NixOS_on_ARM#Building_u-boot_from_your_NixOS_PC</a>

Store `u-boot.bin` on `/boot` (mounted sd-image).

Proceed with standard installation steps and <a href="NixOS_on_ARM#Building_U-Boot_from_your_NixOS_PC" class="wikilink" title="NixOS_on_ARM#Building_U-Boot_from_your_NixOS_PC">NixOS_on_ARM#Building_U-Boot_from_your_NixOS_PC</a>

You can use your own layout when installing on the hard drive (SD-card is still needed to boot from SATA), `extlinux` insted of `grub` is important.

### Configuring SATA boot

To enable booting from SATA by default enable `sataroot` feature with `novena-eeprom` and then break to u-boot shell and run following commands to set different boot order:

TODO: disk ID

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
