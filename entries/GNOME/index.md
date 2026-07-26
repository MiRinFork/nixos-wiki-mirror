<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: GNOME -->

<a href="{{PAGENAME}}" class="wikilink" title="{{PAGENAME}}">{{PAGENAME}}</a> (/(ɡ)noʊm/) is a <a href=":Category:Desktop_environment" class="wikilink" title="desktop environment">desktop environment</a> that seeks to be "an independent computing platform for everyone."[^1]

This article is an extension of the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#chap-gnome).

## Installation

### GNOME desktop

To use the GNOME desktop environment on NixOS, the following configuration module options must be set:

Mixing GNOME with other desktops (such as alternative login managers other than GDM) is not supported, make sure to disable other desktop modules before rebuilding if you encounter issues with conflicting desktops.

### GNOME extensions

GNOME offers support for changing/overhauling the user interface (GNOME Shell) through the use of *[Extensions](https://extensions.gnome.org/about/).* Extensions are bundles of third-party [GJS](https://gjs.guide/extensions/) modules that are loaded while GNOME is running to augment the user experience. A repository of GNOME extensions can be found on GNOME's official [webpage](https://extensions.gnome.org/) and can be installed imperatively if needed by unpacking the extension in `~/.local/share/gnome-shell/extensions` directory. Extensions can only be activated if it supports the GNOME release that it's installed alongside with.

In addition, NixOS automatically packages all officially available GNOME extensions under the `pkgs.gnomeExtensions` attribute. Extensions which require additional dependencies are then manually packaged if needed. Installed extensions can be enabled graphically through the built-in "Extensions" application or through the `gnome-extensions` command line interface.

## Configuration

### dconf

Dconf is a low-level configuration system for storing and loading configurations. The dconf database is stored in a single binary file in `~/.config/dconf/user` and contains all known configuration values for all applications and programs that use dconf (GNOME applications and shell, gtk, etc).

For example, the setting which controls the accent color of GNOME shell is located in the *schema* labeled `/org/gnome/desktop/interface/` which contains the *key* `accent-color` which accepts a GVariant *value* of type `enum` (one of `'blue'`, `'teal'`, `'green'`, etc)

NixOS and Home Manager both provide an interface for declarative configuration of dconf settings exposed in `programs.dconf` and `dconf` modules respectively.

Going back to the previous example, to set the accent color of GNOME in a declarative manner in NixOS as well as mapping the keyboard's "caps lock" key to "ctrl" you would write:

And the equivalent snippet in Home Manager:

Thus the settings attribute accepts an attribute set whose keys are schemas with each schema's value being a nested attribute set of the schema's keys with their appropriate GVariant value.If you wish to revert all dconf settings back to their default state (reset GNOME essentially) then use the following command which resets all schemas directories available on your system, note that this will affect all programs that use dconf, including GNOME apps and extensions.

``` console
$ dconf reset -f /
```

#### Extensions

Extensions are not activated by default when installed with Nix but can be configured to do so using the respective dconf modules. The schema is `/org/gnome/shell/` with the key `enabled-extensions` which accepts a list of strings that represent extension UUIDs. If the extension was installed with Nix, then the UUID can be accessed by the `extensionUuid` attribute of the extension itself. Each extension's configuration can then be found under their corresponding schema in `/org/gnome/shell/extensions/` and be configured as needed.

For example, in Home Manager, you could write:

## Tips and tricks

### GNOME power user apps

Both GNOME Tweaks (accessible as `gnome-tweaks`) and [Refine](https://gitlab.gnome.org/TheEvilSkeleton/Refine) (accessible as `refine`) allow you to change certain GNOME settings that are hidden by default (such as interface font, window decoration buttons like maximize/minimize, icon themes and GTK themes, etc).

The GNOME shell extension [Just Perfection](https://extensions.gnome.org/extension/3843/just-perfection/) also allows for customizing nearly all parts of the GNOME shell interface.

### GNOME Qt integration

Using the following example configuration, Qt applications will have a look similar to the adwaita style used by GNOME using a dark theme. For other themes, you may need the packages `libsForQt5.qt5ct` and `libsForQt5.qtstyleplugin-kvantum` and a symlink from `~/.config/Kvantum/` to your theme package. Here is an example using Arc-Dark and <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. In the Home Manager configuration: For more details, see [this](https://discourse.nixos.org/t/guide-to-installing-qt-theme/35523/2) forum post.

### Experimental features

GNOME has a number of experimental options for features not fully completed and thus hidden from the user. As of GNOME 50, these are the experimental features you may want to try out:

### Discover dconf settings

If you wish to discover the corresponding dconf entry for a given setting in a program, you can run `dconf watch /` inside of a terminal and change the setting graphically. For example, when changing toggling the Quick-Settings option "Dark Style" from "on" to "off" and back to "on," this will be the output:

``` shell-session
$ dconf watch /
/org/gnome/desktop/interface/color-scheme
  'default'

/org/gnome/desktop/interface/color-scheme
  'prefer-dark'
```

Otherwise you can use the gsettings programs to inspect the schemas installed on your system. For example, to inspect all the keys contained within `/org/gnome/desktop/background` you could run:

``` shell-session
$ gsettings list-keys org.gnome.desktop.background
color-shading-type
picture-opacity
picture-options
picture-uri
picture-uri-dark
primary-color
secondary-color
show-desktop-icons
```

Then to see the range of possible values for one of the keys such as `picture-options` you could then run:

``` shell-session
$ gsettings range org.gnome.desktop.background picture-options
enum
'none'
'wallpaper'
'centered'
'scaled'
'stretched'
'zoom'
'spanned'
```

Which tells you that the *key* `picture-options` located in *schema* `/org/gnome/desktop/background/` accepts a *value* of type enumeration (a single string value from a set of accepted values).

### Enable system tray icons

GNOME does not currently support system tray icons. However, Ubuntu has created an [extension](https://extensions.gnome.org/extension/615/appindicator-support/) that implements this in the top panel. You can install this extension with the following in NixOS: You can also install the extension outside of Nix and it will function the same.

### Profiling (with sysprof)

Install as a *system* package (it won't work properly if installed against users). Then enable the associated service with

``` nix
services.sysprof.enable = true;
```

### Automatic screen rotation

``` nix
hardware.sensor.iio.enable = true;
```

### Dark mode

Change default color theme for all GTK4 applications to dark using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.

### Excluding GNOME Applications

To exclude certain applications that are installed by default with GNOME, set the module option (Optional Packages: [gnome.nix](https://github.com/NixOS/nixpkgs/blob/nixos-unstable/nixos/modules/services/desktop-managers/gnome.nix#L449-L471)):

## Troubleshooting

### Missing cursor/cursor is a white box

This occurs when installing GNOME from an existing NixOS installation that used a different desktop environment that modified dconf (most likely switching from KDE to GNOME). To easily fix this alongside any number of silent incompatabilities: reset all dconf settings.

``` console
$ dconf reset -f /
```

### Running GConf-based applications

There exist very old applications which use the deprecated GConf service to store configuration. If you are running such an application and are getting an error like:

``` text
GLib.GException: Failed to contact configuration server; the most common cause is a missing or misconfigured D-Bus session bus daemon. See http://projects.gnome.org/gconf/ for information
```

you will need to add `pkgs.gnome2.GConf` to the list of dbus packages in your NixOS configuration like so:

After rebuilding your configuration, restart your desktop session to have GConf take effect.

### Automatic login

For automatic login, include this in your NixOS configuration adjusting the "<your username>" part with your username:

### GDM does not show user

The GDM (GNOME Display Manager) will not display a user if their default shell is not listed in `/etc/shells`. If your shell, such as zsh, is not included in `/etc/shells`, you need to add it to the configuration.

  

## References

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a> <a href="Category:GNOME" class="wikilink" title="Category:GNOME">Category:GNOME</a>

[^1]: Official GNOME Project one-liner <https://www.gnome.org/>
