<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Electric guitar interface setup -->

This guide covers setting up an **electric guitar** with NixOS to achieve professional, low-latency audio processing. It targets live playing with round-trip latency (RTL) under 6 ms using the modern PipeWire and WirePlumber stack.

The digital signal chain for a guitar consists of:

1.  **Instrument-level signal** from Hi-Z pickups.
2.  **Analog-to-digital conversion** via an external audio interface.
3.  **Real-time processing** on NixOS using a low-latency kernel and specialized software.

## Quick Start

If you want to get sound from your guitar within 15 minutes, follow these minimal steps. Ensure you have a compatible USB audio interface (see <a href="#Hardware" class="wikilink" title="Hardware">Hardware</a> section).

1.  Connect your interface directly to the motherboard (rear USB port).
2.  Add the following minimal configuration to your `/etc/nixos/configuration.nix`:

``` nix
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    jack.enable = true;
    wireplumber.enable = true;
    extraConfig.pipewire."92-low-latency" = {
      "context.properties" = {
        "default.clock.rate" = 48000;
        "default.clock.quantum" = 128;
        "default.clock.min-quantum" = 32;
        "default.clock.max-quantum" = 512;
      };
    };
  };
  security.rtkit.enable = true;
  environment.systemPackages = with pkgs; [ carla neural-amp-modeler-lv2 lsp-plugins pavucontrol ];
```

1.  Rebuild and switch:

``` bash
sudo nixos-rebuild switch
systemctl --user restart pipewire wireplumber
```

1.  Open `pavucontrol`, go to the **Configuration** tab, and set your interface profile to **Pro Audio**.
2.  Launch `carla`, add the `Neural Amp Modeler` plugin, and connect your interface's input to the plugin and the plugin's output to the interface.

## Hardware

Standard PC line-ins are unsuitable for guitar due to impedance mismatch. You need a dedicated interface with a Hi-Z (Instrument) input.

### Why special cards are needed

Linux supports USB Audio Class 2.0 (UAC2) compliant devices natively. However, **Thunderbolt audio interfaces generally do not work on Linux** due to proprietary, closed protocols. Even high-end interfaces from Focusrite (Clarett Thunderbolt), RME, and Universal Audio will not function properly. Always choose USB interfaces, unless you are willing to use an experimental, reverse-engineered driver that currently only supports basic control routing without PCM audio streaming.

### The clipping problem

The input headroom capacity is measured in **dBu**. A higher value means the interface can handle louder input transients without clipping.

| Device                             | Headroom (dBu) | Status          |
|------------------------------------|----------------|-----------------|
| **PreSonus Studio HD2 / 24c**      | 21 dBu         | ✅ Excellent    |
| **MOTU M2 / M4**                   | 16 dBu         | ✅ Good         |
| **Focusrite Scarlett 2i2 3rd Gen** | 12.5 dBu       | ⚠️ Average      |
| **Audient iD14 MkII**              | 9 dBu          | ❌ Clips easily |
| **Steinberg UR44**                 | 8.5 dBu        | ❌ Clips easily |

### Practical example: high-output pickups and low-headroom interfaces

This section demonstrates how to set up a guitar with high-output pickups when using an interface with limited input headroom. The principles apply to any similar setup.

**Example setup:**

- **Guitar:** Schecter Omen-6 with Schecter Diamond Plus ceramic humbuckers and 9–42 strings.
- **Interface:** Focusrite Scarlett Solo (3rd Gen) — 12.5 dBu headroom on the Hi-Z input.

#### Step 1: Physical guitar setup

High-output ceramic humbuckers combined with light strings produce a very sharp attack that can easily clip low-headroom inputs. To reduce the signal at the source:

1.  **Lower the bridge pickup** using a screwdriver. Turn the height screws clockwise to move the pickup further from the strings. This reduces the magnetic field strength and the output voltage.
2.  **Set the guitar volume knob to 7–8** instead of 10. This preserves tone while reducing peak transients.

#### Step 2: Interface configuration

1.  **Enable INST mode:** Press the INST button on the Scarlett Solo. The indicator should light up. Without this, the input operates in mic mode (low impedance), causing muffled tone and instant clipping.
2.  **Set Gain to minimum (0):** Turn the gain knob fully counter-clockwise.

#### Step 3: Testing for clipping

Open your DAW or a visualizer plugin (e.g., LSP Analyzer) and play the hardest downstroke you can on the open 6th string.

- **If the waveform shows flat tops** (hard clipping) even at 0% gain, your interface cannot handle the signal level.
- **If the peaks stay around −12 dBFS or lower,** you have sufficient headroom.

#### Step 4: Using a passive DI-box

If your interface clips even at 0% gain, insert a **passive DI-box** (e.g., Palmer PAN 01, ART DTI, AMT Reincarnator RD2) between the guitar and the interface:

1.  Connect guitar → DI-box input (TS cable).
2.  Connect DI-box XLR output → interface mic input (XLR cable).
3.  Make sure Phantom Power (+48V) is **off** — a passive DI-box does not require it.
4.  Disable the INST button on the interface, since the signal now arrives at the mic input.

This converts the instrument-level signal to mic-level, matching the interface's input stage and preserving the full dynamic range of your playing.

#### Choosing an interface by headroom

When selecting an interface, check the **Maximum Input Level (dBu)** of its instrument input:

- **≥ 15 dBu** — sufficient headroom for most humbuckers; a DI-box is not needed.
- **10–14 dBu** — works with most guitars, but a DI-box may be required with hot pickups.
- **\< 10 dBu** — high risk of clipping with humbuckers; a DI-box is almost mandatory.

The Focusrite Scarlett 2i2 and Solo (3rd Gen) have a value of **12.5 dBu**, which is average. With high-output pickups, clipping is easy to hit. This is why the Schecter Omen-6 + Scarlett Solo combination is a classic example where either careful Gain and pickup-height adjustment or a passive DI-box is required.

### Recommendations

For NixOS, plug-and-play compatibility is critical. Choose interfaces with high dBu ratings to preserve the natural attack of your guitar.

| Device | Notes |
|----|----|
| **Focusrite Scarlett 4th Gen (Solo/2i2/4i4)** | Plug-and-play. Requires disabling MSD Mode (hold 48V button while powering on). `alsa-scarlett-gui` v1.0 beta 9 works natively. |
| **Focusrite Scarlett 4th Gen (16i16/18i16/18i20)** | Requires kernel ≥ 6.12, `fcp-support`, and a firmware update via `alsa-scarlett-gui`. |
| **MOTU M2 / M4** | Native ALSA kernel support (requires kernel ≥ 6.1). Direct hardware mixer control via `alsamixer`. Exceptionally stable USB-C latency. |
| **Audient iD4 / iD14 (All Generations)** | Fully functional on NixOS. Note: iD14 MkII has limited Hi-Z headroom (9 dBu). |

### DI-box

If you already own a budget interface with low dBu and experience clipping, **use a passive DI-box** (e.g., Palmer PAN 01, ART DTI). A passive DI-box naturally attenuates the signal by ~20–23 dB, converting it to a balanced microphone level. Connect the DI-box between your guitar and the interface's XLR input.

## System configuration

Add the following snippets to your `/etc/nixos/configuration.nix`. This configuration is optimized for high-performance CPUs.

### PipeWire

Configure PipeWire with global low-latency defaults and disable node suspension to prevent audio pops on USB interfaces. Note that WirePlumber 0.5+ (standard in NixOS 26.05) supports SPA-JSON syntax, which is preferred over deprecated Lua scripts.

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
        "default.clock.quantum" = 128;      # ~5 ms latency at 48 kHz
        "default.clock.min-quantum" = 32;   # Allows top-tier interfaces to achieve ~1.5 ms
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
          };
        };
      }];
    };
  };
```

### Kernel and performance

Modern mainline kernels include merged PREEMPT_RT patches. Dynamic preemption (`preempt=full`) provides best-effort low latency without the overhead of a dedicated RT kernel. CPU frequency scaling must be locked to prevent sleep-state latency spikes.

``` nix
  boot.kernelPackages = pkgs.linuxPackages_latest;
  boot.kernelParams = [ 
    "preempt=full"              
    "usbcore.autosuspend=-1"    # Prevent USB audio interface sleep
  ];

  services.power-profiles-daemon.enable = false;
  powerManagement.cpuFreqGovernor = "performance";
  programs.gamemode.enable = true; # Can elevate priorities for real-time audio applications
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

## Software installation

``` nix
  nixpkgs.config.allowUnfree = true; # Required for REAPER, Bitwig Studio
  environment.systemPackages = with pkgs; [
    # --- Utilities & routing ---
    qpwgraph            # Visual patchbay for PipeWire (v1.0.4+)
    pwvucontrol         # Modern native PipeWire volume control (v0.5.3+)
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
    neural-amp-modeler-lv2  # NAM: AI captures of real tube amps (v0.2.3, supports A2)
    proteus               # Neural network modeling (LSTM) by GuitarML
    lsp-plugins           # Professional EQ, compression, IR loader (now available in CLAP)
    calf                  # Vintage-style effects
    dragonfly-reverb      # High-quality algorithmic reverb
    gxplugins-lv2         # Guitarix project pedals as standalone LV2
    kapitonov-plugins-pack # Profile-based traditional amp modeling (VST3/LV2)
    chow-centaur          # Klon Centaur emulation
    chow-phaser           # Phaser emulation
    ratatouille-lv2       # Dual neural modeler (loads .nam, .json, .aidax)

    # --- Practice & learning ---
    tuxguitar
    hydrogen

    # --- Windows VST compatibility ---
    yabridge
    (yabridgectl.override { wine = wineWow64Packages.stable; }) # Explicit 64-bit Wine path
    wineWow64Packages.stable  # Note: wineWowPackages is deprecated
  ];
```

### Digital audio workstations

| Software | Purpose | Notes |
|----|----|----|
| **Ardour** | Professional recording, mixing, editing | For absolute minimum RTL (\< 5 ms), use the **ALSA backend** (bypasses PipeWire). Warning: ALSA locks the device exclusively — no other app can produce sound. |
| **REAPER** | Commercial DAW, lightweight, scriptable | Uses PipeWire-JACK natively. Excellent Linux support. Can be declaratively configured via [Reaper HM Flake](https://github.com/9Prestidigitator/reaper-flake). |
| **Bitwig Studio** | Modern commercial DAW | Native Linux support. Superior CLAP format integration. PipeWire-JACK is often more stable out-of-the-box than Direct ALSA. |

### Amp simulators and neural modelers

| Software | Purpose | Notes |
|----|----|----|
| **Neural Amp Modeler (NAM)** | LV2 plugin. Loads `.nam` files | AI captures of real tube amps. Architecture 2 (A2) released in June 2026 offers higher accuracy with 30–40% less CPU. Models: [TONE3000](https://tone3000.com). |
| **Proteus** | LV2 plugin. Neural network modeling (LSTM) | By GuitarML. Faster preset switching than NAM. |
| **Kapitonov Plugins Pack (KPP)** | Profile-based traditional amp modeling | Excellent for classic rock/metal. Available in LV2 and VST3. |
| **Guitarix** | All-in-one virtual amp + pedals | Standalone or LV2. Includes native modules for loading `.nam` and RTNeural models. |

### Modular hosts

| Software | Purpose |
|----|----|
| **Carla** | Modular plugin host. Chain plugins visually: Input → Tuner → NAM → IR Loader → Reverb → Output. Hosts Windows VSTs via yabridge. |
| **qpwgraph** | Visual patchbay for PipeWire/JACK. Manually connect hardware inputs to software hosts (PipeWire does not auto-connect). |

## Configuration and first launch

### Pro audio profile

To achieve minimal latency, you must bypass standard software mixing:

1.  Open `pavucontrol`.
2.  Go to the **Configuration** tab.
3.  Set your interface profile to **Pro Audio**.

If the "Pro Audio" profile is missing, ensure `pipewire-alsa` is installed and restart PipeWire. This profile disables software mixing and enables hardware-exclusive mode, critical for the lowest latency.

### Latency verification

Always perform a physical loopback test to measure the real Round-trip Latency (RTL).

1.  Connect a cable from your interface **Output** back into the **Input**.
2.  Launch LSP Latency Meter:

``` bash
# Option A: Via Carla (recommended for beginners)
carla  # Add plugin "LSP Latency Meter Stereo", connect wires

# Option B: Via jalv (terminal)
jalv http://lsp-plug.in/plugins/lv2/latency_meter_stereo
```

1.  Play a sharp transient (string scratch) and read the **Round-trip Latency (RTL)** value.

**Target values**:

- \< 5 ms: Excellent
- 5–10 ms: Acceptable for practice
- \> 12 ms: Noticeable "lag", difficult to play in time

### Typical processing chain

For a standard metal/rock tone, route your signal in `carla` or your DAW as follows: **Hardware Input** → **Noise Gate** (e.g., LSP Gate) → **NAM** (Load A2-Full model) → **LSP IR Loader** (Load Cabinet Impulse Response) → **Dragonfly Reverb** → **Hardware Output**.

## Windows VST via Wine

### Yabridge

Yabridge (v5.1.1+) bridges Windows VST2/VST3/**CLAP** plugins to Linux via Wine. It is essential for commercial plugins (Neural DSP, STL Tones, Amplitube).

``` bash
# After installing Windows plugins via Wine:
yabridgectl sync  # Required to register plugins with Linux hosts
```

### JUCE 8 black screen fix

To fix this, you must use patched Wine builds. The [giang17/wine-d2d1-dcomp](https://github.com/giang17/wine/tree/d2d1-dcomp-11.0) project provides prebuilt binaries and a guide for Arch/CachyOS.

### PipeASIO for Proton/Steam

For Windows DAWs (FL Studio, Ableton) or games (Rocksmith) running via Proton, [PipeASIO](https://github.com/M0n7y5/pipeasio) (v1.7.0, Sept 2026) connects ASIO directly to PipeWire, bypassing the missing `libjack.so.0` in the Steam Runtime container.

## Rocksmith 2014

Rocksmith 2014 runs on NixOS via Proton. The recommended method uses the [nixos-rocksmith](https://codeberg.org/nizo/linux-rocksmith) flake, which patches Steam to preload `libjack.so` and use `RS_ASIO` with WineASIO. For visual patching, `crosspipe` is recommended as a modern alternative to `helvum`.

``` nix
programs.steam = {
  enable = true;
  rocksmithPatch.enable = true;
};
```

**Steam Launch Options**:

    LD_PRELOAD=/run/current-system/sw/lib/libjack.so PIPEWIRE_LATENCY=128/48000 %command%

## Troubleshooting

| Symptom | Cause & Solution |
|----|----|
| **Xruns (audio glitches)** | Ensure `powerManagement.cpuFreqGovernor = "performance"` is active. Check `pw-top` for high-CPU nodes. Disable Wi-Fi: find driver name via `lspci -k` or `lshw -class network`, then run `rfkill block wifi` to prevent interrupt storms. |
| **Extreme latency stutters** | As a last resort, add `processor.max_cstate=1` to `boot.kernelParams`. **Warning:** This disables CPU sleep states, resulting in extreme power draw and heat. Use with caution. |
| **Input clipping / digital distortion** | High-output pickups are overloading the interface's Hi-Z preamp (low dBu). Use a passive DI-box, an inline pad, or lower your guitar's pickup height. |
| **No sound** | Check `qpwgraph` — PipeWire does not auto-connect hardware. Verify Pro Audio profile in `pavucontrol`. Run `sudo lsof /dev/snd/*` to find conflicting processes. |
| **DAW cannot find plugins** | Ensure `environment.variables` block is applied. Log out/in after rebuild. Verify paths: `echo $LV2_PATH`. |
| **Audio pops a few seconds after playback stops** | WirePlumber suspends the ALSA node after 5 seconds of inactivity. Ensure `session.suspend-timeout-seconds = 0` is set in `wireplumber.extraConfig`. |
| **JUCE 8 VST shows black screen** | Stock Wine lacks Direct2D support. Install `wine-d2d1-dcomp` patches by giang17 and route the specific plugin to this patched Wine version using yabridge's dispatcher trick. |
| **PipeWire config not applying** | Restart user services after rebuild: `systemctl --user restart pipewire wireplumber`. Check for WirePlumber overrides: `wpctl status`. |

## See also

- <a href="PipeWire" class="wikilink" title="PipeWire">PipeWire</a> — Official NixOS PipeWire documentation
- <a href="Audio_production" class="wikilink" title="Audio production">Audio production</a> — General audio configuration and plugin paths
- [musnix](https://github.com/musnix/musnix) — Deep NixOS audio optimizations module
- [TONE3000](https://tone3000.com) — Largest library of NAM A2 models and IRs
- [PipeASIO](https://github.com/M0n7y5/pipeasio) — ASIO to PipeWire bridge for Wine/Proton
- [Rustortion](https://github.com/OpenSauce/rustortion) — Modern Rust-based amp sim (experimental, build from source)
- [AIDA-X](https://github.com/AidaDSP/AIDA-X) — RTNeural-based amp model player (experimental)
- [neural-amp-modeler-ui](https://github.com/brummer10/neural-amp-modeler-ui) — GUI wrapper for NAM (experimental)

<a href="Category:Guides" class="wikilink" title="Category:Guides">Category:Guides</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Sound" class="wikilink" title="Category:Sound">Category:Sound</a>
