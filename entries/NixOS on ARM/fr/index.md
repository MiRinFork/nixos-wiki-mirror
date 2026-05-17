<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/fr -->

<languages/>

<div style="font-size: 1.5rem; text-align: center;padding-bottom: 0.5rem;">

<strong>NixOS supporte les ARM 64-bit.</strong>

</div>

Le niveau de support global d'ARM varie en fonction de l'architecture, des écosystèmes spécifiques et des cartes.

La manière dont ARM est intégré dans NixOS consiste à créer des **constructions génériques de premier ordre**. Cela veut dire qu'à partir du moment où une carte est supportée en amont par le noyau et le micrologiciel de plateforme, NixOS est censé fonctionner sur ces cartes dès lors qu'ils sont mis à jour.

Il est néanmoins possible, si nécessaire, de construire et utiliser un micrologiciel de plateforme et un noyau personnalisés pour des cartes spécifiques<sup><a href="Talk:NixOS_on_ARM#NixOS_.22support.22_for_board-specific_kernels_or_bootloaders" class="wikilink" title="[référence nécessaire">[référence nécessaire</a>\]</sup>.

À ce jour (début 2024) **seul AArch64** dispose d'un support complet en amont. Ceci dit, cela ne veut pas dire qu'armv6l ou armv7l sont ignorés pour autant, des corrections sont développées et approuvées au besoin. Ce qui fait défaut sont le support et la construction de binaires. Au moment de l'écriture de cet article, il n'y a pas de caches disponibles pour armv6l ou armv7l.

**Pour les liens vers les images disque, incluant les installations UEFI** dirigez-vous vers la <a href="NixOS_on_ARM/Installation" class="wikilink" title="page d&#39;installation">page d'installation</a>.

<span id="Supported_devices"></span>

## Périphériques supportés

Légende du tableau:

- SoC - <https://fr.wikipedia.org/wiki/Syst%C3%A8me_sur_une_puce>
- ISA - <https://en.wikipedia.org/wiki/Instruction_set_architecture>

<span id="Upstream_(NixOS)_supported_devices"></span>

### Périphériques supportés en amont (NixOS)

NixOS supporte ces cartes d'architecture AArch64 sur les canaux nixpkgs-unstable et stable.

Le support de ces cartes est le même que celui fournit par les distributions Linux standard.

<div class="table">

| Constructeur | Carte | SoC | ISA | CPU | RAM | Stockage |
|----|----|----|----|----|----|----|
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_3" class="wikilink" title="Raspberry Pi 3">Raspberry Pi 3</a> | Broadcom BCM2837 | AArch64 / ARMv7 | 4× Cortex-A53 @ 1.2 - 1.4 GHz | 1 GB | SD/microSD |
| Raspberry Pi Foundation | <a href="NixOS_on_ARM/Raspberry_Pi_4" class="wikilink" title="Raspberry Pi 4">Raspberry Pi 4</a> | Broadcom BCM2711 | AArch64 / ARMv7 | 4× Cortex-A72 @ 1.5 - 1.8 GHz | 1-8 GB | microSD, eMMC |

</div>

### Périphériques supportés par la communauté

Ces cartes ne sont pas assurés d'être fonctionnelles.

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

#### Périphériques particuliers

Il est possible d'émuler la plateforme ARM avec QEMU.

<div class="table">

| Constructeur | Carte | SoC | ISA | CPU | RAM | Stockage |
|----|----|----|----|----|----|----|
| QEMU | <a href="NixOS_on_ARM/QEMU" class="wikilink" title="QEMU">QEMU</a> | — | ARMv7 | jusqu'à 8 | jusqu'à 2 GB | Tout ce que QEMU supporte |

</div>

## Installation

<span id="Initial_configuration"></span>

## Configuration initiale

<span id="Troubleshooting"></span>

## Dépannage

### Bloqué à `Starting kernel ...`

Le démarrage de NixOS peut sembler être bloqué à `Starting kernel ...`.

Il est peu probable que le processus soit bloqué à ce niveau. Ceci est le dernier message affiché par U-Boot. U-Boot affiche en même temps l'écran et la console.

Pour voir les messages du noyau et la sortie du démarrage, le “`stdout`” du noyau doit être configuré de manière appropriée.

Le `stdout` du noyau varie en fonction de la sémantique.

- Lorsqu'il n'y a pas d'argument `console=` valide dans la ligne de command du noyau, la valeur par défaut utilisée est celle de la propriété `/chosen/stdout-path` de l'arborescence de périphérique. (Généralement une console de série.)
- Quand plusieurs paramètres `console=` sont présents, le noyau prend seulement en compte la première valeur valide pour `stdout`.

En d'autre termes, la solution est d'activer le paramètre `console=` approprié en fonction de la configuration de votre matériel et de votre système.

- Pour l'écran, ajouter `console=tty0`.
- Pour la console de série, référez-vous à la configuration du périphérique cible.

<span id="Details_about_the_boot_process"></span>

### Détails sur le processus de démarrage

NixOS peut également être démarré sur ARM avec l'<a href="NixOS_on_ARM/UEFI" class="wikilink" title="UEFI">UEFI</a>. La sémantique est généralement la même que sur les autres architectures. Notez que l'utilisation d'arborescence de périphérique au lieu d'ACPI dans le matériel grand public <a href="NixOS_on_ARM/UEFI#Device_Trees" class="wikilink" title="peut rendre cela légèrement bizarre"><em>peut</em> rendre cela légèrement bizarre</a>.

Il est courant pour le matériel de classe SBC que les cartes utilisent U-Boot comme micrologiciel de plateforme et comme chargeur de démarrage. Consultez la section sur <a href="U-Boot#Utiliser_NixOS_avec_U-Boot" class="wikilink" title="utiliser NixOS avec U-Boot">utiliser NixOS avec U-Boot</a>.

<span id="Binary_caches"></span>

## Caches de binaires

### AArch64

L'instance [officielle Hydra de NixOS](https://hydra.nixos.org/) construit un ensemble complet de binaires (disponibles sur <https://cache.nixos.org>) pour l'architecture AArch64 sur les canaux nixpkgs-unstable et stable.

### armv6l and armv7l

Par le passé, certains ***utilisateurs*** ont fait de leur mieux pour fournir des caches pour ARM 32 bit, cependant aucun n'est actuellement disponible.

<span id="Getting_Support"></span>

## Obtenir de l'aide

<div lang="en" dir="ltr" class="mw-content-ltr">

There is a dedicated room for the upstream NixOS effort on Matrix, [\#nixos-on-arm:nixos.org](https://matrix.to/#/#nixos-on-arm:nixos.org).

</div>

N'hésitez pas à poser des questions. Notez cependant que le temps de réponse peut grandement varier en fonction du niveau d'information fournit.

<span id="Resources"></span>

## Ressources

<span id="See_also"></span>

### Voir également

- <a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>, souvent associé au matériel de type SBC.
- [Mobile NixOS](https://mobile.nixos.org/) qui fournit une sémantique améliorée pour des sémantiques de démarrage non standard.

<span id="Subpages"></span>

### Sous-pages

Ci-dessous une liste des sous-pages du sujet *NixOS sur ARM*.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
