<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Apple -->

## Identifying your computer

``` console
$ cat /sys/devices/virtual/dmi/id/product_{family,name}
MacBook
MacBook2,1
```

The last line is the *'version* field; the key to your success. This will allow you to identify with great accuracy the hardware. Fixes for other versions may apply too, but the greater the gap between revisions, the less likely it is to work.

## Auto Restart

Older Apple hardware had an elegent solution to enable automatic restart on power failure. The physical power button, when depressed, could be rotated through 90 degrees and in this position it remained permanently on. This function is now handled through software setting registers in the PMU, except that in some models this setting does not persist across reboots. the following may be of help if you are looking to use a Mac-Mini as a server

``` nix
# https://blog.dhampir.no/content/linux-on-mac-mini-power-on-after-power-loss

{ config, pkgs, options, lib, ... }:

with lib; 

let
  register = { 
    "mini_white_intel+nVidia" = "00:03.0 0x7b.b=0x19";
    "mini_white_intel" = "0:1f.0 0xa4.b=0";
    "mini_unibody_intel" = "0:3.0 -0x7b=20";
    "mini_unibody_M1" = "?";
  };

in

{
  options.hardware.macVariant = mkOption {
    type = types.enum (attrNames register);
    default = elemAt (attrNames register) 0;
    example = elemAt (attrNames register) 0;
    description = "Minor hardware variants have different registers for enabling autostart";
  };

  # https://www.linuxfromscratch.org/blfs/view/svn/general/pciutils.html
  config.environment.systemPackages = with pkgs; [ pciutils ];

  # Needs to run every reboot
  config.systemd.services.enable-autorestart = {
    script = ("/run/current-system/sw/bin/setpci -s " + (getAttr config.hardware.macVariant register)) ;
    wantedBy = [ "default.target" ];
    after = [ "default.target" ]; 
  };
}
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
