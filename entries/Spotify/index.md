<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Spotify -->

[Spotify](https://spotify.com) is a commercial music streaming service.

## Installation

To install the standard Spotify desktop application, add to system packages:

` environment.systemPackages = with pkgs; [`  
`   spotify`  
` ];`

## Local discovery

To sync local tracks from your filesystem with mobile devices in the same network, you need to open port 57621 by adding the following line to your configuration.nix:

``` nix
networking.firewall.allowedTCPPorts = [ 57621 ];
```

In order to enable discovery of Google Cast devices (and possibly other Spotify Connect devices) in the same network by the Spotify app, you need to open UDP port 5353 by adding the following line to your configuration.nix:

``` nix
networking.firewall.allowedUDPPorts = [ 5353 ];
```

## Spotifyd

The alternative client [spotifyd](https://github.com/Spotifyd/spotifyd) is available as a package, [nixos module](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/audio/spotifyd.nix), and [home-manager module](https://github.com/nix-community/home-manager/blob/master/modules/services/spotifyd.nix).

spotifyd can either act as a spotify-connect device and the local LAN without the need to authenticate.[^1] It can also run through a manual login using oauth[^2] If installing spotifyd as a package or as a systemd service via home-manager, give it oauth credentials using:

`spotifyd auth`

The authentication codes are stored in the cache directory for spotifyd.

spotifyd connects to spotify as a spotify-connect device. It offers no controls of its own, but can be controlled via [playerctl](https://github.com/altdesktop/playerctl) or [spotatui](https://github.com/LargeModGames/spotatui).

### Troubleshooting

If you get: `libcurl-gnutls.so.4: no version information`, clear your Spotify cache: `rm -rf ~/.cache/spotify`

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>

[^1]: <https://docs.spotifyd.rs/configuration/auth.html#discovery-on-lan>

[^2]: <https://docs.spotifyd.rs/configuration/auth.html#discovery-on-lan>
