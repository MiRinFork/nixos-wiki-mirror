<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/pt -->

<languages/> **Nixpkgs** é o maior repositório do <a href="Nix" class="wikilink" title="Nix">Nix</a> e dos modulos <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>. O repositorio tem a manutenção feita pela comunidade <a href="NixOS_Foundation" class="wikilink" title="NixOS Foundation">NixOS Foundation</a>.

<div lang="en" dir="ltr" class="mw-content-ltr">

To search among available packages and options, see <a href="Searching_packages" class="wikilink" title="Searching packages">Searching packages</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

As highlighted in [the announcement](https://nixos.org/blog/announcements/2024/nixos-2411/) of the NixOS 24.11 release, *"NixOS is already known as [the most up to date distribution](https://repology.org/repositories/statistics/newest) while also being [the distribution with the most packages](https://repology.org/repositories/statistics/total)."* This is thanks to the community's continued dedication to making Nixpkgs the preeminent Linux package repository.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Subpages

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

There are a number of articles especially related to working with `nixpkgs`:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Releases

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The packages and modules hosted on Nixpkgs are distributed through various <a href="channel_branches" class="wikilink" title="channel branches">channel branches</a> intended for particular use-cases. In practice they are differentiated by the level of testing updates must pass on the official [nixos.org Hydra instance](https://nixos.org/hydra/manual/#idm140737315980672) and the number of updates they receive.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> users, `nixos-unstable` channel branch is the rolling release, where packages pass build tests and <a href="NixOS_VM_tests" class="wikilink" title="integration tests on a VM">integration tests on a VM</a>, and are tested from the perspective of being an operative system (this means things like the <a href="Xorg" class="wikilink" title="X server">X server</a>, <a href="KDE" class="wikilink" title="KDE">KDE</a>, various servers, and lower level details like installing <a href="Bootloader" class="wikilink" title="bootloaders">bootloaders</a> and running the NixOS installation steps are also tested).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For standalone <a href="Nix" class="wikilink" title="Nix">Nix</a> users, `nixpkgs-unstable` channel branch is the rolling release, where packages pass only basic build tests and are upgraded continuously.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Both <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> and <a href="Nix" class="wikilink" title="Nix">Nix</a> users can use stable channel branches (see <https://status.nixos.org/> for the current channels) to receive only conservative updates for fixing critical bugs and security vulnerabilities. Stable channel branches are released bi-annually at the end of May and the end of November.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Using stable channels on NixOS is comparable to the user experience on other Linux distributions.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Alternatives

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Due to the fact that Nixpkgs is *only* a Nix expression, it is possible to extend or replace the logic with your own sources. In fact, there are a number of extensions as well as complete replacements for Nixpkgs, see the <a href="Alternative_Package_Sets" class="wikilink" title="Alternative Package Sets">Alternative Package Sets</a> article.

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
