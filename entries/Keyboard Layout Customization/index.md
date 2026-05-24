<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Keyboard Layout Customization -->

## 20.09 and later

In 20.09 there's [services.xserver.extraLayouts](https://nixos.org/manual/nixos/stable/#custom-xkb-layouts) for this.

## Using xkbcomp

### Simple

The easiest way to customize your keyboard layout on NixOS is with these options:

- `services.xserver.xkb.layout`: Keyboard layout, or multiple keyboard layouts separated by commas.
- `services.xserver.xkb.variant`: X keyboard variant or multiple variants separated by commas (a variant can be empty).
- `services.xserver.xkb.model`: Keyboard model.
- `services.xserver.xkb.options`: X keyboard options; layout switching goes here.

=====<Example:=====>

For desktop:

``` nix
services.xserver.xkb = {
  layout = "us,ru";
  # Note that the trailing comma is required: https://github.com/NixOS/nixpkgs/issues/359830
  variant = "workman,";
  options = "grp:win_space_toggle";
};
```

For console:

``` nix
console.keyMap = "us";
```

You can find valid values for these options in `$(nix-build --no-out-link '<nixpkgs>' -A xkeyboard_config)/etc/X11/xkb/rules/base.lst`

### Advanced

If the above options aren't enough, you can instead create your own keyboard layout by going through xkb. To get started, install `xorg.xkbcomp` and run `setxkbmap -print > layout.xkb` to get an initial file. This corresponds to your current layout. Use `xkbcomp layout.xkb $DISPLAY` to load the file as your new layout. Refer to <https://wiki.archlinux.org/index.php/X_KeyBoard_extension> on how to edit this file.

Lots of examples can be found in `$(nix-build --no-out-link '<nixpkgs>' -A xorg.xkeyboardconfig)/etc/X11/xkb/`. For available key symbols, see `$(nix-build --no-out-link '<nixpkgs>' -A xorg.xproto)/include/X11/keysymdef.h`.

To load this file at the start of the X session, add the following to your `configuration.nix`. The extra compilation step (`xkbcomp`) helps catching layout errors at build time.

``` nix
let
  compiledLayout = pkgs.runCommand "keyboard-layout" {} ''
    ${pkgs.xorg.xkbcomp}/bin/xkbcomp ${./path/to/layout.xkb} $out
  '';
in
  services.xserver.displayManager.sessionCommands = "${pkgs.xorg.xkbcomp}/bin/xkbcomp ${compiledLayout} $DISPLAY";
```

If you are using home-manager, you also need to prevent home-manager from managing the keyboard by having `home.keyboard = null;` in your home-manager configuration.

### Relevant other options

- `services.xserver.exportConfiguration`: Makes it so the above mentioned xkb directory (and the `xorg.conf` file) gets exported to `/etc/X11/xkb`, which is useful if you have to often look stuff up in it.
- `services.xserver.xkb.dir`: Allows you to set a different xkb directory altogether. All the above mentioned things will use this instead of the default one in regards to xkb stuff.
- `console.useXkbConfig`: Makes it so the tty console has about the same layout as the one configured in the `services.xserver` options.

### Configs

- <https://github.com/infinisil/system/blob/94852ed690fccfdda27c2e3985be84c51f1eac8e/new-modules/keylayout.nix>

### Advanced configuration with xmodmap

Some users have found xmodmap to be a helpful tool although reports of successful implementation are varied.

``` nix

cat /etc/nixos/configuration.nix

services.xserver.displayManager.sessionCommands =
  ${pkgs.xorg.xmodmap}/bin/xmodmap "${pkgs.writeText  "xkb-layout" ''
    ! Map umlauts to RIGHT ALT + <key>
      keycode 108 = Mode_switch
      keysym e = e E EuroSign
      keysym c = c C cent
      keysym a = a A adiaeresis Adiaeresis
      keysym o = o O odiaeresis Odiaeresis
      keysym u = u U udiaeresis Udiaeresis
      keysym s = s S ssharp
    
      ! disable capslock
      ! remove Lock = Caps_Lock
  ''}"
```

Works after boot and after suspend/resume.

You may need to add some delay to make xmodmap command work.

``` nix
  services.xserver.displayManager.sessionCommands = "sleep 5 && ${pkgs.xorg.xmodmap}/bin/xmodmap -e 'keycode 43 = h H Left H' &";
```

## Using keyd

<a href="keyd" class="wikilink" title="keyd">keyd</a> is another option to customize keyboard behavior, and may be useful when a single keypress should produce multiple characters at once, e.g. a letter with a combining diacritic.

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
