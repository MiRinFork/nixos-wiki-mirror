<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Slack -->

[Slack](https://slack.com/) is a communication platform with a desktop application based on Electron.

## Installation

### NixOS

``` nix
environment.systemPackages = with pkgs; [ slack ];
```

## Tips

### Wayland

You can enable native Wayland support by launching Slack as:

``` console
$ NIXOS_OZONE_WL=1 slack
```

... or by simply specifying this option globally:

``` nix
environment.sessionVariables.NIXOS_OZONE_WL = "1";
```

If you want to use screen-sharing, you'll have to enable `xdg-desktop-portal`, too:

``` nix
xdg = {
  portal = {
    enable = true;
    extraPortals = with pkgs; [
      xdg-desktop-portal-wlr
      xdg-desktop-portal-gtk
    ];
  };
};
```

#### Window decorations

If the above configuration leaves you without window decorations you may want to enable this feature as well:

``` console
WaylandWindowDecorations
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
