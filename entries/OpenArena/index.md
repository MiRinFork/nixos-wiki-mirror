<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenArena -->

[OpenArena](https://openarena.ws/) is an open-source fork of Quake 3 Arena.

### Firewall Configuration in NixOS for Local Games

If you want to play OpenArena in a LAN setting (LAN-Party, Office Tournament) the game will not show locally hosted games. That is unless you allow the necessary UDP ports:

``` nixos
  networking.firewall.allowedUDPPorts = [ 27960 27961 27962 27963 ];
```

<a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
