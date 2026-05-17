<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Inkscape -->

[Inkscape](https://inkscape.org) is a graphical editor for vector images.

## Installation

Inkscape can be installed by adding it to the systemPackages:

## Configuration

### Plugins/Extensions

Inkscape supports various plugins, which are packages separately in NixOS.

To install only a subset of the available plugins, use inkscape-with-extensions with an override. The example below installs inkscape with only the inkstitch extension:

All plugins can be installed by setting `inkscapeExtensions` to `null`.

Available extensions can be found by [looking them up in nixpkgs](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=inkscape-extensions)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
