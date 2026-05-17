<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Budgie Desktop -->

The [Budgie Desktop](https://github.com/BuddiesOfBudgie/budgie-desktop) is a feature-rich, modern desktop designed to keep out the way of the user.

## Installing Budgie Desktop

To use the Budgie Desktop, add this to your configuration.nix:

``` nix
services.xserver.enable = true;
services.xserver.desktopManager.budgie.enable = true;
services.xserver.displayManager.lightdm.enable = true;

# Optional: 
services.displayManager.defaultSession = "budgie-desktop";
```

## Excluding some Budgie Desktop applications from the default install

Not all applications that come pre-installed with the Budgie Desktop are desirable for everyone to have on their machines. There's a way to edit configuration.nix to exclude these kinds of packages, for example as follows:

``` nix
environment.budgie.excludePackages = with pkgs; [
  mate.mate-terminal
  vlc
];
```

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
