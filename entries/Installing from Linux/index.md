<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Installing from Linux -->

## Why?

For 'normal' NixOS installations, you'd use the instructions from <https://nixos.org/manual/nixos/stable/index.html#sec-installation>

However, you can install 'directly from Linux' if:

- You already have a running linux distro
- You don't want to waste a CD-R (and can't boot from USB)
- You have a spare partition where to install NixOS ready.

One method is described in the manual at <https://nixos.org/manual/nixos/stable/#sec-installing-from-other-distro>. For an alternative method, see below.

## How?

To simplify, we will be using these abbreviations:

/dev/sda1  
your boot partition, containing already working grub

<!-- -->

/dev/sda2  
your linux root partition, containing your currently working OS (/dev/sda1 and /dev/sda2 \*can\* be the same partition!)

<!-- -->

/dev/sda3  
your spare partition to where you will install NixOS

<!-- -->

/boot  
the boot directory, where grub is installed

<!-- -->

~/inst  
directory where the ISO is (loop) mounted

The following sections outline two installation methods. Choose the one that suits you best.

## Installing through a chroot

In this section we will install NixOS by unpacking the ISO and then chrooting into its contents to start the final install.

Note that this may not work on all distributions (eg. older versions of debian stable).

### Preparations

Get a NixOS ISO and unpack the squashfs filesystem containing the nix store. A tool from squashfs-tools is required, so install that package first.

The following commands create two directories in your home directory, one for the ISO mountpoint and one for the host system. Then the ISO is downloaded (substitute as you please), mounted and the nix store extracted.

``` console
# cd ~
# mkdir -p inst host/nix
# wget https://channels.nixos.org/nixos-21.11/latest-nixos-minimal-x86_64-linux.iso
# modprobe loop
# mount -o loop latest-nixos-minimal-x86_64-linux.iso inst
# unsquashfs -d host/nix/store inst/nix-store.squashfs '*'
```

To have a working network connection, copy /etc/resolv.conf to host/nix/etc. For a working chroot, you also need to bind /dev, /proc and /sys directories to the target system.

``` console
# cd host
# mkdir -p etc dev proc sys
# cp /etc/resolv.conf etc
# for fn in dev proc sys; do mount --bind "/${fn}" "${fn}"; done
```

### Circumventing regular init sequence

To properly chroot into the host system you must locate the packages named nixos and bash. The following commands may prove helpful:

``` console
# INIT=$(find . -type f -path '*nixos*/init')
# echo $INIT
./nix/store/abwlkvzyjd2i39b1l1wfv7v9ilx88fwi-nixos-0.1pre34067-34077/init
# BASH=$(find . -type f -path '*/bin/bash' | tail -n 1)
# echo $BASH
./nix/store/bmgq2jrn6719r6j55gs4rzfp0azcbazy-bash-4.2-p24/bin/bash
```

**Replace further mentions of these files with your own results! Note the missing prefix in some uses.**

Next we have to edit the target system init script to start a bash session instead of systemd. As that is the last thing the script does, adding an interactive program does not pose a problem.

``` console
# sed -i "s,exec /.*systemd,exec /$BASH," $INIT
```

### Starting the install

Now we are able to chroot into the NixOS system used for installation. *You may get several warnings and errors, but you can safely ignore them unless they are fatal.* If you're installing from Arch, you may need to remove the mount call that tries to make / private in the same init script.

Using chroot:

``` console
# chroot . /$INIT
```

Using pivot_root:

``` console
# mkdir old_root
# mount --make-rprivate /
# pivot_root . old_root
# $INIT
```

**Further commands to be executed in the chrooted environment will be prefixed with "# (chroot)"**.

The next steps are the same as with classical installation methods. Create a suitable NixOS [configuration](http://nixos.org/nixos/manual/#ch-configuration) and start the build.

``` console
# (chroot) mount /dev/sda3 /mnt
# (chroot) nixos-generate-config --root /mnt
# (chroot) nano /mnt/etc/nixos/configuration.nix
```

Before executing nixos-install you might want to run nixos-checkout to obtain the most recent version of packages to be installed into your NixOS system. You might need to copy /etc/resolv.conf from the host to the target system.

``` console
# (chroot) NIX_PATH="nixpkgs=channel:nixos-21.11" nixos-install
```

Now your system should be set up. Be sure to change the root password to be able to login and double check that /mnt/boot/grub/menu.lst is present and looks sensible.

``` console
# (chroot) passwd
```

Finally, if you instructed nix not to overwrite your existing boot loader, manually copy the menu.lst entries into your existing system's GRUB menu.lst.

Once you're done tweaking, exit the chroot (exit or ctrl-d will) and reboot. With any luck, you will have new choices in the GRUB menu to choose from.

## Running the LiveCD installer from disk

In this section we will install NixOS by transfering the installer from the ISO to a bootable partition and then running it.

**WARNING**

This approach relies on merging the LiveCD image with the contents of your working partition, so several limitations apply:

- the target partition needs to have enough free space for both the working partition (/dev/sda2) and the uncompressed nix store from the LiveCD
- /etc will be merged, so your current settings can interfere with the final installation steps

### Unpacking the ISO image

``` console
# wget https://channels.nixos.org/nixos-24.05/latest-nixos-minimal-x86_64-linux.iso # get the latest iso (URL might change!)
# modprobe loop
# mount -o loop latest-nixos-minimal-x86_64-linux.iso ~/inst
# # mount /dev/sda1 # mount the /boot partition if you have it
# cp ~/inst/boot/bzImage /boot/nixos-livecd-bzImage
# cp ~/inst/boot/initrd /boot/nixos-livecd-initrd
# cp ~/inst/nix-store.squashfs /nix-store.squashfs
```

### Modifying your bootloader's config

Look at some_dir/boot/grub/grub.cfg. This is Grub-2 main config file of the ISO. Locate the NixOS menuentry section:

    menuentry "NixOS Installer / Rescue" {
      linux /boot/bzImage init=/nix/store/p5n72ay1c1wx4wry90zabr8jnljpdzgx-nixos-0.2pre4601_1def5ba-48a4e91/init root=LABEL=NIXOS_0.2pre4601_1def5ba-48a4e91
      initrd /boot/initrd
    }

The goal is to tell your bootloader to boot /nixos-livecd-bzImage with correct init argument.

#### GRUB 1

To setup grub-1, edit your /boot/grub/menu.lst (or equivalent). Add following lines to the config:

    title NixOS LiveCD
    kernel /nixos-livecd-bzImage init=/nix/store/p5n72ay1c1wx4wry90zabr8jnljpdzgx-nixos-0.2pre4601_1def5ba-48a4e91/init root=/dev/sda2 splash=verbose vga=0x317
    initrd /nixos-livecd-initrd

Note, that hash should match with what you have seen in some_dir/grub/grub.cfg

Go to the reboot section

#### GRUB 2

A grub entry for ubuntu might look like this:

    menuentry "NixOS Installer / Rescue" {
      linux /nixos-livecd-bzImage init=/nix/store/p5n72ay1c1wx4wry90zabr8jnljpdzgx-nixos-0.2pre4601_1def5ba-48a4e91/init root=/dev/sda2
      initrd /nixos-lived-initrd
    }

#### Other bootloaders

Should also work. Please add instructions here.

### Booting into LiveCD

Reboot. Select "NixOS LiveCD" from the bootloader menu. If everything is OK, you will see Login prompt asking you to login as root with empty password. ''DO NOT TRUST IT BLINDLY. You probably have your /etc mounted from /dev/sda2 so it contains your old passwd (as well as LiveCD stuff merged into by the means of UnionFS). So if empty password is not working, try your old root password.

Thats it. Now follow the manual (Alt-F8), mount /dev/sda3 as /mnt, do nixos-option and so on.

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a>
