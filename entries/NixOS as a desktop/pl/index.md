<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a desktop/pl -->

<languages/>

<div class="mw-translate-fuzzy">

NixOS może być używany do wielu rzeczy, Jeżeli chcesz używać go jako głowny system do codziennego użytku (bezpośrednio na komputerze lub jako wirtualną maszyne), ta strona jest dla ciebie, Nawet jeżeli twoje ambicje to używanie NixOS w chmurze lub specjalnie skonfigurowanych serwerach, możesz chcieć sie zapoznać z lekcjami które są tutaj aby bardziej sie zapoznać z ekosystemem Nix

</div>

<span id="Installation"></span>

## Instalacja

<div class="mw-translate-fuzzy">

Jeśli wolisz czytać, zobacz <a href="NixOS_Installation_Guide" class="wikilink" title="NixOS Installation Guide">NixOS Installation Guide</a>, aby rozpocząć. Dobrze prezentowana opcja wideo znajduje się w sekcji przewodnika wideo bezpośrednio poniżej. Należy pamiętać, że w przypadku instalacji stacjonarnej prawdopodobnie będziesz chciał upewnić się, że zaczniesz od co najmniej 30 GiB dostępnej przestrzeni dysku, aby umożliwić środowiska graficzne (np. GNOME, KDE lub XFCE), przeglądarki (np. Firefox), oraz inne aplikacje graficzne (np. VSCode), które byłyby typowe dla codziennego użycia. 15 GiB może wystarczyć na bardzo lekki system.

</div>

<span id="Managing_your_configuration"></span>

## Zarządzanie konfiguracją

<div class="mw-translate-fuzzy">

Możliwe jest zarządzanie całą konfiguracją przy użyciu metod udokumentowanych w [NixOS official manual](https://nixos.org/manual/nixos/stable/index.html). Jednak większość członków społeczności, którzy używają NixOS na pulpicie, woli zarządzać swoimi konfiguracjami użytkownika (np. „dotfiles”) przy użyciu <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> (potrzebne cytowanie). Home Manager to narzędzie dla użytkownika do deklarowania tego, co chcesz i jak chcesz to skonfigurować, a zatem byłby używany zamiast większości ustawień, które w innym przypadku umieściłbyś w [configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config) lub przez <a href="FAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F" class="wikilink" title="nix-env">nix-env</a>

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

### Z Flakes

<div class="mw-translate-fuzzy">

Jeśli chcesz bardziej czystą konfigurację NixOS, wciąz eksperymentalna funckja <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> powoduje wiele emocji w społeczności. Zarządzanie Flakes wymaga dobrego podstawowego zrozumienia i niektórych istniejących doświadczeń z ekosystemem Nix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Refer to <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a> for details on getting started.

</div>

<span id="Beyond_initial_setup"></span>

## Po początkowej konfiguracji

<div class="mw-translate-fuzzy">

Po zapoznaniu się z ekosystemem Nix i masz funkcjonalną instalację systemu NixOS, prawdopodobnie będziesz zainteresowany dostosowaniem i bardziej szczegółową konfiguracją.

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

## Modularyzowanie konfiguracji

</div>

<span id="Modularizing_your_configuration_with_modules"></span>

<div class="mw-translate-fuzzy">

### Z modułami NixOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<span id="See_also"></span>

<div class="mw-translate-fuzzy">

### Nauka na przykładzie

</div>

<div class="mw-translate-fuzzy">

Sprawdź <a href="Comparison_of_NixOS_setups" class="wikilink" title="Comparison of NixOS setups">Comparison of NixOS setups</a> dla tabeli porównującej popularne opcje.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
