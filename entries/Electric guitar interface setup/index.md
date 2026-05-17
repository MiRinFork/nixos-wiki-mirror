<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Electric guitar interface setup -->

# Electric guitar interface setup

This guide covers setting up an **electric guitar** with NixOS to achieve professional, low-latency audio processing. It targets live playing with round-trip latency (RTL) under 6 ms using the modern PipeWire/JACK stack.

The digital signal chain for a guitar consists of:

1.  **Instrument-level signal** from Hi-Z pickups.
2.  **Analog-to-Digital conversion** via an external audio interface.
3.  **Real-time processing** on NixOS using a low-latency kernel and specialized software.

## Installation

### System configuration

Add the following to your `/etc/nixos/configuration.nix`. This configuration is optimized for high-performance CPUs like the AMD Ryzen 7 9700X (Zen 5 architecture).

``` nix
{ pkgs, ... }:

{
  # 1. Sound Server: PipeWire with JACK/PulseAudio support
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true; # Required for yabridge/wine VST bridging
    pulse.enable = true;
    jack.enable = true;
    wireplumber.enable = true;
    
    # Global low-latency defaults for native JACK clients
    extraConfig.pipewire."92-low-latency" = {
      "context.properties" = {
        "default.clock.rate" = 48000;  # Fixed rate avoids resampling latency
        "default.clock.quantum" = 128;      # ~5ms latency at 48kHz
        "default.clock.min-quantum" = 64;   # ~2.5ms latency at 48kHz
        "default.clock.max-quantum" = 512;
      };
    };

    # Crucial: Match low-latency for PulseAudio clients (browsers, Steam/Rocksmith)
    extraConfig.pipewire-pulse."92-low-latency" = {
      "pulse.properties" = {
        "pulse.min.req" = "64/48000";    # Start with 64, not 32, for stability
        "pulse.default.req" = "64/48000";
        "pulse.max.req" = "128/48000";
      };
    };
  };

  # 2. Real-time Scheduling
  # RTKit handles real-time privileges via D-Bus/Polkit.
  security.rtkit.enable = true;
  
  # Critical: Allow unlimited memlock for real-time audio buffers
  security.pam.loginLimits = [
    { domain = "@audio"; item = "memlock"; type = "-"; value = "unlimited"; }
    { domain = "@audio"; item = "rtprio"; type = "-"; value = "95"; }
  ];
  
  users.users.yourname.extraGroups = [ "audio" ]; # Replace 'yourname' with your username

  # 3. Kernel and Performance Tweaks
  boot.kernelPackages = pkgs.linuxPackages_zen; 
  boot.kernelParams = [ 
    "threadirqs"
    "preempt=full"              # Optional: add if experiencing Xruns
    "amd_pstate=passive"        # Zen 4/5: passive + performance governor = stable freq
    # For Intel or older AMD: remove amd_pstate or use "intel_pstate=active"
    "usbcore.autosuspend=-1"    # Prevent USB audio interface sleep
  ];

  powerManagement.cpuFreqGovernor = "performance";
  
  # GameMode can elevate priorities for real-time audio applications
  programs.gamemode.enable = true;

  # 4. Plugin Search Paths (Crucial for NixOS DAWs)
  # Use sessionVariables for GUI apps launched from DE menu
  environment.sessionVariables = let
    makePluginPath = format:
      (pkgs.lib.makeSearchPath format [
        "$HOME/.nix-profile/lib"
        "/run/current-system/sw/lib"
        "/etc/profiles/per-user/$USER/lib"
      ]) + ":$HOME/.${format}";
  in {
    LV2_PATH = makePluginPath "lv2";
    VST3_PATH = makePluginPath "vst3";
    CLAP_PATH = makePluginPath "clap";  # Modern plugin format, supported by LSP/Chow
  };

  # 5. Essential Packages
  nixpkgs.config.allowUnfree = true; # Required for REAPER, Tonelib, etc.
  environment.systemPackages = with pkgs; [
    # --- Utilities & Routing ---
    qpwgraph            # Visual patchbay for PipeWire
    pavucontrol         # Profile selection (Pro Audio mode)
    pw-top              # Real-time CPU usage per audio node
    pw-cli              # Modern alternative to pw-metadata
    cpupower            # CPU frequency scaling controls
    alsa-scarlett-gui   # Hardware mixer for Focusrite Scarlett (may require firmware)

    # --- DAWs ---
    ardour
    reaper

    # --- Plugin Hosts ---
    carla               # Modular plugin host / pedalboard, supports Windows VST via yabridge

    # --- Standalone Guitar Processors ---
    guitarix

    # --- Plugins (LV2/CLAP) ---
    neural-amp-modeler-lv2  # NAM: loads .nam files from https://tonehunt.org
    lsp-plugins             # Includes latency meter, compressors, IR loader
    calf
    dragonfly-reverb
    gxplugins-lv2
    kapitonov-plugins-pack  # Profile-based amp models (KPP)
    chow-centaur            # Klon Centaur emulation
    chow-phaser

    # --- Practice & Learning ---
    tuxguitar
    hydrogen

    # --- Windows VST Compatibility ---
    yabridge
    yabridgectl
    wineWow64Packages.stable  # Use wineWow64Packages, as wineWowPackages is deprecated
  ];
}
```

## Configuration

### Applying changes

``` bash
sudo nixos-rebuild switch

# Apply PipeWire configuration changes (required after rebuild):
systemctl --user restart pipewire pipewire-pulse wireplumber
```

### Pro audio profile

To achieve minimal latency, you must bypass standard software mixing:

1.  Open `pavucontrol`.
2.  Go to the **Configuration** tab.
3.  Set your interface profile to **Pro Audio**.

If the "Pro Audio" profile is missing, ensure `pipewire-alsa` is installed and restart PipeWire. This profile disables software mixing and enables hardware-exclusive mode, which is critical for achieving the lowest latency.

### Dynamic buffer control

You can change latency without rebuilding the system. Note that these settings affect PipeWire clients only; ALSA-direct applications (like Ardour with ALSA backend) use their own buffer settings.

``` bash
# Modern syntax (PipeWire 0.3.65+):
pw-cli set-param 0 clock.force-quantum 64/48000

# Verify current settings:
pw-cli dump settings | grep -E "quantum|rate"
```

Use `pw-top` in a separate terminal to monitor which applications are consuming the most DSP processing time. Look for the `ERR` column — values greater than zero indicate Xruns.

## Hardware and connection

Standard PC line-ins are unsuitable for guitar. Use a dedicated interface with a Hi-Z (Instrument) input.

### Verified compatible devices

| Device | Notes |
|----|----|
| **Focusrite Scarlett Solo (4th Gen)** | Plug-and-play. Use `alsa-scarlett-gui` for hardware monitoring. May require firmware update. |
| **MOTU M2 / M4** | Native ALSA kernel support for direct hardware mixer control via `alsamixer`. Exceptionally stable USB-C latency. |
| **Universal Audio Volt 276** | Reliable USB-C class-compliant interface. |
| **Arturia MiniFuse 1** | Stable performance under PipeWire. |
| **Audient iD4 (Gen 1)** | Fully functional on NixOS. No special drivers needed. |

### Hardware rules

1.  Connect the interface **directly to the motherboard** (rear panel USB 3.0/3.2). Avoid USB hubs — they add latency and can cause Xruns.
2.  Use a high-quality, shielded USB cable. Audio dropouts are frequently caused by cheap cables acting as antennas for electrical interference.
3.  **Disable Bluetooth** during live playing: `rfkill block bluetooth`. The BT audio stack can generate interrupt storms causing Xruns.

### Verification

``` bash
lsusb                    # Confirm hardware connection
arecord -l               # Verify ALSA sees the capture input
aplay -l                 # Verify ALSA sees the playback output
```

## Software guide

This section explains the available software for guitar processing on NixOS, organized by purpose.

### Digital audio workstations

| Software | Purpose | Notes |
|----|----|----|
| **Ardour** | Professional recording, mixing, editing | For absolute minimum RTL, use **ALSA backend** (bypasses PipeWire). Warning: ALSA locks device exclusively — no other app can produce sound. |
| **REAPER** | Commercial DAW, lightweight, scriptable | Uses PipeWire-JACK natively. Excellent Linux support. Unlimited trial. |

### Amp simulators and neural modelers

| Software | Purpose | Notes |
|----|----|----|
| **Neural Amp Modeler (NAM)** | Loads `.nam` files — AI captures of real tube amps | No built-in GUI in LV2 version. In Carla/Ardour: look for `atom:Path` parameter and point to your `.nam` file. Models: [tonehunt.org](https://tonehunt.org) |
| **Kapitonov Plugins Pack (KPP)** | Profile-based traditional amp modeling | Excellent for classic rock/metal. Lower CPU than neural nets. |
| **Guitarix** | All-in-one virtual amp + pedals | Standalone or LV2. Good for quick practice. |

### Effects plugins

| Plugin Pack | Key Features |
|----|----|
| **LSP Plugins** | Professional EQ, compression, gating. Includes LSP Latency Meter and LSP Impulse Response Loader (required for cabinet sims). |
| **Dragonfly Reverb** | High-quality algorithmic reverb (Hall, Room, Plate). |
| **Chow Plugins** | High-fidelity emulations of classic pedals using RNN/WDF. |
| **Calf Studio Gear** | Vintage-style effects with "warm" analog character. |
| **GxPlugins.lv2** | Guitarix project pedals (distortion, overdrive, fuzz) as standalone LV2. |

### Modular hosts

| Software | Purpose |
|----|----|
| **Carla** | Modular plugin host. Chain plugins visually: Input → Tuner → NAM → IR Loader → Reverb → Output. Hosts Windows VSTs via yabridge. |
| **qpwgraph** | Visual patchbay for PipeWire/JACK. Manually connect hardware inputs to software hosts (PipeWire does not auto-connect). |

### Windows VST compatibility

| Tool | Purpose |
|----|----|
| **yabridge + yabridgectl** | Bridge for running Windows VST2/VST3 plugins on Linux via Wine. Essential for commercial plugins (Neural DSP, STL Tones, Amplitube). |

``` bash
# After installing Windows plugins via Wine:
yabridgectl sync  # Required to register plugins with Linux hosts
```

## Tips and tricks

### Rocksmith 2014

Rocksmith 2014 runs on NixOS via Proton and PipeWire.

1.  **Install dependencies**:

``` nix
programs.steam.enable = true;
programs.gamemode.enable = true;
```

1.  **Steam Launch Options** (force low latency + real-time priority):

<!-- -->

    PIPEWIRE_LATENCY=128/48000 gamemoderun %command%

Start with `128/48000` (~5ms). If stable, try `64/48000` (~2.5ms). Values below 64 may cause crashes.

1.  **Sample Rate**: Rocksmith strictly requires 48000 Hz. Do not force 96000 Hz while playing.
2.  **For interface users** (no Real Tone Cable): Install the [RS_ASIO](https://github.com/mdias/rs_asio) mod to enable direct interface support.

### Measuring latency

Always perform a physical loopback test.

1.  Connect a cable from your interface **Output** back into the **Input** (use a TS/TRS patch cable).
2.  Launch LSP Latency Meter:

``` bash
# Option A: Via Carla (recommended for beginners)
carla  # Add plugin "LSP Latency Meter Stereo", connect wires

# Option B: Via jalv (terminal)
jalv http://lsp-plug.in/plugins/lv2/latency_meter_stereo
```

1.  Play a sharp transient (string scratch) and read the **Round-trip Latency (RTL)** value.

**Target values**:

- \< 5 ms: Professional / Imperceptible
- 5–10 ms: Acceptable for practice
- \> 12 ms: Noticeable "lag", difficult to play in time

### Quick start checklist

Before playing, verify:

``` bash
# 1. CPU governor is performance
cpupower frequency-info | grep "current policy"  # Should show "performance"

# 2. PipeWire buffer is set
pw-cli dump settings | grep quantum  # Should show 64 or 128

# 3. No Xruns reported
pw-top | grep -E "ERR|XRUN"  # Should show 0 or empty

# 4. Pro Audio profile active
pavucontrol  # Configuration tab → your interface → Pro Audio

# 5. Plugin paths are set (for GUI apps)
echo $LV2_PATH  # Should include /run/current-system/sw/lib/lv2
```

## Troubleshooting

| Symptom | Cause & Solution |
|----|----|
| **Xruns (audio glitches)** | Ensure `powerManagement.cpuFreqGovernor = "performance"` is active. Check `pw-top` for high-CPU nodes. Close browsers/heavy apps during playing. Disable Wi-Fi. As a last resort, add `processor.max_cstate=1` to `boot.kernelParams` (disables CPU sleep — high power draw). |
| **No sound** | Check `qpwgraph` — PipeWire does not auto-connect hardware. Verify Pro Audio profile in `pavucontrol`. Run `sudo lsof /dev/snd/*` to find conflicting processes. |
| **DAW cannot find plugins** | Ensure `environment.sessionVariables` block is applied. Log out/in after rebuild. Verify paths: `echo $LV2_PATH`. |
| **GPU causing audio glitches** | Disable GPU power management. Prefer X11 over Wayland for lowest latency. |
| **Bluetooth causing Xruns** | Disable Bluetooth stack: `rfkill block bluetooth` during live sessions. |
| **PipeWire config not applying** | Restart user services after rebuild: `systemctl --user restart pipewire wireplumber`. Check for WirePlumber overrides: `wpctl status`. |

## See also

- <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a> — Official NixOS PipeWire documentation
- <a href="Audio_production" class="wikilink" title="Audio production">Audio production</a> — General audio configuration and plugin paths
- [musnix](https://github.com/musnix/musnix) — Deep NixOS audio optimizations module
- [LinuxMusicians Forum](https://linuxmusicians.com/) — Community support
- [ToneHunt](https://tonehunt.org) — Free NAM model library
- [RS_ASIO](https://github.com/mdias/rs_asio) — Rocksmith interface mod

<a href="Category:Guides" class="wikilink" title="Category:Guides">Category:Guides</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Sound" class="wikilink" title="Category:Sound">Category:Sound</a>
