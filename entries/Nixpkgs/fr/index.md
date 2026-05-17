<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/fr -->

<languages/> '“'Nixpkgs”'' est le plus grand référentiel de paquets <a href="Nix" class="wikilink" title="Nix">Nix</a> et de modules <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>. Ce référentiel est hébergé sur GitHub et géré par la communauté, avec le soutien officiel de la <a href="NixOS_Foundation" class="wikilink" title="NixOS Foundation">NixOS Foundation</a>.

Pour effectuer une recherche parmi les paquets et options disponibles, consultez la page <a href="Recherche_de_paquets" class="wikilink" title="Recherche de paquets">Recherche de paquets</a>.

Comme le souligne [l'annonce](https://nixos.org/blog/announcements/2024/nixos-2411/) de la sortie de NixOS 24.11, « NixOS est déjà reconnue comme la distribution la plus à jour tout en étant la distribution proposant le plus grand nombre de paquets ». Cela est dû à l'engagement continu de la communauté pour faire de Nixpkgs le dépôt de paquets Linux par excellence.

<span id="Subpages"></span>

### Sous-pages

Il existe plusieurs articles consacrés plus particulièrement à l'utilisation de `nixpkgs` :

<span id="Releases"></span>

## Versions

Les paquets et modules hébergés sur Nixpkgs sont distribués via différentes <a href="branches_de_canaux" class="wikilink" title="branches de canaux">branches de canaux</a> destinées à des cas d'utilisation spécifiques. Concrètement, ils se distinguent par le niveau de test que les mises à jour doivent passer sur l'instance officielle [nixos.org Hydra](https://nixos.org/hydra/manual/#idm140737315980672) et par le nombre de mises à jour qu'ils reçoivent.

Pour les utilisateurs de <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, la branche `nixos-unstable` correspond à la version en mise à jour continue, dans laquelle les paquets passent les tests de compilation et les <a href="tests_de_NixOS_sur_VM" class="wikilink" title="tests d&#39;intégration sur une machine virtuelle">tests d'intégration sur une machine virtuelle</a>, et sont testés en tant que système d'exploitation (c'est-à-dire des éléments tels que le <a href="Xorg" class="wikilink" title="serveur X">serveur X</a>, <a href="KDE" class="wikilink" title="KDE">KDE</a>, divers serveurs, ainsi que des détails de plus bas niveau tels que l'installation de <a href="Bootloader" class="wikilink" title="chargeurs d&#39;amorçage">chargeurs d'amorçage</a> et l'exécution des étapes d'installation de NixOS sont également testés).

Pour les utilisateurs autonomes de <a href="Nix" class="wikilink" title="Nix">Nix</a>, la branche `nixpkgs-unstable` constitue la version à mise à jour continue, dans laquelle les paquets ne sont soumis qu'à des tests de compilation de base et sont mis à jour en permanence.

Les utilisateurs de <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> et de <a href="Nix" class="wikilink" title="Nix">Nix</a> peuvent recourir aux branches du canal stable (voir <https://status.nixos.org/> pour connaître les canaux actuels) afin de ne recevoir que des mises à jour mineures destinées à corriger les bogues critiques et les failles de sécurité. Les branches du canal stable sont publiées deux fois par an, à la fin du mois de mai et à la fin du mois de novembre.

L'utilisation des branches stables sous NixOS offre une expérience similaire à celle proposée par d'autres distributions Linux.

## Alternatives

Étant donné que Nixpkgs n'est « qu'une » expression Nix, il est possible d'étendre ou de remplacer sa logique par vos propres sources. Il existe d'ailleurs un certain nombre d'extensions ainsi que des remplacements complets de Nixpkgs ; consultez l'article <a href="Ensembles_de_paquets_alternatifs" class="wikilink" title="Ensembles de paquets alternatifs">Ensembles de paquets alternatifs</a>.

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
