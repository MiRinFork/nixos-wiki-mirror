<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fwupd -->

[fwupd](https://fwupd.org) is a simple daemon allowing you to update some devices' firmware, including UEFI for several machines.

Supported devices are listed [here](https://fwupd.org/lvfs/devices/) and [more are to come](https://fwupd.org/lvfs/vendors/).

## Installation

To use and install fwup daemon and user space client, add following part to your config:

``` nix
services.fwupd.enable = true;
```

## Usage

To display all devices detected by *fwupd*:

``` console
$ fwupdmgr get-devices
```

To download the latest metadata from the [Linux Vendor Firmware Service (LVFS)](https://fwupd.org/):

``` console
$ fwupdmgr refresh
```

To list updates available for any devices on the system:

``` console
$ fwupdmgr get-updates
```

To install updates:

``` console
$ fwupdmgr update
```

## Troubleshooting

### UEFI ESP is not detected even though it is mounted

`WARNING: UEFI ESP partition not detected or configured`

Make sure your ESP has the partition type of `EFI System`

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
