<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fortran -->

The Fortran front-end for gcc can be enabled by adding `pkgs.gfortran` to .

If both `gcc` and `gfortran` are included, the build may fail with an error of the form: `collision between gfortran-wrapper/bin/gcc and gcc-wrapper/bin/gcc`.

An example <a href="Flakes" class="wikilink" title="nix flake">nix flake</a>:

``` nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        gfortran
      ];
    };
  };
}
```

Run `nix develop` to enter the nix shell, then compile with `gfortran myfile.f`.

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
