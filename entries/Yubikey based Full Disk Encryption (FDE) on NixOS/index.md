<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Yubikey based Full Disk Encryption (FDE) on NixOS -->

This page is a minimalistic guide for setting up LUKS-based full disk encryption with <a href="Yubikey" class="wikilink" title="Yubikey">Yubikey</a> pre-boot authentication (PBA) on a <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> system. The YubiKey PBA in NixOS currently utilizes YubiKey's [(HMAC-SHA1) challenge response mode](https://docs.yubico.com/yesdk/users-manual/application-otp/challenge-response.html). Two-factor authentication using a (secret) user passphrase as an additional layer of security is also available (and is recommended for more security).

In the 19.03 release (and prior) this method will change the LUKS authentication key on each boot that passes the LVM mount stage by altering a salt value contained on the boot partition.

This guide was tested to work on NixOS 25.05.

This guide utilizes this [nix-shell expression](https://github.com/sgillespie/nixos-yubikey-luks) which provides the environment for setting up LUKS-based full disk encryption with YubiKey PBA.

### Encrypting Multiple drives

If you intend to encrypt multiple drives following this guide, be advised that the file mentioned in steps 6 and 7 is per-drive and using the same file for two drives will result in an un-bootable system. Instead you should create a small partition (a tiny FAT32 partition will do) on every secondary drive and follow the same steps you would for the salt file on those. Obviously you will also need to encrypt the other drives like you would the main drive. See [this post](https://discourse.nixos.org/t/yubikey-2fa-fde-with-multiple-drives/10046) for some more (somewhat outdated) information.

## Requirements

- A NixOS live system booted in <a href="UEFI" class="wikilink" title="UEFI">UEFI</a> mode on the target machine. (i.e. Booting from an installation medium)
- A YubiKey with <strong>challenge response mode support</strong> into the target machine for the **non modern setup**.

## Setup

Install the packages required by the next steps to the live system and make two bash helper functions available.

### Modern Setup

You **do not** need a YubiKey with challenge response mode support for this, any key that supports FIDO or WebAuthn can work with this (including the Bio Series and the Security Series). This is specifically for FIDO.

Using `systemd-cryptenroll` and `systemd-initrd`, it is much easier and faster to setup. Just fill in where it wants you to put the device and filesystem type.

``` nix
{
  boot.initrd = {
    systemd.enable = true;  
    luks.fido2Support = false;  
    luks.devices."put-device-here" = {
      device = "put-device-here";
      crypttabExtraOpts = ["fido2-device=auto"];  
    };
  };
  fileSystems."/" = {
    device = "/dev/mapper/put-device-here";
    fsType = "put-fs-here";
  };
}
```

Enroll your Yubikey: `systemd-cryptenroll --fido2-device=auto put-device-here`. Additional customization can be done like user presence, pin, and user verification (for bio-metric models). Credit to this [1](https://discourse.nixos.org/t/fde-using-systemd-cryptenroll-with-fido2-key/47762#accepted-label)

### Automatic Setup

Enter the nix-shell expression defined by this [repository](https://github.com/sgillespie/nixos-yubikey-luks).

``` console
$ nix-shell https://github.com/sgillespie/nixos-yubikey-luks/archive/master.tar.gz
```

Now go to <a href="#Set_up_the_YubiKey" class="wikilink" title="#Set up the YubiKey">#Set up the YubiKey</a>.

### Manual Setup

Alternatively, you can manually set up the dependencies.

Packages:

- A C compiler, e.g.

- The command line tool

- 

``` console
$ nix-shell -p gcc yubikey-personalization openssl
```

Helper functions:

- Convert a raw binary string to a hexadecimal string
- Convert a hexadecimal string to a raw binary string

Note that you can copy and paste these functions into the bash shell directly to define them.

``` bash
rbtohex() {
    ( od -An -vtx1 | tr -d ' \n' )
}

hextorb() {
    ( tr '[:lower:]' '[:upper:]' | sed -e 's/\([0-9A-F]\{2\}\)/\\\\\\x\1/gI'| xargs printf )
}
```

We need to compile OpenSSL's key derivation function, which is the same one as run on start up. To compile, run the following command.

**Note:** *Because this will put the program in the current directory (rather than your PATH), replace pbkdf2-sha512 commands with ./pbkdf2-sha512.*

``` bash
cc -O3 \
   -I$(nix-build "<nixpkgs>" --no-build-output -A openssl.dev)/include \
   -L$(nix-build "<nixpkgs>" --no-build-output -A openssl.out)/lib \
   $(nix eval "(with import <nixpkgs> {}; pkgs.path)")/nixos/modules/system/boot/pbkdf2-sha512.c \
   -o ./pbkdf2-sha512 -lcrypto
```

If the newlines in the above snippet are problematic for your terminal, you can use the snippet below. It is the same command but as one line.

``` bash
cc -O3 -I$(nix-build "<nixpkgs>" --no-build-output -A openssl.dev)/include -L$(nix-build "<nixpkgs>" --no-build-output -A openssl.out)/lib $(nix eval "(with import <nixpkgs> {}; pkgs.path)")/nixos/modules/system/boot/pbkdf2-sha512.c -o ./pbkdf2-sha512 -lcrypto
```

## Set up the YubiKey

**Step 1**: Program the YubiKey's Configuration Slot 2 in Challenge-Response mode (HMAC-SHA1) if you haven't done yet.

``` console
# SLOT=2
# ykpersonalize -"$SLOT" -ochal-resp -ochal-hmac # This will overwrite existing configuration!
```

Alternatively, YubiKey Personalization Tool (GUI) may be suitable for more complicated operations, such as programming multiple keys at the same time or setting configuration protection.

**Step 2**: Gather the initial salt for the PBA (set its length to what you find time-feasible on your machine).

``` console
# SALT_LENGTH=16
# SALT="$(dd if=/dev/random bs=1 count=$SALT_LENGTH 2>/dev/null | rbtohex)"
```

**Step 3**: Get the user passphrase used as the second factor in the PBA.

If you plan on using a user password during the boot process (instead of an unassisted boot), enter a user password. Your choice here will change the command you run in step 8.

``` console
# read -s USER_PASSPHRASE
```

**Step 4**: Calculate the initial challenge and response to the YubiKey.

``` console
# CHALLENGE="$(echo -n $SALT | openssl dgst -binary -sha512 | rbtohex)"
# RESPONSE=$(ykchalresp -2 -x $CHALLENGE 2>/dev/null)
```

**Step 5**: Derive the Luks slot key from the two factors.

Set the length of the Luks slot key and the cipher appropriately.

As an example, we will use AES-256, so we set the Luks device slot key length to 512 bit.

Set the iteration count used for PBKDF2 to a high value still time-feasible for your machine.

``` console
# KEY_LENGTH=512
# ITERATIONS=1000000
```

If you choose to authenticate with a user password, use the following line to generate the luks key.

``` console
# LUKS_KEY="$(echo -n $USER_PASSPHRASE | pbkdf2-sha512 $(($KEY_LENGTH / 8)) $ITERATIONS $RESPONSE | rbtohex)"
```

If you choose to authenticate without a user passphrase (not recommended), use this instead of the line above

``` console
# LUKS_KEY="$(echo | pbkdf2-sha512 $(($KEY_LENGTH / 8)) $ITERATIONS $RESPONSE | rbtohex)"
```

To test if the key is programmed correctly, you can challenge the yubikey and check that the response is the expected response previously generated (`echo $RESPONSE`).

## Partitioning

Create a GPT partition table and two partitions on the target disk.

- Partition 1: This will be the EFI system partition: FAT32 etc., EF00 Linux filesystem (boot/esp), \>100MB
- Partition 2: This will be the Luks-encrypted partition, aka the "luks device": 8300 Linux filesystem, Rest of your disk

See for details. For example in :

``` console
# sudo parted /dev/sda
GNU Parted 3.6
Using /dev/sda
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel gpt
(parted) mkpart ESP fat32 1MB 512MB
(parted) set 1 esp on
(parted) mkpart primary 512MB 100%
(parted) print
Model:
Disk /dev/sda:
Sector size (logical/physical):
Partition Table: gpt
Disk Flags: 

Number  Start   End    Size   File system  Name     Flags
 1      1049kB  512MB  511MB  fat32        ESP      boot, esp
 2      512MB   512GB  512GB               primary
(parted) quit
```

In the following we will use variables for identification, so set them to match your partition setup, e.g. like this:

``` console
# EFI_PART=/dev/sda1
# LUKS_PART=/dev/sda2
```

If you use an nvme drive your partition names will be something like /dev/nvme0n1p1 instead of /dev/sda1.

### Setup the LUKS device

**Step 6**: Create the necessary filesystem on the efi system partition, which will store the current salt for the PBA, and mount it.

``` console
# sudo mkfs.vfat -F 32 "$EFI_PART" # format with FAT32 if you haven't
# EFI_MNT=/mnt/boot
# sudo mkdir "$EFI_MNT" # make mount point
# sudo mount "$EFI_PART" "$EFI_MNT" # mount to store salt and iteration later
```

**Step 7**: Decide where on the efi system partition to store the salt and prepare the directory layout accordingly.

``` console
# STORAGE=/crypt-storage/default
# mkdir -p "$(dirname $EFI_MNT$STORAGE)"
```

**Step 8**: Store the salt and iteration count to the EFI systems partition.

``` console
# echo -ne "$SALT\n$ITERATIONS" | sudo tee $EFI_MNT$STORAGE
```

**Step 9**: Create the LUKS device.

- Set the cipher used by LUKS appropriately
- Set the hash used by LUKS appropriately

``` console
# CIPHER=aes-xts-plain64
# HASH=sha512
# echo -n "$LUKS_KEY" | hextorb | sudo cryptsetup luksFormat --cipher="$CIPHER" --key-size="$KEY_LENGTH" --hash="$HASH" --key-file=- "$LUKS_PART"
```

**Step 10**: Open the LUKS device.

Open the LUKS device.

``` console
# LUKSROOT=encrypted
# echo -n "$LUKS_KEY" | hextorb | sudo cryptsetup luksOpen $LUKS_PART $LUKSROOT --key-file=-
```

We can now access the volume at `/dev/mapper/$LUKSROOT`. For example, to format it as <a href="ext4" class="wikilink" title="ext4">ext4</a>

``` console
# sudo mkfs.ext4 /dev/mapper/$LUKSROOT
```

Now go to <a href="#NixOS_installation" class="wikilink" title="#NixOS_installation">#NixOS_installation</a>.

### LVM setup (optional)

The following is one of many methods for setting up the LVM partition. For more information on creating logical volumes, see <a href="LVM" class="wikilink" title="LVM">LVM</a>.

**Step 1**: Setup the LUKS device as a physical volume.

The physical volume map can then be created.

``` console
# pvcreate "/dev/mapper/$LUKSROOT"
```

**Step 2**: Setup a volume group on the LUKS device.

Set the name for the volume group appropriately

``` console
# VGNAME=partitions
# vgcreate "$VGNAME" "/dev/mapper/$LUKSROOT"
```

**Step 3**: Setup two logical volumes on the Luks device.

- Volume 1: This will be the swap partition: choose appropriate size, 2GB for example
- Volume 2: This will be the main btrfs volume, of which all filesystem partitions will be subvolumes: Rest of the free space

``` console
# lvcreate -L 2G -n swap "$VGNAME"
# FSROOT=fsroot
# lvcreate -l 100%FREE -n "$FSROOT" "$VGNAME"

# vgchange -ay
```

**Step 4**: Create the <a href="swap" class="wikilink" title="swap">swap</a> filesystem.

``` console
# mkswap -L swap /dev/partitions/swap
```

### Btrfs setup (optional)

These steps can mostly be followed the same for other filesystem types except calls to the <a href="btrfs" class="wikilink" title="btrfs">btrfs</a> command can be ignored.

**Step 1**: Create the main btrfs volume's filesystem.

``` console
# mkfs.btrfs -L "$FSROOT" "/dev/partitions/$FSROOT"
```

Should the above fail, you might have encountered a bug that can be solved with doing the following, then attempting the above again:

``` console
# mkdir /mnt-root
# touch /mnt-root/nix-store.squashfs
```

**Step 2**: Mount the main btrfs volume.

``` console
# mount "/dev/partitions/$FSROOT" /mnt
```

**Step 3**: Create the subvolumes, for example "root" and "home".

``` console
# cd /mnt
# btrfs subvolume create root
# btrfs subvolume create home
```

**Step 4**: Create mountpoints on the root subvolume and finalise things for NixOS installation.

``` console
# umount /mnt
# mount -o subvol=root "/dev/partitions/$FSROOT" /mnt

# mkdir /mnt/home
# mount -o subvol=home "/dev/partitions/$FSROOT" /mnt/home

# mkdir /mnt/boot
# mount "$EFI_PART" /mnt/boot

# swapon /dev/partitions/swap
```

## NixOS installation

See for details.

**Step 1**: Mount drives.

``` console
# sudo umount $EFI_PART
# sudo mount "/dev/mapper/$LUKSROOT" /mnt # mount luks device first
# sudo mkdir /mnt/boot # create mount point
# sudo mount "$EFI_PART" /mnt/boot # mount efi partition next
```

**Step 2**: Generate (hardware) config.

``` console
# sudo nixos-generate-config --root /mnt
```

**Step 3**: Modify config.

Replace anything that looks like a Bash variable with the value that it currently holds for in your shell and modify as needed.

``` console
sudo nano /mnt/etc/nixos/configuration.nix
```

**Step 4**: Install NixOS.

``` console
# sudo nixos-install
```

### Headless setup note

If you have set up your system to not use a user password and attempt to boot the system, you may find the system stalls with the following message:

"Gathering entropy for new salt (please enter random keys to generate entropy if this blocks for long)..."

If you see this message and no more dots appear after a while, you have run into a situation where the random number generator does not have enough entropy stored up. You can mitigate this by starting a network interface (assuming the device is on a network), which should fill the entropy pool and allow the computer to boot headless. Below is an example configuration that has been tested to work in a headless configuration.

Finally, clean up and you should be ready to reboot into your new system.

## Maintenance

Prerequisite: You'll need the environment, defined in <a href="#Automatic_Setup" class="wikilink" title="#Automatic Setup">#Automatic Setup</a>.

To modify your LUKS setup, `$LUKS_KEY`, which was generated in <a href="#Setup_the_LUKS_device" class="wikilink" title="#Setup_the_LUKS_device">#Setup_the_LUKS_device</a>, may be needed. The following commands (values from above assumed, replace them to match your configuration) will help you in generating the LUKS key.

``` console
# KEY_LENGTH=512
# ITERATIONS=1000000
# SALT=$(head -n1 /boot/crypt-storage/default)
# read -s USER_PASSPHRASE
# CHALLENGE=$(echo -n $SALT | tr -d '\n' | openssl dgst -binary -sha512 | rbtohex)
# RESPONSE="$(sudo ykchalresp -2 -x $CHALLENGE 2>/dev/null)"
# LUKS_KEY="$(echo -n $USER_PASSPHRASE | pbkdf2-sha512 $(($KEY_LENGTH / 8)) $ITERATIONS $RESPONSE | rbtohex)"
```

Now, you can pass `$LUKS_KEY` via stdin to any `cryptsetup` command with `--key-file=-` option.

For instance, if you want to add another key to your setup:

``` bash
echo -n "$LUKS_KEY" | hextorb | cryptsetup luksAddKey /dev/nvme0n1p2 --key-file=-
```

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
