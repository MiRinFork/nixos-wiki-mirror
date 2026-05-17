<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cinnamon -->

[Cinnamon](https://github.com/linuxmint/cinnamon) is a Linux desktop that provides advanced innovative features and a traditional user experience.

## Installation

Add to your configuration: Although it is enabled through the <a href="wikipedia:X.Org_Server" class="wikilink" title="xserver">xserver</a> options, the experimental <a href="Wayland" class="wikilink" title="Wayland">Wayland</a> session is available through enabling this option.

### Display Manager

Linux Mint Cinnamon edition comes with <a href="LightDM" class="wikilink" title="LightDM">LightDM</a> as the display manager, you can enable LightDM in your configuration like so:

## Configuration

### Excluding preinstalled packages

### Online Account Management

Cinnamon uses [gnome-online-accounts-gtk](https://search.nixos.org/packages?channel=25.11&query=gnome-online-accounts-gtk&show=gnome-online-accounts-gtk) to manage online account connection with the rest of the desktop environment. However, merely activating the Cinnamon desktopManager service isn't enough to make this feature work. You must also activate the [gnome-online-accounts](https://search.nixos.org/options?channel=25.11&query=gnome+online+accounts&show=services.gnome.gnome-online-accounts.enable) service, like so.

``` nix
services.gnome.gnome-online-accounts.enable = true;
```

## Troubleshooting

### Fix scrolling with a touchpad on Firefox-based browsers

This issue can be fixed by adding an environment variable to your session. Insert this in to your configuration. After logging out and logging back in this issue shall be resolved.

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a>
