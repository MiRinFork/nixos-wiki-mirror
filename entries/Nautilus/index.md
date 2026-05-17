<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nautilus -->

Nautilus is the <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> desktop's file manager. When using Nautilus without GNOME, you may need to enable additional services to get familiar functionality.

## Installation

## Configuration

### Mount, trash, and other virtual filesystems

If <a href="wikipedia:GVfs" class="wikilink" title="GVfs">GVfs</a> is not available, you may see errors such as "Sorry, could not display all the contents of “trash:///”: Operation not supported" when trying to open the trash folder, or be unable to access network filesystems.

To enable GVfs:

Then log out and back in, and verify that the `GIO_EXTRA_MODULES` environment variable is set.

When using X11, this is probably sufficient (though, see the general notes on <a href="GNOME#Running_GNOME_programs_outside_of_GNOME" class="wikilink" title="running GNOME programs outside of GNOME">running GNOME programs outside of GNOME</a>). On Wayland, more effort may be required: [1](https://github.com/NixOS/nixpkgs/issues/128026).

### Mount external drives in sidebar

In a window manager such as <a href="Sway" class="wikilink" title="Sway">Sway</a> it may be necessary to enable [udiskie](https://github.com/coldfix/udiskie) to auto-mount USB devices. See <a href="USB_storage_devices" class="wikilink" title="USB storage devices">USB storage devices</a> for more configuration details. And in Home Manager:

### Gstreamer

Unless you've installed Gstreamer plugins system-wide, the "Audio and Video Properties" pane under the "Properties" menu for media files will say "Oops! Something went wrong. Your GStreamer installation is missing a plug-in."

To enable the A/V Properties and see details like media length, codec, etc, the following <a href="overlays" class="wikilink" title="overlay">overlay</a> may be used:

### HEIC image preview

To enable HEIC image preview in Nautilus, add following to your system configuration

``` nix
environment.systemPackages = [ pkgs.libheif pkgs.libheif.out ];
environment.pathsToLink = [ "share/thumbnailers" ];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>
