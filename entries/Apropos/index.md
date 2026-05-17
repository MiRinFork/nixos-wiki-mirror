<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Apropos -->

By default as of NixOS 21.05, `apropos`, `whatis` and `man -k` do not find anything when run, because the man page index cache is not generated.

To build the cache automatically, you can set this in your system configuration:

``` nix
{
  documentation.man.cache.enable = true;
}
```

Or in older versions:

``` nix
{
  documentation.man.generateCaches = true;
}
```

This will create an immutable cache in sync with `environment.systemPackages`. Since it is immutable, the `mandb` command (see below) will fail.

If you are using home-manager, the above will not populate the cache with the programs installed that way, instead add this to your `home.nix`:

``` nix
{
  programs.man.generateCaches = true;
}
```

Some programs might set one of these options to true by default, in that case you might still need to set the other to true manually. An example of such a program is <a href="fish" class="wikilink" title="fish">fish</a>, which uses it to automatically create completions (see \[fish_update_completions\](https://fishshell.com/docs/current/cmds/fish_update_completions.html)).

To generate it manually, run:

``` console
$ sudo mkdir -p /var/cache/man/nixos
$ sudo mandb
```

This will need to be re-run to update the cache when new software is installed.

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
