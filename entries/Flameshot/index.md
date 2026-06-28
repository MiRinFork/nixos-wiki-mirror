<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flameshot -->

[Flameshot](https://flameshot.org/) is a powerful screenshot and screenshot annotation tool. Flameshot allows the user to take a screenshot and then draw, write text, blur, crop, and otherwise edit screenshots with ease.

## Install

For X11 you can install Flameshot by simply adding it to your configuration file.

### Install on Wayland

In order to use Flameshot on Wayland you will need to install [Grim](https://gitlab.freedesktop.org/emersion/grim) and configure Flameshot to use it.

#### Install Grim

#### Configure Flameshot

You may do this through Home Manager, or you may configure it manually in ~/.config/flameshot.

## Home Manager

You can configure Flameshot settings through Home Manager with the following syntax. Additional settings may be found on the [Flameshot](https://github.com/flameshot-org/flameshot/blob/master/flameshot.example.ini) Github and adapted into Nix. See documented settings in the [Home Manager Appendix - services.flameshot](https://nix-community.github.io/home-manager/options.xhtml#opt-services.flameshot.enable).

## Setting Shortcuts

Setting shortcuts is different depending on your Desktop Environment. You can can check Flameshot CLI commands that you can use for shortcuts by running `man flameshot`.

### Sway

## Troubleshooting

With the release of v14.0.0 of Flameshot, users may experience several issues depending on their setup. This section will cover most common situations and their solutions.

### Unable to take a screenshot: portal timed out/screenshot aborted

By default, Flameshot now uses XDG desktop portal calls for screenshotting. This necessitates having `xdg-desktop-portal` + portal(s) with Access and Screenshot interfaces installed (see ArchWiki's [Portal Backends](https://wiki.archlinux.org/title/XDG_Desktop_Portal#List_of_backends_and_interfaces) list). Without those, screenshot attempts will fail.

Users on X11 window managers will be unable to use the default method; no portal provides a Screenshot interface there. The solution is to enable "Use legacy X11 screenshot" method located in the "General" tab of Flameshot GUI config. If using Home Manager's Flameshot module, this option can be enabled by adding `useX11LegacyScreenshot = true` to the settings configuration.

### Multi-monitor screenshot prompt

When taking screenshots, Flameshot will now open a prompt on multi-monitor setups to choose a display to capture. This is contrast with the pre-v14 behaviour, where capturing was rendered across all screens. Users on X11 may disable this behaviour by enabling "Capture active monitor (skip monitor selection)" in the "General" tab Flameshot GUI config. If using Home Manager's Flameshot module, this option can be enabled by adding `captureActiveMonitor = true` to the settings configuration.

Wayland users are unable to disable this due to its security design and lack of cross-platform solutions. To circumvent this behaviour, it is recommended to change keybind from default `flameshot gui` to, for example `flameshot screen --edit`. This will capture the currently active display (wherever the cursor is) and open the GUI editor. This will occasionally incorrectly select a display, however.

### Incorrect capture overlay render

Some users, most commonly on X11 window managers, may experience regressions in how screen capture is rendered, more so on multi-monitor setups. Instead of opening as an overlay, it might open as a separate window. The cause is currently unknown and solutions may vary depending on how window management is implemented by each manager.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
