<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Blip -->

<languages/> [Blip](https://blip.net) <translate> is a free, fast, and secure file transfer application that allows you to send photos, videos, or entire folders from one device to another without going through a cloud server. </translate> <translate>

## Blip test

</translate>

``` bash
nix run github:blip-net/nix
```

<translate>

## Setup

You can add Blip to your system configuration in two ways.

Add the input and the Blip flake module, then rebuild your configuration: </translate>

``` nix
# Flake inputs
inputs.blip.url = "github:blip-net/nix";

# NixOS configuration
imports = [ blip.nixosModules.default ];
programs.blip.enable = true;
```

Home Manager

``` nix
# Flake inputs
inputs.blip.url = "github:blip-net/nix";

# Home Manager configuration
imports = [ blip.homeModules.default ];
programs.blip.enable = true;
```

<translate>

## Update

</translate>

``` bash
nix flake update blip
```

``` nix
xdg.portal = {
    enable = true;
    extraPortals = [ pkgs.xdg-desktop-portal-gtk ];
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
