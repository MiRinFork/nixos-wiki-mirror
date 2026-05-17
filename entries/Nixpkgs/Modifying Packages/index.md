<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/Modifying Packages -->

To modify the behavior of a Nix package, you typically have more than one option. The first approach you may consider is changing its runtime configuration: passing command line options, environment variables or configuration files that exist outside the package itself. Not modifying the definition of a package has the benefit of being able to use the publicly available <a href="Hydra" class="wikilink" title="Hydra">Hydra</a> build cache.

If the software as packaged does not have the flexibility you need, you have various options.

Conceptually the most simple option is to duplicate the package definition in a local file where you make your changes. You will be able to install and use it locally, while only having to learn the basics of Nix packaging.

If you expect your changes to be generally useful to others, you may consider creating a pull request for [nixpkgs on github](https://github.com/NixOS/nixpkgs). This has the benefit that others can help maintaining the package and that a binary of your package will be available for you to download.

If upstreaming into the official NixPkgs is not an option, consider creating an overlay. This is slightly more involved at first, but is easier to maintain than a Nixpkgs fork and, unlike a fork, it can be combined with other overlays. In an overlay, you can also choose not to redefine the package, but only override part of the arguments or derivation attributes. For example, you may only need to change one of the [stdenv build phases](https://nixos.org/nixpkgs/manual/#sec-stdenv-phases).

## The Copy Paste Option

This one is quick and easy to understand, but not something you can build on.

Let's add a patch to GNU hello by duplicating its definition. In the NixPkgs repository, hello can be found in `pkgs/applications/misc/hello/default.nix`, but it is not an expression that can be built directly with `nix-build` or `nix-env -i`. Its dependencies need to be injected, so let's wrap it in `callPackage`

    let pkgs = import <nixpkgs> {};
    in pkgs.callPackage (
      # whatever is in hello.nix
    ) {}

This is a Nix expression you can build, install, or base a Nix shell on.

It is not as flexible as the original definition though. If you want to reuse hello as a dependency of another package, you will have to work with two methods of injecting dependencies. Instead of just the standard `callPackage` function, your packages have to specify exactly where their dependencies come from, which can become a burden of its own. Also it is impossible to use this package with something other than the default `<nixpkgs>`, default NixPkgs configuration, default system architecture etc.

So this method of modifying a package is only suited for prototyping a package before refactoring and ad-hoc packages you know you will not re-use. Please consider the other options, because they don't have those drawbacks.

## Upstreaming into NixPkgs

Making your changes available as open source has all the benefits of open source. If it's an option for you, fork [nixpkgs on github](https://github.com/NixOS/nixpkgs), read the contributing guidelines, edit and test your modified clone and create a pull request.

## Create an Overlay

<a href="Overlays" class="wikilink" title="Overlays">Overlays</a> are a composable method of managing packages that are not (or not yet) suitable for upstream NixPkgs. Unlike a fork, you can have multiple active overlays and you can make changes to packages without having to maintain a git fork of the entire repository.

[Nixtodo](https://github.com/basvandijk/nixtodo/blob/master/default.nix) has an example of using an overlay to structure the packages in a web application project.

[Nixpkgs-mozilla](https://github.com/mozilla/nixpkgs-mozilla) is an example of an overlay containing alternative and extra open source software.
