<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenSCAD -->

OpenSCAD is a software for creating solid 3D CAD objects.

## OpenSCAD development environments with Nix

It is possible to create development envrionemtns with pinned version of OpenSCAD and the libraries you may want to use in your models. There are a number of different ways to do it, but the important part is to recognize that the OpenSCAD package exposes a `.withPackages` function which works analogously to the one exposed by the Python package.

In simple terms, to make <library> available to our OpenSCAD installation, we declare the package as `(pkgs.openscad.withPackages (ps: [ ps.`<library>`]))`.

See some examples of it being used.

### Via `flake.nix` (recommended)

``` nix
{
  description = "A very basic OpenSCAD devshell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          # We pass a callable which returns a list of packages
          (openscad.withPackages (ps: [
            ps.bosl2
          ]))
        ];
      };
    };
}
```

### Via `shell.nix`

``` nix
let
  # We pin to a specific nixpkgs commit for reproducibility.
  # Last updated: 2026-09-06. Check for new commits at https://status.nixos.org.
  pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/17de0b976395537756f30a3e78f2f06e5cec89ed.tar.gz") {};
in
pkgs.mkShell {
  buildInputs = [
    (pkgs.openscad.withPackages (ps: [ ps.bosl2 ]))
  ];
}
```

## Namespace conflicting libraries

Some libraries like [dotSCAD](https://github.com/JustinSDK/dotSCAD) or [threads.scad](https://github.com/rcolyer/threads-scad) are designed to be installed in the root of the path where OpenSCAD searches for files. That is, they are meant to be called as `use threads.scad`. This introduces namespace conflict problems, so libraries like this are packaged in a way such that you must call them as `use dotSCAD/example.scad` or similar, which may differ from what upstream documentation will look like.

In general terms, the root of each installed library is determined by the `libName` attribute of its package which we as maintainers try and make the best effort to set to a logical name (usually the name of the project's repository). This may not be always the case, so in order to know the value of that attribute for a given library, you may run this command:

``` bash
nix eval --expr '(import <nixpkgs> {}).openscadPackages.bosl2.libName' --raw --impure
```

or with the legacy cli:

``` bash
nix-instantiate --eval --expr '(import <nixpkgs> {}).openscadPackages.bosl2.libName'
```

Or if none of that works, you can always check the package's source code.
