<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Serial Console -->

## Connect to serial device

Most serial console programs require you to specify a serial device and a baud rate.

### With `tio`

` tio -b 115200 /dev/ttyS0`

### With `screen`

` screen /dev/ttyS0 115200`

## Serial devices

Serial devices under NixOS will get expose with the following file names. The file names relate to the driver used for the serial interface.

- `/dev/ttyS*`
- `/dev/ttyUSB*`
- `/dev/ttyACM*`

## Use serial interface as TTY

To use a serial device `ttyS0` as a TTY to log into the device, you have to tell the kernel and you boot loader about the serial configuration.

An example for GRUB bootloader:

` boot.kernelParams = [ "console=ttyS0,115200n8" ];`  
` boot.loader.grub.extraConfig = "`  
`   serial --speed=115200 --unit=0 --word=8 --parity=no --stop=1`  
`   terminal_input serial`  
`   terminal_output serial`  
` ";`

## Unprivileged access to serial device

Serial devices under NixOS are created with the group `dialout` by default.

All users that are part of the group `dialout` can access serial devices.

Add a user to group `dialout`:

`   users.users.`<name>`.extraGroups = [ "dialout" ];`

## Tips

### Serial console wrapping

The remote serial console has no knowledge of your local console. This means that it will wrap with safe defaults.

You can configure the columns/rows of your serial console using `stty`.

In a console sized like yours, e.g. a new tab or tmux window:

`$ echo "stty rows $(tput lines) cols $(tput cols)"`

This will give you the exact invocation for your current terminal size.

In case tmux is used an alternative is to add the following snippet to the `tmux.conf`

` bind R run "echo \"stty columns $(tmux display -p \#{pane_width}); stty rows $(tmux display -p \#{pane_height})\" | tmux load-buffer - ; tmux paste-buffer"`

In this case fixing the terminal size can be achieved by pressing R.

## Serial Console Login

There is a long thread here: <https://github.com/NixOS/nixpkgs/issues/84105>

This configuration seems to work

``` nix
#
# serial-tty.nix
#
# Serial console configuration for /dev/ttyS0
# Enables login via serial interface

# https://github.com/NixOS/nixpkgs/blob/nixos-unstable/nixos/modules/services/ttys/getty.nix
# https://github.com/NixOS/nixpkgs/issues/84105

{ config, lib, pkgs, ... }:

{
  # Enable serial console on ttyS0
  boot.kernelParams = [
    "console=ttyS0,115200"
  ];

  # Disable the upstream getty module's automatic configuration for serial-getty@
  # This prevents conflicts with our custom configuration
  systemd.services."serial-getty@" = {
    enable = false;
  };

  # Configure our own serial-getty@ttyS0 service
  systemd.services."serial-getty@ttyS0" = {
    enable = true;
    wantedBy = [ "getty.target" ];
    after = [ "systemd-user-sessions.service" ];
    wants = [ "systemd-user-sessions.service" ];
    serviceConfig = {
      Type = "idle";
      Restart = "always";
      Environment = "TERM=vt220";
      ExecStart = "${pkgs.util-linux}/bin/agetty --login-program ${pkgs.shadow}/bin/login --noclear --keep-baud ttyS0 115200,57600,38400,9600 vt220";
      UtmpIdentifier = "ttyS0";
      StandardInput = "tty";
      StandardOutput = "tty";
      TTYPath = "/dev/ttyS0";
      TTYReset = "yes";
      TTYVHangup = "yes";
      IgnoreSIGPIPE = "no";
      SendSIGHUP = "yes";
    };
  };

  # Enable early console output during boot
  #boot.consoleLogLevel = 7;  # Show all kernel messages
  boot.initrd.verbose = true;  # Show initrd messages
}
```
