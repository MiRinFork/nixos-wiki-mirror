<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mullvad VPN -->

<b>Mullvad VPN</b> is a virtual private network service operated in Sweden by [Mullvad VPN AB](https://mullvad.net). It uses <a href="WireGuard" class="wikilink" title="WireGuard">WireGuard</a> under the hood and includes both a CLI and a GUI package.

## Installation

To install Mullvad VPN, you need to enable it in your system options:

If you want to use the GUI application:

## Configuration

You can declaratively configure the Mullvad daemon by writing the `settings.json` file to the location set by the `MULLVAD_SETTINGS_DIR` environment variable. (`/etc/mullvad-vpn` by default)

The example below sets up a few custom lists that let you select a whole continent as an exit location, or simply randomizes all countries if you don't care where your IP is coming from. A caveat with this configuration is that it must be manually updated every time Mullvad implements a server in a new country.

### Autostarting the GUI application

If you don't want to rely on Mullvad's autostart file in `~/.config/autostart`, (Perhaps because your configuration is <a href="Impermanence" class="wikilink" title="stateless">stateless</a>) you can set up an autostart file with `makeAutostartItem`:

<a href="Category:VPN" class="wikilink" title="Category:VPN">Category:VPN</a> <a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a>
