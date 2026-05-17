<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Swayidle -->

[Swayidle](https://github.com/swaywm/swayidle) is an idle management daemon for Wayland.

## Installation

### Standalone

### Home Manager - Standalone

### Home Manager - Through Sway

## Configuration

Swayidle has a lot of flexibility in its setup, but what is usually done is as follows:

1.  Send notification before doing the following
2.  Lock screen (typically <a href="Swaylock" class="wikilink" title="Swaylock">Swaylock</a> is used)
3.  Turn off the screen (Note that the command may differ among window managers)
4.  Suspend the system

which could be set using . is useful to make the behavior consistent with the above in case , are manually run.

Additional options may be found within the Home Manager Appendix under [services.swayidle](https://nix-community.github.io/home-manager/options.xhtml#opt-services.swayidle.enable).

See [the man page](https://man.archlinux.org/man/extra/swayidle/swayidle.1.en) for further information.

<a href="Category:Wayland" class="wikilink" title="Category:Wayland">Category:Wayland</a>
