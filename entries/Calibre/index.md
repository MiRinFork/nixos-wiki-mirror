<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Calibre -->

[Calibre](https://calibre-ebook.com/) is program to view, edit, convert, and print ebooks.

## Installation

Calibre is available in <a href="nixpkgs" class="wikilink" title="nixpkgs">nixpkgs</a> as .

### NixOS

Add the package to your NixOS configuration, in :

``` nix
environment.systemPackages = with pkgs; [
  calibre
];
```

### Home Manager

Add the package to your [`home.packages`](https://home-manager-options.extranix.com/?release=master&query=home.packages):

``` nix
home.packages = with pkgs; [      
  calibre
];
```

## Extras

### Connecting USB devices

To connect devices via USB, you might have to add the following to your NixOS configuration:

``` nix
services.udisks2 = {
    enable = true;
    mountOnMedia = true;
};
```

### Opening `.cbr` files

`.cbr` files are comic book archives in the <a href="Wikipedia:RAR_(file_format)" class="wikilink" title="RAR">RAR</a> archive format.

If you want to open `.cbr` files, replace `calibre` with the following in your NixOS or Home Manager configuration:

``` nix
(calibre.override {
  unrarSupport = true;
})
```

## See also

- <a href="wikipedia:Calibre_(software)" class="wikilink" title="Calibre on Wikipedia">Calibre on Wikipedia</a>

<a href="Category:_Applications" class="wikilink" title="Category: Applications">Category: Applications</a>
