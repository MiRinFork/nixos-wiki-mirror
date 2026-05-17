<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix ecosystem -->

<languages/> <translate> The **Core Nix Ecosystem** is a collection of technologies designed to reproducibly build and declaratively configure and manage packages and systems as well as their dependencies. It achieves this by translating the functional paradigm from the program to the system domain by utilizing a dynamic, functional and lazy DSL called the <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Nix_(language)&lt;/tvar&gt;" class="wikilink" title="Nix Language">Nix Language</a> for specifying reproducible builds.

In addition there are many other <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Applications&lt;/tvar&gt;" class="wikilink" title="applications">applications</a> (***Extended Nix Ecosystem***) developed by the Nix community, utilizing and supporting these core technologies.

## Official ecosystem

</translate>

| <translate> Component</translate> | <translate> Manual</translate> | <translate> Description</translate> | <translate> Use</translate> | <translate> License</translate> |
|----|----|----|----|----|
| <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> | <translate> [NixOS Manual](https://nixos.org/manual/nixos/stable/)</translate> | <translate> A Linux distribution with *all* components built by Nix, and thus supporting reproducible and declarative system-wide configuration management as well as atomic upgrades and rollbacks.</translate> | <translate> Declaratively configure desktops, servers & clusters</translate> | MIT |
| <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> | <translate> [Nixpkgs Manual](https://nixos.org/manual/nixpkgs/stable/)</translate> | <translate> The largest community maintained Nix package and NixOS module repository; standard releases of NixOS are hosted here.</translate> | <translate> Share Nix packages & NixOS modules</translate> | MIT |
| <a href="Special:MyLanguage/Hydra" class="wikilink" title="Hydra">Hydra</a> | <translate> [Hydra Manual](https://nixos.org/hydra/manual/)</translate> | <translate> A Nix based continuous build system.</translate> | <translate> CI build farms</translate> | GPL-3.0 |
| <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> | <translate> [Nix Manual](https://nix.dev/manual/nix/)</translate> | <translate> A package manager that parses Nix expressions specifying reproducible build, putting the result in a store address with a hash of the dependency tree, sidestepping dependency hell and supporting multiversion installs and rollbacks.</translate> | <translate> Reproducible builds & package management in Linux & Darwin</translate> | LGPL-2.1 |

<translate> Core Components of the Nix Ecosystem</translate>

<table style="width:20%;">
<caption><translate> <strong>The NixOS core ecosystem stack</strong></translate></caption>
<colgroup>
<col style="width: 10%" />
<col style="width: 10%" />
</colgroup>
<tbody>
<tr>
<td colspan="2" style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>NixOS</p>
</div>
<div style="text-align: center;">
<p><translate> A Linux distribution and configuration system built using Nixpkgs.</translate></p>
</div></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nixpkgs</p>
</div>
<div style="text-align: center;">
<p><translate> A large, community-maintained repository of packages.</translate></p>
</div></td>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Hydra</p>
</div>
<div style="text-align: center;">
<p><translate> A continuous build system built on Nix.</translate></p>
</div></td>
</tr>
<tr>
<td colspan="2" style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nix</p>
</div>
<div style="text-align: center;">
<p><translate> A pure and functional build system.</translate></p>
</div></td>
</tr>
</tbody>
</table>

<translate>

## Usage of NixOS

Users install the *NixOS* distribution on their computers just as any other Linux distribution. They read about packages to install and configuration options in *Nixpkgs* via <https://search.nixos.org> and this wiki. They use the *Nix* language to declaratively describe in a text file what software packages should be installed and how the system should be configured. They run 2 command line programs in a terminal to transform the system into the described system. They use the system as any other Linux system.

## Development of NixOS

Developers of *NixOS* mainly work on *Nixpkgs*. *NixOS* development itself is compromised of three large areas as well as some others which are smaller by volume (but no less important). The major ones include packaging, the module system, and documentation.

- Packaging is done in *Nixpkgs* and is not exclusive to *NixOS* or even Linux-based platforms. Maintainers of packages which are not exclusive to *NixOS* (such as tooling required to run the distribution itself) usually take care of multiple platforms although not strictly required.

<!-- -->

- The module system is the way in which services running on *NixOS* are primarily configured. This area stretches from "low-level" configuration such as *systemd* unit files or providing custom kernel configuration up to configuration file generation for specific services. The module system is the primary way for users to configure *NixOS*, and lives in the `nixos/` subdirector of *Nixpkgs*.

<!-- -->

- Documentation is largely embedded in packaging and module system data, although free-standing markdown files are also contained in the *Nixpkgs* repository. Documentation also includes maintaining the website, Wiki, and other aspects of the wider ecosystem. The first two categories are almost exclusively *Nix* language code written in text files, while the latter is a mix of *Nix* code, markdown files, and various other formats.

All contributions to *Nixpkgs*, regardless of whether they affect *NixOS* or not, are subject to peer review before being integrated into *Nixpkgs*. Many packages alongside documentation and supplementary materials such as ISOs or tarballs are pre built on *Hydra* to reduce the update time for *NixOS* users.

Those three categories are largest by contribution volume, however many maintainers also engage in activities surrounding the NixOS foundation, maintaining the infrastructure on which website, *Hydra*, and other tools run on, or developing tooling required for NixOS. </translate>

| <translate> Type of development</translate> | <translate> Location of Development</translate> | <translate> Examples</translate> |
|----|----|----|
| <translate> Platform Agnostic Packaging</translate> | *Nixpkgs* | <translate> \[<tvar name=1><https://github.com/NixOS/nixpkgs/blob/bf3287dac860542719fe7554e21e686108716879/pkgs/tools/misc/coreutils/default.nix></tvar> coreutils package\], \[<tvar name=2><https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/stdenv></tvar> *stdenv* framework\], \[<tvar name=3><https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/applications/office/libreoffice/default.nix></tvar> Libreoffice package\]</translate> |
| <translate> Platform Agnostic Tooling</translate> | <translate> *Nixpkgs* and various repositories</translate> | <translate> \[<tvar name=1><https://github.com/NixOS/nix></tvar> upstream/default Nix implementation (CppNix)\], \[<tvar name=2><https://github.com/NixOS/hydra></tvar> *Hydra* source code\], \[<tvar name=3><https://github.com/NixOS/nixpkgs-merge-bot></tvar> *Nixpkgs* merge bot\]</translate> |
| <translate> *NixOS* Tooling</translate> | <translate> mostly *Nixpkgs*</translate> | <translate> \[<tvar name=1><https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/by-name/ni/nixos-rebuild-ng></tvar> nixos-rebuild-ng source code\], \[<tvar name=2><https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix></tvar> *NixOS* Installation ISOs\]</translate> |
| <translate> *NixOS* Module System</translate> | *Nixpkgs* | <translate> \[<tvar name=1><https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/display-managers/default.nix></tvar> Display Manager configuration\], \[<tvar name=2><https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/databases/mysql.nix></tvar> MySQL (and derivative) database configuration\]</translate> |
| <translate> Infrastructure</translate> |  | <translate> \[<tvar name=1><https://github.com/NixOS/nixos-wiki-infra></tvar> Infrastructure for this Wiki\], \[<tvar name=2><https://github.com/NixOS/infra></tvar> *NixOS* infra\]</translate> |
| <translate> Documentation</translate> |  | <translate> \[<tvar name=1><https://wiki.nixos.org></tvar> This Wiki\], \[<tvar name=2><https://github.com/NixOS/nixpkgs/blob/8d92119c540d78599ba208010c722a60958810f4/doc/stdenv/stdenv.chapter.md></tvar> *stdenv* documentation\], \[<tvar name=3><https://github.com/NixOS/nixpkgs/blob/master/nixos/doc/manual/configuration/ipv6-config.section.md></tvar> *NixOS* IPv6 configuration\] (visible in the \[<tvar name=4><https://nixos.org/manual/nixos/stable/#sec-ipv6></tvar> IPv6 section of the *NixOS* manual\]), \[<tvar name=5><https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md></tvar> *Nixpkgs* Contribution Guidelines\]</translate> |
| <translate> Tech Organisation</translate> |  | <translate> \[<tvar name=1><https://github.com/NixOS/nixpkgs/issues/390768></tvar> *NixOS* RelEng\], \[<tvar name=2><https://github.com/NixOS/rfcs/></tvar> *Nix* and *NixOS* RFCs\]</translate> |
| <translate> Other</translate> |  | <translate> \[<tvar name=1><https://github.com/NixOS/nixos-artwork></tvar> *NixOS* artwork\], \[<tvar name=2><https://discourse.nixos.org/></tvar> *NixOS* (and related) discourse\], \[<tvar name=3><https://github.com/NixOS/foundation></tvar> *NixOS Foundation*\]</translate> |

<translate> Various examples of *NixOS* development along with links.</translate>

<translate> See also: [Nix organisation repository](https://github.com/NixOS/org) </translate>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
