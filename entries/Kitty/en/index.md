<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kitty/en -->

<languages/> **Kitty** is a modern, fast, GPU-based terminal emulator written in Python and C. It leverages graphics hardware for high performance and offers features like tabs, layouts, and GPU-based rendering. Kitty is available in the NixOS ecosystem and can be configured through various methods.[^1]

## Installation

#### Shell

To temporarily use Kitty in a shell environment, you can run:

``` bash
nix-shell -p kitty
```

This will provide a shell with Kitty available without adding it to your system configuration.

#### System setup

To install Kitty, add it to either the system-wide `environment.systemPackages` in `/etc/nixos/configuration.nix` or to the user-specific `home.packages` in `~/.config/nixpkgs/home.nix`.[^2]

``` nix
# System-wide installation (in /etc/nixos/configuration.nix)
environment.systemPackages = with pkgs; [
  kitty
];

# User-specific installation (in ~/.config/nixpkgs/home.nix)
home.packages = with pkgs; [
  kitty
];
```

Then, rebuild your system or apply your Home Manager configuration:

``` bash
# For system-wide installation
sudo nixos-rebuild switch

# For Home Manager
home-manager switch
```

## Configuration

#### Basic

NixOS does not include a native module for Kitty. For basic Kitty configuration on NixOS, you need to manually follow the steps from Kitty's documentation.[^3]

If you're using Home Manager, you can enable Kitty with a simple configuration:

``` nix
programs.kitty.enable = true;
```

#### Advanced

For more advanced Home Manager configuration, you can specify various Kitty settings:

``` nix
programs.kitty = lib.mkForce {
  enable = true;
  settings = {
    confirm_os_window_close = 0;
    dynamic_background_opacity = true;
    enable_audio_bell = false;
    mouse_hide_wait = "-1.0";
    window_padding_width = 10;
    background_opacity = "0.5";
    background_blur = 5;
    symbol_map = let
      mappings = [
        "U+23FB-U+23FE"
        "U+2B58"
        "U+E200-U+E2A9"
        "U+E0A0-U+E0A3"
        "U+E0B0-U+E0BF"
        "U+E0C0-U+E0C8"
        "U+E0CC-U+E0CF"
        "U+E0D0-U+E0D2"
        "U+E0D4"
        "U+E700-U+E7C5"
        "U+F000-U+F2E0"
        "U+2665"
        "U+26A1"
        "U+F400-U+F4A8"
        "U+F67C"
        "U+E000-U+E00A"
        "U+F300-U+F313"
        "U+E5FA-U+E62B"
      ];
    in
      (builtins.concatStringsSep "," mappings) + " Symbols Nerd Font";
  };
};
```

## Tips and tricks

### Theming with Stylix

You can use <a href="Stylix" class="wikilink" title="Stylix">Stylix</a>[^4] to theme Kitty by enabling its built-in integration:[^5]

``` nix
stylix.targets.kitty.enable = true;
```

## Troubleshooting

## References

<references/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Terminal" class="wikilink" title="Category:Terminal">Category:Terminal</a>

[^1]: <https://sw.kovidgoyal.net/kitty/>

[^2]: <https://nixos.org/manual/nixos/stable/>

[^3]: <https://sw.kovidgoyal.net/kitty/conf/>

[^4]: <https://github.com/nix-community/stylix>

[^5]: <https://nix-community.github.io/stylix/options/modules/kitty.html#stylixtargetskittyenable>
