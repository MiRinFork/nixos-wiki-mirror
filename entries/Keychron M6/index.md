<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Keychron M6 -->

This page is for tips for usage of the [Keychron M6](https://www.keychron.com/products/keychron-m6-wireless-mouse). The Keychron M6 uses a web app called "Keychron Launcher", in order to use it you may need to configure proper udev rules in order to interface with the web page.

## Keychron Launcher

You will need to use a Chromium based browser. The {idProduct} on the second and third line of the config will need to reflect your device id, which may differ depending on your model (The provided example is on a 8k variant). To get this value install the [usbutils](https://search.nixos.org/packages?&query=lsusb&show=usbutils) package, and either plug in the mouse by cable, or using the wireless dongle.

Run to get your {idProduct} value (Bluetooth is not supported by the web app).

``` console
$ lsusb -d 3434:
```

The value will be different depending on if you are connected via cable or the dongle. You can use the same command on both if you would like to add both options.
