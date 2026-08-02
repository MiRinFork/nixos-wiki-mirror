<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mullvad VPN -->

<b>Mullvad VPN</b> is a virtual private network service operated in Sweden by [Mullvad VPN AB](https://mullvad.net). It uses <a href="WireGuard" class="wikilink" title="WireGuard">WireGuard</a> under the hood and includes both a CLI and a GUI package.

## Installation

To install Mullvad VPN, simply enable the service in the system configuration:

The GUI application may be enabled in addition to the main Mullvad service:

## Configuration

You can declaratively configure the Mullvad daemon by writing the `settings.json` file to the location set by the `MULLVAD_SETTINGS_DIR` environment variable. (`/etc/mullvad-vpn` by default)

The example below sets up a few custom lists that let you select a whole continent as an exit location, or simply randomizes all countries if you don't care where your IP is coming from. A caveat with this configuration is that it must be manually updated every time Mullvad implements a server in a new country.

### Autostarting the GUI application

If you don't want to rely on Mullvad's autostart file in `~/.config/autostart`, you can set up an autostart file with `makeAutostartItem`:

This is useful when the home directory is <a href="Impermanence" class="wikilink" title="stateless">stateless</a>, as the file configured by Mullvad would not be persistent.

<a href="Category:VPN" class="wikilink" title="Category:VPN">Category:VPN</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
