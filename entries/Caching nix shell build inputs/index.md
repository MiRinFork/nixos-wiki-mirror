<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Caching nix shell build inputs -->

## Problem statement

Caching a Nix build is *straightforward* if there's a build result. We can use to query the runtime closure of the build for a ''binary distribution".

Unfortunately, this is not doable with *mkShell* as they are purposefully not build-able.

``` nix
let pkgs = import <nixpkgs> {};
in
with pkgs.stdenv;
with pkgs.stdenv.lib;
pkgs.mkShell {
  name = "example-shell";
  nativeBuildInputs = with pkgs.buildPackages; [ /* tools */ ];
  buildInputs = with pkgs; [ /* libs */ ];
}
```

``` bash
$ nix-build shell.nix

This derivation is not meant to be built, aborting
```

We could perform on the **derivation** however that results in a **source transitive closure**; which is unecessary if the goal is to simply cache *buildInputs*.

## How can we cache all buildInputs for mkShell?

A [blog post](https://fzakaria.com/2020/08/11/caching-your-nix-shell.html) ([mirror](https://web.archive.org/web/20201012134126/https://fzakaria.com/2020/08/11/caching-your-nix-shell.html)) on the subject improved upon the previous wisdom and came up with the following

``` bash
nix-store --query --references $(nix-instantiate shell.nix) | \
    xargs nix-store --realise | \
    xargs nix-store --query --requisites | \
    cachix push your_cache
```

The "trick" here; is to rely on which gives only the *immediate dependencies*. For each dependency then it's runtime closure is calculated.

## inputDerivation

A recent improvement to *'nixpkgs* included the *inputDerivation* attribute. <https://github.com/NixOS/nixpkgs/pull/95536>

This further improves on the previous example by also supporting derivations with *multiple outputs*.

``` bash
nix-build shell.nix -A inputDerivation
```

or if you are using cachix

``` bash
nix-build shell.nix -A inputDerivation | cachix push $name
```

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
