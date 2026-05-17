<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a desktop/ru -->

<languages/>

<div class="mw-translate-fuzzy">

NixOS может быть использована для разных целей. Если вы желаете использовать её как основную десктопную ОС для повседневного использования (на реальном железе или [виртуальной машине](https://twitter.com/mitchellh/status/1346136404682625024)(англ.)), то эта страница для вас. Даже если вы планируете использовать NixOS в облаке или на специально настроенных серверах, вы, возможно, хотите начать с уроков, изложенных здесь, чтобы ближе познакомиться с экосистемой Nix.

</div>

<span id="Installation"></span>

## Установка

Если вы предпочитаете чтение, для начала посмотрите <a href="NixOS_Installation_Guide/ru" class="wikilink" title="инструкцию по установке">инструкцию по установке</a>. Учитывайте, что для десктопной установки, вам потребуется как минимум 30 Гб места на диске, чтобы вместить <a href=":Category:Desktop_environment" class="wikilink" title="рабочее окружение">рабочее окружение</a>, <a href=":Category:Web_Browser" class="wikilink" title="браузеры">браузеры</a>, и другие <a href=":Category:Applications" class="wikilink" title="графические утилиты">графические утилиты</a>, что вполне разумно для повседневного использования. Для минимальной установки, вероятно, хватит и 15 Гб.

<span id="Managing_your_configuration"></span>

## Управление своей конфигурацией

Как описанно в <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="Обзор NixOS Linux дистрибутива (англ.)">Обзор NixOS Linux дистрибутива (англ.)</a>, NixOS декларативный. Это значит, что, полную конфигурацию системы, включая установленные пакеты, сервисы, параметры ядра, и пользовательские аккаунты обьявлены в конфигурационном файле, обычно в `/etc/nixos/configuration.nix`. Затем эти настройки могут быть применены последовательно и воспроизводимо ко всем компьютерам.

Процесс в настройке вашей конфигурации описан в документе .

<span id="System_Configuration"></span>

### Систеиная конфигурация

Онсновным конфигурационным файлом яляется `/etc/nixos/configuration.nix`, который определяет общие и основные системные настройки. Такие как: активация сервисов, управлением системы пользователей, установки системных настроек, и установки указанных пакетов. Изменения можно увидеть с помощью комманды:

``` console
# nixos-rebuild switch
```

<span id="User_configuration_with_Home_Manager"></span>

### Пользовательская конфигурация с Home Manager

Для настройки пользовательских конфигураций, таких как, настройка приложений, коммандных утилит, и dot-файлов, <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> обеспечивает удобный и декларотивный подход. Он позволяет пользователям вписывать какие программы будут устновленны и как настроены, без нужды включать их в общую систему [configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config).

Home Manager работает независимо от системной концигурации (configuration.nix). Помимо традиционных настроек Home Manager поддерживает новый способ конфигурации, с помощью <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>.

<span id="With_Flakes"></span>

### С помощью Flakes

Для пользователей, которые ищут более простой и воспроизводимый способ управления конфигурациями NixOS, в сообществе набирает популярность функция <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>. Хотя Flakes предлагает несколько новых концепций по сравнению с традиционными рабочими процессами, многие пользователи находят их удобным и организованным подходом к управлению конфигурациями системы и разработки.

Смотрите <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a> для подробного понимания в начале.

<div lang="en" dir="ltr" class="mw-content-ltr">

## Beyond initial setup

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Once your basic NixOS installation is complete and functional, you can further customize your system with a variety of optional configurations tailored for desktop use. For a list of recommended initial system configurations, see <a href="NixOS_Installation_Guide#NixOS_configuration" class="wikilink" title="NixOS Installation Guide#NixOS configuration">NixOS Installation Guide#NixOS configuration</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Common configuration areas include:

</div>

<span id="Desktop_Environments"></span>

#### Рабочие Окружения

Установка и настройка полнофункциональных рабочих окружений таких как <a href="GNOME" class="wikilink" title="GNOME">GNOME</a>, <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a>, или <a href="Xfce" class="wikilink" title="Xfce">Xfce</a>.

Смотрите полный список <a href=":Category:Desktop_environment" class="wikilink" title=":Category:Desktop environment">:Category:Desktop environment</a>.

<span id="Window_Managers"></span>

#### Оконные Менеджеры

Устновка легковесных или тайловых оконных менеджеров по типу <a href="i3" class="wikilink" title="i3">i3</a>, <a href="Sway" class="wikilink" title="Sway">Sway</a>, <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> или <a href="xmonad" class="wikilink" title="xmonad">xmonad</a>.

Полный список <a href=":Category:Window_managers" class="wikilink" title=":Category:Window managers">:Category:Window managers</a>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Display Managers (Login Managers)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Configure graphical session managers such as <a href="Gnome" class="wikilink" title="GDM">GDM</a>, <a href="KDE" class="wikilink" title="SDDM">SDDM</a>, or <a href="LightDM" class="wikilink" title="LightDM">LightDM</a>.

</div>

<span id="Audio_Setup"></span>

#### Настройка звука

Активация и настройка звка <a href=":Category:Audio" class="wikilink" title="audio">audio</a> таких как <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a>, <a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a> или <a href="ALSA" class="wikilink" title="ALSA">ALSA</a>.

<span id="Network_Management"></span>

#### Настройка Сети

Используйте истумены такие как <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> или <a href="systemd-networkd" class="wikilink" title="systemd-networkd">systemd-networkd</a> для настройки сети <a href="Networking" class="wikilink" title="network">network</a>

<span id="Bluetooth_Support"></span>

#### Поддержка Bluetooth

Настройте <a href="Bluetooth" class="wikilink" title="Bluetooth">Bluetooth</a> с помощью blueman или других похожих утилит.

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Power Management

</div>

Настройте <a href="laptop" class="wikilink" title="laptop">laptop</a> <a href="Power_Management" class="wikilink" title="battery management">battery management</a>, сон, и гибернацию с такими инструментами как <a href="Laptop#tlp" class="wikilink" title="tlp">tlp</a> или <a href="systemd" class="wikilink" title="systemd">systemd</a> сервисом.

<span id="Printing_and_Scanning"></span>

#### Печать и скан

Включите <a href="Cups" class="wikilink" title="Cups">Cups</a> для поддержки принтера и инструментов типа Sane для <a href="Scanners" class="wikilink" title="сканеров">сканеров</a>.

<span id="Tips_and_tricks"></span>

## Советы и рекомендации

<span id="Modularizing_your_configuration_with_modules"></span>

### Модулизация вашей конфигурации с помощью модулей

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<span id="See_also"></span>

## См. Также

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
