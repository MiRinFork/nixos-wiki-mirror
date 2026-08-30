<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rust -->

This article is about the [Rust programming language](https://www.rust-lang.org). There are 3 methods to use the Rust compiler and toolchain in Nix/NixOS:

1.  via nixpkgs,
2.  via rustup,
3.  or with unofficial overlays on nixpkgs.

Installing via nixpkgs is the best way to use Rust, but there are valid reasons to use any approach.

## Installing via nixpkgs

The `cargo` and `rustc` derivations provide the Rust toolchain in nixpkgs. An advantage of using nixpkgs is that it's dead simple and you get pinned versions, deterministic builds in nix-shell, etc. However, nixpkgs only maintains a single version of the Rust stable toolchain, so if you require a nightly toolchain or switch between multiple toolchains then this approach may not be for you.

Here's an example `shell.nix`:

``` nix
let
  # Pinned nixpkgs, deterministic. Last updated: 2/12/21.
  pkgs = import (fetchTarball("https://github.com/NixOS/nixpkgs/archive/a58a0b5098f0c2a389ee70eb69422a052982d990.tar.gz")) {};

  # Rolling updates, not deterministic.
  # pkgs = import (fetchTarball("channel:nixpkgs-unstable")) {};
in
pkgs.callPackage (
  {
    mkShell,
    cargo,
    rustc,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [
      cargo
      rustc
    ];
  }
) { }
```

## Installing with bindgen support

By default crates using `bindgen` will not compile. To add bindgen support add the `rustPlatform.bindgenHook` to your `nativeBuildInputs`.

Here's an example `shell.nix`:

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
pkgs.callPackage (
  {
    mkShell,
    cargo,
    rustc,
    rustPlatform,
    pkg-config,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [
      cargo
      rustc
      rustPlatform.bindgenHook
      # optional: add pkg-config support
      pkg-config
    ];
    buildInputs = [
      # add desired native packages
      # ...
    ];
    # ...
  }
) { }
```

This also works, when compiling rust crates:

``` nix
{
  rustPlatform,
  pkg-config,
  ...
}:
rustPlatform.buildRustPackage {
  # ...
  nativeBuildInputs = [
    rustPlatform.bindgenHook
    pkg-config
  ];
  buildInputs = [
    # add desired native packages
    # ...
  ];
}
```

## Installing via rustup

The rustup tool is maintained by the Rust community and offers an interface to install and switch between Rust toolchains. In this scenario, rustup handles the "package management" of Rust toolchains and places them in `$PATH`. Nixpkgs offers rustup via the `rustup` derivation. More info on using rustup can be found on their official website: <https://rustup.rs/>.

If you want the most "normal" Rust experience I recommend using rustup with the following example shell.nix:

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
let
  overrides = (builtins.fromTOML (builtins.readFile ./rust-toolchain.toml));
in
pkgs.callPackage (
  {
    stdenv,
    mkShell,
    rustup,
    rustPlatform,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [
      rustup
      rustPlatform.bindgenHook
    ];
    # libraries here
    buildInputs =
      [
      ];
    RUSTC_VERSION = overrides.toolchain.channel;
    # https://github.com/rust-lang/rust-bindgen#environment-variables
    shellHook = ''
      export PATH="''${CARGO_HOME:-~/.cargo}/bin":"$PATH"
      export PATH="''${RUSTUP_HOME:-~/.rustup}/toolchains/$RUSTC_VERSION-${stdenv.hostPlatform.rust.rustcTarget}/bin":"$PATH"
    '';
  }
) { }
```

It's important to have a file named `rust-toolchain.toml` lying in the same directory as the shell.nix. Rust already has a standardized way of pinning a toolchain version for a workspace or a project. See [the Rustup book](https://rust-lang.github.io/rustup/overrides.html#the-toolchain-file) for its syntax.

A minimal example of the `rust-toolchain.toml`:

``` toml
[toolchain]
channel = "stable" # This can also be "nightly" if you want a nightly rust
                   # or nightly-20XX-XX-XX for a specific nightly.
```

## Cross-compiling

### To Windows via rustup

- [simple-static-rustup-target-windows](https://github.com/jraygauthier/jrg-rust-cross-experiment/tree/master/simple-static-rustup-target-windows)
  - [shell.nix](https://github.com/jraygauthier/jrg-rust-cross-experiment/blob/master/simple-static-rustup-target-windows/shell.nix)

### To Windows via a cargo plugin:

- use [cargo-xwin](https://crates.io/crates/cargo-xwin) with rustup install or the [nix cargo plugin](https://search.nixos.org/packages?show=cargo-xwin&type=packages&query=cargo+windows)
- run cargo commands prefixed by xwin, e.g. `cargo xwin run --target x86_64-pc-windows-msvc`

## Unofficial overlays

1.  <https://github.com/oxalica/rust-overlay> (Flake support, Nightly & Stable)
2.  <https://github.com/nix-community/fenix> (Flake support, Nightly & Stable)
3.  <https://github.com/mozilla/nixpkgs-mozilla> (Flake support, Nightly & Stable)

## devenv.sh support

1.  <https://github.com/cachix/devenv/blob/main/examples/rust/devenv.nix> and `devenv shell`

## Developing Rust projects using Nix

The [Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#rust) uses `buildRustPackage`.

[This](https://web.archive.org/web/20260108165619/https://srid.ca/rust-nix) blog post shows how to do it using `dream2nix`. A template repo is available here: <https://github.com/srid/rust-nix-template>

## Using overrideAttrs with Rust Packages

There are two ways to use `overrideAttrs` with Rust packages:

- Using <a href="Import_From_Derivation" class="wikilink" title="Import From Derivation">Import From Derivation</a>:

``` nix
nil = pkgs.nil.overrideAttrs (
  finalAttrs: previousAttrs: {
    version = "unstable-2024-09-19";
                                                                           
    src = pkgs.fetchFromGitHub {
      owner = "oxalica";
      repo = "nil";
      rev = "c8e8ce72442a164d89d3fdeaae0bcc405f8c015a";
      hash = "sha256-mIuOP4I51eFLquRaxMKx67pHmhatZrcVPjfHL98v/M8=";
    };
                                                                           
    # Requires IFD
    cargoDeps = pkgs.rustPlatform.importCargoLock {
      lockFile = finalAttrs.src + "/Cargo.lock";
      allowBuiltinFetchGit = true;
    };
    cargoHash = null;
  }
);
```

- Overriding `cargoDeps`:

``` nix
nil = pkgs.nil.overrideAttrs (
  finalAttrs: previousAttrs: {
    version = "unstable-2024-09-19";
                                                                           
    src = pkgs.fetchFromGitHub {
      owner = "oxalica";
      repo = "nil";
      rev = "c8e8ce72442a164d89d3fdeaae0bcc405f8c015a";
      hash = "sha256-mIuOP4I51eFLquRaxMKx67pHmhatZrcVPjfHL98v/M8=";
    };
                                                                           
    # Doesn't require IFD
    cargoDeps = previousAttrs.cargoDeps.overrideAttrs {
      name = "nil-vendor.tar.gz";
      inherit (finalAttrs) src;
      #outputHash = pkgs.lib.fakeHash;
      outputHash = "sha256-RWgknkeGNfP2wH1X6nc+b10Qg1QX3UeewDdeWG0RIE8=";
    #};
  }
);
```

## Packaging Rust projects with nix

At the time of writing, there are now no less than 8 different solutions for building Rust code with Nix. In the following table they are compared:

| Name | Cargo.lock solution | Derivations | Build logic | Supports cross | Notes |
|----|----|----|----|----|----|
| [`buildRustPackage`](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/rust.section.md) | Checksum or [`Import`](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/rust.section.md#importing-a-cargolock-file-importing-a-cargolock-file) | 1 | cargo | Yes | Built into nixpkgs |
| [`crate2nix`](https://github.com/kolloch/crate2nix) | Codegen (with optional IFD) | Many | `buildRustCrate` | [experimental](https://github.com/kolloch/crate2nix/commit/8bfeb42bda097e0bdf5452691a5e157aad3cc11f) | Spiritual successor to [`carnix`](https://github.com/nix-community/carnix) |
| [`naersk`](https://github.com/nmattia/naersk/) | Import | 2 | cargo | Yes | [Seems to only support building on x86](https://github.com/nmattia/naersk/blob/22b96210b2433228d42bce460f3befbdcfde7520/rust/rustc.nix#L22-L29) |
| [`cargo2nix`](https://github.com/cargo2nix/cargo2nix) | Codegen | Many | cargo + custom | Yes | Defaults to the oxalica Rust overlay but this can be overridden with `rustToolchain` |
| [`import-cargo`](https://github.com/edolstra/import-cargo) | Import | 1 | cargo | Unclear | More of a proof of concept than a full working solution |
| [`crane`](https://github.com/ipetkov/crane) | Import | 2 | cargo | [Yes](https://github.com/ipetkov/crane/tree/master/examples) | Inspired by naersk, with [better support for composing Cargo invocations as completely separate derivations](https://discourse.nixos.org/t/introducing-crane-composable-and-cacheable-builds-with-cargo/17275/4) |
| [`dream2nix`](https://dream2nix.dev/reference/rust-crane) | Codegen | 1 or 2 | cargo (via `buildRustPackage` or `crane`) | Yes | A framework for unifying 2nix converters across languages (Experimental) |

Explanation for the columns

- **Cargo.lock solution:** How does this solution handle reproducibly determining what crates need to be downloaded from the Cargo.lock file? “Checksum” means it requires you to specify the checksum of all the downloaded dependencies. “Import” means it dynamically imports and parses Cargo.lock from a Nix expression, which means Cargo.lock needs to be present in the same repository as the nix expressions (or IFD must be used). “Codegen” means it generates a .nix file from the Cargo.lock, which is then committed to source control.
- **Derivations:** How many derivations does this solution use to compile Rust code? “1” means the project and all its dependencies are compiled in one derivation. “2” means all dependencies are moved into a separate derivation, so the project can be updated independently, but any change to the set of dependencies rebuilds everything. “Many” means each dependency is built in its own derivation, so changes to dependencies only do the minimal amount of rebuilding necessary (and, ideally, different projects can share dependencies, although I haven’t checked if this works in practice).
- **Build logic:** How does this solution orchestrate building of crates? “Cargo” means it relies on Cargo; `buildRustCrate` means it uses Nixpkgs’ `buildRustCrate`; “custom” means it uses its own custom logic. `buildRustPackage` means it uses Nixpkgs' `buildRustPackage`, which in turn uses Cargo.
- **Supports cross:** Does the solution allow for cross-compilation of crates?

## Shell.nix example

``` nix
{
  pkgs ? import <nixpkgs> { },
}:

pkgs.callPackage (
  {
    mkShell,
    rustc,
    cargo,
    rustPlatform,
    rustfmt,
    clippy,
    rust-analyzer,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [
      rustc
      cargo
      rustfmt
      clippy
      rust-analyzer
    ];

    # Certain Rust tools won't work without this
    # rust-analyzer from nixpkgs does not need this.
    # This can also be fixed by using oxalica/rust-overlay and specifying the rust-src extension
    # See https://discourse.nixos.org/t/rust-src-not-found-and-other-misadventures-of-developing-rust-on-nixos/11570/3?u=samuela. for more details.
    RUST_SRC_PATH = "${rustPlatform.rustLibSrc}";
  }
) { }
```

This will have the stable Rust compiler + the official formatter and linter inside the ephemeral shell. It'll also set the `RUST_SRC_PATH` environment variable to point to the right location, which tools, such as rust-analyzer, require to be set.

### Custom Rust version or targets

``` nix
let
  rustVersion = "latest";
  #rustVersion = "1.62.0";
  rust_overlay = import (
    builtins.fetchTarball "https://github.com/oxalica/rust-overlay/archive/master.tar.gz"
  );
  pkgs = import <nixpkgs> {
    overlays = [
      rust_overlay
      (_: prev: {
        my-rust = prev.rust-bin.stable.${rustVersion}.default.override {
          extensions = [
            "rust-src" # for rust-analyzer
            "rust-analyzer"
          ];
          # Or import nixpkgs with `crossSystem`
          #targets = [ "arm-unknown-linux-gnueabihf" ];
        };
      })
    ];

  };
in
pkgs.callPackage (
  {
    mkShell,
    hello,
    my-rust,
    pkg-config,
    openssl,
  }:
  mkShell {
    strictDeps = true;
    # host/target agnostic programs
    depsBuildBuild = [
      hello
    ];
    # compilers & linkers & dependecy finding programs
    nativeBuildInputs = [
      my-rust
      pkg-config
    ];
    # libraries
    buildInputs = [
      openssl
    ];
    RUST_BACKTRACE = 1;
  }
) { }
```

### VS Code integration

The [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) VS Code extension offers Rust support.

If you get the error `can't load standard library, try installing rust-src`, either configure `RUST_SRC_PATH` as shown above, or set `"rust-analyzer.server.path": "rust-analyzer"` in your VS Code settings to use rust-analyzer from nixpkgs rather than the one bundled with the extension.

You can use the [arrterian.nix-env-selector](https://marketplace.visualstudio.com/items?itemName=arrterian.nix-env-selector) extension to enable your nix-shell inside VSCode and have these settings picked up by other extensions.

## FAQ

### Rust from a rustup toolchain file

``` nix
let
  rust-overlay = builtins.fetchTarball "https://github.com/oxalica/rust-overlay/archive/master.tar.gz";
  pkgs = import <nixpkgs> {
    overlays = [
      (import rust-overlay)
      (_: prev: {
        my-rust-toolchain = prev.rust-bin.fromRustupToolchainFile ./toolchain.toml;
      })
    ];
  };
in
pkgs.callPackage (
  {
    mkShell,
    my-rust-toolchain,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [
      my-rust-toolchain
    ];
  }
) { }
```

From <https://ayats.org/blog/nix-rustup> and <https://github.com/oxalica/rust-overlay?tab=readme-ov-file#cheat-sheet-common-usage-of-rust-bin>

### Building Rust crates that require external system libraries

For example, the `openssl-sys` crate needs the OpenSSL static libraries and searches for the library path with `pkg-config`. That's why you need to have the Nix derivatives `openssl` and `pkg-config` in order to build that crate. You'll need to start a shell providing these packages:

``` shell-session
$ nix-shell -p pkg-config openssl
```

In some cases (eg [here](https://discourse.nixos.org/t/rust-openssl-woes/12340)) you may also need

``` nix
PKG_CONFIG_PATH = "${pkgs.openssl.dev}/lib/pkgconfig";
```

Similarly, the crate `libsqlite3-sys`, e.g. to use and compile the database ORM tool `diesel-cli` with Sqlite support, needs

``` shell-session
$ nix-shell -p pkg-config sqlite
```

Otherwise the following error occurs:

``` text
error: linking with `cc` failed: exit status: 1
...
 = note: /nix/store/kmqs0wll31ylwbqkpmlgbjrn6ny3myik-binutils-2.35.1/bin/ld: cannot find -lsqlite3
          collect2: error: ld returned 1 exit status
```

Note that you need to use a `nix-shell` environment. Installing the Nix packages `openssl` or `sqlite` globally under `systemPackages` in NixOS or in `nix-env` <a href="FAQ/I_installed_a_library_but_my_compiler_is_not_finding_it._Why?" class="wikilink" title=" is discouraged"> is discouraged</a> and doesn't always work (`pkg-config` may not be able to locate the libraries).

### Building with a different Rust version than the one in Nixpkgs

The following uses the [fenix](https://github.com/nix-community/fenix) overlay and `makeRustPlatform` to build a crate with Rust Nightly:

``` nix
{
  inputs = {
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-unstable";
  };

  outputs = { self, fenix, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        defaultPackage = (pkgs.makeRustPlatform {
          inherit (fenix.packages.${system}.minimal) cargo rustc;
        }).buildRustPackage {
          pname = "hello";
          version = "0.1.0";
          src = ./.;
          cargoSha256 = nixpkgs.lib.fakeSha256;
        };
      });
}
```

### Using LLD instead of LD

If you want to use `lld`, then the correct way to do this is to use `pkgs.llvmPackages.bintools`, <em>not</em> `pkgs.lld`. This is because the former uses a wrapper script that correctly sets `rpath`. You can find more information about this [here](https://matklad.github.io/2022/03/14/rpath-or-why-lld-doesnt-work-on-nixos.html).

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
