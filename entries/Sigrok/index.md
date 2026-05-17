<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Sigrok -->

[Sigrok](https://sigrok.org) is an open-source cross-platform signal analysis software suite that supports device like oscilloscopes, thermometers and other data logging devices.

For Sigrok and Sigrok related software such as PulseView to work properly it is necessary to install udev rules that come with the `libsigrok` package. To do so add the following to your config:

``` nix
services.udev = {
    enable = true;
    packages = [ pkgs.libsigrok ];
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
