<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Installation Guide/en -->

<languages/> This guide serves as a companion guide for the [official manual](https://nixos.org/nixos/manual/index.html#ch-installation). It describes installation of <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> as a complete operating system. For instructions on installing <a href="Nix" class="wikilink" title="Nix">Nix</a> within an existing operating system, refer to the <a href="Nix_Installation_Guide" class="wikilink" title="Nix Installation Guide">Nix Installation Guide</a>.

In addition to covering the steps from the official manual, it provides known good instructions for common use cases. When there is a discrepancy between the manual and this guide, the supported case is the one described in the manual.

## Installation target

NixOS can be installed on an increasing variety of hardware:

- regular (Intel or AMD) desktop computers, laptops or physically accessible servers, covered on this page
- SBCs (like the Raspberry Pis) and other ARM boards, see <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>
- cloud and remote servers, see <a href="NixOS_friendly_hosters" class="wikilink" title="NixOS friendly hosters">NixOS friendly hosters</a>

## Installation method

NixOS, as with most Linux-based operating systems, can be installed in different ways.

1.  The classic way, booting from the installation media. (Described below.)
2.  <a href="Installing_from_Linux" class="wikilink" title="Booting the media from an existing Linux installation">Booting the media from an existing Linux installation</a>

## Making the installation media

Since NixOS 14.11 the installer ISO is hybrid. This means it is bootable on both CD and USB drives. It also boots on EFI systems, like most modern motherboards and apple systems. The following instructions will assume the standard way of copying the image to a USB drive. When using a CD or DVD, the usual methods to burn to disk should work with the iso.

### "Burning" to USB drive

First, download a [NixOS ISO image](https://nixos.org/download.html#nixos-iso) or <a href="Creating_a_NixOS_live_CD" class="wikilink" title="create a custom ISO">create a custom ISO</a>. Then plug in a USB stick large enough to accommodate the image. Then follow the platform instructions:

#### From Linux

1.  Find the right device with `lsblk` or `fdisk -l`. Replace <i>`/dev/sdX`</i> with the proper device in the following steps.
2.  Copy to device: `cp nixos-xxx.iso `<em>`/dev/sdX`</em>

Writing the disk image with `dd if=nixos.iso of=/dev/sdX bs=4M status=progress conv=fdatasync` also works.

#### From macOS

1.  Find the right device with `diskutil list`, let's say <i>`diskX`</i>.
2.  Unmount with `diskutil unmountDisk `<i>`diskX`</i>.
3.  Burn with: `sudo dd if=`<b>`path_to_nixos.iso`</b>` of=/dev/`<i>`diskX`</i>

#### From Windows

1.  Download [USBwriter](http://sourceforge.net/projects/usbwriter/).
2.  Start USBwriter.
3.  Choose the downloaded ISO as 'Source'
4.  Choose the USB drive as 'Target'
5.  Click 'Write'
6.  When USBwriter has finished writing, safely unplug the USB drive.

### Alternative installation media instructions

The previous methods are the supported methods of making the USB installation media.

Those methods are also documented, they can allow using the USB drive to boot multiple distributions. This is not supported, your mileage may vary.

- <a href="NixOS_Installation_Guide/Unetbootin" class="wikilink" title="Using Unetbootin">Using Unetbootin</a>
- <a href="NixOS_Installation_Guide/Manual_USB_Creation" class="wikilink" title="Manual USB Creation">Manual USB Creation</a>
- <a href="NixOS_Installation_Guide/multibootusb" class="wikilink" title="multibootusb">multibootusb</a>

## Booting the installation media

The installation media is hybrid and is capable of booting in both legacy BIOS mode and <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> mode.

Whatever mode is used to boot the installation media, your motherboard or computer's configuration may need to be changed to allow booting from a Optical Disk Drive (for CD/DVD) or an external USB drive.

### Legacy bios boot

This is the only boot possible on machines lacking EFI/UEFI.

### UEFI boot

The EFI bootloader of the installation media is not signed and is not using a signed shim to boot. This means that Secure Boot will need to be disabled to boot.

## Connecting to the internet

The installation will **definitely** need a working internet connection. It is possible to install without one, but the available set of packages is limited.

### Wired

For network interfaces supported by the kernel, DHCP resolution should already have happened once the shell is available.

## Tethered (Internet Sharing)

If you can not connect to the internet via cable or wifi, you may use smartphone's tethering capability to share internet. Depending on your smartphones capabilities, only stock kernel drivers may be required which can help providing a working network connection.

### Wireless

<a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> is installed on the graphical ISO, meaning that it is possible to use `nmtui` on the command line to connect to a network.

Using the "Applications" tab at top left or the launcher bar at bottom, choose a terminal application and from there launch `nmtui`. This will allow you to 'activate' a (wireless) connection - your local SSIDs should be visible in the list, else you can add a new connection. When the wireless connection is active and you have tested it, it is likely the install app which launched on startup has not detected the new connection. Close down the install app, and reopen it from the launcher bar at the bottom of the screen. This should then find the new connection and proceed.

On the minimal ISO, or if you are more familiar with <a href="wpa_supplicant" class="wikilink" title="wpa_supplicant">wpa_supplicant</a> then you can also run `wpa_passphrase ESSID | sudo tee /etc/wpa_supplicant.conf`, then enter your password and `systemctl restart wpa_supplicant`.

## Partitioning

To partition the persistent storage run `sudo fdisk /dev/diskX` and follow instructions for MBR or (U)EFI. To determine which mode you are booted into, run:

``` console
$ [ -d /sys/firmware/efi/efivars ] && echo "UEFI" || echo "Legacy"
```

A very simple example setup is given here.

### Legacy Boot (MBR)

- o (dos disk label)
- n new
- p primary (4 primary in total)
- 1 (partition number \[1/4\])
- 2048 first sector (alignment for performance)
- +500M last sector (boot sector size)
- rm signature (Y), if ex. =\> warning of overwriting existing system, could use wipefs
- n
- p
- 2
- default (fill up partition)
- default (fill up partition)
- w (write)

### UEFI

- g (gpt disk label)
- n
- 1 (partition number \[1/128\])
- 2048 first sector
- +500M last sector (boot sector size)
- t
- 1 (EFI System)
- n
- 2
- default (fill up partition)
- default (fill up partition)
- w (write)

### Format partitions

The example below uses the <a href="ext4" class="wikilink" title="ext4">ext4</a> filesystem format. If you wish to use other filesystem formats such as <a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a> or <a href="ZFS" class="wikilink" title="ZFS">ZFS</a>:

- <a href="Bcachefs#NixOS_installation_on_bcachefs" class="wikilink" title="Bcachefs#NixOS installation on bcachefs">Bcachefs#NixOS installation on bcachefs</a>
- <a href="Btrfs#Installation_of_NixOS_on_btrfs" class="wikilink" title="Btrfs#Installation of NixOS on btrfs">Btrfs#Installation of NixOS on btrfs</a>
- <a href="LVM#Basic_Setup" class="wikilink" title="LVM#Basic Setup">LVM#Basic Setup</a>
- <a href="ZFS#Simple_NixOS_ZFS_on_root_installation" class="wikilink" title="ZFS#Simple NixOS ZFS on root installation">ZFS#Simple NixOS ZFS on root installation</a>

This is useful for having multiple setups and makes partitions easier to handle

``` console
$ lsblk # lists current system block devices
# mkfs.fat -F 32 -n boot /dev/sdX1
# mkfs.ext4 /dev/sdX2 -L nixos
# mount /dev/disk/by-label/nixos /mnt
# mkdir -p /mnt/boot
# mount /dev/disk/by-label/boot /mnt/boot
```

## NixOS configuration

NixOS is configured through a <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="declarative configuration">declarative configuration</a> file. To generate a default config file, run <a href="nixos-generate-config" class="wikilink" title="nixos-generate-config">nixos-generate-config</a>:

``` console
# nixos-generate-config --root /mnt
# nano /mnt/etc/nixos/configuration.nix
```

For information on working with a system configuration, see <a href="NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>. For desktop-specific configurations, see <a href="NixOS_as_a_desktop" class="wikilink" title="NixOS as a desktop">NixOS as a desktop</a>.

Most essential changes:

- keyboard layout, ie <a href="Keyboard_Layout_Customization" class="wikilink" title="services.xserver.xkb.layout"><code>services.xserver.xkb.layout</code></a>
- <a href="networking" class="wikilink" title="networking">networking</a> (wifi), see below for fix if it breaks
- install <a href=":Category:Text_Editor" class="wikilink" title="editor">editor</a> to edit the configuration

The self-documenting NixOS options can be searched with [NixOS options search](https://search.nixos.org/options).

### Swap file

For additional methods of configuring swap, see <a href="Swap" class="wikilink" title="Swap">Swap</a>. The following example demonstrates how to create and enable a <a href="Swap#Swap_file" class="wikilink" title="swap file">swap file</a>:

### Bootloader

NixOS supports multiple <a href="Bootloader" class="wikilink" title="bootloaders">bootloaders</a> such as <a href="GNU_GRUB" class="wikilink" title="GNU GRUB">GNU GRUB</a> and <a href="Systemd/boot" class="wikilink" title="Systemd/boot">Systemd/boot</a>.

Systemd-boot is the recommended bootloader. The following example demonstrates how to enable systemd-boot in your configuration:

You may also wish to configure <a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a>.

### Users

For information on creating and managing users, see <a href="User_management" class="wikilink" title="User management">User management</a> and the . See an example below:

## NixOS installation

``` console
# cd /mnt
# nixos-install
```

after installation: Run `passwd` to change user password.

if internet broke/breaks, try one of the following:

``` console
# nixos-rebuild switch --option substitute false # no downloads
# nixos-rebuild switch --option binary-caches "" # no downloads
```

- wpa_supplicant flags to connect to wifi

<hr />

## Additional notes for specific hardware

These are collected notes or links for specific hardware issues.

- Blog post how to install NixOS on a [Dell 9560](http://grahamc.com/blog/nixos-on-dell-9560)
- Brand servers may require extra kernel modules be included into initrd (`boot.initrd.extraKernelModules` in configuration.nix) For example HP Proliant needs "hpsa" module to see the disk drive.

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
