<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/fr -->

<languages/> Nix est un gestionnaire de paquets et un système de compilation qui analyse des instructions de compilation reproductibles spécifiées dans le <a href="Nix_Expression_Language" class="wikilink" title="langage d&#39;expression Nix">langage d'expression Nix</a>, un langage fonctionnel pur avec évaluation paresseuse. Les expressions Nix sont des fonctions pures[^1]qui prennent des dépendances en arguments et produisent une « <a href="Derivations" class="wikilink" title="dérivation">dérivation</a> » spécifiant un environnement de compilation reproductible pour le paquet. Nix stocke les résultats de la compilation à des adresses uniques spécifiées par un hachage de l'arborescence complète des dépendances, créant ainsi un magasin de paquets immuable (également appelé <a href="#Nix_store" class="wikilink" title="nix store">nix store</a>) qui permet des mises à jour atomiques, des retours en arrière et l'installation simultanée de différentes versions d'un paquet, éliminant ainsi pratiquement [l'enfer des dépendances](https://en.wikipedia.org/wiki/Dependency_hell).

<span id="Usage"></span>

## Utilisation

### Installation

Sous <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, Nix est installé automatiquement.

Sur d'autres distributions Linux ou sur macOS, vous pouvez installer Nix en suivant la [section d'installation du manuel de Nix](https://nixos.org/manual/nix/stable/installation/installation).

<span id="Nix_commands"></span>

### Commandes Nix

Les <a href="Nix_(command_line_utilities)" class="wikilink" title="commandes Nix">commandes Nix</a> sont décrites dans le [manuel de référence de Nix](https://nixos.org/manual/nix/stable/command-ref/command-ref) : commandes principales, utilitaires et commandes expérimentales. Avant la version 2.0 (publiée en février 2018), les commandes étaient différentes.

### Configuration

Sous NixOS, Nix peut être configuré à l'aide de l'option \[<https://search.nixos.org/options?query=nix>. `nix`\].

Nix en mode autonome se configure via le fichier `nix.conf` (qui se trouve généralement dans `/etc/nix/`). Vous trouverez plus de détails sur les options disponibles [dans le manuel de référence de Nix](https://nixos.org/manual/nix/stable/command-ref/conf-file).

Vous pouvez également configurer Nix à l'aide de <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, qui gère les environnements déclaratifs pour un seul utilisateur. Pour une configuration à l'échelle du système, vous pouvez utiliser [System Manager](https://github.com/numtide/system-manager) sous Linux et [nix-darwin](https://github.com/LnL7/nix-darwin) sous macOS.

<span id="Internals"></span>

## En interne

### Nix store

Les paquets compilés par Nix sont placés dans le « Nix store » en lecture seule, qui se trouve généralement dans `/nix/store`. Chaque paquet se voit attribuer une adresse unique spécifiée par un hachage cryptographique suivi du nom et de la version du paquet, par exemple `/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`. Ces préfixes hachent toutes les entrées du processus de compilation, y compris les fichiers source, l'arborescence complète des dépendances, les options du compilateur, etc. Cela permet à Nix d'installer simultanément différentes versions d'un même paquet, et même différentes compilations d'une même version, par exemple des variantes compilées avec des compilateurs différents. Lors de l'ajout, de la suppression ou de la mise à jour d'un paquet, rien n'est supprimé du store; à la place, des liens symboliques vers ces paquets sont ajoutés, supprimés ou modifiés dans les « profils ».

<span id="Cleaning_the_Nix_store"></span>

#### Nettoyage du Nix store

Pour plus d'informations sur le nettoyage du Nix store, consultez .

<span id="Nix_store_corruption"></span>

#### Corruption du Nix store

Pour plus d'informations sur la réparation d'un Nix store endommagé, consultez .

<span id="Valid_Nix_store_names"></span>

#### Noms valides du Nix store

<span id="Profiles"></span>

### Profils

Afin de construire un environnement utilisateur ou système cohérent, Nix crée des liens symboliques entre les entrées du magasin Nix et des « profils ». Ceux-ci constituent l'interface par laquelle Nix permet les restaurations : le magasin étant immuable et les versions précédentes des profils étant conservées, revenir à un état antérieur revient simplement à modifier le lien symbolique vers un profil antérieur. Pour être plus précis, Nix crée des liens symboliques vers les binaires dans des entrées du magasin Nix représentant les environnements utilisateur. Ces environnements utilisateur sont ensuite liés symboliquement à des profils étiquetés stockés dans `/nix/var/nix/profiles`, qui sont à leur tour liés symboliquement au répertoire `~/.nix-profile` de l'utilisateur.

### Sandboxing

Lorsque les compilations en bac à sable sont activées, Nix configure un environnement isolé pour chaque processus de compilation. Cela permet d'éliminer les dépendances cachées supplémentaires définies par l'environnement de compilation afin d'améliorer la reproductibilité. Cela inclut l'accès au réseau pendant la compilation en dehors des fonctions `fetch*` et aux fichiers situés en dehors du Nix store. Selon le système d'exploitation, l'accès à d'autres ressources est également bloqué (par exemple, la communication interprocessus est isolée sous Linux).

Le sandboxing est activé par défaut sous Linux, et désactivé par défaut sous macOS. Dans les pull requests pour Nixpkgs, il est demandé aux contributeurs de tester les builds avec le sandboxing activé (voir `Testé avec le sandboxing` dans le modèle de pull request) car dans les builds officiels d'Hydra, le sandboxing est également utilisé.

Pour configurer Nix pour le sandboxing, définissez `sandbox = true` dans `/etc/nix/nix.conf` ; pour configurer NixOS pour le sandboxing, définissez `nix.useSandbox = true;` dans `configuration.nix`. L'option `nix.useSandbox` est définie sur `true` par défaut depuis NixOS 17.09.

<span id="Alternative_Interpreters"></span>

### Interpréteurs Alternatifs

Un projet est actuellement en cours pour réécrire Nix de A à Z en Rust.

- [tvix](https://cs.tvl.fyi/depot/-/tree/tvix)

Il existe également une version dérivée de Nix 2.18 développée par la communauté, baptisée Lix, qui met l'accent sur la fiabilité, la facilité d'utilisation et la croissance. Bien qu'elle ait également porté certains composants de Nix vers Rust, il ne s'agit pas d'une réécriture complète comme Tvix.

- [lix](https://lix.systems/)

Des essais préliminaires peuvent être trouvés sur [riir-nix](https://riir-nix.github.io/)

## Notes

<références />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: Les valeurs ne peuvent pas changer pendant le calcul. Les fonctions produisent toujours le même résultat si leur entrée ne change pas.
