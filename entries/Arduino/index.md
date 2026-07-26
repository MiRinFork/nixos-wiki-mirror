<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Arduino -->

The Arduino ecosystem offers two Versions of the Arduino IDE and an Arduino CLI that both base on. The latter can be used for building Arduino projects with nix.

## Arduino IDE 2.x

The Arduino IDE 2.x is available in nixpkgs as

When trying to upload to your board, you may get the following error:

`Cannot perform port reset: 1200-bps touch: opening port at 1200bps: Permission denied No device found on ttyACM0`

This is a serial port permissions issue. Add your user to the `dialout` group, rebuild your system, then log out and back in or reboot to apply:

``` nix
{
  users.users.<myuser>.extraGroups = [ "dialout" ];
}
```

## Arduino IDE 1.x

This is the old Arduino IDE and it is available as in nixpkgs. It is still used for many projects.

### shell.nix

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
pkgs.callPackage (
  {
    mkShell,
    arduino,
  }:
  mkShell {
    strictDeps = true;
    nativeBuildInputs = [
      arduino
    ];
  }
) { }
```

### Upload program

Upload to an `Arduino Nano` board

``` console
$ time \
arduino --board arduino:avr:nano --port /dev/ttyUSB0 --upload Blink.cpp

Loading configuration...
Initializing packages...
Preparing boards...
Verifying...
Uploading...

real    0m28.913s
```

## Arduino CLI

The Arduino CLI is available as in nixpkgs.

### Build Arduino project with Nix

Ardunio-Nix allows generating all dependencies from an Arduino project as Nix dependencies. The Arduino-Env patch makes it possible to build these Arduino project within Nix.

- Arduino-Nix: <https://github.com/bouk/arduino-nix>
- Ardunio-Env patch: <https://github.com/clerie/arduino-nix/tree/clerie/arduino-env>

## Serial console

See: <a href="Serial_Console" class="wikilink" title="Serial Console">Serial Console</a>

``` console
$ screen /dev/ttyUSB0

$ # set baud rate. default is 9600
$ screen /dev/ttyUSB0 9600
```

see also: <https://wiki.archlinux.org/title/GNU_Screen>

see also: <https://wiki.archlinux.org/title/Working_with_the_serial_console>

## See also

- <a href="Embedded" class="wikilink" title="Embedded">Embedded</a>
- [shell.nix for Arduino IDE](https://discourse.nixos.org/t/arduino-ide-environment/2086)
- [Arduino on archlinux wiki](https://wiki.archlinux.org/title/Arduino)
- [nixduino](https://github.com/boredom101/nixduino)
- [Blink example](https://www.arduino.cc/en/Tutorial/BuiltInExamples/Blink)
- [Arduino on NixOS](https://vid.bina.me/tools/arduino/arduino-on-nixos/)
- [Arduino Connection on NixOS](https://gist.github.com/CMCDragonkai/d00201ec143c9f749fc49533034e5009)
- [Teensy development on NixOS](https://rzetterberg.github.io/teensy-development-on-nixos.html)

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:IDE" class="wikilink" title="Category:IDE">Category:IDE</a>
