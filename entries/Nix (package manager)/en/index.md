<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/en -->

<languages/> Nix is a package manager and build system that parses reproducible build instructions specified in the <a href="Nix_Expression_Language" class="wikilink" title="Nix Expression Language">Nix Expression Language</a>, a pure functional language with lazy evaluation. Nix expressions are pure functions[^1]taking dependencies as arguments and producing a *<a href="Derivations" class="wikilink" title="derivation">derivation</a>* specifying a reproducible build environment for the package. Nix stores the results of the build in unique addresses specified by a hash of the complete dependency tree, creating an immutable package store (aka the <a href="#Nix_store" class="wikilink" title="nix store">nix store</a>) that allows for atomic upgrades, rollbacks and concurrent installation of different versions of a package, essentially eliminating [dependency hell](https://en.wikipedia.org/wiki/Dependency_hell).

## Usage

### Installation

On <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, Nix is automatically installed.

On other Linux distributions or on macOS, you can install Nix following the [installation section of the Nix manual](https://nixos.org/manual/nix/stable/installation/installation).

### Nix commands

The <a href="Nix_(command_line_utilities)" class="wikilink" title="Nix commands">Nix commands</a> are documented in the [Nix reference manual](https://nixos.org/manual/nix/stable/command-ref/command-ref): main commands, utilities and experimental commands. Prior to version 2.0 (released in February 2018) there have been different commands.

### Configuration

On NixOS, Nix can be configured using the \[<https://search.nixos.org/options?query=nix>. `nix` option\].

Standalone Nix is configured through `nix.conf` (usually found in `/etc/nix/`). Details on the available options are [found in the Nix reference manual](https://nixos.org/manual/nix/stable/command-ref/conf-file).

You can also configure Nix using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, which manages declarative environments for a single user. For system-wide configuration, you can use [System Manager](https://github.com/numtide/system-manager) on Linux and [nix-darwin](https://github.com/LnL7/nix-darwin) on macOS.

## Internals

### Nix store

Packages built by Nix are placed in the read-only *Nix store*, normally found in `/nix/store`. Each package is given a unique address specified by a cryptographic hash followed by the package name and version, for example `/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`. These prefixes hash all the inputs to the build process, including the source files, the full dependency tree, compiler flags, etc. This allows Nix to simultaneously install different versions of the same package, and even different builds of the same version, for example variants built with different compilers. When adding, removing or updating a package, nothing is removed from the store; instead, symlinks to these packages are added, removed or changed in *profiles*.

#### Cleaning the Nix store

For information relating to cleaning the Nix store, refer to .

#### Nix store corruption

For information relating to fixing a corrupted Nix store, refer to .

#### Valid Nix store names

### Profiles

In order to construct a coherent user or system environment, Nix symlinks entries of the Nix store into *profiles*. These are the front-end by which Nix allows rollbacks: since the store is immutable and previous versions of profiles are kept, reverting to an earlier state is simply a matter of change the symlink to a previous profile. To be more precise, Nix symlinks binaries into entries of the Nix store representing the user environments. These user environments are then symlinked into labeled profiles stored in `/nix/var/nix/profiles`, which are in turn symlinked to the user's `~/.nix-profile`.

### Sandboxing

When sandbox builds are enabled, Nix will setup an isolated environment for each build process. It is used to remove further hidden dependencies set by the build environment to improve reproducibility. This includes access to the network during the build outside of `fetch*` functions and files outside the Nix store. Depending on the operating system access to other resources are blocked as well (ex. inter process communication is isolated on Linux).

Sandboxing is enabled by default on Linux, and disabled by default on macOS. In pull requests for [Nixpkgs](https://github.com/NixOS/nixpkgs/) people are asked to test builds with sandboxing enabled (see `Tested using sandboxing` in the pull request template) because in [official Hydra builds](https://nixos.org/hydra/) sandboxing is also used.

To configure Nix for sandboxing, set `sandbox = true` in `/etc/nix/nix.conf`; to configure NixOS for sandboxing set `nix.useSandbox = true;` in `configuration.nix`. The `nix.useSandbox` option is `true` by default since NixOS 17.09.

### Alternative Interpreters

There is an ongoing effort to reimplement Nix, from the ground up, in Rust.

- [tvix](https://cs.tvl.fyi/depot/-/tree/tvix)

There is also a community-led fork of Nix 2.18 named Lix, focused on correctness, usability, and growth. While it has also ported some components of Nix to Rust, it is not a ground-up rewrite like Tvix.

- [lix](https://lix.systems/)

Earlier attempts can be found on [riir-nix](https://riir-nix.github.io/)

## Notes

<references />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: Values cannot change during computation. Functions always produce the same output if their input does not change.
