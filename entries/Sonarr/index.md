<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Sonarr -->

[Sonarr](https://sonarr.tv/) is a PVR for Usenet and BitTorrent users. It can monitor multiple RSS feeds for new episodes of your favorite shows and will grab, sort and rename them. It can also be configured to automatically upgrade the quality of files already downloaded when a better quality format becomes available.

# Setup

Sonarr is best installed as a service on NixOS in your configuration.nix.

A basic install can be done using the following options:

``` nix
services.sonarr = {
  enable = true;
  openFirewall = true;
};
```

The `openFirewall` option is used to open port `8989` on the host firewall.

# Further configuration

Sonarr can be further configured using NixOS options.

``` nix
services.sonarr = {
  ...
  user = "user";
  group = "group";
  dataDir = "path/to/directory"
};
```

Both the `user` and `group` options are used to specify which user and group is used to run Sonarr. The `dataDir` option specifies the directory where Sonarr stores its data files, and can be set to a custom location. When setting the `dataDir` option, be careful of permissions as a specified user still needs the correct read/write permissions in this directory.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
