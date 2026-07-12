<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kitty/zh-cn -->

<languages/> Kitty 是一款基于 GPU 的现代高性能终端模拟器，使用 Python 和 C 编写。它借助图形硬件实现高性能，并提供标签页、布局和基于 GPU 的渲染等特性。Kitty 在 NixOS 生态中可用，并可通过多种方式进行配置。

## Installation

#### Shell

要在 shell 环境中临时使用 Kitty，可以执行：

``` bash
nix-shell -p kitty
```

这将提供一个可用 Kitty 的 shell，而无需将其添加到系统配置中。

#### System setup

要安装 Kitty，可将其添加到系统级的 `/etc/nixos/configuration.nix` 中的 `environment.systemPackages`，或添加到用户级的 `~/.config/nixpkgs/home.nix` 中的 `home.packages`。[^1]

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

然后，重建系统或应用 Home Manager 配置：

``` bash
# For system-wide installation
sudo nixos-rebuild switch

# For Home Manager
home-manager switch
```

## Configuration

#### Basic

NixOS 并未为 Kitty 提供原生模块。要在 NixOS 上进行基本的 Kitty 配置，您需要手动参照 Kitty 文档中的步骤进行。

如果您正在使用 Home Manager，可以通过一个简单的配置启用 Kitty：

``` nix
programs.kitty.enable = true;
```

#### Advanced

对于更高级的 Home Manager 配置，您可以指定各种 Kitty 设置：

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

<span id="Theming_with_Stylix"></span>

### 使用 Stylix 进行主题化

您可以使用 Stylix 通过启用其内置集成来为 Kitty 设置主题：

``` nix
stylix.targets.kitty.enable = true;
```

## Troubleshooting

## References

<references/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Terminal" class="wikilink" title="Category:Terminal">Category:Terminal</a>

[^1]: <https://nixos.org/manual/nixos/stable/>
