<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS/en -->

<languages/>

[NixOS](https://nixos.org/) is a Linux distribution based on the <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> package manager and build system. It supports <a href="Wikipedia:Declarative_programming" class="wikilink" title="declarative">declarative</a> system-wide <a href="Wikipedia:Configuration_management" class="wikilink" title="configuration management">configuration management</a> as well as <a href="Wikipedia:Atomicity_(database_systems)" class="wikilink" title="atomic">atomic</a> upgrades and rollbacks, although it can additionally support <a href="Wikipedia:Imperative_programming" class="wikilink" title="imperative">imperative</a> package and user management. In NixOS, all components of the distribution — including the <a href="Wikipedia:Linux_kernel" class="wikilink" title="kernel">kernel</a>, installed <a href="Wikipedia:Package_manager" class="wikilink" title="packages">packages</a> and system configuration files — are built by <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> from <a href="Wikipedia:Pure_function" class="wikilink" title="pure functions">pure functions</a> called <a href="Special:MyLanguage/Nix_(language)" class="wikilink" title="Nix expressions">Nix expressions</a>.

Since Nix uses <a href="Wikipedia:Executable" class="wikilink" title="binary">binary</a> caching, this provides a unique compromise between the binary-oriented approach used by distributions such as Debian and the <a href="Wikipedia:Source_code" class="wikilink" title="source">source</a>-oriented approach used by distributions such as Gentoo. Binaries can be used for standard components, and custom-built packages and modules can be used automatically when a pre-built binary is not available.

Stable NixOS releases are delivered twice a year (around the end of May and the end of November). NixOS was created by [Eelco Dolstra](https://edolstra.github.io/) and <a href="Wikipedia:Armijn_Hemel" class="wikilink" title="Armijn Hemel">Armijn Hemel</a>, and initially released in 2003. It is community developed and maintained under the stewardship of the <a href="Special:MyLanguage/Nix_Community#NixOS_Foundation" class="wikilink" title="NixOS Foundation">NixOS Foundation</a>.

## Installation

For a full installation guide, see the [Installation chapter of the NixOS manual](https://nixos.org/nixos/manual/index.html#ch-installation). This wiki also includes alternative or supplemental guides, such as <a href="Special:MyLanguage/NixOS_as_a_desktop" class="wikilink" title="NixOS as a desktop">NixOS as a desktop</a>.

Most users will install NixOS via [one of the ISO images.](https://nixos.org/download/#nixos-iso) Both "graphical" and "minimal" ISO variants are available for each supported architecture; the "graphical" images are suitable for users intending to install a desktop environment, and the "minimal" images are suitable for users intending to install NixOS in a server role or desiring a smaller ISO image. The ISO images are hybrid images which can be burnt to optical media or copied raw to a USB drive and booted as-is. See the installation guide for details.

In addition to the ISO images, the [download page](https://nixos.org/download/#nixos-iso) provides a number of alternative methods for installing NixOS. These include:

- Virtual appliances in OVA format (compatible with VirtualBox);
- Amazon EC2 AMIs;

Additionally, many existing Linux installations can be converted into NixOS installations using [nixos-infect](https://github.com/elitak/nixos-infect) or [nixos-in-place](https://github.com/jeaye/nixos-in-place); this is particularly useful for installing NixOS on hosting providers which do not natively support NixOS.

### System architectures

NixOS provides out of the box support for most x86_64 devices, and generic ARM64 devices.

#### 32-bit x86 architectures

Support for 32-bit x86 architectures (i.e. `i686`) has been declining. While most packages should still compile and run, their cache availability is significantly reduced[^1]. The 32-bit x86 ISO is no longer offered as a ready-built image, but it may still be built manually.

#### 64-bit x86 architectures

Most `x86_64` devices should run NixOS without issues.

#### 32-bit ARM architectures

NixOS isn't officially supported on ARM32 devices (e.g. `armv6` and `armv7l`), however, for some of these devices, there may be community support.

#### 64-bit ARM architectures

As long as a device supports the generic systemd boot process, NixOS should run out of the box. However, specific devices with proprietary bootloaders may have issues running it.

#### MIPS architectures

There used to be limited support for MIPS architectures in NixOS, and remnants of this support may still be found in Nixpkgs. However, there is no official support.

#### RISC-V architectures

NixOS does not provide official support for RISC-V devices. However, several devices may benefit from community support.

## Usage

<span id="declarative-configuration"></span>

### Declarative Configuration

One of NixOS's defining features is its declarative configuration model, where the entire system state — including installed packages, system services, and settings — is described in configuration files. The primary file is typically located at `/etc/nixos/configuration.nix`.

Changes to the configuration are applied atomically using `nixos-rebuild switch`, ensuring reproducibility and the ability to roll back to previous states. Most users track their configuration files in a version control system, enabling consistent and portable system setups. These shortcomings are often rectified after-the-fact if at all by configuration management solutions such as Puppet, Ansible or Chef. These tools reconcile system configuration with a description of the expected state. However, these tools are not integrated into the operating system design and are simply layered on top, and OS configuration may still vary where an aspect of OS configuration has not been specified in the description of expected state.

Unlike conventional distributions, where system configuration is often scattered across manually edited files, NixOS integrates configuration management directly into the operating system. This eliminates configuration drift and makes NixOS particularly well-suited for automated, reproducible deployments.

For more details and examples on NixOS configurations, see <a href="Special:MyLanguage/NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>.

### Imperative Operations

While NixOS is typically configured declaratively as much as possible, these are a few domains where imperative operations are still necessary; these include user environment management and channel management.

#### User Environments

In addition to declarative system configuration, NixOS users can utilize Nix's imperative `nix-env` command to install packages at the user level, without changing the system state. See the <a href="Special:MyLanguage/Nix#User_Environments" class="wikilink" title=" user environments section of the Nix article"> user environments section of the Nix article</a> for more information.

#### Channels

In the <a href="Special:MyLanguage/Nix_ecosystem" class="wikilink" title="Nix ecosystem">Nix ecosystem</a>, <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="channels">channels</a> are a mechanism for distributing collections of <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nix packages">Nix packages</a> and <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> module definitions. A channel represents a curated, versioned set of package definitions and system configurations, typically corresponding to a particular release or the latest available development state.

When using channels, your system or <a href="Special:MyLanguage/User_Environment" class="wikilink" title="user environment">user environment</a> pulls package definitions and options from a URL pointing to a specific snapshot of the Nix Packages collection (Nixpkgs) and associated NixOS modules.

For more information on using and configuring nix channels, refer to <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="channel branches">channel branches</a>.

## Internals

### Comparison with traditional Linux Distributions

*Main Article: <a href="Special:MyLanguage/Nix_vs._Linux_Standard_Base" class="wikilink" title="Nix vs. Linux Standard Base">Nix vs. Linux Standard Base</a>*

The main difference between NixOS and other Linux distributions is that NixOS does not follow the <a href="Wikipedia:Linux_Standard_Base" class="wikilink" title="Linux Standard Base ">Linux Standard Base </a> file system structure. On LSB-compliant systems software is stored under `/{,usr}/{bin,lib,share}` and configuration is generally stored in `/etc`. Software binaries are available in the user environment if they are placed in one of the LSB's `/bin` directories. When a program references dynamic libraries it will search for the required libraries in the LSB folders (`/lib`, `/usr/lib`).

In NixOS however `/lib` and `/usr/lib` do not exist. Instead all system libraries, binaries, kernels, firmware and configuration files are placed in the <a href="Special:MyLanguage/Nix_(package_manager)#Nix_store" class="wikilink" title="Nix store">Nix store</a>. The files and directories in `/nix/store` are named by hashes of the information describing the built data. All of the files and directories placed in the Nix store are immutable. `/bin` and `/usr/bin` are almost absent: they contain only `/bin/sh` and `/usr/bin/env` respectively, to provide minimal compatibility with existing scripts using shebang lines. User-level environments are implemented using a large number of symbolic links to all required packages and auxiliary files. These environments are called <a href="Special:MyLanguage/Nix#Profiles" class="wikilink" title="profiles">profiles</a> and are stored in `/nix/var/nix/profiles`, each user having their own profiles. Structuring the system in this way is how NixOS obtains its key advantages over conventional Linux distributions, such as atomicity and rollback support.

### Usage of the Nix store

A lot of confusion for newcomers arises from the fact that configuration is stored in the read-only `/nix/store` tree along with all the installed packages. This fact makes it impossible to manually edit system configuration; all configuration changes must be performed by editing the `/etc/nixos/configuration.nix` file and executing `nixos-rebuild switch`. NixOS provides the <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="module system">module system</a> for editing all required configurations. Users should first use [the option search tool](https://search.nixos.org/options) to check if the option they need exists before attempting to manually add files or configuration via low-level NixOS features like activation scripts.

The system purity makes it possible to keep system configuration in a central place, without the need to edit multiple files. This configuration can be distributed or version controlled as desired. It also provides for determinism; if you provide the same inputs, the same version of Nixpkgs and the same `/etc/nixos/configuration.nix` you will get the exact same system state.

### Modules

The <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS module system">NixOS module system</a> as defined in <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> provides the means necessary to customize the configuration of the OS. It is used to enable and customize services such as nginx, enable firmware and customize the kernel.

All module configuration is generally performed by adding options to `/etc/nixos/configuration.nix`. Most of the examples in the wiki show how this file can be used to configure the OS.

The NixOS module system implements a typing system which allows typechecking of option settings. It also enables options defined in multiple places to be merged automatically. This allows you to spread your configuration over multiple files, and the options you set across all of those files will be merged together:

See the [Modules section of the NixOS Manual](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) for more details.

### Generations

Every time the system state is rebuilt using `nixos-rebuild switch`, a new generation is created. You can revert to the previous generation at any time, which is useful if a configuration change (or system update) turns out to be detrimental.

You can roll back via:

``` console
$ nix-env --rollback               # roll back a user environment
$ nixos-rebuild switch --rollback  # roll back a system environment
```

NixOS also places entries for previous generations in the bootloader menu, so as a last resort you can always revert to a previous configuration by rebooting. To set the currently booted generation as the default run

``` console
$ /run/current-system/bin/switch-to-configuration boot
```

Because NixOS keeps previous generations of system state available in case rollback is desired, old package versions aren't deleted from your system immediately after an update. You can delete old generations manually:

``` console
$ # delete generations older than 30 days
$ nix-collect-garbage --delete-older-than 30d

$ # delete ALL previous generations - you can no longer rollback after running this
$ nix-collect-garbage -d                       
```

List generations:

``` console
$ # as root
$ nix-env --list-generations --profile /nix/var/nix/profiles/system
```

Switch generations:

``` console
$ # as root switch to generation 204
$ nix-env --profile /nix/var/nix/profiles/system --switch-generation 204
```

delete broken generation(s):

``` console
$ # as root delete broken generations 205 and 206 
$ nix-env --profile /nix/var/nix/profiles/system --delete-generations 205 206
```

You can configure automatic garbage collection by setting the [nix.gc](https://search.nixos.org/options?query=nix.gc) options in `/etc/nixos/configuration.nix`. This is recommended, as it keeps the size of the Nix store down.

## See also

- <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS modules">NixOS modules</a>, a library for modular <a href="Special:MyLanguage/Overview_of_the_Nix_Expression_Language#Expressions" class="wikilink" title="Nix expressions">Nix expressions</a> which powers <a href="#declarative-configuration" class="wikilink" title="the declarative configuration of NixOS">the declarative configuration of NixOS</a>.
- <a href="Special:MyLanguage/NixOS_VM_tests" class="wikilink" title="NixOS VM tests">NixOS VM tests</a>, a library for creating reproducible infrastructure tests, based on <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>, QEMU and Perl.
- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book) (Ryan4yin, 2023) - 🛠️ ❤️ An unofficial NixOS & Flakes book for beginners.

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>

[^1]: <https://discourse.nixos.org/t/limited-cache-availability-for-i686-32-bits-x86-architecture/37626>
