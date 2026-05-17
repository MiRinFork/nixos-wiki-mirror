<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Waybar -->

[Waybar](https://github.com/Alexays/Waybar) is a highly customizable Wayland bar.

## Installation

Waybar can be installed from both configuration.nix and <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

## Configuration

Waybar can be configured using options found on the <a href="Home_Manager" class="wikilink" title="Home Manager Appendix">Home Manager Appendix</a>. You can also find configuration options under [home-manager/options/programs/waybar](https://mynixos.com/home-manager/options/programs.waybar) on [mynixos](https://mynixos.com/).

Alternatively, you may configure using JSONC (and CSS) file(s) by:

Please refer to [the default configuration (config.jsonc and style.css)](https://github.com/Alexays/Waybar/tree/master/resources) and [wiki](https://github.com/Alexays/Waybar/wiki/Configuration) for further information on configuration.

## Troubleshooting

### Icon Fonts Missing

The default configuration uses `FontAwesome` font, which is only available in , not in , , , etc.

You may simply install

or edit `style.css` to use your prefered font (e.g. ):

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
