<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dioxus -->

[Dioxus](https://dioxuslabs.com) is a full-stack <a href="Rust" class="wikilink" title="Rust">Rust</a> app framework for web, desktop, mobile, and more.

### Troubleshooting

#### *wasm-bindgen* mismatch

**Note:** As of Nixpkgs 25.11, the *wasm-bindgen-cli* is automatically bundled with the correct version when using *dioxus-cli*, so the workarounds described below are no longer necessary.

A common issue when using the *dioxus-cli* version from Nixpkgs is encountering the following error:

``` text
it looks like the Rust project used to create this Wasm file was linked against
version of wasm-bindgen that uses a different bindgen format than this binary:

  rust Wasm file schema version: 0.2.99
     this binary schema version: 0.2.97
```

##### Why does this happen?

Unlike most Rust crates, *wasm-bindgen* doesn't follow [semantic versioning (SemVer)](https://semver.org). This means even a patch version difference (like 0.2.97 vs 0.2.98) can contain breaking changes or incompatibilities.

When you install *dioxus-cli* from Nixpkgs, it uses the exact versions of dependencies specified in the packages lock file, just like running `cargo install dioxus-cli --locked`. The versions present in the packages lock file are chosen **at publishing time**.

When you add *dioxus* as a dependency in your project's *Cargo.toml* (or any other crate that requires on *wasm-bindgen*), [Cargo assumes that all dependencies follow SemVer](https://doc.rust-lang.org/cargo/reference/resolver.html#semver-compatibility), and pulls in the latest SemVer compatible version of *wasm-bindgen.* This will likely be a different version than was present in the *dioxus-cli* lock file, since *wasm-bindgen* tends to release quite often.

There are two solutions to solving this:

1.  Pin *wasm-bindgen* to the version that *dioxus-cli* expects.
2.  Update *dioxus-cli* to use a newer lock file.

##### Pin *wasm-bindgen*

Within your *Cargo.toml* file, force *wasm-bindgen* to use the expected version by pinning it.

``` toml
[dependencies]
wasm-bindgen = "=0.2.97"
```

Run *cargo update*, and you should see the version being downgraded.

``` text
Downgrading wasm-bindgen v0.2.99 -> v0.2.97 (available: v0.2.99)
```

##### Updating lock file

If you can't downgrade, you can instead manually update the lock file.

Download the source from [crates.io](https://crates.io/crates/dioxus-cli) for the given version of the CLI.

e.g. <https://crates.io/api/v1/crates/dioxus-cli/0.6.0/download>

Extract the file, `cd` into the directory, and run `cargo update`. You should be able to see the *wasm-bindgen* version being updated.

    Updating wasm-bindgen v0.2.97 -> v0.2.99

Copy the newly updated lock file into your project (here called *Dioxus.lock*), and override the Nixpkgs version.

``` nix
dioxus-cli = pkgs.dioxus-cli.overrideAttrs (_: {
  postPatch = ''
    rm Cargo.lock
    cp ${./Dioxus.lock} Cargo.lock
  '';

  cargoDeps = pkgs.rustPlatform.importCargoLock {
    lockFile = ./Dioxus.lock;
  };
});
```

#### Choosing *wasm-bindgen-cli* version

You will also want to ensure the version of *wasm-bindgen-cli* matches whatever is in your lock file.

``` nix
cargoLock = builtins.fromTOML (builtins.readFile ./Cargo.lock);

wasmBindgen = pkgs.lib.findFirst
  (pkg: pkg.name == "wasm-bindgen")
  (throw "Could not find wasm-bindgen package")
  cargoLock.package;

wasm-bindgen-cli = pkgs.buildWasmBindgenCli rec {
  src = pkgs.fetchCrate {
    pname = "wasm-bindgen-cli";
    version = wasmBindgen.version;
    hash = pkgs.lib.fakeHash;
  };

  cargoDeps = pkgs.rustPlatform.fetchCargoVendor {
    inherit src;
    inherit (src) pname version;
    hash = pkgs.lib.fakeHash;
  };
};
```

**Example flake.nix**

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

    # For installing non-standard rustc versions
    rust-overlay.url = "github:oxalica/rust-overlay";
    rust-overlay.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = {
    self,
    rust-overlay,
    nixpkgs,
  }:
  {
    devShells.x86_64-linux.default = let
      pkgs = import nixpkgs {
        system = "x86_64-linux";
        overlays = [
          rust-overlay.overlays.default
        ];
      };

      rustShellToolchain = (pkgs.rust-bin.selectLatestNightlyWith (t: t.default)).override {
        extensions = ["rust-src" "rust-analyzer"];
        targets = [ "wasm32-unknown-unknown" ];
      };

      dioxus-cli = pkgs.dioxus-cli.overrideAttrs (_: {
        postPatch = ''
          rm Cargo.lock
          cp ${./Dioxus.lock} Cargo.lock
        '';

        cargoDeps = pkgs.rustPlatform.importCargoLock {
          lockFile = ./Dioxus.lock;
        };
      });

      cargoLock = builtins.fromTOML (builtins.readFile ./Cargo.lock);

      wasmBindgen = pkgs.lib.findFirst
        (pkg: pkg.name == "wasm-bindgen")
        (throw "Could not find wasm-bindgen package")
        cargoLock.package;

      wasm-bindgen-cli = pkgs.buildWasmBindgenCli rec {
        src = pkgs.fetchCrate {
          pname = "wasm-bindgen-cli";
          version = wasmBindgen.version;
          hash = "sha256-txpbTzlrPSEktyT9kSpw4RXQoiSZHm9t3VxeRn//9JI=";
        };

        cargoDeps = pkgs.rustPlatform.fetchCargoVendor {
          inherit src;
          inherit (src) pname version;
          hash = "sha256-J+F9SqTpH3T0MbvlNKVyKnMachgn8UXeoTF0Pk3Xtnc=";
        };
      };
    in
      pkgs.mkShell {
        name = "dioxus";
        packages = [ rustShellToolchain dioxus-cli wasm-bindgen-cli ];
    };
  };
}
```

<a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
