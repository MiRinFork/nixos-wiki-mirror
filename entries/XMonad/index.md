<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: XMonad -->

[xmonad](https://xmonad.org/) is a tiling [window manager](https://wiki.archlinux.org/title/Window_manager) for <a href="Xorg" class="wikilink" title="X">X</a>. Windows are arranged automatically to tile the screen without gaps or overlap, maximizing screen use. Window manager features are accessible from the keyboard: a mouse is optional.

xmonad is written, configured and extensible in <a href="Haskell" class="wikilink" title="Haskell">Haskell</a>. Custom layout algorithms, key bindings and other extensions may be written by the user in configuration files.

Layouts are applied dynamically, and different layouts may be used on each workspace. <a href="Wikipedia:Xinerama" class="wikilink" title="Xinerama">Xinerama</a> is fully supported, allowing windows to be tiled on several physical screens.

## Installation

The simplest way to install Xmonad is to activate the corresponding NixOS module. You can do this by adding the following to your NixOS configuration. You probably also want to activate the `enableContribAndExtras` option.

The second options automatically adds the `xmonad-contrib` and `xmonad-extras` packages. They are required to use the [Xmonad Contrib](https://hackage.haskell.org/package/xmonad-contrib) extensions.

### Adding Haskell Modules

To add additional Haskell modules beyond xmonad-contrib and xmonad-extras, use the `extraPackages` option

To add Haskell modules that are not in the Haskell Nix package set, you have to tell ghc where to find them. For example, you can use the following to add the [xmonad-contexts](https://github.com/Procrat/xmonad-contexts) module.

or if you are using Flakes

Don't forget to add the module to your flake inputs:

## Configuration

`$HOME/.xmonad` is the default path used for the configuration file. If your configuration is in a different location, give Nix your Xmonad config file like this:

See [services.xserver.windowManager.xmonad](https://search.nixos.org/options?query=services.xserver.windowManager.xmonad) for a full list of available options and their descriptions.

More information on how to configure Xmonad can be found in the [Arch Wiki](https://wiki.archlinux.org/title/Xmonad), and a list of starter configs can be found in the [Xmonad Config Archive](https://wiki.haskell.org/Xmonad/Config_archive).

## Power management

Xmonad is a Window Manager (WM) and not a Desktop Environment (DE). Therefore, among other things, Xmonad does not handle <a href="Power_Management" class="wikilink" title="power management">power management</a> related things such as sleeping. However, there are several ways of still adding this functionality.

### Suspend system after inactivity

The approach goes through the following steps:

- Let the <a href="Xorg" class="wikilink" title="XServer">XServer</a> detect idle-situation
- Inform "<a href="Systemd/logind" class="wikilink" title="logind">logind</a>" (i.e. "systemd") about the situation
- Let "logind" make the system sleep

We'll configure the XServers screensaver-settings to pick up inactivity:

You'll have to re-login for the settings above to be applied.

The settings above will toggle the flag "IdleHint" within logind through [light-locker](https://github.com/the-cavalry/light-locker#light-locker) (will work with "'lightdm'", there are alternatives). Next we'll have to pick-up the information within logindand select an [action to take](https://www.freedesktop.org/software/systemd/man/logind.conf.d.html#IdleAction=):

The configuration above will let the system go to "hybrid-sleep" \`20s\` after the screen-saver triggered.

#### Troubleshooting

Check if the values of "IdleSinceHint" and "IdleSinceHintMonotonic" update using the command:

``` console
$ watch "loginctl show-session | grep Idle"
```

Try setting the flag manually (also need to disable manually):

``` console
$ dbus-send --system --print-reply \
    --dest=org.freedesktop.login1 /org/freedesktop/login1/session/self \
    "org.freedesktop.login1.Session.SetIdleHint" boolean:true
```

Check if the xset-settings have been applied properly and activate the screensaver manually:

``` console
$ xset q
$ sleep 1s && xset s activate
```

## Developer Environment for XMonad

When developing modules for XMonad, it can help to install the following packages

``` nix
windowManager = {
  xmonad = {
    enable = true;
    enableContribAndExtras = true;
    extraPackages = haskellPackages: [
      haskellPackages.dbus
      haskellPackages.List
      haskellPackages.monad-logger
    ];
  };
};
```

More information can be found [here](https://discourse.nixos.org/t/haskell-language-server-support-for-xmonad/12348) and [here](https://www.srid.ca/xmonad-conf-ide).

#### Create a project around `xmonad.hs`

``` bash
echo "xmonad" >> $HIE_BIOS_OUTPUT 
```

The "with-ghc" should be ghc that's in the "ghc-with-packages" dependency of the "xmonad-with-packages". It can be easily found with "[nix-tree](https://github.com/utdemir/nix-tree)", which shows dependencies between packages on the machine.

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
