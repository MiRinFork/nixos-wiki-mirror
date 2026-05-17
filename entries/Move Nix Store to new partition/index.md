<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Move Nix Store to new partition -->

The tutorial will teach you how to relocate to a new device on non NixOS Hosts. A summary of how this could be done on NixOS is at the bottom. **This has not been tested on NixOS** but there may still be a way:

# On \*BSD/Linux Host

The device that /nix is on has no more space

``` console
$ du -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       182G  180G    2G  99% /
```

Stop nix daemon

``` console
$ sudo systemctl stop nix-daemon.service
```

Move backup /nix; mv /nix to /nix.bak

``` console
$ ls -alF /nix
total 1068
drwxr-xr-x    4 root root      4096 Jan 22 02:43 ./
drwxr-xr-x   26 root root      4096 Feb  8 12:17 ../
drwxrwxr-t 1555 root nixbld 1077248 Feb  8 12:05 store/
drwxr-xr-x    4 root root      4096 Jan 22 02:43 var/
```

``` console
$ cd /
$ tar -afp /nix.tgz /nix /nix.bak
$ sudo mv /nix /nix.bak # in case something goes horribly wrong
```

Mount new device. You will need to add this device to \`/etc/fstab\`

``` console
$ mount /nix
$ du -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdb1       300G    0G  300G   0% /nix
```

Restore /nix from /nix.tgz; verify contents

``` console
$ cd /
$ sudo tar -xf /nix.tgz 
$ nix-store --verify --check-contents
```

Start

``` console
$ sudo systemctl start nix-daemon.service
```

# NixOS

Add [rescue-boot.nix](https://github.com/cleverca22/nixos-configs/blob/master/rescue_boot.nix) to your imports section.

nixos-rebuild (and pray you have ~300mb free on /boot/)

run the installer from grub at any time.

adjust your configuration.nix so it expects to be at the new place, and nixos-rebuild boot, so it doesnt break after you move it

Now reboot and move it.

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
