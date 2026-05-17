<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: UWSM -->

[UWSM (Universal Wayland Session Manager)](https://github.com/Vladimir-csp/uwsm), wraps standalone Wayland compositors with a set of Systemd units on the fly. This essentially binds the Wayland compositor into `graphical-session-pre.target`, `graphical-session.target`, `xdg-desktop-autostart.target`.

This is useful for Wayland compositors like Hyprland, Sway, Wayfire, etc. that do not start these targets and services on their own.

Additional information may be found on [the UWSM Github](https://github.com/Vladimir-csp/uwsm), or the [Arch Wiki page](https://wiki.archlinux.org/title/Universal_Wayland_Session_Manager).

## Installation

Options may be found under [programs.uwsm](https://search.nixos.org/options?query=programs.uwsm) in Nix options. An example using <a href="Sway" class="wikilink" title="Sway">Sway</a> with UWSM:

### Hyprland

##### Standalone Hyprland with UWSM

Hyprland has a built in option for UWSM that will automatically handle setup. Automatically starts appropriate targets such as `graphical-session.target`, and `wayland-session@Hyprland.target`. This option is recommended for if you are using Hyprland standalone, and do not need to configure alternative entries for UWSM. Usage of both options in conjunction may run into issues.

##### If using the Hyprland Home Manager Module

If you use the Home Manager module, make sure to disable the systemd integration as it conflicts with UWSM.[^1]

[^1]: <https://wiki.hypr.land/Useful-Utilities/Systemd-start/#uwsm>
