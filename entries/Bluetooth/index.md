<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bluetooth -->

## Setup

To enable support for Bluetooth devices, amend your system configuration as follows and apply changes:

## Usage

In order to use Bluetooth devices, they must be paired with your NixOS machine. Heavier <a href=":Category:Desktop_environment" class="wikilink" title="desktop environments">desktop environments</a> will usually provide a Bluetooth management GUI which you can use to pair devices.

If your desktop environment does not provide such a GUI, you can additionally enable the blueman service, which provides blueman-applet and blueman-manager with the snippet below.

``` nix
services.blueman.enable = true;
```

Another option for a GUI based Bluetooth management GUI can be [overskride](https://search.nixos.org/packages?channel=unstable&show=overskride&from=0&size=50&sort=relevance&type=packages&query=overskride)

Alternatively if you wish to use a TUI[^1] then check out [bluetuith](https://github.com/bluetuith-org/bluetuith) or [bluetui](https://github.com/pythops/bluetui)

### Pairing devices from the command line

Alternatively, Bluetooth devices can be paired from the command line using `bluetoothctl`.

``` console
$ bluetoothctl
[bluetooth] # power on
[bluetooth] # agent on
[bluetooth] # default-agent
[bluetooth] # scan on
...put device in pairing mode and wait [hex-address] to appear here...
[bluetooth] # pair [hex-address]
[bluetooth] # connect [hex-address]
```

Bluetooth devices automatically connect with `bluetoothctl` as well:

``` console
$ bluetoothctl
[bluetooth] # trust [hex-address]
```

## Tips and tricks

### Using Bluetooth headsets with PulseAudio

To allow Bluetooth audio devices to be used with <a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a>, amend `/etc/nixos/configuration.nix` as follows:

``` nix
{
  hardware.pulseaudio.enable = true;
  hardware.bluetooth.enable = true;
}
```

You will need to restart PulseAudio; try `systemctl --user daemon-reload; systemctl --user restart pulseaudio`.

You can verify that PulseAudio has loaded the Bluetooth module by running `pactl list | grep -i 'Name.*module.*blue'`; Bluetooth modules should be present in the list.

### Using Bluetooth headset buttons to control media player

Many bluetooth headsets have buttons for pause/play or to skip to the next track. To make these buttons usable with media players supporting the dbus-based [MPRIS](https://specifications.freedesktop.org/mpris-spec/latest/) standard, one can use `mpris-proxy` that is part of bluez package. It can be used as a daemon in <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

``` nix
services.mpris-proxy.enable = true;
```

For versions preceding Home Manager 21.05, the following snippet can be used:

``` nix
systemd.user.services.mpris-proxy = {
    description = "Mpris proxy";
    after = [ "network.target" "sound.target" ];
    wantedBy = [ "default.target" ];
    serviceConfig.ExecStart = "${pkgs.bluez}/bin/mpris-proxy";
};
```

Some headsets (such as Sony's WH-1000XM series) also support AVRCP directly and as such `mpris-proxy` is not required for this functionality, as headset button presses will register as media key presses. If you are using a WM or a desktop environment which doesn't support media keys, you will have to set up keybindigs yourself; the keys are typically called `XF86AudioPlay`, `XF86AudioPause`, `XF86AudioNext`, and `XF86AudioPrev`. However, note that some functionality, such as "take off headphones to pause" on WH-1000XM4/5 requires two-way AVRCP communication to work properly, so \`mpris-proxy\` is still recommended if you wish to use it. It also may or may not help with Bluetooth multipoint.

#### System-Wide PulseAudio

When you are running PulseAudio system-wide then you will need to add the following modules to your `default.pa` configuration:

``` nix
hardware.pulseaudio.configFile = pkgs.writeText "default.pa" ''
  load-module module-bluetooth-policy
  load-module module-bluetooth-discover
  ## module fails to load with 
  ##   module-bluez5-device.c: Failed to get device path from module arguments
  ##   module.c: Failed to load module "module-bluez5-device" (argument: ""): initialization failed.
  # load-module module-bluez5-device
  # load-module module-bluez5-discover
'';
```

#### Enabling extra codecs

While pulseaudio itself only has support for the SBC bluetooth codec there is out-of-tree support for AAC, APTX, APTX-HD and LDAC.

To enable extra codecs add the following to `/etc/nixos/configuration.nix`:

``` nix
{
...
  services.pulseaudio = {
    enable = true;
    package = pkgs.pulseaudioFull;
  };
...
}
```

#### Enabling A2DP Sink

Modern headsets will generally try to connect using the A2DP profile. To enable this for your bluetooth connection, add the following to `/etc/nixos/configuration.nix`

``` nix
{
...
  hardware.bluetooth.settings = {
    General = {
      Enable = "Source,Sink,Media,Socket";
    };
  };
...
}
```

This configuration may be unnecessary and does not work with bluez5 (`Unknown key Enable for group General` ).

#### Managing audio devices

`pavucontrol` can be used to reconfigure the device:

- To enable A2DP, change the profile to “High Fidelity Playback (A2DP Sink)” on the “Configuration” tab.
- To set the device as the default audio output, select “set as fallback” on the “Output Devices” tab.

Alternatively, the device can be configured via the command line:

- To enable A2DP, run:
  ``` console
  $ pacmd set-card-profile "$(pactl list cards short | egrep -o bluez_card[[:alnum:]._]+)" a2dp_sink
  ```
- To set the device as the default audio output, run:
  ``` console
  $ pacmd set-default-sink "$(pactl list sinks short | egrep -o bluez_sink[[:alnum:]._]+)"
  ```

You can also set pulseaudio to automatically switch audio to the connected bluetooth device when it connects, in order to do this add the following entry into the pulseaudio config

``` nix
{
...
hardware.pulseaudio.extraConfig = "
  load-module module-switch-on-connect
";
...
}
```

Note that you may need to clear the pulseaudio config located at ~/.config/pulse to get this to work. Also you may have to unset and then set the default audio device to the bluetooth device, see <https://github.com/NixOS/nixpkgs/issues/86441> for more info

### Showing battery charge of bluetooth devices

If you want to see what charge your bluetooth devices have you have to enable experimental features, which might lead to bugs (according to [Arch Wiki](https://wiki.archlinux.org/title/Bluetooth_headset#Battery_level_reporting)). You can add the following to your config to enable experimental feature for bluetooth:

``` nix
{
...
hardware.bluetooth.settings = {
    General = {
        Experimental = true;
    };
};
...
}
```

Afterwards rebuild your system and then restart your bluetooth service by executing

``` console
$ systemctl restart bluetooth
```

### Pairing hearing aids using the ASHA protocol

The upstream bluez project [has not yet implemented audio support for the ASHA protocol](https://github.com/thewierdnut/asha_pipewire_sink#alternatives-are-coming). As an alternative it is possible to enable audio streaming using the [asha-pipewire-sink](https://github.com/thewierdnut/asha_pipewire_sink) project.

Add following to your system config and apply it:

``` nix
boot.extraModprobeConfig = ''
  options bluetooth enable_ecred=1
'';

hardware = {
  bluetooth = {
    enable = true;
    settings = {
      LE = {
        MinConnectionInterval = 16;
        MaxConnectionInterval = 16;
        ConnectionLatency = 10;
        ConnectionSupervisionTimeout = 100;
      };
    };
  };
};

environment.systemPackages = [ pkgs.asha-pipewire-sink ];
```

Ensure that profiles `LE2MTX LE2MRX` are part of `Selected phys` when running `sudo btmgmt phy`, otherwise follow the instruction [here](https://github.com/thewierdnut/asha_pipewire_sink#enable-2m-phy-optional).

Pair and connect to both of your hearing aids.

Run the command `asha_pipewire_sink` and choose your hearing aids as audio sink in your sound mixer application, for example `pavucontrol`.

### File Transfer from/to Mobile Device

Use Case: When you're not using a desktop/window manager who supports accepting files the GUI (e.g. sway, etc)

`systemctl --user edit obex`

``` ini
{
### Editing /home/<youruser>/.config/systemd/user/obex.service.d/override.conf
### Anything between here and the comment below will become the contents of the drop-in file

[Service]
ExecStart=
ExecStart=/nix/store/...-bluez-5.78/libexec/bluetooth/obexd --root=./Downloads --auto-accept

### Edits below this comment will be discarded

...
}
```

With this config, after pairing (and - I suspect - trusting) your mobile device, you should be able to receive files from your phone.

Caveat: When sending files to the phone, take into account that not all file extensions are accepted. Renaming the file before transfer did the trick.

`sudo journalctl -f -t obexd` be your friend.

## Troubleshooting

### USB device needs to be unplugged/re-plugged after suspend

Some USB device/host combinations don't play well with the suspend/resume cycle, and need to be unplugged and then re-plugged to work again.

It is possible to simulate a unplug/re-plug cycle using the `/sys` filesystem.

[This gist](https://gist.github.com/samueldr/356e65374d452e4fd45314f818ae3545) provides a script and instructions to set-up a workaround for these devices.

### When connecting to an audio device: Failed to connect: org.bluez.Error.Failed

You need to use pulseaudioFull, see <a href="#Using_Bluetooth_headsets_with_PulseAudio" class="wikilink" title="#Using Bluetooth headsets with PulseAudio">#Using Bluetooth headsets with PulseAudio</a>.

### Bluetooth fails to power on with Failed to set power on: org.bluez.Error.Blocked

If `journalctl -eu bluetooth` shows `Failed to set mode: Blocked through rfkill (0x12)`, rfkill might be blocking it:

``` console
$ rfkill
ID TYPE      DEVICE      SOFT      HARD
 1 wlan      phy0   unblocked unblocked
37 bluetooth hci0   blocked unblocked
```

Unblock it first:

``` console
$ sudo rfkill unblock bluetooth
```

### Cannot use bluetooth while it previously worked

Symptoms:

- When using `bluetoothctl`, getting "No agent is registered".
- When using `blueman` or anything using dbus to talk to bluez, getting `dbus.exceptions.DBusException: org.freedesktop.DBus.Error.AccessDenied: Rejected send message"`

This possibly can be fixed by restarting the display-manager session. The session management may have had an issue with registering your current session and doesn't allow you to control bluetooth.

``` console
$ sudo systemctl restart display-manager.service
```

### No audio when using headset in HSP/HFP mode

If the output of `dmesg | grep Bluetooth` shows a line similar to `Bluetooth: hci0: BCM: Patch brcm/BCM-0a5c-6410.hcd not found` then your machine uses a Broadcom chipset without the required firmware installed.

To fix this, add `hardware.enableAllFirmware = true;` to your `/etc/nixos/configuration.nix` then reboot.

## See also

- [Scripting PulseAudio, Bluetooth, JACK](https://web.archive.org/web/20170609072208/http://anderspapitto.com/posts/2016-11-07-scripting_pulseaudio_bluetooth_jack.html)
- [Bluetooth (Gentoo Wiki)](https://wiki.gentoo.org/wiki/Bluetooth)
- [Bluetooth (Arch Linux Wiki)](https://wiki.archlinux.org/index.php/Bluetooth)

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a> <a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>

[^1]: <https://en.wikipedia.org/wiki/Text-based_user_interface>
