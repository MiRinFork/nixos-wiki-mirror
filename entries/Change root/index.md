<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Change root -->

[Chroot](https://en.wikipedia.org/wiki/Chroot) is an operation that changes the apparent root directory for the current running process and their children. A program that is run in such a modified environment cannot access files and commands outside that environmental directory tree. This modified environment is called a chroot jail.

# Using nixos-enter

nixos-enter allows to access a NixOS installation from a NixOS rescue system.

The nixos-enter program is part of NixOS. Before it runs provides a shell, the script mounts api filesystems like /proc and setups the profile and /etc of the target system. To use it, setup `/mnt` as described in the [installation manual](https://nixos.org/nixos/manual/#sec-installation).

At the time of writting, the following `mount` commands should suffice:

``` console
$ mount /dev/disk/by-label/<ROOT_LABEL> /mnt/
$ # mount any partitions you might have; here we assume only home and nix exist
$ mkdir -p /mnt/{home,nix}
$ mount /dev/disk/by-label/<HOME_LABEL> /mnt/home
$ mount /dev/disk/by-label/<NIX_LABEL> /mnt/nix
```

Then run `nixos-enter`:

``` console
$ nixos-enter
```

Note, that when using `nixos-rebuild` inside the environment provided by `nixos-enter`, you have to give `nixos-rebuild` subcommands the `--option sandbox false` option, otherwise derivation builds will fail with the following error:

``` console
error: cloning builder process: Operation not permitted
error: unable to start build process
```

# Manual chroot

If a NixOS rescue system is not available, the chroot can be done manually from another Linux distribution.

Mount the file system containing the NixOS to chroot into at `/mnt`, using e.g.:

``` bash
mount /dev/relevantPartitionNameHere /mnt
```

.

Mount the host system's Linux run-time api file systems inside the mount, then populate `/run` using the `activate` script and chroot inside, starting a bash shell (adapted from [here](https://nixos.org/nix-dev/2014-December/015253.html); you may copy all these lines into your terminal as one block to run them):

``` bash
mount -o bind /dev /mnt/dev
mount -o bind /proc /mnt/proc
mount -o bind /sys /mnt/sys
chroot /mnt /nix/var/nix/profiles/system/activate
chroot /mnt /run/current-system/sw/bin/bash
```

You should now be in your NixOS system, and should be able to adjust it by e.g. editing `/etc/nixos/configuration.nix` and running `nixos-rebuild switch` as usual. Remember that you may have to establish Internet access within the chroot for some commands.

# Troubleshooting

## 1. nixos-rebuild fails with "System has not been booted with <program> as init system."

In some cases, such as when using <a href="Systemd-networkd" class="wikilink" title="systemd-networkd">systemd-networkd</a> as the <a href="Bootloader" class="wikilink" title="bootloader">bootloader</a>, <a href="Nixos-rebuild" class="wikilink" title="nixos-rebuild">nixos-rebuild</a> commands might fail with a message similar to

``` console
error: System has not been booted with systemd as init system (PID 1). Can't operate.
```

If you have tried to use `nixos-rebuild switch`, you can try `nixos-rebuild boot` instead. Should that also fail, you can append `NIXOS_SWITCH_USE_DIRTY_ENV=1` to the commands, which should bypass the error while also setting the proper boot entries, if the <a href="Bootloader" class="wikilink" title="bootloader">bootloader</a> is detected.

Finally, should all else fail, `nixos-install` should work as a replacement changing the root.
