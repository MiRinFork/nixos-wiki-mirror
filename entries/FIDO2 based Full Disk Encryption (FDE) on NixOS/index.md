<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FIDO2 based Full Disk Encryption (FDE) on NixOS -->

This page is a minimalistic guide for setting up LUKS-based full disk encryption with FIDO2 pre-boot authentication (PBA) on a <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> system using .

## Configuration

1\. <a href="#Install_NixOS_with_LUKS2_enabled" class="wikilink" title="#Install NixOS with LUKS2 enabled">#Install NixOS with LUKS2 enabled</a>.

2\. Setup FIDO2 device. For a new YubiKey device, a FIDO2 PIN must be set, which can be done by running Yubico Authenticator (available in ), clicking `Passkey` section in the left menu and then clicking `︙` at the right upper corner.

3\. Enroll FIDO2 device by running the following (note that LUKS partition will be automatically detected):

``` console
# sudo systemd-cryptenroll --fido2-device=auto
```

See [systemd-cryptenroll(wiki.archlinux.org)](https://wiki.archlinux.org/title/Systemd-cryptenroll#FIDO2_tokens), , [1](https://discourse.nixos.org/t/fde-using-systemd-cryptenroll-with-fido2-key/47762#accepted-label) for further information on customization including user presence, pin, and biometric user verification.

4\. Update the NixOS configuration following :

## Install NixOS with LUKS2 enabled

LUKS2 based full disk encryption can be done by checking `Encrypt disk` checkbox in `Partitions` section in the graphical installer ().

Alternatively, manual installation is possible as follows (See , and ):

``` console
# sudo parted /dev/sda
GNU Parted 3.6
Using /dev/sda
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel gpt
(parted) mkpart ESP fat32 1MB 512MB
(parted) set 1 esp on
(parted) mkpart primary 512MB 100%
(parted) quit

# EFI_PART=/dev/sda1
# LUKS_PART=/dev/sda2
# LUKS_ROOT=crypted
# sudo cryptsetup luksFormat "$LUKS_PART"
# cryptsetup luksOpen "$LUKS_PART" "$LUKS_ROOT"
# mkfs.ext4 /dev/mapper/$LUKS_ROOT

# sudo mount "/dev/mapper/$LUKSROOT" /mnt # mount luks device first
# sudo mkdir -p /mnt/boot # create mount point
# sudo mount -o umask=077 "$EFI_PART" /mnt/boot # mount efi partition next
# sudo nixos-generate-config --root /mnt
# sudo nixos-install
```
