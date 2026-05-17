<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix ecosystem/uk -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

The **Core Nix Ecosystem** is a collection of technologies designed to reproducibly build and declaratively configure and manage packages and systems as well as their dependencies. It achieves this by translating the functional paradigm from the program to the system domain by utilizing a dynamic, functional and lazy DSL called the <a href="Special:MyLanguage/Overview_of_the_Nix_Language" class="wikilink" title="Nix Language">Nix Language</a> for specifying reproducible builds.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In addition there are many other <a href="Special:MyLanguage/applications" class="wikilink" title="applications">applications</a> (***Extended Nix Ecosystem***) developed by the Nix community, utilizing and supporting these core technologies.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Official ecosystem

</div>

| <span lang="en" dir="ltr" class="mw-content-ltr">Component</span> | <span lang="en" dir="ltr" class="mw-content-ltr">Manual</span> | <span lang="en" dir="ltr" class="mw-content-ltr">Description</span> | <span lang="en" dir="ltr" class="mw-content-ltr">Use</span> | Ліцензія |
|----|----|----|----|----|
| <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> | <span lang="en" dir="ltr" class="mw-content-ltr">[NixOS Manual](https://nixos.org/nixos/manual/)</span> | <span lang="en" dir="ltr" class="mw-content-ltr">A Linux distribution with *all* components built by Nix, and thus supporting reproducible and declarative system-wide configuration management as well as atomic upgrades and rollbacks.</span> | <span lang="en" dir="ltr" class="mw-content-ltr">Declaratively configure desktops, servers & clusters</span> | MIT |
| <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> | <span lang="en" dir="ltr" class="mw-content-ltr">[Nixpkgs Manual](https://nixos.org/nixpkgs/manual/)</span> | <span lang="en" dir="ltr" class="mw-content-ltr">The largest community maintained Nix package and NixOS module repository; standard releases of NixOS are hosted here.</span> | <span lang="en" dir="ltr" class="mw-content-ltr">Share Nix packages & NixOS modules</span> | MIT |
| <a href="Special:MyLanguage/Hydra" class="wikilink" title="Hydra">Hydra</a> | <span lang="en" dir="ltr" class="mw-content-ltr">[Hydra Manual](https://nixos.org/hydra/manual/)</span> | <span lang="en" dir="ltr" class="mw-content-ltr">A Nix based continuous build system.</span> | <span lang="en" dir="ltr" class="mw-content-ltr">CI build farms</span> | GPL-3.0 |
| <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> | <span lang="en" dir="ltr" class="mw-content-ltr">[Nix Manual](https://nixos.org/nix/manual/)</span> | <span lang="en" dir="ltr" class="mw-content-ltr">A package manager that parses Nix expressions specifying reproducible build, putting the result in a store address with a hash of the dependency tree, sidestepping dependency hell and supporting multiversion installs and rollbacks.</span> | <span lang="en" dir="ltr" class="mw-content-ltr">Reproducible builds & package management in Linux & Darwin</span> | LGPL-2.1 |

<span lang="en" dir="ltr" class="mw-content-ltr">Core Components of the Nix Ecosystem</span>

<table style="width:20%;">
<caption><span lang="en" dir="ltr" class="mw-content-ltr"><strong>The NixOS core ecosystem stack</strong></span></caption>
<colgroup>
<col style="width: 20%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>NixOS</p>
</div>
<p><span lang="en" dir="ltr" class="mw-content-ltr">A Linux distribution and configuration system built using Nixpkgs.</span></p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nixpkgs</p>
</div>
<p><span lang="en" dir="ltr" class="mw-content-ltr">A large, community-maintained repository of packages.</span></p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nix</p>
</div>
<p><span lang="en" dir="ltr" class="mw-content-ltr">A pure and functional build system.</span></p></td>
</tr>
</tbody>
</table>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Usage of NixOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Users install the *NixOS* distribution on their computers just as any other Linux distribution. They read about packages to install and configuration options in *Nixpkgs* via <https://search.nixos.org> and this wiki. They use the *Nix* language to declaratively describe in a text file what software packages should be installed and how the system should be configured. They run 2 command line programs in a terminal to transform the system into the described system. They use the system as any other Linux system.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Development of NixOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Developers of *NixOS* mainly work on *Nixpkgs*. *NixOS* development itself is compromised of three large areas as well as some others which are smaller by volume (but no less important). The major ones include packaging, the module system, and documentation.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Packaging is done in *Nixpkgs* and is not exclusive to *NixOS* or even Linux-based platforms. Maintainers of packages which are not exclusive to *NixOS* (such as tooling required to run the distribution itself) usually take care of multiple platforms although not strictly required.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- The module system is the way in which services running on *NixOS* are primarily configured. This area stretches from "low-level" configuration such as *systemd* unit files or providing custom kernel configuration up to configuration file generation for specific services. The module system is the primary way for users to configure *NixOS*, and lives in the `nixos/` subdirector of *Nixpkgs*.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Documentation is largely embedded in packaging and module system data, although free-standing markdown files are also contained in the *Nixpkgs* repository. Documentation also includes maintaining the website, Wiki, and other aspects of the wider ecosystem. The first two categories are almost exclusively *Nix* language code written in text files, while the latter is a mix of *Nix* code, markdown files, and various other formats.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

All contributions to *Nixpkgs*, regardless of whether they affect *NixOS* or not, are subject to peer review before being integrated into *Nixpkgs*. Many packages alongside documentation and supplementary materials such as ISOs or tarballs are pre built on *Hydra* to reduce the update time for *NixOS* users.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Those three categories are largest by contribution volume, however many maintainers also engage in activities surrounding the NixOS foundation, maintaining the infrastructure on which website, *Hydra*, and other tools run on, or developing tooling required for NixOS.

</div>

| Тип розробки | Локація Розробки | Приклади |
|----|----|----|
| <span lang="en" dir="ltr" class="mw-content-ltr">Platform Agnostic Packaging</span> | *Nixpkgs* | <span lang="en" dir="ltr" class="mw-content-ltr">[coreutils package](https://github.com/NixOS/nixpkgs/blob/bf3287dac860542719fe7554e21e686108716879/pkgs/tools/misc/coreutils/default.nix), [*stdenv* framework](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/stdenv), [Libreoffice package](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/applications/office/libreoffice/default.nix)</span> |
| <span lang="en" dir="ltr" class="mw-content-ltr">Platform Agnostic Tooling</span> | <span lang="en" dir="ltr" class="mw-content-ltr">*Nixpkgs* and various repositories</span> | <span lang="en" dir="ltr" class="mw-content-ltr">[upstream/default Nix implementation (CppNix)](https://github.com/NixOS/nix), [*Hydra* source code](https://github.com/NixOS/hydra), [*Nixpkgs* merge bot](https://github.com/NixOS/nixpkgs-merge-bot)</span> |
| <span lang="en" dir="ltr" class="mw-content-ltr">*NixOS* Tooling</span> | <span lang="en" dir="ltr" class="mw-content-ltr">mostly *Nixpkgs*</span> | <span lang="en" dir="ltr" class="mw-content-ltr">[nixos-rebuild-ng source code](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/by-name/ni/nixos-rebuild-ng), [*NixOS* Installation ISOs](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix)</span> |
| <span lang="en" dir="ltr" class="mw-content-ltr">*NixOS* Module System</span> | *Nixpkgs* | <span lang="en" dir="ltr" class="mw-content-ltr">[Display Manager configuration](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/display-managers/default.nix), [MySQL (and derivative) database configuration](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/databases/mysql.nix)</span> |
| Інфраструктура |  | <span lang="en" dir="ltr" class="mw-content-ltr">[Infrastructure for this Wiki](https://github.com/NixOS/nixos-wiki-infra), [*NixOS* infra](https://github.com/NixOS/infra)</span> |
| Документація |  | <span lang="en" dir="ltr" class="mw-content-ltr">[This Wiki](https://wiki.nixos.org), [*stdenv* documentation](https://github.com/NixOS/nixpkgs/blob/8d92119c540d78599ba208010c722a60958810f4/doc/stdenv/stdenv.chapter.md), [*NixOS* IPv6 configuration](https://github.com/NixOS/nixpkgs/blob/master/nixos/doc/manual/configuration/ipv6-config.section.md) (visible in the [IPv6 section of the *NixOS* manual](https://nixos.org/manual/nixos/stable/#sec-ipv6)), [*Nixpkgs* Contribution Guidelines](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md)</span> |
| Технічна організація |  | <span lang="en" dir="ltr" class="mw-content-ltr">[*NixOS* RelEng](https://github.com/NixOS/nixpkgs/issues/390768), [*Nix* and *NixOS* RFCs](https://github.com/NixOS/rfcs/)</span> |
| Інші |  | <span lang="en" dir="ltr" class="mw-content-ltr">[*NixOS* artwork](https://github.com/NixOS/nixos-artwork), [*NixOS* (and related) discourse](https://discourse.nixos.org/), [*NixOS Foundation*](https://github.com/NixOS/foundation)</span> |

Різноманітні приклади розробки *NixOS* разом із посиланнями

<div lang="en" dir="ltr" class="mw-content-ltr">

See also: [Nix organisation repository](https://github.com/NixOS/org)

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
