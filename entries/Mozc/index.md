<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mozc -->

Mozc is a Japanese input method editor (IME) originated from Google Japanese Input.

Currently nixpkgs contains 2 variants:

- <strong>Mozc</strong> which is vanilla ( and )
- <strong>Mozc UT</strong> which has enhanced dictionaries ( and )

## Installation

### Fcitx5

See <a href="Fcitx5" class="wikilink" title="Fcitx5">Fcitx5</a> for further information.

``` nix
i18n.inputMethod = {
  enable = true;
  type = "fcitx5";
  fcitx5.addons = with pkgs; [ 
    # fcitx5-mozc
    fcitx5-mozc-ut
    fcitx5-gtk 
  ];
};
```

### IBus

See <a href="IBus" class="wikilink" title="IBus">IBus</a> for further information.

``` nix
i18n.inputMethod = {
  enable = true;
  type = "ibus";
  ibus.engines = with pkgs.ibus-engines; [ 
    # mozc
    mozc-ut
  ];
};
```
