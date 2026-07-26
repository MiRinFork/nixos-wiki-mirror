<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: LLVM -->

From <a href="Wikipedia:LLVM" class="wikilink" title="Wikipedia">Wikipedia</a>:

  
The LLVM compiler infrastructure project is a "collection of modular and reusable compiler and toolchain technologies" used to develop compiler front ends and back ends.

## Build LLVM/clang from source

LLVM/clang when compiled from source won't find headers/libraries/startup files without compiler wrapper. However it is possible to use the following `shell.nix` to get started and provide the missing flags to the compiler manually

``` nix
with import <nixpkgs> {};
let
  gccForLibs = stdenv.cc.cc;
in stdenv.mkDerivation {
  name = "llvm-env";
  buildInputs = [
    bashInteractive
    python3
    ninja
    cmake
    llvmPackages_latest.llvm
  ];

  # where to find libgcc
  NIX_LDFLAGS="-L${gccForLibs}/lib/gcc/${targetPlatform.config}/${gccForLibs.version}";
  # teach clang about C startup file locations
  CFLAGS="-B${gccForLibs}/lib/gcc/${targetPlatform.config}/${gccForLibs.version} -B ${stdenv.cc.libc}/lib";

  cmakeFlags = [
    "-DGCC_INSTALL_PREFIX=${gcc}"
    "-DC_INCLUDE_DIRS=${stdenv.cc.libc.dev}/include"
    "-GNinja"
    # Debug for debug builds
    "-DCMAKE_BUILD_TYPE=Release"
    # inst will be our installation prefix
    "-DCMAKE_INSTALL_PREFIX=../inst"
    "-DLLVM_INSTALL_TOOLCHAIN_ONLY=ON"
    # change this to enable the projects you need
    "-DLLVM_ENABLE_PROJECTS=clang"
    # enable libcxx* to come into play at runtimes
    "-DLLVM_ENABLE_RUNTIMES=libcxx;libcxxabi"
    # this makes llvm only to produce code for the current platform, this saves CPU time, change it to what you need
    "-DLLVM_TARGETS_TO_BUILD=host"
  ];
}
```

After that you can execute the following commands to get a working clang:

``` console
$ git clone https://github.com/llvm/llvm-project/
$ mkdir build && cd build
$ cmake $cmakeFlags ../llvm-project/llvm
$ ninja
$ # installs everything to ../inst
$ ninja install
$ cd ..
```

Then assuming you have a test program called `main.c`:

``` console
$ ./inst/bin/clang $CFLAGS -o main main.c 
```

## Building Nixpkgs/NixOS with LLVM

It is technically possible to build Nixpkgs and NixOS with LLVM, however many packages are broken due to the differences between GCC and Clang. Tristan Ross, one of the maintainers of LLVM, started a project back in June of 2024 to improve the state of LLVM compiled packages. Currently, the project is located on GitHub at [RossComputerGuy/nixpkgs-llvm-ws](https://github.com/RossComputerGuy/nixpkgs-llvm-ws). Many packages have been fixed upstream but it is best to try the Flake as not all fixes are merged.

### Using LLVM in Nixpkgs without the Nixpkgs LLVM Workspace

To use LLVM to build packages in Nix, it can be done by either using the `pkgsLLVM` attribute or by overriding a derivation and changing out the `stdenv`. Changing out the `stdenv` is as simple as this:

``` nix
pkgs.hello.override {
  stdenv = pkgs.llvmPackages.stdenv;
}
```

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
