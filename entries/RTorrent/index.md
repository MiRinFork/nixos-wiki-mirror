<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: RTorrent -->

rTorrent is a bittorrent client by rakshasa (Jari Sundell). The active development restarted in 2024, thanks to donations to the developer. Concurrently the development of the web client ruTorrent was restarted by a hosting company (xirvik.com). Both the program and the web client have frequent releases as of November 2026, with optimizations, bugfixes and security patches applied. The rTorrent author released 0.16.27 on October 28, 2026 and is targeting a 1.0 release in the near future.

This article describes how to set up both the torrent client and the web client, performance tuning, and how to override the old version shipped in nixpkgs.

# Use newer version with overlay

``` nix
{ config, lib, pkgs, ... }:

{
  nixpkgs.overlays = [
    (final: prev:
    {
      rtorrent = prev.rtorrent.overrideAttrs (finalAttrs: prevAttrs: {
        version = "0.16.27";
        src = prev.fetchFromGitHub {
          owner = "rakshasa";
          repo = "rtorrent";
          tag = "v${finalAttrs.version}";
          hash = "to_be_filled_during_nixos_switch";
        };
        # unnecessary copy commands for manpage in postInstall in nixpkgs
        postInstall = null;
        outputs = [ "out" ];
      });
      libtorrent-rakshasa = prev.libtorrent-rakshasa.overrideAttrs (finalAttrs: prevAttrs: {
        version = "0.16.27";
        src = prev.fetchFromGitHub {
          owner = "rakshasa";
          repo = "libtorrent";
          tag = "v${finalAttrs.version}";
          hash = "to_be_filled";
        };
      });
      rutorrent = prev.rutorrent.overrideAttrs (finalAttrs: prevAttrs: {
        version = "5.3.20";
        src = prev.fetchFromGitHub {
          owner = "Novik";
          repo = "ruTorrent";
          tag = "v${finalAttrs.version}";
          hash = "to_be_filled";
        };
      });
    }
    )
  ];
}
```

# rTorrent with Flood

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

# rTorrent with ruTorrent

I exclusively use `ssh -N -L 8080:localhost:80 my.rtorrent.com` for accessing the web interface. In this case it is available at [1](http://localhost:8080). Authentication and encryption is provided by SSH.

``` nix
{ config, lib, pkgs, ... }:

{
  
  services.rutorrent = {
    enable = true;
    nginx.enable = true;
    hostName = "bittorrent.lan";
    plugins = [
      # https://github.com/Novik/ruTorrent/wiki/Plugins
      "httprpc"
      # adds the column with the torrent's finishing time to torrents list
      "seedingtime"
      # adds pt tracker name column
      "tracklabels"
    ];
  };

  # fix rutorrent not accepting large torrents
  # https://github.com/NixOS/nixpkgs/issues/444930
  services.phpfpm.phpOptions = ''
    upload_max_filesize = 64M
    max_file_uploads = 200
    post_max_size = 128M
  '';

  services.rtorrent = {
    enable = true;
    openFirewall = true;
    port = 51413;
    dataPermissions = "0755";
    # must use default /var/lib/rtorrent
    # anywhere else has permission problems
    # zfs dataset mount at /var/lib/rtorrent
  };

}
```

# Performance Tuning

``` nix
{ config, lib, pkgs, ... }:

{
  systemd.services.rtorrent.serviceConfig.LimitNOFILE = 10240;

  # https://raw.githubusercontent.com/NixOS/nixpkgs/refs/heads/nixos-25.05/nixos/modules/services/torrent/transmission.nix
  # performance tuning
  # https://github.com/rakshasa/rtorrent/wiki/Performance-Tuning#system-wide-settings
  boot.kernel.sysctl = {
    # Increase the number of available source (local) TCP and UDP ports to 49151.
    # Usual default is 32768 60999, ie. 28231 ports.
    # Find out your current usage with: ss -s
    "net.ipv4.ip_local_port_range" = mkDefault "16384 65535";
    # Maximum Socket Receive Buffer. 16MB per socket - which sounds
    # like a lot, but will virtually never consume that much. Default:
    # 212992
    "net.core.rmem_max" = 16777216;
    # Maximum Socket Send Buffer. 16MB per socket - which sounds like
    # a lot, but will virtually never consume that much. Default:
    # 212992
    "net.core.wmem_max" = 16777216;
    # Increase the write-buffer-space allocatable: min 4KB, def 12MB,
    # max 16MB. Default: 4096 16384 4194304
    "net.ipv4.tcp_wmem" = "4096 12582912 16777216";
    # Increase the read-buffer-space allocatable: min 4KB, def 12MB,
    # max 16MB. Default: 4096 16384 4194304
    "net.ipv4.tcp_rmem" = "4096 12582912 16777216";
    # Tells the system whether it should start at the default window
    # size only for new TCP connections or also for existing TCP
    # connections that have been idle for too long. Default: 1
    "net.ipv4.tcp_slow_start_after_idle" = 0;
    # Allow reuse of sockets in TIME_WAIT state for new connections
    # only when it is safe from the network stack’s
    # perspective. Default: 0
    "net.ipv4.tcp_tw_reuse" = 1;
    # Minimum time a socket will stay in TIME_WAIT state (unusable
    # after being used once). Default: 60
    "net.ipv4.tcp_fin_timeout" = 30;
  }; 
}
```

# Use customized rtorrent.rc

By default, rtorrent.rc is generated by Nix. But the auto-generated file does not do justice to the versatility of rtorrent configuration. By using a customized rtorrent.rc file, you can choose what should happen when a torrent has finished downloading, whether to erase the torrent data when the torrent file is removed, and much more. A further motivation is that, with the rapid development of rtorrent as of Nov. 2026, the configuration file format is changing. For best results, one should directly apply recommendations found in the rtorrent GitHub repo instead of relying on nix auto-generation.

The following is a minimal working example, which shows how you could combine the power of nix with a custom rtorrent.rc configuration file.

**Warning**: The example below was only tested with v0.16.27. Some commands were newly introduced and thus incompatible with older releases.

``` nix
{ pkgs, lib, config, ... }:
{
  # this is a minimal working example with inessential comments pruned.
  # Tested on rTorrent v0.16.27.  Incompatible with older rTorrent releases
  # see https://github.com/rakshasa/rtorrent/blob/master/doc/rtorrent.rc-example
  # for commented configuration
  # https://raw.githubusercontent.com/NixOS/nixpkgs/refs/heads/nixos-26.05/nixos/modules/services/torrent/rtorrent.nix
  services.rtorrent.configText = lib.mkForce ''
    # prefer ipv6, allow ipv4
    network.prefer.ipv6.set = true

    # Instance layout (base paths)
    method.insert = cfg.basedir, private|const|string, (cat,"${config.services.rtorrent.dataDir}/")
    method.insert = cfg.logs,    private|const|string, (cat,(cfg.basedir),"log/")
    method.insert = cfg.logfile, private|const|string, (cat,(cfg.logs),(system.time),".log")
    method.insert = cfg.rpcsock, private|const|string, (cat,"${config.services.rtorrent.rpcSocket}")
    method.insert = cfg.download, private|const|string, (cat,(cfg.basedir),"download/")
    execute.throw = sh, -c, (cat, "mkdir -p ", (cfg.basedir), "/session ", (cfg.logs), " ", (cfg.download))

    # erase torrent data when the torrent is deregistered from rtorrent
    # uses new style syntax
    # https://github.com/rakshasa/rtorrent/wiki/Parentheses-and-Braces-Syntax
    method.set_key = event.download.erased,delete_erased,((execute.nothrow.bg, rm, -rf, --, ((d.base_path)) ))

    dht.mode.set = auto
    directory.default.set = (cfg.download)
    session.path.set = (cat, (cfg.basedir), "session/")
    execute.nothrow = sh, -c, (cat, "echo >", (session.path), "rtorrent.pid", " ", (system.pid))
    network.listen.port.random.set = no
    network.listen.port.range.set = ${toString config.services.rtorrent.port}-${toString config.services.rtorrent.port}
    network.xmlrpc.size_limit.set = 8M
    pieces.hash.on_completion.set = no
    protocol.encryption.set = allow
    protocol.pex.set = yes
    system.cwd.set = (cfg.basedir)

    # umask 0022 corresponds to drwxr-xr-x
    system.umask.set = 0022

    # Logging
    log.execute = (cat, (cfg.logs), "execute.log")
    log.open_file = "log", (cfg.logfile)
    log.add_output = "errors", "log"
    log.add_output = "events", "log"

    # XMLRPC
    network.scgi.open_local = (cfg.rpcsock)
    execute.nothrow = chmod,770,(cfg.rpcsock)

    # zfs supports basic fallocate to prevent fragmentation
    # https://github.com/rakshasa/rtorrent/wiki/Performance-Tuning
    # https://github.com/openzfs/zfs/issues/326
    system.file.allocate = 1
  '';
}
```

# Control rtorrent with pyrosimple

Pyrosimple is a collection of tools for working with rTorrent. With pyrosimple, you can do everything ranging from making low-level RPC calls, to running a full-fledged daemon that will manage rTorrent according to user-defined rules.

It has not been updated since early 2025, so there are compatibility issues with latest rTorrent versions. However, it is still useful for performing operations with rTorrent. An example is pruning orphaned torrents, i.e., torrents that are removed from rTorrent but still occupy disk space.

We first generate a sorted list of torrents currently registered in rTorrent

`nix-shell -p pyrosimple jq`  
`rtxmlrpc --output-format json -U scgi+unix:///run/rtorrent/rpc.sock \`  
`d.multicall '' default d.name= > torrent_list.json`

Use jq to extract file names

`jq -r '.[].[0]' torrent_list.json | sort > torrent_list_sorted.txt`

Generate a list of files currently on disk

`find /var/lib/rtorrent/download/ -mindepth 1 \`  
`-maxdepth 1 -type d -printf "%f\n" \`  
`| sort > torrent_list_on_disk_sorted.txt`

Then compare the results

`diff  torrent_list_on_disk_sorted.txt  torrent_list_sorted.txt`

Further documentation on pyrosimple can be found on its website <https://kannibalox.github.io/pyrosimple/>

**Warning**: Do not use configuration generated by pyrosimple, the result is incompatible with newer rtorrent versions. See for example <https://github.com/kannibalox/pyrosimple/issues/80>

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
