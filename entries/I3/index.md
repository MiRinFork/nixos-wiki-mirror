<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: I3 -->

[i3](https://i3wm.org/) is a tiling window manager for <a href="Xorg" class="wikilink" title="X Window System">X Window System</a>.

## Enabling

To use i3 set to `true`. For example:

By default, the path to the i3 configuration file is `$HOME/.i3/config`. For a full list of i3 options, refer to the module options.

### Using home-manager

See also: [srid/nix-config/nix/home/i3.nix](https://github.com/srid/nix-config/blob/705a70c094da53aa50cf560179b973529617eb31/nix/home/i3.nix)

### With a desktop manager

i3 is a window manager and does not provide "cosmetic" services like managing multiple monitor configuration or media keys. This is what is usually delegated to a desktop manager. To use xfce as a desktop manager on top of i3, see <a href="Xfce#Using_as_a_desktop_manager_and_not_a_window_manager" class="wikilink" title="Xfce#Using_as_a_desktop_manager_and_not_a_window_manager">Xfce#Using_as_a_desktop_manager_and_not_a_window_manager</a>.

## Common issues

### i3lock doesn't recognize my password

As of nixos 25.05, i3lock is no longer automatically configured to be able to use PAM to check passwords. If you installed i3 through nixos options, this is handled for you, but if you installed it elsewhere, such as through home-manager, then at minimum, you need to set:

## Tips & tricks

### i3blocks

After installing and enabling i3blocks, you may find that i3block does not work. This issue occurs because i3blocks reads its contents from a hardcoded path in `/etc` by default.

Since in nixos however, these contents are located within the Nix store at a path similar to:

Since i3blocks cannot locate this path, you have to create a link to this path by adding this line to configuration.nix file:

After rebuilding the system, you may configure your block like the following:

### DConf

If your settings aren't being saved for some applications (gtk3 applications, firefox), like the size of file selection windows, or the size of the save dialog, you will need to enable dconf:

### Lxappearance

To change the icon and themes you can install lxappearance:

### Solve inconsistency between gtk2 and gtk3 themes

If enabling **dconf** or installing **Lxappearance** but still see inconsistency between themes, you have to manually edit their configurations. In fact, It is possible to install some gtk3 themes but when you start another gtk2 application, your theme not effected properly. It's because there is no .gtkrc-2.0 in your home directory. First create it and paste these lines to it:

Change the options based on your installed themes and icon packs.

### Wallpaper

If `~/.background-image` exists then it will be displayed as a wallpaper. Options `services.xserver.desktopManager.wallpaper.combineScreens` and `.mode` control exactly how it is displayed.

### i3status with home-manager

Same as in i3status-rust. Notice: home-manager will not override your existing config, i.e. if the file/folder `~/.config/i3status/config` is present on your system, there won't be any changes after rebuilding.

External resources that can help you with your setup: [<https://home-manager-options.extranix.com/?query=xsession.windowManager.i3.config>](https://home-manager-options.extranix.com/?query=xsession.windowManager.i3.config)

#### To enable i3status in home-manager and change some basic options:

#### Adding various modules:

##### Disabling default i3status modules

After setting up i3status, you may notice it shows two eth- and wifi's. To disable `ethernet _first_` and `wireless _first_`, add the following:

### i3status-rust with home-manager

i3status-rust can be configured through home-manager, but that configuration does not autoamatically update i3 to invoke i3status-rust. Instead `xsession.windowManager.i3.config.bars` needs to be updated to reference i3status-rust and the config files that the home-manager config produces. Consider the following setup:

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
