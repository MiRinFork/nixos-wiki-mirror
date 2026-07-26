<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: LibreOffice -->

[LibreOffice](https://www.libreoffice.org) is a multi-platform office suite. It consists of programs for word processing (Writer); creating and editing spreadsheets (Calc), slideshows (Impress), diagrams and drawings (Draw); working with databases (Base); and composing mathematical formulae (Math).

## Spellcheck

In order for spellcheck to work, you will need to install the `hunspell` package as well as the `hunspellDicts.` packages for the languages that you would like. For example this installs libreoffice with dictionaries for Ukrainian and Central Thai.

``` nix
environment.systemPackages = with pkgs; [
  libreoffice-qt
  hunspell
  hunspellDicts.uk_UA
  hunspellDicts.th_TH
];
```

## Hyphenation

In order to add hyphenation dictionaries, use

``` nix
environment.systemPackages = with pkgs; [
  libreoffice-qt
  hyphenDicts.en_GB  # British English
  hyphenDicts.de_DE  # German, etc.
];
```

## uno Python Library for API access

With `uno.py` it is possible to access the LibreOffice API with Python. For getting `uno.py` python library to work the special path `/lib/libreoffice/program` needs to be included into the python path as well as the `URE_BOOTSTRAP` variable must be set.

``` nix
let
  office = pkgs.libreoffice-fresh-unwrapped;
in {
  environment.sessionVariables = {
    PYTHONPATH = "${office}/lib/libreoffice/program";
    URE_BOOTSTRAP = "vnd.sun.star.pathname:${office}/lib/libreoffice/program/fundamentalrc";
  };
}
```

## KDE / Plasma

If you use <a href="KDE" class="wikilink" title="KDE (Plasma)">KDE (Plasma)</a> then you'll be better off with `libreoffice-qt` package. Otherwise you may lack, e.g. main menu bar.

## See also

- <a href="Onlyoffice" class="wikilink" title="Onlyoffice">Onlyoffice</a>, software suite that offers online and offline tools for document editing, collaboration, and management.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
