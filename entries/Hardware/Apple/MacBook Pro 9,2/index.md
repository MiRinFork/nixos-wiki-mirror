<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Apple/MacBook Pro 9,2 -->

The MacBook Pro 9,2 is a 13-inch notebook computer released by Apple in mid-2012, featuring Intel’s third-generation Ivy Bridge processors and a unibody aluminum design.

## Configuration

### WiFi-card driver

The internal broadcom wifi card BCM4331 can be used with the proprietary `wl` or the open-source `b43` kernel module. The open-source driver requires an extra firmware package to be installed.

To use the open-source driver, ensure that the `wl` entry is removed from `boot.kernelModules` and `config.boot.kernelPackages.broadcom_sta` from `boot.extraModulePackages` (typically auto generated entries in *hardware-configuration.nix*). After that add following line to your system config, apply it and reboot:

``` nix
networking.enableB43Firmware = true;
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
