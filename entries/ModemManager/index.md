<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ModemManager -->

ModemManager is a DBus-activated daemon which manages cellular modems (2G, 3G, 4G and 5G) and establishes cellular data connections.[^1]

## Configuration

It is possible to enable the modem with:

``` nix
networking.modemmanager.enable = true;
```

A good rule of thumb is to use NetworkManager as much as possible for WWAN functionality and rely on ModemManager functionality directly only when necessary (e.g., when having to insert a PIN to unlock the SIM card).

[^1]: <https://www.freedesktop.org/wiki/Software/ModemManager/>
