<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gram -->

[Gram](https://gram-editor.com/) is a hard fork of <a href="Zed" class="wikilink" title="Zed">Zed</a> removing AI integration and telemetry as well as no user agreement or subscription, among other features. For more on the reasoning for and purpose of the fork see the [mission statement](https://gram-editor.com/docs/mission/). For general Gram information see [the docs](https://gram-editor.com/docs/).

## Installation

Gram is available in `nixpkgs` as . You can add it to system packages with

``` nix
environment.systemPackages = with pkgs; [
  gram
];
```

## Installing Extensions

Gram, unlike Zed, builds extensions locally. This makes getting extensions working on NixOS require some configuration. The two main ways are the <a href="#Adhoc_Method" class="wikilink" title="adhoc method">adhoc method</a>, or using <a href="#Nix-Gram-Extensions" class="wikilink" title="nix-gram-extensions">nix-gram-extensions</a> which currently requires <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> or [hjem](https://hjem.feel-co.org/).

### Adhoc Method

This allows you to use Gram as you'd expect on other distros, able to click Install From URL or Install Local and have Gram compile the extension. This method is definitely more hacky, so if you don't mind managing your extensions with nix, <a href="#Nix-Gram-Extensions" class="wikilink" title="#Nix-Gram-Extensions">#Nix-Gram-Extensions</a> is recommended.

There are a number of known things needed for Gram to successfully compile extensions itself. Aside from <a href="#Nix-ld" class="wikilink" title="#Nix-ld">#Nix-ld</a>, which needs to be enabled in your system configuration, everything else can be installed either to system packages, in a devShell, user packages, home manager packages, etc. All examples are primarily for reference, and as such will only demonstrate installation to system packages. If you want to install using any of the previously listed methods, it should hopefully be fairly simple to translate to your method of choosing.

The known requirements are the following:

- <a href="#Nix-ld" class="wikilink" title="#Nix-ld">#Nix-ld</a>
- <a href="#Clang" class="wikilink" title="#Clang">#Clang</a>
- <a href="#Wasm32-Wasip2_Toolchain" class="wikilink" title="#Wasm32-Wasip2 Rust Toolchain">#Wasm32-Wasip2 Rust Toolchain</a>
- <a href="#Other_Needed_Packages" class="wikilink" title="#Other Needed Packages">#Other Needed Packages</a>

#### Nix-ld

<a href="Nix-ld" class="wikilink" title="Nix-ld">Nix-ld</a> must be enabled on the system. This is because Gram pulls in the [wasi-sdk](https://github.com/WebAssembly/wasi-sdk) for portions of the compilation, and the binaries it pulls are made for normal Linux distributions, meaning the linker path they look for doesn't exist without <a href="Nix-ld" class="wikilink" title="Nix-ld">Nix-ld</a>. Enabling it is as simple as adding the following to your configuration.

``` nix
{
  programs.nix-ld.enable = true;
}
```

#### Clang

must be installed and available under the `cc` alias, which is true as long as the wrapped clang (the ones referred to as ) is the one installed and it is not being overwritten by .

You can verify if clang is configured correctly in your environment by opening Gram's terminal (`` ctrl+` `` or `ctrl+shift+p > terminal panel: toggle`) and running the following

Both should return with a version of .

#### Wasm32-Wasip2 Toolchain

A valid [wasm32-wasip2](https://doc.rust-lang.org/nightly/rustc/platform-support/wasm32-wasip2.html) rust toolchain needs to be installed into your environment. This can be done declaratively with either [fenix](https://github.com/nix-community/fenix) or [rust-overlay](https://github.com/oxalica/rust-overlay). Or you can have Gram install the toolchain itself by installing to your environment. The rustup option is less declarative, but much simpler if that doesn't bother you.

If you've installed with fenix or rust-overlay, you can confirm that it's installed correctly by entering Gram's terminal and running

If in the command's output is a directory named `wasm32-wasip2`, it should be installed correctly and Gram will be able to detect it. If it's listed as `wasm32-unknown-unknown`, see <a href="Gram#Wasm32_Wrong_Target" class="wikilink" title="Gram#Wasm32_Wrong_Target">Gram#Wasm32_Wrong_Target</a>.

##### Rustup

To configure rustup, just run

As whatever user is using Gram to add the stable toolchain as your default to `~/.rustup`.

##### Fenix

This example uses the `latest` branch, but other options are available, just make sure the versions all match across `toolchain` and `target` or `rustc`, `cargo` and `target`.

Add `fenix` to your flake

``` nix
{inputs, pkgs, system, ... }:
  let
    extension-toolchain = with inputs.fenix.packages.${system}; combine [
# full toolchain (not required):
    # latest.toolchain
# minimum required to build:
      latest.rustc
      latest.cargo
# wasm32-wasip2 target (required):
      targets.wasm32-wasip2.latest.rust-std
    ];
  in
{
  environment.systemPackages = with pkgs; [
    clang
    extension-toolchain
  ];
}
```

##### Rust-Overlay

Like the fenix example, this assumes the `latest` branch, though rust-overlay provides others.

Add `rust-overlay` to your flake

``` nix
{ inputs, pkgs, ... }:
{
  nixpkgs.overlays = [ inputs.rust-overlay.overlays.default ];
  environment.systemPackages = with pkgs; [
# full toolchain (not required):
    # (rust-bin.stable.latest.default.override { targets = [ "wasm32-wasip2" ]; })
# minimum required to build:
    (rust-bin.stable.latest.minimal.override { targets = [ "wasm32-wasip2" ]; })
  ];
}
```

#### Other Needed Packages

- 

### Nix-Gram-Extensions

`nix-gram-extensions` is a project to bring declarative management of Gram extensions to Nix using custom builders and integration with <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> and [hjem](https://hjem.feel-co.org/). It is hosted on [codeberg](https://codeberg.org/niklaskorz/nix-gram-extensions) and [tangled](https://tangled.org/niklaskorz.eu/nix-gram-extensions). If you want to install it to your system, it has a detailed section on installation in its [README](https://codeberg.org/niklaskorz/nix-gram-extensions#installation). More information can be found at its [discourse announcement](https://discourse.nixos.org/t/gram-extensions-the-nix-way/79024).

### More About Extensions

- [NixOS Discourse: Fail To Add Extensions To Gram](https://discourse.nixos.org/t/fail-to-add-extensions-to-gram/78466)

## Troubleshooting

### Extensions

#### Wasm32 Wrong Target

If the wasm32 target is listed as `wasm32-unknown-unknown`, Gram will be unable to detect it and if rustup isn't installed it will error with `` failed to run `rustup target add`: no such file or directory ``, because when it doesn't detect an installed valid toolchain, it tries to install one with [rustup](https://doc.rust-lang.org/stable/book/ch01-01-installation.html?highlight=rustup#installing-rustup-on-linux-or-macos). This has happened on fenix's stable branch and was fixed by changing to the `latest` branch.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>
