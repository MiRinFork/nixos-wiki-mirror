<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Immersed -->

[Immersed](https://immersed.com/) is a virtual and augmented reality application for work and productivity.

It is packaged as 'immersed-vr' in Nixpkgs, but in order to work on NixOS, you will need additional OpenGL libraries.

``` nixos
hardware.graphics = {
    enable = true;
    enable32Bit = true;
    extraPackages = with pkgs; [ libva vaapiVdpau ];
};
```

As of April 2024, the support for Wayland is experimental. The first version to support it is in this [pull request](https://github.com/NixOS/nixpkgs/pull/299955). On Gnome, you might also have to turn on accessibility zoom (if you set it to 100% it does not change the appearance) to see your mouse cursor.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
