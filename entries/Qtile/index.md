<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Qtile -->

[Qtile](https://qtile.org/) is a full-featured, hackable tiling window manager written and configured in Python. It's available both as an X11 window manager and also as [a Wayland compositor](https://docs.qtile.org/en/stable/manual/wayland.html#wayland).

## Setup

To enable Qtile as your window manager, set `services.xserver.windowManager.qtile.enable = true`. For example:

``` nix
{
  services.xserver.windowManager.qtile.enable = true;
}
```

Other options for Qtile can be declared within the `services.xserver.windowManager.qtile` attribute set.

### Config File

The configuration file can be changed from its default location `$XDG_CONFIG/qtile/config.py` by setting the `configFile` attribute:

``` nix
services.xserver.windowManager.qtile = {
  enable = true;
  configFile = ./my_qtile_config.py;
};
```

#### Home manager

If you are using home-manager, you can copy your qtile configuration by using the following:

``` nix
xdg.configFile."qtile/config.py".source = ./my_qtile_config.py;
```

or, if you have a directory containing multiple python files:

``` nix
xdg.configFile."qtile" = {
  source = ./src;
  recursive = true;
};
```

### Extra Packages

You may add extra packages in the Qtile python environment by putting them in the `extraPackages` list. For example:

``` nix
services.xserver.windowManager.qtile = {
  enable = true;
  extraPackages = python3Packages: with python3Packages; [
    qtile-extras
    qtile-bonsai
  ];
};
```

## Wayland

### Screen sharing & desktop portals

Screen sharing is supported with xdg desktop portals.

You need to have the following dependencies installed:

- `xdg-desktop-portal` (NEEDED)
- `xdg-desktop-portal-wlr` (NEEDED), the wlroots "portal"
- `xdg-desktop-portal-gtk` (RECOMMENDED) for proper GTK popup support

It's recommended to acquire them as shown:

``` nix
xdg.portal = {
  enable = true;
  config.common.default = "*";
  extraPortals = with pkgs; [
    xdg-desktop-portal-wlr
    xdg-desktop-portal-gtk
  ];
};
```

### Making apps use Wayland

Qtile has support for running X11 applications through XWayland. Whilst XWayland works, it is often not an optimal experience. Due to this we recommend to set some environment variables such that some applications use Wayland rather than X11.

Environment variables:

``` nix
environment.sessionVariables = {
  WLR_NO_HARDWARE_CURSORS = 1;
  NIXOS_OZONE_WL = 1;
  MOZ_ENABLE_WAYLAND = 1;
  GDK_BACKEND = "wayland,x11";
  ELECTRON_OZONE_PLATFORM_HINT = "auto";
  SDL_VIDEODRIVER = "wayland,x11";
};
```

## Flakes

Qtile provides a Nix flake in its repository. This can be useful for:

- Running a bleeding-edge version of Qtile by specifying the flake input as the package.
- Hacking on Qtile using a Nix develop shell.

To run a bleeding-edge version of Qtile with the flake, add the Qtile repository to your flake inputs and define the package. For example:

``` nix
{
  description = "A very basic flake";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    qtile-flake = {
      url = "github:qtile/qtile";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      qtile-flake,
    }:
    {
      nixosConfigurations.demo = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";

        modules = [
          (
            {
              config,
              pkgs,
              lib,
              ...
            }:
            {
              services.xserver = {
                enable = true;
                windowManager.qtile = {
                  enable = true;
                  package = qtile-flake.packages.${pkgs.system}.default;
                };
              };

              # make qtile X11 the default session
              services.displayManager.defaultSession = lib.mkForce "qtile";

              # rest of your NixOS config
            }
          )
        ];
      };
    };
}
```

This flake can also be tested with a vm:

``` nix
sudo nixos-rebuild build-vm --flake .#demo
```

Gives you a script to run that runs Qemu to test your config. For this to work you have to set a user with a password.

## Credits

- Based on the official [Qtile Documentation](https://docs.qtile.org/en/latest/manual/install/nixos.html#).
- Wayland details from [Gist by Jwijenbergh](https://gist.github.com/jwijenbergh/48da1a8f4c4a56d122407c4d009bc81f)
- NixOS implementation details maintained by the community.

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
