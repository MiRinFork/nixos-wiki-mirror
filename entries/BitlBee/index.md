<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: BitlBee -->

[BitlBee](https://en.wikipedia.org/wiki/BitlBee) is a gateway (daemon / client) for IRC.

## Basic configuration

Configure bitlbee as a service running, with plugins enabled. All options `nixos-option services.bitlbee`.

``` nix
services.bitlbee = {
  enable = true;
  plugins = [
    pkgs.bitlbee-facebook
    # all plugins: `nix-env -qaP | grep bitlbee-`
  ];
}
```

## Enable libpurple plugins for bitlbee

There is a build option to enable libpurple's plugin for bitlbee.

``` nix
nixpkgs.config.bitlbee.enableLibPurple = true;

services.bitlbee = {
  enable = true;
  libpurple_plugins = [
    pkgs.purple-hangout
    # all plugins: `nix-env -qaP | grep purple-`
  ];
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
