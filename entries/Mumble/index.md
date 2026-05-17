<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mumble -->

[Mumble](https://www.mumble.info/) is an open source voice chat application.

# Install client

To install the Mumble client it is needed to install a package:

``` nix
  environment.systemPackages = with pkgs; [
    mumble
  ];
```

## PulseAudio Support

Add the following to your configuration.nix for [pulseaudio](https://de.wikipedia.org/wiki/PulseAudio) support:

``` nix
{ config, pkgs, ...}:
{
  environment.systemPackages = [
    (pkgs.mumble.override { pulseSupport = true; })
  ];
}
```

# Install Murmur server

Murmur is the server service for Mumble clients. It can be enabled and has several [options](https://search.nixos.org/options?query=murmur) available.

``` nix
  services.murmur = {
    enable = true;
    openFirewall = true;
  };
```

# SuperUser password

The password of the *SuperUser* account is in the logs of murmur, it can be found with:

``` bash
journalctl -u murmur | grep Password
```

The password is also written in the *slog* table in the sqlite database: /var/lib/murmur/murmur.sqlite

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
