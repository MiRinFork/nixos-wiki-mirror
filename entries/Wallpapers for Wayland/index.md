<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wallpapers for Wayland -->

<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> offers several different ways to set wallpaper in Wayland.

## Declarative Wallpapers

can be used to declaratively set wallpapers. In this example, a wallpaper in [nixos-artwork](https://github.com/NixOS/nixos-artwork/tree/master/wallpapers) is used.

Use to get the hash:

``` console
$ nix hash convert --hash-algo sha256 $(nix-prefetch-url https://raw.githubusercontent.com/NixOS/nixos-artwork/8957e93c95867faafec7f9988cedddd6837859fa/wallpapers/nix-wallpaper-binary-black.png)
sha256-mhSh0wz2ntH/kri3PF5ZrFykjjdQLhmlIlDDGFQIYWw=
```

## Configuration

### wpaperd

[wpaperd](https://github.com/danyspin97/wpaperd) is a modern wallpaper daemon for Wayland. It has <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> integration and can be configured as follows:

See <https://github.com/danyspin97/wpaperd#wallpaper-configuration> for the full list of options.
