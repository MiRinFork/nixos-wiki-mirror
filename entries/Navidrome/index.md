<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Navidrome -->

[Navidrome](https://www.navidrome.org) is a self-hosted music streaming server that allows users to manage and play their personal music collections from various devices. Designed with a user-friendly interface, it supports features like playlists, searching, and streaming, all while emphasizing privacy and data ownership.

## Setup

Simply add to your system configuration and apply

``` nix
services.navidrome = {
  enable = true;
  settings.MusicFolder = "/mnt/audio/music";
};
```

The service should be available add <http://127.0.0.1:4533>. Continue adding an admin login including setting a password.

#### Setting to localhost

``` nix
services.navidrome = {
  settings = {
    Address = "0.0.0.0";
  };
};
```

#### Open the Firewall

If it is enabled the following settings will open just for this port

``` nix
services.navidrome = {
  openFirewall = true;
};
```

## Plugins

Navidrome plugins packaged in Nixpkgs can be installed declaratively with the option.

``` nix
{ pkgs, ... }:
{
  services.navidrome = {
    enable = true;

    plugins = with pkgs.navidromePlugins; [
      audiomuseai
      apple-music
      listenbrainz-daily-playlist
      lyrics-plugin
    ];

    # The lyrics plugin bundle is named lyrics-plugin.ndp.
    settings.LyricsPriority = ".ttml,.yaml,.yml,.elrc,.srt,lyrics-plugin,embedded,.lrc,.txt";
  };
}
```

Available packages are exposed under `pkgs.navidromePlugins`. The NixOS module validates the selected packages, builds a Navidrome package containing their `.ndp` bundles, and manages the plugin folder automatically. The Nix attribute name can differ from the installed bundle name; use the attribute names shown above in .

Installing a plugin makes it available to Navidrome. Enable it, grant its requested permissions, and configure plugin-specific settings in the Navidrome web interface under `Settings → Plugins`. Do not set `services.navidrome.settings.Plugins.Folder`, because the NixOS module manages that value.

## Tips and Tricks

#### Import playlists

Place m3u or m3u8 playlist files in a specific folder, configure it in the Navidrome service and after a library scan it should get imported. In this example the playlist files are stored in `/mnt/audio/playlists`.

``` nix
services.navidrome = {
  enable = true;
  settings.PlaylistsPath = "/mnt/audio/playlists";
};
```

#### Enable sharing

Single tracks, albums or playlists can be publicly shared. To enable the feature, add

``` nix
services.navidrome = {
  enable = true;
  settings.EnableSharing = true;
};
```
