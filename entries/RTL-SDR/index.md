<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RTL-SDR -->

## RTL-SDR

The **RTL-SDR** is an inexpensive and widely used software-defined radio (SDR) receiver. The USB dongle is based on the Realtek **RTL2832U** chipset.

### Installation

To begin using the RTL-SDR dongle, enable it with the following configuration:

``` nix
hardware.rtl-sdr.enable = true;
```

This setting enables `rtl-sdr` udev rules, ensures the `plugdev` group exists, and blacklists DVB kernel modules. This is necessary to allow access to RTL-SDR devices without requiring root privileges, since udev will assign ownership of RTL-SDR USB descriptors to the `plugdev` group.

To use the RTL-SDR dongle without `sudo` access, add your user to the `plugdev` group:

``` nix
users.users.<user>.extraGroups = [ "plugdev" ];
```

After making these changes, rebuild your system configuration.

To verify that everything is set up correctly and the dongle is working, run:

``` bash
rtl_test
```

### Troubleshooting

#### `rtl_test` requires sudo

If `rtl_test` or other RTL-SDR utilities require root access to function, make sure your user is a member of the `plugdev` group. Run:

``` bash
groups
```

If `plugdev` is not listed, add the group to your user’s `extraGroups` in your configuration, rebuild the system, and log out and back in for the changes to take effect.

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
