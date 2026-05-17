<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PipeWire -->

[PipeWire](https://www.pipewire.org/) is a relatively new (first release in 2017) low-level multimedia framework. It aims to offer capture and playback for both audio and video with minimal latency while retaining support for <a href="PulseAudio" class="wikilink" title="PulseAudio">PulseAudio</a>-, <a href="JACK" class="wikilink" title="JACK">JACK</a>-, <a href="ALSA" class="wikilink" title="ALSA">ALSA</a>-, and <a href="GStreamer" class="wikilink" title="GStreamer">GStreamer</a>-based applications. PipeWire has great <a href="Bluetooth" class="wikilink" title="Bluetooth">Bluetooth</a> support; due to Pulseaudio being [reported to have troubles with Bluetooth](https://github.com/NixOS/nixpkgs/issues/123784), PipeWire may be a good alternative.

The daemon based on the framework can be configured to be both an audio server (with PulseAudio and JACK features) as well as a video capture server.

PipeWire also supports containers such as <a href="Flatpak" class="wikilink" title="Flatpak">Flatpak</a> and does not rely on `audio` and `video` user groups, rather it uses a <a href="Polkit" class="wikilink" title="Polkit">Polkit</a>-like security model, asking Flatpak or <a href="Wayland" class="wikilink" title="Wayland">Wayland</a> for permission to record the screen or audio.

As of [NixOS 24.11](https://nixos.org/manual/nixos/stable/release-notes#sec-release-24.11), PipeWire is the default sound server for most graphical sessions.

## Configuring PipeWire

``` nix
  # rtkit (optional, recommended) allows Pipewire to use the realtime scheduler for increased performance.
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true; # if not already enabled
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment the following
    #jack.enable = true;
  };
```

It is possible to use the option hierarchy in NixOS to create drop-in configuration files, if needed. For example, to disable the [PipeWire x11-bell module](https://docs.pipewire.org/page_module_x11_bell.html) (which plays a sound on every X11 urgency hint), use:

``` nix
  services.pipewire = {
    enable = true;
    # Disable X11 bell module, which plays a sound on urgency hint
    # (my prompt includes an urgency hint, so I want no sounds).
    extraConfig = {
      pipewire."99-silent-bell.conf" = {
        "context.properties" = {
          "module.x11.bell" = false;
        };
      };
    };
  };
```

## Bluetooth Configuration

PipeWire can be configured to use specific codecs, by default all codecs and most connection modes are enabled, see [this link](https://pipewire.pages.freedesktop.org/wireplumber/daemon/configuration/bluetooth.html#monitor-properties) for precise details of which connections modes are enabled by default. The mSBC codec provides slightly better sound quality in calls than regular HFP/HSP, while the SBC-XQ provides better sound quality for audio listening. For more information [see this link](https://www.guyrutenberg.com/2021/03/11/replacing-pulseaudio-with-pipewire/).

Wireplumber () is the default modular session / policy manager for PipeWire in unstable. To add custom configuration you can use directly. For example:

``` nix
  services.pipewire.wireplumber.extraConfig."10-bluez" = {
    "monitor.bluez.properties" = {
      "bluez5.enable-sbc-xq" = true;
      "bluez5.enable-msbc" = true;
      "bluez5.enable-hw-volume" = true;
      "bluez5.roles" = [
        "hsp_hs"
        "hsp_ag"
        "hfp_hf"
        "hfp_ag"
      ];
    };
  };
```

Or, to disable automatic HSP/HFP and A2DP mode switching, which is part of the `11-bluetooth-policy` configuration:

``` nix
  services.pipewire.wireplumber.extraConfig."11-bluetooth-policy" = {
    "wireplumber.settings" = {
      "bluetooth.autoswitch-to-headset-profile" = false;
    };
  };
```

Alternatively you can set as well, adding derivations that output wireplumber config files in `$out/share/wireplumber/wireplumber.conf.d/*.conf`:

``` nix
  services.pipewire.wireplumber.configPackages = [
    (pkgs.writeTextDir "share/wireplumber/wireplumber.conf.d/10-bluez.conf" ''
      monitor.bluez.properties = {
        bluez5.enable-sbc-xq = true
        bluez5.enable-msbc = true
        bluez5.enable-hw-volume = true
        bluez5.roles = [hsp_hs hsp_ag hfp_hf hfp_ag]
      }
    '')
  ];
```

It is possible change a particular user instead of system-wide, with adding this to `~/.config/wireplumber/bluetooth.conf.d` (`~/.config/wireplumber/bluetooth.lua.d` for wireplumber 4.X and below) instead, manually or using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. Refer to [ArchWiki](https://wiki.archlinux.org/title/PipeWire) for possible configurations, as well as the [Full Documentation](https://docs.pipewire.org/).

## AirPlay/RAOP configuration

Remote Audio Output Protocol, branded as AirPlay, is the apple-developed wireless audio stack used in apple devices, many "smart speakers" and similar appliances as well as several open source implementations. It's based on RTSP, streams in PCM and is supported natively by PipeWire. With the following configuration AirPlay servers on your local network should be automatically added as output devices:

``` nix
# avahi required for service discovery
services.avahi.enable = true;

services.pipewire = {
  # opens UDP ports 6001-6002
  raopOpenFirewall = true;

  extraConfig.pipewire = {
    "10-airplay" = {
      "context.modules" = [
        {
          name = "libpipewire-module-raop-discover";

          # increase the buffer size if you get dropouts/glitches
          # args = {
          #   "raop.latency.ms" = 500;
          # };
        }
      ];
    };
  };
};
```

Note that to set up an airplay server as opposed to a client, separate software is required.

## Graphical tools

All protocols (Pulseaudio/JACK) are now talking to the PipeWire protocol and are managed by the PipeWire daemon (therefore, applications can be managed by both Pulseaudio and JACK tools). For that reason, all graphical tools used for these protocols can be used:

-   
  controls the volume (per-sink and per-app basis), the default outputs/inputs, the different profiles (for HDMI outputs/bluetooth devices), routes each application to a different input/output, etc.

-   
  a <a href="KDE" class="wikilink" title="Plasma">Plasma</a> applet to change volume directly from the systray. Also deals with volume keys.

-   
  with JACK emulation, provides a patchbay (to connect applications together). Note that JACK does not provide any way to change the volume of a single application; use Pulseaudio tools for that purpose.

-   
  with JACK emulation, provides a patchbay (make sure to go to "Patchbay" tab and check "Canvas \> Show External").

- catia/: similar to qjackctl and carla.

-   
  Similar to pavucontrol but for pipewire

## Advanced Configuration

PipeWire can be extensively configured to fit the users' needs.

### Null sinks

Should the user want to do some fancy routing with null sinks, these can be defined directly in the config as shown below.

This is especially convenient if the user has a multi-channel (8+, or something "weird" like 2x2, 3x2) soundcard that keeps confusing applications with too many channels or a bad channel layout.

<strong>Note</strong>: those cards can be set to the "Pro Audio" profile with `pavucontrol` so PipeWire doesn't try to guess a wrong channel layout for them.

``` nix
  services.pipewire.extraConfig.pipewire."91-null-sinks" = {
    "context.objects" = [
      {
        # A default dummy driver. This handles nodes marked with the "node.always-driver"
        # properyty when no other driver is currently active. JACK clients need this.
        factory = "spa-node-factory";
        args = {
          "factory.name" = "support.node.driver";
          "node.name" = "Dummy-Driver";
          "priority.driver" = 8000;
        };
      }
      {
        factory = "adapter";
        args = {
          "factory.name" = "support.null-audio-sink";
          "node.name" = "Microphone-Proxy";
          "node.description" = "Microphone";
          "media.class" = "Audio/Source/Virtual";
          "audio.position" = "MONO";
        };
      }
      {
        factory = "adapter";
        args = {
          "factory.name" = "support.null-audio-sink";
          "node.name" = "Main-Output-Proxy";
          "node.description" = "Main Output";
          "media.class" = "Audio/Sink";
          "audio.position" = "FL,FR";
        };
      }
    ];
  };
```

### Linking nodes

The config does not currently cover linking nodes together, but this can be fixed with a script. Soundcard names and ports should be replaced with the ones from the user's configuration:

``` bash
#!/usr/bin/env bash

# ports obtained from `pw-link -io`

pw-link "Main-Output-Proxy:monitor_FL" "alsa_output.usb-Native_Instruments_Komplete_Audio_6_69BC86B9-00.pro-audio:playback_1"
pw-link "Main-Output-Proxy:monitor_FR" "alsa_output.usb-Native_Instruments_Komplete_Audio_6_69BC86B9-00.pro-audio:playback_2"

pw-link "alsa_input.usb-M-Audio_Fast_Track-00.pro-audio:capture_1" "Microphone-Proxy:input_MONO"
```

In order to load the script on startup, it can be added to `~/.xprofile` or the specific DE/WM autostart config. Similarly, a one-shot user service can be created that runs the script.

### Low-latency setup

Audio production and rhythm games require lower latency audio than general applications. PipeWire can achieve the required latency with much less CPU usage compared to PulseAudio, with the appropriate configuration. The minimum period size controls how small a buffer can be. The lower it is, the less latency there is. PipeWire has a value of 32/48000 by default, which amounts to 0.667ms. It can be brought lower if needed:

``` nix
  services.pipewire.extraConfig.pipewire."92-low-latency" = {
    "context.properties" = {
      "default.clock.rate" = 48000;
      "default.clock.quantum" = 32;
      "default.clock.min-quantum" = 32;
      "default.clock.max-quantum" = 32;
    };
  };
```

<strong>NOTE</strong>: Every setup is different, and a lot of factors determine your final latency, like CPU speed, RT/PREEMPTIVE kernels and soundcards supporting different audio formats. That's why 32/48000 isn't always a value that's going to work for everyone. The best way to get everything working is to keep increasing the quant value until you get no crackles (underruns) or until you get audio again (in case there wasn't any). This won't guarantee the lowest possible latency, but will provide a decent one paired with stable audio.

#### PulseAudio backend

Applications using the Pulse backend have a separate configuration. The default minimum value is 1024, so it needs to be tweaked if low-latency audio is desired.

``` nix
  services.pipewire.extraConfig.pipewire-pulse."92-low-latency" = {
    "context.properties" = [
      {
        name = "libpipewire-module-protocol-pulse";
        args = { };
      }
    ];
    "pulse.properties" = {
      "pulse.min.req" = "32/48000";
      "pulse.default.req" = "32/48000";
      "pulse.max.req" = "32/48000";
      "pulse.min.quantum" = "32/48000";
      "pulse.max.quantum" = "32/48000";
    };
    "stream.properties" = {
      "node.latency" = "32/48000";
      "resample.quality" = 1;
    };
  };
```

As a general rule, the values in `pipewire-pulse` should not be lower than the ones in `pipewire`.

### Controlling the ALSA devices

It is possible to configure various aspects of soundcards through PipeWire, including format, period size and batch mode:

``` nix
  services.pipewire.wireplumber.configPackages = [
    (pkgs.writeTextDir "share/wireplumber/main.lua.d/99-alsa-lowlatency.lua" ''
      alsa_monitor.rules = {
        {
          matches = {{{ "node.name", "matches", "alsa_output.*" }}};
          apply_properties = {
            ["audio.format"] = "S32LE",
            ["audio.rate"] = "96000", -- for USB soundcards it should be twice your desired rate
            ["api.alsa.period-size"] = 2, -- defaults to 1024, tweak by trial-and-error
            -- ["api.alsa.disable-batch"] = true, -- generally, USB soundcards use the batch mode
          },
        },
      }
    '')
  ];
```

The `matches` attribute applies the `actions` to the devices/properties listed there. It is usually used with soundcard names, like shown in the config above. <matches> can match any of the outputs of

``` console
$ pw-dump | grep node.name | grep alsa
```

### Headless operation

PipeWire can run on a headless device (without a GUI) such as a Raspberry Pi connected to a speaker. In that case, it may be preferable to start PipeWire on boot and keep it running rather than only running during an interactive login session. Among other things, this helps prevent a race condition that may occur when socket activation fails to initialize audio devices in time for their first use, leading to one-time errors after reboots. The following additional configuration facilitates this:

``` nix
  # Socket activation too slow for headless; start at boot instead.
  services.pipewire.socketActivation = false; 
  # Start WirePlumber (with PipeWire) at boot.
  systemd.user.services.wireplumber.wantedBy = [ "default.target" ];
  users.users.<name>.linger = true; # keep user services running
  users.users.<name>.extraGroups = [ ... "audio" ];
```

Despite early activation, you may still experience a race condition that prevents audio from working if you play media immediately after a new login such as running an SSH command. If this occurs, try introducing a short delay (e.g. `sleep 5`) before invoking the media player application.

#### System-wide PipeWire

As an alternative to having lingering systemd user services, PipeWire can also run as a system-wide Systemd service. See for more.

### Setting default sink volume via wireplumber

It's possible to declare your desired volume through by setting [wireplumber.settings](https://pipewire.pages.freedesktop.org/wireplumber/daemon/configuration/configuration_option_types.html)'s [default-sink-volume](https://pipewire.pages.freedesktop.org/wireplumber/daemon/configuration/settings.html):

``` nix
  services.pipewire.wireplumber = {
    extraConfig = {
      "10-default-volume" = {
        "wireplumber.settings"."device.routes.default-sink-volume" = 0.8; # default is 0.4
      };
    };
  };
```

## Troubleshooting

### pactl not found

The `pactl` functionality is superseded in PipeWire with the native `pw-cli`, `pw-mon` and `pw-top` CLI tools. When using WirePlumber (which is enabled by default), you can also use `wpctl` as a `pactl` alternative with similar high level subcommands.

### No signal detected in audio application from external audio interface

This issue was seen when attempting to use a Roland STUDIO-CAPTURE 16x10 Audio Interface to record audio in Ardour8 on NixOS. One possible solution:

- Install .
- Run , navigate to the configuration tab, and set the Profile for STUDIO-CAPTURE (or your audio interface) to "Pro Audio".
- Ensure the audio interface and Ardour are set to the same sample rate. Ardour8 will accept a configuration where its sample rate does not match the audio interface's sample rate, when using PipeWire, but will not actually be able to record audio unless they match. If you are unable to successfully activate a track's record button, this may be the issue.

### Sound pops a few seconds after playback stops OR audio takes a long time to start playing after a couple of seconds

By default Wireplumber suspends a sink after 5 seconds of no playback which can create a sound pop on sensitive audio equipment, or a noticeable delay on equipment that takes a moment to start back up. You can disable this by providing extra configuration to wireplumber but first you need to find out the name of the problematic sink in the wireplumber namespace (or blanket disable the functionality).

1.  **Find out the name of the sink (Optional)**
    1.  Run `pw-top` to monitor pipewire processes
    2.  Play and pause sound on the problematic device. After 5 seconds the numeric columns of at least one process will disappear. This is the suspension in action. You need the value of the NAME column to refer to this sink in the configuration below. Since the display updates each second, you can't copy the value easily. Rerun `pw-top -b` and abort with <kbd>CTRL</kbd>+<kbd>C</kbd> to get persistent output.
2.  **Add configuration**: If you want to blanket do this for all devices, you can use `~alsa_input.*` and `~alsa_output.*` to match all input and output devices. You can also use (from the step above) an exact device if you only want to change the setting for that single device. In that case you can match only a single device, and replace the node name with EG: `alsa_output.usb-ASUSTeK_Xonar_SoundCard-00.iec958-stereo`, and it will target that specific device.
    ``` nix
     # Disable suspend of Toslink output to prevent audio popping.
      services.pipewire.wireplumber.extraConfig."99-disable-suspend" = {
        "monitor.alsa.rules" = [
          {
            matches = [
              {
                "node.name" = "~alsa_input.*";
              }
              {
                "node.name" = "~alsa_output.*";
              }
            ];
            actions = {
              update-props = {
                "session.suspend-timeout-seconds" = 0;
              };
            };
          }
        ];
      };
    ```

    The value 0 disables suspension entirely. You could also set it to a higher value. 5 (seconds) is the default value.
3.  **Verify resolution**: After switching to the new configuration you need to also run `systemctl --user restart wireplumber` as your non-root user to apply the new wireplumber configuration, since wireplumber runs as your non-root user - `nixos-rebuild switch` is not sufficient. Play and pause sound again and verify that no sound pops occur anymore and observe in `pw-top` that the numeric columns for that sink do not disappear after 5 seconds.

### Eliminating audio startup delay after suspend or boot

In addition to audio popping, some HTPC systems may experience a delay when audio playback starts after resuming from suspend or system boot. This occurs even if suspension is disabled as described above.

1.  **Identify your sink** using the method in the previous section.
2.  **Enhance configuration**:
    ``` nix
    # Disable node suspend on NVIDIA graphics
    services.pipewire.wireplumber.extraConfig."99-disable-suspend"."monitor.alsa.rules" = [
      {
        matches = [ { "node.name" = "alsa_output.pci-0000_01_00.1.hdmi-stereo-extra1"; } ];
        actions.update-props = {
          "session.suspend-timeout-seconds" = 0;
          "node.always-process" = true;
          "dither.method" = "wannamaker3";
          "dither.noise" = 1;
        };
      }
    ];
    ```

    This configuration prevents audio popping and keeps the audio pipeline active, effectively reducing startup delay from ~5s to ~1s. Adding the dither settings further eliminates the remaining delay.

### Audio Crackling Fix

Increasing buffer size for the audio will reduce crackling but increase latency. More details can be found in [pipewire docs](https://docs.pipewire.org/page_man_pipewire_conf_5.html) and [wireplumber docs](https://pipewire.pages.freedesktop.org/wireplumber/daemon/configuration/alsa.html)

``` nix
services.pipewire.enable = true;
 
services.pipewire.extraConfig.pipewire = {
  "98-crackling-fix" = {
    "context.properties" = {
      "default.clock.quantum" = 1024;
      "default.clock.min-quantum" = 1024;
      "default.clock.max-quantum" = 8192;
    };
  };
};

# additional fix for very bad devices or VM. 
services.pipewire.wireplumber.extraConfig = {
  "99-crackling-fix" = {
    "api.alsa.period-size" = 1024;
    "api.alsa.headroom" = 8192;
  };
};
```

## See also

- <https://github.com/NixOS/nixpkgs/issues/102547>
- <https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/3858>

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a>
