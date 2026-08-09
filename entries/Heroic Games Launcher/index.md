<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Heroic Games Launcher -->

[Heroic Games Launcher](https://heroicgameslauncher.com/) is an open-source launcher for GOG, Epic Games Store, and Amazon Prime Games, for Linux, Windows, and macOS. On NixOS, it fills a similar role to <a href="Lutris" class="wikilink" title="Lutris">Lutris</a> for running native and Windows games, and is also wrapped in a <a href="FHS_environment" class="wikilink" title="FHS environment">FHS environment</a>.

## Platform Support

Heroic in nixpkgs is only supported on `x86_64-linux`. Upstream does not support 32-bit Linux. If you are on macOS, you should use the official builds from upstream, unless you are willing to take on maintaining the Heroic package in nixpkgs for <a href="Nix-darwin" class="wikilink" title="nix-darwin">nix-darwin</a>. If you are using just Nix on any non-NixOS Linux distribution, you should use the official builds from upstream.

## Optional Dependencies

Heroic has some optional dependencies, such as [Gamescope](https://github.com/ValveSoftware/gamescope) and <a href="GameMode" class="wikilink" title="GameMode,">GameMode,</a> that are not included in the FHS environment wrapper. If you want to use any of these, you need to override the Heroic derivation to pass extra packages.

``` nix
(heroic.override {
  extraPkgs = pkgs': with pkgs'; [
    gamescope
    gamemode
  ];
})
```

For Gamescope and GameMode, you also need to enable these in your NixOS configuration.

``` nixos
programs.gamescope.enable = true;
programs.gamemode.enable = true;
```

See <a href="GameMode" class="wikilink" title="GameMode">GameMode</a> for additional setup information.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
