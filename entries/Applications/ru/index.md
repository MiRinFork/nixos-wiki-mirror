<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Applications/ru -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div class="mw-translate-fuzzy">

В этой статье перечислены приложения, созданные для Nix и с его помощью; она представляет собой список того, что можно назвать ***Extended Nix Ecosystem*** (см. <a href="Special:MyLanguage/Nix_Ecosystem" class="wikilink" title="Nix Ecosystem">Nix Ecosystem</a> для Core Nix Ecosystem).

</div>

<div class="mw-translate-fuzzy">

Если вы ищете программное обеспечение/приложения для Linux, вам стоит посмотреть <a href=":Category:Software" class="wikilink" title="Программное обеспечение">Программное обеспечение</a> или его подстатью <a href=":Category:Software" class="wikilink" title="Applications">Applications</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Non-NixOS Distributions

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Various applications built on top of Nix:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [not-os](https://github.com/cleverca22/not-os) - build a system firmware for embedded devices

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Built with Nix

</div>

Проекты, использующие Nix.

<div lang="en" dir="ltr" class="mw-content-ltr">

- [styx](https://github.com/styx-static/styx) - Static site generator in Nix expression language
- [bionix](https://github.com/PapenfussLab/bionix) - manage and execute bioinformatics pipelines
- [ethereum.nix](https://nix-community.github.io/ethereum.nix/) - A collection of Nix packages and NixOS modules designed to make it easier to operate Ethereum related services and infrastructure
- [nixos-mailserver](https://gitlab.com/simple-nixos-mailserver/nixos-mailserver) - A complete and Simple NixOS Mailserver

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Nix Platform

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Projects which add support (e.g. for extra platforms or major capabilities) to Nix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-darwin](https://github.com/nix-darwin/nix-darwin) - NixOS modules for Darwin
- [musnix](https://github.com/musnix/musnix) - real-time audio modules for NixOS
- [nixGl](https://github.com/nix-community/nixGL) - A wrapper to run OpenGL applications outside of NixOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Nix Tooling

</div>

Различные инструменты, созданные для работы с экосистемой Nix (например, дополнения или альтернативы основным инструментам Nix).

<span id="General_configuration"></span>

### Общая конфигурация

<div lang="en" dir="ltr" class="mw-content-ltr">

- [home-manager](https://github.com/nix-community/home-manager) - System for managing a user environment using Nix
- [plasma-manager](https://github.com/nix-community/plasma-manager) - manage KDE Plasma with Home-manager
- [Nixvim](https://github.com/nix-community/nixvim) - A Neovim distribution built around Nix modules
- [nvf](https://github.com/NotAShelf/nvf) - Modular, extensible and portable Neovim configuration framework

</div>

### Flakes

<div lang="en" dir="ltr" class="mw-content-ltr">

- [deploy-rs](https://github.com/serokell/deploy-rs) - Nix flake deployment tool
- [flake-utils-plus](https://github.com/gytis-ivaskevicius/flake-utils-plus) - Flake templates and helper library. Extension of below
- [flake-utils](https://github.com/numtide/flake-utils) - Set of flake-building utility functions
- [flake-parts](https://github.com/hercules-ci/flake-parts) - Simplify Nix Flakes with the module system
- [snowfall](https://snowfall.org/) - Unified configuration for systems, packages, modules, shells, templates, and more with Nix Flakes.

</div>

<span id="Archives"></span>

### Архивы

<div lang="en" dir="ltr" class="mw-content-ltr">

- [narfuse](https://github.com/taktoa/narfuse) - FUSE filesystem for mounting Nix archive (NAR) files as a virtual Nix store

</div>

<span id="Clustering"></span>

### Кластеризация

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-delegate](https://github.com/awakesecurity/nix-delegate) - Convenient utility for distributed Nix builds

</div>

<span id="Comparison"></span>

### Сравнение

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-diff](https://github.com/Gabriel439/nix-diff) - Compare Nix derivations
- [niff](https://github.com/FRidh/niff) - Compare two Nix expressions to determine what attributes changes
- [nvd](https://khumba.net/projects/nvd/) - Nix/NixOS package version diff tool
- [lix-diff](https://github.com/isabelroses/lix-diff) - Nix/NixOS closure diffing tool

</div>

<span id="Dependencies"></span>

### Зависимости

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-tree](https://github.com/utdemir/nix-tree) - Interactive dependency browser for Nix derivations
- [nix-visualize](https://github.com/craigmbooth/nix-visualize) - Visualize the dependencies of a given package as a graph
- [npins](https://github.com/andir/npins) - Simple tool for handling different types of dependencies in a Nix project
- [niv](https://github.com/nmattia/niv) - Painless dependencies for Nix projects
- [Nixtamal](https://nixtamal.toast.al/) - Fulfilling input pinning for Nix

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Nix language tools

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Language servers

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nil](https://github.com/oxalica/nil) - Nix language server, an incremental analysis assistant for writing in Nix
- [nixd](https://github.com/nix-community/nixd) - Nix language server, newer than nil, with more features

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Static analysis / linters

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [deadnix](https://github.com/astro/deadnix) - Removes unused code from .nix files
- [statix](https://github.com/oppiliappan/statix) - Linter and suggestions for the nix programming language
- [nixf-diagnose](https://github.com/inclyc/nixf-diagnose) - Linter - CLI wrapper around nixf-tidy (part of the [nixd](https://github.com/nix-community/nixd) project)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Formatters

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nixfmt](https://github.com/NixOS/nixfmt) - The official formatter for Nix code
- [alejandra](https://github.com/kamadorueda/alejandra) - Unofficial Nix code formatter

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Package maintenance

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-update](https://github.com/Mic92/nix-update/) - Swiss-knife for updating nix packages.
- [nixpkgs-review](https://github.com/Mic92/nixpkgs-review) - Review nixpkgs pull requests
- [nix-init](https://github.com/nix-community/nix-init) - Generate Nix packages from URLs
- [nixpkgs-hammering](https://github.com/jtojnar/nixpkgs-hammering) - Enforce a set of nit-picky rules that aim to point out and explain common mistakes in nixpkgs package pull requests

</div>

<span id="Debugging"></span>

### Отладка

<div lang="en" dir="ltr" class="mw-content-ltr">

- [dwarffs](https://github.com/edolstra/dwarffs) - Fetches DWARF debug info files for gdb automatically from cache.nixos.org
- [nixseparatedebuginfod](https://github.com/symphorien/nixseparatedebuginfod) - Fetches debug symbols and source files for debuginfod-capables tools like gdb

</div>

<span id="Search"></span>

### Поиск

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-index](https://github.com/nix-community/nix-index) - Quickly locate nix packages with specific files
- [nix-du](https://github.com/symphorien/nix-du) - Find which gc-roots take disk space in a nix store
- [nix-info](https://github.com/nix-hackers/nix-info) - Homebrew info querying for Nix
- [userscan](https://github.com/flyingcircusio/userscan) - Scans directories containing manually compiled programs and registers them with the Nix garbage collector
- [nix-search-cli](https://github.com/peterldowns/nix-search-cli) - CLI for searching packages on search.nixos.org

</div>

<span id="Shell"></span>

### Командная оболочка (Shell)

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-bash-completions](https://github.com/hedning/nix-bash-completions) - Bash completion for `nix*` commands
- [nixos-shell (Mic92)](https://github.com/Mic92/nixos-shell) - Spawns lightweight nixos vms in a shell (like vagrant)
- [nixos-shell (chrisfarms)](https://github.com/chrisfarms/nixos-shell) - like nix-shell, but for NixOS modules. Buildable version can be found [in this fork](https://github.com/wavewave/nixos-shell/tree/submodule)
- [extra-container](https://github.com/erikarvstedt/extra-container) - Run declarative NixOS containers from the command line. Similar to nixos-shell (chrisfarms)

</div>

<span id="Other"></span>

### Другое

<div lang="en" dir="ltr" class="mw-content-ltr">

- [nix-bundle](https://github.com/nix-community/nix-bundle) - package Nix attributes into single-file executables
- [nix-user-chroot](https://github.com/lucabrunox/nix-user-chroot) - install Nix as an unpriviliged user on any system
- [nh](https://github.com/nix-community/nh) - a rewrite of nixos-rebuild featuring diffs with nvd and a tree of builds with nix-output-manager, as well as other quality of life features such as package searching
- [nixos-cli](https://github.com/nix-community/nixos-cli) - an all-in-one tool to manage any NixOS installation with ease, combining the features of all the \`nixos-\*\` commands.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Nix Operations

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Operations tools for the Nix Ecosystem:

</div>

<span id="Official"></span>

### Официальные

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Hydra](https://github.com/nixos/hydra) - Nix's official continuous integration and build system
- [NixOps](https://github.com/NixOS/nixops) - Nix's official (but unmaintained) tool for deploying to NixOS machines in a network or the cloud

</div>

<span id="Deployment"></span>

### Развёртывание

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Bento](https://github.com/rapenne-s/bento) - a NixOS fleet manager supporting remote systems not up 24/7

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [colmena](https://github.com/zhaofengli/colmena) - a NixOS deployment tool
- [comin](https://github.com/nlewo/comin) - A deployment tool to continuously pull from Git repositories
- [deploy-rs](https://github.com/serokell/deploy-rs) - a simple multi-profile Nix-flake deploy tool

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Special:MyLanguage/krops" class="wikilink" title="krops">krops</a> - a lightweight toolkit to deploy NixOS systems, remotely or locally
- [lollypops](https://github.com/pinpox/lollypops) - a parallel and stateless NixOS deployment tool
- [Morph](https://github.com/DBCDK/morph) - a NixOS deployment tool
- [Nixinate](https://github.com/MatthewCroughan/nixinate) - A Nix flake library to provide app outputs for managing existing NixOS hosts over SSH
- `nixos-build --target-host`
- [Nixus](https://github.com/Infinisil/nixus) - an experimental NixOS deployment tool
- [wire](https://github.com/forallsys/wire) - A tool to deploy NixOS systems. Its usage is inspired by colmena however it is not a fork.

</div>

### Docker

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Arion](https://github.com/hercules-ci/arion) - configure Docker Compose with Nix modules
- [Nixery](https://nixery.dev) - ad-hoc container images from Nix

</div>

### Kubernetes

<div lang="en" dir="ltr" class="mw-content-ltr">

- [kubenix](https://github.com/xtruder/kubenix) - Kubernetes resource builder written in Nix
- [nix-kubernetes](https://github.com/xtruder/nix-kubernetes) - Kubernetes deployment manager written in nix

</div>

<span id="Alternative_nix_implementations_&amp;_parser"></span>

## Альтернативные реализации nix и парсеры

<div lang="en" dir="ltr" class="mw-content-ltr">

- [hnix](https://github.com/haskell-nix/hnix) (haskell, parser & evaluator)
- [rnix](https://github.com/nix-community/rnix-parser) (rust, parser)
- [go-nix](https://github.com/orivej/go-nix) (go, parser & nix-compatible file hasher)
- [nix-idea](https://github.com/NixOS/nix-idea/tree/master/src/main/java/org/nixos/idea/lang) (java, parser)
- [lix](https://lix.systems/) (c++, fork of [NixOS/nix](https://github.com/NixOS/nix))
- [snix](https://snix.dev/) (rust, cli & evaluator & store)

</div>

<span id="Additional_unofficial_ecosystem"></span>

<div class="mw-translate-fuzzy">

## Дополнительная неофициальная экосистема

</div>

<div class="mw-translate-fuzzy">

Ни одна из этих служб не является обязательной для использования Nix. Ни одна из этих служб не связана с <a href="Special:MyLanguage/NixOS_Foundation" class="wikilink" title="Фонд NixOS">Фонд NixOS</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

[Cachix](https://cachix.org)  
binary caches as a service. Free for public caches, subscription for private token-protected caches.

[Hercules CI](https://hercules-ci.com)  
simplify your CI setup with stateless build agents. Free for open source, per-user subscription for private repositories.

[Garnix](https://garnix.io)  
nix CI, caching (open beta) and cloud hosting (private alpha) based on Nix as a service. Currently free, but offers commerical plans.

[nixbuild.net](https://nixbuild.net/)  
remote Nix builders as a service for x86_64 and AArch64. Pay-per-use.

</div>

<span id="See_also"></span>

## См. Также

<div lang="en" dir="ltr" class="mw-content-ltr">

- [awesome-nix](https://github.com/nix-community/awesome-nix)
- <a href="Special:MyLanguage/Language-specific_package_helpers" class="wikilink" title="Language-specific package helpers">Language-specific package helpers</a>
- <a href="Special:MyLanguage/Alternative_Package_Sets" class="wikilink" title="Alternative Package Sets">Alternative Package Sets</a>
- <a href="Special:MyLanguage/Configuration_Collection" class="wikilink" title="Get inspiration from other peoples NixOS configuration">Get inspiration from other peoples NixOS configuration</a>
- [NixOS Packages Search](https://search.nixos.org/packages) for searching through NixOS packages

</div>

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Nix{{#translation:}}" class="wikilink" title="Category:Nix{{#translation:}}">Category:Nix{{#translation:}}</a>
