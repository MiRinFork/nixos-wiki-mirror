<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a desktop/ja -->

<languages/> <a href="NixOS" class="wikilink" title="NixOS">NixOSは</a>、幅広い用途に適した汎用性の高いOSです。 このページでは、NixOSをメインのデスクトップ環境として実機またはVM上で実行したいユーザーを対象としています。 また、<a href="NixOS_friendly_hosters" class="wikilink" title="クラウド">クラウド</a>環境やサーバーインフラとしてNixOSを導入する場合でも、より広範な<a href="Nix_ecosystem" class="wikilink" title="Nixエコシステム">Nixエコシステムを</a>理解するにはここで紹介する概念と実践は役立つでしょう。

<span id="Installation"></span>

## インストール

インストールするには、<a href="NixOS_Installation_Guide" class="wikilink" title="NixOSインストールガイド">NixOSインストールガイドを</a>参照して下さい。 デスクトップインストールをする場合は、<a href=":Category:Desktop_environment" class="wikilink" title="デスクトップ環境">デスクトップ環境</a>、<a href=":Category:Web_Browser" class="wikilink" title="ウェブブラウザ">ウェブブラウザ</a>、その他の<a href=":Category:Applications" class="wikilink" title="GUIアプリケーション">GUIアプリケーションなどの</a>日常的に使用するアプリケーションに必要となるディスク用量として、少なくとも30GiBの空き容量を確保しておくことを推奨します。 必要最低限の機能を備えたセットアップであれば、15GiBで十分でしょう。

<span id="Managing_your_configuration"></span>

## 構成の管理

<div lang="en" dir="ltr" class="mw-content-ltr">

As described in the <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="Overview of the NixOS Linux distribution#Declarative Configuration">Overview of the NixOS Linux distribution#Declarative Configuration</a>, NixOS is designed to be configured declaratively. This means the entire system configuration, including installed packages, system services, kernel parameters, and user accounts is defined in configuration files, typically in `/etc/nixos/configuration.nix`. These settings can then be applied consistently and reproducibly across machines.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The process for managing your configuration is documented in the .

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### System Configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The primary configuration file, `/etc/nixos/configuration.nix`, defines system-wide settings. This includes options like enabling services, managing system users, setting hardware options, and specifying installed packages. Changes are applied with:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

``` console
# nixos-rebuild switch
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### User configuration with Home Manager

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For managing per-user configurations such as application preferences, command-line tools, and dotfiles, <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> provides a convenient, declarative approach. It allows users to define which programs should be installed and how they should be configured, without needing to include those settings in the system-wide [configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Home Manager can be used independently of the system configuration and works with both traditional setups and newer <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>-based configurations.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### With Flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For users looking for a more streamlined and reproducible way to manage NixOS configurations, the <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> feature has been gaining popularity within the community. While Flakes introduce some new concepts compared to traditional workflows, many users find them a convenient and organized approach to managing system and development configurations.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Refer to <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a> for details on getting started.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Beyond initial setup

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Once your basic NixOS installation is complete and functional, you can further customize your system with a variety of optional configurations tailored for desktop use. For a list of recommended initial system configurations, see <a href="NixOS_Installation_Guide#NixOS_configuration" class="wikilink" title="NixOS Installation Guide#NixOS configuration">NixOS Installation Guide#NixOS configuration</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Common configuration areas include:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Desktop Environments

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Install and configure full-featured environments such as <a href="GNOME" class="wikilink" title="GNOME">GNOME</a>, <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a>, or <a href="Xfce" class="wikilink" title="Xfce">Xfce</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See <a href=":Category:Desktop_environment" class="wikilink" title=":Category:Desktop environment">:Category:Desktop environment</a> for a full list.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Window Managers

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Set up lightweight or tiling window managers like <a href="i3" class="wikilink" title="i3">i3</a>, <a href="Sway" class="wikilink" title="Sway">Sway</a>, <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a>, or <a href="xmonad" class="wikilink" title="xmonad">xmonad</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See <a href=":Category:Window_managers" class="wikilink" title=":Category:Window managers">:Category:Window managers</a> for a full list.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Display Managers (Login Managers)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Configure graphical session managers such as <a href="Gnome" class="wikilink" title="GDM">GDM</a>, <a href="KDE" class="wikilink" title="SDDM">SDDM</a>, or <a href="LightDM" class="wikilink" title="LightDM">LightDM</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Audio Setup

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Enable and configure <a href=":Category:Audio" class="wikilink" title="audio">audio</a> systems like <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a>, <a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a>, or <a href="ALSA" class="wikilink" title="ALSA">ALSA</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Network Management

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Use tools such as <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> or <a href="systemd-networkd" class="wikilink" title="systemd-networkd">systemd-networkd</a> for managing <a href="Networking" class="wikilink" title="network">network</a> connections.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Bluetooth Support

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Set up <a href="Bluetooth" class="wikilink" title="Bluetooth">Bluetooth</a> with blueman or other management tools.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Power Management

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Configure <a href="laptop" class="wikilink" title="laptop">laptop</a> <a href="Power_Management" class="wikilink" title="battery management">battery management</a>, suspend, and hibernation with tools like <a href="Laptop#tlp" class="wikilink" title="tlp">tlp</a> or <a href="systemd" class="wikilink" title="systemd">systemd</a> services.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Printing and Scanning

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Enable <a href="Cups" class="wikilink" title="Cups">Cups</a> for printer support and tools like Sane for <a href="Scanners" class="wikilink" title="scanning">scanning</a> devices.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Tips and tricks

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Modularizing your configuration with modules

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## See also

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Overview_of_the_NixOS_Linux_distribution" class="wikilink" title="Overview of the NixOS Linux distribution">Overview of the NixOS Linux distribution</a>
- <a href="Comparison_of_NixOS_setups" class="wikilink" title="Comparison of NixOS setups">Comparison of NixOS setups</a> for a table comparing some popular choices.
- <a href="Configuration_Collection" class="wikilink" title="Configuration Collection">Configuration Collection</a> for a long list within the wiki.
- [nix-flake](https://github.com/topics/nix-flake), [nixos-configuration](https://github.com/topics/nixos-configuration), [nixos-dotfiles](https://github.com/topics/nixos-dotfiles) Github topics
- <a href="Wil_T_Nix_Guides" class="wikilink" title="Wil T Nix Guides">Wil T Nix Guides</a> Youtube video format guide

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
