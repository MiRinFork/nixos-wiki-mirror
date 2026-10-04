<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kdenlive -->

## Fix for crash while running under GNOME

As of NixOS 26.05, there is an issue with Kdenlive (version 26.04 as of time of writing) while running under GNOME, where Kdenlive will crash whenever a filepicker dialog is supposed to be opened along the lines of "<bdi>Settings schema 'org.gtk.Settings.FileChooser' is not installed</bdi>."

[This has been reported on Github](https://github.com/NixOS/nixpkgs/issues/469503), with no fix at time of writing this article. However, you can work around this crash by using a nixpkgs overlay.

To work around this issue, add/append the following to you Nix/NixOS configuration file accordingly:

``` nixos
# kdenlive-fix.nix
{ pkgs, ... }:

{
  # Fix for Kdenlive crash under GNOME
  # https://github.com/NixOS/nixpkgs/issues/469503
  nixpkgs.overlays = [
    (final: prev: {
      kdePackages = prev.kdePackages.overrideScope (
        kfinal: kprev: {
          kdenlive = prev.symlinkJoin {
            inherit (kprev.kdenlive)
              pname
              version
              meta
              passthru
              ;
            name = "kdenlive-crashfix";
            paths = [ kprev.kdenlive ];
            nativeBuildInputs = [ prev.makeWrapper ];
            postBuild = ''
              wrapProgram $out/bin/kdenlive \
                --prefix XDG_DATA_DIRS : "${prev.gtk3}/share/gsettings-schemas/${prev.gtk3.name}"
            '';
          };
        }
      );
    })
  ];
}
```
