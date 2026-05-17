<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zim -->

[Zim](https://zim-wiki.org/) is a desktop note-taking application.

## Installation

Zim can be installed from the `zim` package.

## Plugins

Zim [bundles many plugins](https://zim-wiki.org/manual/Plugins.html) by default.

### Installing unbundled plugins

Plugins not included with Zim can be installed into `~/.local/share/zim/plugins`.

For example, here is how you would install the [`zim-auto-linker`](https://github.com/auralluring/zim-auto-linker) plugin with <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

``` nix
{ pkgs, ... }:
{
  xdg.dataDir."zim/plugins/zim-auto-linker".source = pkgs.fetchFromGitHub {
    owner = "auralluring";
    repo = "zim-auto-linker";
    rev = "abcdefg1234"; # FIXME: replace with actual value
    hash = pkgs.lib.fakeHash; # FIXME: replace with actual value
  };
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Note_taking" class="wikilink" title="Category:Note taking">Category:Note taking</a>
