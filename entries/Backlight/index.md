<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Backlight -->

This page documents methods for controlling backlight (aka screen brightness) and tips to control it via hotkeys.

## Kernel native

Some laptops, using a recent enough kernel, will automatically handle increasing and decreasing the backlight using the hot keys. The following tools will allow scripting or controlling the backlight using other means, if desired.

## Desktop Environment native

Some desktop environments will handle querying and setting the backlight, including configuring the backlight keys. These include at least: Plasma (KDE) and XFCE. It may be needed to configure or start some desktop environment-specific services.

## `xbacklight`

`xbacklight` uses X to change the light settings. This can be inconvenient in some situations, e.g. for use with the service, which doesn't know about the X session. It, though, has an history of being more compatible with different hardware, especially newer hardware<sup>\[citation needed\]</sup>

To install `xbacklight` globally, add this to your `configuration.nix`.

``` nix
  environment.systemPackages = with pkgs; [ xorg.xbacklight ];
```

Alternatively, use `nix-env -iA nixos.xorg.xbacklight` to install it to your user profile.

## `light`

`light` does not use X to change the light settings. This can be used in situations where the X service isn't available. While it does not use X, it will need some privileges to work.

To enable the use of `light`, add this to your `configuration.nix` and make sure that your user is a member of the `video` group.

``` nix
  programs.light.enable = true;
```

The following commands will allow you to test `light`:

- `light -U 30` — the screen should become darker.
- `light -A 30` — the screen should become brighter.

Be careful using `light -U`, as you might turn your backlight completely off! You will not be able to see what you're typing anymore.

## `brightnessctl`

([homepage](https://github.com/Hummer12007/brightnessctl)) is another option, which, like `light`, would work even without X or on Wayland.

You can use it by simply installing the package. Since `brightnessctl` supports the systemd-logind API it should work out of the box (i.e. without installing any udev rules or using a setuid wrapper).

The following commands will allow you to test `brightnessctl`:

- `brightnessctl set 5%-` - the screen should become darker.
- `brightnessctl set 5%+` - the screen should become brighter.

If you get an error like `Failed to set brightness: Protocol error`, check that you are using the right device. You can get a list of the devices with running `brightnessctl -l` and then specify the device with `-d deviceName`.

Example: `brightnessctl set 5%- -d intel_backlight`

## External Monitors

The DDC/CI (I2C) interface may be available to control the brightness of your external monitor. There are two ways to do this:

### Via `ddcutil`

``` shell
$ sudo modprobe i2c-dev
$ nix-shell -p ddcutil --command "sudo ddcutil --bus=MYBUSNUM setvcp 10 MYBRIGHTNESSPCT"
```

You can find the correct bus number by examining the paths in `/sys/bus/i2c/devices`. e.g. to control the `DP4` device below use device `17`.

``` shell
$ ls -l /sys/bus/i2c/devices/
lrwxrwxrwx - root  2 Nov 12:34 i2c-13 -> ../../../devices/pci0000:00/0000:00:02.0/drm/card1/card1-eDP-1/i2c-13
lrwxrwxrwx - root  2 Nov 12:34 i2c-14 -> ../../../devices/pci0000:00/0000:00:02.0/drm/card1/card1-DP-1/i2c-14
lrwxrwxrwx - root  2 Nov 12:34 i2c-15 -> ../../../devices/pci0000:00/0000:00:02.0/drm/card1/card1-DP-2/i2c-15
lrwxrwxrwx - root  2 Nov 12:34 i2c-16 -> ../../../devices/pci0000:00/0000:00:02.0/drm/card1/card1-DP-3/i2c-16
lrwxrwxrwx - root  2 Nov 12:34 i2c-17 -> ../../../devices/pci0000:00/0000:00:02.0/drm/card1/card1-DP-4/i2c-17
```

All together:

``` shell
nix-shell -p ddcutil --command "sudo ddcutil --bus=17 setvcp 10 65"
```

You can then bind this to a hotkey or similar.

To make this permanent, add to your system packages, and enable i2c support.

``` nix
hardware.i2c.enable = true
```

To interact with DDC/CI without root, also add your user to the `i2c` group (or the group defined by [`hardware.i2c.group`](https://search.nixos.org/options?show=hardware.i2c.group&query=hardware.i2c.group)), or [set udev rules manually](https://www.ddcutil.com/i2c_permissions/).

### Via `ddcci-driver`

A [driver](https://gitlab.com/ddcci-driver-linux/ddcci-driver-linux) exists which exposes the ddcci control as a more standard `backlight` device, allowing it to be controlled by standard utilities such as `brightnessctl`. e.g. when setup:

``` shell
$ find /sys/class/backlight
/sys/class/backlight
/sys/class/backlight/ddcci17
/sys/class/backlight/intel_backlight

$ brightnessctl --device=ddcci17 set 100%
Updated device 'ddcci17':
Device 'ddcci17' of class 'backlight':
    Current brightness: 100 (100%)
    Max brightness: 100
```

Get the i2c name:

``` shell
$ cat /sys/bus/i2c/devices/i2c-17/name                     
AUX USBC4/DDI TC4/PHY TC4
```

``` nix
boot.extraModulePackages = with config.boot.kernelPackages; [ ddcci-driver ];
boot.kernelModules = [ "ddcci-backlight" ];
services.udev.extraRules = let
      bash = "${pkgs.bash}/bin/bash";
      ddcciDev = "AUX USBC4/DDI TC4/PHY TC4";                                                                                                      
      ddcciNode = "/sys/bus/i2c/devices/i2c-17/new_device";
    in ''
      SUBSYSTEM=="i2c", ACTION=="add", ATTR{name}=="${ddcciDev}", RUN+="${bash} -c 'sleep 30; printf ddcci\ 0x37 > ${ddcciNode}'"
    '';
```

Device autodetection is tricky with i2c so we need to trigger it manually with the `0x37` code. The `sleep` is often unfortunately necessary.

The driver has had some issues with kernels \> 6.8, the below overlay should allow it to build if you encounter issues ([source](https://gitlab.com/ddcci-driver-linux/ddcci-driver-linux/-/merge_requests/17)).

``` nix
  nixpkgs.overlays = [
      (self: super: {
        linuxPackages_latest = super.linuxPackages_latest.extend (lpself: lpsuper: {
          ddcci-driver = super.linuxPackages_latest.ddcci-driver.overrideAttrs (oldAttrs: {
            version = super.linuxPackages_latest.ddcci-driver.version + "-FIXED";
            src = pkgs.fetchFromGitLab {
              owner = "ddcci-driver-linux";
              repo = "ddcci-driver-linux";
              rev = "0233e1ee5eddb4b8a706464f3097bad5620b65f4";
              hash = "sha256-Osvojt8UE+cenOuMoSY+T+sODTAAKkvY/XmBa5bQX88=";
            };
            patches = [
              (pkgs.fetchpatch {
                name = "ddcci-e0605c9cdff7bf3fe9587434614473ba8b7e5f63.patch";
                url = "https://gitlab.com/nullbytepl/ddcci-driver-linux/-/commit/e0605c9cdff7bf3fe9587434614473ba8b7e5f63.patch";
                hash = "sha256-sTq03HtWQBd7Wy4o1XbdmMjXQE2dG+1jajx4HtwBHjM=";                                                                      
              })
            ];
          });
        });
      })
    ];
```

## `/sys/class/backlight/...`

The `/sys/class/backlight/*/brightness` files are a built-in way to set brightness. Use them e.g. with:

``` bash
  sudo tee /sys/class/backlight/intel_backlight/brightness <<< 300
```

to set the brightness to `300`, where the maximum is stored in `brightness_max`. You can set file permissions e.g. with a udev rule, if you don't want to use sudo. Here is an example udev rule, where you will likely have to replace intel_backlight, with the name in your /sys/class/backlight/:

``` nix
  services.udev.extraRules = ''
    ACTION=="add", SUBSYSTEM=="backlight", KERNEL=="intel_backlight", MODE="0666", RUN+="${pkgs.coreutils}/bin/chmod a+w /sys/class/backlight/%k/brightness"
  '';
```

## Tips

### Key mapping

While controlling the backlight via the command line is useful, it would be preferable to control it using key bindings. This is especially true considering most laptops have backlight control keys.

There are two main choices to add key bindings, using a system-level service like <a href="actkbd" class="wikilink" title="actkbd">actkbd</a> or using an X session tool, either provided by your <a href=":Category:Desktop_environment" class="wikilink" title="Desktop environment">Desktop environment</a>, <a href="Window_manager" class="wikilink" title="Window manager">Window manager</a> or a tool like <a href="xbindkeys" class="wikilink" title="xbindkeys">xbindkeys</a>.

Depending on the tools that work for controlling the backlight you will be able to choose one of those options.

|                | `light` | `xbacklight` |
|----------------|---------|--------------|
| System service | Yes     | With hacks   |
| X session      | Yes     | Yes          |

Follows, an example mapping for use with actkbd:

``` nix
  programs.light.enable = true;
  services.actkbd = {
    enable = true;
    bindings = [
      { keys = [ 224 ]; events = [ "key" ]; command = "/run/current-system/sw/bin/light -A 10"; }
      { keys = [ 225 ]; events = [ "key" ]; command = "/run/current-system/sw/bin/light -U 10"; }
    ];
  };
```

## OLED Screens

OLED screens do not have a backlight, but their perceived brightness can be changed via xrandr:

- <code>xrandr --output
  <output>

  --brightness .5</code> - dim to 50%
- <code>xrandr --output
  <output>

  --brightness 1</code> - no dimming

## See also

- [Arch Linux wiki page about the backlight](https://wiki.archlinux.org/index.php/backlight)

<a href="category:hardware" class="wikilink" title="category:hardware">category:hardware</a>
