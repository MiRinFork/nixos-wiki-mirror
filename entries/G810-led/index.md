<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: G810-led -->

Some Logitech keyboards have LEDs. [G810-led](https://github.com/MatMoul/g810-led) is a LED controller for Logitech G213, G410, G413, G512, G513, G610, G810, g815, G910 and GPRO keyboards.

## Installation

The program [MatMoul/g810-led](https://github.com/MatMoul/g810-led) is provided by the package `pkgs.g810-led`.

To be able to run it, you should add the following udev config :

``` nix
services.udev = {
  packages = [
    pkgs.g810-led
  ];
};
```

After a `nixos-rebuild switch` you should be able to run `g810-led -a ff0000`.

## Add colors at keyboard plug

Currently, you need to run this command after you plug your keyboard in, with the following udev rule, you are able to run the command automatically after any USB device is plugged in :

``` nix
services.udev = {
  packages = [
    pkgs.g810-led
  ];
  extraRules = ''
    ACTION=="add", SUBSYSTEM=="usb", RUN+="${pkgs.g810-led}/bin/g810-led -a 0000ff"
  '';
};
```

<a href="Category:_Hardware" class="wikilink" title="Category: Hardware">Category: Hardware</a>
