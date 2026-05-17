<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gammastep -->

[Gammastep](https://gitlab.com/chinstrap/gammastep) is an open-source software that adjusts the color temperature of screens based on the time of day.

It does this by gradually shifting the color temperature of the display to reduce the amount of blue light towards the dusk, and increasing the amount of blue light towards dawn.

Users may choose to have screen temperature automatically match their lighting based on geographic location, or based on manually set time-frames. Users may also customize day and night color temperatures, adjust the speed of transitions, and more.

Alternatively you may also consider <a href="wlsunset" class="wikilink" title="wlsunset">wlsunset</a>, which is a lightweight modern alternative.

## Installation

You can install Gammastep in your global configuration like so:

## Home Manager Configuration

### Example Usage

You can find more options in [Home Manager: services.gammastep](https://nix-community.github.io/home-manager/options.xhtml#opt-services.gammastep.enable). This configuration defines the temperature the display will use at night and day, the schedule and length of the transition, and whether it will use a tray icon. Available options for `settings` may be found on the Gammastep man page [(Gammastep Arch Man Page)](https://man.archlinux.org/man/extra/gammastep/gammastep.1.en).

### Location Based Transitions

You can choose to use Gammastep with location based screen temperature to match when the sun actually sets and rises in your area. Below are examples of those options using [Geoclue](https://gitlab.freedesktop.org/geoclue/geoclue/-/wikis/home) and manually set coordinates.

#### Geoclue

Geoclue provides location using GPS, 3G modems, GeoIP, and WiFi Geolocation. Some integrations may require additional setup. You will also need to enable Geoclue in your global configuration <a href="Geoclue" class="wikilink" title="(See options on the Geoclue page)">(See options on the Geoclue page)</a>.

#### Coordinates

Instead of declaring your coordinates in Gammastep, you may also choose to declare them globally for your device in your global configuration:

## See also

- <a href="Redshift" class="wikilink" title="Redshift">Redshift</a>, original implementation only supporting X11 (unmaintained).

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
