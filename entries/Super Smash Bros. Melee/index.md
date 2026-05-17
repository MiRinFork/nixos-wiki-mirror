<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Super Smash Bros. Melee -->

<a href="wikipedia:Super_Smash_Bros._Melee" class="wikilink" title="Super Smash Bros. Melee">Super Smash Bros. Melee</a> is a 2001 platform fighter game developed by HAL Laboratory and published by Nintendo.

## Slippi

You can use the [slippi-nix](https://github.com/lytedev/slippi-nix) flake to declaratively install and configure Slippi with Nix, or get the AppImage directly from [Slippi's website](https://slippi.gg/).

If you are using the AppImage, to run Slippi Online or Slippi Playback you will need `libcurl.so.4` to be in your <a href="Appimage#Run" class="wikilink" title="appimage-run">appimage-run</a> packages. This can be easily added through a package like `curlMinimal`.

``` nix
  programs.appimage.package = pkgs.appimage-run.override { extraPkgs = pkgs: [
    pkgs.curlMinimal.out
  ];};
```

## B0XX Emulation

[B0XX controller](https://b0xx.com/) emulation can be done via [keyb0xx](https://gitlab.com/liamjen/keyb0xx). A Nix package for keyb0xx can be found [here](https://codeberg.org/nyxmeowmeow/keyb0xx-nix).

<a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
