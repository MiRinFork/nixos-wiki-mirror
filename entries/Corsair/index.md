<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Corsair -->

[CORSAIR](https://www.corsair.com) is an American computer peripherals and gaming brand.

Its possible to configure its keyboards and mice with an open source driver: [ckb-next](https://github.com/ckb-next/ckb-next)

## Example config for ckb-next

``` nixos
# /etc/nixos/configuration.nix
{ config, pkgs, ... }:

{
  # ...
  hardware.ckb-next.enable = true;
}
```

Seefor more configuration options.

## Limitations

Doing the above will enable the background service *and* install ckb-next. Yet (as of writing) you still have to manually run/open **ckb-next** on launch before it works.

If you find a way to automate this, please append to the wiki!

Not a great way of doing it, but it works for me. Create **~/.config/autostart/ckb-next.desktop**, open it in your favorite text editor and type:

``` desktop
[Desktop Entry]
Categories=Settings;System;
Comment[en_US]=Corsair keyboard driver user interface
Comment=Corsair keyboard driver user interface
Exec=<Location of ckb-next executable> -b
GenericName[en_US]=
GenericName=
Icon=ckb-next
Keywords=ckb;corsair;keyboard;rgb;
MimeType=
Name[en_US]=ckb-next
Name=ckb-next
Path=
StartupNotify=true
Terminal=false
TerminalOptions=
TryExec=<Location of ckb-next executable>
Type=Application
Version=1.0
X-KDE-SubstituteUID=false
X-KDE-Username=
```

*The -b makes it run in the background*

I was also running into [this issue](https://github.com/ckb-next/ckb-next/issues/604) when I was running it manually; by using the .desktop file, I no longer have this issue. Lastly, **every time you get a new version of ckb-next, you'll need to update the path in TryExec and Exec** (both are the same).

A simple way to find the location of ckb-next is to search for it in the Kickoff Application Launcher (or equivalent, not KRunner) \> Right Click \> Edit Application then copy what is in the "Program" field. That way, if you haven't run a clean in a while and have an older version of ckb-next still installed, you're grabbing the right one.

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
