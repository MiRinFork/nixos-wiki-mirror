<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Sway -->

[Sway](https://swaywm.org/) is a tiling <a href="Wayland" class="wikilink" title="Wayland">Wayland</a> compositor and a drop-in replacement for the <a href="i3" class="wikilink" title="i3">i3</a> window manager for X11. It can work with an existing i3 configuration and supports most of i3's features, plus a few extras. For users migrating from i3, see the [i3 migration guide](https://github.com/swaywm/sway/wiki/i3-Migration-Guide).

## Setup

You can install Sway by enabling it in NixOS directly, or by using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, or both.

### Using NixOS

Here is a minimal configuration:

By default, the Sway module in NixOS comes with a set of extra packages, including [Foot](https://codeberg.org/dnkl/foot/) terminal, <a href="Swayidle" class="wikilink" title="Swayidle">Swayidle</a>, <a href="Swaylock" class="wikilink" title="Swaylock">Swaylock</a>, and [wmenu](https://codeberg.org/adnano/wmenu/), which may be configured under the [`programs.sway.extraPackages`](https://search.nixos.org/options?show=programs.sway.extraPackages) option. You may also want to include `wl-clipboard` for clipboard functionality, as well as a screenshot utility such as [Slurp](https://github.com/emersion/slurp) or <a href="Flameshot" class="wikilink" title="Flameshot">Flameshot</a> for screenshot region selection.

Additionally, for a more customizable bar implementation than `sway-bar`, <a href="Waybar" class="wikilink" title="Waybar">Waybar</a> may be enabled with `programs.waybar.enable`.

The default Sway configuration is symlinked to `/etc/sway/config` and `/etc/sway/config.d/nixos.conf`. The latter file contains dbus and systemd configuration that is critical to using apps that depend on XDG desktop portals with Sway, and should be included in any custom configuration files.

A few general comments:

- There is some friction between GTK theming and Sway. Currently the Sway developers suggest using gsettings to set gtk theme attributes as described here [1](https://github.com/swaywm/sway/wiki/GTK-3-settings-on-Wayland). There is currently a plan to allow GTK theme attributes to be set directly in the Sway config.
- Running Sway as a systemd user service is not recommended [2](https://github.com/swaywm/sway/wiki/Systemd-integration#running-sway-itself-as-a---user-service) [3](https://github.com/swaywm/sway/issues/5160)

### Using Home Manager

To set up Sway using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, you must first enable <a href="Polkit" class="wikilink" title="Polkit">Polkit</a> in your NixOS configuration.

Then you may enable Sway in your Home Manager configuration. Here is a minimal example:

See [Home Manager's Options for Sway](https://nix-community.github.io/home-manager/options.xhtml#opt-wayland.windowManager.sway.enable) for a complete list of configuration options.

You may need to activate dbus manually from .zshrc to use i.e: dunst, see [Dunst crashes if run as service](https://discourse.nixos.org/t/dunst-crashes-if-run-as-service/27671/2)

### Systemd services

Kanshi is an output configuration daemon. As explained above, we don't run Sway itself as a systemd service. There are auxiliary daemons that we do want to run as systemd services, for example Kanshi [4](https://gitlab.freedesktop.org/emersion/kanshi), which implements monitor hot swapping. It would be enabled as follows:

When you launch Sway, the systemd service is started.

### Using a greeter

Installing a greeter based on <a href="greetd" class="wikilink" title="greetd">greetd</a> is the most straightforward way to launch Sway.

#### TUIGreet

Tuigreet is a simple and lightweight option that does not require a separate compositor to launch.

#### Regreet

[Regreet](https://github.com/rharish101/ReGreet) is a clean and customizable GTK-based greeter written in Rust. It will automatically find Sway and remembers the last picked option. Additional configuration options may be found under [programs.regreet](https://search.nixos.org/options?&query=regreet).

### Automatic startup on boot

The snippet below will start Sway immediately on startup, without a greeter and **without a login prompt**. Only consider using this in conjunction with <a href="Full_Disk_Encryption" class="wikilink" title="Full Disk Encryption">Full Disk Encryption</a>.

``` nix
services.getty = {
  autologinUser = "your_username";
  autologinOnce = true;
};
environment.loginShellInit = ''
    [[ "$(tty)" == /dev/tty1 ]] && sway
'';
```

When launched directly from the TTY, Sway will not inherit the user environment. This may cause issues with systemd user services such as application launchers or <a href="Swayidle" class="wikilink" title="Swayidle">Swayidle</a>. To fix this, add the following to your Home Manager configuration:

### Secret Service

It is recommended to enable a secret service provider such as [Gnome Keyring](https://wiki.gnome.org/Projects/GnomeKeyring). For more information on secret services check the <a href="Secret_Service" class="wikilink" title="Secret Service">Secret Service</a> page.

Install and enable: In order to unlock the keyring through logins from greeters and screen locking utilities you will need to enable them through PAM.

## Configuration

Sway may be configured for specific users using Home Manager or manually through configuration files. The default location is `/etc/sway/config`, and custom user configuration in `~/.config/sway/config`.

### Keyboard layout

Changing layout for all keyboards to German (de):

``` console
input * xkb_layout "de"
```

The same thing accomplished in Home Manager:

``` nix
wayland.windowManager.sway.input."*".xkb_layout = "de";
```

### High-DPI scaling

Changing scale for all screens to factor 1.5:

``` console
output * scale 1.5
```

### Brightness and volume

You may set the brightness and volume function keys by binding the key codes to their corresponding commands within your sway config. The following configurations accomplish this using `light` and `pulseaudio`:

Or alternatively in Home Manager: For an on screen display for audio and brightness, check <a href="swayosd" class="wikilink" title="swayosd">swayosd</a>.

### Input

#### Touchpad

See the [sway-input man page](https://www.mankier.com/5/sway-input) for options.

## Troubleshooting

### Cursor is missing icons or too tiny on HiDPI displays

#### With programs.sway

\<syntaxhighlight lang="nix\> {

` programs.sway.extraPackages = with pkgs; [`  
`   adwaita-icon-theme # mouse cursor and icons`  
`   gnome-themes-extra # dark adwaita theme`  
`   ...`  
` ];`

}

</syntaxhighlight>

In ~/.config/sway/config

    seat "*" xcursor_theme Adwaita 32

#### With Home Manager

Using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> you may configure the mouse cursor size and theme. The reason that your cursor might be missing in some applications, is because `XCURSOR_THEME` is missing, which will cause applications relying on `XWAYLAND` to misbehave. Setting `sway.enable = true`, combined with the `name`, `package` and size will set the correct environment variables, which sway will then use.

### Missing fonts in Xorg applications

If fonts for certain languages are missing in Xorg applications (e.g. Japanese fonts don't appear in Discord) even though they're in the system, you can set them as default fonts in your configuration file.

\<syntaxhighlight lang="nix\>

` fonts = {`  
`   packages = with pkgs; [`  
`     noto-fonts`  
`     noto-fonts-cjk`  
`     noto-fonts-emoji`  
`     font-awesome`  
`     source-han-sans`  
`     source-han-sans-japanese`  
`     source-han-serif-japanese`  
`   ];`  
`   fontconfig.defaultFonts = {`  
`     serif = [ "Noto Serif" "Source Han Serif" ];`  
`     sansSerif = [ "Noto Sans" "Source Han Sans" ];`  
`   };`  
` };`

</syntaxhighlight>

### Swaylock cannot be unlocked with the correct password

Add the following to your NixOS configuration.

\<syntaxhighlight lang="nix\>

` security.pam.services.swaylock = {};`

</syntaxhighlight>

The `programs.sway.enable` option does this automatically.

### Inferior performance compared to other distributions

Enabling realtime may improve latency and reduce stuttering, specially in high load scenarios.

``` nix
security.pam.loginLimits = [
  { domain = "@users"; item = "rtprio"; type = "-"; value = 1; }
];
```

Enabling this option allows any program run by the "users" group to request real-time priority.

### WLR Error when trying to launch Sway

When this happens on a new NixOS system, enabling OpenGL in configuration.nix may fix this issue.

``` nix
hardware.graphics.enable = true;
```

### Systemd user services missing environment variables (PATH, etc)

When sway is launched with out display manager systemd won't inherit the users environment variables. To fix this add the following to your home-manager configuration:

### Touchscreen input bound to the wrong monitor in multi-monitor setups

See this [GitHub issue for Sway](https://github.com/swaywm/sway/issues/6590#issue-1021207180) and the solution give in [this response](https://github.com/swaywm/sway/issues/6590#issuecomment-938724355).

Using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> add the following to your Sway configuration:

``` nix
   wayland.windowManager.sway = {
     [...]
     config = {
       [...]
       input = {
         [...]
         "type:touch" = {
           # Replace touchscreen_output_identifier with the identifier of your touchscreen.
           map_to_output = touchscreen_output_identifier;
         };
       };
     };
   };
```

### GTK apps take an exceptionally long time to start

This occurs because GTK apps make blocking calls to freedesktop portals to be displayed. If Sway is not integrated with dbus and systemd, it will not be able to communicate via the `org.freedesktop.portal.Desktop` portal. To fix this, see the <a href="Sway#Using_NixOS" class="wikilink" title="description">description</a> of default Sway configurations earlier. Adding the following to your sway configuration, if it is not already present, may resolve the issue:

`include /etc/sway/config.d/*`

### dbus-issues: no icons in tray, can't open files from Nautilus with the right program

If you're using Gnome-Apps like Nautilus on NixOS with Sway, you might run into issue with settings standard applications to open files from Nautilus (e.g. there being no way of linking PDF to your preferred PDF-reader). You might also experience tray icons not showing up in your bar.

This is fixed by running `dbus-update-activation-environment --all` after starting your session. Make it permanent by adding `exec dbus-update-activation-environment --all` to your sway config file.

## Tips and tricks

### Toggle monitor modes script

Following script toggles screen / monitor modes if executed. It can also be mapped to a specific key in Sway.

First add the Flake input required for the script

``` nix
{
  inputs = {
    [...]
    wl-togglescreens.url = "git+https://git.project-insanity.org/onny/wl-togglescreens.git?ref=main";
  };

  outputs = {self, nixpkgs, ...}@inputs: {
    nixosConfigurations.myhost = inputs.nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs.inputs = inputs;
      [...]
```

Map the script binary to a specific key

``` nix
{ config, pkgs, lib, inputs, ... }:{
  home-manager.users.onny = {
    programs = {
      [...]
      wayland.windowManager.sway = {
        enable = true;
        config = {
          [...]
          keybindings = lib.mkOptionDefault{
            [...]
            "XF86Display" = "exec ${inputs.wl-togglescreens.packages.x86_64-linux.wl-togglescreens}/bin/wl-togglescreens";
          };
        };
      };
    };
```

### Screenshots

Screenshots using grim, slurp, and [grimshot](https://github.com/XodTech/grimshot) for selection screenshots/full screen screenshots.

Install tools Example Home Manager configuration. tee ~/Screenshots/\$(date +%Y-%m-%d\_%H-%M-%S).png {{!}} wl-copy";

`     # Print Screen Button`  
`     # Screenshot the currently focused screen, save to ~/Screenshots and copy to clipboard.`  
`     "Print" = "exec grimshot save output - {{!}} tee ~/Screenshots/$(date +%Y-%m-%d_%H-%M-%S).png {{!}} wl-copy";`

`   };`  
` };`

};\|name=/etc/nixos/home.nix\|lang=nix}}

### Screen sharing

### Auto mounting

#### USB storage devices (e.g. Flash Drives)

You can use [udiskie](https://github.com/coldfix/udiskie) to automatically mount external storage medias.

You will need to install and enable [udisks2](https://www.freedesktop.org/wiki/Software/udisks/). Then, in Home Manager you can enable udiskie. Udiskie will automatically mount attached USB storage media.

See related info on <a href="USB_storage_devices" class="wikilink" title="USB storage devices">USB storage devices</a>.

#### MTP (Android Phone Storage)

File managers that support [GVfs](https://wiki.gnome.org/Projects/gvfs), such as <a href="Thunar" class="wikilink" title="Thunar">Thunar</a>, can mount MTP devices using GVfs. See the page on <a href="MTP" class="wikilink" title="MTP">MTP</a> for related information.

### SwayFX

[SwayFX](https://github.com/WillPower3309/swayfx) is a fork of Sway that adds eye-candy effects, installing it is as simple as replacing your Sway package with SwayFX. Check the <a href="SwayFX" class="wikilink" title="SwayFX">SwayFX</a> page on the wiki for additional details.

### Screen dimming with wl-gammarelay-rs

Add `wl-gammarelay-rs` to programs.sway.extraPackages, then add the following to sway config:

    # start daemon
    exec wl-gammarelay-rs

    # bind shortcut to reset brightness
    bindsym $mod+Control+0 exec busctl --user set-property rs.wl-gammarelay / rs.wl.gammarelay Brightness d 1

    # bind shortcut to dim screen for a particular output
    bindsym $mod+Control+Underscore exec busctl --user set-property rs.wl-gammarelay /outputs/DP_1 rs.wl.gammarelay Brightness d 0.5

### Inhibit swayidle/suspend when fullscreen

Add to sway config:

    # When you use `for_window` the command you give is not executed
    # immediately. It is stored in a list and the command is executed
    # every time a window opens or changes (eg. title) in a way that
    # matches the criteria.

    # inhibit idle for fullscreen apps
    for_window [app_id="^.*"] inhibit_idle fullscreen

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
