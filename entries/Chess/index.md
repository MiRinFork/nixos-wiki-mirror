<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Chess -->

## Playing Chess on NixOS

### Engines

For most chess applications, if you want to play against the computer, you need to install one or more chess engines in addition. Some applications will automatically detect the engines (e.g GNOME Chess) others will need them configured via the user interface (application settings). Note that some engines are impossible to win against (e.g. gnuchess) while others will make your game a bit more fun.

``` nix
{ pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    gnuchess
    scid-vs-pc # Phalanx and Fruit
    stockfish
  ];
}
```

### GUI based

[ChessX](https://chessx.sourceforge.io/) is installable via `chessx`.

[Cute Chess](https://cutechess.com/) is installable via `cutechess`.

[GNOME Chess](https://gitlab.gnome.org/GNOME/gnome-chess) is installable via `gnome-chess`.

[Lucas Chess](https://lucaschess.pythonanywhere.com/) is not packaged for NixOS yet (see [nixpkgs#303420](https://github.com/NixOS/nixpkgs/issues/303420)).

[PyChess](https://pychess.github.io/), installable via `pychess`, is currently broken (see [nixpkgs#442080](https://github.com/NixOS/nixpkgs/issues/442080)).

### Graphics based

[DreamChess](https://www.dreamchess.org/) is installable via `dreamchess`.

### Terminal based

[Chess TUI](https://thomas-mauran.github.io/chess-tui/docs/Installation/NixOS) is installable via `chess-tui`. Use `-e` to select an [engine](https://thomas-mauran.github.io/chess-tui/docs/Configuration/engine) or use the [configuration file](https://thomas-mauran.github.io/chess-tui/docs/Configuration/configuration-intro).

[Gambit](https://github.com/maaslalani/gambit) is installable via `gambit-chess`.

[uchess](https://tmountain.github.io/uchess/) is installable via `uchess`. Works with UCI chess engines.
