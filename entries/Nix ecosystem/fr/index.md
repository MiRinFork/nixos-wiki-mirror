<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix ecosystem/fr -->

<languages/> L**'Écosystème cœur de Nix** est un éventail de technologies créées pour construire de manière reproductible et configurer/gérer de manière déclarative des paquets et systèmes ainsi que leurs dépendances. Ceci est rendu possible via un transfert du paradigme fonctionnel des programmes au domaine système grâce à un langage dédié (DSL) dynamique et fonctionnel à évaluation paresseuse appelé <a href="Overview_of_the_Nix_Language" class="wikilink" title="langage Nix">langage Nix</a> qui permet la génération d'artefacts reproductibles.

Il existe également de nombreuses autres <a href="applications" class="wikilink" title="applications">applications</a> (***Écosystème Nix étendu)*** développées par la communauté Nix, utilisant et supportant ces technologies centrales.

<span id="Official_ecosystem"></span>

## Écosystème officiel

| Composant | Manuel | Description | Usage | Licence |
|----|----|----|----|----|
| <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> | [Manuel NixOS](https://nixos.org/nixos/manual/) | Une distribution Linux dont « tous » les composants sont générés par Nix, permettant ainsi une gestion reproductible et déclarative de la configuration à l'échelle du système, ainsi que des mises à jour et des retours en arrière atomiques. | Configurer de manière déclarative les postes de travail, les serveurs et les clusters | MIT |
| <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> | [Manuel Nixpkgs](https://nixos.org/nixpkgs/manual/) | Le plus grand référentiel communautaire de paquets Nix et de modules NixOS ; les versions officielles de NixOS y sont hébergées. | Partager des paquets Nix et des modules NixOS | MIT |
| <a href="Special:MyLanguage/Hydra" class="wikilink" title="Hydra">Hydra</a> | [Manuel Hydra](https://nixos.org/hydra/manual/) | Un système de construction continue d'artefact basé sur Nix. | Fermes de construction d’artefacts pour l'intégration continue | GPL-3.0 |
| <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> | [Manuel Nix](https://nixos.org/nix/manual/) | Un gestionnaire de paquets qui analyse les expressions Nix décrivant la construction d'artefacts reproductibles, plaçant le résultat dans un emplacement de l'espace de stockage avec un hachage de l'arborescence des dépendances, évitant ainsi l'enfer des dépendances et permettant l'installation de plusieurs versions d'un même programme ainsi que les restaurations. | Construction d'artefacts reproductibles et gestion des paquets Linux & Darwin | LGPL-2.1 |

Composants au cœur de l'écosystème Nix

<table style="width:20%;">
<caption><strong>Pile de l'écosystème au cœur de NixOS</strong></caption>
<colgroup>
<col style="width: 20%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>NixOS</p>
</div>
<p>Une distribution Linux et un système de configuration développés à l'aide de Nixpkgs.</p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nixpkgs</p>
</div>
<p>Un vaste dépôt de paquets géré par la communauté.</p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nix</p>
</div>
<p>Un système de compilation épuré et fonctionnel.</p></td>
</tr>
</tbody>
</table>

<span id="Usage_of_NixOS"></span>

## Utilisation de NixOS

Les utilisateurs installent la distribution *NixOS* sur leur ordinateur comme n'importe quelle autre distribution Linux. Ils découvrent les paquets disponibles et les options de configuration de *Nixpgs* via <https://search.nixos.org> et ce wiki. Ils utilisent le langage *Nix* pour décrire de manière déclarative dans un fichier texte quels logiciels doivent être installés et comment configurer le système. Ils exécutent deux programmes en ligne de commande dans un terminal afin d'obtenir un système tel qu'ils l'ont décrit. Ils utilisent ce système comme n'importe quel autre système Linux.

<span id="Development_of_NixOS"></span>

## Développement de NixOS

Les développeurs de *NixOS* travaillent principalement dans *Nixpkgs* en décrivant dans des fichiers textes écrits en langage *Nix* comment les logiciels doivent être construits. Après une revue par les pairs des changements, ils sont intégrés dans *Nixpkgs*. Certains de ces paquets sont pré-construits par *Hydra* afin de réduire le temps d'installation pour les utilisateurs de *NixOS*.

- La gestion des paquets s'effectue via « Nixpkgs » et n'est pas réservée à « NixOS », ni même aux plateformes basées sur Linux. Les responsables de paquets qui ne sont pas exclusifs à « NixOS » (tels que les outils nécessaires au fonctionnement de la distribution elle-même) prennent généralement en charge plusieurs plateformes, bien que cela ne soit pas strictement obligatoire.

<!-- -->

- Le système de modules est le principal moyen de configuration des services fonctionnant sous « NixOS ». Ce domaine s'étend de la configuration « de bas niveau », comme les fichiers d'unité « systemd » ou la configuration personnalisée du noyau, jusqu'à la génération de fichiers de configuration pour des services spécifiques. Le système de modules est le principal moyen pour les utilisateurs de configurer « NixOS » ; il se trouve dans le sous-répertoire `nixos/` de « Nixpkgs ».

<!-- -->

- La documentation est en grande partie intégrée aux données des paquets et du système de modules, bien que le dépôt « Nixpkgs » contienne également des fichiers Markdown autonomes. La documentation comprend également la gestion du site web, du wiki et d'autres aspects de l'écosystème au sens large. Les deux premières catégories sont presque exclusivement constituées de code en langage « Nix » écrit dans des fichiers texte, tandis que la dernière est un mélange de code « Nix », de fichiers Markdown et de divers autres formats.

Toutes les contributions à « Nixpkgs », qu'elles concernent ou non « NixOS », sont soumises à un examen par les pairs avant d'être intégrées à « Nixpkgs ». De nombreux paquets, ainsi que la documentation et les ressources complémentaires telles que les images ISO ou les archives tar, sont précompilés sur « Hydra » afin de réduire le temps de mise à jour pour les utilisateurs de « NixOS ».

Ces trois catégories sont les plus importantes en termes de volume de contributions, mais de nombreux contributeurs s'impliquent également dans des activités liées à la fondation NixOS, qu'il s'agisse de gérer l'infrastructure sur laquelle fonctionnent le site web « Hydra » et d'autres outils, ou de développer les outils nécessaires à NixOS.

| Type de développement | Lieu du Développement | Exemples |
|----|----|----|
| Emballage indépendant de la plateforme | *Nixpkgs* | [coreutils package](https://github.com/NixOS/nixpkgs/blob/bf3287dac860542719fe7554e21e686108716879/pkgs/tools/misc/coreutils/default.nix), [*stdenv* framework](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/stdenv), [Libreoffice package](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/applications/office/libreoffice/default.nix) |
| Outils indépendants de la plateforme | « Nixpkgs » et divers dépôts | [upstream/default Nix implementation (CppNix)](https://github.com/NixOS/nix), [*Hydra* source code](https://github.com/NixOS/hydra), [*Nixpkgs* merge bot](https://github.com/NixOS/nixpkgs-merge-bot) |
| Outils « NixOS » | principalement « Nixpkgs » | [nixos-rebuild-ng source code](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/by-name/ni/nixos-rebuild-ng), [*NixOS* Installation ISOs](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix) |
| Système de modules *NixOS* | *Nixpkgs* | [Display Manager configuration](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/display-managers/default.nix), [MySQL (and derivative) database configuration](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/databases/mysql.nix) |
| Infrastructure |  | [Infrastructure for this Wiki](https://github.com/NixOS/nixos-wiki-infra), [*NixOS* infra](https://github.com/NixOS/infra) |
| Documentation |  | [This Wiki](https://wiki.nixos.org), [*stdenv* documentation](https://github.com/NixOS/nixpkgs/blob/8d92119c540d78599ba208010c722a60958810f4/doc/stdenv/stdenv.chapter.md), [*NixOS* IPv6 configuration](https://github.com/NixOS/nixpkgs/blob/master/nixos/doc/manual/configuration/ipv6-config.section.md) (visible in the [IPv6 section of the *NixOS* manual](https://nixos.org/manual/nixos/stable/#sec-ipv6)), [*Nixpkgs* Contribution Guidelines](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md) |
| Organisation Technique |  | [*NixOS* RelEng](https://github.com/NixOS/nixpkgs/issues/390768), [*Nix* and *NixOS* RFCs](https://github.com/NixOS/rfcs/) |
| Autre |  | [*NixOS* artwork](https://github.com/NixOS/nixos-artwork), [*NixOS* (and related) discourse](https://discourse.nixos.org/), [*NixOS Foundation*](https://github.com/NixOS/foundation) |

Quelques exemples de développement de « NixOS », accompagnés de liens.

Voir aussi: [Référentiel de l'organisation Nix](https://github.com/NixOS/org).

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
