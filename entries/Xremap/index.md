<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Xremap -->

### Install the flake module

Refer to Xremap's documentation on their [GitHub repository](https://github.com/xremap/nix-flake/blob/c1aa0dab35024c1b85e22934006dbddd4f86fc1e/docs/HOWTO.md#example-configuration).

### Remapping the Copilot key

An increasing number of new laptops come with a Copilot key that you might want to remap. Follow these steps to do so:

Start a shell with keyd available `nix-shell -p keyd` to monitor what the Copilot key does and see your keyboard id. From that shell, run `sudo keyd monitor` and press the Copilot key.

    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftmeta down
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftshift down
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  f23 down
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  f23 up
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftshift up
    AT Translated Set 2 keyboard    0001:0001:09b4e68d  leftmeta up

Then translate the names of keys to the ones used by Xremap.

You may then edit your configuration accordingly:

This configuration was made by referring to a [GitHub discussion](https://github.com/xremap/xremap/discussions/762).
