<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Console Fonts -->

It is possible to change the <a href="fonts" class="wikilink" title="fonts">fonts</a> used by the Linux console. The common fonts used by GUI applications cannot be used in the console. Instead, special console-specific fonts must be used. NixOS includes several such console fonts - links to them can be found in `/etc/static/kbd/consolefonts`.

### Setting console font temporarily

The command `setfont `<file-path> can change the console font temporarily. For example:

``` bash
setfont /etc/static/kbd/consolefonts/Lat2-Terminus16.psfu.gz
```

The command `showconsolefont` will generate a grid displaying the characters in the current font.

Note that both of these commands will only work in a TTY; they will not function in a terminal emulator.

### Setting console font via configuration.nix

A console font can be set permanently via the option `console.font` in your `configuration.nix`:

``` nixos
console.font = "Lat2-Terminus16";
```

In this option, use simply the filename of the font, without the path or file extensions.

#### Setting fonts via full path

Note: while it is possible to use the full path of a font for this option (e.g `/home/user/my-font.psfu.gz`), the font setting process cannot follow symlinks. So, for example, the following option would fail:

``` nixos
console.font = "/etc/static/kbd/consolefonts/Lat2-Terminus16.psfu.gz";
```

In order to use the direct path of a file found in this directory, the following would be necessary:

``` nixos
console.font = "${pkgs.kbd}/share/consolefonts/Lat2-Terminus16.psfu.gz";
```

The console fonts included in NixOS are provided by `pkgs.kbd`, which should be included by default.

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a> <a href="Category:CLI" class="wikilink" title="Category:CLI">Category:CLI</a> <a href="Category:Fonts" class="wikilink" title="Category:Fonts">Category:Fonts</a> <a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
