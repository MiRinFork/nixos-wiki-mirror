<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Full Disk Encryption -->

There are a few options for full disk encryption. The easiest way is to use the graphical installer and choose "encrypt" while doing the installation.

# LVM on LUKS

In this example, everything except for the `/boot` partition is encrypted. This includes the root and swap partitions. A password must be entered during boot to unlock the encrypted filesystems.

The main drive (here the `sda` block device) will need two partitions:

1.  An unencrypted `/boot` partition (EFI system partition) formatted as FAT.
2.  A LUKS-encrypted logical volume group for everything else (swap and `/`).

When unlocked and mounted, it will look like this:

``` text
NAME          MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
sda             8:0    0 233.8G  0 disk
├─sda1          8:1    0   500M  0 part  /boot
└─sda2          8:2    0 233.3G  0 part
  └─root      254:0    0 233.3G  0 crypt
    ├─vg-swap 254:1    0     8G  0 lvm   [SWAP]
    └─vg-root 254:2    0 225.3G  0 lvm   /
```

## Enter password on Boot

The initrd needs to be configured to unlock the encrypted `/dev/sda2` partition during stage 1 of the boot process. To do this, add the following options (replacing `UUID-OF-SDA2` with the actual UUID of the encrypted partition `/dev/sda2`. -- You can find it using `lsblk -f` or `sudo blkid -s UUID /dev/sda2`.)

``` nix
    boot = {
      loader = {
        efi.canTouchEfiVariables = true;
        grub = {
          enable = true;
          device = "nodev";
          efiSupport = true;
        };
      };
      initrd.luks.devices.cryptroot.device = "/dev/disk/by-uuid/UUID-OF-SDA2";
    };
```

With `initrd.luks.devices.cryptroot.device = "/dev/disk/by-uuid/UUID-OF-SDA2";`, the initrd knows it must unlock `/dev/sda2` before activating LVM and proceeding with the boot process.

## Unattended Boot via USB

Sometimes it is necessary to boot a system without needing a keyboard and monitor. You will create a secret key, add it to a key slot and put it onto a USB stick.

``` bash
dd if=/dev/random of=hdd.key bs=4096 count=1
cryptsetup luksAddKey /dev/sda1 ./hdd.key
```

You can enable fallback to password (in case the USB stick is lost or corrupted) by setting the `boot.initrd.luks.devices.`<name>`.fallbackToPassword` option to `true`. By default, this option is `false` so you will have to perform a manual recovery if the USB stick becomes unavailable (which you may prefer, depending on your use case).

### Option 1: Write key onto the start of the stick

This will make the USB stick unusable for any other operations than being used for decryption. Write the key onto the stick:

``` bash
dd if=hdd.key of=/dev/sdb
```

Then add the following configuration to your `configuration.nix`:

``` nix
{
  "..."

  # Needed to find the USB device during initrd stage
  boot.initrd.kernelModules = [ "usb_storage" ]; 

  boot.initrd.luks.devices = {
      luksroot = {
         device = "/dev/disk/by-id/<disk-name>-part2";
         allowDiscards = true;
         keyFileSize = 4096;
         # pinning to /dev/disk/by-id/usbkey works
         keyFile = "/dev/sdb";
         # optionally enable fallback to password in case USB is lost
         fallbackToPassword = true;
      };
  };
}
```

### Option 2: Copy Key as file onto a vfat USB stick

If you want to use your stick for other stuff or it already has other keys on it you can use the following method by Tzanko Matev. Add this to your `configuration.nix`:

``` nix
let
  PRIMARYUSBID = "b501f1b9-7714-472c-988f-3c997f146a17";
  BACKUPUSBID = "b501f1b9-7714-472c-988f-3c997f146a18";
in {

  "..."

  # Kernel modules needed for mounting USB VFAT devices in initrd stage
  boot.initrd.kernelModules = ["uas" "usbcore" "usb_storage" "vfat" "nls_cp437" "nls_iso8859_1"];

  # Mount USB key before trying to decrypt root filesystem
  boot.initrd.postDeviceCommands = pkgs.lib.mkBefore ''
    mkdir -m 0755 -p /key
    sleep 2 # To make sure the USB key has been loaded
    mount -n -t vfat -o ro `findfs UUID=${PRIMARYUSBID}` /key || mount -n -t vfat -o ro `findfs UUID=${BACKUPUSBID}` /key
  '';

  boot.initrd.luks.devices."crypted" = {
    keyFile = "/key/keyfile";
    preLVM = false; # If this is true the decryption is attempted before the postDeviceCommands can run
  };
}
```

## Unattended Boot via keyfile

A simpler but insecure option for unattended boots is to copy the keyfile into the initrd itself.

First move the key to a safe location.

``` bash
mkdir /var/lib/secrets
chown root:root /var/lib/secrets
chmod 700 /var/lib/secrets
mv -v hdd.key /var/lib/secrets/
chmod 600 /var/lib/secrets/hdd.key
```

Then add the key to the initrd.

``` nix
let
  keyFile = "hdd.key";
in
{
  boot.initrd.luks.devices."root" = {
    device = "/dev/disk/by-uuid/<uuid>";
    keyFile = "/${keyFile}";
  };
  boot.initrd.secrets = { "/${keyFile}" = /var/lib/secrets/${keyFile}; };
}
```

## Store key on FIDO2 device or TPM

Unattended boot can also happen with a FIDO2 device (e.g. Yubikey) or TPM. This cannot be performed in a fully declarative way because every such security device is unique; some manual running of `systemd-cryptenroll` is required.

For FIDO2, directly read the [chapter in the official manual](https://github.com/NixOS/nixpkgs/blob/7be68f763d94cdb4c809b7980647828e3274a511/nixos/doc/manual/configuration/luks-file-systems.section.md).

### TPM2

To store a key on the TPM2 module to unlock the device unattended, first find the UUID values of the encrypted LUKS devices. One way to do this is by running the `lsblk` command and seeing an output similar to:

    NAME                                          MAJ:MIN RM  SIZE RO TYPE  MOUNTPOINTS
    nvme0n1                                       259:0    0  1.8T  0 disk  
    ├─nvme0n1p1                                   259:1    0    1G  0 part  /boot
    ├─nvme0n1p2                                   259:2    0  1.8T  0 part  
    │ └─luks-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 254:1    0  1.8T  0 crypt /nix/store
    │                                                                       /
    └─nvme0n1p3                                   259:3    0    8G  0 part  
      └─luks-yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy 254:0    0  7.9G  0 crypt [SWAP]

You are looking for devices in the format of `luks-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` where `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` is replaced with an actual UUID. There may be multiple of these drives, in which case complete the following step on each device individually if unlocking via TPM2 is desired for all (in this example there are two devices due to the encrypted swap).

Run the following command but replace `YOUR-UUID` with the UUID you found in the previous step **without the `luks-` at the start**:

``` sh
sudo systemd-cryptenroll --wipe-slot=tpm2 --tpm2-device=auto /dev/disk/by-uuid/YOUR-UUID
```

Now the device should unlock without prompting you for the password. After this is working, you should add certain restrictions to your saved key using Platform Configuration Registers (PCR). All options for these can be found at the [Linux TPM PCR Registry](https://uapi-group.org/specifications/specs/linux_tpm_pcr_registry/). If using the default `systemd-boot` without <a href="Secure_Boot" class="wikilink" title="Secure Boot">Secure Boot</a>, then a standard set of options to use is `4+9+12`. This can be applied by running the above command again with `--tpm2-pcrs=4+9+12`. If your system uses secure boot with <a href="Limine" class="wikilink" title="Limine">Limine</a> you may want to use `--tpm2-pcrs=4+7+8+9` instead.

Because the TPM is attached to your computer, it provides no protection against a stolen computer when used on its own (it usually allows for setting a password, but that is it). It can only protect against a stolen drive.

# zimbatm's laptop recommendation

Let's say that you have a GPT partition with EFI enabled. You might be booting on other OSes with it. Let's say that your disk layout looks something like this:

``` text
   8        0  500107608 sda
   8        1     266240 sda1       - the EFI partition
   8        2      16384 sda2
   8        3  127388672 sda3
   8        4  371409920 sda4    - the NixOS root partition
   8        5    1024000 sda5
```

Boot the NixOS installer and partition things according to your taste. What we are then going to do is prepare sda4 with a luks encryption layer:

``` bash
# format the partition with the luks structure
cryptsetup luksFormat /dev/sda4
# open the encrypted partition and map it to /dev/mapper/cryptroot
cryptsetup luksOpen /dev/sda4 cryptroot
# format as usual
mkfs.ext4 -L nixos /dev/mapper/cryptroot
# mount
mount /dev/disk/by-label/nixos /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
```

Now keep installing as usual, nixos-generate-config should detect the right partitioning. You should have something like this in your /etc/nixos/hardware-configuration.nix:

``` nix
{ # cut
  fileSystems."/" =
    { device = "/dev/disk/by-uuid/5e7458b3-dcd2-49c6-a330-e2c779e99b66";
      fsType = "ext4";
    };

  boot.initrd.luks.devices."cryptroot".device = "/dev/disk/by-uuid/d2cb12f8-67e3-4725-86c3-0b5c7ebee3a6";

  fileSystems."/boot" =
    { device = "/dev/disk/by-uuid/863B-7B32";
      fsType = "vfat";
    };

  swapDevices = [ ];
}
```

To create a swap add the following in your /etc/nixos/configuration.nix:

``` nix
{
  swapDevices = [{device = "/swapfile"; size = 10000;}];
}
```

## Perf test

``` bash
# compare
nix-shell -p hdparm --run "hdparm -Tt /dev/mapper/cryptroot"
# with
nix-shell -p hdparm --run "hdparm -Tt /dev/sda1"
```

I had to add a few modules to initrd to make it fast. Since cryptroot is opened really early on, all the AES descryption modules should already be made available. This obviously depends on the platform that you are on.

``` nix
{
   boot.initrd.availableKernelModules = [
    "aesni_intel"
    "cryptd"
  ];
}
```

# Unlocking secondary drives

Consider the following example: a secondary hard disk `/dev/sdb` is to be LUKS-encrypted and unlocked during boot, in addition to `/dev/sda`.

Encrypt the drive and create the filesystem on it (LVM is used in this example):

``` bash
cryptsetup luksFormat --label CRYPTSTORAGE /dev/sdb
cryptsetup open /dev/sdb cryptstorage
pvcreate /dev/mapper/cryptstorage
vgcreate vg-storage /dev/mapper/cryptstorage
lvcreate -l 100%FREE -n storage vg-storage
mkfs.ext4 -L STORAGE /dev/vg-storage/storage
```

To unlock this device on boot in addition to the encrypted root filesystem, there are two options:

### Option 1: Unlock before boot using a password

Set the following in `configuration.nix` (replacing `UUID-OF-SDB` with the actual UUID of `/dev/sdb`):

``` nix
{
  boot.initrd.luks.devices.cryptstorage.device = "/dev/disk/by-uuid/UUID-OF-SDB";
}
```

During boot, a password prompt for the second drive will be displayed. Passwords previously entered are tried automatically to also unlock the second drive. This means that if you use the same passwords to encrypt both your main and secondary drives, you will only have to enter it once to unlock both.

The decrypted drive will be unlocked and made available under `/dev/mapper/cryptstorage` for mounting.

One annoyance with this approach is that reusing entered passwords only happens on the initial attempt. If you mistype the password for your main drive on the first try, you will now have to re-enter it twice, once for the main drive and again for the second drive, even if the passwords are the same.

### Option 2: Unlock after boot using crypttab and a keyfile

Alternatively, you can create a keyfile stored on your root partition to unlock the second drive just before booting completes. This can be done using the `/etc/crypttab` file (see manpage `crypttab(5)`).

First, create a keyfile for your secondary drive, store it safely and add it as a LUKS key:

``` bash
dd bs=512 count=4 if=/dev/random of=/root/mykeyfile.key iflag=fullblock
chmod 400 /root/mykeyfile.key
cryptsetup luksAddKey /dev/sdb /root/mykeyfile.key
```

Next, create `/etc/crypttab` in `configuration.nix` using the following option (replacing `UUID-OF-SDB` with the actual UUID of `/dev/sdb`):

``` nix
{
  environment.etc.crypttab.text = ''
    cryptstorage UUID=UUID-OF-SDB /root/mykeyfile.key
  '';
}
```

With this approach, the secondary drive is unlocked just before the boot process completes, without the need to enter its password.

Again, the secondary drive will be unlocked and made available under `/dev/mapper/cryptstorage` for mounting.

# Further reading

- [Installing NixOS with LUKS2, Detached LUKS Header, and A Separate Boot Partition on an USB/MicroSD Card](https://shen.hong.io/installing-nixos-with-encrypted-root-partition-and-seperate-boot-partition/)
- [Installation of NixOS with encrypted root](https://gist.github.com/martijnvermaat/76f2e24d0239470dd71050358b4d5134)
- <a href="NixOS_on_ZFS#Encrypted_ZFS" class="wikilink" title="Encryption in ZFS">Encryption in ZFS</a>
- <a href="Yubikey_based_Full_Disk_Encryption_(FDE)_on_NixOS" class="wikilink" title="Using a Yubikey as the authentication mechanism">Using a Yubikey as the authentication mechanism</a> (unattended boot and two factor boot with user password).
- Have a look at <https://wiki.archlinux.org/index.php/Disk_encryption> to see all the possible options. This wiki page is not complete.
- [Installation with encrypted /boot](https://gist.github.com/ladinu/bfebdd90a5afd45dec811296016b2a3f)
- <a href="Remote_disk_unlocking" class="wikilink" title="Using Tor and SSH to unlock your LUKS Disk over the internet">Using Tor and SSH to unlock your LUKS Disk over the internet</a>.
- <a href="Bcachefs" class="wikilink" title="Bcachefs">Bcachefs</a>, filesystem which supports native encryption
- [Automatically unlock encrypted disks using TPM2](https://discourse.nixos.org/t/full-disk-encryption-tpm2/29454/2)

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
