<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Telegram -->

Telegram is a cloud-based mobile and desktop messaging app with a focus on security.

## Installation

The telegram desktop client can be installed with the `telegram-desktop` package.

``` nix
environment.systemPackages = with pkgs; [ telegram-desktop ];
```

It can then be run as `telegram-desktop`

### Alternative clients

Nixpkgs also has [AyuGram](https://github.com/AyuGram/AyuGramDesktop)which can be installed via: `ayugram-desktop`

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
