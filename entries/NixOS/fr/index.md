<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS/fr -->

<languages/>

<div class="mw-translate-fuzzy">

[NixOS](https://nixos.org/) est une distribution Linux basée sur <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> un gestionnaire de paquets et un système de construction. À l'échelle du système, il supporte la [programmation déclarative](https://fr.wikipedia.org/wiki/Programmation_déclarative) au travers d'une [gestion de configuration](https://fr.wikipedia.org/wiki/Gestion_de_configuration) ainsi que les mises à jour [atomiques](https://fr.wikipedia.org/wiki/Atomicité_(informatique)) et les "retours en arrière" (rollbacks), bien qu'il puisse aussi supporter des paquets [impératifs](https://fr.wikipedia.org/wiki/Programmation_impérative) ainsi que la gestion des utilisateurs. Dans NixOS, tous les composants de la distribution — y compris le [noyau Linux](https://fr.wikipedia.org/wiki/Noyau_Linux), les [paquets](https://fr.wikipedia.org/wiki/Gestionnaire_de_paquets) installés et les fichiers de configuration système — sont construits par <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> depuis des <a href="Wikipedia:Pure_function" class="wikilink" title="fonctions pures">fonctions pures</a> appelées <a href="Special:MyLanguage/Nix_Expression_Language" class="wikilink" title="expressions Nix">expressions Nix</a>.

</div>

<div class="mw-translate-fuzzy">

Depuis que Nix met des [exécutables](https://fr.wikipedia.org/wiki/Fichier_exécutable) en cache, cela permet d'avoir un compromis unique entre une approche orientée autour de l'exécutable présente dans des distributions comme Debian et une approche orientée autour du [code source](https://fr.wikipedia.org/wiki/Code_source) utilisée dans des distributions comme Gentoo. Les binaires peuvent être utilisés comme des composants standard, tandis que les paquets sur-mesure et les modules peuvent être utilisés automatiquement quand un binaire pré-compilé n'est pas disponible.

</div>

<div class="mw-translate-fuzzy">

Les versions stables de NixOS sont publiées deux fois par an (vers la fin mai et la fin novembre). NixOS a été créé par [Eelco Dolstra](https://edolstra.github.io/) et [Armijn Hemel](https://en.wikipedia.org/wiki/Armijn_Hemel), et a vu le jour en 2003. Il est développé et maintenu par la communauté sous l'égide de la <a href="Special:MyLanguage/Nix_Community#NixOS_Foundation" class="wikilink" title="Fondation NixOS">Fondation NixOS</a>.

</div>

## Installation

Pour un guide d'installation complet, voir le [chapitre "Installation" du guide de NixOS](https://nixos.org/nixos/manual/index.html#ch-installation). Ce wiki inclut aussi des alternatives ou des guides supplémentaires, comme : <a href="Special:MyLanguage/NixOS_as_a_desktop" class="wikilink" title="Utiliser NixOS comme système de bureau">Utiliser NixOS comme système de bureau</a>.

La plupart des utilisateurs vont installer NixOS via [une des images ISO](https://nixos.org/download/#nixos-iso). Les variantes "graphique" et "minimale" de l'ISO sont disponibles pour chaque architecture supportée ; les images "graphiques" sont adaptées pour les utilisateurs souhaitant installer un environnement de bureau, et les images "minimales" sont conçues pour les utilisateurs souhaitant installer NixOS comme serveur, ou désirant des images ISO de taille réduite. Les images ISO sont des images hybrides qui peuvent être gravées sur des supports optiques ou copiées sur une clé USB et utilisées telles quelles. Voir le guide d'installation pour plus de détails.

En supplément des images ISO, la [page de téléchargement](https://nixos.org/download/#nixos-iso) apporte un certain nombre de méthodes alternatives pour installer NixOS. Cela inclut :

- Des machines virtuelles au format OVA (compatible avec VirtualBox),
- Amazon EC2 AMIs,

De plus, de nombreuses installations Linux existantes peuvent être converties en installations NixOS à l'aide de nixos-infect ou nixos-in-place; cela s'avère particulièrement utile pour installer NixOS chez des hébergeurs qui ne prennent pas en charge NixOS de manière native.

<span id="System_architectures"></span>

## Architectures système

NixOS fournit de manière native le support pour la plupart des appareils x86_64, ainsi que les appareils ARM64 génériques.

<span id="32-bit_x86_architectures"></span>

#### Architectures 32-bit x86

Le support des architectures 32-bit x86 (par exemple `i686`) est en déclin. Même si la plupart des paquets devraient toujours compiler et s'exécuter, la disponibilité de leur cache est significativement réduite [^1]. L'ISO 32-bit x86 n'est dorénavant plus proposée en tant qu'image prête à l'emploi, mais peut toujours être compilée manuellement.

<span id="64-bit_x86_architectures"></span>

#### Architectures 64-bit x86

La plupart des appareils `x86_64` devraient faire fonctionner NixOS sans problème.

<span id="32-bit_ARM_architectures"></span>

#### Architectures 32-bit ARM

NixOS n'est pas officiellement supportée sur les appareils ARM32 (tels que `armv6` et `armv7l`), cependant, pour certains de ces appareils, il pourrait y avoir un support de la communauté.

<span id="64-bit_ARM_architectures"></span>

#### Architectures 64-bit ARM

Tant qu'un appareil supporte le procédé de démarrage générique stystemd, NixOS devrait fonctionner parfaitement. Cependant, certains appareils spécifiques avec des bootloaders propriétaires peuvent avoir des problèmes pour faire tourner NixOS.

<span id="MIPS_architectures"></span>

#### Architectures MIPS

Par le passé, il y avait un support limité pour les architectures MIPS dans NixOS, et les restes de ce support peuvent peut-être être trouvées dans Nixpkgs. Cependant, il n'y a pas de support officiel.

<span id="RISC-V_architectures"></span>

#### Architectures RISC-V

NixOS ne fournit pas de support officiel pour les appareils RISC-V. Cependant, plusieurs appareils peuvent bénéficier du support de la communauté.

## Usage

<span id="declarative-configuration"></span>

<span id="Declarative_Configuration"></span>

### Configuration Déclarative

Un des piliers de NixOS est son modèle de configuration déclarative ; où l'ensemble de l'état du système — y compris les paquets installés, les services système et les paramètres — est décrit dans des fichiers de configuration. Le fichier de départ est généralement situé ici : /etc/nixos/configuration.nix.

Les changements de configuration sont appliqués atomiquement en utilisant `nixos-rebuild switch`, assurant la reproductibilité et permettant de revenir en arrière à un état précédant (rollback). La plupart des utilisateurs suivent leurs fichiers de configurations à l'aide d'un logiciel gestionnaire de versions, permettant des configurations cohérentes et portables. Ces lacunes sont souvent rectifiées après tir par des solutions de gestion de configuration comme Puppet, Ansible ou encore Chef. Ces outils essayent de rapprocher la configuration système de la description de l'état attendu. Néanmoins, ces outils ne sont pas intégrés dans la conception du système d'exploitation et sont simplement présents "au dessus", et la configuration du système d'exploitation pourrait toujours varier si un aspect de la configuration système n'a pas été spécifié dans la description de l'état attendu.

Contrairement à des distributions plus conventionnelles, où la configuration système est souvent éclatés dans de nombreux fichiers édités manuellement, NixOS intègre la gestion de la configuration directement dans le système d'exploitation. Cela élimine toute dérive de la configuration et permet de rendre NixOS particulièrement adapté pour des déploiements automatisés et reproductibles.

Pour plus de détails et d'exemples sur les configurations NixOS, voir <a href="Special:MyLanguage/NixOS_system_configuration" class="wikilink" title="configurations système NixOS">configurations système NixOS</a>.

<span id="Imperative_Operations"></span>

### Opérations Impératives

Même si NixOS est configurée autant que possible de manière déclarative, il y a quelques domaines où les opérations impératives sont toujours nécessaires ; cela inclut la gestion de l'environnement utilisateur et la gestion des canaux.

<span id="User_Environments"></span>

#### Environnements Utilisateur

En plus de la configuration déclarative du système, les utilisateurs de NixOS peuvent utiliser la commande impérative Nix nommée `nix-env` pour installer des paquets locaux (seulement pour l'utilisateur en question), sans changer l'état du système. Voir la <a href="Special:MyLanguage/Nix#User_Environments" class="wikilink" title=" section de l&#39;article Nix sur les environnements utilisateur"> section de l'article Nix sur les environnements utilisateur</a> pour plus d'information.

<span id="Channels"></span>

#### Canaux

Dans l'<a href="Special:MyLanguage/Nix_ecosystem" class="wikilink" title="écosystème Nix">écosystème Nix</a>, les <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="canaux">canaux</a> (channels en anglais) sont un mécanisme pour distribuer un ensemble de <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="paquets Nix">paquets Nix</a> et de définitions de modules <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>. Un canal représente un ensemble de définitions de paquets et de configurations système, organisé et versionné. Généralement cela correspond à une version particulière ou le dernier état de développement.

Lorsque les canaux sont utilisés, votre système ou l'<a href="Special:MyLanguage/_User_Environment" class="wikilink" title="environnement utilisateur">environnement utilisateur</a> récupère les définitions des paquets et les options depuis une URL qui pointe vers une image de l'ensemble des paquets Nix (Nixpkgs) et les modules NixOS associés.

<div class="mw-translate-fuzzy">

Pour plus d'information sur l'utilisation et la mise en place des canaux, merci de vous référer aux <a href="Special:MyLanguage/channel_branches" class="wikilink" title=" branches"> branches</a>.

</div>

<span id="Internals"></span>

## En interne

<span id="Comparison_with_traditional_Linux_Distributions"></span>

### Comparaison avec les distributions Linux traditionnelles

*Article principal: <a href="Special:MyLanguage/Nix_vs._Linux_Standard_Base" class="wikilink" title="Nix vs. Linux Standard Base">Nix vs. Linux Standard Base</a>*

<div class="mw-translate-fuzzy">

La principale différence entre NixOS et les autres distributions Linux réside dans le fait que NixOS ne suit pas la structure de système de fichiers définie par la [Linux Standard Base](https://en.wikipedia.org/wiki/Linux_Standard_Base). Sur les systèmes conformes à la norme LSB, les logiciels sont stockés sous `/{,usr}/{bin,lib,share}` et les fichiers de configuration sont généralement stockés dans `/etc`. Les binaires logiciels sont disponibles dans l'environnement utilisateur s'ils sont placés dans l'un des répertoires `/bin` de la LSB. Lorsqu'un programme fait référence à des bibliothèques dynamiques, il recherche les bibliothèques requises dans les dossiers LSB (`/lib`, `/usr/lib`).

</div>

<div class="mw-translate-fuzzy">

Dans NixOS, cependant, `/lib` et `/usr/lib` n'existent pas. À la place, toutes les bibliothèques système, les binaires, les noyaux, les micrologiciels et les fichiers de configuration sont placés dans le <a href="Special:MyLanguage/Nix#Nix_store" class="wikilink" title="Nix store">Nix store</a>. Les fichiers et répertoires situés dans `/nix/store` sont nommés d'après les hachages des informations décrivant les données compilées. Tous les fichiers et répertoires placés dans le magasin Nix sont immuables. `/bin` et `/usr/bin` sont pratiquement inexistants : ils ne contiennent respectivement que `/bin/sh` et `/usr/bin/env`, afin d'assurer une compatibilité minimale avec les scripts existants utilisant des lignes shebang. Les environnements au niveau utilisateur sont implémentés à l'aide d'un grand nombre de liens symboliques vers tous les paquets et fichiers auxiliaires requis. Ces environnements sont appelés <a href="Special:MyLanguage/Nix#Profiles" class="wikilink" title="profils">profils</a> et sont stockés dans `/nix/var/nix/profiles`, chaque utilisateur disposant de ses propres profils. C'est en structurant le système de cette manière que NixOS tire ses principaux avantages par rapport aux distributions Linux classiques, tels que l'atomicité et la prise en charge des retours en arrière.

</div>

<span id="Usage_of_the_Nix_store"></span>

### Utilisation du Nix store

Une grande partie de la confusion chez les débutants provient du fait que la configuration est stockée dans l'arborescence en lecture seule `/nix/store`, aux côtés de tous les paquets installés. Cela rend impossible toute modification manuelle de la configuration du système ; toutes les modifications de configuration doivent être effectuées en éditant le fichier `/etc/nixos/configuration.nix` et en exécutant la commande `nixos-rebuild switch`. NixOS fournit le <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="système de modules">système de modules</a> pour modifier toutes les configurations requises. Les utilisateurs doivent d'abord utiliser [l'outil de recherche d'options](https://search.nixos.org/options) pour vérifier si l'option dont ils ont besoin existe avant de tenter d'ajouter manuellement des fichiers ou des configurations via des fonctionnalités de bas niveau de NixOS telles que les scripts d'activation.

La pureté du système permet de centraliser la configuration, sans avoir à modifier plusieurs fichiers. Cette configuration peut être distribuée ou soumise à un contrôle de version, selon les besoins. Elle garantit également le déterminisme : si vous fournissez les mêmes données d'entrée, la même version de Nixpkgs et le même fichier `/etc/nixos/configuration.nix`, vous obtiendrez exactement le même état du système.

### Modules

Le <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="système de modules NixOS">système de modules NixOS</a>, tel qu'il est défini dans <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, fournit les outils nécessaires pour personnaliser la configuration du système d'exploitation. Il sert à activer et à personnaliser des services tels que nginx, à activer le micrologiciel et à personnaliser le noyau.

La configuration des modules s'effectue généralement en ajoutant des options au fichier `/etc/nixos/configuration.nix`. La plupart des exemples présentés dans le wiki montrent comment utiliser ce fichier pour configurer le système d'exploitation.

Le système de modules de NixOS met en œuvre un système de typage qui permet de vérifier le type des paramètres d'options. Il permet également de fusionner automatiquement les options définies à plusieurs endroits. Vous pouvez ainsi répartir votre configuration sur plusieurs fichiers, et les options que vous définissez dans l'ensemble de ces fichiers seront fusionnées :

<div class="mw-translate-fuzzy">

Pour plus d'informations, consultez la \[section « Modules <https://nixos.org/nixos/manual/index.html#sec-writing-modules> » du manuel NixOS\].

</div>

<span id="Generations"></span>

### Générations

Chaque fois que l'état du système est reconstruit à l'aide de l'option `nixos-rebuild switch`, une nouvelle génération est créée. Vous pouvez revenir à la génération précédente à tout moment, ce qui s'avère utile si une modification de configuration (ou une mise à jour du système) s'avère préjudiciable.

Vous pouvez revenir en arrière via :

``` console
$ nix-env --rollback               # roll back a user environment
$ nixos-rebuild switch --rollback  # roll back a system environment
```

ixOS ajoute également des entrées correspondant aux générations précédentes dans le menu du chargeur d'amorçage ; ainsi, en dernier recours, vous pouvez toujours revenir à une configuration antérieure en redémarrant. Pour définir la génération actuellement démarrée comme valeur par défaut, exécutez la commande suivante :

``` console
$ /run/current-system/bin/switch-to-configuration boot
```

Comme NixOS conserve les versions précédentes de l'état du système au cas où vous souhaiteriez revenir en arrière, les anciennes versions des paquets ne sont pas supprimées de votre système immédiatement après une mise à jour. Vous pouvez supprimer ces anciennes versions manuellement :

``` console
$ # delete generations older than 30 days
$ nix-collect-garbage --delete-older-than 30d

$ # delete ALL previous generations - you can no longer rollback after running this
$ nix-collect-garbage -d                       
```

<div class="mw-translate-fuzzy">

Liste les générations:

``` shell
# en tant que root
$ nix-env --list-generations --profile /nix/var/nix/profiles/system
```

</div>

``` console
$ # as root
$ nix-env --list-generations --profile /nix/var/nix/profiles/system
```

<div class="mw-translate-fuzzy">

Changer de génération:

``` shell
# en tant que root passer à la génération 204
$ nix-env --profile /nix/var/nix/profiles/system --switch-generation 204
```

</div>

``` console
$ # as root switch to generation 204
$ nix-env --profile /nix/var/nix/profiles/system --switch-generation 204
```

<div class="mw-translate-fuzzy">

effacer une(des) génération(s) cassée(s):

``` shell
# en tant que root effacer les générations cassées 205 et 206 
$ nix-env --profile /nix/var/nix/profiles/system --delete-generations 205 206
```

</div>

``` console
$ # as root delete broken generations 205 and 206 
$ nix-env --profile /nix/var/nix/profiles/system --delete-generations 205 206
```

Vous pouvez configurer le ramasse-miettes automatique en définissant les options [nix.gc](https://search.nixos.org/options?query=nix.gc) dans le fichier `/etc/nixos/configuration.nix`. Cette configuration est recommandée, car elle permet de limiter la taille du Nix store.

<span id="See_also"></span>

## Voir également

- <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS modules">NixOS modules</a>, a library for modular <a href="Special:MyLanguage/Overview_of_the_Nix_Expression_Language#Expressions" class="wikilink" title="Nix expressions">Nix expressions</a> which powers <a href="#declarative-configuration" class="wikilink" title="the declarative configuration of NixOS">the declarative configuration of NixOS</a>.
- <a href="Special:MyLanguage/NixOS_VM_tests" class="wikilink" title="NixOS VM tests">NixOS VM tests</a>, a library for creating reproducible infrastructure tests, based on <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>, QEMU and Perl.
- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book) (Ryan4yin, 2023) - 🛠️ ❤️ An unofficial NixOS & Flakes book for beginners.

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>

[^1]: <https://discourse.nixos.org/t/limited-cache-availability-for-i686-32-bits-x86-architecture/37626>
