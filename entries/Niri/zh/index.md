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

<div lang="en" dir="ltr" class="mw-content-ltr">

There is a general workaround to set as described in <a href="Special:MyLanguage/Wayland#Electron_and_Chromium" class="wikilink" title="Wayland#Electron_and_Chromium">Wayland#Electron_and_Chromium</a>:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

However, since niri does not support text-input-v1, sometimes enabling text-input-v3 by manually adding flag is necessary for IME to work:

</div>

``` console
$ slack --wayland-text-input-version=3
```

<div lang="en" dir="ltr" class="mw-content-ltr">

`wrapProgram` may be used to add the flag automatically:

</div>

<span id="XWayland_apps_not_working"></span>

### XWayland 应用无法正常工作

<div lang="en" dir="ltr" class="mw-content-ltr">

There is a optional dependency for niri which is highly recommended to install (you can read [this](https://github.com/niri-wm/niri/wiki/Xwayland) article to learn more about this)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Or using <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

After you installed niri will integrate it out of the box and all of your XWayland apps will function properly.

</div>

<span id="File_picker_not_working"></span>

### 文件选择器无法正常工作

<div lang="en" dir="ltr" class="mw-content-ltr">

If you are using `xdg-desktop-portal-gnome`, it will attempt to use Nautilus as the file picker, which will fail if Nautilus is not installed.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To work around this problem, you can force usage of the gtk or kde portals for file picker instead:

</div>

<span id="Waybar_launches_twice"></span>

### Waybar 启动两次

<div lang="en" dir="ltr" class="mw-content-ltr">

When using a configuration option like programs.waybar.enable, waybar may launch twice on Niri. This is because the [default Niri config file launches waybar on launch](https://github.com/niri-wm/niri/blob/b07bde3ee82dd73115e6b949e4f3f63695da35ea/resources/default-config.kdl#L271). Remove the spawn-at-startup "waybar" from the config file, or add waybar to your systems packages without using the home-manager option.

</div>

<span id="See_Also"></span>

## 另见

- <a href="Special:MyLanguage/Wayland" class="wikilink" title="Wayland">Wayland</a>
- <a href="Special:MyLanguage/Sway" class="wikilink" title="Sway">Sway</a>
- <a href="Special:MyLanguage/Wallpapers_for_Wayland" class="wikilink" title="用于 Wayland 的壁纸">用于 Wayland 的壁纸</a>
- [niri-flake](https://github.com/sodiboo/niri-flake/)

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications{{#translation:}}" class="wikilink" title="Category:Applications{{#translation:}}">Category:Applications{{#translation:}}</a>
