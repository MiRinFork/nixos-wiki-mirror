<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Platformio -->

[PlatformIO](https://platformio.org/) is a SDK/toolchain manager for various microcontrollers and and embedded platforms i.e. esp32.

## Basic development environment

``` nix
{ pkgs ? import <nixpkgs> {} }:
let
in
  pkgs.mkShell {
    buildInputs = with pkgs; [
      platformio
      # optional: needed as a programmer i.e. for esp32
      avrdude
    ];
}
```

## NixOS

Add the required udev rules.

``` nix
{
  services.udev.packages = with pkgs; [ 
    platformio-core.udev
    openocd
  ];
}
```

## Use in vscode

To use the nix-shell provided PlatformIO rather the builtin one first open `vscode` within the nix-shell and also modify it's `settings.json` to also contain the following line:

``` json
{
      "platformio-ide.useBuiltinPIOCore": false,
}
```

[As of PlatformIO IDE 2.0.0](https://discourse.nixos.org/t/how-to-use-platformio-with-vscode/15805/3), <s>you will need a shell that allows the extension to run “python -m platformio” ([\#237313](https://github.com/NixOS/nixpkgs/pull/237313))</s>:

Recently (2024?) simply building an FHS shell with the referred `nixpkgs` commit doesn't work anymore. The modification is probably incompatible with newer `nixpkgs`.

There's a quick&dirty fix available as a `flake` `devShell`. For usage with `direnv` (recommended), make an `.envrc` in your project dir like this:

``` bash
#!/usr/bin/env bash

PRJROOT="$(git rev-parse --show-toplevel)"
FLAKE=github:ppenguin/nixenvs

# avoid a "load loop" of direnv when the new fhs env is entered
# https://github.com/direnv/direnv/issues/992
if [ -z "$IN_NIX_SHELL" ]; then
    use flake $FLAKE\#pio-arduino-fhs
fi

export PRJROOT
```

This will start a the `devShell` defined here: <https://github.com/ppenguin/nixenvs/blob/main/dev/devshell-pio-arduino-fhs.nix>, which includes a working update of the `platformio` `python` module for `nixpkgs`.

## See also

- [Platformio permission denied\[13](https://github.com/NixOS/nixpkgs/issues/224895)\]

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
