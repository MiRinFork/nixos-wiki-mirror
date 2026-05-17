<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Using X without a Display Manager -->

## Setting up Xorg without system wide modifications

To run X11 as a regular user, *without* `services.xserver.enable = true;` in configuration.nix, do the following:

First, **install packages**:

- X11 itself:
  - `xorg.xorgserver`
- X11 input modules
  - `xorg.xf86inputevdev`
  - `xorg.xf86inputsynaptics`
  - `xorg.xf86inputlibinput`
- X11 video modules
  - `xorg.xf86videointel`
  - `xorg.xf86videoati`
  - `xorg.xf86videonouveau`

You probably want to use **DRI acceleration** for X; enable it and OpenGL in configuration.nix: `hardware.opengl.enable = true;` and `hardware.opengl.driSupport = true;`.

Then, it's just necessary to **gather X configuration files** into one directory and create a config file that also points X at the correct module paths, by running the following script (which should be re-run each time you run `nixos-rebuild switch`), but you will need to add or remove to the `pkgs` and `fontpkgs` arrays according to your preferences:

``` sh
generateXorgConf.sh
------------------------------------------------
#!/bin/sh
#generate unprivileged user xorg.conf for nixOS
#before running:
#    install any desired packages by placing them in `/etc/nixos/configuration.nix`
#    update by running `nix-channel --update` and `nixos-rebuild switch`

config_dir=${XDG_CONFIG_HOME:-~/.config}/xorg.conf.d

mkdir -p "$config_dir"
cd "$config_dir"

#failed glob expansions become empty, not literal 'foo/*'
shopt -s nullglob

get_pkg_path() {
    attr=$1
    nix show-derivation -f '<nixpkgs>' "$attr" | jq -r '.[].env.out' 
}

#add to this set according to your driver needs
pkgs="
    xorg.xf86inputevdev
    xorg.xf86videointel
    xorg.xf86inputsynaptics
    xorg.xorgserver
"

#make the intel backlight helper setuid if it isn't already
xf86videointel_path=$(get_pkg_path xorg.xf86videointel)
backlight_helper_path="${xf86_video_intel_path}/libexec/xf86-video-intel-backlight-helper"
if [ -e "$backlight_helper_path" -a ! -u "$backlight_helper_path" ]; then
    sudo chmod +s ${xf86_video_intel_path}/libexec/xf86-video-intel-backlight-helper
fi

echo 'Section "Files"' > 00-nix-module-paths.conf
for pkg in $pkgs; do
    pkg_path=$(get_pkg_path $pkg)
    for conf in "$pkg_path"/share/X11/xorg.conf.d/*; do 
        ln -sf "$conf" ./
    done
    echo '  ModulePath "'"$pkg_path"'/lib/xorg/modules/"' >> 00-nix-module-paths.conf
done

#add to this set according to your font preferences
fontpkgs="
    xorg.fontmiscmisc
    ucsFonts
"

for pkg in $fontpkgs; do
    pkg_path=$(get_pkg_path $pkg)
    path="$pkg_path"'/share/fonts/'
    [ -d "$path" ] && echo '    FontPath "'"$path"'"' >> 00-nix-module-paths.conf
    path="$pkg_path"'/lib/X11/fonts/misc/'
    [ -d "$path" ] && echo '    FontPath "'"$path"'"' >> 00-nix-module-paths.conf
done

echo 'EndSection' >> 00-nix-module-paths.conf
```

You can now **start X11** by running:

``` sh
startx -- :0 -configdir ~/.config/xorg.conf.d
```

## Setting up Xorg system-wide but without a Display Manager

If you don't mind having `services.xserver.enable = true;` but you don't want a display manager, and you want only a TTY login prompt, use the following in your `configuration.nix`:

``` nix
services.xserver.displayManager.startx.enable = true;
```

`startx` is treated as a displayManager and therefore it is used instead of the default (`lightdm`).

## Setting up the user's D-Bus Daemon

Both of the methods above, don't start the user's dbus-daemon properly on startup. Unfortunately, it is unclear exactly why this is missing, but here's a fix for startx users:

Put the following in your `~/.xinitrc`:

``` sh
if test -z "$DBUS_SESSION_BUS_ADDRESS"; then
    eval $(dbus-launch --exit-with-session --sh-syntax)
fi
systemctl --user import-environment DISPLAY XAUTHORITY

if command -v dbus-update-activation-environment >/dev/null 2>&1; then
        dbus-update-activation-environment DISPLAY XAUTHORITY
fi
```

<a href="Category:_Display_Manager" class="wikilink" title="Category: Display Manager">Category: Display Manager</a>
