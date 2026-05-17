<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: IIO -->

IIO stands for the [Industrial I/O](https://www.kernel.org/doc/html/v4.12/driver-api/iio/index.html) subsystem of the Linux Kernel. It generally provides an interface to sensors like Accelerometers and Light sensors.

## NixOS

The services using the subsystem can be enabled using this configuration in configuration.nix:

``` nix
{ config }:
{
  hardware.sensor.iio.enable = true;
}
```

This will enable [iio-sensor-proxy](https://github.com/hadess/iio-sensor-proxy).

To test, `monitor-sensor` can be used, it will print out the current values of the sensors as they change, periodically. In the event nothing is detected after enabling, rebooting may help.

## Software notes

It is unverified, but GNOME should automatically make use of the data when enabled to handle the rotation and automatic brightness of the display.

## Hardware notes

### Accelerometers

Sometimes, the accelerometers in different devices will be oriented in a way that it specific to that hardware, this is not a *problem*, but it is an *issue* to be considered. The [Accelerometer orientation section](https://github.com/hadess/iio-sensor-proxy#accelerometer-orientation) on the `iio-sensor-proxy` project page explains how to fix this properly for your device. The NixOS specific note is that instead of creating an `hwdb` file, you would add `services.udev.extraHwdb` to your configuration.nix file.

``` nix
{ config }:
{
  services.udev.extraHwdb = ''
    sensor:modalias:acpi:INVN6500*:dmi:*svn*ASUSTeK*:*pn*TP300LA*
     ACCEL_MOUNT_MATRIX=0, 1, 0; 1, 0, 0; 0, 0, 1
  '';
}
```
