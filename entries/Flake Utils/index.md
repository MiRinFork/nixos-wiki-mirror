<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flake Utils -->

[flake-utils](https://github.com/numtide/flake-utils) is a collection of pure Nix functions that don't depend on <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, and that are useful in the context of writing other <a href="Flakes" class="wikilink" title="Nix Flakes">Nix Flakes</a>.

# Defining a flake for multiple architectures

Flakes force you specify a program for each supported architecture. You may want to provide an architecture and nixpkgs-independent overlay, allowing for instance the users of the flake to install the program in their system while using their own version of nixpkgs (anything inside `packages` will always pin all libraries to a fixed version, unless you use `yourflake.inputs.nixpkgs.follows = "nixpkgs";`). To avoid re-defining the program multiple times (once in the overlay, once for each architecture etc), you can instead write your flake as follows:

``` nix
{
  description = "My flake description";

  # To generate a derivation per architecture
  inputs.flake-utils.url = "github:numtide/flake-utils";
  
  outputs = { self, nixpkgs, flake-utils }: {
    # We define first an overlay, i.e. a definition of new packages as recommended in
    # https://discourse.nixos.org/t/how-to-consume-a-eachdefaultsystem-flake-overlay/19420/9
    overlays.default = final: prev: {
      yourprogram = final.callPackage ({stdenv, pkgs, ...}:
        # You can put here the derivation to build your program, for instance:
        stdenv.mkDerivation {
          src = ./.;
          pname = "yourprogram";
          version = "unstable";
          buildInputs = with pkgs; [
            # libraries needed by your program
            # ...
          ];
          # Write here additional phases, e.g. buildPhase, installPhase etc.
          # ...
        }
      ) {};
    };
  } // # We now add the package defined in the above overlay for all architectures
  (flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        system = system;
        overlays = [ self.overlays.default ];
      };
      lib = nixpkgs.lib;
    in
      {
        # Create a new package
        packages = {
          yourprogram = pkgs.yourprogram;
          default = self.packages.${system}.yourprogram; # default program: this way, typing "nix develop" will directly put you in a shell needed to develop the above your program, running "nix build/run" will directly build/run this program etc.
        };
      }
  ))
  ;
}
```

## See also

- [1000 Instances of flake-utils, Nixcademy](https://nixcademy.com/posts/1000-instances-of-flake-utils/)

<a href="Category:Flakes" class="wikilink" title="Category:Flakes">Category:Flakes</a>
