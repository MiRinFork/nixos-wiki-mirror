<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Libimobiledevice -->

The [libimobiledevice](https://libimobiledevice.org/) project provides libraries and tools to connect and transfer data between iOS devices and Linux machines.

## Usage

### Preparation

In order to be able to automatically mount your iOS device (such as an iPhone) when connecting it or to enable USB tethering, you need to install `libimobiledevice` and to activate the `usbmuxd` service.

Add the following to your `configuration.nix`:

``` nix
services.usbmuxd.enable = true;

environment.systemPackages = with pkgs; [
  libimobiledevice
  ifuse # optional, to mount using 'ifuse'
];
```

If you experience issues mounting or pairing your device (for example as described [here](https://github.com/NixOS/nixpkgs/issues/152592)), you can try to switch the `usbmuxd` daemon package to an alternative more updated implementation, `usbmuxd2`.

``` nix
services.usbmuxd = {
  enable = true;
  package = pkgs.usbmuxd2;
};
```

### Mounting

Mounting the device via iFuse is possible with the following commands

    $ mkdir /tmp/iphone
    $ ifuse /tmp/iphone

### Tethering

Tethering on iOS is possible via Wifi hotspot, Bluetooth or USB. In order to enable USB tethering, first enable tethering in the iOS networking settings. After that run following command

    $ idevicepair pair

Confirm pairing by accepting the connection on your iOS device. After that an ethernet device will appear in your network device list.

## Maintenance

### Factory reset

The following section describes how to perform a hard/factory reset and reinstalling the latest firmware. First install and enable the required daemon and package.

``` nix
services.usbmuxd.enable = true;
environment.systemPackages = with pkgs; [
  idevicerestore
];
```

Shutdown your iDevice and put it into DFU/recovery mode. How to achieve this depends on your iDevice model. See [DFU Mode on the iPhone Wiki](https://www.theiphonewiki.com/wiki/DFU_Mode) for more details.

Once your iDevice is in recovery mode, run following command to reset your device. You will get asked which firmware to install and a final confirmation that everything will be erased.

``` console
# sudo idevicerestore --erase --latest
Found device in DFU mode
Identified device as n69ap, iPhone8,4
The following firmwares are currently being signed for iPhone8,4:
  [1] 15.7 (build 19H12)
Select the firmware you want to restore: 1
Selected firmware 15.7 (build 19H12)
Downloading firmware (https://updates.cdn-apple.com/...)
downloading: 99% ...
Verifying 'iPhone_****.ipsw'...
Checksum matches.
Extracting BuildManifest from IPSW
Product Version: 15.7
Product Build: 19H12 Major: 19
Device supports Image4: true
Variant: Customer Erase Install (IPSW)
This restore will erase your device data.
################################ [ WARNING ] #################################
# You are about to perform an *ERASE* restore. ALL DATA on the target device
# will be IRREVERSIBLY DESTROYED. If you want to update your device without
# erasing the user data, hit CTRL+C now and restart without -e or --erase
# command line switch.
# If you want to continue with the ERASE, please type YES and press ENTER.
#############################################################################
> YES
Checking IPSW for required components...
All required components found in IPSW
Extracting filesystem from IPSW: 078-69441-013.dmg
[========================                          ]  46.9%
```
