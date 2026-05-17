<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Faust -->

[Faust](https://faust.grame.fr) (Functional Audio Stream) is a functional programming language specifically designed for real-time signal processing and synthesis.

## Faust in NixOS 22.05

NixOS 22.05 contains Faust version 2.40.0.

If you want to use the alsa-qt architecture, you need to apply an upstream patch, because the architecture file as provided in this version does not compile.

Simply add the following <a href="Overlays" class="wikilink" title="overlay">overlay</a>:

``` nix
final: prev: {
  faust = prev.faust.overrideAttrs (old: {
    patches = (old.patches or [ ]) ++ [
      (prev.fetchpatch {
        url =
          "https://github.com/grame-cncm/faust/commit/cf80f4c94ac979922892a7f594121358cd178708.patch";
        sha256 = "sha256-MMFgCzAT33kwnBGvydyoqxJmMjWpxyF9Okjk1rMmrcw=";
      })
    ];
  });
};
```

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
