<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wayland -->

[Wayland](https://wayland.freedesktop.org/) is a modern display server protocol intended as a replacement for the legacy <a href="Xorg" class="wikilink" title=" X11"> X11</a> system.

For additional details, see .

## Checking for Wayland

To check if you are using Wayland, run the following command

``` console
$ echo $XDG_SESSION_TYPE
```

If is returned, you are running Wayland

## Setup

Two things are required for running Wayland: a compatible Display Manager, and a compatible Compositor.

## Display Managers

Display Managers are responsible for handling user login.

The following Display Managers support using both X and Wayland protocols

#### Graphical

- [gdm](https://github.com/NixOS/nixpkgs/blob/592047fc9e4f7b74a4dc85d1b9f5243dfe4899e3/nixos/modules/services/x11/display-managers/gdm.nix) is the <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> Display Manager.
- [sddm](https://github.com/NixOS/nixpkgs/blob/592047fc9e4f7b74a4dc85d1b9f5243dfe4899e3/nixos/modules/services/x11/display-managers/sddm.nix) is the default Display Manager for <a href="KDE" class="wikilink" title="KDE">KDE</a>. Wayland support is currently experimental.

#### Text-based

- [ly](https://github.com/NixOS/nixpkgs/blob/592047fc9e4f7b74a4dc85d1b9f5243dfe4899e3/pkgs/applications/display-managers/ly/default.nix)
- [emptty](https://github.com/NixOS/nixpkgs/blob/592047fc9e4f7b74a4dc85d1b9f5243dfe4899e3/pkgs/applications/display-managers/emptty/default.nix)
- [lemurs](https://github.com/NixOS/nixpkgs/blob/592047fc9e4f7b74a4dc85d1b9f5243dfe4899e3/pkgs/applications/display-managers/lemurs/default.nix)

## Compositors

For the purposes of this basic overview, a compositor can be thought of as equivalent to an X Desktop Environment.

### Wayland Native

- <a href="Sway" class="wikilink" title="Sway">Sway</a> is a i3-like compositor.
- <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> the dynamic tiling Wayland compositor that doesn't sacrifice on its looks.
- <a href="Niri" class="wikilink" title="Niri">Niri</a> is a scrollable tiling compositor

### X and Wayland support

- [Mutter](https://github.com/NixOS/nixpkgs/blob/nixos-23.11/pkgs/desktops/gnome/core/mutter/default.nix) is the default compositor for <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> Desktop Environment.
- [KWin](https://github.com/NixOS/nixpkgs/blob/nixos-23.11/pkgs/desktops/plasma-5/kwin/default.nix) is the default compositor for <a href="KDE" class="wikilink" title="KDE">KDE</a> Desktop Environment.

## Applications

Not all apps support running natively on Wayland. To work around this, Xwayland should be enabled.

### Electron and Chromium

Ozone Wayland (which uses Wayland native instead of Xwayland) support in <a href="Chromium" class="wikilink" title="Chromium">Chromium</a> and <a href="Electron" class="wikilink" title="Electron">Electron</a> based applications can be enabled by setting the environment variable "`NIXOS_OZONE_WL`" with `NIXOS_OZONE_WL=1` *(also see [commit](https://github.com/NixOS/nixpkgs/commit/b2eb5f62a7fd94ab58acafec9f64e54f97c508a6))*

As of NixOS 25.05 ("Warbler"), if `XDG_SESSION_TYPE` is unset or set to "wayland", [chromium and electron apps will default to wayland native](https://issues.chromium.org/issues/40083534#comment599). This ignores the `DISPLAY` environment variable.

#### Declaratively (permanent)

##### NixOS

#### Imperatively (each time an application is launched)

Example: to launch `code` *()*

``` console
$ NIXOS_OZONE_WL=1 code
```

## Virtualization

To have wayland work inside of <a href="QEMU" class="wikilink" title="QEMU">QEMU</a>, you may need to pass `-vga qxl`.

## See also

- <a href="Xorg" class="wikilink" title="Xorg">Xorg</a>

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
