<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Blip/en -->

<languages/> [Blip](https://blip.net) est une application gratuite de transfert de fichiers rapide et sécurisée qui permet d'envoyer des photos, des vidéos ou des dossiers entiers d'un appareil à un autre sans passer par un serveur cloud

## Essai de blip

``` bash
nix run github:blip-net/nix
```

## Installation

Vous pouvez ajouter Blip de 2 manières à la configuration de votre système.

Ajoutez l'entrée et le module Blip flake, puis reconstruisez votre configuration :

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

## Mise à jour

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
