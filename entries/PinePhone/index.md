<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PinePhone -->

[PinePhone](https://en.wikipedia.org/wiki/PinePhone) is supported by [Mobile NixOS](https://mobile.nixos.org/): <https://mobile.nixos.org/devices/pine64-pinephone.html>

This guide is discusses how to use [Phosh](https://phosh.mobi/), the GNOME-derived UI used by Librem and Mobian.

## Requirements

This document assumes you have set up NixOS on your PinePhone, as described in <https://mobile.nixos.org/getting-started.html>

Beware known issues:

- [boot.growPartition has no effect](https://github.com/NixOS/mobile-nixos/issues/342)
- [how to cross-compile](https://github.com/NixOS/mobile-nixos/issues/373)

## Status

### Phosh

Working with:

``` nix
xserver.desktopManager.phosh = {
  enable = true;
  user = "alice";
  group = "users";
  # for better compatibility with x11 applications
  phocConfig.xwayland = "immediate";
};
```

### Battery

Wake-on-modem works. Wake-on-WiFi is not supported. Something like <https://gist.github.com/Peetz0r/bf8fd93a60962b4afcf2daeb4305da40> is needed.

### Browsing

- GNOME Web is installed by default.
- \`pkgs.firefox-wayland\` works but doesn't scale down the UI well. <https://gitlab.com/postmarketOS/mobile-config-firefox> is needed for that.

### Sound

Working. Settings -\> Sound -\>Output -\> Configuration -\> HiFi

### Calling

Working with:

``` nix
programs.calls.enable = true;
# Optional but recommended. https://github.com/NixOS/nixpkgs/pull/162894
systemd.services.ModemManager.serviceConfig.ExecStart = [
  "" # clear ExecStart from upstream unit file.
  "${pkgs.modemmanager}/sbin/ModemManager --test-quick-suspend-resume"
];
```

Known issues:

- incoming calls don't trigger music to be paused. Likely need something like <https://source.puri.sm/Librem5/librem5-base/-/merge_requests/170/diffs>

### SMS

Working with:

``` nix
environment.systemPackages = [ pkgs.chatty ];
```

### MMS

Unsupported. See <https://source.puri.sm/Librem5/chatty/-/issues/30>

### Camera

is the only known application to [work with Pinephone](https://git.sr.ht/~martijnbraam/megapixels#linux-video-subsystem). Does not always start correctly, retrying might help.

- Front camera works out-of-the-box.
- Back camera works, but autofocus does not ( <https://github.com/NixOS/mobile-nixos/issues/393> )

### Mobile internet

Working via gnome-control-center ("Mobile Broadband" section), or:

### GPS

Working with GNOME applications with:

- 

- and the following:

``` nix
services.geoclue2.enable = true;
users.users.geoclue.extraGroups = [ "networkmanager" ];
```

### Sensors

The acceleration, compass, and ambient light sensors provide working auto-rotation, compass, and auto-brightness, when you:

``` nix
hardware.sensor.iio.enable = true;
hardware.firmware = [ config.mobile.device.firmware ];
```

### Disk encryption

The boot process supports opening LUKS volumes. Creating an image to use LUKS is unsupported, but possible. The idea is to write an encrypted LUKS volume to the root partition, as described in <https://github.com/NixOS/mobile-nixos/tree/master/examples/testing/qemu-cryptsetup>.

### Hardware acceleration for video

See <https://github.com/NixOS/mobile-nixos/issues/398>.

### Torch

Working, per <https://github.com/NixOS/mobile-nixos/issues/379>

### Bluetooth

Working with:

``` nix
mobile.boot.stage-1.firmware = [
  config.mobile.device.firmware
];
```

### Modem firmware

Per <https://wiki.pine64.org/wiki/PineModems#Upgrade/switch_firmware_via_fwupd> , fwupd can be used to flash the FOSS Modem firmware. To enable fwupd:

``` nix
services.fwupd.enable = true;
```

### Alarm clocks

Not working:

- GNOME Clocks will not wake up the phone: <https://gitlab.gnome.org/GNOME/gnome-clocks/-/issues/100>
- <https://github.com/Dejvino/birdie> looks good, but is not packaged.

## Recommended applications

See <https://linmobapps.frama.io/> for a list of applications that behave well on small screens, and in particular <https://apps.gnome.org/>.

## See also

- [xnux.eu ("megi")](https://xnux.eu/devices/pine64-pinephone.html) is authoritative on hardware capabilities
- [PinePhone multi-distro demo image](https://xnux.eu/p-boot-demo/) is an easy way to see which functionality works in other distros.
- [Arch Linux's Pinephone config](https://github.com/dreemurrs-embedded/Pine64-Arch)
- [Mobian's Pinephone docs](https://wiki.mobian-project.org/doku.php?id=pinephone)
- [PostmarketOS's Pinephone docs](https://wiki.postmarketos.org/wiki/PINE64_PinePhone_(pine64-pinephone))
- [PostmarketOS's Pinephone config](https://gitlab.com/postmarketOS/pmaports/-/tree/master/device/main/device-pine64-pinephone)

<a href="Category:_Hardware" class="wikilink" title="Category: Hardware">Category: Hardware</a>
