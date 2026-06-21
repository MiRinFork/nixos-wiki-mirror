<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Electric guitar interface setup -->

This guide covers setting up an **electric guitar** with NixOS to achieve professional, low-latency audio processing. It targets live playing with round-trip latency (RTL) under 6 ms using the modern PipeWire and WirePlumber stack.

The digital signal chain for a guitar consists of:

1.  **Instrument-level signal** from Hi-Z pickups.
2.  **Analog-to-Digital conversion** via an external audio interface.
3.  **Real-time processing** on NixOS using a low-latency kernel and specialized software.

## Installation

### System configuration

Add the following to your `/etc/nixos/configuration.nix` or your flake. This configuration is optimized for high-performance CPUs like the AMD Ryzen 7 9700X (Zen 5 architecture) running NixOS 26.05 "Yarara" or newer.

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
    
    # Global low-latency defaults for native JACK and ALSA clients
    # Note: PulseAudio specific latency settings (pulse.min.req) are deprecated 
    # in PipeWire 0.3.80+ and handled globally by default.clock.* parameters.
    extraConfig.pipewire."92-low-latency" = {
      "context.properties" = {
        "default.clock.rate" = 48000;  # Fixed rate avoids resampling latency
        "default.clock.quantum" = 128;      # ~5ms latency at 48kHz
        "default.clock.min-quantum" = 32;   # Allows top-tier interfaces to achieve ~1.5ms
        "default.clock.max-quantum" = 512;
      };
    };

    # Disable node suspension to prevent audio pops on USB interfaces
    wireplumber.extraConfig."99-disable-suspend" = {
      "monitor.alsa.rules" = [{
        matches = [
          { "node.name" = "~alsa_input.*"; }
          { "node.name" = "~alsa_output.*"; }
        ];
        actions = {
          update-props = {
            "session.suspend-timeout-seconds" = 0;
          };
        };
      }];
    };
  };

  # 2. Real-time Scheduling
  # RTKit handles real-time privileges via D-Bus/Polkit.
  security.rtkit.enable = true;
  
  # Critical: Allow unlimited memlock and high rtprio for real-time audio buffers
  security.pam.loginLimits = [
    { domain = "@audio"; item = "memlock"; type = "-"; value = "unlimited"; }
    { domain = "@audio"; item = "rtprio"; type = "-"; value = "99"; }
    { domain = "@audio"; item = "nice"; type = "-"; value = "-19"; }
  ];
  
  users.users.yourname.extraGroups = [ "audio" ]; # Replace 'yourname' with your username

  # 3. Kernel and Performance Tweaks
  # Since kernel 6.12, PREEMPT_RT patches are merged into mainline, but distros
  # generally ship with CONFIG_PREEMPT_DYNAMIC. 'preempt=full' enables dynamic 
  # preemption for best-effort low latency. For hard real-time requirements, 
  # a custom kernel with CONFIG_PREEMPT_RT=y is still needed.
  boot.kernelPackages = pkgs.linuxPackages_latest;
  boot.kernelParams = [ 
    "threadirqs"
    "preempt=full"              
    "amd_pstate=active"         # Zen 4/5: active mode provides best EPP and responsiveness
    "usbcore.autosuspend=-1"    # Prevent USB audio interface sleep
  ];

  # Disable power-profiles-daemon to prevent conflicts with manual cpuFreqGovernor
  services.power-profiles-daemon.enable = false;
  powerManagement.cpuFreqGovernor = "performance";
  
  # GameMode can elevate priorities for real-time audio applications
  programs.gamemode.enable = true;

  # 4. Plugin Search Paths (Crucial for NixOS DAWs)
  # Use environment.variables for reliable global access in Wayland/X11 sessions
  environment.variables = let
    makePluginPath = format:
      (pkgs.lib.makeSearchPath format [
        "$HOME/.nix-profile/lib"
        "/run/current-system/sw/lib"
        "/etc/profiles/per-user/$USER/lib"
      ]) + ":$HOME/.${format}";
  in {
    LV2_PATH = makePluginPath "lv2";
    VST3_PATH = makePluginPath "vst3";
    CLAP_PATH = makePluginPath "clap";  # Modern plugin format, supported by Bitwig/REAPER
  };

  # 5. Essential Packages
  nixpkgs.config.allowUnfree = true; # Required for REAPER, Bitwig, etc.
  environment.systemPackages = with pkgs; [
    # --- Utilities & Routing ---
    qpwgraph            # Visual patchbay for PipeWire
    pwvucontrol         # Modern native PipeWire volume control
    pavucontrol         # Fallback for Pro Audio profile selection
    pw-top              # Real-time CPU usage per audio node
    easyeffects         # System-wide real-time EQ and effects
    
    # --- DAWs ---
    ardour
    reaper
    bitwig-studio       # Native Linux commercial DAW, excellent CLAP support

    # --- Plugin Hosts ---
    carla               # Modular plugin host / pedalboard, supports Windows VST via yabridge

    # --- Standalone Guitar Processors ---
    guitarix

    # --- Plugins (LV2/CLAP) ---
    neural-amp-modeler-lv2  # NAM: loads .nam files from tone3000.com
    proteus                # Neural network modeling (LSTM) by GuitarML
    lsp-plugins            # Includes latency meter, compressors, IR loader
    calf
    dragonfly-reverb
    gxplugins-lv2
    kapitonov-plugins-pack # Profile-based amp models (KPP)
    chow-centaur           # Klon Centaur emulation
    chow-phaser

    # --- Practice & Learning ---
    tuxguitar
    hydrogen

    # --- Windows VST Compatibility ---
    yabridge
    (yabridgectl.override { wine = wineWowPackages.stable; }) # Explicit Wine path
    wineWow64Packages.stable  # Use wineWow64Packages, as wineWowPackages is deprecated
  ];
}
```

## Configuration

### Applying changes

``` bash
sudo nixos-rebuild switch

# Apply PipeWire configuration changes (required after rebuild):
systemctl --user restart pipewire wireplumber
```

### Pro audio profile

To achieve minimal latency, you must bypass standard software mixing:

1.  Open `pavucontrol`.
2.  Go to the **Configuration** tab.
3.  Set your interface profile to **Pro Audio**.

If the "Pro Audio" profile is missing (or listed as "Digital Stereo" / "Multichannel" depending on the interface), ensure `pipewire-alsa` is installed and restart PipeWire. This profile disables software mixing and enables hardware-exclusive mode, which is critical for achieving the lowest latency.

### Dynamic buffer control

You can change latency without rebuilding the system. Note that this setting is temporary and will be lost after restarting PipeWire.

``` bash
# Force quantum to 64 samples (pw-metadata syntax):
pw-metadata -n settings 0 clock.force-quantum 64

# Verify current settings:
pw-metadata -n settings
```

Use `pw-top` in a separate terminal to monitor which applications are consuming the most DSP processing time. Look for the `ERR` column — values greater than zero indicate Xruns.

## Hardware and connection

Standard PC line-ins are unsuitable for guitar. Use a dedicated interface with a Hi-Z (Instrument) input.

### Verified compatible devices

| Device | Notes |
|----|----|
| **Focusrite Scarlett 4th Gen (Solo/2i2/4i4)** | Plug-and-play. Requires disabling MSD Mode (hold 48V button while powering on). `alsa-scarlett-gui` works natively without extra packages. |
| **Focusrite Scarlett 4th Gen (16i16/18i16/18i20)** | Requires kernel ≥6.14, `fcp-support`, and a firmware update via `alsa-scarlett-gui`. |
| **MOTU M2 / M4** | Native ALSA kernel support (requires kernel ≥6.1+). Direct hardware mixer control via `alsamixer`. Exceptionally stable USB-C latency. |
| **Universal Audio Volt 276** | Reliable USB-C class-compliant interface. |
| **Arturia MiniFuse 1** | Stable performance under PipeWire. |
| **Audient iD4 (Gen 1)** | Fully functional on NixOS. No special drivers needed. |

### Hardware rules

1.  Connect the interface **directly to the motherboard** (rear panel USB 3.0/3.2). Avoid USB hubs — they add latency and can cause Xruns.
2.  Use a high-quality, shielded USB cable. Audio dropouts are frequently caused by cheap cables acting as antennas for electrical interference.
3.  **Disable Bluetooth** during live playing: `rfkill block bluetooth`. The BT audio stack can generate interrupt storms causing Xruns.
4.  **Limit GPU FPS**: High frame rates in 3D applications or GUI-heavy plugins (like Neural DSP) can generate PCIe interrupt storms causing DPC latency spikes. Cap your FPS or enable VSync in your compositor/games.

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
| **Bitwig Studio** | Modern commercial DAW | Native Linux support. Superior CLAP format integration and modular sound design. |

### Amp simulators and neural modelers

| Software | Purpose | Notes |
|----|----|----|
| **Neural Amp Modeler (NAM)** | LV2 plugin. Loads `.nam` files — AI captures of real tube amps | No built-in GUI. In Carla/Ardour: look for `atom:Path` parameter and point to your `.nam` file. Models: [TONE3000](https://tone3000.com) (formerly ToneHunt). |
| **Proteus** | LV2 plugin. Neural network modeling (LSTM) by GuitarML | Faster preset switching than NAM. Models: [GuitarML GitHub](https://github.com/GuitarML/Proteus). |
| **Kapitonov Plugins Pack (KPP)** | Profile-based traditional amp modeling | Excellent for classic rock/metal. Lower CPU than neural nets. |
| **Guitarix** | All-in-one virtual amp + pedals | Standalone or LV2. Good for quick practice. |

### Effects plugins

| Plugin Pack | Key Features |
|----|----|
| **LSP Plugins** | Professional EQ, compression, gating. Includes LSP Latency Meter and LSP Impulse Response Loader (required for cabinet sims). Available in CLAP. |
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
| **yabridge + yabridgectl** | Bridge for running Windows VST2/VST3/CLAP plugins on Linux via Wine. Essential for commercial plugins (Neural DSP, STL Tones, Amplitube). |
| **PipeASIO** | [Experimental](https://github.com/M0n7y5/pipeasio) ASIO-to-PipeWire driver. Bypasses JACK entirely, connecting ASIO directly to PipeWire. Early testing recommended for Windows DAWs (FL Studio, Ableton) in Proton. |

``` bash
# After installing Windows plugins via Wine:
yabridgectl sync  # Required to register plugins with Linux hosts
```

## Tips and tricks

### Rocksmith 2014

Rocksmith 2014 runs on NixOS via Proton and PipeWire. There are two distinct approaches depending on your preferred audio routing. **Do not mix them**, as they are mutually exclusive.

#### Approach A: Declarative via nixos-rocksmith (WineASIO + JACK)

This method uses the [nixos-rocksmith](https://github.com/re1n0/nixos-rocksmith) flake, which patches Steam to preload `libjack.so` and use `RS_ASIO` with WineASIO.

1.  Add the module to your flake and enable it:

``` nix
programs.steam = {
  enable = true;
  rocksmithPatch.enable = true;
};
```

1.  **Steam Launch Options**:

<!-- -->

    LD_PRELOAD=/usr/lib32/libjack.so PIPEWIRE_LATENCY=128/48000 %command%

#### Approach B: PipeASIO (Direct ASIO to PipeWire)

This method bypasses JACK and WineASIO entirely, connecting ASIO directly to PipeWire. It is experimental but offers excellent performance inside the Steam Runtime container.

1.  Build and install [PipeASIO](https://github.com/M0n7y5/pipeasio) under `$HOME/.local` (Proton cannot see system-wide `/usr/lib/wine`).
2.  Register the driver in the game's Wine prefix:

``` bash
env WINEPREFIX="$HOME/.steam/steam/steamapps/compatdata/221680/pfx" pipeasio-register
```

1.  **Steam Launch Options** (point Proton to the local Wine libs):

<!-- -->

    WINEDLLPATH=$HOME/.local/lib/wine gamemoderun %command%

1.  Note: When using PipeASIO, buffer size is negotiated directly via the ASIO control panel inside the game or PipeASIO settings, so `PIPEWIRE_LATENCY` may not be required.

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
pw-metadata -n settings  # Should show clock.force-quantum 64 or 128

# 3. No Xruns reported (run pw-top in batch mode for clean output)
pw-top -b -n 1 | grep ERR  # Should show 0 or empty

# 4. Pro Audio profile active
pavucontrol  # Configuration tab → your interface → Pro Audio

# 5. Plugin paths are set (for GUI apps)
echo $LV2_PATH  # Should include /run/current-system/sw/lib/lv2
```

## Troubleshooting

| Symptom | Cause & Solution |
|----|----|
| **Xruns (audio glitches)** | Ensure `powerManagement.cpuFreqGovernor = "performance"` is active. Check `pw-top` for high-CPU nodes. Close browsers/heavy apps during playing. Disable Wi-Fi. As a last resort, add `processor.max_cstate=1` to `boot.kernelParams` (disables CPU sleep — results in extreme power draw and heat, use with caution). |
| **No sound** | Check `qpwgraph` — PipeWire does not auto-connect hardware. Verify Pro Audio profile in `pavucontrol`. Run `sudo lsof /dev/snd/*` to find conflicting processes. |
| **DAW cannot find plugins** | Ensure `environment.variables` block is applied. Log out/in after rebuild. Verify paths: `echo $LV2_PATH`. |
| **Audio pops a few seconds after playback stops** | WirePlumber suspends the ALSA node after 5 seconds of inactivity. Ensure `session.suspend-timeout-seconds = 0` is set in `wireplumber.extraConfig`. |
| **GPU causing audio glitches** | Disable GPU power management. Limit FPS in games/DAW to reduce PCIe interrupt storms (DPC latency). Prefer X11 over Wayland for lowest latency if using JUCE-based plugins that render incorrectly. |
| **Bluetooth causing Xruns** | Disable Bluetooth stack: `rfkill block bluetooth` during live sessions. |
| **PipeWire config not applying** | Restart user services after rebuild: `systemctl --user restart pipewire wireplumber`. Check for WirePlumber overrides: `wpctl status`. |

## See also

- <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a> — Official NixOS PipeWire documentation
- <a href="Audio_production" class="wikilink" title="Audio production">Audio production</a> — General audio configuration and plugin paths
- [musnix](https://github.com/musnix/musnix) — Deep NixOS audio optimizations module
- [LinuxMusicians Forum](https://linuxmusicians.com/) — Community support
- [TONE3000](https://tone3000.com) — Largest library of NAM models and IRs (formerly ToneHunt)
- [PipeASIO](https://github.com/M0n7y5/pipeasio) — Experimental ASIO to PipeWire bridge for Wine/Proton
- [linux-rocksmith](https://codeberg.org/nizo/linux-rocksmith) — Comprehensive guide to Rocksmith on Linux

<a href="Category:Guides" class="wikilink" title="Category:Guides">Category:Guides</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Sound" class="wikilink" title="Category:Sound">Category:Sound</a>
