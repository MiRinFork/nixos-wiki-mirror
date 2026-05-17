<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Navidrome -->

[Navidrome](https://www.navidrome.org) is a self-hosted music streaming server that allows users to manage and play their personal music collections from various devices. Designed with a user-friendly interface, it supports features like playlists, searching, and streaming, all while emphasizing privacy and data ownership.

### Setup

Simply add to your system configuration and apply

``` nix
services.navidrome = {
  enable = true;
  settings.MusicFolder = "/mnt/audio/music";
};
```

The service should be available add <http://127.0.0.1:4533>. Continue adding an admin login including setting a password.

### Tips and tricks

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
