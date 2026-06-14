<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Framework/Laptop 16 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Framework Laptop 16</p></th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Laptop 16</p></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p><a href="Hardware/Framework" class="wikilink" title="Framework">Framework</a></p></td>
</tr>
<tr>
<td><p>Support</p></td>
<td><p><a href="https://knowledgebase.frame.work/framework-component-linux-support-matrix-B1gwmFtPgg">components</a></p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>x86_64-linux</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>AMD Ryzen 7040 Series</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td></td>
</tr>
<tr>
<td colspan="2" class="title"><p>AMD Ryzen AI 300 Series</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
</tr>
</tbody>
</table>

</div>

The Framework Laptop 16 is a configurable, upgradeable, and repairable laptop made by Framework.

## Status

The device boots NixOS and works well with a recent kernel and the appropriate nixos-hardware module for your CPU generation.

## Known issues

The device still has a couple of hardware quirks (see below).

<a href="Linux_kernel" class="wikilink" title="Using the latest kernel">Using the latest kernel</a> will fix some issues. Also read configuration hints in this article.

### Double suspend after GNOME automatic/idle suspend (systemd v258 regression)

Some users have reported a "double suspend" / "suspend loop" on Framework Laptop 16 (notably with GNOME and the NVIDIA dGPU module): after the machine suspends due to \*automatic idle suspend\* and is resumed, it may suspend again ~20-30 seconds later (sometimes repeating multiple times). Manual suspend and lid-close suspend may still behave normally.

Upstream tracking:

- <https://github.com/systemd/systemd/issues/40078>
- <https://github.com/systemd/systemd/issues/39259>

#### Workaround 1: add a post-resume sleep inhibitor

Add this snippet to configuration.nix:

``` nix
systemd.services.inhibit-sleep-after-resume = {
  description = "Temporary sleep inhibitor after resume (workaround for double-suspend)";
  wantedBy = [ "post-resume.target" ];
  after = [ "post-resume.target" ];
  serviceConfig.Type = "oneshot";
  script = ''
    ${pkgs.systemd}/bin/systemd-inhibit \
      --mode=block \
      --what=sleep:idle \
      --why="Workaround: avoid immediate second suspend after resume" \
      ${pkgs.coreutils}/bin/sleep 60
  '';
};
```

#### Workaround 2: disable GNOME idle-suspend (low risk; lid-close suspend still works)

##### Quick (imperative) test

Disable idle suspend on AC power:

``` sh
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type 'nothing'
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout 0
```

Optionally also disable it on battery:

``` sh
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-type 'nothing'
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-battery-timeout 0
```

##### Declarative configuration (recommended)

``` nix
{ lib, ... }:

{

# Declaratively set GNOME dconf defaults.

programs.dconf.enable = true;
programs.dconf.profiles.user.databases = [
  {
    settings = {
      "org/gnome/settings-daemon/plugins/power" = {
        # Disable idle-suspend on AC power (keeps lid-close suspend behavior):
        sleep-inactive-ac-type = "nothing";
        sleep-inactive-ac-timeout = lib.gvariant.mkUint32 0;

        # Optional: also disable idle-suspend on battery:
        # sleep-inactive-battery-type = "nothing";
        # sleep-inactive-battery-timeout = lib.gvariant.mkUint32 0;
      };
    };
  }

];
}
```

After applying, log out and log back in (or reboot) to ensure GNOME picks up the updated settings.

#### Workaround 3: pin nixpkgs to pre-systemd-v258 for the affected machine (higher impact)

If you prefer to keep GNOME idle-suspend enabled, another workaround is to pin the affected system to a nixpkgs revision before systemd v258 landed.

- Commit that introduced systemd v258: <https://github.com/NixOS/nixpkgs/commit/70ca21d3c4982d7f95e48688d02cd9ef6b1347f5>
- Latest pre-v258 commit (pre-merge parent): <https://github.com/NixOS/nixpkgs/commit/d3736636ac39ed678e557977b65d620ca75142d0>.

## Configuration

Framework-specific NixOS hardware configuration is bundled within the [nixos-hardware](https://github.com/NixOS/nixos-hardware) project.

### AMD Ryzen 7040 Series

It is recommended to use [power-profiles-daemon](https://search.nixos.org/options?query=power-profiles-daemon) over `tlp` for the AMD Framework.

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-16-7040-amd`
- NixOS Hardware module for channels: `<nixos-hardware/framework/16-inch/7040-amd>`

### AMD Ryzen AI 300 Series

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-16-amd-ai-300-series`
- NixOS Hardware module for channels: `<nixos-hardware/framework/16-inch/amd-ai-300-series>`

#### NVIDIA dGPU module (RTX 5070 etc.)

If you have the NVIDIA dGPU module, prefer the maintained nixos-hardware NVIDIA submodule (it enables hybrid graphics with PRIME offload and provides `nvidia-offload <command>`):

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-16-amd-ai-300-series-nvidia`
- NixOS Hardware module for channels: `<nixos-hardware/framework/16-inch/amd-ai-300-series/nvidia>`

**IMPORTANT:** You MUST override the PRIME PCI bus IDs for your specific system. Framework 16’s modular design means bus IDs can vary depending on installed expansion cards and NVMe drives.

Example override:

``` nix
{
  # In your system configuration:
  hardware.nvidia.prime = {
    # Replace these values with your own system's IDs:
    amdgpuBusId = "PCI:XXX:YY:Z";
    nvidiaBusId = "PCI:AAA:BB:C";
  };
}
```

Find PCI IDs:

``` sh
$ nix-shell -p pciutils --run 'lspci | grep -E "VGA|3D|Display"'
```

Convert the hex bus/device numbers to decimal and format as `PCI:<bus>:<device>:<function>`. Example: `c1:00.0` → `PCI:193:0:0`.

Quick helper (optional):

``` sh
# Replace BDF with the lspci value like c1:00.0
BDF="c1:00.0"
BUS="${BDF%%:*}"; REST="${BDF#*:}"
DEV="${REST%%.*}"; FUN="${REST#*.}"
printf 'PCI:%d:%d:%d\n' "$((16#$BUS))" "$((16#$DEV))" "$FUN"
```

Validation (hybrid/offload):

``` sh
# Default: should show AMD iGPU
nix-shell -p mesa-demos --run 'glxinfo -B | grep -E "OpenGL vendor|OpenGL renderer"'

# Offload: should show NVIDIA dGPU
nix-shell -p mesa-demos --run 'nvidia-offload glxinfo -B | grep -E "OpenGL vendor|OpenGL renderer"'

# Idle power check: should become "suspended" when idle
cat /sys/bus/pci/devices/0000:??:??.?/power/runtime_status
```

Note: `nvidia-smi` can wake the GPU, so it is not a reliable “is the GPU sleeping?” probe.

### Fix color accuracy in Power Saving modes

[Active Backlight Management](https://docs.kernel.org/gpu/amdgpu/module-parameters.html?highlight=abmlevel) is used to reduce [battery power consumption](https://community.frame.work/t/solved-color-issues-in-linux-6-9/52158/34), which can cause the colors of the screen to be inaccurate.

Some desktop environments may already be able to modify this setting.

To disable it add the kernel parameter:

``` nix
boot.kernelParams = [ "amdgpu.abmlevel=0" ];
```

### Prevent wake up in backpack

Putting your Framework in a backpack can cause it to wake up due to the screen flexing onto the keyboard. While this is not resolved in firmware, you can work around this issue with a udev rule.

If you are also importing `nixos-hardware`, prefer merging (e.g. `lib.mkAfter`) rather than overwriting `services.udev.extraRules`, since nixos-hardware may install its own udev rules.

``` nix
{ lib, ... }:
{
  services.udev.extraRules = lib.mkAfter ''
    SUBSYSTEM=="usb", DRIVERS=="usb", ATTRS{idVendor}=="32ac", ATTRS{idProduct}=="0012", ATTR{power/wakeup}="disabled", ATTR{driver/1-1.1.1.4/power/wakeup}="disabled"
    SUBSYSTEM=="usb", DRIVERS=="usb", ATTRS{idVendor}=="32ac", ATTRS{idProduct}=="0014", ATTR{power/wakeup}="disabled", ATTR{driver/1-1.1.1.4/power/wakeup}="disabled"
  '';
}
```

| Product              | Vendor and Product ID                  |
|----------------------|----------------------------------------|
| RGB Macropad         | 32ac 0013                              |
| Backlit keyboard ISO | 32ac 0018                              |
| Other devices        | Use `lsusb` to find Vendor/Product IDs |

This does not prevent the trackpad from waking up the device; this however seems to happen less in a backpack.

### BIOS configuration

Enable [Linux Audio Compatibility](https://guides.frame.work/Guide/Ubuntu+22.04+LTS+Installation+on+the+Framework+Laptop+16/306?lang=en#s1974) in the BIOS to improve speaker audio quality.

## Useful utilities

Framework provides and the community maintains utilities that help manage Framework hardware.

- `framework-tool` provides libraries and tools to interact with Framework-specific features.
- Input modules (LED matrix / numpad) can be controlled with tools such as `inputmodule-control`.

To enable input module support (if installed), set:

``` nix
hardware.inputmodule.enable = true;
```

Example (LED matrix clock):

``` sh
# Serial device is often /dev/ttyACM0 (or ttyACM1 if you have two modules)
inputmodule-control --serial-dev /dev/ttyACM0 led-matrix --clock
```

## External resources

There is [a NixOS thread on the Framework forum](https://community.frame.work/t/nixos-on-the-framework-laptop-16/46743), where you can find additional help, guidance, and example configurations.

<a href="Category:_Incomplete" class="wikilink" title="Category: Incomplete">Category: Incomplete</a>
