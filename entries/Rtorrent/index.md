<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rtorrent -->

rtorrent is a bittorrent client. This article discusses integrations of rtorrent with other graphical interfaces such as flood.

### Integration with flood-js via UNIX sockets

rtorrent can open a socket which other software can use to interface with. No unprotected RPC socket of rtorrent is required with this setup and it therefore provides a higher security standard.

``` nix
{ config, lib, pkgs, ... }:

let
  peer-port = 51412;
  web-port = 8112;
in {
  
  services.rtorrent = {
    enable = true;
    port = peer-port;
    package = pkgs.rtorrent; # (2025-07-28) upstream develop of rtorrent continued, jesec-rtorrent does not build in nixpkgs
    openFirewall = true;
  };
  # If you have lots of torrents in the seed you may see rtorrent stack-trace with "too many open files"
  # to increase the limit of open files use:
  systemd.services.rtorrent.serviceConfig.LimitNOFILE = 16384;

  services.flood = {
    enable = true;
    port = web-port;
    openFirewall = true;
    extraArgs = ["--rtsocket=${config.services.rtorrent.rpcSocket}"];
  };
  # allow access to the socket by putting it in the same group as rtorrent service
  # the socket will have g+w permissions
  systemd.services.flood.serviceConfig.SupplementaryGroups = [ config.services.rtorrent.group ];
}
```

Sample configuration is to be put into **rtorrent.nix** and imported in your **configuration.nix** via:

`{`  
`  imports = [ ./rtorrent.nix ];`  
`}`

After performing **nixos-rebuild switch** on port <http://localhost:8112> the flood service should run.

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
