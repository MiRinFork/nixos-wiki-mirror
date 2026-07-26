<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: KDE -->

[KDE Plasma](https://kde.org/plasma-desktop/) is a desktop environment that aims to be simple by default, powerful when needed.

## Installation

To use KDE Plasma, add this to your configuration.nix:

## Configuration

### Excluding applications from the default install

Some optional packages can be excluded if they are not needed at the cost of functionality.

Optional packages: [1](https://github.com/NixOS/nixpkgs/blob/7e495b747b51f95ae15e74377c5ce1fe69c1765f/nixos/modules/services/desktop-managers/plasma6.nix#L150-L170)

### Default Wayland/X11 session

Plasma 6 runs on Wayland by default. To launch an X11 session by default:

### Unlock KDE Wallet with LUKS password

When using LUKS disk encryption and autologin in your display manager, it is possible to unlock KDE Wallet with the LUKS password. Set the LUKS password, login password, and KWallet keyring password all to the same string, and for NixOS 25.11 and below use the following configuration:

``` nix
{
  boot.initrd.systemd.enable = true;
  systemd.services.display-manager.serviceConfig.KeyringMode = "inherit";
  security.pam.services.sddm-autologin.text = pkgs.lib.mkBefore ''
    auth optional ${pkgs.systemd}/lib/security/pam_systemd_loadkey.so
    auth include sddm
  '';
}
```

For Plasma Login Manager in NixOS 26.05 or above, use:

``` nix
{
  boot.initrd.systemd.enable = true;
  systemd.services.plasmalogin.serviceConfig.KeyringMode = "inherit";
  security.pam.services.plasmalogin-autologin.rules.auth = {
    systemd_loadkey = {
      order = 0;
      control = "optional";
      modulePath = "${pkgs.systemd}/lib/security/pam_systemd_loadkey.so";
    };
    plasmalogin = {
      order = 1;
      control = "include";
      modulePath = "plasmalogin";
    };
  };
}
```

## Troubleshooting

### Qt/KDE applications segfault on start

This is caused by a stale QML cache [(see this issue)](https://github.com/NixOS/nixpkgs/issues/177720). A dirty way to fix this is by running on a terminal the following command:

``` console
$ find ${XDG_CACHE_HOME:-$HOME/.cache}/**/qmlcache -type f -delete
```

### GTK themes are not applied in Wayland applications / Window Decorations missing / Cursor looks different

This affects GTK applications including Firefox and Thunderbird.

You may need to set a GTK theme *Breeze* imitating the KDE theme with the same name in *System Settings -\> Application Style --\>Configure GNOME/GTK Application Style*.

[(See this issue)](https://github.com/NixOS/nixpkgs/issues/180720)

### After Update to Plasma 6 Signal-Desktop complains about a Database Error involving kwallet5

1.  Close Signal
2.  Open ~/.config/Signal/config.json
3.  Replace `"safeStorageBackend": "kwallet5"` with `"safeStorageBackend": "kwallet6"` (change 5 to 6)
4.  Start Signal

### Bluetooth configuration not available

Add the following configuration (generally in hardware-configuration.nix):

``` nix
hardware.bluetooth.enable = true;
```

This will add the following packages:

``` nix
[
  bluedevil
  bluez-qt
  pkgs.openobex
  pkgs.obexftp
]
```

### Brightness and Color brightness control sets gamma instead of brightness on external monitors

To allow `powerdevil` (and by extension the "Brightness and Color" status tray menu) to control brightness on supported monitors directly instead of adjusting gamma, <a href="Backlight#Via_ddcutil" class="wikilink" title="configure your system to enable ddcutil">configure your system to enable ddcutil</a>, and allow your user to use DDC/CI without root. Note that you do not need to add `ddcutil` to your system packages because PowerDevil uses libddcutil.

### Plasma wallpaper reverts back to default after a Nix GC

When setting a wallpaper, Plasma may save the path as a `/nix/store/*/share/wallpapers` path instead of `/run/current-system/sw/share/wallpapers/`. To fix this, open `$XDG_CONFIG_HOME/plasma-org.kde.plasma.desktop-appletsrc` and manually change the paths.

### No available locale settings in the Plasma system settings

The "Region & Language" page in the Plasma system settings is somewhat broken on NixOS. Instead, edit the `$XDG_CONFIG_HOME/plasma-localerc` file.

If you really want to configure locale in settings, you can use this workaround:

``` nix
{ pkgs, ... }:
{
  i18n = {
    extraLocales = "all";
    imperativeLocale = true; # Unknown if needed (system settings sets user-level override?)
  };
  environment = {
    systemPackages = [ pkgs.stdenv.cc.libc.out ]; # this derivation contains the locales
    pathsToLink = [ "/share/i18n" ];
  };
}
```

Switch to that configuration, then run:

``` console
# mkdir -p /usr/share/i18n
# ln -s /run/current-system/sw/share/i18n/locales /usr/share/i18n/locales
```

That is a very dirty command, and I don't know if it persists across reboots.

## Tips and tricks

### Plasma-Manager

By default, the Plasma configuration can be handled like on [traditional systems](https://wiki.archlinux.org/title/KDE). With [plasma-manager](https://github.com/nix-community/plasma-manager), it is possible to make Plasma configurations via nix by providing [home-manager](https://github.com/nix-community/home-manager) modules.

### User icon (avatar)

You can add a profile picture to your user by using a png file in `~/.face.icon`.

## Hacking

There are many reasons to modify the KDE packages, such as testing patches from other KDE developers, applying a fix before it is officially released and finds its way into *nixpkgs* or developing contributions for the KDE project.

### Customizing *nixpkgs*

To override KDE packages, the common way using `overrideAttrs` won't work, since they are part of the `kdePackages`scope, which requires the usage of `overrideScope` first:

``` nix
nixpkgs-overlay = final: prev: {
  kdePackages = prev.kdePackages.overrideScope(kdeFinal: kdePrev: {
    somepackage = kdePrev.somepackage.overrideAttrs(prevPkgAttrs: {
      someattribute = …;
    };
  };
};
```

The following examples will demonstrate various ways how to achieve the customization of the KDE package `powerdevil` in different scenarios:

#### Using a single diff from a remote URL

A KDE developer might have provided a diff that one wants to utilize locally to test it or to make use of it until it's included in an upcoming release.

1.  Generate the SRI hash of the file: `nix store prefetch-file https://invent.kde.org/plasma/powerdevil/-/commit/f731c18e377b87c57f7205d9c1812a34f588c577.diff --json --name toggle-nightlight.diff`
2.  Override the `patches` attribute of the `powerdevil`package:

kdePackages = prev.kdePackages.overrideScope(kdeFinal: kdePrev: {

` powerdevil = kdePrev.powerdevil.overrideAttrs (prevPdAttrs: {`  
`   patches = prevPdAttrs.patches or [] ++ [`  
`     (prev.fetchpatch {`  
`       name = "toggle-nightlight.diff";`  
`       url = "`[`https://invent.kde.org/plasma/powerdevil/-/commit/f731c18e377b87c57f7205d9c1812a34f588c577.diff`](https://invent.kde.org/plasma/powerdevil/-/commit/f731c18e377b87c57f7205d9c1812a34f588c577.diff)`";`  
`       sha256 = "sha256-X0ZHSRnSLqmp2fcLGx9DUTn7F9BFh5puh9Q4YAj6/5o=";`  
`     })`  
`   ];`  
` });`

});

</syntaxhighlight>

#### Using commits of a repository

Either a local clone or remote repository might provide the code that should be used to build the package in question instead.

##### Remote repository

``` nix
kdePackages = prev.kdePackages.overrideScope(kdeFinal: kdePrev: {
  powerdevil = kdePrev.powerdevil.overrideAttrs (prevPdAttrs: {
    src = builtins.fetchGit {
      url = "https://invent.kde.org/plasma/powerdevil";
      rev = "f731c18e377b87c57f7205d9c1812a34f588c577";
    };
  });
});
```

##### Local repository

``` nix
kdePackages = prev.kdePackages.overrideScope(kdeFinal: kdePrev: {
  powerdevil = kdePrev.powerdevil.overrideAttrs (prevPdAttrs: {
    src = builtins.fetchGit {
      url = "file:///home/eliasp/code-repositories/public/KDE/plasma/powerdevil";
      rev = "f731c18e377b87c57f7205d9c1812a34f588c577";
    };
  });
});
```

#### Using the worktree of a local repository

Now one might not want to commit each and every change during development to iterate more quickly, but to just rebuild after having saved the latest changes.

By just redirecting `src`to the path of the working directory, where the required code resides, quick & dirty rebuilds are possible:

``` nix
kdePackages = prev.kdePackages.overrideScope(kdeFinal: kdePrev: {
  powerdevil = kdePrev.powerdevil.overrideAttrs (prevPdAttrs: {
    src = /home/eliasp/code-repositories/public/KDE/plasma/powerdevil;
  });
});
```

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:KDE" class="wikilink" title="Category:KDE">Category:KDE</a>
