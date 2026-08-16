<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Applications -->

<languages/> <translate>

This article lists applications built for and with Nix; it constitutes a listing of what may be called the ***Extended Nix Ecosystem*** (see <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Nix_Ecosystem&lt;/tvar&gt;" class="wikilink" title="Nix Ecosystem">Nix Ecosystem</a> for the Core Nix Ecosystem).

If you are looking for Linux software/applications you should look at <a href="&lt;tvar_name=1&gt;:Category:Software&lt;/tvar&gt;" class="wikilink" title="Software">Software</a>.

## Non-NixOS Distributions

Various applications built on top of Nix:

- \[<tvar name=1><https://github.com/cleverca22/not-os></tvar> not-os\] - build a system firmware for embedded devices

## Built with Nix

Projects which leverage Nix.

- \[<tvar name=1><https://github.com/styx-static/styx></tvar> styx\] - Static site generator in Nix expression language
- \[<tvar name=2><https://github.com/PapenfussLab/bionix></tvar> bionix\] - manage and execute bioinformatics pipelines
- \[<tvar name=3><https://nix-community.github.io/ethereum.nix/></tvar> ethereum.nix\] - A collection of Nix packages and NixOS modules designed to make it easier to operate Ethereum related services and infrastructure
- \[<tvar name=4><https://gitlab.com/simple-nixos-mailserver/nixos-mailserver></tvar> nixos-mailserver\] - A complete and Simple NixOS Mailserver

## Nix Platform

Projects which add support (e.g. for extra platforms or major capabilities) to Nix.

- \[<tvar name=1><https://github.com/nix-darwin/nix-darwin></tvar> nix-darwin\] - NixOS modules for Darwin
- \[<tvar name=2><https://github.com/musnix/musnix></tvar> musnix\] - real-time audio modules for NixOS
- \[<tvar name=3><https://github.com/nix-community/nixGL></tvar> nixGl\] - A wrapper to run OpenGL applications outside of NixOS

## Nix Tooling

Various tools built for working with the Nix Ecosystem (e.g. enhancements or alternatives to core Nix tools).

### General configuration

- \[<tvar name=1><https://github.com/nix-community/home-manager></tvar> home-manager\] - System for managing a user environment using Nix
- \[<tvar name=2><https://github.com/nix-community/plasma-manager></tvar> plasma-manager\] - manage KDE Plasma with Home-manager
- \[<tvar name=3><https://github.com/nix-community/nixvim></tvar> Nixvim\] - A Neovim distribution built around Nix modules
- \[<tvar name=4><https://github.com/NotAShelf/nvf></tvar> nvf\] - Modular, extensible and portable Neovim configuration framework

### Flakes

- \[<tvar name=1><https://github.com/serokell/deploy-rs></tvar> deploy-rs\] - Nix flake deployment tool
- \[<tvar name=2><https://github.com/gytis-ivaskevicius/flake-utils-plus></tvar> flake-utils-plus\] - Flake templates and helper library. Extension of below
- \[<tvar name=3><https://github.com/numtide/flake-utils></tvar> flake-utils\] - Set of flake-building utility functions
- \[<tvar name=4><https://github.com/hercules-ci/flake-parts></tvar> flake-parts\] - Simplify Nix Flakes with the module system
- \[<tvar name=5><https://snowfall.org/></tvar> snowfall\] - Unified configuration for systems, packages, modules, shells, templates, and more with Nix Flakes.

### Archives

- \[<tvar name=1><https://github.com/taktoa/narfuse></tvar> narfuse\] - FUSE filesystem for mounting Nix archive (NAR) files as a virtual Nix store

### Clustering

- \[<tvar name=1><https://github.com/awakesecurity/nix-delegate></tvar> nix-delegate\] - Convenient utility for distributed Nix builds

### Comparison

- \[<tvar name=1><https://github.com/Gabriel439/nix-diff></tvar> nix-diff\] - Compare Nix derivations
- \[<tvar name=2><https://github.com/FRidh/niff></tvar> niff\] - Compare two Nix expressions to determine what attributes changes
- \[<tvar name=3><https://khumba.net/projects/nvd/></tvar> nvd\] - Nix/NixOS package version diff tool
- \[<tvar name=4><https://github.com/isabelroses/lix-diff></tvar> lix-diff\] - Nix/NixOS closure diffing tool

### Dependencies

- \[<tvar name=1><https://github.com/utdemir/nix-tree></tvar> nix-tree\] - Interactive dependency browser for Nix derivations
- \[<tvar name=2><https://github.com/craigmbooth/nix-visualize></tvar> nix-visualize\] - Visualize the dependencies of a given package as a graph
- \[<tvar name=3><https://github.com/andir/npins></tvar> npins\] - Simple tool for handling different types of dependencies in a Nix project
- \[<tvar name=4><https://github.com/nmattia/niv></tvar> niv\] - Painless dependencies for Nix projects
- \[<tvar name=5><https://nixtamal.toast.al/></tvar> Nixtamal\] - Fulfilling input pinning for Nix

### Nix language tools

#### Language servers

- \[<tvar name=1><https://github.com/oxalica/nil></tvar> nil\] - Nix language server, an incremental analysis assistant for writing in Nix
- \[<tvar name=2><https://github.com/nix-community/nixd></tvar> nixd\] - Nix language server, newer than nil, with more features

#### Static analysis / linters

- \[<tvar name=1><https://github.com/astro/deadnix></tvar> deadnix\] - Removes unused code from .nix files
- \[<tvar name=2><https://github.com/oppiliappan/statix></tvar> statix\] - Linter and suggestions for the nix programming language
- \[<tvar name=3><https://github.com/inclyc/nixf-diagnose></tvar> nixf-diagnose\] - Linter - CLI wrapper around nixf-tidy (part of the \[<tvar name=4><https://github.com/nix-community/nixd></tvar> nixd\] project)

#### Formatters

- \[<tvar name=1><https://github.com/NixOS/nixfmt></tvar> nixfmt\] - The official formatter for Nix code
- \[<tvar name=2><https://github.com/kamadorueda/alejandra></tvar> alejandra\] - Unofficial Nix code formatter

### Package maintenance

- \[<tvar name=1><https://github.com/Mic92/nix-update/></tvar> nix-update\] - Swiss-knife for updating nix packages.
- \[<tvar name=2><https://github.com/Mic92/nixpkgs-review></tvar> nixpkgs-review\] - Review nixpkgs pull requests
- \[<tvar name=3><https://github.com/nix-community/nix-init></tvar> nix-init\] - Generate Nix packages from URLs
- \[<tvar name=4><https://github.com/jtojnar/nixpkgs-hammering></tvar> nixpkgs-hammering\] - Enforce a set of nit-picky rules that aim to point out and explain common mistakes in nixpkgs package pull requests

### Debugging

- \[<tvar name=1><https://github.com/edolstra/dwarffs></tvar> dwarffs\] - Fetches DWARF debug info files for gdb automatically from cache.nixos.org
- \[<tvar name=2><https://github.com/symphorien/nixseparatedebuginfod></tvar> nixseparatedebuginfod\] - Fetches debug symbols and source files for debuginfod-capables tools like gdb

### Search

- \[<tvar name=1><https://github.com/nix-community/nix-index></tvar> nix-index\] - Quickly locate nix packages with specific files
- \[<tvar name=2><https://github.com/symphorien/nix-du></tvar> nix-du\] - Find which gc-roots take disk space in a nix store
- \[<tvar name=3><https://github.com/nix-hackers/nix-info></tvar> nix-info\] - Homebrew info querying for Nix
- \[<tvar name=4><https://github.com/flyingcircusio/userscan></tvar> userscan\] - Scans directories containing manually compiled programs and registers them with the Nix garbage collector
- \[<tvar name=5><https://github.com/peterldowns/nix-search-cli></tvar> nix-search-cli\] - CLI for searching packages on search.nixos.org

### Shell

- \[<tvar name=1><https://github.com/hedning/nix-bash-completions></tvar> nix-bash-completions\] - Bash completion for `nix*` commands
- \[<tvar name=2><https://github.com/Mic92/nixos-shell></tvar> nixos-shell (Mic92)\] - Spawns lightweight nixos vms in a shell (like vagrant)
- \[<tvar name=3><https://github.com/chrisfarms/nixos-shell></tvar> nixos-shell (chrisfarms)\] - like nix-shell, but for NixOS modules. Buildable version can be found \[<tvar name=4><https://github.com/wavewave/nixos-shell/tree/submodule></tvar> in this fork\]
- \[<tvar name=5><https://github.com/erikarvstedt/extra-container></tvar> extra-container\] - Run declarative NixOS containers from the command line. Similar to nixos-shell (chrisfarms)

### Other

- \[<tvar name=1><https://github.com/nix-community/nix-bundle></tvar> nix-bundle\] - package Nix attributes into single-file executables
- \[<tvar name=2><https://github.com/lucabrunox/nix-user-chroot></tvar> nix-user-chroot\] - install Nix as an unpriviliged user on any system
- \[<tvar name=3><https://github.com/nix-community/nh></tvar> nh\] - a rewrite of nixos-rebuild featuring diffs with nvd and a tree of builds with nix-output-manager, as well as other quality of life features such as package searching
- \[<tvar name=4><https://github.com/nix-community/nixos-cli></tvar> nixos-cli\] - an all-in-one tool to manage any NixOS installation with ease, combining the features of all the \`nixos-\*\` commands.

## Nix Operations

Operations tools for the Nix Ecosystem:

### Official

- \[<tvar name=1><https://github.com/nixos/hydra></tvar> Hydra\] - Nix's official continuous integration and build system
- \[<tvar name=2><https://github.com/NixOS/nixops></tvar> NixOps\] - Nix's official (but unmaintained) tool for deploying to NixOS machines in a network or the cloud

### Deployment

- \[<tvar name=1><https://github.com/rapenne-s/bento></tvar> Bento\] - a NixOS fleet manager supporting remote systems not up 24/7

<!-- -->

- \[<tvar name=1><https://github.com/zhaofengli/colmena></tvar> colmena\] - a NixOS deployment tool
- \[<tvar name=2><https://github.com/nlewo/comin></tvar> comin\] - A deployment tool to continuously pull from Git repositories
- \[<tvar name=3><https://github.com/serokell/deploy-rs></tvar> deploy-rs\] - a simple multi-profile Nix-flake deploy tool

<!-- -->

- <a href="&lt;tvar_name=0&gt;Special:MyLanguage/krops&lt;/tvar&gt;" class="wikilink" title="krops">krops</a> - a lightweight toolkit to deploy NixOS systems, remotely or locally
- \[<tvar name=1><https://github.com/pinpox/lollypops></tvar> lollypops\] - a parallel and stateless NixOS deployment tool
- \[<tvar name=2><https://github.com/DBCDK/morph></tvar> Morph\] - a NixOS deployment tool
- \[<tvar name=3><https://github.com/MatthewCroughan/nixinate></tvar> Nixinate\] - A Nix flake library to provide app outputs for managing existing NixOS hosts over SSH
- `nixos-build --target-host`
- \[<tvar name=4><https://github.com/Infinisil/nixus></tvar> Nixus\] - an experimental NixOS deployment tool
- \[<tvar name=5><https://github.com/forallsys/wire></tvar> wire\] - A tool to deploy NixOS systems. Its usage is inspired by colmena however it is not a fork.

### Docker

- \[<tvar name=1><https://github.com/hercules-ci/arion></tvar> Arion\] - configure Docker Compose with Nix modules
- \[<tvar name=2><https://nixery.dev></tvar> Nixery \] - ad-hoc container images from Nix

### Kubernetes

- \[<tvar name=1><https://github.com/xtruder/kubenix></tvar> kubenix\] - Kubernetes resource builder written in Nix
- \[<tvar name=2><https://github.com/xtruder/nix-kubernetes></tvar> nix-kubernetes\] - Kubernetes deployment manager written in nix

## Alternative nix implementations & parser

- \[<tvar name=1><https://github.com/haskell-nix/hnix></tvar> hnix\] (haskell, parser & evaluator)
- \[<tvar name=2><https://github.com/nix-community/rnix-parser></tvar> rnix\] (rust, parser)
- \[<tvar name=3><https://github.com/orivej/go-nix></tvar> go-nix\] (go, parser & nix-compatible file hasher)
- \[<tvar name=4><https://github.com/NixOS/nix-idea/tree/master/src/main/java/org/nixos/idea/lang></tvar> nix-idea\] (java, parser)
- \[<tvar name=5><https://lix.systems/></tvar> lix\] (c++, fork of \[<tvar name=6><https://github.com/NixOS/nix></tvar> NixOS/nix\])
- \[<tvar name=7><https://snix.dev/></tvar> snix\] (rust, cli & evaluator & store)

## Additional unofficial ecosystem

None of the services are required to use Nix. None of these services are affiliated with the <a href="&lt;tvar_name=1&gt;Special:MyLanguage/NixOS_Foundation&lt;/tvar&gt;" class="wikilink" title="NixOS Foundation">NixOS Foundation</a>.

\[<tvar name=1><https://cachix.org></tvar> Cachix\]  
binary caches as a service. Free for public caches, subscription for private token-protected caches.

\[<tvar name=2><https://hercules-ci.com></tvar> Hercules CI\]  
simplify your CI setup with stateless build agents. Free for open source, per-user subscription for private repositories.

\[<tvar name=3><https://garnix.io></tvar> Garnix\]  
nix CI, caching (open beta) and cloud hosting (private alpha) based on Nix as a service. Currently free, but offers commerical plans.

\[<tvar name=4><https://nixbuild.net/></tvar> nixbuild.net\]  
remote Nix builders as a service for x86_64 and AArch64. Pay-per-use.

## See also

- \[<tvar name=1><https://github.com/nix-community/awesome-nix></tvar> awesome-nix\]
- <a href="&lt;tvar_name=2&gt;Special:MyLanguage/Language-specific_package_helpers&lt;/tvar&gt;" class="wikilink" title="Language-specific package helpers">Language-specific package helpers</a>
- <a href="&lt;tvar_name=3&gt;Special:MyLanguage/Alternative_Package_Sets&lt;/tvar&gt;" class="wikilink" title="Alternative Package Sets">Alternative Package Sets</a>
- <a href="&lt;tvar_name=4&gt;Special:MyLanguage/Configuration_Collection&lt;/tvar&gt;" class="wikilink" title="Get inspiration from other peoples NixOS configuration">Get inspiration from other peoples NixOS configuration</a>
- \[<tvar name=5><https://search.nixos.org/packages></tvar> NixOS Packages Search\] for searching through NixOS packages

</translate>

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Nix{{#translation:}}" class="wikilink" title="Category:Nix{{#translation:}}">Category:Nix{{#translation:}}</a>
