<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bcachefs -->

[Bcachefs](https://bcachefs.org) is a next-generation CoW filesystem that aims to provide features from <a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a> and <a href="ZFS" class="wikilink" title="ZFS">ZFS</a> with a cleaner codebase[^1], more stability[^2], greater speed[^3] and a GPL-compatible license. It is built upon Bcache and is mainly developed by Kent Overstreet.

## Installation

To enable filesystem support and availability of user-space utils, add following line to the system configuration

## Usage

Format and mount a single device

``` console
# bcachefs format /dev/sda
# mount -t bcachefs /dev/sda /mnt
```

Or, format and mount multiple devices

``` console
# bcachefs format /dev/sda:/dev/sdb:/dev/sdc
# mount -t bcachefs /dev/sda:/dev/sdb:/dev/sdc
```

The same works with partitions, which is probably better for future proofing depending on your specific needs

``` console
# bcachefs format /dev/sda1:/dev/sdb2:/dev/sdc3
# mount -t bcachefs /dev/sda1:/dev/sdb2:/dev/sdc3
```

Format drive with encryption enabled, unlock and mount it afterwards. Following bcachefs commands will ask for a password:

``` console
# bcachefs format --encrypted /dev/sda
# bcachefs unlock /dev/sda
# mount -t bcachefs /dev/sda /mnt
```

Format a drive with compression on by default, foreground and background (Available Compression options are `gzip`, `lz4`, and `zstd`)

``` console
# bcachefs format --compression=lz4 --background_compression=zstd /dev/sda 
# mount -t bcachefs /dev/sda
```

Format a multiple devices with storage tiers, so that reads and writes happen on the fastest disks, with data being stored on slower, bigger drives based on usage patterns

``` console
# bcachefs format \
    --label=hdd.hdd1 /dev/sdc \
    --label=hdd.hdd2 /dev/sdd \
    --label=hdd.hdd3 /dev/sde \
    --label=ssd.ssd1 /dev/sdf \
    --label=ssd.ssd2 /dev/sdg \
    --foreground_target=ssd \
    --promote_target=ssd \
    --background_target=hdd \
# mount -t bcachefs /dev/sdc:/dev/sdd:/dev/sde:/dev/sdf:/dev/sdg
```

For a better mounting experience in the previous example, use the external UUID that was printed.

``` console
# bcachefs format \
    --label=hdd.hdd1 /dev/sdc \
    --label=hdd.hdd2 /dev/sdd \
    --label=hdd.hdd3 /dev/sde \
    --label=ssd.ssd1 /dev/sdf \
    --label=ssd.ssd2 /dev/sdg \
    --foreground_target=ssd \
    --promote_target=ssd \
    --background_target=hdd \
# mount -t bcachefs UUID=<UUID>
```

Create a subvolume of a mounted bcachefs filesystem. The snapshot of the filesystem state is accessible in the directory `/mnt/snap1`.

``` console
# bcachefs subvolume snapshot /mnt /mnt/snap1
```

Filesystem check, fix errors and corruptions where a Bcachefs filesystem is on `/dev/sda`:

``` console
# bcachefs fsck /dev/sda
```

Change partition encryption password for `/dev/sda1`

``` console
# bcachefs set-passphrase /dev/sda1
```

## Configuration

Every option for the filesystem can be set by editing `/sys/fs/bcachefs/`<uuid>`/options`, for example the file `background_compression` will change the background compression scheme for background compression. These are persisted with the filesystems, so a bcachefs storage device being mounted on a different computer won't need to know what mount options to use to maintain the same compression levels.

Change encryption password for Bcachefs formatted device `/dev/sda1`

``` console
# bcachefs set-passphrase /dev/sda1
```

Enable zstd compression for device `/dev/sda1` at mount time

## Tips and tricks

### Generate bcachefs enabled installation media

Use following Nix <a href="Flakes" class="wikilink" title="Flake-expression">Flake-expression</a> to generate a ISO installation image with a bcachefs enabled kernel

The following commands will generate the iso-image which will be available in the directory `./result/iso`

``` console
# nix build .#nixosConfigurations.exampleIso.config.system.build.isoImage
```

### NixOS installation on bcachefs

Using the installation media generated above, continue the installation as usual following the [instructions of the NixOS manual](https://nixos.org/manual/nixos/stable/index.html#ch-installation).

For a UEFI installation, the partitioning needs to be adjusted as following

``` console
# parted /dev/sda -- mklabel gpt
# parted /dev/sda -- mkpart ESP fat32 1MB 512MB
# parted /dev/sda -- set 1 esp on
# parted /dev/sda -- mkpart primary 512MB 100%
```

Formatting the boot partition `/dev/sda1` and the root filesystem `/dev/sda2`

``` console
# mkfs.fat -F 32 -n boot /dev/sda1
# mkfs.bcachefs -L nixos /dev/sda2
```

Formatting and unlocking the encrypted partition would look like this

``` console
# keyctl link @u @s
# bcachefs format --label=nixos --encrypted /dev/sda2
# bcachefs unlock /dev/sda2
```

Mount filesystems. Use `lsblk -o +uuid,fsType | grep bcachefs` to get bcachefs partition uuid.

``` console
# mount /dev/disk/by-uuid/<...> /mnt
# mkdir /mnt/boot
# mount /dev/disk/by-label/boot /mnt/boot
```

Continue installation as recommended by the [NixOS manual](https://nixos.org/manual/nixos/stable/index.html#ch-installation).

### Remote encrypted disk unlocking

See article on <a href="Remote_disk_unlocking#Bcachefs_unlocking" class="wikilink" title="remote disk unlocking">remote disk unlocking</a> for a guide on how to enable SSH decryption of Bcachefs enabled systems.

### Automatically mount encrypted device on boot

Since the Bcachefs mount options do [not support supplying a key file yet](https://github.com/koverstreet/bcachefs-tools/pull/266), we could use the `bcachefs unlock` command and run it on boot using a <a href="Systemd" class="wikilink" title="Systemd">Systemd</a> unit:

``` nix
fileSystems."/mnt" = {
  device = "/dev/disk/by-uuid/3c0d7d93-3293-49a3-842e-d9ef77576d97";
  fsType = "bcachefs";
  options = [ "nofail" ];
};

# Ensure to match the correct systemd unit name which gets created by NixOS
# in the first place. We override the script part.
systemd.services."unlock-bcachefs-mnt" = {
  serviceConfig.LoadCredential = [ "bcachefs-mnt:/etc/secret.key" ];
  script = lib.mkForce ''
    ${lib.getExe' pkgs.keyutils "keyctl"} link @u @s
    ${config.boot.initrd.systemd.package}/bin/systemd-ask-password --credential=bcachefs-mnt --timeout=0 "enter passphrase for /mnt" | \
      exec ${lib.getExe pkgs.bcachefs-tools} unlock \
      "/dev/disk/by-uuid/3c0d7d93-3293-49a3-842e-d9ef77576d97"
  '';
};
```

This example unit unlocks the Bcachefs encrypted partition `/dev/disk/by-uuid/3c0d7d93-3293-49a3-842e-d9ef77576d97` whereas the fstab entry mounts it to the target `/mnt` by using the key file `/etc/secret.key`. Ensure that you replace all disk uuid and target file path occurences.

<a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a>

[^1]: citation needed

[^2]:

[^3]:
