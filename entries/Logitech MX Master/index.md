<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Logitech MX Master -->

Tips on using [Logitech MX Master](https://www.logitech.com/en-us/mx/master-series.html) family <a href="Wikipedia:Computer_mouse" class="wikilink" title="computer mice">computer mice</a>

There are 2 main configuration paths for specific MX Master options:

- [Solaar](https://search.nixos.org/packages?query=solaar) - GUI application using the `hidapi` library

<!-- -->

- [LogiOps](https://search.nixos.org/packages?query=logiops) - Command Line controlled systemd service

## Solaar

[Solaar](https://search.nixos.org/packages?query=solaar) is a program that runs as a user process for configuring devices using Logitech's HID++ protocol.

### Installation

It is possible to quickly test Solaar with nix run. Settings will not persist across reboots without proper installation.

``` nixos
sudo nix run nixpkgs#solaar

# sudo needed to detect mouse
```

To install on NixOS:

``` nixos
  environment.systemPackages = with pkgs; [
    solaar
  ];
```

Additionally, to use Solaar without \`sudo\` you will have to add a udev rule. Read the warning and apply caution.

``` nixos
services.udev.extraRules = ''
# This rule was added by Solaar.
#
# Allows non-root users to have raw access to Logitech devices.
# Allowing users to write to the device is potentially dangerous
# because they could perform firmware updates.

ACTION == "remove", GOTO="solaar_end"
SUBSYSTEM != "hidraw", GOTO="solaar_end"

# USB-connected Logitech receivers and devices
ATTRS{idVendor}=="046d", GOTO="solaar_apply"

# Lenovo nano receiver
ATTRS{idVendor}=="17ef", ATTRS{idProduct}=="6042", GOTO="solaar_apply"

# Bluetooth-connected Logitech devices
KERNELS == "0005:046D:*", GOTO="solaar_apply"

GOTO="solaar_end"

LABEL="solaar_apply"

# Allow any seated user to access the receiver.
# uaccess: modern ACL-enabled udev
TAG+="uaccess"

# Grant members of the "plugdev" group access to receiver (useful for SSH users)
#MODE="0660", GROUP="plugdev"

LABEL="solaar_end"
# vim: ft=udevrules
    '';
```

For further configuration, see: [project documentation](https://pwr-solaar.github.io/Solaar/index) or section on udev rule specifically [installing udev rule manually](https://pwr-solaar.github.io/Solaar/installation/#installing-solaars-udev-rule-manually)

## LogiOps

[LogiOps](https://search.nixos.org/packages?query=LogiOps) a userspace driver running as a <a href="Systemd/User_Services" class="wikilink" title="systemd service">systemd service</a>. Default location for the configuration file is /etc/logid.cfg, but another can be specified using the `-c` flag.

See [project documentation](https://github.com/PixlOne/logiops/wiki/Configuration) and [Arch Wiki](https://wiki.archlinux.org/title/Logitech_MX_Master) for usage and configuration details.

## Tips and Tricks

### Smoother Scrolling (Scroll Wheel Resolution)

By default High Resolution Scrolling might be disabled. To enable:

##### with Solaar:

``` nixos
sudo nix run nixpkgs#solaar

# sudo needed to detect mouse
```

in Solaar find Scroll Wheel Resolution and enable it.

##### with Logiops:

add following to your Logiops config file:

    hiresscroll:
        {
            hires: true;
        }; 

### Scroll Speed issues

High Resolution Scrolling may feel too fast. You may want to lower scroll speed in your Desktop Environment -\> Mouse settings or if it doesn't help enough - possibly will have to disable hires scrolling.

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
