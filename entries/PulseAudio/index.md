<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PulseAudio -->

PulseAudio is a popular sound server for Linux. A number of applications now expect a PulseAudio-compatible audio server.

As of NixOS 24.11, <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a> is used over PulseAudio for most graphical sessions by default, but it can provide a PulseAudio-compatible server (see that page for more details). This page documents how to use "native" PulseAudio as an alternative.

## Enabling PulseAudio

Add to your configuration:

``` nix
services.pipewire.enable = false;
services.pulseaudio.enable = true;
services.pulseaudio.support32Bit = true;    # If compatibility with 32-bit applications is desired.
```

You may need to add users to the `audio` group for them to be able to use audio devices:

``` nix
users.extraUsers.alice.extraGroups = [ "audio" ... ];
```

## Explicit PulseAudio support in applications

Normally, the system-wide ALSA configuration (`/etc/asound.conf`) redirects the audio of applications which use the ALSA API through PulseAudio. For this reason, most applications do not need to be PulseAudio-aware. Some NixOS packages can be built with explicit PulseAudio support which is disabled by default. This support can be enabled in all applicable packages by setting:

``` nix
nixpkgs.config.pulseaudio = true;
```

## Enabling modules

Modules can be loaded manually:

``` sh
pactl load-module module-combine-sink
```

Or automatically:

``` nix
services.pulseaudio.extraConfig = "load-module module-combine-sink";
```

## Disabling unwanted modules

``` nix
services.pulseaudio.extraConfig = "unload-module module-suspend-on-idle";
```

## Using Pulseaudio Equalizer

Currently (2017-11-29 ) the `qpaeq` command does not work out of the box, use the following commands to get it running:

``` console
$ pactl load-module module-equalizer-sink
$ pactl load-module module-dbus-protocol
$ nix-shell -p python27Full python27Packages.pyqt4 python27Packages.dbus-python --command qpaeq
```

## Using Bauer stereophonic-to-binaural DSP library

This module re-creates on a headset what you would hear in real-life, improving sound quality and decreasing brain fatigue.

See the description of the project for more details: <https://bs2b.sourceforge.net/>

The nix package to use is: `libbs2b`

<b>FIXME</b>: getting an error while running:

``` console
$ pactl load-module module-ladspa-sink sink_name=binaural master=bluez_sink.AA_BB_CC_DD_EE_FF.a2dp_sink plugin=bs2b label=bs2b control=700,4.5
```

## Troubleshooting

### General troubleshooting

Before troubleshooting PulseAudio, determine that the kernel-level sound APIs (ALSA) are functional; see <a href="ALSA" class="wikilink" title="ALSA">ALSA</a>.

If ALSA-level audio is working, determine whether audio is being routed via PulseAudio.

To determine what processes are using the sound devices:

``` console
$ sudo lsof /dev/snd/*
COMMAND     PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
pulseaudi 14080 goibhniu   30u   CHR  116,7      0t0 5169 /dev/snd/controlC0
pulseaudi 14080 goibhniu   37u   CHR  116,7      0t0 5169 /dev/snd/controlC0
```

In this example, only `pulseaudio` processes are using sound devices.

If other processes (such as `plugin-container`) are using sound devices, this indicates they are bypassing PulseAudio; check that you don't have a local `~/.asoundrc` file directing audio to somewhere else.

Note that you may need to enable the full pulseaudio package using:

``` nix
services.pulseaudio.package = pkgs.pulseaudioFull;
```

`For example I had to enable this package in order to solve an error:`

``` console
snd_pcm_open failed: Device or resource busy
```

(The problem is that also also tries to connect to the card that is already used by pulseaudio, so we need a module pulseaudio-alsa on pulseaudio to redirect also calls to pulseaudio)

### Clicking and Garbled Audio

The newer implementation of the PulseAudio sound server uses timer-based audio scheduling instead of the traditional, interrupt-driven approach.

Timer-based scheduling may expose issues in some ALSA drivers. On the other hand, other drivers might be glitchy without it on, so check to see what works on your system.

To turn timer-based scheduling off add this to your configuration:

``` nix
services.pulseaudio.configFile = pkgs.runCommand "default.pa" {} ''
  sed 's/module-udev-detect$/module-udev-detect tsched=0/' \
    ${pkgs.pulseaudio}/etc/pulse/default.pa > $out
'';
```

Then perform `# nixos-rebuild switch`, followed by `$ pulseaudio -k`.

The difference should be directly noticeable. This is a known issue related to quality of Creative driver [1](https://guh.me/posts/2013-06-16-solving-creative-sound-blaster-x-fi-titanium-crackling-slash-distortion-on-linux/), but it can also happen with other sound cards.

### Paprefs doesn't work on KDE

If you run KDE (Plasma) and paprefs util doesn't work complaining about dconf, make sure you have `programs.dconf.enable = true;` in your NixOS configuration. [Source](https://github.com/NixOS/nixpkgs/issues/47938#issuecomment-427520410).

## See also

- <a href="Using_JACK_with_PulseAudio" class="wikilink" title="Using JACK with PulseAudio">Using JACK with PulseAudio</a>
- <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a>

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a>
