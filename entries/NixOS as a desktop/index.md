<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a desktop -->

<languages/> <translate> <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> is a versatile operating system suitable for a wide range of use cases. This page is intended for users who wish to run NixOS as their primary desktop environment, either on physical hardware or within a virtual machine. Additionally, users planning to deploy NixOS in <a href="NixOS_friendly_hosters" class="wikilink" title="cloud">cloud</a> environments or on specialized server infrastructure may find it helpful to begin with the concepts and practices introduced here, as they provide a useful foundation for working within the broader <a href="Nix_ecosystem" class="wikilink" title="Nix ecosystem">Nix ecosystem</a>.

## Installation

Refer to <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a> to get started. Keep in mind that, for a desktop installation, you will probably want to make sure you start with at least 30 GiB of available disk space to allow for the <a href=":Category:Desktop_environment" class="wikilink" title="desktop environments">desktop environments</a>, <a href=":Category:Web_Browser" class="wikilink" title="web browsers">web browsers</a>, and other <a href=":Category:Applications" class="wikilink" title="graphical applications">graphical applications</a>, that would be typical of daily use. 15 GiB might be enough for a fairly bare-bones setup.

## Managing your configuration

As described in the <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="Overview of the NixOS Linux distribution#Declarative Configuration">Overview of the NixOS Linux distribution#Declarative Configuration</a>, NixOS is designed to be configured declaratively. This means the entire system configuration, including installed packages, system services, kernel parameters, and user accounts is defined in configuration files, typically in `/etc/nixos/configuration.nix`. These settings can then be applied consistently and reproducibly across machines.

The process for managing your configuration is documented in the .

### System Configuration

The primary configuration file, `/etc/nixos/configuration.nix`, defines system-wide settings. This includes options like enabling services, managing system users, setting hardware options, and specifying installed packages. Changes are applied with:

``` console
# nixos-rebuild switch
```

### User configuration with Home Manager

For managing per-user configurations such as application preferences, command-line tools, and dotfiles, <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> provides a convenient, declarative approach. It allows users to define which programs should be installed and how they should be configured, without needing to include those settings in the system-wide [configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config).

Home Manager can be used independently of the system configuration and works with both traditional setups and newer <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>-based configurations.

### With Flakes

For users looking for a more streamlined and reproducible way to manage NixOS configurations, the <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> feature has been gaining popularity within the community. While Flakes introduce some new concepts compared to traditional workflows, many users find them a convenient and organized approach to managing system and development configurations.

Refer to <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a> for details on getting started.

## Beyond initial setup

Once your basic NixOS installation is complete and functional, you can further customize your system with a variety of optional configurations tailored for desktop use. For a list of recommended initial system configurations, see <a href="NixOS_Installation_Guide#NixOS_configuration" class="wikilink" title="NixOS Installation Guide#NixOS configuration">NixOS Installation Guide#NixOS configuration</a>.

Common configuration areas include:

#### Desktop Environments

Install and configure full-featured environments such as <a href="GNOME" class="wikilink" title="GNOME">GNOME</a>, <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a>, or <a href="Xfce" class="wikilink" title="Xfce">Xfce</a>.

See <a href=":Category:Desktop_environment" class="wikilink" title=":Category:Desktop environment">:Category:Desktop environment</a> for a full list.

#### Window Managers

Set up lightweight or tiling window managers like <a href="i3" class="wikilink" title="i3">i3</a>, <a href="Sway" class="wikilink" title="Sway">Sway</a>, <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a>, or <a href="XMonad" class="wikilink" title="XMonad">XMonad</a>.

See <a href=":Category:Window_managers" class="wikilink" title=":Category:Window managers">:Category:Window managers</a> for a full list.

#### Display Managers (Login Managers)

Configure graphical session managers such as <a href="Gnome" class="wikilink" title="GDM">GDM</a>, <a href="KDE" class="wikilink" title="SDDM">SDDM</a>, or <a href="LightDM" class="wikilink" title="LightDM">LightDM</a>.

#### Audio Setup

Enable and configure <a href=":Category:Audio" class="wikilink" title="audio">audio</a> systems like <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a>, <a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a>, or <a href="ALSA" class="wikilink" title="ALSA">ALSA</a>.

#### Network Management

Use tools such as <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> or <a href="systemd-networkd" class="wikilink" title="systemd-networkd">systemd-networkd</a> for managing <a href="Networking" class="wikilink" title="network">network</a> connections.

#### Bluetooth Support

Set up <a href="Bluetooth" class="wikilink" title="Bluetooth">Bluetooth</a> with blueman or other management tools.

#### Power Management

Configure <a href="laptop" class="wikilink" title="laptop">laptop</a> <a href="Power_Management" class="wikilink" title="battery management">battery management</a>, suspend, and hibernation with tools like <a href="Laptop#tlp" class="wikilink" title="tlp">tlp</a> or <a href="systemd" class="wikilink" title="systemd">systemd</a> services.

#### Printing and Scanning

Enable <a href="Cups" class="wikilink" title="Cups">Cups</a> for printer support and tools like Sane for <a href="Scanners" class="wikilink" title="scanning">scanning</a> devices.

## Tips and tricks

### Modularizing your configuration with modules

## See also

- <a href="Overview_of_the_NixOS_Linux_distribution" class="wikilink" title="Overview of the NixOS Linux distribution">Overview of the NixOS Linux distribution</a>
- <a href="Comparison_of_NixOS_setups" class="wikilink" title="Comparison of NixOS setups">Comparison of NixOS setups</a> for a table comparing some popular choices.
- <a href="Configuration_Collection" class="wikilink" title="Configuration Collection">Configuration Collection</a> for a long list within the wiki.
- [nix-flake](https://github.com/topics/nix-flake), [nixos-configuration](https://github.com/topics/nixos-configuration), [nixos-dotfiles](https://github.com/topics/nixos-dotfiles) Github topics
- <a href="Wil_T_Nix_Guides" class="wikilink" title="Wil T Nix Guides">Wil T Nix Guides</a> Youtube video format guide

</translate>

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
