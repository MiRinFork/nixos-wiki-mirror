<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Prowlarr -->

[Prowlarr](https://prowlarr.com/) is an indexer manager/proxy built on the popular \*arr .net/reactjs base stack to integrate with your various PVR apps. Prowlarr supports management of both Torrent Trackers and Usenet Indexers. It integrates seamlessly with Lidarr, Mylar3, Radarr, Readarr, and Sonarr offering complete management of your indexers with no per app Indexer setup required

# Setup

Prowlarr is best installed as a service on NixOS in your configuration.nix.

A basic install can be done using the following options:

``` nix
services.prowlarr = {
  enable = true;
  openFirewall = true;
};
```

The `openFirewall` option is used to open port `9696` on the host firewall.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
