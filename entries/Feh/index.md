<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Feh -->

[Feh](https://feh.finalrewind.org/) is a simple, fast and lightweight image viewer. It is controlled by configurable mouse and keyboard actions, as well as by command line. Although its interface does not include graphical elements by default, it is possible to add basic information.

It is often used to control the wallpaper in window managers without this feature and offers multiple options for this purpose.

## Installation

It can be installed via the feh package as shown in [search.nixos.org](https://search.nixos.org/packages?type=packages&query=feh)

## Increase supported image types

Since feh is able to open any file supported by the imlib2 library, it is possible to [override](https://nixos.org/guides/nix-pills/nixpkgs-overriding-packages.html#idm140737319606432) the [imlib2](https://search.nixos.org/packages?type=packages&query=imlib2) build argument by [imlib2Full](https://search.nixos.org/packages?type=packages&query=imlib2) to add support for the additional formats heif (.heic), svg, jxl, among others.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
