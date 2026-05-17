<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: REFInd -->

> rEFInd is a graphical boot manager for EFI- and UEFI-based computers, such as all Intel-based Macs and recent (most 2011 and later) PCs. rEFInd presents a boot menu showing all the EFI boot loaders on the EFI-accessible partitions, and optionally BIOS-bootable partitions on Macs. EFI-compatbile OSes, including Linux, provide boot loaders that rEFInd can detect and launch. rEFInd can launch Linux EFI boot loaders such as ELILO, GRUB Legacy, GRUB 2, and 3.3.0 and later kernels with EFI stub support. EFI filesystem drivers for ext2/3/4fs, ReiserFS, HFS+, and ISO-9660 enable rEFInd to read boot loaders from these filesystems, too. rEFInd's ability to detect boot loaders at runtime makes it very easy to use, particularly when paired with Linux kernels that provide EFI stub support.

<cite>[\<nixpkgs/pkgs/tools/bootloaders/refind/default.nix\>](https://github.com/NixOS/nixpkgs/blob/9b25b9347d97caf55732213dbf45653f866f8114/pkgs/tools/bootloaders/refind/default.nix#L110)</cite>

rEFInd cannot be used as-is to boot NixOS; there is no plumbing in NixOS allowing it to know about the generations. It can, though, be used as an intermediary, or secondary, bootloader to allow either selecting un-detected boot options or to help with <a href="Bootloader#Wrangling_recalcitrant_UEFI_implementations" class="wikilink" title="recalcitrant UEFI implementations">recalcitrant UEFI implementations</a>. Using it this way, NixOS is configured to setup any of its EFI bootloader as usual (grub, systemd-boot) and rEFInd should be able to detect those bootloaders in its default configuration.

## Installation

rEFInd can be installed either using the derivation built using `nix` or by [downloading a pre-built binary](https://www.rodsbooks.com/refind/getting.html). rEFInd can then be placed at the default bootloader location (or anywhere else and then configured) in the ESP.

The default boot location is:

- `/EFI/BOOT/BOOTX64.EFI` on the ESP for `x64_64`
- `/EFI/BOOT/BOOTAA64.EFI` on the ESP for `AArch64`

### Text-mode Only

Assuming the ESP is mounted at `/boot/`, a minimal installation (text-mode) without configuration can be made using nix this way (this will replace your default bootloader):

``` console
$ sudo mkdir -p /boot/EFI/boot/
$ sudo cp "$(nix-build '<nixpkgs>' --no-out-link -A 'refind')/share/refind/refind_x64.efi" /boot/EFI/boot/bootx64.efi
```

### Graphical

If you have a fairly standard install and would like a full graphical installation with icons and buttons, the below will install refind to its own folder within your ESP:

``` console
$ sudo nix-shell -p refind efibootmgr
$ refind-install
```

## Configuration

A minimal hands-off configuration which allows some time to select an option follows:

``` bash
# Wait 2 seconds.
timeout 2
# Hide some stuff from the UI.
hideui banner
hideui hints
```

rEFInd will, by default, remember the last booted option.

The `drivers_x64` folder can also be copied next to the rEFInd EFI binary to allow it to handle filesystems not handled by your EFI implementations (though this is untested).

``` console
$ ls -l $(nix-build '<nixpkgs>' --no-out-link -A 'refind')/share/refind/drivers_x64
total 528
-r--r--r-- 2 root root 89388 Dec 31  1969 btrfs_x64.efi
-r--r--r-- 2 root root 69894 Dec 31  1969 ext2_x64.efi
-r--r--r-- 2 root root 70918 Dec 31  1969 ext4_x64.efi
-r--r--r-- 2 root root 73688 Dec 31  1969 hfs_x64.efi
-r--r--r-- 2 root root 69930 Dec 31  1969 iso9660_x64.efi
-r--r--r-- 2 root root 79587 Dec 31  1969 ntfs_x64.efi
-r--r--r-- 2 root root 73712 Dec 31  1969 reiserfs_x64.efi
```

It may even be possible \[<https://logs.nix.samueldr.com/nixos/2018-02-25#1519531022-1519531095>; to use zfs\] when using the proper drivers.

## External resources

- [Official website](https://www.rodsbooks.com/refind/)
- [rEFInd on the ArchWiki](https://wiki.archlinux.org/index.php/REFInd)
- [rEFInd on the Gentoo Wiki](https://wiki.gentoo.org/wiki/Refind)

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>
