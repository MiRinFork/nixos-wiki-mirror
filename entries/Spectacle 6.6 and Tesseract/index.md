<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Spectacle 6.6 and Tesseract -->

***Context** : NixOS 26.05 / Plasma 6 / Spectacle 6.6.5*

An interesting new feature of **Spectacle 6.6** is that it can integrate **OCR** (Tesseract 5).

I spent some time figuring out how to do this. So, to save time for anyone who wants to enable this feature, here’s how I did it:

I added:

`(kdePackages.spectacle.override {`

`  tesseractLanguages = [ "fra" "eng" "deu" "spa" ];`

`})`

to configuration.nix, and the “**Extract Text**” button finally appeared in Spectacle.

For now, Tesseract is still set to English; I’m looking for a solution.
