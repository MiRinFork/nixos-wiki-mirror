<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NetworkManager -->

NetworkManager is a program for configuring network devices on Linux. It is widely used by several Linux distributions and recommended for new <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> installs. It provides non-declarative, interactive network configuration and tends to be the default for many desktop environments, such as <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> or <a href="KDE" class="wikilink" title="KDE Plasma">KDE Plasma</a>.

## Installation

NetworkManager can be enabled in the NixOS configuration file with the following line:

``` nix
networking.networkmanager.enable = true;
```

In order to allow access to the NetworkManager daemon and be able to configure and add new networks, the user must be added to the `networkmanager` group. This can be done through the `extraGroups` option for a defined user:

``` nix
users.users.<name>.extraGroups = [ "networkmanager" ];
```

By default, NetworkManager comes with `nmcli` and `nmtui` as user interfaces, however, a GTK interface called `nm-connection-editor` can be found in the `networkmanagerapplet` package.

## Usage

NetworkManager can be used with several front ends, such as `nmcli`, `nmtui`, or `nm-applet` and `nm-connection-editor`.

## Configuration

The NixOS modules offer additional configurations that can be setup very easily. For a full list of module options, refer to .

### DNS Management

To allow custom DNS management, you must disable NetworkManager's built-in DNS resolution, as well as some NixOS `dhcp` related options. Refer to the configuration below as an example of what to do:

``` nix
networking.networkmanager.enable = true;

# Disable NetworkManager's internal DNS resolution
networking.networkmanager.dns = "none";

# These options are unnecessary when managing DNS ourselves
networking.useDHCP = false;
networking.dhcpcd.enable = false;

# Configure DNS servers manually (this example uses Cloudflare and Google DNS)
# IPv6 DNS servers can be used here as well.
networking.nameservers = [
  "1.1.1.1"
  "1.0.0.1"
  "8.8.8.8"
  "8.8.4.4"
];
```

### Power Saving

On laptops, where extra power savings may be desired, you can enable NetworkManager specific power saving options as follows:

``` nix
networking.networkmanager.wifi.powersave = true;
```

Please see <a href="Power_Management" class="wikilink" title="Power Management">Power Management</a> for more tips relating to power-saving tips and tricks for NixOS.

### Link aggregation

See <a href="Networking#Link_aggregation" class="wikilink" title="Networking#Link aggregation">Networking#Link aggregation</a>.

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:GNOME" class="wikilink" title="Category:GNOME">Category:GNOME</a> <a href="Category:KDE" class="wikilink" title="Category:KDE">Category:KDE</a> <a href="Category:DNS" class="wikilink" title="Category:DNS">Category:DNS</a>
