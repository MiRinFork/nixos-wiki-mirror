<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Teamspeak -->

[Teamspeak](https://www.teamspeak.com) is an unfree voice chat application mainly used for online games. It is available as client, but its also possible to host an (older) version of Teamspeak as server service.

# Install client

To install the client just add the package:

``` nix
environment.systemPackages = with pkgs; [
  # pick the version you want:
  teamspeak3
  teamspeak5_client
];
```

# Install server

To install a Teamspeak3 server with NixOS for up to 32 users:

``` nix
services.teamspeak3 = {
  enable = true;
  openFirewall = true;
};
```

Because teamspeak has an unfree licence, you also need to accept that manually. Place the following in your config in order to do so.

``` nixos
nixpkgs.config.allowUnfreePredicate = pkg: builtins.elem (lib.getName pkg) [
  "teamspeak-server"
];
```

Teamspeak has several additional options for configuration. To get elevated rights on the server, it is needed to use the ServerAdmin privilege key from the first log in `/var/log/teamspeak3-server`.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
