<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ninjabrain-bot -->

[**Ninjabrain Bot**](https://github.com/Ninjabrain1/Ninjabrain-Bot) is a stronghold calculator for Minecraft speedrunning.

## Installation

Ninjabrain Bot is available in <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> as .

### NixOS

Add it to :

``` nix
{
  environment.systemPackages = with pkgs; [
    ninjabrain-bot
  ];
}
```

### Home Manager

<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> can install Ninjabrain Bot and manage its preferences declaratively:

``` nix
{
  programs.ninjabrain-bot = {
    enable = true;
    package = pkgs.ninjabrain-bot;

    settings = {
      language = "en-US";
      windowSize = "small";
      showNetherCoordinates = true;
      theme = 1;
    };
  };
}
```

The preferences file is managed at . Changes made through the application's settings window will be replaced on the next Home Manager activation.

See the [Home Manager option reference](https://nix-community.github.io/home-manager/options.xhtml) for all available options.

## Hyprland

Ninjabrain Bot is a Java XWayland application. When tiled, Hyprland can give it a large window while the application only draws its interface in part of it, leaving an empty black area.

Float the main window instead. Do not set a fixed size, as Ninjabrain Bot manages its own window size.

### Hyprland 0.55 and later

Add this to :

``` lua
hl.window_rule({
  name = "ninjabrain-bot",
  match = {
    class = "^ninjabrainbot-Main$",
  },
  float = true,
  center = true,
})
```

### Older Hyprland configurations

Add these rules to :

``` ini
windowrule = float, match:class ^ninjabrainbot-Main$
windowrule = center, match:class ^ninjabrainbot-Main$
```

The window class is case-sensitive and uses a hyphen: .

## See also

- [Ninjabrain Bot](https://github.com/Ninjabrain1/Ninjabrain-Bot)
- [Upstream documentation](https://github.com/Ninjabrain1/Ninjabrain-Bot/wiki)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
