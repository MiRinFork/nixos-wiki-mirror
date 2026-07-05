<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gram -->

[Gram](https://gram-editor.com/) is a hard fork of <a href="Zed" class="wikilink" title="Zed">Zed</a> removing AI integration and telemetry as well as no user agreement or subscription, among other features. For more on the reasoning for and purpose of the fork see the [mission statement](https://gram-editor.com/docs/mission/).

## Installation

Gram is available in `nixpkgs` as .

## Configuration

### Installing Extensions

Gram, unlike Zed, builds extensions locally. This means it needs a Rust WASI Toolchain and `clang` available to it while installing them. Currently, the easiest way to do this is using something like [nix-community/fenix](https://github.com/nix-community/fenix) (the same should be able to be done with [rust-overlay](https://github.com/oxalica/rust-overlay)).

Add `fenix` to your flake

The examples all use the stable version attribute set, but any provided by `fenix` should work.

You should be able to copy & paste the `let in` statement with any of the usage examples below (unless otherwise specified) into a nix module of the appropriate type (`homeManager`, `nixos`, `devShell`). Note that the `devShell` examples will only work if you launch Gram from in the shell.

#### Let In Statement

``` nix
{inputs, pkgs, system, ... }:
  let
    # full toolchain:
    /*
    extension-toolchain = with inputs.fenix.packages.${system}; combine [
      stable.toolchain
      targets.wasm32-wasip2.stable.rust-std
    ];
    */
    # minimum required to build:
    extension-toolchain = with inputs.fenix.packages.${system}; combine [
      stable.rustc
      stable.cargo
      targets.wasm32-wasip2.stable.rust-std
    ];
  in
```

#### HomeManager Packages

``` nix
{
  home.packages = with pkgs; [
    clang
    extension-toolchain
  ];
}
```

#### NixOS Packages

``` nix
{
  environment.systemPackages = with pkgs; [
    clang
    extension-toolchain
  ];
}
```

#### devShell

``` nix
{
  packages = with pkgs; [
    clang
    extension-toolchain
  ];
}
```

#### Flake Parts devShell

If using flake parts, devShells need to have their inputs passed to them by `perSystem` rather than as a top-level attribute. The file paths are only examples and can be replaced to fit the structure of your project.

#### More About Extensions

- [NixOS Discourse: Fail To Add Extensions To Gram](https://discourse.nixos.org/t/fail-to-add-extensions-to-gram/78466/2)
- <a href="Talk:Gram#Using_Rustup_for_Building_Extensions" class="wikilink" title="Talk:Gram#Using_Rustup_for_Building_Extensions">Talk:Gram#Using_Rustup_for_Building_Extensions</a>
