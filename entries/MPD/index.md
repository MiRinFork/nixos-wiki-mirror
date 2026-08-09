<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MPD -->

[Music Player Daemon](https://www.musicpd.org/) (MPD) is a flexible, powerful, server-side application for playing music. Through plugins and libraries, it can play a variety of sound files while being controlled by its network protocol.

## Home-manager Installation

Home-manager has a module for MPD which runs it as a systemd user service, giving it easier access to your user's sound server. In most cases no specific audio output configuration is necessary:

``` nix
services.mpd = {
  enable = true;
  settings = {
    music_directory = "/path/to/music";
  };
  # Optional:
  network.listenAddress = "any"; # if you want to allow non-localhost connections
  network.startWhenNeeded = true; # systemd feature: only start MPD service upon connection to its socket
};
```

## NixOS Installation

A typical NixOS config, running MPD system-wide, will look like this:

``` nix
services.mpd = {
  enable = true;
  settings = {
    music_directory = "/path/to/music";
    # must specify one or more audio_output blocks in order to play audio!
    # (e.g. ALSA, PulseAudio, PipeWire), see next sections
 };

  # Optional:
  network.listenAddress = "any"; # if you want to allow non-localhost connections
  startWhenNeeded = true; # systemd feature: only start MPD service upon connection to its socket
};
```

Still missing in the above configuration is one or more `audio_output`s. We will now see how MPD can be configured to work with ALSA, PulseAudio and PipeWire.

## PulseAudio

In order to use system-wide MPD with PulseAudio, enable sound support in the NixOS `configuration.nix` :

``` nix
# Enable sound.
sound.enable = true;
hardware.pulseaudio.enable = true;
```

Then, add a PulseAudio output to MPD:

``` nix
services.mpd.settings = {
  audio_output = [
    {
      type = "pulse";
      name = "My PulseAudio"; # this can be whatever you want
    }
  ];
};
```

Now, according to <cite><https://wiki.archlinux.org/index.php/Music_Player_Daemon/Tips_and_tricks#Local_(with_separate_mpd_user)></cite>, this will not work, because MPD and Pulseaudio are ran by different users.

### PulseAudio workaround 1

One way to work around this issue is to configure MPD to use PulseAudio's TCP module to send sound to localhost". To enable the required PulseAudio modules, add

``` nix
hardware.pulseaudio.extraConfig = "load-module module-native-protocol-tcp auth-ip-acl=127.0.0.1";
```

to `configuration.nix`

And add `server "127.0.0.1"` to MPD's config to tell it to connect to PulseAudio's local sound server.

``` nix
services.mpd.settings = {
  audio_output = [
    {
      type = "pulse";
      name = "Pulseaudio";
      server = "127.0.0.1"; # add this line - MPD must connect to the local sound server
    }
  ];
};
```

After editing the configuration and running `# nixos-rebuild switch`, you can test if everything is working by using a MPD client, such as `MPC`.

### PulseAudio workaround 2

Another workaround is to configure NixOS to run PulseAudio system-wide.

``` nix
hardware.pulseaudio.systemWide = true;

services.mpd.settings = {
  audio_output = [
    {
      type = "pulse";
      name = "Pulseaudio";
      mixer_type   = "hardware"; # optional
      mixer_device = "default";  # optional
      mixer_control = "PCM";     # optional
      mixer_index  = "0";        # optional
    }
  ];
};
```

## ALSA

You can also use alsa, just add audio output to services.mpd.extraConfig:

``` nix
services.mpd.settings = {
  audio_output = [
    {
      type = "alsa";
      name = "My ALSA";
      device        = "hw:0,0"; # optional
      format        = "44100:16:2"; # optional
      mixer_type    = "hardware";
      mixer_device  = "default";
      mixer_control = "PCM";
    }
  ];
};
```

## PipeWire

Make sure PipeWire is enabled. See <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a>

To use PipeWire with a system-wide MPD instance, create an `audio_output` for it:

``` nix
services.mpd.settings = {
  audio_output = [
    {
      type = "pipewire";
      name = "My PipeWire Output";
    }
  ];
};
```

See <https://mpd.readthedocs.io/en/stable/plugins.html#pipewire> for more options. However, similar to PulseAudio, MPD cannot connect to the PipeWire socket because MPD will by default run under a different user than PipeWire.

### PipeWire workaround

PipeWire typically runs as a normal user, while a system-wide MPD instance will run under a system user. A workaround is to configure MPD to run under the same user as PipeWire:

``` nix
services.mpd.user = "userRunningPipeWire";
systemd.services.mpd.environment = {
    # https://gitlab.freedesktop.org/pipewire/pipewire/-/issues/609
    XDG_RUNTIME_DIR = "/run/user/${toString config.users.users.userRunningPipeWire.uid}"; # User-id must match above user. MPD will look inside this directory for the PipeWire socket.
};
```

Source: <https://github.com/NixOS/nixpkgs/issues/102547#issuecomment-1016671189>

## Further reading

MPD's output plugin documentation: <https://mpd.readthedocs.io/en/stable/plugins.html#output-plugins>

Arch Wiki : <https://wiki.archlinux.org/index.php/Mpd>

<a href="Category:Audio" class="wikilink" title="Category:Audio">Category:Audio</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
