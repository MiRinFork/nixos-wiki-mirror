<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ada -->

[Ada](https://ada-lang.io/) is a programming language.

## Building programs

### GNAT

The GNAT Ada toolchain is fully packaged in <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> and can be used to build software. It has a bit less convenience than typical <a href="C" class="wikilink" title="C">C</a>/<a href="C++" class="wikilink" title="C++">C++</a> toolchains due to its small user base. A simple Ada program using GPR can be built as follows:

``` nix
{ stdenv, gnat, gprbuild, glibc }:

stdenv.mkDerivation {
  pname = "an-ada-program";
  version = "1.2.3";

  src = ...;

  nativeBuildInputs = [
    gprbuild
    gnat
  ];

  dontConfigure = true;

  buildPhase = ''
    runHook preBuild

    gprbuild

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/bin

    # Only install what we need to run the binary.
    gprinstall --prefix=$out hello.gpr \
      --no-project \
      --no-manifest \
      --mode=usage

    runHook postInstall
  '';
}
```

#### Building static binaries

If you try to build static binaries, you need to add the static version of libc manually. For this, add `glibc` to the derivation parameters (at the top) and add the following to the derivation itself.

``` nix
buildInputs = [
  glibc.static
];
```

There is an example on [GitHub](https://github.com/blitz/adahello).

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
