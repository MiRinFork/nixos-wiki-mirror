<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi 4 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi 4 family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Raspberry_Pi_4,_2_GB_RAM_version_4.jpg" title="A Raspberry Pi 4." width="256" />
<figcaption>A Raspberry Pi 4.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Raspberry Pi Ltd</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Boot method</p></td>
<td><p>Raspberry Pi EEPROM and firmware, U-Boot, and extlinux</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2711</p></td>
</tr>
<tr>
<td><p>Variants</p></td>
<td><p>Pi 4B, Pi 400, CM4, and CM4S</p></td>
</tr>
</tbody>
</table>

</div>

The **Raspberry Pi 4** family works with the generic AArch64 SD image and has a board profile in `nixos-hardware`. The profile selects a Raspberry Pi downstream kernel and includes the Pi 4 initrd modules and Wi-Fi and Bluetooth firmware. It requests full KMS and provides optional modules for Pi 4 peripherals and HATs.

## Installation

Use the generic AArch64 SD image described on the <a href="NixOS_on_ARM/Raspberry_Pi#Installation" class="wikilink" title="family page">family page</a>. It contains boot files for Pi 4B, Pi 400, CM4, and CM4S.[^1] In a flake, import `nixos-hardware.nixosModules.raspberry-pi-4`. With channels, import `<nixos-hardware/raspberry-pi/4>`. The <a href="NixOS_on_ARM/Raspberry_Pi#Board_profiles" class="wikilink" title="family page">family page</a> provides complete examples and explains that a profile is not a bootable image.

## Profile defaults

The Pi 4 profile selects a pinned kernel from Raspberry Pi's downstream Linux tree and limits generation device trees to `bcm2711-rpi-*.dtb`. Its initrd includes the BCM2711 PCIe and VL805 reset drivers. The profile also installs pinned Wi-Fi and Bluetooth firmware, disables GRUB, and enables extlinux generation.[^2]

The shared `config.txt` defaults request full VC4 KMS with `dtoverlay=vc4-kms-v3d`.[^3] The compatibility option `hardware.raspberry-pi."4".fkms-3d.enable` is disabled by default and is not the normal graphics path.

## Optional hardware modules

The Pi 4 profile imports the following options, all disabled by default. Each path starts with `hardware.raspberry-pi."4".`.

| Hardware | Option suffixes | Purpose |
|----|----|----|
| Audio and Bluetooth | `audio.enable`, `bluetooth.enable` | Adds a build-time audio node or Bluetooth UART pin routing. Enable the corresponding NixOS audio or Bluetooth services separately. |
| USB controllers | `dwc2.enable`, `dwc2.dr_mode`, `xhci.enable` | Configures the DWC2 dual-role controller or the BCM2711 XHCI node. |
| GPIO, I2C, and PWM | `gpio.enable`, `i2c0.enable`, `i2c1.enable`, `pwm0.enable` | Adds GPIO permissions, enables an I2C controller, or enables PWM0 on GPIO 18. Both I2C options also accept `frequency`. |
| Official display | `backlight.enable`, `touch-ft5406.enable` | Adds support nodes for the original official touch display and its FT5406 controller. |
| HATs and capture devices | `digi-amp-plus.enable`, `poe-hat.enable`, `poe-plus-hat.enable`, `tv-hat.enable`, `tc358743.enable` | Configures the listed audio, PoE fan, TV tuner, or HDMI-to-CSI hardware. The PoE options expose fan temperature and hysteresis settings. |
| LEDs | `leds.eth.disable`, `leds.act.disable`, `leds.pwr.disable` | Disables the selected Ethernet, activity, or power LED behaviour on supported Pi 4 boards. |

The exact option definitions are in the [Pi 4 profile directory](https://github.com/NixOS/nixos-hardware/tree/master/raspberry-pi/4). Some options apply only to the Pi 4B and exclude Compute Module variants.

### Device-tree overlay limitation

These optional modules use `hardware.deviceTree.overlays`, while `hardware.raspberry-pi.configtxt.settings` uses a separate firmware-time mechanism. The mechanisms can conflict. See <a href="NixOS_on_ARM/Raspberry_Pi#Kernels_and_device_trees" class="wikilink" title="Kernels and device trees">Kernels and device trees</a>. [nixos-hardware issue \#1946](https://github.com/NixOS/nixos-hardware/issues/1946) tracks the migration.

The base profile leaves `hardware.raspberry-pi."4".apply-overlays-dtmerge.enable` disabled. Some peripheral modules enable it when they require the Raspberry Pi `dtmerge` implementation. Do not enable it as a general installation step.

## EEPROM and USB boot

The Pi 4 bootloader lives in a rewritable EEPROM. USB or network boot may require a suitable EEPROM release and `BOOT_ORDER`. The `hardware.raspberry-pi.firmware` module manages files on the FAT firmware partition but does not update this EEPROM. Use the `raspberrypi-eeprom` package and the [official update procedure](https://www.raspberrypi.com/documentation/computers/configuration.html#update-bootloader-version).

The Pi 4B has two micro-HDMI outputs. Linux names the connector marked `HDMI0` as `HDMI-A-1` and `HDMI1` as `HDMI-A-2`.[^4] If a text console or display manager appears on an unexpected output, check both connectors and use a kernel `video=` parameter when a fixed mapping is required.

For intermittent Wi-Fi reachability problems, see the <a href="NixOS_on_ARM/Raspberry_Pi#Wi-Fi_power_saving" class="wikilink" title="power-saving note on the family page">power-saving note on the family page</a>.

## See also

- <a href="NixOS_on_ARM/Raspberry_Pi" class="wikilink" title="NixOS on ARM/Raspberry Pi">NixOS on ARM/Raspberry Pi</a>
- <a href="NixOS_on_ARM/Installation" class="wikilink" title="NixOS on ARM/Installation">NixOS on ARM/Installation</a>
- [Raspberry Pi boot EEPROM documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#raspberry-pi-boot-eeprom)

## References

<references />

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>

[^1]: [Nixpkgs generic AArch64 SD image module](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/installer/sd-card/sd-image-aarch64.nix)

[^2]: [nixos-hardware Raspberry Pi 4 profile](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/4/default.nix)

[^3]: [nixos-hardware Raspberry Pi config.txt defaults](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/common/config-txt-defaults.nix)

[^4]: [Raspberry Pi display documentation](https://www.raspberrypi.com/documentation/computers/configuration.html#display-settings)
