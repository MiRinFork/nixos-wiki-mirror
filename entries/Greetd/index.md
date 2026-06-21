<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Greetd -->

[greetd](https://git.sr.ht/~kennylevinsen/greetd) is a minimal and flexible login manager daemon.

## Greeters

### GTKGreet

Using this configuration, greetd will use the greeter [gtkgreet](https://git.sr.ht/~kennylevinsen/gtkgreet), asking for user, password and which session to start as defined in the `/etc/greetd/environments` file:

### ReGreet

[ReGreet](https://github.com/rharish101/ReGreet) is a clean and customizable GTK-based greetd greeter written in Rust. It is meant to be run under a Wayland compositor, such as Sway. Configuration options may be found under [programs.regreet](https://search.nixos.org/options?&query=regreet).

Installation is as simple as enabling it within your configuration.

You can also style and configure ReGreet through Nix easily.

## Automatic startup

In this minimal example, the Wayland compositor <a href="Sway" class="wikilink" title="Sway">Sway</a> automatically gets executed by the user `myuser` after successful boot, no password required:

`initial_session` is executed automatically. If you just define `default_session`, greetd will ask for a password and execute `command` with user `myuser`.

<a href="Category:Wayland" class="wikilink" title="Category:Wayland">Category:Wayland</a>
