<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/UEFI/fr -->

<languages/>

Cette section de la documentation NixOS sur ARM a pour but de documenter le plus d'éléments possibles pour démarrer *n'importe quelle* carte ARM utilisant l'UEFI. Ce document se concentre particulièrement sur les *ordinateurs à carte unique* (aussi appelés SBCs), étant donné que c'est pour ceux-ci que le démarrage est le plus compliqué, voir carrément impossible.

<span id="The_Basics_First"></span>

## Les bases

<span id="Target_Support"></span>

### Support cible

Certains points ne seront pas spécifiques à UEFI. Pour exemple, le support en fonction du noyau utilisé. Ce document présume que les distributions Linux standard fonctionnent sur le système cible afin d'envisager l'installation depuis une image disque (ISO) générique.

Tout comme il est possible de le faire sur `x86_64`, vous pouvez construire une image disque personnalisée. Les détails sur une telle opération sortent du cadre de cet article. Les mêmes pièges sont à prévoir et éviter. Par exemple, la configuration générée ne prendra pas en compte la personnalisation de la configuration du noyau.

<span id="Platform_Firmware"></span>

### Micrologiciel de plateforme

Définissons d'abord ce qu'est un **micrologiciel de plateforme**. C'est un terme générique utilisé pour décrire la première chose démarrée par le processeur lors du démarrage. Sur un système `x86_64`, il s'agit de ce qu'on appelait autrefois le *BIOS*. Aujourd'hui souvent appelé *EFI*. C'est ce qui initialise suffisamment de matériel pour que le système d'exploitation puisse démarrer. De plus, il offre souvent à l'utilisateur d'effectuer une configuration basique ainsi que la gestion des options de démarrage.

Dans le monde ARM des SBC, ***<a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>*** est la solution de facto pour le *micrologiciel de plateforme*. Bien que *U-Boot* soit souvent appelé à confusion, mais à juste titre, *Boot Loader*, il joue souvent un double rôle. Il est chargé d*'initialiser le matériel* mais est également utilisé pour gérer *le chargement et le démarrage* du système d'exploitation.

### UEFI

Le *[standard UEFI](https://fr.wikipedia.org/wiki/UEFI)* n'est pas quelque chose de tangible par lui-même. Mal résumé, il s'agit d'une spécification fournissant une *interface* qui décrit le processus de démarrage standard et comprend un environnement avant le démarrage du système ainsi que des protocoles pour les systèmes d'exploitation.

Il existe plusieurs implémentation de l'UEFI. Des constructeurs tels que *American Megatrends*, *Phoenix Technologies* et *Insyde Software* ont probablement produit celui présent sur votre machine `x86_64`. **TianoCore** est *la* référence open source des implémentations UEFI. Heureusement, *U-Boot* implémente suffisamment (et même un peu plus que) la spécification UEFI.

<span id="SBBR?_EBBR?"></span>

#### SBBR ? EBBR ?

Bien que barbares, ces sigles signifient respectivement en anglais *Server Base Boot Requirements* et *Embedded Base Boot Requirements*, qu'on pourrait traduire par *Exigences de démarrage de base du serveur* et *Exigences de démarrage de base intégrée*. Ce sont deux spécifications pour ARM. Si votre système cible est en conformité avec l'une d'entre elles, le démarrage UEFI devrait être pris en charge. Avec la prise en charge minimale présente dans *U-Boot*, les systèmes cibles qui ne sont pas conforme avec la spécification EBBR peuvent être rendues conformes, ou presque, en supportant le strict minimum.

<span id="UEFI,_on_my_SBC???"></span>

## UEFI, sur mon SBC ???

Croyez-le ou non, c'est bien plus probable que vous ne le pensez si votre SBC est bien pris en charge par *<a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>*. *U-Boot* fournit suffisamment d'UEFI pour se conformer à EBBR, qui à son tour est suffisant pour démarrer l'image disque `AArch64` UEFI de NixOS. Et ceci avec quasiment aucune différence par rapport au guide `x86_64`. Suivez simplement les instructions pour démarrer sur un système installé.

<span id="Getting_a_Platform_Firmware"></span>

<div class="mw-translate-fuzzy">

## Obtenir un *micrologiciel de plateforme*

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

As an opinionated example, you can get started with [Tow-Boot, a *U-Boot* distribution](https://github.com/Tow-Boot/Tow-Boot), which is intended to make the initial setup a bit easier by abstracting the platform differences so that they do not matter.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Where supported, Nix can be used to build U-boot from its main-line repositories. See <a href="U-Boot#Building_a_packaged_U-Boot" class="wikilink" title="U-Boot#Building a packaged U-Boot">U-Boot#Building a packaged U-Boot</a> for further information. The resulting firmware image can then be flashed to SPI with tools such as `flashcp` or `flashrom`, or installed to EMMC/SD card by writing to specific offsets. This is platform specific, refer to [upstream U-boot documentation for your platform or board](https://github.com/u-boot/u-boot/tree/master/doc/board).

</div>

N'importe quel autre *micrologiciel de plateforme* conforme UEFI peut être utilisé.

<span id="Getting_the_installer_image_(ISO)"></span>

### Obtenir l'image disque d'installation

Choisissez l'une des images suivantes (par ordre de préférence):

- [NixOS instable, nouveau noyau](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal_new_kernel_no_zfs.aarch64-linux) – publication continue, dernier noyau, n'inclut pas ZFS étant donné qu'il est souvent en retard.
- [NixOS instable, noyau LTS](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal.aarch64-linux) – compatibilité avec du matériel spécifique amoindrit, mais utilise une version plus récente de Nixpkgs
- [NixOS stable](https://nixos.org/download.html#download-nixos) – branche stable, noyau LTS, généralement non recommandé à moins d'être certain que votre matériel soit bien supporté

Des images disque avec environnement graphique GNOME ou KDE sont également disponibles.

Cette image disque d'installation devrait être écrite sur une clé USB, comme d'habitude. Elle peut à la rigueur être écrite sur une carte SD si le micrologiciel de votre plateforme n'a pas besoin d'être écrit sur cette même carte.

<span id="Installing"></span>

### Installation

Il suffit de suivre [les instructions habituelles d'installation pour UEFI](https://nixos.org/manual/nixos/stable/index.html#sec-installation) en tenant compte des points d'attention suivants.

<span id="Shared_Firmware_Storage"></span>

#### Stockage partagé du micrologiciel

Si votre *micrologiciel de plateforme* se trouve sur le même média que l'image disque d'installation, e.g. écrit sur une carte SD depuis laquelle vous effectuez l'installation, vous devez vous assurer que:

- Vous n'écrasez pas le micrologiciel s'il ne se trouve pas sur une partition.
- La table de partition n'est pas réécrite depuis zéro.
- Vous ne supprimez pas les partitions existantes du micrologiciel.

En dehors de ces points, vous pouvez procéder comme vous le feriez d'habitude en créant une partition ESP, FAT32, monter sur `/boot/`, votre partition rootfs préférée, le swap si vous le souhaitez, etc.

<span id="Bootloader_configuration"></span>

#### Configuration du chargeur de démarrage

Vérifiez que l'implémentation UEFI de votre *micrologiciel de plateforme* dispose de variables EFI inscriptible. Toutes les implémentations UEFI ne le permettent pas sur ARM, c'est donc un élément à prendre en compte. Si ce n'est pas le cas, doit être définit sur **`false`**.

Cette extrait utilise GRUB2, mais systemd-boot fonctionne également. Comme les variables EFI ne peuvent pas être manipulées, utiliser `efiInstallAsRemovable` permet l'installation de GRUB2 à l'emplacement de secours.

<span id="General_Tips"></span>

### Astuces générales

Utiliser le dernier noyau disponible est une bonne idée. Le support matériel pour les plateformes ARM étant en constante amélioration, utiliser le dernier noyau plutôt que la "dernière LTS" pourrait être bénéfique… ou pas.

<span id="Known_Issues"></span>

## Problèmes connus

<span id="Device_Trees"></span>

### Arborescence de périphériques

À ce jour, il n'y a pas de consensus parmi les distributions Linux à propos de la gestion de l'arborescence des périphériques lors de processus de démarrage UEFI.

La configuration actuelle s'appuie sur le micrologiciel de plateforme pour fournir une arborescence de périphériques appropriée pour le noyau à exécuter.

Il est possible de faire charger une arborescence de périphériques par *U-Boot*, plus récente par exemple, en plaçaant le dossier dtb d'une construction de noyau à l'emplacement `/dtb` de l'ESP. *U-Boot* chargera automatiquement une arborescence de périphériques selon l'heuristique, qui devrait être la bonne.

En pratique, on ne sait pas dans quelle mesure cela constituerait un réel problème.
