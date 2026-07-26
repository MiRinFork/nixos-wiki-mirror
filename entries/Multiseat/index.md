<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Multiseat -->

A multiseat system allows for multiple separate simultaneous users on one machine. NixOS supports multiseat using udev, loginctl and assigning separate hardware to each seat, with at least one video card per seat. For that you need to properly configure udev to assign hardware to each seat.

On a traditional Linux distribution you can use the `loginctl attach` command to interactively assign hardware to seats, but since `/etc/udev/rules.d` is read-only in NixOS (even with mutable /etc) this is not possible. You can either create the udev rules by hand if you know how to or use a traditional distro to interactively create them using `loginctl attach` and `loginctl seat-status` , then copy them. The `loginctl` generated rules should be in `/etc/udev/rules.d/72-seat-*`. Remember to assign inputs, sound, and all parts of the video card(likely a DRM framebuffer, graphics proper and sound).

Then you can add the rules to udev in configuration.nix. Example:

``` nix
  environment.etc.seat = {
    target = "udev/rules.d/72-myrules.rules";
    text = ''
      TAG=="seat", ENV{ID_FOR_SEAT}=="drm-pci-0000_06_00_0", ENV{ID_SEAT}="seat1"
      TAG=="seat", ENV{ID_FOR_SEAT}=="graphics-pci-0000_06_00_0", ENV{ID_SEAT}="seat1"
      TAG=="seat", ENV{ID_FOR_SEAT}=="sound-pci-0000_06_00_1", ENV{ID_SEAT}="seat1"
      TAG=="seat", ENV{ID_FOR_SEAT}=="usb-pci-0000_02_00_0-usb-0_8", ENV{ID_SEAT}="seat1"
      TAG=="seat", ENV{ID_FOR_SEAT}=="usb-pci-0000_02_00_0-usb-0_9", ENV{ID_SEAT}="seat1"
    '';
  };
```

The display manager should automatically show the login screen on each separate seat after a reboot. Tested with <a href="LightDM" class="wikilink" title="LightDM">LightDM</a>.

## See Also

- [Multiseat on FreeDesktop wiki](https://www.freedesktop.org/wiki/Software/systemd/multiseat/)
- [Multiseat on ArchWiki](https://wiki.archlinux.org/title/multiseat)
- [Multiseat on Ubuntu wiki](https://wiki.ubuntu.com/Multiseat)

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
