<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Btrfs -->

[btrfs](https://btrfs.readthedocs.io/en/latest/) is a modern copy on write (CoW) filesystem for Linux aimed at implementing advanced features while also focusing on fault tolerance, repair and easy administration.

# Installation of NixOS on btrfs

## Partition the disk

``` console
# printf "label: gpt\n,550M,U\n,,L\n" | sfdisk /dev/sdX
```

## Format partitions and create subvolumes

``` console
# nix-shell -p btrfs-progs
# mkfs.fat -F 32 /dev/sdX1

# mkfs.btrfs /dev/sdX2
# mkdir -p /mnt
# mount /dev/sdX2 /mnt
# btrfs subvolume create /mnt/root
# btrfs subvolume create /mnt/home
# btrfs subvolume create /mnt/nix
# umount /mnt
```

## Mount the partitions and subvolumes

``` console
# mount -o compress=zstd,subvol=root /dev/sdX2 /mnt
# mkdir /mnt/{home,nix}
# mount -o compress=zstd,subvol=home /dev/sdX2 /mnt/home
# mount -o compress=zstd,noatime,subvol=nix /dev/sdX2 /mnt/nix

# mkdir /mnt/boot
# mount /dev/sdX1 /mnt/boot
```

## Install NixOS

``` console
# nixos-generate-config --root /mnt
# nano /mnt/etc/nixos/configuration.nix # manually add mount options (see Compression below for an example)
# nixos-install
```

# Configuration

## Compression

`nixos-generate-config` doesn't detect mount options automatically. To enable compression, you must specify them manually and other mount options in your `configuration.nix`:

Btrfs supports a few compression algorithms, each with different trade-offs:

- `zstd`: Good compression ratio and performance, especially for general-purpose workloads. You can specify compression levels, as example `compress=zstd:3`.

<!-- -->

- `lzo`: Faster but provides lower compression ratios. Good for low powered systems or where performance is important.

<!-- -->

- `zlib`: Higher compression ratio but slower performance. Less commonly used nowadays in favor of zstd.

You can find more details on the official [Btrfs Compression Documentation](https://btrfs.readthedocs.io/en/latest/Compression.html).

## Swap file

Creating a separate subvolume for the swap file is optional. It is not required for functionality but can help with organization or snapshot management. Be sure to regenerate your `hardware-configuration.nix` if you choose to do this.

``` console
# mkdir -p /mnt
# mount /dev/sdXY /mnt
# btrfs subvolume create /mnt/swap
# umount /mnt
# mkdir /swap
# mount -o noatime,subvol=swap /dev/sdXY /swap
# nixos-generate-config
```

Finally, define a swap file in your configuration and run `nixos-rebuild switch`:

NixOS will automatically create the swap file with the appropriate attributes for Btrfs including disabling copy on write.

For more NixOS swap configuration options, see <a href="Swap" class="wikilink" title="Swap">Swap</a>. Additonal Btrfs swapfile usage can be found at [the Btrfs docs](https://btrfs.readthedocs.io/en/latest/Swapfile.html).

## Scrubbing

Btrfs filesystems by default keep checksums for all files, to monitor if the file has changed due to hardware malfunctions or other external effects.

Scrubbing is the process of checking file consistency, which may use checksums and/or duplicated copies of data, from raid for example. Scrubbing may be done "online", meaning you don't need to unmount a subvolume to scrub it.

You can enable automatic scrubbing withː

``` nix
services.btrfs.autoScrub.enable = true;
```

Automatic scrubbing by default is performed once a month, but you can change that withː

``` nix
services.btrfs.autoScrub.interval = "weekly";
```

`interval` syntax is defined by [systemd.timer's Calendar Events](https://www.freedesktop.org/software/systemd/man/systemd.time.html#Calendar%20Events)

By default, autoscrub will scrub all detected btrfs mount points. However, in case of mounted nested subvolumes (e.g. the example above where `/nix` and `/home` are nested subvolumes under `/`), you only need to scrub the topmost one. So an example configuration may look like this:

``` nix
services.btrfs.autoScrub = {
  enable = true;
  interval = "monthly";
  fileSystems = [ "/" ];
};
```

The result of the periodic auto scrub will be saved to the system journal, and you can check the status of the last scrubː

``` bash
btrfs scrub status /
```

You can also start a scrub in the background manuallyː

``` bash
btrfs scrub start /
```

You can check the status of the ongoing scrubbing process with the same `status` command as above.

## Deduplication

Files with (partially) equal contents can be deduplicated using [bees](https://github.com/Zygo/bees) or [duperemove](https://github.com/markfasheh/duperemove). The [upstream wiki entry](https://btrfs.readthedocs.io/en/latest/Deduplication.html) on deduplication provides an overview of available features of these programs.

bees can be configured in `configuration.nix`:

``` nix
services.beesd.filesystems = {
  root = {
    spec = "LABEL=root";
    hashTableSizeMB = 2048;
    verbosity = "crit";
    extraOptions = [ "--loadavg-target" "5.0" ];
  };
};
```

This will run the daemon in the background. To disable auto-start, use `systemd.services."beesd@root".wantedBy = lib.mkForce [ ];` for each filesystem.

# Usage

## Subvolumes

To display all subvolumes within a mounted btrfs filesystem:

``` bash
btrfs subvolume list -t /mnt
```

To create a new subvolume at a specified location:

``` bash
btrfs subvolume create /mnt/nixos
```

To remove an existing subvolume:

``` bash
btrfs subvolume delete /mnt/nixos
```

### Top-level vs nested subvolumes

In btrfs, subvolumes can be created either at the top level of the filesystem or within other subvolumes.

- Top-level subvolumes are created directly under the filesystem's root. By default, the root volume ID is 5. Top-level subvolumes are easier to snapshot, roll back or destroy independently. This is good for things such as `/home` or `/nix`.

<!-- -->

- Nested subvolumes are created inside an existing subvolume or directory within the filesystem. All nested subvolumes inherit the mount status of their parent unless mounted separately. This layout is useful for organizing related subvolumes under a common namespace. For example, a top-level subvolume such as `/srv/nfs` can contain multiple nested subvolumes like `/srv/nfs/export1` and `/srv/nfs/export2`.

## Snapshots

A snapshot in btrfs is simply a subvolume that shares its data (and metadata) with some other subvolume, using btrfs's CoW capabilities. Because of that, there is no special location for snapshots and you can decide where you want to store them. It can be a simple directory inside the root subvolume, or a directory inside a dedicated "snapshots" subvolume.

For this example we are going to store snapshots in a directory `/snapshots`, that has to be created beforehand with `sudo mkdir /snapshots`

To take a read-only (`-r`) snapshot called `home_snapshot_202302` of the subvolume mounted at `/home`

``` bash
btrfs subvolume snapshot -r /home /snapshots/home_snapshot_202302
```

You can also snapshot the root subvolume. But keep in mind that nested subvolumes are **not** part of a snapshot. So if you have subvolumes `/nix /home`, taking a snapshot of `/` will not include them.

``` bash
btrfs subvolume snapshot -r / /snapshots/nixos_snapshot_202302
```

Make snapshot read-write againː

``` bash
btrfs property set -ts /snapshots/home_snapshot_202302 ro false
```

However, changing read-only property of a snapshot in-place may \[//lore.kernel.org/linux-btrfs/06e92a0b-e71b-eb21-edb5-9d2a5513b718@gmail.com/ causes issues\] with any future incremental send/receive. Instead, a read-only snapshot itself (being a simple subvolume) can be snapshotted again as a read-write snapshot like this:

``` bash
btrfs subvolume snapshot /snapshots/home_snapshot_202302 /snapshots/home_snapshot_202302_rw
```

Or it can be restored directly to `/home` straight away like this:

``` bash
btrfs subvolume delete /home
btrfs subvolume snapshot /snapshots/home_snapshot_202302 /home
```

After this you can mount `/home` again.

## Transfer snapshot

Sending the snapshot `/snapshots/nixos_snapshot_202302` compressed to a remote host via ssh at `root@192.168.178.110` and saving it to a subvolume mounted on a directory at `/mnt/nixos`

``` bash
sudo btrfs send /snapshots/nixos_snapshot_202302 | zstd | ssh root@192.168.178.110 'zstd -d | btrfs receive /mnt/nixos'
```

If both the sender and receiver side have Btrfs with the same compression algorithm and level, you can instead use `send --compressed-data` to avoid decompressing and recompressing the data.

# Tips and tricks

## Backup

<a href="Btrbk" class="wikilink" title="Btrbk">Btrbk</a> is a tool for creating snapshots and remote backups of btrfs subvolumes.

## Installation with encryption

Using [Luks2](https://en.wikipedia.org/wiki/Linux_Unified_Key_Setup):

``` bash
cryptsetup --verify-passphrase -v luksFormat "$DISK"p2 

cryptsetup open "$DISK"p2 enc
```

You can use any device partition for your bootloader. Note that this bootloader is unencrypted by default:

`mkfs.vfat -n BOOT "$DISK"p1`

### Creating subvolumes

``` bash
mkfs.btrfs /dev/mapper/enc # Creating btrfs partition

mount -t btrfs /dev/mapper/enc /mnt

# Create the subvolumes 

btrfs subvolume create /mnt/root # The subvolume for /

btrfs subvolume create /mnt/home # The subvolume for /home, which should be backed up

btrfs subvolume create /mnt/nix # The subvolume for /nix, which needs to be persistent but is not worth backing up, as it’s trivial to reconstruct

btrfs subvolume create /mnt/log # The subvolume for /var/log.
```

Unmount to mount on the subvolumes for the next steps:

`umount /mnt`

Once the subvolumes have been created, mount them with the desired options.

Example with [Zstandard compression](https://facebook.github.io/zstd/) and noatime:

``` bash
mount -o subvol=root,compress=zstd,noatime /dev/mapper/enc /mnt 

mkdir /mnt/home

mount -o subvol=home,compress=zstd,noatime /dev/mapper/enc /mnt/home

mkdir /mnt/nix

mount -o subvol=nix,compress=zstd,noatime /dev/mapper/enc /mnt/nix

mkdir -p /mnt/var/log

mount -o subvol=log,compress=zstd,noatime /dev/mapper/enc /mnt/var/log

# do not forget to create and mount the bootloader

mkdir /mnt/boot

mount "$DISK"p1 /mnt/boot
```

Configure `hardware-configuration.nix`

``` nix
 # enable btrfs support
 boot.supportedFilesystems = [ "btrfs" ];

 fileSystems."/var/log" =
    { device = "/dev/disk/by-uuid/X";
      fsType = "btrfs";
      # enable noatime and zstd to the other subvolumes aswell
      options = [ "subvol=log" "compress=zstd" "noatime" ];
      # to have a correct log order
      neededForBoot = true;
    };
```

Generate Nixconfig:

``` bash
nixos-generate-config --root /mnt
```

## Convert Ext3/Ext4 system partition to Btrfs

To convert the existing filesystem (Ext3/4) to Btrfs, boot into a NixOS live system and run the following commandː

``` sh
fsck -f /dev/sdXY
btrfs-convert /dev/sdXY
```

Replace the device path with the target partition. Converting larger filesystems can take a long time.

Next, mount the converted filesystem and chroot into itː

``` sh
mount /dev/sdXY /mnt
nixos-enter --root /mnt
```

Replace the partition UUID with the new one, which can be obtained using the command `blkid`, in `/etc/nixos/hardware-configuration.nix` and also change the filesystem to `btrfs`.

``` nix
  fileSystems."/" =
    { device = "/dev/disk/by-uuid/44444444-4444-4444-8888-888888888888";
      fsType = "btrfs";
    };
```

Apply the changes

``` sh
nixos-rebuild boot
```

If the Grub bootloader is used and it doesn't get reinstalled correctly, you can run the following command inside chrootː

``` sh
grub-install /dev/sdX
```

If the conversion was successful and no rollback is required, the backup image which was stored by btrfs-convert can be removed withː

``` sh
btrfs subvolume delete /btrfs/ext2_saved
```

### TRIM support

Refer to [btrfs docs](https://btrfs.readthedocs.io/en/latest/Trim.html) on how Trim works with btrfs through the `discard` mount option.

<a href="Category:_Configuration" class="wikilink" title="Category: Configuration">Category: Configuration</a> <a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a>
