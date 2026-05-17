<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: AusweisApp -->

To authenticate online with the German [Personalausweis](https://www.bmi.bund.de/DE/themen/moderne-verwaltung/ausweise-und-paesse/personalausweis/personalausweis-node.html), the [AusweisApp](https://www.ausweisapp.bund.de/ausweisapp-nutzen) desktop app can be used. To interface with the Personalausweis (scanning&entering PIN), one can either use the [mobile AusweisApp](https://f-droid.org/de/packages/com.governikus.ausweisapp2/), which communicates via same WiFi network with the desktop app, or a [dedicated USB device](https://www.ausweisapp.bund.de/usb-kartenleser).

### Using a Smartphone

``` nix
{ pkgs, lib, ... }: {
  # add AusweisApp desktop app
  programs.ausweisapp.enable = true;
  # open firewall for communication with smartphone app
  programs.ausweisapp.openFirewall = true;
}
```

### Using a USB Card Reader

The following config can be used to work with a [ReinerSCT cyberJack RFID standard](https://www.reiner-sct.com/produkt/cyberjack-rfid-standard/). If you have another one, search if there is a [driver in nixpkgs](https://search.nixos.org/packages?&query=pcsc-) and add it to `services.pcscd.plugins` instead.

``` nix
{ pkgs, lib, ... }: {
  # add AusweisApp desktop app
  programs.ausweisapp.enable = true;
  # enable smart card daemon with needed plugin
  services.pcscd.enable = true;
  services.pcscd.plugins = with pkgs; [ pcsc-cyberjack ];
}
```
