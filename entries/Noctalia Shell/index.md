<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Noctalia Shell -->

[Noctalia Shell](https://github.com/noctalia-dev/noctalia) is a sleek and minimal desktop shell thoughtfully crafted for Wayland.

Noctalia provides native support for <a href="Niri" class="wikilink" title="Niri">Niri</a>, <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a>, <a href="Sway" class="wikilink" title="Sway">Sway</a>, <a href="Scroll" class="wikilink" title="Scroll">Scroll</a>, <a href="Labwc" class="wikilink" title="Labwc">Labwc</a> and <a href="MangoWC" class="wikilink" title="MangoWC">MangoWC</a>. Other Wayland compositors may work but could require additional configuration for compositor-specific features like workspaces and window management.[^1]

## Installation[^2]

A Nix package for Noctalia is currently available on the unstable channel.

### Noctalia Shell Flake

You can also get the latest Git version of Noctalia by using <a href="flakes" class="wikilink" title="flakes">flakes</a>. If not using the NixOS or Home Manager module, we can install Noctalia using: Alternatively, we can just enable Noctalia using the NixOS or Home Manager module. For example, for Home Manager:

## Configuration

Noctalia's settings can be declared through the Home Manager module's `programs.noctalia.settings` option, which writes `~/.config/noctalia/config.toml` from the Nix store. The file is generated only when `settings` is non-empty, so leaving it unset is one way to keep that file under your own control — for example by managing `~/.config/noctalia` as an out-of-store symlink.[^3] Note that `customPalettes` is written to `~/.config/noctalia/palettes/` independently of this option.

## See also

- [Noctalia Architecture — Volatile NixOS Configuration](https://wiki.infernalcode.com/desktop/noctalia/) — a worked v5 configuration: bar and plugin layout, and a generated Material 3 palette shared with the terminal and prompt.

[^1]: [<https://github.com/noctalia-dev/noctalia/blob/d1c0374f73ea687ae33b30fe6c4257dc0995d4f3/README.md>](https://github.com/noctalia-dev/noctalia-shell/blob/d1c0374f73ea687ae33b30fe6c4257dc0995d4f3/README.md)

[^2]: <https://docs.noctalia.dev/noctalia/getting-started/nixos/>

[^3]: [Noctalia Architecture — Volatile NixOS Configuration](https://wiki.infernalcode.com/desktop/noctalia/)
