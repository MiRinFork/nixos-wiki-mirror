<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mouse acceleration -->

Mouse acceleration is an algorithm that increases the distance the cursor travels depending on the speed that the cursor moves, as opposed to a linear movement that always moves the cursor the same amount regardless of speed.

Some desktop environments such as <a href="KDE_Plasma" class="wikilink" title="KDE Plasma">KDE Plasma</a> have the option to enable/disable mouse acceleration in settings. In Xorg it is enabled by default, to configure this behavior see <a href="Xorg#Disabling_touchpad_and_mouse_accelerations" class="wikilink" title="Disabling touchpad and mouse accelerations">Disabling touchpad and mouse accelerations</a> on the <a href="Xorg" class="wikilink" title="Xorg">Xorg</a> page.

If you would like to configure mouse acceleration curves on NixOS, an option you may use is [maccel](https://www.maccel.org/).

## Maccel

The program maccel is available as a <a href="flake" class="wikilink" title="flake">flake</a>. It may be configured declaratively through nix. Find more info on the [maccel GitHub](https://github.com/Gnarus-G/maccel) and the [flake section of the GitHub](https://github.com/Gnarus-G/maccel/blob/main/README_NIXOS.md).

Flake example: Configuration example: Afterwards you may need to reboot before maccel can take effect.

The CLI may be accessed using:

``` bash
$ maccel tui
```
