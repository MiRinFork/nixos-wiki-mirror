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

Gram, unlike Zed, builds extensions locally. This makes installing extensions on NixOS require some setup. There are multiple ways to handle extensions, in no particular order:

- <a href="#System_Method" class="wikilink" title="System Method">System Method</a>: if you don't mind modifying your system configuration, requires <a href="Nix-ld" class="wikilink" title="Nix-ld">Nix-ld</a>.
- <a href="#Nix-Gram-Extensions" class="wikilink" title="Nix-Gram-Extensions">Nix-Gram-Extensions</a>: if you want to manage extensions with <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> or [hjem](https://hjem.feel-co.org/)
- <a href="#Temp_FHS_Environment" class="wikilink" title="Temp FHS Environment">Temp FHS Environment</a>: if you don't want to modify your system. Includes full copy-pastable example.

### System Method

This allows you to use Gram as you'd expect on other distros, able to click Install From URL or Install Local and have Gram compile the extension. This method is a bit hacky, and requires some setup.

There are a number of known things needed for Gram to successfully compile extensions itself. Aside from <a href="#Nix-ld" class="wikilink" title="#Nix-ld">#Nix-ld</a>, which needs to be enabled in your system configuration, everything else can be installed either to system packages, in a devShell, user packages, home manager packages, etc. All examples are primarily for reference, and will only demonstrate installation to system packages. If you want to install using any of the previously listed methods, it should hopefully be fairly simple to translate to your method of choosing.

The known requirements are the following:

- <a href="#Nix-ld" class="wikilink" title="#Nix-ld">#Nix-ld</a>
- <a href="#Clang" class="wikilink" title="#Clang">#Clang</a>
- <a href="#Rust_Wasm32-Wasip2" class="wikilink" title="#Wasm32-Wasip2 Rust Toolchain">#Wasm32-Wasip2 Rust Toolchain</a>
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

#### Rust Wasm32-Wasip2

A valid [wasm32-wasip2](https://doc.rust-lang.org/nightly/rustc/platform-support/wasm32-wasip2.html) rust toolchain needs to be installed into your environment.

This can be done declaratively with either <a href="#Fenix" class="wikilink" title="#Fenix">#Fenix</a> or <a href="#Rust-Overlay" class="wikilink" title="#Rust-Overlay">#Rust-Overlay</a>. Or you can have Gram install the toolchain itself by installing <a href="#Rustup" class="wikilink" title="#Rustup">#Rustup</a> to your environment.

The <a href="#Rustup" class="wikilink" title="#Rustup">#Rustup</a> option is less declarative, but much simpler if that doesn't bother you.

If you've installed with fenix or rust-overlay, you can confirm that it's installed correctly by entering Gram's terminal and running

If in the command's output is a directory named `wasm32-wasip2`, it should be installed correctly and Gram will be able to detect it. If it's listed as `wasm32-unknown-unknown`, see <a href="Gram#Wasm32_Wrong_Target" class="wikilink" title="Wasm32 Wrong Target">Wasm32 Wrong Target</a>.

##### Rustup

To configure , just run

As whatever user is using Gram to add the stable toolchain as your default to `~/.rustup`.

##### Fenix

This example uses the `latest` branch, but other options are available, just make sure the versions all match across `toolchain` and `targets` or `rustc`, `cargo` and `targets`.

Add [fenix](https://github.com/nix-community/fenix) to your flake

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

Add [rust-overlay](https://github.com/oxalica/rust-overlay) to your flake

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

Nix-Gram-Extensions is a project to bring declarative management of Gram extensions to Nix using custom builders and integration with <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> and [hjem](https://hjem.feel-co.org/). It is hosted on [codeberg](https://codeberg.org/niklaskorz/nix-gram-extensions) and [tangled](https://tangled.org/niklaskorz.eu/nix-gram-extensions). If you want to install it to your system, it has a detailed section on installation in its [README](https://codeberg.org/niklaskorz/nix-gram-extensions#installation). More information can be found at its [discourse announcement](https://discourse.nixos.org/t/gram-extensions-the-nix-way/79024).

### Temp FHS Environment

If you do not want to or cannot enable <a href="Nix-ld" class="wikilink" title="Nix-ld">Nix-ld</a>, you can make a temporary FHS Environment and run Gram in there to build extensions. Provided below are an example `flake.nix` and `shell.nix`. Just add these files to a directory, enter it and run `nix develop`. Then, once you're dropped into the environment's shell, run `gram` and install your extensions as you would on any other distro. Once they're built, you can run Gram outside of that environment too and they should just work.

And of course, if you prefer <a href="#Fenix" class="wikilink" title="#Fenix">#Fenix</a> or <a href="#Rustup" class="wikilink" title="#Rustup">#Rustup</a>, you can modify this example to use them instead of <a href="#Rust-Overlay" class="wikilink" title="#Rust-Overlay">#Rust-Overlay</a>.

### More About Extensions

- [NixOS Discourse: Fail To Add Extensions To Gram](https://discourse.nixos.org/t/fail-to-add-extensions-to-gram/78466)

## Troubleshooting

### Extensions

#### Wasm32 Wrong Target

If the wasm32 target is listed as `wasm32-unknown-unknown`, Gram will be unable to detect it and if rustup isn't installed it will error with `` failed to run `rustup target add`: no such file or directory ``, because when it doesn't detect an installed valid toolchain, it tries to install one with [rustup](https://doc.rust-lang.org/stable/book/ch01-01-installation.html?highlight=rustup#installing-rustup-on-linux-or-macos). This has happened on fenix's stable branch and was fixed by changing to the `latest` branch.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>
