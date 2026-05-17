<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Pantheon -->

Pantheon is a simple yet beautiful desktop environment made for [elementary OS](https://elementary.io/). The Pantheon desktop environment is built on top of the <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> software base, i.e. GTK, GDK, GLib, GVfs, etc. with Vala programming language.

This article is an extension of the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#chap-pantheon).

## Installing Pantheon Desktop Environment

To use the Pantheon, add this to your configuration.nix:

``` nix
services.xserver.enable = true;
# For NixOS 25.05 or older
services.xserver.desktopManager.pantheon.enable = true;
# For NixOS 25.11 or later
services.desktopManager.pantheon.enable = true;
```

This automatically enables <a href="LightDM" class="wikilink" title="LightDM">LightDM</a> and Pantheon's LightDM greeter. If you'd like to disable this, set

``` nix
services.xserver.displayManager.lightdm.greeters.pantheon.enable = false;
services.xserver.displayManager.lightdm.enable = false;
```

be aware using Pantheon without LightDM as a display manager will break screenlocking from the UI. The NixOS module for Pantheon installs all of Pantheon's default applications. If you'd like to not install Pantheon's apps, set

``` nix
services.pantheon.apps.enable = false;
```

You can also use to remove any other app (like elementary-mail).

## Wingpanel and Switchboard plugins

Wingpanel and Switchboard work differently than they do in other distributions, as far as using plugins. You cannot install a plugin globally (like with option `environment.systemPackages`) to start using it. You should instead be using the following options:

- `services.xserver.desktopManager.pantheon.extraWingpanelIndicators` (for NixOS 25.11 or later, `services.desktopManager.pantheon.extraWingpanelIndicators`)
- `services.xserver.desktopManager.pantheon.extraSwitchboardPlugs` (for NixOS 25.11 or later, `services.desktopManager.pantheon.extraSwitchboardPlugs`)

to configure the programs with plugs or indicators.

The difference in NixOS is both these programs are patched to load plugins from a directory that is the value of an environment variable. All of which is controlled in Nix. If you need to configure the particular packages manually you can override the packages like:

``` nix
wingpanel-with-indicators.override {
  indicators = [
    pkgs.some-special-indicator
  ];
};

switchboard-with-plugs.override {
  plugs = [
    pkgs.some-special-plug
  ];
};
```

please note that, like how the NixOS options describe these as extra plugins, this would only add to the default plugins included with the programs. If for some reason you'd like to configure which plugins to use exactly, both packages have an argument for this:

``` nix
wingpanel-with-indicators.override {
  useDefaultIndicators = false;
  indicators = specialListOfIndicators;
};

switchboard-with-plugs.override {
  useDefaultPlugs = false;
  plugs = specialListOfPlugs;
};
```

this could be most useful for testing a particular plug-in in isolation.

## Frequently Asked Questions

### I have switched from a different desktop and Pantheon’s theming looks messed up.

Open Switchboard (System Settings) and go to: Administration → System → Restore Default Settings → Restore Settings. This will reset any `dconf` settings to their Pantheon defaults. Note this could reset certain GNOME-specific preferences if that desktop was used prior.

### I cannot enable both GNOME and Pantheon.

This is a known [issue](https://github.com/NixOS/nixpkgs/issues/64611) and there is no known workaround except for Nix <a href="Specialisation" class="wikilink" title="Specialisation">Specialisation</a> with either different user setups (one for GNOME and another for Pantheon) or <a href="Impermanence" class="wikilink" title="Impermanence">Impermanence</a> setup with no persistent home so that configs and themes do not conflict.

### Does AppCenter work, or is it available?

AppCenter has been available since 20.03. Starting from 21.11, the Flatpak backend should work so you can install some Flatpak applications using it. However, due to missing appstream metadata, the Packagekit backend does not function currently. See this [issue](https://github.com/NixOS/nixpkgs/issues/15932).

If you are using Pantheon, AppCenter should be installed by default if you have Flatpak support enabled. If you also wish to add the appcenter Flatpak remote:

``` shell
flatpak remote-add --if-not-exists appcenter https://flatpak.elementary.io/repo.flatpakrepo
```

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
