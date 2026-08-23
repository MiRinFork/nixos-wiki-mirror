<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Swap -->

Swap allows "cold" pages of virtual memory to be stored in places other than directly in the physical RAM, effectively allowing more pages to be stored. This can be accomplished by using space on disk, such as <a href="#Swap_file" class="wikilink" title="swap file">swap file</a> or <a href="#Swap_partition" class="wikilink" title="swap partition">swap partition</a>, or through compression based methods like <a href="#Zram_swap" class="wikilink" title="zram">zram</a>. Additionally, <a href="#Zswap_swap_cache" class="wikilink" title="zswap">zswap</a> can act as a RAM-based compressed cache sitting in front of a traditional disk-based swap device.

# Configuration

The following sections describe how to configure and manage swap on NixOS.

To check your current swap setup and usage, you can use the following command: `swapon --show`

## Swap file

A swap file provides swap space using a regular file on your filesystem, offering greater flexibility compared to a dedicated swap partition.

To add a swap file in NixOS, add the following:

This will create a 16GB swapfile at `/var/lib/swapfile`. The `size` value \[<https://search.nixos.org/options?show=swapDevices>.\*.size is specified in mebibytes\]. This will cause a swap file to be generated and an entry to be set up in `/etc/fstab`.

## Swap partition

Swap partitions are typically created during the initial disk partitioning phase of a NixOS installation. For instructions on creating swap partitions, see the relevant NixOS manual sections for [UEFI](https://nixos.org/manual/nixos/stable/#sec-installation-manual-partitioning-UEFI)/[MBR](https://nixos.org/manual/nixos/stable/#sec-installation-manual-partitioning-MBR) partition schemes and [formatting](https://nixos.org/manual/nixos/stable/#sec-installation-manual-partitioning-formatting).

Swap partitions can be defined in `configuration.nix` like above or (if GPT) be automatically discovered by `systemd-gpt-auto-generator(8)`. Using the former allows you to have some control over swap mounting options and to enable features such as encrypted swap.

## Zram vs Zswap

As both are doing a similar thing, you are supposed to pick only one (https://linuxreviews.org/Zram#zram_and_zswap)

Here is an over-simple summary:

- If you have no swap, use zram
- If you have swap, use zswap

Here some good related articles:

- <https://chrisdown.name/2026/03/24/zswap-vs-zram-when-to-use-what.html>
- <https://askubuntu.com/questions/471912/zram-vs-zswap-vs-zcache-ultimate-guide-when-to-use-which-one>

## Zram swap

Zram is a kernel module for creating a compressed block device in RAM.

It is an alternative or complementary approach to swap disks, suitable for systems with enough RAM. In the event the system needs to swap it will move uncompressed RAM contents into the compressed area, saving RAM space while effectively increasing the available RAM at the cost of computational power for compression and decompression.

See [zramSwap](https://search.nixos.org/options?query=zramSwap) for a full list of available options and their descriptions.

### Zram writeback

Zram supports writeback functionality, allowing idle or incompressible pages to be moved to a backing storage device rather than keeping it in memory. Currently, writeback can only use block storage devices (such as partitions) and does not support swap files. The backing partition must be manually created first, but does not require formatting.

An example configuration:

To verify the block storage device is being used:

``` bash
cat /sys/block/zram0/backing_dev
```

If you see an error entry like

    Jul 08 17:14:50 COMPUTER zram-generator[3056]: Error: Failed to configure write-back device into /sys/block/zram0/backing_dev
    Jul 08 17:14:50 COMPUTER zram-generator[3056]: Caused by:
    Jul 08 17:14:50 COMPUTER zram-generator[3056]:     Device or resource busy (os error 16)

This is probably because the writeback device has already been mounted elsewhere (e.g. as swap). To avoid this you need to do as the <a href="#Disable_swap" class="wikilink" title="#Disable swap">#Disable swap</a> section says and make sure your writeback device is not being mounted as swap (this can happen due to `systemd-gpt-auto-generator(8)`). Do note that zram writeback does *not* respect the swap on-disk format and will destroy your existing swap header.

## Zswap swap cache

[Zswap](https://docs.kernel.org/admin-guide/mm/zswap.html) is a compressed RAM cache for swap pages. It acts as a middle layer between system memory and a traditional disk-based swap device, storing compressed pages in RAM before optionally writing them out to disk-based swap if necessary. Because zswap integrates directly into the kernel's memory management subsystem, it automatically and dynamically evicts the coldest pages to your backing disk when memory pressure rises. This graceful degradation provides a significant architectural advantage over zram for systems that have physical disk swap.

Unlike zram, zswap requires a disk-based swap device or file to back it.

Zswap is controlled by kernel parameters and can be enabled in your NixOS configuration by using the options.

You can verify zswap's runtime status via `cat /sys/module/zswap/parameters/enabled` and inspect usage statistics with `# grep -r . /sys/kernel/debug/zswap/`

## Disable swap

To remove all swap devices from NixOS, set the following to remove the swap partition or file from being included in `/etc/fstab`.

``` nix
swapDevices = lib.mkForce [ ];
```

If you are using GPT partitioning tables, `systemd-gpt-auto-generator(8)` will still mount your swap partition automatically. You must therefore turn on attribute 63 ("no-auto") on *each* swap partition partition in the partition table. This can be done with gptfdisk or similar:

``` console
gdisk /dev/sda
x
a
<partition number>
63
<enter>
w
```

Alternatively, `systemd-gpt-auto-generator(8)` for swap can be disabled globally through a kernel cmdline `systemd.swap=0`:

``` nix
boot.kernelParams = [ "systemd.swap=0" ];
```

# Tips and Tricks

## Mount options

### discard

Solid state drives have fast random access times, which make them great for swap if you ignore the limited lifespan. Enabling TRIM (discard) on the swap files can help avoid unnecessary copy actions on the SSD, reducing wear and potentially helping increase performance.

``` nix
swapDevices = [{
  device = "/dev/sdXY";
  options = [ "discard" ]; # equivalent to swapon --discard
}];
```

A lower-impact option is `"discard=once"`, which runs discard exactly once when the swap is enabled, but does not continually issue discard commands as pages are being overwritten. This could make more sense depending on your hardware.

`systemd-gpt-auto-generator(8)` does not automatically enable `discard`. Also, never enable `discard` on mdadm RAID setups, as ArchWiki reports that it causes lockup.

## Encrypt swap with random key

Because data from memory is evicted into swap, any secret data in memory can also end up in swap. Because the disks backing the swap is often nonvolatile (data is not lost after power cut), this can represent another way for data to end up in the wrong hands if you computer is seized.

By encrypting the swap with a random key kept in memory, we make sure that the contents of the swap become unreadable as soon as the data in memory has been lost. NixOS contains a handy helper to help you do this, generating a new key on each boot:

``` nix
swapDevices = [{
  device = "/dev/disk/by-partuuid/aaaaaaaaa-bbbb-cccc-dddd-0123456789ab";
  randomEncryption.enable = true; 
}];
```

The selected device will have all its content made unusable at every boot. Using a partuuid or partlabel is recommended because it is less subject to change when the overall partition scheme changes.

If you want to use TRIM, set `randomEncryption.allowDiscards` in addition to the `options`. This has the security implication of:

- telling whoever gets ahold of your swap drive which parts are being actually used (bad),
- telling your SSD to not give out the data in unused parts and to not try to keep them around during garbage collection (good).

You will need to weigh between the two.

**Warning:** On some NixOS versions, if `randomEncryption.enable = true` and the `swap` is a file (rather than a partition) located on an encrypted LUKS partition, [the system can freeze as soon as the swap is used.](https://discourse.nixos.org/t/swap-file-on-luks-partition/72234)

Using a random key makes hibernation impossible. If you want to use hibernation, use a regular <a href="Full_Disk_Encryption" class="wikilink" title="Full Disk Encryption">Full Disk Encryption</a> with a fixed key. Alternatively, you can encrypt the swap partition separately:

## Encrypt swap partition with password or fixed key

If you prefer to encrypt the swap partition individually, first create an unformatted partition of the desired size, for example using `gparted`. In the following, the partition is `/dev/sdXY`. Then

``` bash
sudo cryptsetup luksFormat /dev/sdXY --label lb_luks_swap
sudo cryptsetup luksOpen /dev/disk/by-label/lb_luks_swap swap
sudo mkswap /dev/mapper/swap -L lb_swap
```

When asked, provide a password for unlocking the partition.

This will create

- a LUKS container on the unformatted partition with label `lb_luks_swap`
- open it and mount it under `/dev/mapper/swap`,
- format it as swap with label `lb_swap`.

If all is correct, block devices should look similar to:

``` bash
$ lsblk -o +LABEL
...
└─sdaXY      259:16   0   128G  0 part                 lb_luks_swap
  └─lb_swap  254:0    0   128G  0 crypt [SWAP]         lb_swap
...
```

To tell NixOS to use this partition for swap, add to `hardware-configuration.nix`:

``` nix
swapDevices = [{
  device = "/dev/disk/by-label/lb_swap";
  encrypted = {
    enable = true;
    label = "swap";
    blkDev = "/dev/disk/by-label/lb_luks_swap";
  };
}];
```

This automatically adds the swap partition to `boot.initrd.luks.devices` so that `initrd` will ask for a password on reboot. initrd will automatically try to use the same password on any other LUKS volumes listed in `boot.initrd.luks.devices`. Therefore if you use the same password for other volumes you will only have to type it once. If all went well, the swap partition should be mapped at `/mapper/swap` and `/dev/disk/by-id/lb_swap`.

It is also possible to specify a key file using the `--key-file` argument to `luksFormat` and `luksOpen`. Be aware that the system needs access to this file during boot, so if the key itself is stored on an encrypted volume, it may be tricky to get the unlock sequencing right.

## Adjusting swap usage behaviour

[Swappiness](https://docs.kernel.org/admin-guide/sysctl/vm.html#swappiness) controls how aggressively swap space is used, specifically how to free up memory when needed. By default, Linux uses a swappiness value of 60. Higher values will make the kernel prefer swapping out idle processes over dropping caches. Conversely lower values will try to avoid swapping as much as possible, keeping processes in RAM unless absolutely necessary. An optimal value is workload dependent and will require experimentation.

You can see your current swappiness level by `cat /proc/sys/vm/swappiness`. The lowest accepted value is 0 while the maximum value is 200. The lowest sane value is 1 (0 causes the system to not scan for unused anonymous pages, i.e. memory freed by processes, at all).

For more on tuning the swap, start with [ArchWiki](https://wiki.archlinux.org/title/Swap#Swappiness)'s description.

## ZFS and swap

OpenZFS does not support swap files on a ZFS dataset. Swap on zvols is technically supported, but does not support resume from hibernation and can lead to system lockup in high memory pressure situation and is thus not recommended (see [OpenZFS issue \#7734](https://github.com/openzfs/zfs/issues/7734) and the [arch wiki on Swap Volumes in ZFS](https://wiki.archlinux.org/title/ZFS#Swap_volume)).

Instead, you should set up a swap partition or swap file on a non-ZFS filesystem.[^1]

## Using swap files on Btrfs

For Btrfs file system-specific considerations, see the <a href="Btrfs#Swap_file" class="wikilink" title="Btrfs swap file section">Btrfs swap file section</a>.

## Swapspace

[Swapspace](https://github.com/Tookmund/Swapspace) is a dynamic swap space manager for GNU/Linux. i.e. it allows unused disk space to be utilised as swap to handle the occasional memory-intensive task, and frees the disk space once done.

Enable it via `services.swapspace.enable = true;` in your nixos configuration. And after switching, check that `systemctl status swapspace.service` is green, that's all, swapspace will auto manage swap for you.

See all the options it supports here, [search.nixos.org](https://search.nixos.org/options?query=swapspace)

You can also use zramSwap along with this service.

See your active swap partitions/files with `swapon`. For eg.

``` console
# Read the WARNING above, and adjust 2, 20GB according to your free space
$ # nix shell nixpkgs#stress.out -c stress --vm 2 --vm-bytes 20G
$ swapon
NAME                 TYPE       SIZE  USED PRIO
/dev/zram0           partition 13.8G  2.6G    5
/var/lib/swapspace/1 file       5.2G 59.2M   -2
/var/lib/swapspace/2 file       6.1G 56.4M   -3
```

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>

[^1]: <https://utcc.utoronto.ca/~cks/space/blog/solaris/ZFSForSwapMyViews>
