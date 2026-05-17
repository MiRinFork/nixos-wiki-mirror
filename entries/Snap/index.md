<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Snap -->

[Snap](https://github.com/canonical/snapd) is a packaging system by Canonical that simplifies software distribution and updates across Linux distributions. It ensures secure, containerized environments for consistent application performance.

## Setup

Snap support is not yet included in nixpkgs upstream but can be added as a Flake module. Adapt your system `flake.nix` like this:

``` nix
{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nix-snapd.url = "github:nix-community/nix-snapd";
    nix-snapd.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { nixpkgs, nix-snapd }: {
    nixosConfigurations.my-hostname = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        nix-snapd.nixosModules.default
        {
          services.snap.enable = true;
        }
      ];
    };
  };
}
```

## Usage

Install a Snap package

``` sh
snap install --devmode --beta dekko2
```

List Snap packages

``` sh
snap list
```

Run Snap package

``` sh
DISABLE_WAYLAND=1 QT_QPA_PLATFORM=xcb snap run dekko2.dekko
```

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
