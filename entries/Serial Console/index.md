<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Serial Console -->

## Connect to serial device

Most serial console programs require you to specify a serial device and a baud rate.

### With `tio`

``` console
$ tio -b 115200 /dev/ttyS0
```

### With `screen`

``` console
$ screen /dev/ttyS0 115200
```

## Serial devices

Serial devices under NixOS will get expose with the following file names. The file names relate to the driver used for the serial interface.

- `/dev/ttyS*`
- `/dev/ttyUSB*`
- `/dev/ttyACM*`

## Use serial interface as TTY

To use a serial device `ttyS0` as a TTY to log into the device, you have to tell the kernel and you boot loader about the serial configuration.

An example for GRUB bootloader:

``` nix
boot.kernelParams = [ "console=ttyS0,115200n8" ];
boot.loader.grub.extraConfig = "
  serial --speed=115200 --unit=0 --word=8 --parity=no --stop=1
  terminal_input serial
  terminal_output serial
";
```

## Unprivileged access to serial device

Serial devices under NixOS are created with the group `dialout` by default.

All users that are part of the group `dialout` can access serial devices.

Add a user to group `dialout`:

``` nix
users.users.<name>.extraGroups = [ "dialout" ];
```

## Tips

### Serial console wrapping

The remote serial console has no knowledge of your local console. This means that it will wrap with safe defaults.

You can configure the columns/rows of your serial console using `stty`.

In a console sized like yours, e.g. a new tab or tmux window:

``` console
$ echo "stty rows $(tput lines) cols $(tput cols)"
```

This will give you the exact invocation for your current terminal size.

In case tmux is used an alternative is to add the following snippet to the `tmux.conf`:

In this case fixing the terminal size can be achieved by pressing R.

## Serial Console Login

There is a long thread here: <https://github.com/NixOS/nixpkgs/issues/84105>

This configuration seems to work
