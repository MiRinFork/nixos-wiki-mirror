<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mango -->

[Mango](https://mangowm.github.io/) is a lightweight, modern <a href="Wayland" class="wikilink" title="Wayland">Wayland</a> compositor based on [dwl](https://codeberg.org/dwl/dwl). Mango provides features like animations, IPC, different layouts and visual effects.

## Installation

If you don't want to configure mango using nix, you can just add mango to your systemPackages:

If you would like to configure mango declaratively using nix and home-manager, you should install the [official flake](https://mangowm.github.io/docs/installation#nixos). Add it to your inputs:

## Configuration

After adding the new input, mango can be configured using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

Extra documentation can be found on the [official website](https://mangowm.github.io/docs/nix-options).

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
