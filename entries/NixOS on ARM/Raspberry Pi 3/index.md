<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi 3 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi 3 family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="raspberry_pi_3_glamour.jpg" title="A Raspberry Pi 3 with enclosure." width="256" />
<figcaption>A Raspberry Pi 3 with enclosure.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Raspberry Pi Ltd</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64, with ARMv7 as a best-effort alternative</p></td>
</tr>
<tr>
<td><p>Boot method</p></td>
<td><p>Raspberry Pi firmware, U-Boot, and extlinux</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2837 or BCM2837B0</p></td>
</tr>
</tbody>
</table>

</div>

The **Raspberry Pi 3** works with the generic AArch64 SD image. AArch64 is the usual choice because NixOS publishes binary packages for it. ARMv7 remains buildable, but NixOS does not publish an ARMv7 binary cache. Import the Raspberry Pi 3 profile from `nixos-hardware` for the Raspberry Pi downstream kernel and board defaults.

## Installation

Use the generic AArch64 SD image described on the <a href="NixOS_on_ARM/Raspberry_Pi#Installation" class="wikilink" title="family page">family page</a>. It contains Raspberry Pi 3 firmware, device trees, U-Boot, and an extlinux configuration.[^1] In a flake, import `nixos-hardware.nixosModules.raspberry-pi-3`. With channels, import `<nixos-hardware/raspberry-pi/3>`. The <a href="NixOS_on_ARM/Raspberry_Pi#Board_profiles" class="wikilink" title="family page">family page</a> provides complete examples and explains that a profile does not partition storage or install U-Boot.

## Profile defaults

The profile selects a pinned kernel from Raspberry Pi's downstream Linux tree. It disables GRUB and enables generation of `/boot/extlinux/extlinux.conf`. The shared `config.txt` defaults request full VC4 KMS, and the profile adds both serial and display kernel-console parameters.[^2][^3]

The kernel package installs BCM2837-named copies of device trees for Pi 3A+, Pi 3B, Pi 3B+, CM3, and Zero 2 W. These files provide boot-time device-tree coverage. They do not create a separate Zero 2 W profile or imply equal hardware test coverage for every variant.

See <a href="NixOS_on_ARM/Raspberry_Pi#Board_profiles" class="wikilink" title="Board profiles">Board profiles</a> for Wi-Fi firmware requirements on custom systems.

## Serial console

The profile adds these kernel parameters:

``` nix
{
  boot.kernelParams = [
    "console=ttyS0,115200n8"
    "console=tty0"
  ];
}
```

It also defaults `enable_uart=1` in `config.txt`. On Pi 3 boards with onboard Bluetooth, `ttyS0` is normally the mini UART routed to GPIO 14 and GPIO 15, which are physical pins 8 and 10. Use pin 6 for ground and a 3.3 V serial adapter. A 5 V serial adapter can damage the board.[^4]

After Linux starts, use `/dev/serial0` to address the primary UART without depending on its hardware name. Override `boot.kernelParams` declaratively to use different console parameters. Do not edit `extlinux.conf` manually because NixOS regenerates it.

## Memory

Pi 3 models have 512 MB or 1 GB of RAM. Cached packages generally fit in this memory, but a local kernel build or another large derivation may exhaust it. If a rebuild fails for lack of memory, add disk or compressed-RAM swap, or use an AArch64 remote builder.

## See also

- <a href="NixOS_on_ARM/Raspberry_Pi" class="wikilink" title="NixOS on ARM/Raspberry Pi">NixOS on ARM/Raspberry Pi</a>
- <a href="NixOS_on_ARM/Installation" class="wikilink" title="NixOS on ARM/Installation">NixOS on ARM/Installation</a>
- [Raspberry Pi USB boot documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#usb-mass-storage-boot)

## References

<references />

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>

[^1]: [Nixpkgs generic AArch64 SD image module](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/installer/sd-card/sd-image-aarch64.nix)

[^2]: [nixos-hardware Raspberry Pi 3 profile](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/3/default.nix)

[^3]: [nixos-hardware Raspberry Pi config.txt defaults](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/common/config-txt-defaults.nix)

[^4]: [Raspberry Pi UART documentation](https://www.raspberrypi.com/documentation/computers/configuration.html#configure-uarts)
