<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RISC-V/GHC -->

## Current status

We can cross-compile ([\#305392](https://github.com/NixOS/nixpkgs/pull/305392)) but we are missing bootstrap tarballs for native builds.

`cannot bootstrap GHC on this platform ('riscv64-linux' with libc 'defaultLibc')`

- [RISC-V Label](https://gitlab.haskell.org/ghc/ghc/-/issues/?label_name%5B%5D=RISC-V)
- [Main issue](https://gitlab.haskell.org/ghc/ghc/-/issues/16783) ✅
- [NCG](https://gitlab.haskell.org/ghc/ghc/-/issues/23179) ✅
- [LLVM backend](https://gitlab.haskell.org/ghc/ghc/-/commit/31e265c1df948d1bcc82d08affe995fd1d1c1438) ✅
- **[Binary tarballs](https://gitlab.haskell.org/ghc/ghc/-/issues/23519)**

Some popular affected packages are:

- nix-tree
- nixfmt
- hledger
- hledger-ui
- hledger-web
- exa
- pandoc
- nix-output-monitor
- xmonad

## Booting GHC via cross-compilation

On a platform where Nixpkgs supports compiling GHC (e.g. `x86_64-linux`):

``` sh
nix copy --to ssh://root@$riscv_host --no-check-sigs \
  'github:alexandretunstall/nixpkgs/ghc-cross-usable#pkgsCross.riscv64.haskell.compiler.integer-simple.ghc8107'
```

(You don’t need to SSH as root if you copy it via a trusted user.)

Then you’ll want to pin the copied path so that the GC never deletes it. On the RISC-V host:

``` sh
nix-store --realise --indirect --add-root $root_path $cross_ghc_path
```

Finally, create the GHC configuration on the RISC-V host so that native builds use the cross-compiled GHC.

The configuration below assumes that there is a symbolic link to the previously built GHC at `../boot/ghc-8.10.7`.

The configuration should work with any modern version of Nixpkgs.

``` nix
{ config, lib, pkgs, ... }:

let
  mkBootCompiler = { version, outPath, llvmPackages }: let
    passthru = {
      targetPrefix = "";
      enableShared = false;
      hasHaddock = false;
      hasThreadedRuntime = false;

      inherit llvmPackages;

      haskellCompilerName = "ghc-${version}";
    };
  in passthru // {
    inherit version outPath passthru;

    meta = {
      license = lib.licenses.bsd3;
      platforms = [ "riscv64-linux" ];
    };
  };

  mkBootPackages = { base, ghc }: let
    buildHaskellPackages = base.override (old: {
      inherit buildHaskellPackages ghc;

      overrides = bootOverrides;
    });
  in buildHaskellPackages;

  hsLib = pkgs.haskell.lib.compose;

  # Overrides that are needed to boot a native GHC
  bootOverrides = self: super: {
    mkDerivation = args: super.mkDerivation ({
      enableLibraryProfiling = false;
    } // args);

    alex = hsLib.dontCheck super.alex;
    data-array-byte = hsLib.dontCheck super.data-array-byte;
    doctest = hsLib.dontCheck super.doctest;
    hashable = hsLib.dontCheck super.hashable;
    optparse-applicative = hsLib.dontCheck super.optparse-applicative;
    QuickCheck = hsLib.dontCheck super.QuickCheck;
    temporary = hsLib.dontCheck super.temporary;
    vector = hsLib.dontCheck super.vector;
  };

  # If a package fails to build, try disabling checks here.
  # Since RISC-V has to use an unregisterised GHC, many test suites fail.
  unregOverrides = self: super: {
    # Example: lens fails without this override
    lens = hsLib.dontCheck super.lens;
  };

in {
  nixpkgs.overlays = [
    (self: super: {
      # If you need to change the default GHC, uncomment these lines.
      # Using the Nixpkgs default is better as it can build more packages than
      # other versions of GHC.
      #ghc = self.haskell.compiler.ghc94;
      #haskellPackages = self.haskell.packages.ghc94;

      haskell = super.haskell // {
        compiler = {
          ghc8107Boot = mkBootCompiler {
            version = "8.10.7";
            outPath = builtins.storePath ../boot/ghc-8.10.7;
            llvmPackages = pkgs.llvmPackages_12;
          };

          ghc928 = (super.haskell.compiler.ghc928.override (old: {
            bootPkgs = self.pkgsBuildBuild.haskell.packages.ghc8107Boot;
          })).overrideAttrs ({ configureFlags ? [], ... }: {
            # Registerised RV64 produces programs that segfault
            configureFlags = configureFlags ++ [ "--enable-unregisterised" ];
          });
          
          ghc92 = self.haskell.compiler.ghc928;
          
          ghc964 = (super.haskell.compiler.ghc964.override (old: {
            bootPkgs = self.pkgsBuildBuild.haskell.packages.ghc928;
          }).overrideAttrs ({ configureFlags ? [], ... }: {
            configureFlags = configureFlags ++ [ "--enable-unregisterised" ];
          });
          
          ghc96 = self.haskell.compiler.ghc964;
        };

        packages = {
          ghc928 = super.haskell.packages.ghc928.override (old: {
            overrides = unregOverrides;
          });
          
          ghc92 = self.haskell.packages.ghc928;
          
          ghc964 = super.haskell.packages.ghc964.override (old: {
            overrides = unregOverrides;
          });
          
          ghc96 = self.haskell.packages.ghc96;

          ghc8107Boot = mkBootPackages {
            base = super.haskell.packages.ghc8107;
            ghc = self.pkgsBuildHost.haskell.compiler.ghc8107Boot;
          };
        };
      };
    })
  ];
}
```

For newer GHCs, refer to the GHC documentation or the Nixpkgs source to find which version of GHC and LLVM is needed for compilation.

GHC \>=9.2 is unable to boot 9.2 and 9.4. GHC \>=9.6 cannot be cross-compiled at all due to issues with Hadrian. Newer GHCs can be booted using natively compiled versions of GHC instead.

See <https://github.com/AlexandreTunstall/nixos-riscv> for an example of a pure flake that uses this trick to compile Haskell programs for RISC-V.

## See also

- [Nixpkgs PR 243619 (fix cross-built native GHC)](https://github.com/NixOS/nixpkgs/pull/243619)
- [Nixpkgs PR 305392 (fix cross-built native GHC, version 2)](https://github.com/NixOS/nixpkgs/pull/305392)

<a href="Category:Haskell" class="wikilink" title="Category:Haskell">Category:Haskell</a>
