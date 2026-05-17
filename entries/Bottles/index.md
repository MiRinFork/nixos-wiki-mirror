<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bottles -->

[Bottles](https://usebottles.com/) is an open source application that lets you manage your <a href="Wine" class="wikilink" title="Wine">Wine</a> or Proton prefixes, and run Windows software within those prefixes.

## Installation

Simply <a href="Adding_programs_to_PATH" class="wikilink" title="install">install</a> the `bottles` package:

``` nix
environment.systemPackages = with pkgs; [
  bottles
];
```

### Home Manager

Add the package to your [`home.packages`](https://home-manager-options.extranix.com/?release=master&query=home.packages):

``` nix
home.packages = with pkgs; [      
  bottles
];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
