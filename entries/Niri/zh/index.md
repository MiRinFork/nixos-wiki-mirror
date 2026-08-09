<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Niri/zh -->

<languages/>

[Niri](https://github.com/niri-wm/niri) 是一个可滚动平铺的 <a href="Special:MyLanguage/Wayland" class="wikilink" title="Wayland">Wayland</a> 合成器。

<span id="Installation"></span>

## 安装

只需启用 ：

<span id="Configuration"></span>

## 配置

niri 的配置路径为 。因此，可以使用 <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> 进行配置：

如果您希望在构建过程中对配置进行验证，可以使用 ，用法如下：

您可能想从[默认配置文件](https://github.com/niri-wm/niri/blob/main/resources/default-config.kdl)开始，如[这里](https://github.com/niri-wm/niri/wiki/Getting-Started#main-default-hotkeys)所述。

有关 niri 的配置选项，请参阅 [此 wiki](https://niri-wm.github.io/niri/)。

### Greetd

您可以使用 greeted 配置启动 niri：

<span id="Additional_Setup"></span>

## 额外设置

如[示例 systemd 设置 (niri wiki)](https://github.com/niri-wm/niri/wiki/Example-systemd-Setup)中所述，您可能需要设置一些额外的服务，包括以下的 <a href="Special:MyLanguage/Swayidle" class="wikilink" title="Swayidle">Swayidle</a>、<a href="Special:MyLanguage/Swaylock" class="wikilink" title="Swaylock">Swaylock</a>、<a href="Special:MyLanguage/Waybar" class="wikilink" title="Waybar">Waybar</a>、<a href="Special:MyLanguage/Polkit" class="wikilink" title="Polkit">Polkit</a> 和 <a href="Special:MyLanguage/Secret_Service" class="wikilink" title="Secret Service">Secret Service</a>，以补充常规窗口管理器的功能。其中一些设置也是启用[默认配置文件](https://github.com/niri-wm/niri/blob/main/resources/default-config.kdl)所有功能所必需的。

或者使用 <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>：

<span id="Troubleshooting"></span>

## 故障排除

<span id="IME_not_working_on_Electron_apps"></span>

### IME 在 Electron 应用中无法正常工作

有一种通用的解决方法，即按照<a href="Special:MyLanguage/Wayland#Electron_and_Chromium" class="wikilink" title="Wayland#Electron_and_Chromium">Wayland#Electron_and_Chromium</a>中的说明设置：

然而，由于 niri 不支持 text-input-v1，有时需要通过手动添加 标志来启用 text-input-v3，IME 才能正常工作：

``` console
$ slack --wayland-text-input-version=3
```

`wrapProgram` 可用于自动添加该标志：

<span id="XWayland_apps_not_working"></span>

### XWayland 应用无法正常工作

Niri 有一个可选依赖，强烈建议安装（您可阅读 [这篇文章](https://github.com/niri-wm/niri/wiki/Xwayland) 以了解更多相关信息）。

或者使用 <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

安装 后，niri 将会将其无缝集成，您的所有 XWayland 应用都将正常运行。

<span id="File_picker_not_working"></span>

### 文件选择器无法正常工作

如果您正在使用 `xdg-desktop-portal-gnome`，它会尝试将 Nautilus 用作文件选择器，但如果未安装 Nautilus，则会失败。

为解决此问题，您可以改为强制使用 GTK 或 KDE 的文件选择器门户：

<span id="Waybar_launches_twice"></span>

### Waybar 启动两次

在使用诸如 programs.waybar.enable 这样的配置选项时，waybar 在 Niri 上可能会启动两次。这是因为[默认的 Niri 配置文件会在系统启动时自动启动 waybar](https://github.com/niri-wm/niri/blob/b07bde3ee82dd73115e6b949e4f3f63695da35ea/resources/default-config.kdl#L271)。请从该配置文件中移除 spawn-at-startup "waybar" 的设置，或者在不使用 home-manager 选项的情况下，将 waybar 添加到系统的软件包列表中。

<span id="See_Also"></span>

## 另见

- <a href="Special:MyLanguage/Wayland" class="wikilink" title="Wayland">Wayland</a>
- <a href="Special:MyLanguage/Sway" class="wikilink" title="Sway">Sway</a>
- <a href="Special:MyLanguage/Wallpapers_for_Wayland" class="wikilink" title="用于 Wayland 的壁纸">用于 Wayland 的壁纸</a>
- [niri-flake](https://github.com/sodiboo/niri-flake/)

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications{{#translation:}}" class="wikilink" title="Category:Applications{{#translation:}}">Category:Applications{{#translation:}}</a>
