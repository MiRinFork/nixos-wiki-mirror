<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Impermanence -->

Impermanence in NixOS is where your root directory gets wiped every reboot (such as by mounting a tmpfs to /).

Such a setup is possible because NixOS only needs `/boot` and `/nix` in order to boot, all other system files are simply links to files in `/nix`. `/boot` and `/nix` still need to be stored on a hard drive or SSD.

## Example

## Persistence

Some files and folders should be persisted between reboots though (such as `/etc/nixos/`). This can be accomplished through bind mounts or by using the [NixOS Impermanence module,](https://github.com/nix-community/impermanence) which will set up bind mounts and links as needed.

### Example

## Home Managing

You can just make a home partition on a drive and mount it as normal, so everything in `/home` or `/home/username` will be persisted. If you want your home to be impermanent as well, then mount it on tmpfs the same way as root.

For persisting files in your home, you could simply use [Home Manager](https://github.com/nix-community/home-manager) as usual. However, then files are stored read-only in the Nix store. In order to persist files while still being writable, you can use the [Home Manager Impermanence module](https://github.com/nix-community/impermanence). It will fuse mount folders and link files from persistent storage into your home directory.

### Example

## Troubleshooting

### builder for '/nix/store/file-name.service.drv' failed to produce output path for output 'out' at '/nix/store/file-name.service'

This can happen if your NixOS version is later than your Home-Manager version (ex. NixOS 22.05 with Home-Manager 21.11) - see

## See Also

- <https://elis.nu/blog/2020/06/nixos-tmpfs-as-home/> - Examples of using the NixOS modules
- <https://grahamc.com/blog/erase-your-darlings> - Explaining why you might want to do this. Uses ZFS snapshots instead of tmpfs.
- <https://web.archive.org/web/20241007130142/https://mt-caret.github.io/blog/posts/2020-06-29-optin-state.html> - Encypted Btrfs Root with Opt-in State on NixOS. Uses Btrfs instead of tmpfs or ZFS.

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
