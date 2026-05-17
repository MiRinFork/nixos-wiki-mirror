<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Plymouth/en -->

<languages/> <span lang="en" dir="ltr">[Plymouth](https://www.freedesktop.org/wiki/Software/Plymouth) is an application that runs early in the boot process, providing a graphical boot animation, it is used by most desktop-oriented Linux distributions.</span>

## <span lang="en" dir="ltr">Usage</span>

<span lang="en" dir="ltr">As an example, you can use a boot animation from [adi1090x's collection](https://github.com/adi1090x/plymouth-themes) like so:</span>

<span lang="en" dir="ltr">During the graphical boot process, it is possible to switch to text mode and back by pressing the escape key.

If you are using LUKS encryption and the password prompt falls back to text mode, it may help to switch to initrd-systemd mode:</span lang="en" dir="ltr">

``` nix
boot.initrd.systemd.enable = true;
```

<span lang="en" dir="ltr">While the default `bgrt` theme supports graphical password entry, this may not be supported by all themes.</span lang="en" dir="ltr">

<a href="Category:Booting{{#translation:}}" class="wikilink" title="Category:Booting{{#translation:}}">Category:Booting{{#translation:}}</a>
