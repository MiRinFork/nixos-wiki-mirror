<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Lomiri -->

[Lomiri](https://lomiri.com/) (formerly known as Unity8) is a versatile and touch-friendly user interface designed primarily for mobile devices, tablets, and convergent computing environments. Developed by the UBports community, it aims to provide a seamless and intuitive user experience across various device form factors.

## Setup

To enable Lomiri desktop add following lines to your system configuration and apply it.

``` nix
services.desktopManager.lomiri.enable = true;
services.displayManager.defaultSession = "lomiri";
```

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a>
