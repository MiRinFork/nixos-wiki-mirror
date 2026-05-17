<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Actkbd -->

`actkbd` is a keyboard shortcut daemon that works at the system level. It does so through reading the events directly from the input devices, thus working whether a graphical session is running or not.

Do note that this causes issues if it is expected to be used for user-level shortcuts. `actkbd` is better used to provide global user-agnostic shortcuts like volume or brightness control.

With NixOS, `actkbd` can be configured using the configuration options.

## Finding key codes

The key codes used by `actkbd` when binding commands will not match with the key code events `xev` reports.

### Obtaining key codes with `xev`

While logged into an X session, using `nix-shell -p xorg.xev --run "xev -event keyboard"` will run `xev`, with filtering for keyboard events.

In the following example output, the line with the key code event is prefixed with an arrow. The keycode for that particular key is 41 with xev.

     |KeyRelease event, serial 28, synthetic NO, window 0x2a00001,
     |    root 0x526, subw 0x0, time 263244557, (457,417), root:(1561,950),
    →|    state 0x10, keycode 41 (keysym 0x66, f), same_screen YES,
     |    XLookupString gives 1 bytes: (66) "f"
     |    XFilterEvent returns: False

### Obtaining key codes with `actkbd`

To read key codes with `actkbd`, you will need to select the right input event provider from `/dev/input/`. Each input device generating input events has its own entry there, enumerated with a number.

To find out which one generates the events from the hotkeys, it is possible, while tedious, to run the following command with each available entry, and see which one generates event notifications when pressing the wanted key.

Alternatively, the `lsinput` from the `input-utils` package<sup>\[not upstreamed yet\]</sup> allows listing all `/dev/input/` files with a useful name.

Another method, which does not require additional packages, will list all the input devices recognized by the X server:

    journalctl --unit display-manager.service -b0 | grep "Adding input device" | sed -e 's;.*config/udev: ;;' | sort | uniq

This command will also list all available input devices, two lines per.

    cat /proc/bus/input/devices | grep "Name\|Handlers"

Finally, some device files will also be listed in the `/dev/input/by-path/` and `/dev/input/by-id/` directories with somewhat recognizable names.

Once the input device found, run the following command (replacing `#` with the ID) to print the keycodes as `actkbd` sees them.

    nix-shell -p actkbd --run "sudo actkbd -n -s -d /dev/input/event#"

It will report the keys this way:

    Keys: 33
    Keys: 14
    Keys: 29+46

Where key codes with a `+` represents combinations. The numbers, including combinations can be used in the configuration.

## Sample configuration

The following configuration, from the <a href="Backlight" class="wikilink" title="Backlight">Backlight</a> page will configure the brightness control keys to use `light` to control the brightness.

``` nix
  programs.light.enable = true; # Needed for the /run/wrappers/bin/light SUID wrapper.
  services.actkbd = {
    enable = true;
    bindings = [
      { keys = [ 224 ]; events = [ "key" ]; command = "/run/wrappers/bin/light -A 10"; }
      { keys = [ 225 ]; events = [ "key" ]; command = "/run/wrappers/bin/light -U 10"; }
    ];
  };
```

Additionally, the option will use `actkbd` to control the media volumes. See the configuration it generates for an additional example.

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
