<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/I installed a library but my compiler is not finding it. Why? -->

<onlyinclude>

### I installed a library but my compiler is not finding it. Why?

With nix, only *applications* should be installed into profiles. Libraries are used using nix-shell. If you want to compile a piece of software that requires zlib (or openssl, sqlite etc.) and uses pkg-config to discover it, run

``` console
$ nix-shell -p gcc pkg-config zlib
```

to get into a shell with the appropriate environment variables set. In there, a configure script (with C Autotools, C++ CMake, Rust Cargo etc.) will work as expected.

This applies to other language environments too. In some cases the expressions to use are a bit different, e.g. because the interpreter needs to be wrapped to have some additional environment variables passed to it. The manual has [a section](https://nixos.org/nixpkgs/manual/#chap-language-support) on the subject.

Note that software built in such a shell may stop working after a garbage collection. This is because Nix only tracks dependencies of paths within the store. A clean build in a fresh shell can fix this one-off, but the long-term solution is to package the software in question rather than using a shell build regularly.

If you have a lot of dependencies, you may want to write a nix expression that includes your dependencies so that you can simply use `nix-shell` rather than writing out each dependency every time or keeping your development environment in your shell history. A minimal example looks like this:

``` nix
# default.nix
with import <nixpkgs> {};
stdenv.mkDerivation {
    name = "dev-environment"; # Probably put a more meaningful name here
    buildInputs = [ pkg-config zlib ];
}
```

### Why does it work like that?

This helps ensure purity of builds: on other distributions, the result of building a piece of software may depend on which other software you have installed. Nix attempts to avoid this to the greatest degree possible, which allows builds of a piece of software to be identical (in the ideal case) no matter where they're built, by requiring all dependencies to be declared.</onlyinclude>
