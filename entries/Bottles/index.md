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

You will get a warning that bottles is only supported in sandboxed environments at first start of bottles. To get rid of this warning, use the code below instead. For reasoning and explanation see [this GitHub issue](https://github.com/NixOS/nixpkgs/issues/384555).

``` nix
environment.systemPackages = with pkgs; [
  (bottles.override { removeWarningPopup = true; })
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
