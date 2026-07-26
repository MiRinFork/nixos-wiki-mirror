<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Xfce -->

[Xfce](http://www.xfce.org) is a lightweight desktop environment based on GTK+. It includes a window manager, a file manager, desktop and panel.

This article is an extension of the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#sec-xfce).

## Enabling

To use xfce set `services.xserver.desktopManager.xfce.enable` to `true`. For example:

### Excluding xfce applications

Xfce does not include as many applications by default as some other desktop environments. Still, those can be excluded as demonstrated in the example below. Place this before the `services.xserver` snippet from above.

### Using as a desktop manager and not a window manager

You can use xfce purely as a desktop manager, leaving window management to another window manager like <a href="i3" class="wikilink" title="i3">i3</a> for example. In this scenario, xfce's role is to answer to media keys, prompt when plugging a new monitor and so on.

Example config:

On first login, make sure to choose the session `xfce+i3` in your display manager. If you choose `xfce` you will end up in xfce without panels nor window manager, which is unusable.

Note that xfce manages your session instead of i3: exiting i3 will blank your screen but not terminate your session. In your i3 config, replace `i3-msg exit` with `xfce4-session-logout`.

#### With xmonad as the window manager

One of the possibilities is to use `xmonad` as a window manager in a `Xfce` desktop environment.

##### Without xfce desktop

The previously described configuration is extended with the part that configures xmonad:

Xmonad's contrib package comes with a config to integrate seamlessly into Xfce, like connecting workspaces to xfce's top panel's preview of workspaces. To enable this config, put the following into the user's xmonad config file: Since Xfce uses Alt for a lot of keybindings, using the Win key for xmonad hotkeys may be preferred.

After choosing the `xfce+xmonad` session in your display manager, you will be taken to a clean screen, where you can open a terminal with `MOD+Shift+Enter` or launch an application with `MOD(+SHIFT)+p`.

##### With xfce desktop

If you instead prefer to have panels (like the top panel) in addition to the main clean display area managed by xmonad, you can remove the `xfce.noDesktop = true;` option from the configuration. After switching to your new configuration, reboot and clean your sessions with `rm -rf ~/.cache/sessions/*` before logging in to a graphical session.

After logging in you will be greeted by xfce's desktop which interferes with xmonad. To solve this issue you have to remove the `xfdesktop` process from being started in the session. Open the session manager in the application launcher with `MOD(+SHIFT)+p` and then typing in "Session and Startup". Go to tab "Session" and set the restart style of `xfdesktop` to "Never". Kill the process with "Quit program", then "Save session." After this, xfce4 and xmonad will work together nicely.

##### Java-based GUI applications

Java-based applications may not work properly with xmonad. The applications main window may stay blank or gray on startup. This is a known issue with some versions of Java, where xmonad is not recognized as a "non-reparenting" window manager. There are multiple solutions to this problem as described on xmonad's FAQ page.

One alternative is to fake xmonad's window manager name, after running the EMWH initialization. This particular approach works well when running xmonad alongside the xfce-based desktop (described above).

##### Additional resources

Note that, unlike suggested in additional resources, the xmonad packages should not be installed in the environment (neither as systemPackages nor user packages), since that leads to errors when (re)compiling xmonad's config file.

Additional resources:

[Haskell Wiki: Installing xmonad on NixOS](https://wiki.haskell.org/Xmonad/Installing_xmonad#NixOS)

[Haskell Wiki: Using xmonad in Xfce](https://wiki.haskell.org/Xmonad/Using_xmonad_in_XFCE)

[Haskell Wiki: Xmonad default key bindings](https://wiki.haskell.org/File:Xmbindings.png)

[Haskell Wiki FAQ: Problems with Java applications](https://wiki.haskell.org/Xmonad/Frequently_asked_questions#Problems_with_Java_applications.2C_Applet_java_console)

## Customizing xfce declaratively

Xfce adheres to [XDG](https://en.wikipedia.org/wiki/Freedesktop.org) desktop configuration, making it easy to declare user home directory configurations via <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. xfce-specific configurations are stored in an [xfconf database](https://docs.xfce.org/xfce/xfconf/start).

### Defining xfconf value

Below assumes you have already enabled Home Manager in your NixOS configuration.

Launching `xfce4-settings-editor` you can view xfce personalizations already applied to the system. They're displayed in a tree view, but stored in a flat string format. You can query these same values from the command line with `xfconf-query` to quickly get the full key and value in a friendlier format. For instance:

``` console
$ xfconf-query -c ristretto -lv
/window/navigationbar/position  left
/window/statusbar/show          true
/window/toolbar/show            false
```

Can be translated like so:

### Using built-in wallpapers

Similarly, if you wish to use a built-in wallpaper declaratively you could follow this same pattern:

However, the xfce settings seem to persist across system rebuilds which can lead to the wallpaper being set to a nix store that is cleaned up when older system generations are cleaned up. In other words, the wallpaper may be replaced by a blank screen upon reboot seemingly randomly. One workaround for this is to set a static directory path for the images via a symlink and using that within xfconf.

## Troubleshooting

### Pulseaudio

If you use pulse audio, set `nixpkgs.config.pulseaudio = true` as shown above. Otherwise, you may experience glitches like being able to mute the sound card but not unmute it.

<a href="Category:Desktop_environment" class="wikilink" title="Category:Desktop environment">Category:Desktop environment</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
