<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Firefox/zh -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

<strong>Firefox</strong>[^1] is a free and open-source web browser developed by the Mozilla Foundation. It is known for its focus on privacy, security, and user freedom, offering a customizable experience through a rich ecosystem of add-ons and themes.

</div>

<span id="Installation"></span>

## 安装

#### Shell

<div lang="en" dir="ltr" class="mw-content-ltr">

The command above makes `firefox` available in your current shell without modifying any configuration files.

</div>

<span id="System_setup"></span>

#### 系统设置

<div lang="en" dir="ltr" class="mw-content-ltr">

After rebuilding with `nixos-rebuild switch`, Firefox will be installed system-wide.

</div>

<span id="Configuration"></span>

## 配置

<span id="Basic"></span>

#### 基础

<div lang="en" dir="ltr" class="mw-content-ltr">

The snippet above enables Firefox for all users (or the current Home Manager profile, if placed in `home.nix`).

</div>

<span id="Advanced"></span>

#### 进阶

<div lang="en" dir="ltr" class="mw-content-ltr">

Home Manager allows for deep customization of Firefox, including extensions, search engines, bookmarks, and themes. The example below shows a configuration for adding custom search engines with aliases.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

[More options are available on Home Manager's site.](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.firefox.enable)

</div>

<span id="Firefox_Variants"></span>

## Firefox 版本

<div lang="en" dir="ltr" class="mw-content-ltr">

There are several Firefox variants available. To choose one, set the `programs.firefox.package` option accordingly.

</div>

<span id="Variant:_Official_Binaries"></span>

### 版本：官方二进制程序

<div lang="en" dir="ltr" class="mw-content-ltr">

Mozilla provides official pre-built Firefox binaries via the `firefox-bin` package, which are downloaded directly from Mozilla's servers.

</div>

<span id="Variant:_Extended_Support_Release_(ESR)"></span>

### 版本：扩展支持版本 (ESR)

<div lang="en" dir="ltr" class="mw-content-ltr">

`firefox-esr` is a variant that receives security updates for a longer period with a slower feature implementation cadence. It also allows for more extensive policy-based configuration.

</div>

<span id="Variant:_Nightly"></span>

### 版本：夜间版

<div lang="en" dir="ltr" class="mw-content-ltr">

Nightly builds are daily builds from the central Mozilla repository.

</div>

<span id="Method_1:_Using_nix-community/flake-firefox-nightly"></span>

#### 方法一：使用 nix-community/flake-firefox-nightly

<div lang="en" dir="ltr" class="mw-content-ltr">

This method is reproducible but may lag behind the upstream version. First, add the input to your flake:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Then, add the package to your system:

</div>

<span id="Method_2:_Using_mozilla/nixpkgs-mozilla"></span>

#### 方法二：使用 mozilla/nixpkgs-mozilla

<div lang="en" dir="ltr" class="mw-content-ltr">

This method is not necessarily reproducible without a flake-like system but will always be the latest version.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Using this method requires the `--impure` flag for Nix commands, for example:

</div>

<span id="Tips_and_Tricks"></span>

## 使用技巧

<span id="Force_XWayland_(X11)_instead_of_Wayland"></span>

#### 强制使用 XWayland (X11) 而非 Wayland

<div lang="en" dir="ltr" class="mw-content-ltr">

Firefox defaults to native Wayland when running under a Wayland compositor. To force it to use XWayland (X11) instead:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This is useful when troubleshooting Wayland-specific issues or when certain features work better under X11.

</div>

<span id="Touchpad_Gestures_and_Smooth_Scrolling"></span>

#### 触控板手势和流畅滚动

<div lang="en" dir="ltr" class="mw-content-ltr">

Enable `xinput2` to improve touchscreen support and enable additional touchpad gestures and smooth scrolling.

</div>

<span id="KDE_Plasma_Integration"></span>

#### KDE Plasma 集成

<div lang="en" dir="ltr" class="mw-content-ltr">

1\. Add the native messaging host package to your configuration:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

2\. Install the corresponding [browser add-on](https://addons.mozilla.org/en-US/firefox/addon/plasma-integration/).

</div>

<span id="Use_KDE_file_picker"></span>

#### 使用 KDE 文件选择器

<div lang="en" dir="ltr" class="mw-content-ltr">

To use the KDE file picker instead of the GTK one, set the following preference:

</div>

<span id="Troubleshooting"></span>

## 故障排除

<span id="Native_Messaging_Hosts_Fail_to_Load"></span>

#### 本地消息传递进程加载失败

<div lang="en" dir="ltr" class="mw-content-ltr">

Native messaging hosts (used for extensions like Plasma Integration) do not work with the `-bin` variants of Firefox or with Firefox installed imperatively via `nix-env`. You must use a variant built from source via your NixOS or Home Manager configuration.

</div>

<span id="ALSA_audio_instead_of_PulseAudio"></span>

#### 使用 ALSA 音频而非 PulseAudio

<div lang="en" dir="ltr" class="mw-content-ltr">

To force Firefox to use ALSA, you can override it with a wrapper:

</div>

<span id="Screen_Sharing_under_Wayland"></span>

#### Wayland 下的屏幕共享

<div lang="en" dir="ltr" class="mw-content-ltr">

Screen sharing on Wayland requires enabling PipeWire and the appropriate XDG Desktop Portals.

</div>

<span id="See_also"></span>

## 另见

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – Declarative per-user configuration
- [NixOS options for Firefox](https://search.nixos.org/options?channel=unstable&query=programs.firefox)
- [Firefox topics on NixOS Discourse](https://discourse.nixos.org/tag/firefox)

</div>

<span id="References"></span>

## 参考

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Browser" class="wikilink" title="Category:Web Browser">Category:Web Browser</a>

[^1]: Mozilla Foundation, "Firefox", Official Website, Accessed June 2025. <https://www.mozilla.org/firefox>
