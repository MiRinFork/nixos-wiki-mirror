<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS/pt-br -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

[NixOS](https://nixos.org/) é uma distribuição Linux baseada no gerenciador de pacotes e sistema de builds <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a>. Ele suporta o gerenciamento [declarativo](https://en.wikipedia.org/wiki/Declarative_programming) de configurações de todo o sistema, bem como atualizações e reversões (rollbacks) [atômicas](https://en.wikipedia.org/wiki/Atomicity_(database_systems)); embora também possa suportar, adicionalmente, o gerenciamento [imperativo](https://en.wikipedia.org/wiki/Imperative_programming) de pacotes e usuários. No NixOS, todos os componentes da distribuição — incluindo o [kernel](https://en.wikipedia.org/wiki/Linux_kernel), [pacotes](https://en.wikipedia.org/wiki/Package_manager) instalados e arquivos de configuração do sistema — são construídos pelo <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> através de <a href="Wikipedia:Pure_function" class="wikilink" title="funções puras">funções puras</a> chamadas de <a href="Special:MyLanguage/Nix_Expression_Language" class="wikilink" title="expressões Nix">expressões Nix</a>.

<div lang="en" dir="ltr" class="mw-content-ltr">

Since Nix uses [binary](https://en.wikipedia.org/wiki/Executable) caching, this provides a unique compromise between the binary-oriented approach used by distributions such as Debian and the [source](https://en.wikipedia.org/wiki/Source_code)-oriented approach used by distributions such as Gentoo. Binaries can be used for standard components, and custom-built packages and modules can be used automatically when a pre-built binary is not available.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Stable NixOS releases are delivered twice a year (around the end of May and the end of November). NixOS was created by [Eelco Dolstra](https://edolstra.github.io/) and [Armijn Hemel](https://en.wikipedia.org/wiki/Armijn_Hemel), and initially released in 2003. It is community developed and maintained under the stewardship of the <a href="Special:MyLanguage/Nix_Community#NixOS_Foundation" class="wikilink" title="NixOS Foundation">NixOS Foundation</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Installation

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For a full installation guide, see the [Installation chapter of the NixOS manual](https://nixos.org/nixos/manual/index.html#ch-installation). This wiki also includes alternative or supplemental guides, such as <a href="Special:MyLanguage/NixOS_as_a_desktop" class="wikilink" title="NixOS as a desktop">NixOS as a desktop</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Most users will install NixOS via [one of the ISO images.](https://nixos.org/download/#nixos-iso) Both "graphical" and "minimal" ISO variants are available for each supported architecture; the "graphical" images are suitable for users intending to install a desktop environment, and the "minimal" images are suitable for users intending to install NixOS in a server role or desiring a smaller ISO image. The ISO images are hybrid images which can be burnt to optical media or copied raw to a USB drive and booted as-is. See the installation guide for details.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In addition to the ISO images, the [download page](https://nixos.org/download/#nixos-iso) provides a number of alternative methods for installing NixOS. These include:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Virtual appliances in OVA format (compatible with VirtualBox);
- Amazon EC2 AMIs;

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Additionally, many existing Linux installations can be converted into NixOS installations using [nixos-infect](https://github.com/elitak/nixos-infect) or [nixos-in-place](https://github.com/jeaye/nixos-in-place); this is particularly useful for installing NixOS on hosting providers which do not natively support NixOS.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### System architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS provides out of the box support for most x86_64 devices, and generic ARM64 devices.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### 32-bit x86 architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Support for 32-bit x86 architectures (i.e. `i686`) has been declining. While most packages should still compile and run, their cache availability is significantly reduced[^1]. The 32-bit x86 ISO is no longer offered as a ready-built image, but it may still be built manually.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### 64-bit x86 architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Most `x86_64` devices should run NixOS without issues.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### 32-bit ARM architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS isn't officially supported on ARM32 devices (e.g. `armv6` and `armv7l`), however, for some of these devices, there may be community support.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### 64-bit ARM architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

As long as a device supports the generic systemd boot process, NixOS should run out of the box. However, specific devices with proprietary bootloaders may have issues running it.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### MIPS architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

There used to be limited support for MIPS architectures in NixOS, and remnants of this support may still be found in Nixpkgs. However, there is no official support.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### RISC-V architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS does not provide official support for RISC-V devices. However, several devices may benefit from community support.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Usage

</div>

<span id="declarative-configuration"></span>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Declarative Configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

One of NixOS's defining features is its declarative configuration model, where the entire system state — including installed packages, system services, and settings — is described in configuration files. The primary file is typically located at `/etc/nixos/configuration.nix`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Changes to the configuration are applied atomically using `nixos-rebuild switch`, ensuring reproducibility and the ability to roll back to previous states. Most users track their configuration files in a version control system, enabling consistent and portable system setups. These shortcomings are often rectified after-the-fact if at all by configuration management solutions such as Puppet, Ansible or Chef. These tools reconcile system configuration with a description of the expected state. However, these tools are not integrated into the operating system design and are simply layered on top, and OS configuration may still vary where an aspect of OS configuration has not been specified in the description of expected state.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Unlike conventional distributions, where system configuration is often scattered across manually edited files, NixOS integrates configuration management directly into the operating system. This eliminates configuration drift and makes NixOS particularly well-suited for automated, reproducible deployments.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For more details and examples on NixOS configurations, see <a href="Special:MyLanguage/NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Imperative Operations

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

While NixOS is typically configured declaratively as much as possible, these are a few domains where imperative operations are still necessary; these include user environment management and channel management.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### User Environments

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In addition to declarative system configuration, NixOS users can utilize Nix's imperative `nix-env` command to install packages at the user level, without changing the system state. See the <a href="Special:MyLanguage/Nix#User_Environments" class="wikilink" title=" user environments section of the Nix article"> user environments section of the Nix article</a> for more information.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Channels

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In the <a href="Special:MyLanguage/Nix_ecosystem" class="wikilink" title="Nix ecosystem">Nix ecosystem</a>, <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="channels">channels</a> are a mechanism for distributing collections of <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nix packages">Nix packages</a> and <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> module definitions. A channel represents a curated, versioned set of package definitions and system configurations, typically corresponding to a particular release or the latest available development state.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

When using channels, your system or <a href="Special:MyLanguage/User_Environment" class="wikilink" title="user environment">user environment</a> pulls package definitions and options from a URL pointing to a specific snapshot of the Nix Packages collection (Nixpkgs) and associated NixOS modules.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For more information on using and configuring nix channels, refer to <a href="Special:MyLanguage/channel_branches" class="wikilink" title="channel branches">channel branches</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Internals

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Comparison with traditional Linux Distributions

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

*Main Article: <a href="Special:MyLanguage/Nix_vs._Linux_Standard_Base" class="wikilink" title="Nix vs. Linux Standard Base">Nix vs. Linux Standard Base</a>*

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The main difference between NixOS and other Linux distributions is that NixOS does not follow the [Linux Standard Base](https://en.wikipedia.org/wiki/Linux_Standard_Base) file system structure. On LSB-compliant systems software is stored under `/{,usr}/{bin,lib,share}` and configuration is generally stored in `/etc`. Software binaries are available in the user environment if they are placed in one of the LSB's `/bin` directories. When a program references dynamic libraries it will search for the required libraries in the LSB folders (`/lib`, `/usr/lib`).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In NixOS however `/lib` and `/usr/lib` do not exist. Instead all system libraries, binaries, kernels, firmware and configuration files are placed in the <a href="Special:MyLanguage/Nix#Nix_store" class="wikilink" title="Nix store">Nix store</a>. The files and directories in `/nix/store` are named by hashes of the information describing the built data. All of the files and directories placed in the Nix store are immutable. `/bin` and `/usr/bin` are almost absent: they contain only `/bin/sh` and `/usr/bin/env` respectively, to provide minimal compatibility with existing scripts using shebang lines. User-level environments are implemented using a large number of symbolic links to all required packages and auxiliary files. These environments are called <a href="Special:MyLanguage/Nix#Profiles" class="wikilink" title="profiles">profiles</a> and are stored in `/nix/var/nix/profiles`, each user having their own profiles. Structuring the system in this way is how NixOS obtains its key advantages over conventional Linux distributions, such as atomicity and rollback support.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Usage of the Nix store

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A lot of confusion for newcomers arises from the fact that configuration is stored in the read-only `/nix/store` tree along with all the installed packages. This fact makes it impossible to manually edit system configuration; all configuration changes must be performed by editing the `/etc/nixos/configuration.nix` file and executing `nixos-rebuild switch`. NixOS provides the <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="module system">module system</a> for editing all required configurations. Users should first use [the option search tool](https://search.nixos.org/options) to check if the option they need exists before attempting to manually add files or configuration via low-level NixOS features like activation scripts.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The system purity makes it possible to keep system configuration in a central place, without the need to edit multiple files. This configuration can be distributed or version controlled as desired. It also provides for determinism; if you provide the same inputs, the same version of Nixpkgs and the same `/etc/nixos/configuration.nix` you will get the exact same system state.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Modules

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS module system">NixOS module system</a> as defined in <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> provides the means necessary to customize the configuration of the OS. It is used to enable and customize services such as nginx, enable firmware and customize the kernel.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

All module configuration is generally performed by adding options to `/etc/nixos/configuration.nix`. Most of the examples in the wiki show how this file can be used to configure the OS.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The NixOS module system implements a typing system which allows typechecking of option settings. It also enables options defined in multiple places to be merged automatically. This allows you to spread your configuration over multiple files, and the options you set across all of those files will be merged together:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See the [Modules section of the NixOS Manual](https://nixos.org/nixos/manual/index.html#sec-writing-modules) for more details.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Generations

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Every time the system state is rebuilt using `nixos-rebuild switch`, a new generation is created. You can revert to the previous generation at any time, which is useful if a configuration change (or system update) turns out to be detrimental.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can roll back via:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

``` shell
$ nix-env --rollback               # roll back a user environment
$ nixos-rebuild switch --rollback  # roll back a system environment
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS also places entries for previous generations in the bootloader menu, so as a last resort you can always revert to a previous configuration by rebooting. To set the currently booted generation as the default run

</div>

``` shell
$ /run/current-system/bin/switch-to-configuration boot
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Because NixOS keeps previous generations of system state available in case rollback is desired, old package versions aren't deleted from your system immediately after an update. You can delete old generations manually:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

``` shell
# delete generations older than 30 days
$ nix-collect-garbage --delete-older-than 30d
</div>

<div lang="en" dir="ltr" class="mw-content-ltr">
# delete ALL previous generations - you can no longer rollback after running this
$ nix-collect-garbage -d                       
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

List generations:

``` shell
# as root
$ nix-env --list-generations --profile /nix/var/nix/profiles/system
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Switch generations:

``` shell
# as root switch to generation 204
$ nix-env --profile /nix/var/nix/profiles/system --switch-generation 204
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

delete broken generation(s):

``` shell
# as root delete broken generations 205 and 206 
$ nix-env --profile /nix/var/nix/profiles/system --delete-generations 205 206
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can configure automatic garbage collection by setting the [nix.gc](https://search.nixos.org/options?query=nix.gc) options in `/etc/nixos/configuration.nix`. This is recommended, as it keeps the size of the Nix store down.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## See also

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS modules">NixOS modules</a>, a library for modular <a href="Special:MyLanguage/Overview_of_the_Nix_Expression_Language#Expressions" class="wikilink" title="Nix expressions">Nix expressions</a> which powers <a href="#declarative-configuration" class="wikilink" title="the declarative configuration of NixOS">the declarative configuration of NixOS</a>.
- <a href="Special:MyLanguage/NixOS_VM_tests" class="wikilink" title="NixOS VM tests">NixOS VM tests</a>, a library for creating reproducible infrastructure tests, based on <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>, QEMU and Perl.
- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book) (Ryan4yin, 2023) - 🛠️ ❤️ An unofficial NixOS & Flakes book for beginners.

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix{{#translation:}}" class="wikilink" title="Category:Nix{{#translation:}}">Category:Nix{{#translation:}}</a>

[^1]: <https://discourse.nixos.org/t/limited-cache-availability-for-i686-32-bits-x86-architecture/37626>
