<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Niri -->

<languages/> <translate>

\[<tvar name="1"><https://github.com/niri-wm/niri></tvar> Niri\] is a scrollable-tiling <a href="&lt;tvar_name=&quot;2&quot;&gt;Special:MyLanguage/Wayland&lt;/tvar&gt;" class="wikilink" title="Wayland">Wayland</a> compositor.

## Installation

Simply enable :

</translate>

<translate>

## Configuration

The configuration path for niri is . Therefore <a href="&lt;tvar_name=&quot;1&quot;&gt;Special:MyLanguage/Home_Manager&lt;/tvar&gt;" class="wikilink" title="Home Manager">Home Manager</a> can be used for configuration:

</translate> <translate>

You might want to start from \[<tvar name="1"><https://github.com/niri-wm/niri/blob/main/resources/default-config.kdl></tvar> the default configuration file\] described at \[<tvar name="2"><https://github.com/niri-wm/niri/wiki/Getting-Started#main-default-hotkeys></tvar> here\].

See \[<tvar name="1"><https://niri-wm.github.io/niri/></tvar> the wiki\] for configuration options for niri.

### Greetd

You can start niri with greetd configuration:

</translate>

<translate>

## Additional Setup

As described in \[<tvar name=1><https://github.com/niri-wm/niri/wiki/Example-systemd-Setup></tvar> Example systemd Setup (niri wiki)\], you might want to set up some additional services including <a href="&lt;tvar_name=2&gt;Special:MyLanguage/Swayidle&lt;/tvar&gt;" class="wikilink" title="Swayidle">Swayidle</a>, <a href="&lt;tvar_name=3&gt;Special:MyLanguage/Swaylock&lt;/tvar&gt;" class="wikilink" title="Swaylock">Swaylock</a>, <a href="&lt;tvar_name=4&gt;Special:MyLanguage/Waybar&lt;/tvar&gt;" class="wikilink" title="Waybar">Waybar</a>, <a href="&lt;tvar_name=5&gt;Special:MyLanguage/Polkit&lt;/tvar&gt;" class="wikilink" title="Polkit">Polkit</a> and <a href="&lt;tvar_name=6&gt;Special:MyLanguage/Secret_Service&lt;/tvar&gt;" class="wikilink" title="Secret Service">Secret Service</a> as follows to complement the functionality of a regular window manager. Some of the these settings are also required to enable all the features of \[<tvar name=7><https://github.com/niri-wm/niri/blob/main/resources/default-config.kdl></tvar> the default configuration file\]. </translate>

<translate> Or using <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Home_Manager&lt;/tvar&gt;" class="wikilink" title="Home Manager">Home Manager</a>: </translate>

<translate>

## Troubleshooting

### IME not working on Electron apps

There is a general workaround to set as described in <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Wayland#Electron_and_Chromium&lt;/tvar&gt;" class="wikilink" title="Wayland#Electron_and_Chromium">Wayland#Electron_and_Chromium</a>: </translate>

<translate> However, since niri does not support text-input-v1, sometimes enabling text-input-v3 by manually adding flag is necessary for IME to work: </translate>

``` console
$ slack --wayland-text-input-version=3
```

<translate> `wrapProgram` may be used to add the flag automatically: </translate>

<translate>

### XWayland apps not working

There is a optional dependency for niri which is highly recommended to install (you can read \[<tvar name=1><https://github.com/niri-wm/niri/wiki/Xwayland></tvar> this\] article to learn more about this) </translate>

<translate> Or using <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Home_Manager&lt;/tvar&gt;" class="wikilink" title="Home Manager">Home Manager</a> </translate>

<translate> After you installed niri will integrate it out of the box and all of your XWayland apps will function properly.

### File picker not working

If you are using `xdg-desktop-portal-gnome`, it will attempt to use Nautilus as the file picker, which will fail if Nautilus is not installed.

To work around this problem, you can force usage of the gtk or kde portals for file picker instead: </translate>

<translate>

### Waybar launches twice

When using a configuration option like programs.waybar.enable, waybar may launch twice on Niri. This is because the \[<tvar name=1><https://github.com/niri-wm/niri/blob/b07bde3ee82dd73115e6b949e4f3f63695da35ea/resources/default-config.kdl#L271></tvar> default Niri config file launches waybar on launch\]. Remove the spawn-at-startup "waybar" from the config file, or add waybar to your systems packages without using the home-manager option.

## See Also

- <a href="&lt;tvar_name=1&gt;Special:MyLanguage/Wayland&lt;/tvar&gt;" class="wikilink" title="Wayland">Wayland</a>
- <a href="&lt;tvar_name=2&gt;Special:MyLanguage/Sway&lt;/tvar&gt;" class="wikilink" title="Sway">Sway</a>
- <a href="&lt;tvar_name=3&gt;Special:MyLanguage/Wallpapers_for_Wayland&lt;/tvar&gt;" class="wikilink" title="Wallpapers for Wayland">Wallpapers for Wayland</a>
- \[<tvar name=4><https://github.com/sodiboo/niri-flake/></tvar> niri-flake\]

</translate>

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications{{#translation:}}" class="wikilink" title="Category:Applications{{#translation:}}">Category:Applications{{#translation:}}</a>
