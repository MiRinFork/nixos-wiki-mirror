<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Redshift -->

[Redshift](https://github.com/jonls/redshift) is an open-source software application designed to adjust color temperature of screens based on the time of day.

It does this by gradually shifting the color temperature of the display to reduce the amount of blue light towards the night, and increasing the amount of blue light in the morning.

Users may choose to have screen temperature automatically match their lighting based on geographic location, or based on manually set time-frames. Users may also customize day and night color temperatures, adjust the speed of transitions, and more.

Redshift is best used on X11 systems as it is unmaintained and does not support Wayland.

For Wayland support you may consider <a href="Gammastep" class="wikilink" title="Gammastep">Gammastep</a>, a modern fork of Redshift. Alternatively there is also <a href="wlsunset" class="wikilink" title="wlsunset">wlsunset</a>, which is a lightweight modern alternative.

## Installation

#### Using Global Configuration

#### Using Home Configuration

## Configuration

#### Global Configuration:

Options may be found under [services.redshift](https://search.nixos.org/options?query=services.redshift). For more options for configuring Geoclue, check the <a href="Geoclue" class="wikilink" title="Geoclue page">Geoclue page</a>.

#### Home Manager

##### Example Usage

You can find more options in [Home Manager: services.redshift](https://nix-community.github.io/home-manager/options.xhtml#opt-services.redshift.enable). This configuration defines the temperature the display will use at night and day, the schedule and length of the transition, brightness for the display to use, and whether it will use a tray icon. `extraOptions` defines additional command-line arguments to pass to `redshift`.

##### Location Based Transitions

You can choose to use Redshift with location based screen temperature to match when the sun actually sets and rises in your area. Below are examples of those options using [Geoclue](https://gitlab.freedesktop.org/geoclue/geoclue/-/wikis/home) and manually set coordinates.

###### Geoclue

Geoclue provides location using GPS, 3G modems, GeoIP, and WiFi Geolocation. Some integrations may require additional setup.You will also need to enable Geoclue in your global configuration <a href="Geoclue" class="wikilink" title="(See options on the Geoclue page)">(See options on the Geoclue page)</a>.

###### Coordinates

Instead of declaring your coordinates in Redshift, you can also declare them globally for your device in your global configuration:

## Troubleshooting

#### Provider is unable to determine location

It may happen that Redshift gets stuck at *"Waiting for initial location to become available..."* when using the location provider. This may happen when Geoclue is unable to determine your location due to missing information. In that case, you may resort to setting the location manually or using an alternate location service such as [beaconDB](https://beacondb.net/), which can take advantage of WiFi scanning.

An example of using beaconDB as an alternative:

## References

- <https://github.com/jonls/redshift>
- <https://nix-community.github.io/home-manager/options.xhtml#opt-services.gammastep.enable>
- <https://search.nixos.org/options?query=redshift>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
