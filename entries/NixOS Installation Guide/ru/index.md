<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Installation Guide/ru -->

<languages/> Это руководство служит вспомогательным руководством для [оффициального руководства](https://nixos.org/nixos/manual/index.html#ch-installation). Оно описывает установку <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> как полноценной операционной системы, смотрите <a href="Nix_Installation_Guide" class="wikilink" title="Nix Installation Guide">Nix Installation Guide</a>.

<div lang="en" dir="ltr" class="mw-content-ltr">

In addition to covering the steps from the official manual, it provides known good instructions for common use cases. When there is a discrepancy between the manual and this guide, the supported case is the one described in the manual.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Installation target

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS can be installed on an increasing variety of hardware:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- regular (Intel or AMD) desktop computers, laptops or physically accessible servers, covered on this page
- SBCs (like the Raspberry Pis) and other ARM boards, see <a href="NixOS_on_ARM" class="wikilink" title="NixOS on ARM">NixOS on ARM</a>
- cloud and remote servers, see <a href="NixOS_friendly_hosters" class="wikilink" title="NixOS friendly hosters">NixOS friendly hosters</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Installation method

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS, as with most Linux-based operating systems, can be installed in different ways.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  The classic way, booting from the installation media. (Described below.)
2.  <a href="Installing_from_Linux" class="wikilink" title="Booting the media from an existing Linux installation">Booting the media from an existing Linux installation</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Making the installation media

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Since NixOS 14.11 the installer ISO is hybrid. This means it is bootable on both CD and USB drives. It also boots on EFI systems, like most modern motherboards and apple systems. The following instructions will assume the standard way of copying the image to a USB drive. When using a CD or DVD, the usual methods to burn to disk should work with the iso.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### "Burning" to USB drive

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

First, download a [NixOS ISO image](https://nixos.org/download.html#nixos-iso) or <a href="Creating_a_NixOS_live_CD" class="wikilink" title="create a custom ISO">create a custom ISO</a>. Then plug in a USB stick large enough to accommodate the image. Then follow the platform instructions:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### From Linux

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  Find the right device with `lsblk` or `fdisk -l`. Replace <i>`/dev/sdX`</i> with the proper device in the following steps.
2.  Copy to device: `cp nixos-xxx.iso `<em>`/dev/sdX`</em>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Writing the disk image with `dd if=nixos.iso of=/dev/sdX bs=4M status=progress conv=fdatasync` also works.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### From macOS

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  Find the right device with `diskutil list`, let's say <i>`diskX`</i>.
2.  Unmount with `diskutil unmountDisk `<i>`diskX`</i>.
3.  Burn with: `sudo dd if=`<b>`path_to_nixos.iso`</b>` of=/dev/`<i>`diskX`</i>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### From Windows

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  Download [USBwriter](http://sourceforge.net/projects/usbwriter/).
2.  Start USBwriter.
3.  Choose the downloaded ISO as 'Source'
4.  Choose the USB drive as 'Target'
5.  Click 'Write'
6.  When USBwriter has finished writing, safely unplug the USB drive.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Alternative installation media instructions

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The previous methods are the supported methods of making the USB installation media.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Those methods are also documented, they can allow using the USB drive to boot multiple distributions. This is not supported, your mileage may vary.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="NixOS_Installation_Guide/Unetbootin" class="wikilink" title="Using Unetbootin">Using Unetbootin</a>
- <a href="NixOS_Installation_Guide/Manual_USB_Creation" class="wikilink" title="Manual USB Creation">Manual USB Creation</a>
- <a href="NixOS_Installation_Guide/multibootusb" class="wikilink" title="multibootusb">multibootusb</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Booting the installation media

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The installation media is hybrid and is capable of booting in both legacy BIOS mode and <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> mode.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Whatever mode is used to boot the installation media, your motherboard or computer's configuration may need to be changed to allow booting from a Optical Disk Drive (for CD/DVD) or an external USB drive.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Legacy bios boot

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This is the only boot possible on machines lacking EFI/UEFI.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### UEFI boot

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The EFI bootloader of the installation media is not signed and is not using a signed shim to boot. This means that Secure Boot will need to be disabled to boot.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Connecting to the internet

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The installation will **definitely** need a working internet connection. It is possible to install without one, but the available set of packages is limited.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Wired

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For network interfaces supported by the kernel, DHCP resolution should already have happened once the shell is available.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Tethered (Internet Sharing)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you can not connect to the internet via cable or wifi, you may use smartphone's tethering capability to share internet. Depending on your smartphones capabilities, only stock kernel drivers may be required which can help providing a working network connection.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Wireless

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

<a href="NetworkManager" class="wikilink" title="NetworkManager">NetworkManager</a> is installed on the graphical ISO, meaning that it is possible to use `nmtui` on the command line to connect to a network.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Using the "Applications" tab at top left or the launcher bar at bottom, choose a terminal application and from there launch `nmtui`. This will allow you to 'activate' a (wireless) connection - your local SSIDs should be visible in the list, else you can add a new connection. When the wireless connection is active and you have tested it, it is likely the install app which launched on startup has not detected the new connection. Close down the install app, and reopen it from the launcher bar at the bottom of the screen. This should then find the new connection and proceed.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

On the minimal ISO, or if you are more familiar with <a href="wpa_supplicant" class="wikilink" title="wpa_supplicant">wpa_supplicant</a> then you can also run `wpa_passphrase ESSID | sudo tee /etc/wpa_supplicant.conf`, then enter your password and `systemctl restart wpa_supplicant`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Partitioning

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To partition the persistent storage run `sudo fdisk /dev/diskX` and follow instructions for MBR or (U)EFI. To determine which mode you are booted into, run:

</div>

``` console
$ [ -d /sys/firmware/efi/efivars ] && echo "UEFI" || echo "Legacy"
```

<div lang="en" dir="ltr" class="mw-content-ltr">

A very simple example setup is given here.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Legacy Boot (MBR)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

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

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### UEFI

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

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

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Format partitions

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The example below uses the <a href="ext4" class="wikilink" title="ext4">ext4</a> filesystem format. If you wish to use other filesystem formats such as <a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a> or <a href="ZFS" class="wikilink" title="ZFS">ZFS</a>:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Bcachefs#NixOS_installation_on_bcachefs" class="wikilink" title="Bcachefs#NixOS installation on bcachefs">Bcachefs#NixOS installation on bcachefs</a>
- <a href="Btrfs#Installation_of_NixOS_on_btrfs" class="wikilink" title="Btrfs#Installation of NixOS on btrfs">Btrfs#Installation of NixOS on btrfs</a>
- <a href="LVM#Basic_Setup" class="wikilink" title="LVM#Basic Setup">LVM#Basic Setup</a>
- <a href="ZFS#Simple_NixOS_ZFS_on_root_installation" class="wikilink" title="ZFS#Simple NixOS ZFS on root installation">ZFS#Simple NixOS ZFS on root installation</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This is useful for having multiple setups and makes partitions easier to handle

</div>

``` console
$ lsblk # lists current system block devices
# mkfs.fat -F 32 -n boot /dev/sdX1
# mkfs.ext4 /dev/sdX2 -L nixos
# mount /dev/disk/by-label/nixos /mnt
# mkdir -p /mnt/boot
# mount /dev/disk/by-label/boot /mnt/boot
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## NixOS configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS is configured through a <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="declarative configuration">declarative configuration</a> file. To generate a default config file, run <a href="nixos-generate-config" class="wikilink" title="nixos-generate-config">nixos-generate-config</a>:

</div>

``` console
# nixos-generate-config --root /mnt
# nano /mnt/etc/nixos/configuration.nix
```

<div lang="en" dir="ltr" class="mw-content-ltr">

For information on working with a system configuration, see <a href="NixOS_system_configuration" class="wikilink" title="NixOS system configuration">NixOS system configuration</a>. For desktop-specific configurations, see <a href="NixOS_as_a_desktop" class="wikilink" title="NixOS as a desktop">NixOS as a desktop</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Most essential changes:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- keyboard layout, ie <a href="Keyboard_Layout_Customization" class="wikilink" title="services.xserver.xkb.layout"><code>services.xserver.xkb.layout</code></a>
- <a href="networking" class="wikilink" title="networking">networking</a> (wifi), see below for fix if it breaks
- install <a href=":Category:Text_Editor" class="wikilink" title="editor">editor</a> to edit the configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The self-documenting NixOS options can be searched with [NixOS options search](https://search.nixos.org/options).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Swap file

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For additional methods of configuring swap, see <a href="Swap" class="wikilink" title="Swap">Swap</a>. The following example demonstrates how to create and enable a <a href="Swap#Swap_file" class="wikilink" title="swap file">swap file</a>:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Bootloader

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NixOS supports multiple <a href="Bootloader" class="wikilink" title="bootloaders">bootloaders</a> such as <a href="GNU_GRUB" class="wikilink" title="GNU GRUB">GNU GRUB</a> and <a href="Systemd/boot" class="wikilink" title="Systemd/boot">Systemd/boot</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Systemd-boot is the recommended bootloader. The following example demonstrates how to enable systemd-boot in your configuration:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You may also wish to configure <a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Users

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For information on creating and managing users, see <a href="User_management" class="wikilink" title="User management">User management</a> and the . See an example below:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## NixOS installation

</div>

``` console
# cd /mnt
# nixos-install
```

<div lang="en" dir="ltr" class="mw-content-ltr">

after installation: Run `passwd` to change user password.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

if internet broke/breaks, try one of the following:

</div>

``` console
# nixos-rebuild switch --option substitute false # no downloads
# nixos-rebuild switch --option binary-caches "" # no downloads
```

<div lang="en" dir="ltr" class="mw-content-ltr">

- wpa_supplicant flags to connect to wifi

</div>

<hr />

<div lang="en" dir="ltr" class="mw-content-ltr">

## Additional notes for specific hardware

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

These are collected notes or links for specific hardware issues.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Blog post how to install NixOS on a [Dell 9560](http://grahamc.com/blog/nixos-on-dell-9560)
- Brand servers may require extra kernel modules be included into initrd (`boot.initrd.extraKernelModules` in configuration.nix) For example HP Proliant needs "hpsa" module to see the disk drive.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
