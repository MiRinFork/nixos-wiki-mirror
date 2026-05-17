<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Haskell -->

[Haskell](https://www.haskell.org/) is a statically-typed, purely functional programming language with strong support for type inference and lazy evaluation.

For detailed information on Haskell support in Nixpkgs, refer to the official .

## How to develop with Haskell and Nix

### Scripting

For redistributable Haskell scripts on any Nix system, you can use a nix-shell shebang.

``` haskell
#!/usr/bin/env nix-shell
#!  nix-shell --pure -i runghc -p "ghc.withPackages (pkgs: [ pkgs.turtle ])"
{-# LANGUAGE OverloadedStrings #-}
import Turtle

main = do
  -- do stuff
  echo "Hello world from a distributable Haskell script!"
```

To remove the additional latency overhead of a nix-shell, add GHC to `environment.systemPackages` and call `runghc` in the shebang.

``` nix
  environment.systemPackages = with pkgs; [
    ...
    (ghc.withPackages (hsPkgs: with hsPkgs; [
      turtle      # Faster startup time with all external shell commands
      shh         # Piping operators and other goodies
      shh-extras  # Try shh as an interactive shell
      ...         # ...anything else you want!
    ])
  ]; 
```

Here's a basic example using the Shh module rather than Turtle, so it can use the pipe operator:

``` haskell
#!/usr/bin/env runghc
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE ExtendedDefaultRules #-}
{-# LANGUAGE OverloadedStrings #-}
import Shh

-- $(loadEnv SearchPath) -- Loads entire PATH, may be slow
load SearchPath [ "dd", "sha512sum" ]

main = do
  dd "if=/dev/urandom" "bs=4K" "count=1" |> sha512sum
```

To write inline Haskell scripts in nix-code, refer to <a href="Nix-writers#Haskell" class="wikilink" title="Nix-writers#Haskell">Nix-writers#Haskell</a>.

Read <a href="#Overrides" class="wikilink" title="#Overrides">#Overrides</a> if some packages are broken.

### Directly using cabal (no nix caching/reproducibility)

[Cabal](https://www.haskell.org/cabal/) is the basic Haskell tool used to configure builds and is internally used by all the Haskell's packaging methods (including stack and nix). If one does not care about the reproducibility/caching offered by nix, it is always possible to use cabal like in a normal system:

``` console
$  nix-shell -p "ghc.withPackages (pkgs: [ pkgs.cabal-install ])"
$ cabal init
…
$ cabal run
Up to date
Hello, Haskell!
```

### Using Stack (no nix caching)

Similarly you can use [Stack](https://docs.haskellstack.org/en/stable/) that let you find the appropriate version of the libraries for you if you do not want the caching offered by nix (stack will build all the dependencies):

``` console
$ nix-shell -p "ghc.withPackages (pkgs: [ pkgs.stack ])"
$ stack new my-project
$ cd my-project
$ stack build
$ stack exec my-project-exe
```

You can also use the features offered by stack to enable nix integration in order to use nix to install the non-haskell dependencies. You can read more [here](https://docs.haskellstack.org/en/stable/topics/nix_integration/).

If you want to package your program using stack in nix, you can actually use `haskell.lib.buildStackProject` that is a wrapper around `stdenv.mkDerivation` that will [call `stack build` for you](https://github.com/NixOS/nixpkgs/blob/350fd0044447ae8712392c6b212a18bdf2433e71/pkgs/development/haskell-modules/generic-stack-builder.nix#L56)… However because stack needs to download stuff you need to disable the sandbox using `nix-build --option sandbox false`. For instance if you want to compile a stack project that needs R, zeromq and zlib you can put the following into `default.nix`:

``` nix
with (import <nixpkgs> { });
haskell.lib.buildStackProject {
  name = "HaskellR";
  buildInputs = [ R zeromq zlib ];
}
```

### Using developPackage (use the nix packages set for haskell)

You can also use nix in place of stack to keep track of the dependencies in a reproducible way (note that while stack uses a solver to find a working set of dependencies, nix uses a fixed set of packages). Additionally you can benefit from the caching system offered by Nix. To that end, first create a cabal repository (nix also uses cabal internally):

``` console
$ nix-shell -p "ghc.withPackages (pkgs: [ pkgs.cabal-install ])" --run "cabal init"
… 
```

And create a file `default.nix` containing:

``` nix
let
  pkgs = import <nixpkgs> { }; # pin the channel to ensure reproducibility!
in
pkgs.haskellPackages.developPackage {
  root = ./.;
}
```

(You can find a list of options and documentation for `developPackage` in [pkgs/development/haskell-modules/make-package-set.nix](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/make-package-set.nix#L230), note that it is a wrapper around `callCabal2nixWithOptions` with some additional functions to setup a development shell.)

Then you can build and run the program using:

``` console
$ nix-build
$ ./result/bin/yourprogram 
```

or run a nix-shell to use the standard development tools provided by cabal:

``` console
$ nix-shell
$ cabal run
```

Nix will automatically read the `build-depends` field in the `*.cabal` file to get the name of the dependencies and use the haskell packages provided in the configured package set provided by nix. Note that some of the packages present in the nix repository are broken (for instance because a package requires an older version of a library while nix only provides a recent version). For this reason it may be necessary to override some packages present in the nix package set as described below using the `overrides` and `source-overrides` attribute. Note that the `source-overrides` attribute can also turn out to be useful to load local libraries:

``` nix
let
  pkgs = import <nixpkgs> { }; # pin the channel to ensure reproducibility!
in
pkgs.haskellPackages.developPackage {
  root = ./.;
  source-overrides = {
    mylibrary = ./mylibrary;
  };
}
```

However as I understand I guess that you will not be able to enter the shell before \`mylibrary\` fully compiles… hence the need for \`shellFor\` to work simultaneously on multiple projects.

Note that you may want to add tools needed either at compile time or a library at run time. For that, you can use the `modifier` field that is an arbitrary function to apply to the final haskell package (in particular you can apply the `overrideCabal` that we saw above). Notably, you can add nativeBuildInputs using [pkgs.haskell.lib.addBuildTools](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/lib/compose.nix#L156) and buildInputs using [pkgs.haskell.lib.addExtraLibraries](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/lib/compose.nix#L159) (for those of you that are curious to see how they are used in the final derivation, see [here](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/generic-builder.nix#L653)):

``` nix
let
  pkgs = import <nixpkgs> { }; # pin the channel to ensure reproducibility!
in
pkgs.haskellPackages.developPackage {
  root = ./.;
  modifier = drv:
    pkgs.haskell.lib.addBuildTools drv (with pkgs.haskellPackages;
      [ cabal-install
        ghcid
      ]);
}
```

You can also get more details in [pkgs/development/haskell-modules/make-package-set.nix](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/make-package-set.nix#L230).

### Using shellFor (multiple packages)

[shellFor](https://nixos.org/manual/nixpkgs/stable/#haskell-shellFor) is similar to `developPackage` but (slightly) more complicated to also allow you to develop multiples packages at the same time (it can work in conjuction with [cabal.project](https://cabal.readthedocs.io/en/stable/cabal-project-description-file.html)). Note that contrary to `developPackage` I don't think that `shellFor` can output a derivation.

The idea is to first extend/override the set of haskell packages in order to add your projects as additional haskell packages (for instance using `haskellPackages.extend` and `packageSourceOverrides` that just need the path of the project to compile it), and then to use `haskellPackages.shellFor {packages= p: [p.myproject1 p.myproject2]}` to create a shell with all wanted packages.

For instance you can define your various projects in subfolders `./frontend` and `./backend` (you can use cabal init to create the content in each folder), then create a file `cabal.project` containing:

Finally you define a nix shell in `shell.nix` containing:

then you can use cabal to develop incrementally your projects using for instance:

``` console
$ nix-shell
$ cabal build all
```

If you want to be able to compile a project non-incrementally with `nix-build` (say the backend in the above example) you can put in `default.nix`:

or if you want to create a single derivation file, you can use `if pkgs.lib.inNixShell then … else …` to output the shell when we start a shell and the packages when we want to build them. You can find [here](https://github.com/kowainik/summoner/blob/60de4f2f087e5bd2beaad9253e7eded731cfbaaf/default.nix) an example.

### Using haskell.nix (for complex projects)

The [haskell.nix](https://github.com/input-output-hk/haskell.nix) project allows you to have maximum flexibility (to create your own package set or use in teams with diverse people, some of them using stack, other using cabal, other using nix…). But this comes at the price of additional complexity.

### Using haskell-flake (flake-parts)

[haskell-flake](https://community.flake.parts/haskell-flake) is a project that aims to simplify writing Nix for Haskell development through use of <a href="Flake_Parts" class="wikilink" title="flake-parts module system">flake-parts module system</a>. It uses `callCabal2nix` and `shellFor` under the hood while exposing friendly module options API. For an overview of Flakes, see the <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> wiki page.

- For existing Haskell projects, initialize with:

``` bash
nix flake init -t github:srid/haskell-flake
```

- For new Haskell projects, use the example template:

``` bash
mkdir example && cd ./example
nix flake init -t github:srid/haskell-flake#example
```

This command will generate a project template with additional configuration details, comments, and examples. Below is an example minimal flake definition for a simple project:

Once configured, you can build and run the project with:

``` console
$ nix build # Build the project; the binary will be placed in ./result/bin
$ ./result/bin/example

$ nix run # Alternatively, run the default executable directly
```

or enter a development shell to use the standard development tools provided by the flake:

``` console
$ nix develop
$ cabal run
```

The build process will use the `example.cabal` file and run the executable defined within it. A current limitation is that if your Cabal file contains multiple `executable` blocks, you can only assign one as the default package. This limitation also applies when using a `cabal.project`. To run a specific executable by name, use the following command `nix run .#another-example`. Below is an example cabal file defining two executables:

#### Further reading

- [Example Haskell project with a development environment](https://github.com/srid/haskell-template/tree/master)

<!-- -->

- [Example cabal.project multi-package Haskell project](https://github.com/srid/haskell-multi-nix/tree/master)

<!-- -->

- [Getting started with haskell-flake](https://community.flake.parts/haskell-flake/start).

<!-- -->

- [Overriding dependencies in a haskell-flake](https://community.flake.parts/haskell-flake/dependency)

<!-- -->

- [haskell-flake haskell-flake options reference](https://flake.parts/options/haskell-flake)

## Overrides

Since nixpkgs tries to maintain a single package set (based on the package set of stackage, while the remaining packages are picked from the latest version on Hackage) instead of using a solver to meet all version constraints for a specific project, it turns out that sometimes packages are broken (they can also be broken for various other reasons). However, you may be able to unbreak this package yourself.

The first thing to check to try to unbreak a package is to check which GHC version is compatible with the package you want to use. You are maybe using a too old version… or too new. You can change the version of ghc using `haskell.packages.ghcXYZ` in place of `haskellPackages` as explained above.

Then, you will surely need to change some packages. If you are using `developPackage` as explained above you can either use a normal override that will be described below or a simpler source override to override only the source as:

``` nix
pkgs.haskellPackages.developPackage {
  root = ./.;
  source-overrides = {
    # Let's say the GHC haskellPackages uses 1.6.0.0 and your test suite is incompatible with >= 1.6.0.0
    HUnit = "1.5.0.0";
  };
};  
```

You can provide to `source-overrides` either:

- a version number (it will be [forwarded internally](https://github.com/NixOS/nixpkgs/blob/b794e83b395253fc46df958a0a12e1fc7b80d069/pkgs/development/haskell-modules/lib/compose.nix#L48) to `callHackage`, note that you do not need to specify any hash as nix is using a package `all-cabal-hashes` that contains all the cabal hashes, see `callHackageDirect` below if your package is not yet in `all-cabal-hashes`)
- a path (that will be forwarded internally to `callCabal2nix`), you can use the usual fetchers like `fetchurl` or `fetchFromGitHub` to generate that path, or a local path if you want to use a local library.

You can also use the more powerful override system to change any property of the derivation. This works for instance with `developPackage`:

``` nix
pkgs.haskellPackages.developPackage {
  root = ./.;
  overrides = self: super: { # self is the new package set, super is the old package set
    random = pkgs.haskell.lib.overrideCabal super.random {
      version = "1.1";
      sha256 = "sha256-txikEFfiWjpx32k6sP4iY9SS51lnmzwv6m6jOxcdOlo="; # Use an empty string before knowing the hash
      doCheck = false;
    };
  };
};  
```

but you can also use overrides with `ghcWithPackages`. This example will for instance create a nix-shell where the library quipper is available:

``` nix
{ pkgs ? import <nixpkgs> {} }:
with pkgs;
pkgs.mkShell {
  buildInputs =
    let
      # Quipper does not work with GHC 7.10 or 8.10. The versions currently supported are GHC 8.0, 8.2, 8.4, 8.6, and 8.8.
      myHaskell = pkgs.haskell.packages.ghc884.override {
        overrides = self: super: {
          # fixedprec needs random 1.1 or below
          random = pkgs.haskell.lib.overrideCabal super.random {
            version = "1.1";
            sha256 = "sha256-txikEFfiWjpx32k6sP4iY9SS51lnmzwv6m6jOxcdOlo=";
          };
          fixedprec = haskell.lib.markUnbroken super.fixedprec;
          quipper = haskell.lib.markUnbroken super.quipper;
        };
      };
    in
      [
        (myHaskell.ghcWithPackages (hpkgs: [
          hpkgs.quipper
        ]))
      ];
}
```

Note that `overrideCabal` takes as input the old package and the new attributes of the new package and outputs the new package. To see the full list of parameters that can be overridden, you can refer to [this file](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/generic-builder.nix#L13).

Because some operations are very common, there exists some functions that call `overrideCabal` for you. For instance if you only want to disable checks and test suits for a package you can do `mypackage = pkgs.haskell.lib.dontCheck super.mypackage` and the above code also shows how to mark a package as unbroken. These functions are listed and documented in [pkgs/development/haskell-modules/lib/compose.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/haskell-modules/lib/compose.nix).

You can also use `callHackageDirect` (source and documentation [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/haskell-modules/make-package-set.nix#L196), you can see that it is a wrapper around `callCabal2nix`) to create a package using the hackage repository:

``` nix
myHaskell = pkgs.haskellPackages.override {
  overrides = self: super: {
    mypackage = self.callHackageDirect {
      pkg = "mypackage";
      ver = "0.1.2.3";
      sha256 = ""; # The first time it will give you an error, replace the "" with the hash given in the error
    } {};
  };
};
```

Finally, if your package is not in hackage, you can simply use [`callCabal2nix`](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/make-package-set.nix#L228), or the more advanced [callCabal2nixWithOptions](https://github.com/NixOS/nixpkgs/blob/0ba44a03f620806a2558a699dba143e6cf9858db/pkgs/development/haskell-modules/make-package-set.nix#L212):

``` nix
mypackage = self.callCabal2nix "mypackage" /path/to/package/or/fetcher {};
```

This can be useful also when your package needs some libraries.

## Limitations

### cabal2nix

When using the `cabal2nix` tool, Nix does not pull a cabal package by respecting the constraint specified in the cabal file (see [example](https://github.com/chrissound/Cabal2NixLimitationExample)). Issue is discussed [here](https://stackoverflow.com/questions/57441156/pulling-in-specific-haskell-packages-cabal-dependencies-with-nix). You should be using `callCabal2nix` anyway.

### IFD and Haskell

`callCabal2nix`, which is implicitly used for building Haskell projects, uses IFD. Refer to this [github issue](https://github.com/NixOS/templates/issues/28) and [discourse thread](https://discourse.nixos.org/t/another-simple-flake-for-haskell-development/18164/6) for additional context. This means that since IFD is disabled by default in certain nix commands,[1](https://github.com/NixOS/nix/pull/5253) the following commands will be broken for Haskell projects whose flake output specifies multiple system attributes:

- `nix flake show`
- `nix flake check`

### GHCup

[GHCup](https://www.haskell.org/ghcup/) does not work properly on NixOS out of the box. NixOS cannot run dynamically linked executables built for generic Linux environments due to its runtime linker setup. For details and a workaround, see [nix.dev's explanation of stub-ld](https://nix.dev/guides/faq#how-to-run-non-nix-executables).

In most cases there is little reason to use GHCup when working within a Nix-based system, as Nixpkgs can achieve the same goals such as managing multiple GHC versions and other Haskell tooling.

## FAQ and resources

- **Official Docs:** [**The Haskell section in the nixpkgs manual**](https://nixos.org/manual/nixpkgs/unstable/#haskell)

<!-- -->

- [**Nixifying a Haskell project using nixpkgs**](https://nixos.asia/en/nixify-haskell-nixpkgs) explains how to use Nix to package and develop Haskell projects using nothing but nixpkgs.

<!-- -->

- [**Super-Simple Haskell Development with Nix**](https://github.com/mhwombat/nix-for-numbskulls/blob/78bcc186f79931c0e4a1e445e2f6b1f12f6d46be/Haskell/ss-haskell-dev.md) (and [discussion](https://discourse.nixos.org/t/super-simple-haskell-development-with-nix/14287/2) that provides interesting alternative methods together with there pro and cons)

<!-- -->

- [**Nix Haskell Development (2020)**](https://discourse.nixos.org/t/nix-haskell-development-2020/6170)

<!-- -->

- [**How are Haskell packages managed in nixpkgs?**](https://discourse.nixos.org/t/haskellpackages-stm-containers-fails-to-build/5416/4)

<!-- -->

- [**How to fix broken Haskell packages?** (video)](https://www.youtube.com/watch?v=KLhkAEk8I20)

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:Haskell" class="wikilink" title="Category:Haskell">Category:Haskell</a>
