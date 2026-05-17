<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Julia -->

[Julia](https://julialang.org/) is a programming language, that aims to create an unprecedented combination of ease-of-use, power, and efficiency in a single language.

## Installation And Versions

You can install the newest version of Julia either with `julia-bin` (the derivation which downloads the binary) or `julia` (the derivation which builds Julia from the source). From the end-user perspective, -bin packages should be indistinguishable from source-built ones.

## Packages

Julia packages can be installed via nix using the `julia.withPackages` function. For example:

``` nix
{pkgs, ...}:
let
  myjulia = (pkgs.julia.withPackages [
    "Plots"
  ]);
in
{

environment.systemPackages = [ myjulia ];

home.packages = [ myjulia ]; # if using home manager
}
```

You can also install packages the [without nix.](https://docs.julialang.org/en/v1/stdlib/Pkg/)

Some Julia packages expect binaries to be installed on your system. Until a better solution is found, you can run Julia inside <a href="Distrobox" class="wikilink" title="Distrobox">Distrobox</a>.

Most notably, Julia Plots does not work. You can use [Gadfly](http://gadflyjl.org/stable/) instead.

As of April 2026, the above statement is no longer accurate. [Julia Plots](https://docs.juliaplots.org/stable/) does seem to work with no additional configuration.

Another solution is to enable [nix-ld](https://github.com/nix-community/nix-ld), see also [here](https://nix.dev/guides/faq#how-to-run-non-nix-executables).

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
