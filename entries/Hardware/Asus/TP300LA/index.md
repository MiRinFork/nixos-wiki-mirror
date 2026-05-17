<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Asus/TP300LA -->

## Hardware Support

Most hardware functions as expected without changes, this includes brightness, wifi, bluetooth, webcam, sound and HDMI out.

Only specific or uncommon hardware notes have been added.

### Function keys

Function keys for airplane mode, brightness, screen disable, and volume works[^1]. The screen setup function key is mapping to <kbd>Super_L</kbd>+<kbd>P</kbd>. The windows key on the side of the device will map to a <kbd>Super_L</kbd> **press and release** on release, there is no way to map to it being held.

The `auto` brightness key doesn't map to anything.

### Sensors

Both orientation sensors and light sensors are supported under NixOS 17.09, using <a href="IIO" class="wikilink" title="IIO">IIO</a>[^2].

The orientation sensor isn't oriented like the screen, [PR#7752 on systemd](https://github.com/systemd/systemd/pull/7752) will add the required configuration upstream, hopefully it will be present in the next stable release of NixOS.

Meanwhile, adding this to your configuration.nix will configure the sensor appropriately.

``` nix
{ config }:
{
  hardware.sensor.iio.enable = true;
  # Accelerometer orientation; upstreaming in progress.
  # https://github.com/systemd/systemd/pull/7752
  services.udev.extraHwdb = ''
    sensor:modalias:acpi:INVN6500*:dmi:*svn*ASUSTeK*:*pn*TP300LA*
     ACCEL_MOUNT_MATRIX=0, 1, 0; 1, 0, 0; 0, 0, 1
  '';
}
```

A reboot may be the easiest way to refresh everything for `iio-sensor-proxy`. Test using `monitor-sensor`.

<hr />

<references />

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: Tested using kernel 4.14 on NixOS 17.09

[^2]: Tested using kernel 4.14 on NixOS 17.09
