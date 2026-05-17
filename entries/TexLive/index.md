<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: TexLive -->

According to <a href="Wikipedia:TeX_Live" class="wikilink" title="Wikipedia">Wikipedia</a>:

  
**TeX Live** is a free software distribution for the <a href="Wikipedia:TeX" class="wikilink" title="TeX">TeX</a> typesetting system that includes major TeX-related programs, macro packages, and fonts.

## Installation

Since TeX Live consist of thousands of packages, to make managing it easier, NixOS replicates the organization of TeX Live into 'schemes' and 'collections'

The following Tex Live schemes are available, inspect `texlive.schemes` for full list:

| Name of TeX Live package | Name of NixOS-derivation | Comment |
|----|----|----|
| Scheme-full | `nixpkgs.texliveFull` | Contains every TeX Live package |
| Scheme-medium | `nixpkgs.texliveMedium` | contains everything in the small scheme + more packages and languages |
| Scheme-small | `nixpkgs.texliveSmall` | contains everything in the basic scheme + xetex, metapost, a few languages. |
| Scheme-basic | `nixpkgs.texliveBasic` | contains everything in the plain scheme but includes latex. |
| Scheme-minimal | `nixpkgs.texliveMinimal` | contains plain only. |
| Scheme-teTeX | `nixpkgs.texliveTeTeX` | contains more than the medium scheme, but nowhere near the full scheme. |
| Scheme-ConTeXt | `nixpkgs.texliveConTeXt` | contains ConTeXt |
| Scheme-GUST | `nixpkgs.texliveGUST` | contains gust |

### Combine Sets

You can install a set with extra packages by using something like

`(texliveMedium.withPackages (ps: with ps;[xifthen ifmtarg framed paralist titlesec]))`

For a minimal set of packages needed for Emacs Orgmode, as described in org-latex-default-packages-alist variable, install these packages:

    { config, pkgs, ... }:
    let
      tex = (pkgs.texliveBasic.withPackages (
        ps: with ps; [
          dvisvgm dvipng # for preview and export as html
          wrapfig amsmath ulem hyperref capt-of
          #(setq org-latex-compiler "lualatex")
          #(setq org-preview-latex-default-process 'dvisvgm)
      ]));
    in
    { # home-manager
      home.packages = with pkgs; [
        tex
      ];
    }

## Adding a custom package

If you have a custom LaTeX package or style file that is not part of the TeXLive distribution, you can add it to the package set like this:

First, create a derivation for your package. The contents of `$out/tex` will later be placed in `texmf/tex`

`latex-corporate-identity = pkgs.stdenvNoCC.mkDerivation {`  
`  name = "latex-corporate-identity";`  
`  src = ./path/to/package/tree;`  
`  installPhase = "cp -r $src $out";`  
`  passthru.tlType = "run";`  
`};`  
  
  
`texlive-corporate-identity = {`  
`  pkgs = [ latex-corporate-identity ];`  
`};`

The directory tree under the path specified as src looks like this:

`└── tex`  
`    └── latex`  
`        └── corporate-identity`  
`            ├── corporate-identity.sty`

You can now add the package to the combined set as you would with any other texlive package:

`tex =(pkgs.texlive.withPackages (`  
`   ps: with ps; [`  
`     texlive-corporate-identity`  
` ]));`

## Troubleshooting

### Missing `lmodern.sty`

If LaTex (perhaps through Pandoc) complains about missing `lmodern.sty`, make sure you have at least `texlive.combined.scheme-medium` installed (-full should work as well; while -small worked for some, but not for all).

### Invalid fontname ‘Latin Modern Roman/ICU’

If you get an error message saying “Invalid fontname ‘Latin Modern Roman/ICU’. . . ”, then you need to add the entry **lmodern** into your configuration in the section **fonts.fonts** and rebuild.

## Further reading

- [The Tex Live Guide 2018](https://www.tug.org/texlive/doc/texlive-en/texlive-en.html)
- <a href="Tex" class="wikilink" title="Tex">Tex</a> in NixOS-Wiki
- [Building LaTeX Documents Reproducibly with Nix Flakes](https://flyx.org/nix-flakes-latex/)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
