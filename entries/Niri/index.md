<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Niri -->

<translate> [Niri](https://github.com/YaLTeR/niri) is a scrollable-tiling <a href="Wayland" class="wikilink" title="Wayland">Wayland</a> compositor.

## Installation

Simply enable : </translate>

<translate>

## Configuration

The configuration path for niri is . Therefore <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> can be used for configuration: </translate>

<translate> You might want to start from [the default configuration file](https://github.com/YaLTeR/niri/blob/main/resources/default-config.kdl) described at [1](https://github.com/YaLTeR/niri/wiki/Getting-Started#main-default-hotkeys).

See [the wiki](https://yalter.github.io/niri/) for configuration options for niri.

### Greetd

You can start \`niri\` with greetd configuration:

## Additional Setup

As described in [Example systemd Setup (niri wiki)](https://github.com/YaLTeR/niri/wiki/Example-systemd-Setup), you might want to set up some additional services including <a href="Swayidle" class="wikilink" title="Swayidle">Swayidle</a>, <a href="Swaylock" class="wikilink" title="Swaylock">Swaylock</a>, <a href="Waybar" class="wikilink" title="Waybar">Waybar</a>, <a href="Polkit" class="wikilink" title="Polkit">Polkit</a> and <a href="Secret_Service" class="wikilink" title="Secret Service">Secret Service</a> as follows to complement the functionality of a regular window manager. Some of the these settings are also required to enable all the features of [the default configuration file](https://github.com/YaLTeR/niri/blob/main/resources/default-config.kdl). </translate>

Or using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

<translate>

## Troubleshooting

### IME not working on Electron apps

There is a general workaround to set as described in <a href="Wayland#Electron_and_Chromium" class="wikilink" title="Wayland#Electron_and_Chromium">Wayland#Electron_and_Chromium</a>: </translate>

<translate> However, since niri does not support text-input-v1, sometimes enabling text-input-v3 by manually adding flag is necessary for IME to work: </translate>

<translate> `wrapProgram` may be used to add the flag automatically: </translate>

<translate>

### XWayland apps not working

There is a optional dependency for niri which is highly recommended to install (you can read [this](https://github.com/YaLTeR/niri/wiki/Xwayland) article to learn more about this) </translate>

<translate> Or using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> </translate>

<translate> After you installed niri will integrate it out of the box and all of your XWayland apps will function properly.

### File picker not working

If you are using `xdg-desktop-portal-gnome`, it will attempt to use Nautilus as the file picker, which will fail if Nautilus is not installed.

To work around this problem, you can force usage of the gtk or kde portals for file picker instead: </translate>

### Waybar launches twice

When using a configuration option like programs.waybar.enable, waybar may launch twice on Niri. This is because the [default Niri config file launches waybar on launch](https://github.com/niri-wm/niri/blob/b07bde3ee82dd73115e6b949e4f3f63695da35ea/resources/default-config.kdl#L271). Remove the spawn-at-startup "waybar" from the config file, or add waybar to your systems packages without using the home-manager option.

<translate>

## See Also

- <a href="Wayland" class="wikilink" title="Wayland">Wayland</a>
- <a href="Sway" class="wikilink" title="Sway">Sway</a>
- <a href="Wallpapers_for_Wayland" class="wikilink" title="Wallpapers for Wayland">Wallpapers for Wayland</a>
- [niri-flake](https://github.com/sodiboo/niri-flake/)

</translate>

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
