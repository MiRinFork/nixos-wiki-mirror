<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: KDE Connect -->

[KDE Connect](https://apps.kde.org/de/kdeconnect/) is an application for the <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a> desktop environment with various functions for integrating a phone and the Linux computer. It allows you to send files to the other device, control its media playback, send remote control inputs, display its notifications and much more.

[KDE Connect](https://apps.kde.org/de/kdeconnect/) is also available for the <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> desktop environment using the [GSConnect](https://extensions.gnome.org/extension/1319/gsconnect/) extension.

## Installation

### <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a>

#### <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>

``` nix
programs.kdeconnect.enable = true;
```

#### <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

``` nix
home-manager.users.username.services.kdeconnect.enable = true;

networking.firewall = rec {
  allowedTCPPortRanges = [ { from = 1714; to = 1764; } ];
  allowedUDPPortRanges = allowedTCPPortRanges;
};
```

### <a href="GNOME" class="wikilink" title="GNOME">GNOME</a> (with [GSConnect](https://extensions.gnome.org/extension/1319/gsconnect/))

#### <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>

``` nix
programs.kdeconnect = {
  enable = true;
  package = pkgs.gnomeExtensions.gsconnect;
};
```

Then it is necessary to enable "[GSConnect](https://extensions.gnome.org/extension/1319/gsconnect/)" extension in the Gnome Extensions application (or via dconf).

#### <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

``` nix
home-manager.users.username.programs.gnome-shell = {
  enable = true;
  extensions = [{ package = pkgs.gnomeExtensions.gsconnect; }];
};

networking.firewall = rec {
  allowedTCPPortRanges = [ { from = 1714; to = 1764; } ];
  allowedUDPPortRanges = allowedTCPPortRanges;
};
```

This will auto-enable the extension via dconf.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:GNOME" class="wikilink" title="Category:GNOME">Category:GNOME</a> <a href="Category:KDE" class="wikilink" title="Category:KDE">Category:KDE</a>
