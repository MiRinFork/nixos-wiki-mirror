<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Caelestia Shell -->

[Caelestia-Shell](https://github.com/caelestia-dots/shell) is a desktop shell made for Wayland, specifically for the <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> compositor.

## Installation[^1]

Caelestia is currently not available from nixpkgs. The only way to install Caelestia on NixOS is through <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>. Without home-manager, the shell can be installed using the system packages : We can also use the <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> module :

## Configuration

Three options are available :

1.  **Non-declarative** : edit the `~/.config/caelestia/shell.json`file, following <https://github.com/caelestia-dots/shell#example-configuration>
2.  **Home-manager** : you can use `programs.caelestia.settings`to set each value through Nix, following the above schema. This can cause issues with the GUI settings.
3.  **Symlink** **copy** : You can link the previously mentioned `shell.json` file to your nix config directory with `mkOutOfStoreSymlink` :

## Starting the shell

Once the shell is installed, you should be able to launch it by executing `caelestia shell -d`.

To launch it automatically, you can add the following to your Hyprland config : Or, for Hyprland \< 0.55 :

## Troubleshooting

In some cases, the shell can become unresponsive or take a long time to load. If `systemd-analyze blame | head -10` doesn't show any blocking programs, it can be due to a large number of notifications. In order to clear them, you can run `caelestia shell notifs clear`.

[^1]: <https://github.com/caelestia-dots/shell#nix>
