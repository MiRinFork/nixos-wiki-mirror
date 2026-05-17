<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Man pages -->

Man pages are a form of documentation available on Unix-like systems.

See the [Archwiki](https://wiki.archlinux.org/index.php/Man_page) and [Wikipedia](https://en.wikipedia.org/wiki/Man_page) entries for more information.

## NixOS: Display configuration options

The NixOS option system creates a manpage with all options and their documentation.

``` console
$ man 5 configuration.nix
```

This is a lightweight alternative to the “Configuration Options” page in `nixos-help`. There is also [NixOS options](https://search.nixos.org/options) website

## NixOS: Some man pages are missing

### Development man pages

The “Linux man-pages project” provides a set of documentation of the Linux programming API, mostly section \`3\`. You can access them by adding them to your system packages:

``` nix
environment.systemPackages = [ pkgs.man-pages pkgs.man-pages-posix ];
```

To try it out: `man 3 scanf`.

Libraries and development utilities might provide additional documentation and manpages. You can add those to your system like this:

``` nix
documentation.dev.enable = true;
```

See also: the other options in the \`documentation\` namespace.

## Mandoc as the default man page viewer

Mandoc is a set of tools designed for working with mdoc(7), the preferred roff macro language for BSD manual pages, as well as man(7), the historical roff macro language used in UNIX manuals. It can be used as an alternative to man-db.

To use mandoc as the default man page viewer add following code to your config:

``` nix
documentation.man = {
  # In order to enable to mandoc man-db has to be disabled.
  man-db.enable = false;
  mandoc.enable = true;
};
```

See also: the [Mandoc website](https://mandoc.bsd.lv/).

### Apropos

See <a href="Apropos" class="wikilink" title="Apropos">Apropos</a>.
