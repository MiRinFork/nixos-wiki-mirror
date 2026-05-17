<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: GNOME/Calendar -->

The [Gnome calendar](https://wiki.gnome.org/Apps/Calendar) is the desktop calendar application built into GNOME.

## Using Gnome Calendar outside of GNOME

To use the gnome calendar outside of gnome, you need the following lines in your configuration.nix:

``` nix
{
  programs.dconf.enable = true;
  services.gnome.evolution-data-server.enable = true;
  # optional to use google/nextcloud calendar
  services.gnome.gnome-online-accounts.enable = true;
  # optional to use google/nextcloud calendar
  services.gnome.gnome-keyring.enable = true;
}
```

External calendar such as google/nextcloud can be only added via the gnome-control-center:

``` console
$ nix-shell -p gnome-control-center --run "gnome-control-center"
```

then add your accounts in the "Online Accounts" submenu.

If gnome-control-center will not launch, it's possible the value of XDG_CURRENT_DESKTOP needs to be changed to GNOME during launch. This is the case when using the Hyprland window manager.

``` console
$ XDG_CURRENT_DESKTOP=GNOME gnome-control-center
```

This should launch gnome-control-center and allow you to access the Online Accounts submenu.

To get alarm reminders you need to start the evolution-alarm-notify daemon provided by the `gnome.evolution-data-server` package. When you enable `services.gnome.evolution-data-server.enable` it will add a desktop autostart entry to `/run/current-system/sw/etc/xdg/autostart/org.gnome.Evolution-alarm-notify.desktop`. If your desktop manager does not process autostart entries, you can use [dex](https://github.com/jceb/dex) instead:

``` console
$ dex --autostart
```

As an alternative you can start `libexec/evolution-data-server/evolution-alarm-notify` from the `gnome.evolution-data-server` directly.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
