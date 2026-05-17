<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Snapcast -->

> Snapcast is a multiroom client-server audio player, where all clients are time synchronized with the server to play perfectly synced audio. It's not a standalone player, but an extension that turns your existing audio player into a Sonos-like multiroom solution. Audio is captured by the server and routed to the connected clients. Several players can feed audio to the server in parallel and clients can be grouped to play the same audio stream.

<https://github.com/badaix/snapcast>

Note that MPD can directly act as a Snapcast audio source (see <https://mpd.readthedocs.io/en/stable/plugins.html#snapcast>). However, it does not provide all features of a Snapcast server such as the web interface.

## Pipewire Sink

Both pulseaudio and pipewire can create a virtual audio sink that uses a FIFO queue to stream audio data into Snapcast.

First create a local snapserver instance that creates the FIFO queue to stream into.

``` nix
  services.snapserver = {
    enable = true;
    settings = {
      stream.source = "pipe:///run/snapserver/pipe?name=NAME";
    };
    openFirewall = true;
  };
```

Tell Pipewire about the sink used by Snapcast.

``` nix
  services.pipewire.extraConfig.pipewire-pulse."40-snapcast-sink" = {
    "pulse.cmd" = [
      {
        cmd = "load-module";
        args = "module-pipe-sink file=/run/snapserver/pipe sink_name=Snapcast format=s16le rate=48000";
      }
    ];
  };
```

There is a new direct connection of Pipewire with Snapcast in the making. However, as of March 16, 2026, the version of Pipewire in Nixpkgs (1.4.X) does not support this new feature yet (available starting with Pipewire version 1.6.0).

## Playback

To have local audio synced up with remote clients it needs to be routed through a local snapclient instance.

``` nix
  systemd.user.services.snapclient-local = {
    wantedBy = [
      "pipewire.service"
    ];
    after = [
      "pipewire.service"
    ];
    serviceConfig = {
      ExecStart = "${pkgs.snapcast}/bin/snapclient --player pipewire tcp://localhost:1704";
    };
  };
```

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a>
