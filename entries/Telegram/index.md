<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Telegram -->

Telegram is a cloud-based mobile and desktop messaging app with a focus on security.

## Installation

The telegram desktop client can be installed with the `telegram-desktop` package.

``` nix
environment.systemPackages = with pkgs; [ telegram-desktop ];
```

It can then be run as `Telegram`

### Alternative clients

Nixpkgs also has [AyuGram](https://github.com/AyuGram/AyuGramDesktop) which can be installed via: `ayugram-desktop`

## Bridges

### Matrix

Nixos supports `mautrix-telegram`, the bridge between Telegram and <a href="Matrix" class="wikilink" title="Matrix">Matrix</a>.

``` nix
services.mautrix-telegram.enable = true;
```

## Troubleshooting

### Incorrect file picker

The error occurs as a result of incorrect use of the <a href="Qt" class="wikilink" title="Qt">Qt</a> theme. To fix this behaviour, set `platformTheme` as `gtk3`.

``` nix
qt = {
    enable = true;
    platformTheme = "gtk3";
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
