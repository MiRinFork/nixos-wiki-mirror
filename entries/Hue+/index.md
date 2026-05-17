<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hue+ -->

HUE+ is a digital lighting solution for the PC by [NZXT](https://nzxt.com).

As of writing, there is no native NixOS configuration for it. However, with the open source program [hue-plus](https://github.com/kusti8/hue-plus) and a simple systemd service, this can be done easily.

# Example config

``` nixos
# /etc/nixos/configuration.nix
{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    # ...
    hue-plus
    # ...
  ];
  
  systemd.services.nzxthue = {
    # You can obviously the candlelight mode & value! I just think this looks nice <3
    script= "${pkgs.hue-plus}/bin/hue candlelight ff3700";
    wantedBy = [ "multi-user.target" ];
  };
}
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
