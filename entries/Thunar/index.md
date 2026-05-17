<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Thunar -->

[Thunar](https://docs.xfce.org/xfce/thunar/start) is a GTK file manager originally made for <a href="Xfce" class="wikilink" title="Xfce">Xfce</a>.

## Installation

Thunar will automatically be installed by <a href="Xfce#Enabling" class="wikilink" title=" enabling Xfce"> enabling Xfce</a>.

If you want to install Thunar standalone, add to your `configuration.nix`:

``` nix
programs.thunar.enable = true;
```

## Configuration

If xfce is not used as desktop and therefore `xfconf` is not enabled, preference changes are discarded. In that case enable the `xfconf` program manually to be able to save preferences:

``` nix
programs.xfconf.enable = true;
```

### Plugins

You can add plugins by including them in `programs.thunar.plugins` to your `configuration.nix`. For example:

``` nix
programs.thunar.plugins = with pkgs.xfce; [
  thunar-archive-plugin # Requires an Archive manager like file-roller, ark, etc
  thunar-volman
];
```

### Other functionalities

You can extend Thunar's functionalities by adding to your `configuration.nix`:

``` nix
services.gvfs.enable = true; # Mount, trash, and other functionalities
services.tumbler.enable = true; # Thumbnail support for images
```

You can extend Thunar's support to other file formats by adding more packages to `environment.systemPackages`. See [here](https://wiki.archlinux.org/title/File_manager_functionality#Thumbnail_previews) for a list (the names may not match 1:1).

## See also

- <a href="PCManFM" class="wikilink" title="PCManFM">PCManFM</a>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>
