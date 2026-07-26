<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Electric guitar interface setup -->

This guide covers setting up an **electric guitar** with NixOS to achieve professional, low-latency audio processing. It targets live playing with round-trip latency (RTL) under 6 ms using the modern PipeWire and WirePlumber stack.

The digital signal chain for a guitar consists of:

1.  **Instrument-level signal** from Hi-Z pickups.
2.  **Analog-to-Digital conversion** via an external audio interface.
3.  **Real-time processing** on NixOS using a low-latency kernel and specialized software.

## Installation

Add the following snippets to your `/etc/nixos/configuration.nix` or your flake. This configuration is optimized for high-performance CPUs (e.g., AMD Ryzen 7 9700X) running NixOS 26.05 "Yarara" or newer.

### Sound server

Configure PipeWire with global low-latency defaults and disable node suspension to prevent audio pops on USB interfaces. Note that legacy `pulse.min.req` parameters are deprecated in PipeWire 0.3.80+ and handled globally by `default.clock.*`.

``` nix
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true; # Required for yabridge/wine VST bridging
    pulse.enable = true;
    jack.enable = true;
    wireplumber.enable = true;
    
    # Global low-latency defaults
    extraConfig.pipewire."92-low-latency" = {
      "context.properties" = {
        "default.clock.rate" = 48000;       # Fixed rate avoids resampling latency
        "default.clock.quantum" = 128;      # ~5ms latency at 48kHz
        "default.clock.min-quantum" = 32;   # Allows top-tier interfaces to achieve ~1.5ms
        "default.clock.max-quantum" = 512;
      };
    };

    # Disable node suspension and fix crackling on problematic USB interfaces
    wireplumber.extraConfig."99-disable-suspend" = {
      "monitor.alsa.rules" = [{
        matches = [
          { "node.name" = "~alsa_input.*"; }
          { "node.name" = "~alsa_output.*"; }
        ];
        actions = {
          update-props = {
            "session.suspend-timeout-seconds" = 0;
            # Optional: Tweak by trial-and-error if crackling occurs on specific USB interfaces.
            # Do not apply globally without testing, as it may break built-in audio.
            # "api.alsa.period-size" = 2;
            # "api.alsa.headroom" = 8192;
          };
        };
      }];
    };
  };
```

### Real-time scheduling

RTKit handles real-time privileges via D-Bus/Polkit. Critical PAM limits must be set to allow unlimited memlock and high real-time priority for audio buffers.

``` nix
  security.rtkit.enable = true;
  
  security.pam.loginLimits = [
    { domain = "@audio"; item = "memlock"; type = "-"; value = "unlimited"; }
    { domain = "@audio"; item = "rtprio"; type = "-"; value = "99"; }
    { domain = "@audio"; item = "nice"; type = "-"; value = "-19"; }
  ];
  
  users.users.yourname.extraGroups = [ "audio" ]; # Replace 'yourname' with your username
```

### Kernel and performance

Modern mainline kernels include merged PREEMPT_RT patches. Dynamic preemption (`preempt=full`) provides best-effort low latency without the overhead of a dedicated RT kernel. CPU frequency scaling must be locked to prevent sleep-state latency spikes.

``` nix
  boot.kernelPackages = pkgs.linuxPackages_latest;
  boot.kernelParams = [ 
    "threadirqs"
    "preempt=full"              
    "amd_pstate=active"         # Zen 4/5: active mode provides best EPP and responsiveness
    "usbcore.autosuspend=-1"    # Prevent USB audio interface sleep
  ];

  services.power-profiles-daemon.enable = false;
  powerManagement.cpuFreqGovernor = "performance";
  programs.gamemode.enable = true; # Can elevate priorities for real-time audio applications
```

### Plugin search paths

Crucial for NixOS DAWs to find plugins reliably in Wayland/X11 sessions.

``` nix
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
    CLAP_PATH = makePluginPath "clap";
  };
```

### System packages

``` nix
  nixpkgs.config.allowUnfree = true; # Required for REAPER, Bitwig Studio, etc.
  environment.systemPackages = with pkgs; [
    # --- Utilities & routing ---
    qpwgraph            # Visual patchbay for PipeWire (v1.0.3+)
    pwvucontrol         # Modern native PipeWire volume control
    pavucontrol         # Fallback for Pro Audio profile selection
    pw-top              # Real-time CPU usage per audio node
    easyeffects         # System-wide real-time EQ and effects
    
    # --- DAWs ---
    ardour
    reaper
    bitwig-studio       # Native Linux commercial DAW, excellent CLAP support

    # --- Plugin hosts ---
    carla               # Modular plugin host, supports Windows VST via yabridge

    # --- Standalone guitar processors ---
    guitarix            # Includes native NAM and RTNeural module support

    # --- Plugins (LV2/CLAP) ---
    neural-amp-modeler-lv2  # NAM: AI captures of real tube amps
    proteus               # Neural network modeling (LSTM) by GuitarML
    lsp-plugins           # Professional EQ, compression, IR loader (now available in CLAP)
    calf                  # Vintage-style effects
    dragonfly-reverb      # High-quality algorithmic reverb
    gxplugins-lv2         # Guitarix project pedals as standalone LV2
    kapitonov-plugins-pack # Profile-based traditional amp modeling (VST3/LV2)
    chow-centaur          # Klon Centaur emulation
    chow-phaser           # Phaser emulation

    # --- Practice & learning ---
    tuxguitar
    hydrogen

    # --- Windows VST compatibility ---
    yabridge
    (yabridgectl.override { wine = wineWow64Packages.stable; }) # Explicit Wine path
    wineWow64Packages.stable  # Use wineWow64Packages, as wineWowPackages is deprecated
  ];
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

You can change latency dynamically without rebuilding the system. Note that this setting is temporary and will be lost after restarting PipeWire.

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
| **Audient iD4 / iD14 (All Generations)** | Fully functional on NixOS. No special drivers needed. |

### Hardware rules

1.  Connect the interface **directly to the motherboard** (rear panel USB 3.0/3.2). Avoid USB hubs — they add latency and can cause Xruns.
2.  Use a high-quality, shielded USB cable. Audio dropouts are frequently caused by cheap cables acting as antennas for electrical interference.
3.  **Disable Bluetooth** during live playing: `rfkill block bluetooth`. The BT audio stack can generate interrupt storms causing Xruns.
4.  **Limit GPU FPS**: High frame rates in 3D applications or GUI-heavy plugins can generate PCIe interrupt storms causing DPC latency spikes. Cap your FPS or enable VSync in your compositor.

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
| **Ardour** | Professional recording, mixing, editing | For absolute minimum RTL (\<5ms), use the **ALSA backend** (bypasses PipeWire). Warning: ALSA locks the device exclusively — no other app can produce sound. |
| **REAPER** | Commercial DAW, lightweight, scriptable | Uses PipeWire-JACK natively. Excellent Linux support. Unlimited trial. |
| **Bitwig Studio** | Modern commercial DAW | Native Linux support. Superior CLAP format integration. *Note: Direct ALSA backend on NixOS may require manual USB latency compensation; PipeWire-JACK is often more stable out-of-the-box.* |

### Amp simulators and neural modelers

| Software | Purpose | Notes |
|----|----|----|
| **Neural Amp Modeler (NAM)** | LV2 plugin. Loads `.nam` files | AI captures of real tube amps. Now supports **Architecture 2 (A2)** (June 2026), offering higher accuracy with lower CPU usage. Models: [TONE3000](https://tone3000.com) (formerly ToneHunt). |
| **Proteus** | LV2 plugin. Neural network modeling (LSTM) | By GuitarML. Faster preset switching than NAM. |
| **Kapitonov Plugins Pack (KPP)** | Profile-based traditional amp modeling | Excellent for classic rock/metal. Lower CPU than neural nets. Available in LV2 and VST3. |
| **Guitarix** | All-in-one virtual amp + pedals | Standalone or LV2. Now includes native modules for loading `.nam` and RTNeural (`.json`/`.aidax`) models. |

### Effects plugins

| Plugin Pack | Key Features |
|----|----|
| **LSP Plugins** | Professional EQ, compression, gating. Includes LSP Latency Meter and LSP Impulse Response Loader. Now available in CLAP format. |
| **Dragonfly Reverb** | High-quality algorithmic reverb (Hall, Room, Plate). |
| **Chow Plugins** | High-fidelity emulations of classic pedals using RNN/WDF. |
| **Calf Studio Gear** | Vintage-style effects with "warm" analog character. |
| **GxPlugins.lv2** | Guitarix project pedals (distortion, overdrive, fuzz) as standalone LV2. |

### Modular hosts

| Software | Purpose |
|----|----|
| **Carla** | Modular plugin host. Chain plugins visually: Input → Tuner → NAM → IR Loader → Reverb → Output. Hosts Windows VSTs via yabridge. |
| **qpwgraph** | Visual patchbay for PipeWire/JACK (v1.0.3+). Manually connect hardware inputs to software hosts (PipeWire does not auto-connect). |

### Windows VST compatibility

| Tool | Purpose |
|----|----|
| **yabridge + yabridgectl** | Bridge for running Windows VST2/VST3/**CLAP** plugins on Linux via Wine. Essential for commercial plugins (Neural DSP, STL Tones, Amplitube). Note: yabridge 5.0+ supports CLAP, and `yabridgectl sync` registers them in `~/.clap/yabridge`. |
| **PipeASIO** | [Experimental](https://github.com/M0n7y5/pipeasio) ASIO-to-PipeWire driver (v1.2.3+). Bypasses JACK entirely, connecting ASIO directly to PipeWire via `libpipewire-0.3`. Highly recommended for Windows DAWs (FL Studio, Ableton) or games in Proton, as it bypasses the missing `libjack.so.0` in the Steam Runtime container. |

``` bash
# After installing Windows plugins via Wine:
yabridgectl sync  # Required to register plugins with Linux hosts
```

## Tips and tricks

### Rocksmith 2014

Rocksmith 2014 runs on NixOS via Proton and PipeWire. There are two distinct approaches depending on your preferred audio routing. **Do not mix them**, as they are mutually exclusive.

#### Approach A: Declarative via nixos-rocksmith (WineASIO + JACK)

This method uses the [nixos-rocksmith](https://codeberg.org/nizo/linux-rocksmith) flake, which patches Steam to preload `libjack.so` and use `RS_ASIO` with WineASIO.

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

This method bypasses JACK and WineASIO entirely. It is the preferred experimental method for Steam Runtime, as it does not require `libjack.so`.

1.  Build and install [PipeASIO](https://github.com/M0n7y5/pipeasio) under `$HOME/.local` (Proton cannot see system-wide `/usr/lib/wine`).
2.  Register the driver in the game's Wine prefix:

``` bash
env WINEPREFIX="$HOME/.steam/steam/steamapps/compatdata/221680/pfx" pipeasio-register
```

1.  **Steam Launch Options** (point Proton to the local Wine libs):

<!-- -->

    WINEDLLPATH=$HOME/.local/lib/wine PROTON_USE_WOW64=1 gamemoderun %command%

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
| **Xruns (audio glitches)** | Ensure `powerManagement.cpuFreqGovernor = "performance"` is active. Check `pw-top` for high-CPU nodes. Close browsers/heavy apps during playing. Disable Wi-Fi: `sudo modprobe -r <your_wifi_driver>` or `rfkill block wifi` to prevent interrupt storms. As a last resort, add `processor.max_cstate=1` to `boot.kernelParams` (disables CPU sleep — results in extreme power draw and heat, use with caution). |
| **Input clipping / digital distortion** | High-output pickups are overloading the interface's Hi-Z preamp. Use a passive DI-box, an inline pad, or lower your guitar's volume/pickup height. |
| **No sound** | Check `qpwgraph` — PipeWire does not auto-connect hardware. Verify Pro Audio profile in `pavucontrol`. Run `sudo lsof /dev/snd/*` to find conflicting processes. |
| **DAW cannot find plugins** | Ensure `environment.variables` block is applied. Log out/in after rebuild. Verify paths: `echo $LV2_PATH`. |
| **Audio pops a few seconds after playback stops** | WirePlumber suspends the ALSA node after 5 seconds of inactivity. Ensure `session.suspend-timeout-seconds = 0` is set in `wireplumber.extraConfig`. |
| **USB crackling / dropouts** | Increase `api.alsa.period-size` and `api.alsa.headroom` in the WirePlumber `extraConfig` (see Installation section). |
| **GPU causing audio glitches** | Disable GPU power management. Limit FPS in games/DAW to reduce PCIe interrupt storms (DPC latency). Prefer X11 session if you experience visual glitches with older JUCE-based plugins under Wayland. |
| **Bluetooth causing Xruns** | Disable Bluetooth stack: `rfkill block bluetooth` during live sessions. |
| **PipeWire config not applying** | Restart user services after rebuild: `systemctl --user restart pipewire wireplumber`. Check for WirePlumber overrides: `wpctl status`. |

## See also

- <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a> — Official NixOS PipeWire documentation
- <a href="Audio_production" class="wikilink" title="Audio production">Audio production</a> — General audio configuration and plugin paths
- [musnix](https://github.com/musnix/musnix) — Deep NixOS audio optimizations module
- [LinuxMusicians Forum](https://linuxmusicians.com/) — Community support
- [TONE3000](https://tone3000.com) — Largest library of NAM models and IRs (formerly ToneHunt)
- [PipeASIO](https://github.com/M0n7y5/pipeasio) — ASIO to PipeWire bridge for Wine/Proton
- [linux-rocksmith](https://codeberg.org/nizo/linux-rocksmith) — Comprehensive guide to Rocksmith on Linux
- [Rustortion](https://github.com/OpenSauce/rustortion) — Modern Rust-based amp sim (experimental, build from source)
- [AIDA-X](https://github.com/AidaDSP/AIDA-X) — RTNeural-based amp model player (experimental)
- [Ratatouille.lv2](https://github.com/brummer10/Ratatouille.lv2) — Dual neural modeler (experimental)

<a href="Category:Guides" class="wikilink" title="Category:Guides">Category:Guides</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Sound" class="wikilink" title="Category:Sound">Category:Sound</a>
