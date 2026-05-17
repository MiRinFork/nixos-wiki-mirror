<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gn -->

Gn is a build tool by Google

## Gn package

<https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/gn/gn>

## Packages built with Gn

can be found by

    cd nixpkgs/pkgs
    grep -r -F '"https://gn.googlesource.com/gn"'

because usually, Gn version is pinned with `gn.overrideAttrs`

### nixpkgs status: source build

#### v8

<https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/libraries/v8>

#### skia

<https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/sk/skia-aseprite/package.nix>

#### chromium

<https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/networking/browsers/chromium>

gn is pinned as gnChromium in default.nix

### nixpkgs status: binary build

#### electron

<https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/tools/electron>

<https://github.com/NixOS/nixpkgs/issues/17073> - request to build electron from source

#### flutter

<https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/compilers/flutter>

<https://github.com/NixOS/nixpkgs/issues/201574> - request to build flutter from source

## See also

- <https://github.com/input-output-hk/gclient2nix> - abandoned draft, gn.nix is missing

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
