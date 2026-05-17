<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: LVM -->

Linux's **[Logical Volume Manager](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)) (LVM)** provides means to dynamically organize partitions. For example, partitions can be created, moved, resized and deleted regardless of fragmentation on disk.

## Basic Setup

LVM manages four basic building blocks:

Physical volume (PV)  
Unix block device node reserved for use by LVM. Examples: a disk partition, a whole disk (i.e. without a partition table), a meta device, or a loopback file.

Volume group (VG)  
Group of PVs for allocating PEs to LVs.

Logical volume (LV)  
"Virtual partition" composed of PEs inside a VG.

Physical extent (PE)  
The smallest contiguous <a href="wikipedia:Extent_(file_systems)" class="wikilink" title="extent">extent</a> (default 4 MiB) in the physical volume that can be allocated to an LV.

### Create an LV

Below are shell commands to setup a PV, a VG and an LV from scratch. LVM comes enabled by default on NixOS.

``` shell
# format the partion into a physical volume (check with pvdisplay)
pvcreate /dev/sda2
# create a new volume group named pool (check with vgdisplay)
vgcreate pool /dev/sda2
# create a new logical volume named "home" with the size of 10GB (check with lvdisplay)
# makes /dev/pool/home available
lvcreate --size 10G --name home pool
# finally, create a filesystem inside the logical volume
mkfs.ext4 /dev/pool/home
```

### Use the LV

Mount the filesystem on the logical volume by adding an entry to the NixOS option.

## Booting with special LVM Modes

LVM provides a number of special features such as creating snapshots, RAID for single LVs and much more. If you want to use these devices on bootup, the associated `dm-*` kernel module must be provided in the initrd (see for example Nixpkgs issue ). Here is a non-exhaustive list of features and the corresponding kernel module and other options to put into your NixOS configuration:

## Automated Partitioning

People have created a number of tools to automate the partitioning in NixOS:

### NixOps

NixOps can repartition Hetzner Physical Machines, see [NixOps Manual](https://nixos.org/nixops/manual/#idm140737318354032).

### Disko

<a href="Disko" class="wikilink" title="Disko">Disko</a> provides means to automatically generate the creation and configuration of logical volumes, see <https://github.com/nix-community/disko>

## See also

- [The corresponding ArchWiki page](https://wiki.archlinux.org/title/LVM)

<a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a>
