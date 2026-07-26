<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cursor Themes -->

To install the DMZ white cursor theme with add this to your <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> config:

`home.file.".icons/default".source = "${pkgs.vanilla-dmz}/share/icons/Vanilla-DMZ";`

For a more fine-grained configuration, check the option `xsession.pointerCursor`.

## Cursor Theme with Home Manager

Here's an example how you can get a cursor theme from a url and assign it to HM's pointerCursor:

``` nix
home.pointerCursor =
  let
    getFrom = url: hash: name: {
      gtk.enable = true;
      x11.enable = true;
      name = name;
      size = 48;
      package = pkgs.runCommand "moveUp" { } ''
        mkdir -p $out/share/icons
        ln -s ${
          pkgs.fetchzip {
            url = url;
            hash = hash;
          }
        } $out/share/icons/${name}
      '';
    };
  in
  getFrom "https://github.com/ful1e5/fuchsia-cursor/releases/download/v2.0.0/Fuchsia-Pop.tar.gz"
    "sha256-BvVE9qupMjw7JRqFUj1J0a4ys6kc9fOLBPx2bGaapTk="
    "Fuchsia-Pop";
```

## Troubleshooting

### Cursor themes in Gnome apps under Hyprland are different / not applied

Try giving the Gnome apps an extra kick with:

``` nix
wayland.windowManager.hyprland.settings = {
  exec-once = [
    # Fixes cursor themes in gnome apps under hyprland
    "gsettings set org.gnome.desktop.interface cursor-theme '${config.home.pointerCursor.name}'"
    "gsettings set org.gnome.desktop.interface cursor-size ${toString home.pointerCursor.size}"
  ];
};
```

### Cursor themes in flatpaks are different / not applied

#### Set `xdg-desktop-portal-gtk` as fallback

Most flatpaks need the functions implemented by `xdg-desktop-portal-gtk` and other desktop portals are not always implementing everything in `xdg-desktop-portal-gtk` themself. So its a good idea to set`xdg-desktop-portal-gtk` as a fallback.

This can be achieved in home-manager through `xdg.portals.config`:

``` nix
xdg.portal = {
  config = {
    # example with hyprland
    hyprland.preferred = [ "hyprland" "gtk" ];
  };
};
```

OR in home-manager through `xdg.portals.configPackages`:

``` nix
xdg.portal = {
  # example with hyprland
  configPackages = [ pkgs.hyprland ];
  # has a file with /nix/store/...-hyprland-.../share/xdg-desktop-portal/hyprland-portals.conf
  # 1 │ [preferred]
  # 2 │ default=hyprland;gtk
};
```

Keep in mind that with the home-manager module `wayland.windowManager.hyprland.enable` this is already done. See \[./Https://github.com/nix-community/home-manager/blob/22b418c13fb0be43f4bc5c185f323a3237028594/modules/services/window-managers/hyprland.nix#L298 github.com/nix-community/home-manager/blob/master/modules/services/window-managers/hyprland.nix\]

#### Make sure `xdg-desktop-portal-gtk` is running

For flatpaks you need to make sure the `xdg-desktop-portal-gtk` is running in userspace, which is not automatically always the case (espacially on tiling windowManagers). So in home-manager you can set:

``` nix
xdg.portal = {
  enable = true;
  extraPortals = [ pkgs.xdg-desktop-portal-gtk ]; # Fixes OpenURI and cursor themes in flatpaks
};
```

#### Giving flatpaks permission to *`/nix/store`*

This already fixes themes for most apps like gnome. But not all (e.g. Obsidian or Logseq).

And since flatpaks are sandboxed and dont have access to the nix-store you need to give them permission, since the cursors are eventually linked to *`/nix/store/...`*:

``` console
$ flatpak --user override --filesystem=/nix/store:ro
```

OR with the <https://github.com/gmodena/nix-flatpak> homeManagerModule:

``` nix
services.flatpak = {
  enable = true;

  overrides = {
    global = {
      Context.filesystems = [ "/nix/store:ro" ];
    };
  };
};
```

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
