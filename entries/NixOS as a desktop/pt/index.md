<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a desktop/pt -->

<languages/>

<div class="mw-translate-fuzzy">

O NixOS pode ser usado para diversas finalidades. Se você deseja usá-lo como sistema operacional de desktop principal para seu uso diário. Esta página é para você. Mesmo que sua ambição seja usar o NixOS na nuvem ou em servidores especialmente configurados, você pode começar com as lições descritas aqui para se familiarizar mais amplamente com o ecossistema Nix.

</div>

<span id="Installation"></span>

## Instalação

<div class="mw-translate-fuzzy">

Se preferir ler, veja <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a> Para começar. Para uma opção de vídeo bem apresentada, veja a seção de guia de vídeo logo abaixo. Lembre-se de que, para uma instalação em desktop, você provavelmente precisará começar com pelo menos 30 GiB de espaço em disco disponível para os ambientes de desktop (por exemplo, GNOME, KDE ou XFCE), navegadores (por exemplo, Firefox) e outros aplicativos gráficos (por exemplo, VSCode) que seriam típicos de uso diário. 15 GiB podem ser suficientes para uma configuração bastante básica.

</div>

<span id="Managing_your_configuration"></span>

## Gerenciando sua configuração

<div class="mw-translate-fuzzy">

É possível gerenciar toda a sua configuração usando os métodos documentados no [NixOS official manual](https://nixos.org/manual/nixos/stable/index.html). No entanto, a maioria dos membros da comunidade que usam o NixOS no desktop preferem gerenciar suas configurações de usuário usando (e.g. "dotfiles") <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> (citação necessária). O Home Manager é uma ferramenta orientada ao usuário para declarar o que você deseja instalar e como deseja configurá-lo e, portanto, seria usado no lugar da maioria das configurações que você normalmente colocaria em um [configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config) ou através <a href="FAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F" class="wikilink" title="nix-env">nix-env</a>

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

<span id="With_Flakes"></span>

### Com Flakes

<div class="mw-translate-fuzzy">

Se você quer uma composição de Configuração do NixOS, ainda experimental <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> está causando muita excitação na comunidade. Gerenciar flocos requer um bom entendimento básico e alguma experiência prática com o ecossistema Nix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Refer to <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a> for details on getting started.

</div>

<span id="Beyond_initial_setup"></span>

## Além da configuração inicial

<div class="mw-translate-fuzzy">

Depois de se familiarizar com o ecossistema Nix e ter uma instalação funcional do NixOS para desktop, você provavelmente se interessará por personalizações e configurações mais detalhadas.

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

<span id="Tips_and_tricks"></span>

<div class="mw-translate-fuzzy">

## Gerenciando sua configuração

</div>

<span id="Modularizing_your_configuration_with_modules"></span>

<div class="mw-translate-fuzzy">

### Com os Modulos NixOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<span id="See_also"></span>

<div class="mw-translate-fuzzy">

### Aprenda com exemplos

</div>

<div class="mw-translate-fuzzy">

Confira <a href="Comparison_of_NixOS_setups" class="wikilink" title="Comparison of NixOS setups">Comparison of NixOS setups</a> para uma tabela comparando algumas opções populares.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
