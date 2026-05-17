<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Orange Pi 6 Plus -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi 6 Plus</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Orange Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>CIX CD8180/CD8160 (Sky1)</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>UEFI (pre-installed in SPI flash)</p></td>
</tr>
<tr>
<td><p>Startup order</p></td>
<td><p>NVMe, eMMC, SD, Network (PXE)</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:i-am-logger" class="wikilink" title="i-am-logger">i-am-logger</a></p></td>
</tr>
</tbody>
</table>

</div>

# Orange Pi 6 Plus

The Orange Pi 6 Plus is a Single-Board Computer with a CIX CD8180/CD8160 (Sky1) SoC.

## Hardware specifications

|  |  |
|----|----|
| CPU | 12-core 64-bit processor |
| NPU | 28.8Tops |
| GPU | Integrated graphics processor |
| Combined Computing Power | 45TOPS（CPU+NPU+GPU） |
| RAM | LPDDR5: 128-bit x 32;16GB/32GB /64GB |
| Storage Expansion | • SPI FLASH: 64Mbit • NVME SSD (PCIe 4 lane，M.2 KEY-M interface 2280) \*2 • TF slot |
| Wi-Fi Module | M.2 KEY-E socket |
| PCIE Ethernet | 5G Ethernet\*2 |
| USB | • USB 3.0 HOST \*2 • USB2.0\*2 • Reserved USB 2.0 9-pin socket • USB full-function Type-C 3.0 HOST\*2 |
| Camera Interface | 2\*4-lane MIPI CSI camera interface |
| Display Interface | • 1\*DP1.4 4K@120HZ • 2\*TYPE-C DP • 1\*HDMI1.4 4K@60HZ • 1\*eDP 4K@60HZ |
| Audio | 3.5mm headphone jack audio input/output, speakers\*2, analog MIC\*1 |
| TYPE-C Port Power Supply | Type-C PD 20V IN\*2, standard 100W |
| Expansion Interface | 40-pin function expansion interface, supporting the following interface types: GPIO, UART, I2C, SPI, PWM |
| Indicator Light | Power-on indicator, system indicator, battery charging indicator |
| Button | 1\* Power button, 1\* BOOT button, 1\* RESET button |
| Fan Interface | 1\* Fan connector with PWM control |
| Reserved Interface | Board-to-board battery connector; 2-pin RTC connector |
| Power Adapter | Type-C PD 20V input, standard 100W |
| Operating System | Debian, Ubuntu, Android, Windows, ROS2 |
| Appearance Dimensions | 115\*100mm |
| Weight | 132g |

## System configuration

The board uses UEFI boot (pre-installed in SPI flash), which simplifies the boot process compared to U-Boot based boards.

Hardware support requires the vendor kernel (6.1.44) and proprietary drivers from orangepi-xunlong.

Join \`#nixos-on-arm:nixos.org\` Matrix channel for support and discussion.

### @i-am-logger's flake

NixOS flake for CIX CD8180/CD8160 SoC boards: <https://github.com/i-am-logger/nixos-cix-cd8180>

Includes:

- Vendor kernel 6.1.44 with hardware support
- GPU, NPU, ISP, VPU drivers (packaged, untested)
- SD card, NVMe/eMMC, and network boot (PXE)
- Orange Pi tools (orangepi-config, wiringop)

### Boot methods

The Orange Pi 6 Plus supports multiple boot methods via UEFI:

- **SD Card**: Flash image and boot
- **NVMe**: Install to faster storage after SD card setup
- **Network (PXE)**: Boot over network without local storage

See the repository documentation for installation instructions.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
