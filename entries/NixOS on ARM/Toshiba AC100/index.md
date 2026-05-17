<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Toshiba AC100 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Toshiba AC100</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Architecture</p></td>
<td><p>ARMv7</p></td>
</tr>
<tr>
<td><p>Codename</p></td>
<td><p>Compal PAZ00</p></td>
</tr>
</tbody>
</table>

</div>

## Status

It has been reported as working with **@dezgeg**'s ARMv7 images by <a href="User:Roberth" class="wikilink" title="User:Roberth">User:Roberth</a> following these instructions.

## Installation notes

The Toshiba AC100 used to ship with Android 2, the fastboot bootloader and a custom partition table format. Nowadays, you can install U-boot on it. It is advisable to make a back-up (documented elsewhere; you'll need nvflash as documented below).

In order to modify the operating system, you need to connect the AC100 with a mini-usb cable to an Intel system we'll call the host. On the host, build the nvflash tool:

``` nix
pkgs.stdenv.mkDerivation {
    name = "tegra-driver-package";
    version = "r16.5.0";
    src = pkgs.fetchurl {
      url = http://developer.download.nvidia.com/mobile/tegra/l4t/r16.5.0/ventana_release_armhf/Tegra20_Linux_R16.5_armhf.tbz2;
      sha256 = "11qmqj0yillwfapzcfjr4px4z8l7zkh0v3xrfpr9riff54xsidq2";
    };
    configurePhase = "";
    buildPhase = "";
    checkPhase = "";
    installPhase = ''
      mkdir $out
      cp -r * $out/
    '';
}
```

Build the nvflash tool and follow the instructions for installing U-boot starting with the getbct.sh step at <https://paz00.ru/index.php/Migrate_to_U-Boot#With_prebuilt_sosuboot-tegra_archive_or_sdcard_image_.28PC_not_required.29>

When U-boot is installed, proceed with the sd-image-armv7l-linux.img image from <https://www.cs.helsinki.fi/u/tmtynkky/nixos-arm/installer/> and follow the general NixOS installation instructions. If the first installation attempt fails, you will need to use the U-boot command line to select an alternative installation medium, using something like (please correct):

    setenv boot_targets=usb0
    run distro_boot

## Resources

- [Embedded Linux Wiki article](https://elinux.org/Tegra/Boards/Toshiba_AC100)
