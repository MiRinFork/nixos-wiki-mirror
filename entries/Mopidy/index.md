<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mopidy -->

Mopidy is an MPD-compatible music server written in Python.

On NixOS, Mopidy is configured via the `services.mopidy` options.

## Extensions

[Mopidy extensions](https://mopidy.com/ext/) are installed by adding their package to `services.mopidy.extensionPackages`.

### mopidy-youtube

By default, the `mopidy-youtube` extension relies on [youtube-dl](https://github.com/ytdl-org/youtube-dl) as the backend for downloading from YouTube, but it can be configured to use a compatible alternative backend such as [yt-dlp](https://github.com/yt-dlp/yt-dlp). Due to the way Mopidy extensions are implemented in nixpkgs, to add another module to the Python environment of `mopidy-youtube`, the mopidy package set must be overridden like so:

``` nix
services.mopidy = let
  mopidyPackagesOverride = pkgs.mopidyPackages.overrideScope (prev: final: {
    extraPkgs = pkgs: [ pkgs.yt-dlp ];
  });
in {
  extensionPackages = with mopidyPackagesOverride; [
    mopidy-youtube
  ];
  configuration = ''
    [youtube]
    youtube_dl_package = yt_dlp
  '';
}
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
