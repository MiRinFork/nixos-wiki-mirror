<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tex -->

According to <a href="Wikipedia:TeX" class="wikilink" title="Wikipedia">Wikipedia</a>:

  
**TeX** \[...\]is a typesetting system which was designed and mostly written by Donald Knuth and released in 1978. TeX is a popular means of typesetting complex mathematical formulae; it has been noted as one of the most sophisticated digital typographical systems.

Nixpkgs provides a variety of different (and partially complementing) packages to allow the compilation of TeX-documents. Most prominently, the <a href="TexLive" class="wikilink" title="TexLive">TexLive</a> distribution (In Oct 2020 version 2019) is included that contains many of the packages that are hosted as part of the [Comprehensive TeX Archive Network (CTAN)](https://www.ctan.org).

## Getting started

TeX-documents are not What-you-see-is-what-you-get, but written in plain text, containing tags, commands and functions that instruct the TeX-engine how to lay out the text (or figures or anything else) on the page.

``` bash
$ cat > minimal.tex <<EOF
\documentclass{article}
\begin{document}
Hello, Nix.
\end{document}
EOF
```

The Nixpkgs-repository contains several TeX-compilers that have different advantages and disadvantages, support various output formats, encodings and have varying degrees of extensibility.

For the sake of this text we will assume that you you want to create a PDF from your TeX-source.

A good starting point is to install the TeX-Live basic setup:

``` console
$ nix-env -iA nixpkgs.texlive.combined.scheme-basic
```

After installation, the command `pdflatex` should be available. Save the minimal example above in a file called minimal.tex and compile it with `pdflatex minimal.tex`

The (pretty verbose) output will look similar to:

``` console
$ pdflatex minimal.tex
This is pdfTeX, Version 3.14159265-2.6-1.40.21 (TeX Live 2019/NixOS.org)
entering extended mode
(minimal.tex
LaTeX2e <2020-02-02> patch level 5
L3 programming layer <2020-05-14> (.../tex/latex/base\article.cls
Document Class: article 2019/12/20 v1.4l Standard LaTeX document class
(.../tex/latex/base\size10.clo))
(.../tex/latex/l3backend\l3backend-pdfmode.def)
No file minimal.aux.
[1{.../pdftex/config/pdftex.map}]
(minimal.aux) )<.../fonts/type1/public/amsfonts/cm/cmr10.pfb>
Output written on minimal.pdf (1 page, 12502 bytes).
Transcript written on minimal.log.
```

Well done, you created your first PDF document on Nixos using TeX.

## Next steps

From here on, we will assume that the "Full" scheme is installed.

Let's fetch an a little more complex example:

``` console
$ curl -O https://raw.githubusercontent.com/latex3/latex2e/master/base/sample2e.tex
```

and process it

``` console
$ pdflatex sample2e
```

You can then use any PDF viewer to display it, e.g. `evince` in GNOME, `okular` in KDE, `xpdf` or `zathura` lightweight X11-viewer.

### Using Texlive packages

If you need many different packages or find that you are missing packages, consider to install the package **nixpkgs.texlive.combined.scheme-full**, but be aware that it is pretty huge (about 5 GB).

If you don't want to install the Full scheme, but still need a collection of specific packages, follow the instructions on the <a href="TexLive" class="wikilink" title="TexLive">TexLive</a> page.

### Using CTAN packages

If you want to use a CTAN-package that is not in TeXLive, you will have to adapt any of the derivations that you can find in these issues, e.g. [1](https://github.com/NixOS/nixpkgs/issues/21334) (eqexam) or or [2](https://github.com/NixOS/nixpkgs/issues/21577) (classico) or [3](https://github.com/NixOS/nixpkgs/issues/54451) (res). Please note that the most common reason why packages are not in TeXLive is that they might be released under a non-free license.

### Using home-made packages

You might want to review [4](https://github.com/NixOS/nixpkgs/issues/17748)

### Removing packages from a collection

If you want to package and install a fresher version of some TeXLive package, you might experience a collision with a package from a scheme or a collection you have installed as a whole. To resolve this issue, remove the package by pname from pkgs.

Example code:

``` nix
pkgs.texlive.combine {
  scheme-medium = pkgs.texlive.scheme-medium // {
    pkgs = pkgs.lib.filter
      (x: (x.pname != "apxproof"))
      pkgs.texlive.scheme-medium.pkgs;
  };

  apxproof = { pkgs = [(pkgs.runCommand "apxproof" {
    src = pkgs.fetchurl {
      url = "https://raw.githubusercontent.com/PierreSenellart/apxproof/1ac14c47b8351b693ca05eec73dca1332a517ac9/apxproof.sty";
      sha256 = "sha256-XSgtXsOwhMu2Wo4hVp8ZfaPWgjEEg3EBn5/BhD3xkMA=";
    };
    passthru = {
      pname = "apxproof";
      version = "1.2.3";
      tlType = "run";
    };
  }
  "
    mkdir -p $out/tex/latex/apxproof/
    cp $src $out/tex/latex/apxproof/apxproof.sty
  ")]; };
}
```

## Frequently asked questions FAQ

*How do I figure out which Texlive-schema to install?*

As noted on <a href="TexLive" class="wikilink" title="TexLive">TexLive</a> there are several schemas available. If you know exactly which packages you are going to need you can follow the recipe on the <a href="TexLive" class="wikilink" title="TexLive">TexLive</a> page. Installing the Full-schema is always an option to be sure that you have everything you need, like so:

``` console
$ nix-env -iA nixpkgs.texlive.combined.scheme-full
```

If you are looking for a smaller package, you need to go the [Nixpkg's package specification](https://raw.githubusercontent.com/NixOS/nixpkgs/refs/heads/master/pkgs/tools/typesetting/tex/texlive/tlpdb.nix) and search for the scheme-name. For each scheme the list of packages is listed there. Since the inclusion of packages is organized hierarchically, this will require some digging. (TODO: Is there a nix-command to find out?)

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
