<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Thunderbolt -->

## Plasma

To benefit from KDE Plasma's GUI for managing Thunderbolt devices, you may install the System Settings panel. Just add this to your packages: `kdePackages.plasma-thunderbolt`.

## Enable the Bolt daemon

Even if you don't use Gnome, you may want to enable the Bolt daemon - just configure the following:

``` nix
services.hardware.bolt.enable = true;
```

This will enable the bolt daemon on your system.

For the description of this option, [services.hardware.bolt.enable](https://search.nixos.org/options?type=packages&query=services.hardware.bolt.enable).

## Enroll Thunderbolt devices

If your Thunderbolt device does not work, execute `boltctl` in a terminal. This will show you your connected devices, and their respective uuid. In color terminals, it will show you if your device is authorized (green light) or not (orange light).

**For each device** that is not authorized, execute `boltctl enroll --chain UUID_FROM_YOUR_DEVICE`. .

Check with `boltctl` whether all your devices have been enrolled (green light everywhere).

## Dell's TB16 dock

On a Dell XPS 13" 9360, the TB16 is not always authorised automatically, and you may have the impression that it does not work correctly (connected USB devices won't work while the DisplayPort may work...).

When connecting a TB16, `boltctl` shows 2 devices: *Dell Thunderbolt Dock* and *Dell Thunderbolt Cable*.

It is enough to enroll the *Dell Thunderbolt Dock* with the `--chain` parameter, as this will also automatically enroll the *Dell Thunderbolt Cable*.

## USB ports not working

If the USB ports are not working, you can try running \`echo 1 \> /sys/bus/pci/rescan\`. If this causes the error \`No bus number available for hot-added bridge\` to appear in \`journalctl\`, adding \`pci=assign-busses,hpbussize=0x33,realloc,hpmemsize=128M,hpmemprefsize=1G\` may fix your issue. (Thanks to <https://old.reddit.com/r/XMG_gg/comments/ic7vt7/fusion15_linux_how_to_fix_thunderbolttb3_dock_usb/> for the hint)

<a href="Category:_Hardware" class="wikilink" title="Category: Hardware">Category: Hardware</a>
