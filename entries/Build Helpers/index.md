<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Build Helpers -->

<a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> hosts a number of simple functions called "build helpers", that are commonly used as part of a larger derivation, such as <a href="Derivations" class="wikilink" title="stdenv.mkDerivation">stdenv.mkDerivation</a>. These helpers can be used part of a larger derivation, or to produce a simple derivation that doesn't need the full power of the standard environment.

### Trivial Build Helpers

#### runCommandWith

An extremely simple derivation that runs a series of shell commands as part of the build-step. It would be accurate to consider this as a fancy wrapper around installPhase.

This function accepts two arguments, an attribute set and a string. The attribute set is defined as:

1.  name: The derivation name, exactly like a standard Nix derivation.
2.  stdenv (default: `pkgs.stdenv`): Define the standard environment used
3.  runLocal (default: `false`): Prevents the usage of substituters and/or remote builders; forces local builds only.
4.  derivationArgs (default: `{}`): Additional arguments passed directly into an internal `mkDerivation`.

The string represents a series of shell commands to execute when building this derivation. These must generate an `$out`, much like a standard derivation.

A common use case for this type of builder is when you're copying files into the store. You can get quite creative and use this to transform those files as they become part of the store, leaving you with the final, transformed file output.

``` nix
{
  runCommandWith,
  sassc,
}:
runCommandWith {
  name = "sass-to-css";
  derivationArgs.nativeBuildInputs = [ sassc ];
} ''
  mkdir -p $out
  sassc ${./style.scss} $out/style.css
''
```

Nixpkgs provides a few higher-level entry points for this builder. All of these functions accept a name, and an attribute set that maps to `derivationArgs` for the above. This simpler signature makes them more suitable for use as compared to `runCommandWith`, and should be preferred unless you know you need `runCommandWith` directly.

- `runCommand`: sets `stdenv = pkgs.stdenvNoCC`.
- `runCommandCC`: completely default `runCommandWith`.
- `runCommandLocal`: sets `runLocal = true`.

There are a couple other aliases that aren't used very often, but will be listed here anyways as an exhaustive reference:

- `runCommandNoCC`: identical to `runCommand`.
- `runCommandNoCCLocal`: identical to `runCommandLocal`.
