<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/TUXEDO -->

TUXEDO Computers is a German company that specializes in assembling devices specifically designed to work out-of-the-box with Linux OSes.

When configured with their flagship distro, TUXEDO devices offer particular integrations with the Linux kernel, allowing fan management, CPU underclocking, power profile selection and the tweaking of other hardware-related settings via the preinstalled Tuxedo Control Center and Kernel modules.

In case you installed NixOS on a TUXEDO computer, however, you will have to specifically configure your system in order to gain access to those functionalities.

## Tuxedo Control Center

The Tuxedo Control Center is an open source utility developed by TUXEDO Computers to provide a GUI interface for managing thermal and power settings on TUXEDO laptops.

<figure>
<img src="TCC_Dashboard.png" title="TCC_Dashboard.png" />
<figcaption>TCC_Dashboard.png</figcaption>
</figure>

As of today, the Tuxedo Control Center is unfortunately not available in Nixpkgs, making it impossible to install it right away.

Thanks to [a project](https://github.com/blitz/tuxedo-nixos/#readme) maintained by blitz (Julian Stecklina), however, you can set up the TCC on NixOS just by importing an external module hosted on GitHub.

Doing this operation is quite straightforward, whether your system is configured to use <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> or not.

### Installation with Flakes

At the time of writing, the Flake interface is still experimental, but is stable enough to use it to import and enable this module in your system configuration.

Here you can find what you should add to your

    flake.nix

to install the TCC:

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
    tuxedo-nixos = {
      url = "github:blitz/tuxedo-nixos";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, tuxedo-nixos }: {
    nixosConfigurations = {
      your-system = nixpkgs.lib.nixosSystem {
        modules = [
          ./configuration.nix
          tuxedo-nixos.nixosModules.default
          { hardware.tuxedo-control-center.enable = true; }
        ];
      };
    };
  };
}
```

### Installation without Flakes

In case you prefer to avoid enabling and using Flakes, the Tuxedo Control Center can be installed in the old and stable way:

``` nix
{ config, pkgs, ... }:
let
  tuxedo = import (builtins.fetchTarball "https://github.com/blitz/tuxedo-nixos/archive/master.tar.gz");
in {
  imports = [
    tuxedo.module
  ];
  hardware.tuxedo-control-center.enable = true;
}
```

### Troubleshooting on Nixpkgs \> 22.11

As noted in an issue on the project's GitHub page[^1], blitz's TCC distribution is tested exclusively against Nixpkgs 22.11; as such, there might be errors when building it after overriding its Nixpkgs version to a newer one.

To avoid such problems, it can be useful to delete the

``` nix
inputs.nixpkgs.follows = "nixpkgs";
```

line in the example above and to specify

``` nix
hardware.tuxedo-control-center.package = tuxedo-nixos.packages.x86_64-linux.default;
```

right after the enable instruction. Doing this, in fact, will build the TCC against the Nixpkgs version it is meant to.

## Tuxedo Keyboard

The keyboard installed on some TUXEDO Laptops has a variable color backlight that, once a specific Kernel module is inserted, can be controlled via the TCC (since version 3.2.0 of the module) or via some Kernel commandline parameters (up to version 3.1.4 of the module).

The tuxedo-keyboard module is currently present on Nixpkgs and can easily be enabled by adding the

``` nix
hardware.tuxedo-keyboard.enable = true;
```

option to your NixOS configuration. If you are on version 3.2.0 (or later) this one will be the only change that you'll need to do in the configuration, as the backlight control will then be available directly from "Tools" \> "Keyboard Backlight" in the Tuxedo Control Center (see above if you haven't installed it yet).

<figure>
<img src="TCC_KeyboardBacklightSettings.png" title="TCC_KeyboardBacklightSettings.png" />
<figcaption>TCC_KeyboardBacklightSettings.png</figcaption>
</figure>

If you installed tuxedo-keyboard 3.1.4 (or older), however, you'll have to add the

    tuxedo_keyboard

options to the Kernel commandline by using the

``` nix
boot.kernelParams;
```

config key as in the example below:

``` nix
{ pkgs, ... }:
{
  hardware.tuxedo-keyboard.enable = true;
  boot.kernelParams = [
    "tuxedo_keyboard.mode=0"
    "tuxedo_keyboard.brightness=25"
    "tuxedo_keyboard.color_left=0x0000ff"
  ];
}
```

More options can be found in the \[<https://github.com/tuxedocomputers/tuxedo-keyboard/blob/v3.1.4/README.md#kernel-parameter-> official

    tuxedo_keyboard

docs.\]

## References

<references />

[^1]: **Build broken on nixos-unstable \#5**, Nov 13, 2022 - <https://github.com/blitz/tuxedo-nixos/issues/5>
