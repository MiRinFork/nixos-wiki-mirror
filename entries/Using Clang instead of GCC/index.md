<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Using Clang instead of GCC -->

You can use Clang instead of GCC as a compiler for any package by overriding `stdenv`, which contains the compilation toolchain, with:

``` nix
stdenv = pkgs.clangStdenv;
```

or to get a specific version of clang:

``` nix
stdenv = pkgs.llvmPackages_9.stdenv;
```

Depending on the case you may want to set this value in different location, and using different mechanism.

Note you may get errors like `fatal error: ... file not found` on standard library `#include` directives, because of this bug <https://github.com/NixOS/nixpkgs/issues/150655>

## Globally, in a package repository tree

If you have a set of packages in a repository tree, you can set the `stdenv` value in the scope where the `callPackage` are called. Be carefull **all the packages present in the scope will be built with Clang** because the `callPackage` that resolves the package function inputs will use the `pkgs.clangStdenv` for all packages.

``` nix
rec {
    stdenv = pkgs.clangStdenv;
    foo = callPackage ./foo { };
    bar = callPackage ./bar { };
}
```

or import nixpkgs with replaceStdenv.

``` nix
import <nixpkgs> { config = { replaceStdenv = ({ pkgs }: pkgs.clangStdenv); }; }
```

## For a specific package in a repository tree

If you a one specific package in your package repository that you want to build with Clang. You can either override stdenv in the `callPackage` or creating a package override.

Here only foo will be built with Clang, and only with Clang.

``` nix
rec {
    foo = callPackage ./foo { stdenv = pkgs.clangStdenv; };
    bar = callPackage ./bar { };
}
```

But if you want both toolchains you can use:

``` nix
rec {
    foo_gcc = callPackage ./foo { };
    foo_clang = callPackage ./foo { stdenv = pkgs.clangStdenv; };
    bar = callPackage ./bar { };
}
```

## Using Nix CLI on existing packages

Directly inline with CLI just do:

``` bash
nix-build -E "with import <nixpkgs> {}; pkgs.hello.override{ stdenv = pkgs.clangStdenv; }"
```

or, if you want a shell for development:

``` bash
nix-shell -E "with import <nixpkgs> {}; pkgs.hello.override{ stdenv = pkgs.clangStdenv; }"
```

## Using an external override definition

``` nix
# in file ./hello_with_clan.nix
with import <nixpkgs> {};
hello.override {
    # use Clang instead of GCC
    stdenv = pkgs.clangStdenv;
}
```

``` bash
nix-build ./hello_with_clan.nix
```

## With nix-shell

To use clang in nix-shell instead of gcc:

``` nix
# in file ./shell.nix
with import <nixpkgs> {};
clangStdenv.mkDerivation {
  name = "clang-nix-shell";
  buildInputs = [ /* add libraries here */ ];
}
```

## See also

- <a href="C#Use_a_different_compiler_version" class="wikilink" title="C # Use a different compiler version">C # Use a different compiler version</a>

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
