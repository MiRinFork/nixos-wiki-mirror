<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/ru -->

<languages/>

<div style="font-size: 1.5rem; text-align: center;padding-bottom: 0.5rem;">

<strong>NixOS поддерживает 64-bit ARM.</strong>

</div>

Уровень поддержки ARM в целом зависит от архитектуры и конкретных экосистем и плат.

Интеграция ARM в NixOS осуществляется путем создания **общих сборок, как граждан первого класса**. Это означает, что как только появится поддержка платы в ядре и прошивке платформы, NixOS будет работать после их обновления.

<div lang="en" dir="ltr" class="mw-content-ltr">

It is still possible, when needed, to build and use a customized platform firmware and kernel for specific boards<sup><a href="Talk:NixOS_on_ARM#NixOS_.22support.22_for_board-specific_kernels_or_bootloaders" class="wikilink" title="[reference needed">[reference needed</a>\]</sup>.

</div>

На данный момент (начало 2024 года) **только AArch64** имеет полную поддержку upstream. При этом ни armv6l, ни armv7l не игнорируются, над исправлениями работают и утверждают их по мере необходимости. Не хватает только поддержки и сборки в бинарном виде. На момент написания статьи общедоступных кэшей для armv6l или armv7l не существует.

**Для получения ссылок на образы, включая установку UEFI**, перейдите на страницу <a href="NixOS_on_ARM/Installation" class="wikilink" title="Installation page">Installation page</a>.

<span id="Supported_devices"></span>

## Поддерживаемые устройства

Легенда таблицы:

- Система на кристалле -

<https://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%D0%BD%D0%B0_%D0%BA%D1%80%D0%B8%D1%81%D1%82%D0%B0%D0%BB%D0%BB%D0%B5?wprov=sfla1>

- Архитектура набора команд -

<https://ru.wikipedia.org/wiki/%D0%90%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%B0_%D0%BD%D0%B0%D0%B1%D0%BE%D1%80%D0%B0_%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4?wprov=sfla1>

<span id="Upstream_(NixOS)_supported_devices"></span>

### Устройства поддерживающие NixOS из коробки

NixOS поддерживает эти платы с архитектурой AArch64 на канале nixpkgs-unstable и stable.

<div lang="en" dir="ltr" class="mw-content-ltr">

Support for those board assumes as much is supported as Mainline Linux supports.

<div class="table">

| Manufacturer | Board | SoC | ISA | CPU | RAM | Storage |
|----|----|----|----|----|----|----|
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_3" class="wikilink" title="Raspberry Pi 3">Raspberry Pi 3</a> | Broadcom BCM2837 | AArch64 / ARMv7 | 4× Cortex-A53 @ 1.2 - 1.4 GHz | 1 GB | SD/microSD |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_4" class="wikilink" title="Raspberry Pi 4">Raspberry Pi 4</a> | Broadcom BCM2711 | AArch64 / ARMv7 | 4× Cortex-A72 @ 1.5 - 1.8 GHz | 1-8 GB | microSD, eMMC |

</div>

### Community supported devices

</div>

Эти платы не проходят регулярную проверку на работоспособность.

<div lang="en" dir="ltr" class="mw-content-ltr">

The baseline support level expected is “Just as much as mainline Linux and U-Boot supports them”, except if specified otherwise.

<div class="table">

| Manufacturer | Board | SoC | ISA | CPU | RAM | Storage |
|----|----|----|----|----|----|----|
| Apple | <a href="NixOS_on_ARM/Apple_Silicon_Macs" class="wikilink" title="Apple Silicon Macs">Apple Silicon Macs</a> | M1/M1 Pro/M1 Max | AArch64 | — | — | NVMe |
| ASUS | <a href="NixOS_on_ARM/ASUS_Tinker_Board" class="wikilink" title="Tinker Board">Tinker Board</a> | Rockchip RK3288 | ARMv7 | 4× Cortex-A17 | 2 GB | microSD |
| Banana Pi | <a href="NixOS_on_ARM/Banana_Pi" class="wikilink" title="Banana Pi">Banana Pi</a> | Allwinner A20 | ARMv7 | 2× Cortex-A7 | 1 GB | SD, SATA |
| Banana Pi M64 | <a href="NixOS_on_ARM/Banana_Pi_M64" class="wikilink" title="Banana Pi M64">Banana Pi M64</a> | Allwinner A64 | AArch64 | 4× Cortex-A53 | 2 GB | microSD, 8GB eMMc |
| Banana Pi BPI-M5 | <a href="NixOS_on_ARM/Banana_Pi_BPI-M5" class="wikilink" title="Banana Pi BPI-M5">Banana Pi BPI-M5</a> | Amlogic S905X3 | AArch64 | 4× Cortex-A55 | 4 GB LPDDR4 | microSD, 16G eMMC |
| BeagleBoard.org | <a href="NixOS_on_ARM/BeagleBone_Black" class="wikilink" title="BeagleBone Black">BeagleBone Black</a> | TI AM335x [(src)](https://git.beagleboard.org/beagleboard/beaglebone-black) | ARMv7 | 1× Cortex-A8 @ 1 GHz | 512 MB | 4 GB eMMC, microSD |
| Firefly | <a href="NixOS_on_ARM/Firefly_AIO-3399C" class="wikilink" title="AIO-3399C">AIO-3399C</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 2/4 GB | 8/16 GB eMMC, microSD |
| FriendlyElec | <a href="NixOS_on_ARM/NanoPC-T4" class="wikilink" title="NanoPC-T4">NanoPC-T4</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 4 GB | 16 GB eMMC, microSD, NVMe |
| FriendlyElec | <a href="NixOS_on_ARM/NanoPi-M4" class="wikilink" title="NanoPi-M4">NanoPi-M4</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 4 GB | optional eMMC, microSD |
| FriendlyElec | <a href="NixOS_on_ARM/NanoPi-R6C" class="wikilink" title="NanoPi-R6C">NanoPi-R6C</a> | Rockchip RK3588S | AArch64 | 4× ARM Cortex-A76 @ 2.4 GHz, 4× Cortex-A55 @ 1.8 Ghz | 4 GB / 8 GB | optional eMMC, microSD, NVMe |
| Hardkernel | <a href="NixOS_on_ARM/ODROID-HC1" class="wikilink" title="ODROID-HC1 &amp; ODROID-HC2">ODROID-HC1 &amp; ODROID-HC2</a> | Samsung Exynos 5422 | ARMv7 | 4× Cortex-A15 @ 2GHz, 4× Cortex-A7 @ 1.4GHz | 2 GB | microSD |
| Hardkernel | <a href="NixOS_on_ARM/ODROID-C2" class="wikilink" title="ODROID-C2">ODROID-C2</a> | Amlogic S905 | AArch64 | 4× Cortex-A53 @ 1.5GHz | 2 GB | eMMC, microSD |
| Hardkernel | <a href="NixOS_on_ARM/ODROID-HC4" class="wikilink" title="ODROID-HC4">ODROID-HC4</a> | Amlogic S905X3 | AArch64 | 4× Cortex-A55 @ 1.8GHz | 4 GB | microSD, SATA |
| Kosagi | <a href="NixOS_on_ARM/Kosagi_Novena" class="wikilink" title="Kosagi Novena">Kosagi Novena</a> | i.MX6 | ARMv7 | 4× Cortex-A9 @ 1.2 GHz | 4 GB | microSD, SATA |
| Libre Computer | <a href="NixOS_on_ARM/Libre_Computer_ROC-RK3399-PC" class="wikilink" title="ROC-RK3399-PC">ROC-RK3399-PC</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 4 GB | eMMC, microSD, NVMe |
| Libre Computer | <a href="NixOS_on_ARM/Libre_Computer_ROC-RK3328-CC" class="wikilink" title="ROC-RK3328-CC">ROC-RK3328-CC</a> | Rockchip RK3328 | AArch64 | 4× Cortex-A53 @ 1.4GHz | 4 GB | eMMC, microSD |
| Libre Computer | <a href="NixOS_on_ARM/Libre_Computer_AML-S905X-CC-V2" class="wikilink" title="AML-S905X-CC-V2">AML-S905X-CC-V2</a> | Amlogic S905X | AArch64 | 4× Cortex-A53 @ 1.512 GHz | 1/2GB | eMMC, microSD |
| Linksprite | <a href="NixOS_on_ARM/PcDuino3_Nano" class="wikilink" title="pcDuino3 Nano">pcDuino3 Nano</a> | Allwinner A20 | ARMv7 | 2× Cortex-A7 @ 1 GHz | 1 GB | 4 GB NAND, microSD, SATA |
| NVIDIA | <a href="NixOS_on_ARM/Jetson_TK1" class="wikilink" title="Jetson TK1">Jetson TK1</a> | Tegra K1/T124 | ARMv7 | 4× Cortex-A15 @ 2.3 GHz | 2 GB | 16 GB eMMC, SD, SATA |
| NXP | [i.MX 8M Plus EVK](https://github.com/NiklasGollenstede/nixos-imx/) | i.MX 8M Plus | AArch64 | 4× Cortex-A53 @ 1.8 Ghz | 6 GB | 32 GB eMMC, microSD |
| NXP | [i.MX 8M Quad EVK](https://github.com/gangaram-tii/nixos-imx8mq/) | i.MX 8M Quad | AArch64 | 4× Cortex-A53 @ 1.5 Ghz + 1× Cortex-M4 | 3 GB | 16 GB eMMC, microSD |
| OLIMEX | <a href="NixOS_on_ARM/OLIMEX_Teres-A64" class="wikilink" title="Teres-A64">Teres-A64</a> | AllWinner A64 | AArch64 | 4× Cortex-A53 @ 1.1 GHz | 2GB | 16 GB eMMC, microSD |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_One" class="wikilink" title="Orange Pi One">Orange Pi One</a> | Allwinner H3 | ARMv7 | 4× Cortex-A7 @ 1.2 GHz | 512 MB | microSD |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_PC" class="wikilink" title="Orange Pi PC">Orange Pi PC</a> | Allwinner H3 | ARMv7 | 4× Cortex-A7 @ 1.6 GHz | 1 GB | SD/microSD |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_Zero_Plus2_H5" class="wikilink" title="Orange Pi Zero Plus2 (H5)">Orange Pi Zero Plus2 (H5)</a> | Allwinner H5 | AArch64 | 4× Cortex-A53 @ 1.2 GHz | 1 GB | SD/microSD + 8GB eMMC |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_Zero2_H616" class="wikilink" title="Orange Pi Zero2 (H616)">Orange Pi Zero2 (H616)</a> | Allwinner H616 | AArch64 | 4× Cortex-A53 @ 1.2 GHz | 1 GB | SD/microSD + 2MB SPI Flash |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_R1_Plus_LTS" class="wikilink" title="Orange Pi R1 Plus LTS">Orange Pi R1 Plus LTS</a> | Rockchip RK3328 | AArch64 | 4× Cortex-A53 @ 1.5 GHz | 1 GB | microSD |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_5" class="wikilink" title="Orange Pi 5">Orange Pi 5</a> | Rockchip RK3588s | AArch64 | 4× Cortex-A76 @ 2.4GHz, 4×Cortex-A55 @ 1.8 GHz | 4/8/16 GB | microSD, NVMe |
| Orange Pi | <a href="NixOS_on_ARM/Orange_Pi_5_Plus" class="wikilink" title="Orange Pi 5 Plus">Orange Pi 5 Plus</a> | Rockchip RK3588 | AArch64 | 4× Cortex-A76 @ 2.4GHz, 4×Cortex-A55 @ 1.8 GHz | 4/8/16 GB | eMMC, microSD, NVMe |
| PINE64 | <a href="NixOS_on_ARM/PINE_A64-LTS" class="wikilink" title="PINE A64-LTS">PINE A64-LTS</a> | Allwinner R18 | AArch64 | 4× Cortex-A53 @ ? GHz | 2 GB | microSD & eMMC |
| PINE64 | <a href="NixOS_on_ARM/PINE64_Pinebook" class="wikilink" title="Pinebook">Pinebook</a> | Allwinner A64 | AArch64 | 4× Cortex-A53 @ ? Ghz | 2 GB | microSD & eMMC |
| PINE64 | <a href="NixOS_on_ARM/PINE64_Pinebook_Pro" class="wikilink" title="Pinebook Pro">Pinebook Pro</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 4 GB | microSD & eMMC |
| PINE64 | <a href="NixOS_on_ARM/PINE64_ROCK64" class="wikilink" title="ROCK64">ROCK64</a> | Rockchip RK3328 | AArch64 | 4× Cortex-A53 @ 1.5 GHz | 1/2/4 GB | microSD/eMMC |
| PINE64 | <a href="NixOS_on_ARM/PINE64_ROCKPro64" class="wikilink" title="ROCKPro64">ROCKPro64</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 2/4 GB | microSD/eMMC |
| Clockworkpi | <a href="NixOS_on_ARM/Clockworkpi_A06_uConsole" class="wikilink" title="uConsole A06">uConsole A06</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72 @ 2.0 GHz, 4× Cortex-A53 @ 1.5 Ghz | 4 GB | microSD |
| Radxa | <a href="NixOS_on_ARM/Radxa_ROCK_4" class="wikilink" title="ROCK 4">ROCK 4</a> | Rockchip RK3399 | AArch64 | 2× Cortex-A72, 4×Cortex-A53 | 2/4 GB | eMMC, microSD, NVMe via expansion board |
| Radxa | <a href="NixOS_on_ARM/Radxa_ROCK5_Model_B" class="wikilink" title="ROCK5 Model B">ROCK5 Model B</a> | Rockchip RK3588 | AArch64 | 4× Cortex-A76 @ 2.4GHz, 4×Cortex-A55 @ 1.8 GHz | 4/8/16 GB | eMMC, microSD, NVMe |
| Radxa | <a href="NixOS_on_ARM/Radxa_ROCK5_Model_A" class="wikilink" title="ROCK5 Model A">ROCK5 Model A</a> | Rockchip RK3588s | AArch64 | 4× Cortex-A76 @ 2.4GHz, 4×Cortex-A55 @ 1.8 GHz | 4/8/16 GB | eMMC, microSD, NVMe |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi" class="wikilink" title="Raspberry Pi">Raspberry Pi</a> | Broadcom BCM2835 | ARMv6 | 1 × ARM1176 @ 700 MHz | 256 MB / 512 MB | SD/microSD |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi" class="wikilink" title="Raspberry Pi 2">Raspberry Pi 2</a> | Broadcom BCM2836 | ARMv7 | 4× Cortex-A7 @ 900 MHz | 1 GB | SD/microSD |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_3" class="wikilink" title="Raspberry Pi 3">Raspberry Pi 3</a> | Broadcom BCM2837 | AArch64 / ARMv7 | 4× Cortex-A53 @ 1.2 GHz | 1 GB | SD/microSD |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_4" class="wikilink" title="Raspberry Pi 4">Raspberry Pi 4</a> | Broadcom BCM2711 | AArch64 / ARMv7 | 4× Cortex-A53 @ 1.5 GHz | 1-8 GB | microSD |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_5" class="wikilink" title="Raspberry Pi 5">Raspberry Pi 5</a> | Broadcom BCM2712 | AArch64 | 4× Cortex-A76 @ 2.4 GHz | 4-8 GB | microSD |
| Toshiba | <a href="NixOS_on_ARM/Toshiba_AC100" class="wikilink" title="AC100 (mini laptop)">AC100 (mini laptop)</a> | Tegra 2 250 (T20) | ARMv7 | 2× Cortex-A9 @ 1 GHz | 512 MB | 8­­–32 GB eMMC, SD |
| Wandboard | <a href="NixOS_on_ARM/Wandboard" class="wikilink" title="Wandboard Solo/Dual/Quad">Wandboard Solo/Dual/Quad</a> | Freescale i.MX6 | ARMv7 | 1×/2×/4× Cortex-A9 @ 1000 MHz | 512 MB / 1 GB / 2 GB | microSD, SATA |

</div>

</div>

<span id="Special_Devices"></span>

#### Особые устройства

С помощью QEMU можно эмулировать платформу ARM.

<div lang="en" dir="ltr" class="mw-content-ltr">

<div class="table">

| Manufacturer | Board | SoC | ISA | CPU | RAM | Storage |
|----|----|----|----|----|----|----|
| QEMU | <a href="NixOS_on_ARM/QEMU" class="wikilink" title="QEMU">QEMU</a> | — | ARMv7 | up to 8 | up to 2 GB | Anything QEMU supports |

</div>

</div>

<span id="Installation"></span>

## Установка

<span id="Initial_configuration"></span>

## Начальная настройка

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<span id="Troubleshooting"></span>

## Устранение неполадок

<div lang="en" dir="ltr" class="mw-content-ltr">

### Hanging at `Starting kernel ...`

When booting a NixOS system, it may look like it is hung at `Starting kernel ...`.

</div>

Маловероятно, что он завис на этом этапе. Это последнее сообщение, выводимое U-Boot. U-Boot печатает сразу и на дисплей, и в консоль.

Для просмотра сообщений ядра и вывода загрузки необходимо соответствующим образом настроить "`stdout`" ядра.

`stdout` ядра будет отличаться в зависимости от семантики.

<div lang="en" dir="ltr" class="mw-content-ltr">

- When there are no valid `console=` kernel command-line arguments, it will default to the `/chosen/stdout-path` device tree property. (Generally a serial console.)
- When valid `console=` parameters are present, the kernel picks the leftmost valid one as `stdout`.

</div>

Другими словами, решение может заключаться в том, чтобы включить соответствующие параметры `console=` в соответствии с конфигурацией вашего оборудования и системы.

- Для дисплея добавьте `console=tty0`.
- Для серийной консоли обратитесь к конфигурации целевого устройства.

<span id="Details_about_the_boot_process"></span>

### Подробные сведения о процессе загрузки

NixOS также может быть загружена через <a href="NixOS_on_ARM/UEFI" class="wikilink" title="UEFI">UEFI</a> на ARM. Семантика в целом такая же, как и на других архитектурах. Обратите внимание, что частое использование Device Tree вместо ACPI в аппаратном обеспечении потребительского класса <a href="NixOS_on_ARM/UEFI#Device_Trees" class="wikilink" title="может сделать это немного более неудобным"><em>может</em> сделать это немного более неудобным</a>.

<div lang="en" dir="ltr" class="mw-content-ltr">

Otherwise, in SBC-class hardware, it is common that boards are generally expected to use U-Boot as the platform firmware and bootloader. See the section about <a href="U-Boot#Using_NixOS_with_U-Boot" class="wikilink" title="using NixOS with U-Boot">using NixOS with U-Boot</a>.

</div>

<span id="Binary_caches"></span>

## Бинарные кэши

<span id="AArch64"></span>

### Aarch64

Инстанс [official NixOS Hydra](https://hydra.nixos.org/) собирает полный набор бинарных файлов (доступны на <https://cache.nixos.org>) для архитектуры AArch64 на каналах nixpkgs-unstable и stable.

<span id="armv6l_and_armv7l"></span>

### armv6l и armv7l

Некоторые ***пользователи*** в прошлом предлагали кэши для 32-битных ARM, но в настоящее время ни один из них не доступен.

<span id="Getting_Support"></span>

## Получение поддержки

<div lang="en" dir="ltr" class="mw-content-ltr">

There is a dedicated room for the upstream NixOS effort on Matrix, [\#nixos-on-arm:nixos.org](https://matrix.to/#/#nixos-on-arm:nixos.org).

</div>

Не стесняйтесь задавать вопросы. Обратите внимание, что время ответа может сильно отличаться в зависимости от предоставленной информации.

<span id="Resources"></span>

## Источники

<span id="See_also"></span>

### См. также

- <a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>, поскольку он часто используется в паре с оборудованием класса SBC.
- [Mobile NixOS](https://mobile.nixos.org/), который обеспечивает расширенную семантику некоторых нестандартных семантик загрузки.

<span id="Subpages"></span>

### Подстраницы

Ниже приведен список всех подстраниц темы *NixOS на ARM*.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
