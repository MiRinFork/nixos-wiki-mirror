<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Waydroid -->

[Waydroid](https://waydro.id) is an application which uses LXC containers to run Android applications on a non-Android system.

## Installation

Enable Waydroid in your system configuration:

After rebuilding and switching, finish the Waydroid install in your shell.

``` console
Fetch Waydroid images.
You can add the parameters "-s GAPPS -f" to have GApps support.
$ sudo waydroid init
```

How to certify a waydroid device for GAPPS[1](https://github.com/waydroid/waydroid/issues/379#issuecomment-1152526650)

Before the following steps, you might need to do some GPU adjustments. See the troubleshooting section.

## Usage

Start the container and userspace Wayland session. You'll know it is finished when you see the message "Android with user 0 is ready".

``` console
$ sudo systemctl start waydroid-container
$ waydroid session start
```

General usage

``` console
Start Android UI
$ waydroid show-full-ui

List Android apps
$ waydroid app list

Start an Android app
$ waydroid app launch <application name>

Install an Android app
$ waydroid app install </path/to/app.apk>

Enter the LXC shell
$ sudo waydroid shell

Overrides the full-ui width
$ waydroid prop set persist.waydroid.width 608
```

## Maintenance

### Update Android

Use following command to upgrade Android (LineageOS) to a newer version if available

``` console
$ sudo waydroid upgrade
```

### Resetting Android Container

``` console
Stop Waydroid container
$ sudo systemctl stop waydroid-container

Removing images and user data
$ sudo rm -r /var/lib/waydroid/* ~/.local/share/waydroid
```

## Tips and tricks

### Mount host directories

Install and configure graphical application `waydroid-helper`

``` nix
environment.systemPackages =  [ pkgs.waydroid-helper ];

systemd = {
  packages = [ pkgs.waydroid-helper ];
  services.waydroid-mount.wantedBy = [ "multi-user.target" ];
};
```

Enable the user service which is also required. Note that this is not persistent and needs to get started after reboot again.

``` bash
systemctl --user start waydroid-monitor
```

Now start `waydroid-helper` application and add a shared directory. As an example, source directory could be `/home/myuser/Public` and target directory `/home/myuser/.local/share/waydroid/data/media/0/NixOS`. Ensure that both directories already exist locally. After that you might need to restart the *Waydroid* container which is also possible with the graphical user interface.

### GPS/Location forwarding

First enable *geoclue2* and *adb* daemon on the host

``` nix
services.geoclue2.enable = true;
programs.adb.enable = true;
```

Enable location provider in your desktop environment. For Gnome Shell you can do this

``` bash
gsettings set org.gnome.system.location enabled true
```

To test and see location

``` bash
nix shell nixpkgs#geoclue2 -c $(nix eval --raw nixpkgs#geoclue2)/libexec/geoclue-2.0/demos/where-am-i
```

Get IP address of the Waydroid guest and connect *adb* to it

``` bash
waydroid shell ip addr show
adb connect <IP>:5555
```

Download, initialize and run geobridge script

``` bash
wget https://gitlab.com/papiris/geobridge/-/raw/main/geobridge.sh
sh geobridge.sh --init
```

### V4L2 camera forwarding

Camera forwarding using V4L2 is broken on upstream, but can be achieved by using the Waydroid images of the [Waydroid-ATV project](https://github.com/WayDroid-ATV). Further we also need an unstable Waydroid version (\>1.6.2) for running it.

``` nix
disabledModules = [
  "virtualisation/waydroid.nix"
];
imports = [
 "${inputs.nixpkgs-unstable}/nixos/modules/virtualisation/waydroid.nix"
];

nixpkgs.overlays = [
  (self: super: {
    waydroid = (inputs.nixpkgs-unstable.legacyPackages.x86_64-linux.waydroid.overrideAttrs (old: rec {
      version = "0-unstable-2026-04-26";
      src = pkgs.fetchFromGitHub {
        owner = "waydroid";
        repo = "waydroid";
        rev = "9478d59ad5c83b22478594e73d5879b93200fcb2";
        hash = "sha256-L4qU5TSWavxvyPUqVV00NCd0YZqAaKPWTe3dR/q15LE=";
      };
    }));
  })
];
```

You might <a href="Waydroid#Resetting_Android_Container" class="wikilink" title="need to reset">need to reset</a> your existing Waydroid environment. Then stop the container and fetch the latest Waydroid-ATV images.

``` bash
systemctl stop waydroid-container
waydroid init -f \
  -c https://waydroid-atv.github.io/ota/a16-qpr2/system \
  -v https://waydroid-atv.github.io/ota/a16-qpr2/vendor \
  -r lineage \
  -s GAPPS
systemctl start waydroid-container
waydroid session start
```

In case the graphical interface wont show up or the setup wizard fails you can do

``` bash
waydroid shell -- am start -a android.intent.action.MAIN -c android.intent.category.HOME  
waydroid shell -- pm disable-user --user 0 com.google.android.setupwizard
waydroid shell -- pm disable-user --user 0 com.google.android.gms.setup
```

In case the camera access will crash the Waydroid container, there's a recent image which solves this on AMD GPUs. Download it and extract the contents to `/etc/waydroid-extra/images`. After that recreate the environment as mentioned above but only issue `waydroid init -f`.

### Running applications that differ from the current host architecture via libhoudini or libndk[^1]

Run `nix shell github:nix-community/NUR#repos.ataraxiasjel.waydroid-script -c sudo waydroid-script`

Or, alternatively, add `nur.repos.ataraxiasjel.waydroid-script` from the NUR to your flake or shell or NixOS `environment.systemPackages`, or HM `home.packages` or something like that based on [readme](https://github.com/nix-community/NUR) and run `sudo waydroid-script`

In the TUI, select Android 13 \> Install \> libhoudini (or libndk, [which script author claims may be faster on AMD](https://github.com/casualsnek/waydroid_script/blob/fcb15624db0811615ea9800837a836c4777674bf/README.md#install-libndk-arm-translation))

## Troubleshooting

### GPU Adjustments

In case you have an NVIDIA card or an RX 6800 series, you'll need to disable GBM and mesa-drivers:

## See Also:

- [Waydroid article on the Archlinux Wiki](https://wiki.archlinux.org/title/Waydroid)

[^1]: Need help with activating libhoudini for waydroid on NixOS

    <https://www.reddit.com/r/NixOS/comments/15k2jxc/need_help_with_activating_libhoudini_for_waydroid/>
