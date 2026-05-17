<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Firefox/ru -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

<strong>Firefox</strong>[^1] is a free and open-source web browser developed by the Mozilla Foundation. It is known for its focus on privacy, security, and user freedom, offering a customizable experience through a rich ecosystem of add-ons and themes.

</div>

<span id="Installation"></span>

## Установка

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Shell

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The command above makes `firefox` available in your current shell without modifying any configuration files.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### System setup

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

After rebuilding with `nixos-rebuild switch`, Firefox will be installed system-wide.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Basic

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The snippet above enables Firefox for all users (or the current Home Manager profile, if placed in `home.nix`).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Advanced

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Home Manager allows for deep customization of Firefox, including extensions, search engines, bookmarks, and themes. The example below shows a configuration for adding custom search engines with aliases.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

[More options are available on Home Manager's site.](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.firefox.enable)

</div>

<span id="Firefox_Variants"></span>

## Версии Firefox

<div lang="en" dir="ltr" class="mw-content-ltr">

There are several Firefox variants available. To choose one, set the `programs.firefox.package` option accordingly.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Variant: Official Binaries

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Mozilla provides official pre-built Firefox binaries via the `firefox-bin` package, which are downloaded directly from Mozilla's servers.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Variant: Extended Support Release (ESR)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

`firefox-esr` is a variant that receives security updates for a longer period with a slower feature implementation cadence. It also allows for more extensive policy-based configuration.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Variant: Nightly

</div>

<div class="mw-translate-fuzzy">

Nightly builds - это ежедневные сборки Firefox из центрального репозитория Mozilla.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Method 1: Using nix-community/flake-firefox-nightly

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This method is reproducible but may lag behind the upstream version. First, add the input to your flake:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Then, add the package to your system:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Method 2: Using mozilla/nixpkgs-mozilla

</div>

<div class="mw-translate-fuzzy">

Использование этого метода плохо сказывается на воспроизводимости, так как ресурсы берутся с URL-адресов, не относящихся к привязке, но это также означает, что вы всегда получаете последнюю Nightly версию, когда собираете свою систему.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Using this method requires the `--impure` flag for Nix commands, for example:

</div>

<span id="Tips_and_Tricks"></span>

<div class="mw-translate-fuzzy">

## Советы

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Force XWayland (X11) instead of Wayland

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Firefox defaults to native Wayland when running under a Wayland compositor. To force it to use XWayland (X11) instead:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This is useful when troubleshooting Wayland-specific issues or when certain features work better under X11.

</div>

<span id="Touchpad_Gestures_and_Smooth_Scrolling"></span>

<div class="mw-translate-fuzzy">

### Использовать Xinput2

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Enable `xinput2` to improve touchscreen support and enable additional touchpad gestures and smooth scrolling.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### KDE Plasma Integration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1\. Add the native messaging host package to your configuration:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

2\. Install the corresponding [browser add-on](https://addons.mozilla.org/en-US/firefox/addon/plasma-integration/).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Use KDE file picker

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To use the KDE file picker instead of the GTK one, set the following preference:

</div>

<span id="Troubleshooting"></span>

<div class="mw-translate-fuzzy">

## Устранение неполадок

</div>

<span id="Native_Messaging_Hosts_Fail_to_Load"></span>

<div class="mw-translate-fuzzy">

### `nativeMessagingHosts` не работает

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Native messaging hosts (used for extensions like Plasma Integration) do not work with the `-bin` variants of Firefox or with Firefox installed imperatively via `nix-env`. You must use a variant built from source via your NixOS or Home Manager configuration.

</div>

<span id="ALSA_audio_instead_of_PulseAudio"></span>

<div class="mw-translate-fuzzy">

### Как использовать ALSA в Firefox вместо PulseAudio?

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To force Firefox to use ALSA, you can override it with a wrapper:

</div>

<span id="Screen_Sharing_under_Wayland"></span>

<div class="mw-translate-fuzzy">

### Поделиться Экраном через Wayland

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Screen sharing on Wayland requires enabling PipeWire and the appropriate XDG Desktop Portals.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## See also

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – Declarative per-user configuration
- [NixOS options for Firefox](https://search.nixos.org/options?channel=unstable&query=programs.firefox)
- [Firefox topics on NixOS Discourse](https://discourse.nixos.org/tag/firefox)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## References

</div>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Browser" class="wikilink" title="Category:Web Browser">Category:Web Browser</a>

[^1]: Mozilla Foundation, "Firefox", Official Website, Accessed June 2025. <https://www.mozilla.org/firefox>
