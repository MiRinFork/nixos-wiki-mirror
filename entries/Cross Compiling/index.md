<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cross Compiling -->

<a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> provides excellent support in configuring it for cross-platform compiling tasks since 18.09<sup>\[citation needed\]</sup>.

In order to prepare Nixpkgs for a cross-compiling environment, it needs to be aware of both the platform that performs the build-step, and the platform that will execute the resulting binaries. The former is referred to as the `buildPlatform`, while the latter is `hostPlatform`.

> If you were compiling a program from your system for a Raspberry PI, you would be the `buildPlatform` whereas the Raspberry PI would be the `hostPlatform`.

Furthermore, in order to provide more granular control to declaring dependencies in these environments, Nixpkgs derivations expose an exhaustive set of attributes that can explicitly define when are where dependencies are required. A full reference to these can be found in the [Nixpkgs manual](https://nixos.org/manual/nixpkgs/unstable/#ssec-stdenv-dependencies-propagated).

## Getting Started

Nixpkgs exposes two configuration attributes that map internally to the expected behaviors of the build/host platforms as described above. These attributes can be set when importing Nixpkgs as a Nix expression:

``` nix
let
  pkgs = import <nixpkgs> {
    localSystem = "x86_64-linux"; # buildPlatform
    crossSystem = "aarch64-linux"; # hostPlatform
  };
in pkgs.hello
```

The above will provide a derivation result for the hello derivation that can run on an `aarch64-linux` system. This can sometimes be tedious especially for common `hostPlatform` targets. Fortunately, Nixpkgs exposes a `pkgsCross` attribute that provides pre-configured cross compiling targets. The snippet above converted to using `pkgsCross` can be shorted to:

``` nix
let
  pkgs = import <nixpkgs> {
    localSystem = "x86_64-linux";
  };
in pkgs.pkgsCross.aarch64-multiplatform.hello
```

You can perform the same operations using the CLI, and Nix will correctly evaluate the `localSystem` based on your current system:

``` bash
nix-build '<nixpkgs>' -A pkgsCross.aarch64-multiplatform.hello # nix-legacy
nix-build '<nixpkgs>' --arg crossSystem '(import <nixpkgs> {}).lib.systems.examples.aarch64-multiplatform' -A hello # alternative way
nix build nixpkgs#pkgsCross.aarch64-multiplatform.hello # nix3
```

All of the above snippets will resolve to the exact same derivation result, which will provide a binary for GNU Hello that can execute only on an `aarch64` system. There are many other systems `pkgsCross` has defined, you can see an exhaustive list of all of them on your system:

``` bash
$ nix-instantiate --eval --expr 'builtins.attrNames (import <nixpkgs> {}).pkgsCross' --json | nix-shell -p jq --command 'jq' # nix-legacy
$ nix eval --impure --expr 'builtins.attrNames (import <nixpkgs> {}).pkgsCross' --json | nix run nixpkgs#jq # nix3
```

If you instead prefer to write your systems directly, through `localSystem` and `crossSystem`, you can refer to [nixpkgs/lib/systems/examples.nix](https://github.com/NixOS/nixpkgs/blob/master/lib/systems/examples.nix) for examples of platforms exposed as attributes. These can be directly used in-place for the aforementioned arguments:

``` nix
let
  lib = import <nixpkgs/lib>;
  pkgs = import <nixpkgs> {
    #localSystem = ...;
    crossSystem = lib.systems.examples.aarch64-multiplatform;
  };
in pkgs.hello
```

## Development

### Basics

Using the same ideas as above, we can create development environments which provide us with a compilation suite that can perform cross-compilation for us. A very simple <a href="Development_environment_with_nix-shell" class="wikilink" title="development shell">development shell</a> (colloquially called a "devshell") can be written as:

``` nix
# shell.nix
{
  pkgs ? import <nixpkgs> {
    localSystem = "x86_64-linux";
    crossSystem = "aarch64-linux";

  },
}:
pkgs.callPackage (
  {
    mkShell,
  }:
  mkShell {
    # By default this provides gcc, ar, ld, and some other bare minimum tools
  }
) { }
```

Entering this development shell via `nix-shell shell.nix` will add the relevant compiler tools to your PATH temporarily. Similar to other Linux systems, all cross-compiling tools are prefixed with relevant platform prefixes, which means simply typing `gcc` will not work. However, the provided `mkShell` will introduce environment variables for your devshell, such as `$CC`, `$AR`, `$LD`, and more. At the time of writing, official documentation on an exhaustive list of these variables does not exist, but you can view them for your devshell through the command-line:

``` bash
$ $EDITOR $(nix-build ./shell.nix) # opens your EDITOR with a massive bash script full of declare -x ...
```

Given these environment variables, you can run compile your software using the exact same commands with fairly minimal changes (changing hardcoded `gcc` values into \$CC, for example):

``` bash
$ $CC -o main src/main.c
$ file main
main: ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV), dynamically linked, interpreter /nix/store/qa51m8r8rjnigk5hf7sxv0hw7qr7l4bc-glibc-aarch64-unknown-linux-gnu-2.39-52/lib/ld-linux-aarch64.so.1, for GNU/Linux 3.10.0, not stripped
```

The above snippet will have minor differences depending on when you run it, but the main thing to notice is `ARM aarch64`, which tells us our software was able to successfully cross compile.

### Declaring dependencies

If you try to declare build-time dependencies within the devshell (such as `pkgs.cmake`), you will quickly realize that these derivations are actually being built for the `crossSystem`, making them unusable on your system architecture (see [\#49526](https://github.com/NixOS/nixpkgs/issues/49526)). There are ways around this, but in general once you've gotten to this point you should prefer [writing a derivation](https://nixos.org/manual/nixpkgs/unstable/#chap-stdenv), which will make it not only easier to write both derivations, but will allow you to follow the recommended practices for using Nix.

If you would prefer to continue building within the devshell, you can use [callPackage](https://nixos.org/guides/nix-pills/13-callpackage-design-pattern), which will *magically* resolve the dependencies for the correct architecture, provided you place them in the correct attributes:

``` nix
{
  pkgs ? import <nixpkgs> {
    localSystem = "x86_64-linux";
    crossSystem = "aarch64-linux";
  },
}:
pkgs.callPackage (
  {
    mkShell,
    hello,
    pkg-config,
    libGL,
  }:
  mkShell {
    strictDeps = true;
    # host/target agnostic programs
    depsBuildBuild = [
      hello
    ];
    # compilers & linkers & dependecy finding programs
    nativeBuildInputs = [
      pkg-config
    ];
    # libraries
    buildInputs = [
      libGL
    ];
  }
) { }
```

The above snippet will drop you into a devshell that provides `pkg-config` as a native binary (accessible through `$PKG_CONFIG`), while also allowing linking to a valid `libGL` for the `crossSystem`.

For more information regarding the above, namely the usage of `nativeBuildInputs` and `buildInputs`, see [stdenv dependencies](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-dependencies) for a in-depth explanation. Alternatively, a simplified explanation can be found in a comment on the [Nixpkgs repo](https://github.com/NixOS/nixpkgs/pull/50881).

## Tips and tricks

### Executing cross compiled binaries

By using <a href="QEMU" class="wikilink" title="QEMU">QEMU</a>, we can natively execute a cross-compiled binary through an emulation layer. This will result in degraded performance but is very suitable for testing the functionality of a binary.

If you are on NixOS, this functionality can be provided automatically on any cross-compiled binary by setting [boot.binfmt.emulatedSystems](https://nixos.org/manual/nixos/unstable/options#opt-boot.binfmt.emulatedSystems) in your configuration. After rebuilding, attempting to run a cross-compiled binary will automatically invoke `qemu` indirectly through the [binfmt_misc kernel feature](https://www.kernel.org/doc/html/latest/admin-guide/binfmt-misc.html).

``` bash
$ ./result
Hello World!
$ ./result-aarch64-linux
Hello World!
```

Otherwise, you can use the `pkgs.qemu-user` to download qemu user space programs (or use any installed by your distro) to run your package easily.

``` bash
$ ./result
Hello World!
$ qemu-aarch64 ./result-aarch64-linux
Hello World!
```

### Leveraging the binary cache

You will likely have noticed that resolving derivations through either pkgsCross or a configured Nixpkgs instance results in your system needing to build the binary. This is because cross-compiled binaries are not cached on the official <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>. Fortunately, there are a small set of systems that are actively built and cached officially. At the time of writing, this only includes `aarch64-linux`, `aarch64-darwin`, `i686-linux`, `x86_64-linux`, and `x86_64-darwin`. If your platform targets include these, you may be able to leverage a slight hack to avoid large-scale builds.

> Please note that this is not recommended, as it hacks around some internal details of Nixpkgs which are subject to change at any time, and the storage requirements will be higher due to duplicate(but different system) packages.

An example of this using `pkgs.SDL2`:

``` nix
let
  # this will use aarch64 binaries from binary cache, so no need to build those
  pkgsArm = import <nixpkgs> {
    localSystem = "aarch64-linux";
  };

  # these will be your cross packages
  pkgsCross = import <nixpkgs> {
    overlays = [
      (self: super: {
        # we want to hack on SDL, don't want to hack on those. Some even don't cross-compile
        inherit (pkgsArm)
          xorg
          libpulseaudio
          libGL
          guile
          systemd
          libxkbcommon
          ;
      })
    ];
    localSystem = "x86_64-linux";
    crossSystem = "aarch64-linux";
  };
in
pkgsCross.callPackage (
  {
    SDL2,
    wayland,
    wayland-protocols,
    wayland-scanner,
  }:
  SDL2.override {
    inherit
      wayland
      wayland-protocols
      wayland-scanner
      ;
  }
) { }
```

### Using cross-compiled packages in the host NixOS config

First, configure your builder as a trusted <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>. Then copy the cross-compiled package to the host using `nix copy`.

Finally modify your `configuration.nix` as follows:

``` nix
let pkgsCross = import <nixpkgs> {
  localSystem = "x86_64-linux"; # <-- put your builder's platform here and below
  hostSystem = "x86_64-linux";
  crossSystem = "aarch64-linux"; # <-- put your host's platform here
};
in
{
  environment.systemPackages = [
    pkgsCross.hello # <-- put your cross-compiled package here
  ];
}
```

## See also

- <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>
- <a href="Packaging/32bit_Applications" class="wikilink" title="Packaging/32bit Applications">Packaging/32bit Applications</a>
- <a href="Cheatsheet#Cross-compile_packages" class="wikilink" title="Cheatsheet#Cross-compile packages">Cheatsheet#Cross-compile packages</a>
- [Nixpkgs manual on cross compiling](https://nixos.org/nixpkgs/manual/#chap-cross)

<!-- -->

- [Introduction to Cross Compilation with nix by Matthew Bauer](https://matthewbauer.us/blog/beginners-guide-to-cross.html)
- [Slides from the cross-compilation workshop on 35c3](https://docs.google.com/presentation/d/11B3Igxj0KmsxgT_UQvKufd5El_oH-T__Sl3JNCZeOnY/edit?usp=sharing)

<!-- -->

- \[<https://logs.nix.samueldr.com/nixos/2018-08-03#1533327247-1533327971>; 2018-08-03 discussion on \#nixos\] ([Mirror of chat on Matrix.org](https://matrix.to/#/!AinLFXQRxTuqNpXyXk:matrix.org/$15333274371713496LOAor:matrix.org))
- [C++ with Nix in 2023, Part 2: Package Generation and Cross-Compilation, Nixcademy](https://nixcademy.com/posts/cpp-with-nix-in-2023-part-2-package/)
- [Separation of Concerns in Cross-Compilation, Nixcademy](https://nixcademy.com/posts/cross-compilation-with-nix/)
- [Cross-Compiling NixOS images, Nixcademy](https://nixcademy.com/posts/cross-compile-nixos-images/)

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a> <a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
