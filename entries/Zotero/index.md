<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zotero -->

[Zotero](https://www.zotero.org/) is a free and open-source bibliography manager. It provides tools to classify references under various organization schemes (tags, folders). Zotero can automatically generate a bibliography using a set of pre-built citation styles. Companion web-browser plugins allow for saving references from the web with pre-filled metadata.

## Installation

Under NixOS,

``` nixos
environment.systemPackages = with pkgs; [
    zotero
];
```

## Configuration

### Zotero LibreOffice add-on

The Nix derivation ships with the <a href="LibreOffice" class="wikilink" title="LibreOffice">LibreOffice</a> integration. It is located in

``` nix
${pkgs.zotero}/lib/integration/libreoffice/Zotero_LibreOffice_Integration.oxt
```

This can also be done through `nix build nixpkgs#zotero`, then locating the file in the `result` folder.

For LibreOffice to correctly enable the plugin, it must be provided with a folder containing a Java Runtime Environment (JRE). You can install any JRE available in nixpkgs, for instance `jre8` and make it available for LibreOffice.

To do so, go in the LibreOffice options, at LibreOffice -\> Advanced, and point it to the path of the installed JRE.

You can obtain the aforementioned path with the following script:

`nix derivation show nixpkgs#jre8 | {echo "/nix/store/"; jq '.derivations[].outputs.jre.path';} | xargs echo | sed "s/\ //"`

## Zotero Firefox add-on

The Zotero Firefox add-on works as expected with one caveat; the pdftotext and pdfinfo plugins it needs in order to index and pull metadata from PDFs you wish to add to your library.

The solution, for now, is as follows (this assumes that you have the Zotero plugin installed and configured sans PDF support): **NB: The symlinks DO NOT survive an update between Firefox versions, so everytime your Firefox is updated you will have to repeat the below process!** In your filesystem navigate to ~/.mozilla/firefox/<profile>/zotero Create the following symlinks and ensure that they are named EXACTLY as described here:

``` bash
ln -s /run/current-system/sw/bin/pdftotext pdftotext-Linux-<architecture> (e.g., pdftotext-Linux-x86_64)
ln -s /run/current-system/sw/bin/pdfinfo pdfinfo-Linux-<architecture>
```

Launch Firefox and go to the Zotero add-on preferences; click on the "Search" tab and you should find that both, pdftotext and pdfinfo, are recognized and their version is either "UNKNOWN" or the correct version number. This is trivial and should not deter you. You can now use the PDF metadata retrieval capabilities.

## References

[Zotero derivation source in Nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/zo/zotero/package.nix)
