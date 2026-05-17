<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Packaging/32bit Applications -->

## Building software with 32bit `gcc`

**Question**: I'm invoking gcc with -m32 and it fails to find `` `gnu/stubs-32.h` ``  
**Answer (clever)**: you want to use `pkgsi686Linux` instead of pkgs, so things like `pkgsi686Linux.stdenv.mkDerivation` or `pkgsi686Linux.callPackage` then nix will give you 32bit everything[^1]

## Building software with both 32- and 64-bit executables

If a package wants to compile both 32/64-bit executables, you need a compiler with multilib support. Nixpkgs provides `multiStdenv.mkDerivation` that should be used instead `stdenv.mkDerivation`. This is equivalent to using `gcc-multilib` in debian derivatives.

### Rust

``` nix
env = {
  # Use multilib clang as linker for i686 target.
  # Required because Rust's bundled LLD doesn't know about Nix's multilib sysroot paths.
  # clang_multi has the correct 32-bit library paths (glibc_multi) baked into its driver.
  CARGO_TARGET_I686_UNKNOWN_LINUX_GNU_LINKER = "${pkgs.clang_multi}/bin/clang";
};

packages = with pkgs; [
  # clang with multilib support (both 32-bit and 64-bit)
  # This properly handles -m32 compilation with correct headers/libs
  clang_multi
];
```

An example that will let you build with `cargo test --target i686-unknown-linux-gnu` from an x86_64 machine.

You will want something similar to the following in your `flake.nix`, `devenv.sh` , or whatever you're using as your entry point.

#### Rust LTO & cargo bench

If you are using LTO and are having trouble building benchmarks (`cargo bench`) you may need to disable it at the build step until someone documents a better workaround here.

``` nix
env = {
  # Disable LTO for C/C++ code compiled by the `cc` crate for i686.
  # Some crates (like `alloca`) add -flto when CC=clang, but binutils ld can't
  # process LLVM IR bitcode. Using -fno-lto ensures native object files.
  CFLAGS_i686_unknown_linux_gnu = "-fno-lto";
  CXXFLAGS_i686_unknown_linux_gnu = "-fno-lto";
};
```

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>

[^1]: \[<https://logs.nix.samueldr.com/nixos/2018-03-19#1521474071-1521474422>; clever, \#nixos 2018-03-19\]
