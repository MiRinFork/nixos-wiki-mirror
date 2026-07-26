<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Keyd -->

[Keyd](https://github.com/rvaiya/keyd) is a key remapping daemon, similar to kmonad.

### Activate Keyd in NixOS

To activate keyd in NixOS, you can simply add in the rest of your `/etc/nixos/configuration.nix`

``` nix
services.keyd = {
  enable = true;
};

# Optional, but makes sure that when you type the make palm rejection work with keyd
# https://github.com/rvaiya/keyd/issues/723
environment.etc."libinput/local-overrides.quirks".text = ''
  [Serial Keyboards]
  MatchUdevType=keyboard
  MatchName=keyd virtual keyboard
  AttrKeyboardIntegration=internal
'';
```

After rebuilding your configuration, you should have keyd daemon running.

### Configure Keyd: the quick and dirty way

In order to configure your system, you have two options: if you want to quickly test your configuration (avoids you to wait a full `nixos-rebuild switch` every time you change one option), you can simply write your configuration files in a file like `/etc/keyd/test.conf` containing something like:

``` ini
[ids]
*

[main]
capslock = layer(control);
```

and apply your change via

``` console
$ systemctl restart keyd
```

This is practical to quickly test the configuration but in not very "Nixy" as the configuration is not contained in your beloved `/etc/nixos/configuration.nix`… hence the second option:

### Configure Keyd in your configuration.nix

You can then move your configuration to `/etc/nixos/configuration.nix` by adding to your configuration something like:

``` nix
services.keyd = {
  enable = true;
  keyboards = {
    # The name is just the name of the configuration file, it does not really matter
    default = {
      ids = [ "*" ]; # what goes into the [id] section, here we select all keyboards
      # Everything but the ID section:
      settings = {
        # The main layer, if you choose to declare it in Nix
        main = {
          capslock = "layer(control)"; # you might need to also enclose the key in quotes if it contains non-alphabetical symbols
        };
        otherlayer = {};
      };
      extraConfig = ''
        # put here any extra-config, e.g. you can copy/paste here directly a configuration, just remove the ids part
      '';
    };
  };
};
```

Note that for now, ids MUST be present in the file, so it means that layouts cannot be defined this way as reported in <https://github.com/NixOS/nixpkgs/issues/284797>. Yet, you can still use `environment.etc` to create them as usual.

### Disabling Copilot key

An increasing number of new laptops come with a useless Copilot key that you might want to disable or remap. Follow these steps to do so:

Start a shell with keyd available `nix-shell -p keyd` to monitor what the Copilot key does and see your keyboard id. From that shell, run `sudo keyd monitor` and press the Copilot key.

    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftmeta down
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftshift down
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  f23 down
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  f23 up
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftshift up
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftmeta up

You may then edit your configuration accordingly:

### Dealing with Layouts & Unicode Support

If you want to define a layout (like you custom qwerty), you can also do it directly in keyd, but keep in mind that keyd can manipulate keycodes (basically the position of the key on the keyboard that is named based on a qwerty layout by convention), but not keysyms (what actual symbol you will type), since keyd they basically recreates a fake keyboard that will be, later in the chain, processed by X11/ibus/… So if you want to use a layout, you need to be sure that the layout used by the user is set to US (e.g. in X11 via `setxkbmap us`). If you want to produce symbols not accessible by the US keyboard map (e.g. emoji etc), then keyd will basically create for you a XCompose file that you need to include (you may also need to enable Ibus for this), that is located in `"${keyd}/share/keyd/keyd.compose"`. See keyd documentation for more details.

The compose file can be enabled on a per-user basis by setting `~/.XCompose` to be a copy of or a symlink to that compose file. In home-manager, this can be configured like so:

Alternatively, the compose file can be adjusted system-wide by setting the \$XCOMPOSEFILE environment variable. This can be adjusted set in your configuration like so: However, this approach is less reliable, and may not work with all applications, such as web browsers or electron apps.
