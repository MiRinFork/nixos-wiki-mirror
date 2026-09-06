<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Swaylock -->

[Swaylock](https://github.com/swaywm/swaylock) is a screen locking utility for Wayland compositors.

## Installation

### Standalone

### Home Manager - Standalone

### Home Manager - Through Sway

## Configuration

Swaylock may be configured using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, options may be found under the [Home Manager Appendix - programs.sway.enable](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.swaylock.enable).

If you would like to use a config file instead you may instead specify a config file.

### Adding background

You can add background declaratively using similar to <a href="Wallpapers_for_Wayland" class="wikilink" title="Wallpapers for Wayland">Wallpapers for Wayland</a>. In this example, a wallpaper in [nixos-artwork](https://github.com/NixOS/nixos-artwork/tree/master/wallpapers) is set to attribute and the remaining configuration from are merged.

### Locking on suspend/timeout (swayidle)

While swaylock works in isolation, it might be desirable to use it in conjunction with <a href="Swayidle" class="wikilink" title="Swayidle">Swayidle</a> to lock after a timeout or on suspend. When swayidle is configured to trigger `swaylock` on a `lock` event, it's also possible to use `loginctl lock-session` to lock the session.

## Forks

allows built-in screenshots and image manipulation effects like blurring.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
