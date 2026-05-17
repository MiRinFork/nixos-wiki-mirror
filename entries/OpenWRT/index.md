<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenWRT -->

[OpenWrt](https://openwrt.org/) is an open-source project for embedded operating systems based on Linux, primarily used on embedded devices to route network traffic. The main components are Linux, util-linux, musl, and BusyBox. All components have been optimized to be small enough to fit into the limited storage and memory available in home routers. (Source: <https://en.wikipedia.org/wiki/OpenWrt>)

## ImageBuilder

OpenWRT provides different possibilities (https://openwrt.org/docs/guide-developer/imagebuilder_frontends) to build custom images for your devices. There is also a little helper tool suggested on IRC called "autobuild" (https://johannes.truschnigg.info/code/openwrt_autobuild/) which helps to manage/keep track of image-configurations for your devices. It's also working with the nix-shell below - **please note** that there is currently some misbehavior when "make_clean" is set to "True" the system says build is triggered but there are no files/logs/processes running then.

### Using ImageBuilder in nix-shell

Get a copy of: <https://github.com/nix-community/nix-environments/blob/master/envs/openwrt/shell.nix>

Currently (01/2022) I've tested builds using nixpkgs-21.11 and unstable, and both worked. This could possibly break/behave different in the future so you can e.g. pin to an older nixpkgs-revision by replacing the first lines of the above code with this:

``` nix
{ opkgs ? import <nixpkgs> {} }:                           
                                                           
let                                                        
  pkgs = import (opkgs.fetchFromGitHub {                   
    owner = "NixOS";
    repo = "nixpkgs";            
    rev = "<revision>";      
    sha256 = "<hash>";                                                   
  }) {};
...
```

### Using ImageBuilder in a Nix Derivation

See <https://github.com/astro/nix-openwrt-imagebuilder/>

## OpenWRT buildroot

It is possible to build OpenWRT from source with buildroot under NixOS too.

You can use the following dev shell with the official OpenWRT build guide:

- <https://openwrt.org/docs/guide-developer/toolchain/use-buildsystem>

Make sure you disable the nixpkgs compiler hardening, as the OpenWRT toolchain sources aren't as clean as required by nixpkgs defaults.

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs = { self, nixpkgs, ... }: {
    devShells."x86_64-linux".default = let
      pkgs = import nixpkgs {
        system = "x86_64-linux";
      };
    in pkgs.mkShell {
      nativeBuildInputs = with pkgs; [
        git
        pkg-config
        ncurses
        unzip
        (python3.withPackages (ps: [ps.setuptools]))
        cdrtools
        swig
      ];
      hardeningDisable = [ "all" ];
    };
  };
}
```

## Declarative Configuration

Dewclaw, a semi-declarative OpenWrt configuration tool, allows building configs for OpenWRT ([announcement](https://discourse.nixos.org/t/dewclaw-semi-declarative-openwrt-configurations/33993)). It works by mapping UCI configuration options to Nix. The original project has been picked up and now can be found here: <https://github.com/MakiseKurisu/dewclaw>.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
