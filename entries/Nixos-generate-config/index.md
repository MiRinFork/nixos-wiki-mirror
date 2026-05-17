<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixos-generate-config -->

Generate NixOS configuration modules.

This command is part of the package. It analyzes your hardware configuration and generates two files of:

- `/etc/nixos/configuration.nix` - the main system configuration file.
- `/etc/nixos/hardware-configuration.nix` - a hardware-specific configuration file, including detected devices and modules.

For details on configuring the system configuration file, see <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="Overview of the NixOS Linux distribution#Declarative Configuration">Overview of the NixOS Linux distribution#Declarative Configuration</a>.

# Usage

``` console
# nixos-generate-config
```

This will create configuration files based on the currently mounted system. This is typically used where NixOS is already installed. By default, `nixos-generate-config` will not overwrite an existing `configuration.nix`. To force overwrite an existing file, pass the `--force` option.

## Generate configuration for a target root

To generate configuration files with a specific root directory (commonly used during installation):

``` console
# nixos-generate-config --root /mnt
```

This writes configuration files to `/mnt/etc/nixos/`.

## Show hardware configuration

To print the detected hardware configuration to standard output without writing to disk:

``` console
# nixos-generate-config --show-hardware-config
```

# Specifying specific hardware

A collection of hardware specific platforms with their config can be found at [NixOS Hardware repository](https://github.com/NixOS/nixos-hardware).

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
