<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS as a desktop/zh -->

<languages/> <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> 是一款功能多样的操作系统，适用于各种用例。本文面向希望将 NixOS 作为主要桌面环境（无论是在物理硬件还是虚拟机中）的用户。此外，计划在 <a href="NixOS_friendly_hosters" class="wikilink" title="云端">云端</a> 环境或专用服务器基础架构上部署 NixOS 的用户，可能会发现从这里介绍的概念和实践开始会很有帮助，因为它们为在更广泛的 <a href="Special:MyLanguage/Nix_ecosystem" class="wikilink" title="Nix 生态系统">Nix 生态系统</a> 中工作奠定了有益的基础。

<span id="Installation"></span>

## 安装

<div class="mw-translate-fuzzy">

如果你倾向于阅读, 请从<a href="NixOS_Installation_Guide" class="wikilink" title="NixOS安装指南">NixOS安装指南</a>开始. 如果你想选择一个精良的视频教程, 请见下一条. 请记住, 为了安装一个桌面, 你需要确定一开始有至少30GiB的可用硬盘空间来容纳桌面环境(比如说, GNOME, KDE, 或者是XFCE), 浏览器(比如Firefox), 以及其他带有图形界面的典型日用软件(如VSCode). 对于相对简陋的配置, 15GiB可能够用.

</div>

<span id="Managing_your_configuration"></span>

## 管理你的配置

<div class="mw-translate-fuzzy">

你可以使用[NixOS官方手册](https://nixos.org/manual/nixos/stable/index.html)中记录的方式来管理你的所有配置. 然而, 大部分在桌面上使用NixOS的社区成员更喜欢使用<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>来管理他们的配置(比如"点文件")(citation needed). Home Manager是一个面向用户的工具, 用于声明你想安装什么, 以及你想如何配置它. 对于大部分设置, 如果你不使用Home Manager的话, 你就要把它们放入[configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config), 或者使用<a href="FAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F" class="wikilink" title="nix-env">nix-env</a>.

</div>

关于如何管理配置，请参阅 。

<span id="System_Configuration"></span>

### 系统配置

`/etc/nixos/configuration.nix`是主配置文件，用于定义系统级设置。其中包括启用服务、管理系统用户、配置硬件选项以及指定安装的软件包。 若要使更改生效，请运行：

``` console
# nixos-rebuild switch
```

<span id="User_configuration_with_Home_Manager"></span>

### 使用 Home Manager 管理用户配置

针对应用程序偏好设置、命令行工具以及 dotfiles 等用户级配置的管理，<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> 提供了一种便捷的声明式方案。

它允许用户自行定义需要安装的程序及其具体配置方式，而无需将这些设置写入系统级的 [configuration.nix](https://nixos.org/manual/nixos/stable/#sec-changing-config) 中。

Home Manager 可以独立于系统配置使用，既支持传统设置，也支持基于 <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> 的新式配置。

<span id="With_Flakes"></span>

### 通过Flakes

<div class="mw-translate-fuzzy">

如果你想要可组合性<sup>\[citation needed\]</sup>更强的NixOS配置设定, 仍在实验阶段的<a href="Flakes" class="wikilink" title="Flakes">Flakes</a>特性正在使社区感到十分兴奋. 管理flakes需要对Nix生态有良好的基本理解和一些已有的实践经验.

</div>

关于如何开始的详细信息，请参考 <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a>。

<span id="Beyond_initial_setup"></span>

## 在初始设置之外

<div class="mw-translate-fuzzy">

在你熟悉了Nix生态并安装了一个功能性的NixOS桌面后, 你可能会想了解定制化和更细化的设置.

</div>

常见配置项包含：

<span id="Desktop_Environments"></span>

#### 桌面环境

安装并配置功能完备的桌面环境，如 <a href="GNOME" class="wikilink" title="GNOME">GNOME</a>、<a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a> 或 <a href="Xfce" class="wikilink" title="Xfce">Xfce</a>。

完整列表请参阅 <a href=":Category:Desktop_environment" class="wikilink" title=":Category:Desktop environment">:Category:Desktop environment</a>。

<span id="Window_Managers"></span>

#### 窗口管理器

设置 <a href="i3" class="wikilink" title="i3">i3</a>、<a href="Sway" class="wikilink" title="Sway">Sway</a>、<a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> 或 <a href="xmonad" class="wikilink" title="xmonad">xmonad</a> 等轻量级或平铺式窗口管理器。

完整列表请参阅 <a href=":Category:Window_managers" class="wikilink" title=":Category:Window managers">:Category:Window managers</a>。

<span id="Display_Managers_(Login_Managers)"></span>

#### 显示管理器（登录管理器）

配置图形会话管理器，例如 <a href="Gnome" class="wikilink" title="GDM">GDM</a>、<a href="KDE" class="wikilink" title="SDDM">SDDM</a> 或 <a href="LightDM" class="wikilink" title="LightDM">LightDM</a>。

<span id="Audio_Setup"></span>

#### 音频配置

启用并配置 <a href=":Category:Audio" class="wikilink" title="音频">音频</a> 系统，例如 <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a>、<a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a> 或 <a href="ALSA" class="wikilink" title="ALSA">ALSA</a>。

<span id="Network_Management"></span>

#### 网络管理

使用诸如 <a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> 或 <a href="systemd-networkd" class="wikilink" title="systemd-networkd">systemd-networkd</a> 的工具来管理 <a href="Networking" class="wikilink" title="网络">网络</a> 连接。

<span id="Bluetooth_Support"></span>

#### 蓝牙支持

使用 blueman 或其他工具配置与管理<a href="Bluetooth" class="wikilink" title="蓝牙">蓝牙</a>。

<span id="Power_Management"></span>

#### 电源管理

使用诸如 <a href="Laptop#tlp" class="wikilink" title="tlp">tlp</a> 或 <a href="systemd" class="wikilink" title="systemd">systemd</a> 服务等工具配置 <a href="laptop" class="wikilink" title="笔记本">笔记本</a> 的 <a href="Power_Management" class="wikilink" title="电池管理">电池管理</a>、挂起与休眠。

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Printing and Scanning

</div>

启用 <a href="Cups" class="wikilink" title="Cups">Cups</a> 以支持打印机，并使用诸如 Sane 的工具来支持 <a href="Scanners" class="wikilink" title="扫描">扫描</a> 设备。

<span id="Tips_and_tricks"></span>

## 提示和技巧

<span id="Modularizing_your_configuration_with_modules"></span>

### 通过 NixOS 模块机制模块化你的配置

<span id="See_also"></span>

## 另见

<div class="mw-translate-fuzzy">

在<a href="Comparison_of_NixOS_setups" class="wikilink" title="对NixOS设置的比较">对NixOS设置的比较</a>中可查看一个对常见选择进行比较的表格.

</div>

<a href="Category:Desktop" class="wikilink" title="分类：桌面">分类：桌面</a> <a href="Category:Guide" class="wikilink" title="分类：指南">分类：指南</a> <a href="Category:NixOS" class="wikilink" title="分类：NixOS">分类：NixOS</a>
