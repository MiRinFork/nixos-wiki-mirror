<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ZFS -->

[](https://zfsonlinux.org/) (<a href="wikipedia:en:{{PAGENAME}}" class="wikilink" title="wikipedia:en:{{PAGENAME}}">wikipedia:en:{{PAGENAME}}</a>), also known as [OpenZFS](https://openzfs.org/) (<a href="wikipedia:en:OpenZFS" class="wikilink" title="wikipedia:en:OpenZFS">wikipedia:en:OpenZFS</a>), is a modern filesystem which is well supported on <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>. <a href="category:filesystem" class="wikilink" title="category:filesystem">category:filesystem</a> Besides the package (*ZFS Filesystem Linux Kernel module*) itself, there are many packages in the ZFS ecosystem available.

ZFS integrates into NixOS via the and options.

## Limitations

#### Latest Kernel compatible with ZFS

ZFS often does not support the latest Kernel versions. It is recommended to use an LTS Kernel version whenever possible; the NixOS default Kernel is generally suitable. See <a href="Linux_kernel" class="wikilink" title="Linux Kernel">Linux Kernel</a> for more information about configuring a specific Kernel version.

If your config specifies a Kernel version that is not officially supported by upstream ZFS, the ZFS module will fail to evaluate with an error that the ZFS package is "broken". Upstream ZFS changed in 2.3 to refuse to build by default, regardless of Nixpkgs’ broken marking (or ignoring).

##### Selecting the latest ZFS-compatible Kernel

To use the latest ZFS-compatible Kernel currently available, the following configuration may be used.

``` nix
{
  config,
  lib,
  pkgs,
  ...
}:

let
  zfsCompatibleKernelPackages = lib.filterAttrs (
    name: kernelPackages:
    (builtins.match "linux_[0-9]+_[0-9]+" name) != null
    && (builtins.tryEval kernelPackages).success
    && (!kernelPackages.${config.boot.zfs.package.kernelModuleAttribute}.meta.broken)
  ) pkgs.linuxKernel.packages;
  latestKernelPackage = lib.last (
    lib.sort (a: b: (lib.versionOlder a.kernel.version b.kernel.version)) (
      builtins.attrValues zfsCompatibleKernelPackages
    )
  );
in
{
  # Note this might jump back and forth as kernels are added or removed.
  boot.kernelPackages = latestKernelPackage;
}
```

##### Using unstable, pre-release ZFS

In some cases, a pre-release version of ZFS may be available that supports a newer Kernel. Use it with `boot.zfs.package = pkgs.zfs_unstable;`. Using zfs_unstable may allow the use of an unsupported Kernel; as warned above, [upstream considers this experimental](https://github.com/openzfs/zfs/blob/6a2f7b38442b42f4bc9a848f8de10fc792ce8d76/config/kernel.m4#L473-L487).

#### Partial support for swap on ZFS

ZFS does not support swapfiles. swap devices can be used instead. Additionally, hibernation is disabled by default due to a [high risk](https://github.com/NixOS/nixpkgs/pull/208037) of data corruption. Note that even if that pull request is merged, it does not fully mitigate the risk. If you wish to enable hibernation regardless and made sure that swapfiles on ZFS are not used, set `boot.zfs.allowHibernation = true`.

#### Zpool not found

If NixOS fails to import the zpool on reboot, you may need to add

``` nix
boot.zfs.devNodes = "/dev/disk/by-path";
```

or

``` nix
boot.zfs.devNodes = "/dev/disk/by-partuuid";
```

to your configuration.nix file.

The differences can be tested by running `zpool import -d /dev/disk/by-id` when none of the pools are discovered, eg. a live iso.

#### ZFS conflicting with systemd

ZFS will manage mounting non-legacy ZFS filesystems, but NixOS tries to manage mounting with systemd. ZFS native mountpoints are not managed as part of the system configuration (but better support hibernation with a separate swap partition). This can lead to conflicts if the ZFS mount service is also enabled for the same datasets.

Disable the mount service with `systemd.services.zfs-mount.enable = false;` or remove the `fileSystems` entries in hardware-configuration.nix. Otherwise, use legacy mountpoints (created with e.g. `zfs create -o mountpoint=legacy`). Mountpoints must be specified with `fileSystems."/mount/point" = {};` or with `nixos-generate-config`.

#### Nix builds and ZFS properties like normalization or utf8only

These options are often suggested in guides to setting up ZFS. `normalization` makes filenames compare the same in cases where there exists more than one UTF8 bytestring that represents the same characters. `utf8only` prevents the creation of files with non-UTF8 filenames, e.g. filenames using a Latin1 character set. These are non-POSIX and will make the tests for certain packages fail, which may interfere with builds. After nix 2.30, builds no longer happen in /tmp by default, instead they happen in `/nix/var/nix/builds`. On any system where you plan to run nix builds, you should ensure that this filesystem is POSIX-compliant. Either mounting a tmpfs in that directory (if you have lots of RAM + swap) or creating a zfs dataset there which does not have these or other non-POSIX settings like `noatime`, `snapdir=visible`, `acltype=nfsv4`, or `caseinsensitivity=insensitive`. Many of these cannot be changed after dataset creation so if this is your root filesystem, you will need to restore from a backup in order to recreate them.

## Guides

### Root on ZFS with disko

disko[1](https://github.com/nix-community/disko/blob/master/example/zfs.nix) can partition disks declaratively and handle mount points at install time.

Don't follow the Root on ZFS guide found in OpenZFS documentation. It was abandoned and has not been updated in years. See commit log for the openzfs-docs repo for details.

### Simple NixOS ZFS on root installation

Start from here in the NixOS manual: [2](https://nixos.org/manual/nixos/stable/#sec-installation-manual). Under manual partitioning [3](https://nixos.org/manual/nixos/stable/#sec-installation-manual-partitioning) do this instead:

#### Partition the disk

We need the following partitions:

- 1G for boot partition with "boot" as the partition label (also called name in some tools) and ef00 as partition code
- 4G for a swap partition with "swap" as the partition label and 8200 as partition code. We will encrypt this with a random secret on each boot.
- The rest of disk space for zfs with "root" as the partition label and 8300 as partition code (default code)

Reason for swap partition: ZFS does use a caching mechanism that is different from the normal Linux cache infrastructure. In low-memory situations, ZFS therefore might need a bit longer to free up memory from its cache. The swap partition will help with that.

Example with gdisk using `/dev/nvme0n1` as the device (use `lsblk` to find the device</code>):

``` bash
sudo gdisk /dev/nvme0n1
GPT fdisk (gdisk) version 1.0.10
...
# boot partition
Command (? for help): n
Partition number (1-128, default 1): 
First sector (2048-1000215182, default = 2048) or {+-}size{KMGTP}: 
Last sector (2048-1000215182, default = 1000215175) or {+-}size{KMGTP}: +1G
Current type is 8300 (Linux filesystem)
Hex code or GUID (L to show codes, Enter = 8300): ef00
Changed type of partition to 'EFI system partition'

# Swap partition
Command (? for help): n
Partition number (2-128, default 2): 
First sector (2099200-1000215182, default = 2099200) or {+-}size{KMGTP}: 
Last sector (2099200-1000215182, default = 1000215175) or {+-}size{KMGTP}: +4G
Current type is 8300 (Linux filesystem)
Hex code or GUID (L to show codes, Enter = 8300): 8200
Changed type of partition to 'Linux swap'

# root partition
Command (? for help): n
Partition number (3-128, default 3): 
First sector (10487808-1000215182, default = 10487808) or {+-}size{KMGTP}: 
Last sector (10487808-1000215182, default = 1000215175) or {+-}size{KMGTP}: 
Current type is 8300 (Linux filesystem)
Hex code or GUID (L to show codes, Enter = 8300): 
Changed type of partition to 'Linux filesystem'

# write changes
Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y
OK; writing new GUID partition table (GPT) to /dev/nvme0n1.
The operation has completed successfully.
```

Final partition table (`fdisk -l /dev/nvme0n1`):

``` bash
Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048         2099199   1024.0 MiB  EF00  EFI system partition
   2         2099200        10487807   4.0 GiB     8200  Linux swap
   3        10487808      1000215175   471.9 GiB   8300  Linux filesystem
```

**Let's use variables from now on for simplicity.** Get the device ID in `/dev/disk/by-id/` (using ), in our case here it is `nvme-SKHynix_HFS512GDE9X081N_FNB6N634510106K5O`

``` bash
BOOT=/dev/disk/by-id/nvme-SKHynix_HFS512GDE9X081N_FNB6N634510106K5O-part1
SWAP=/dev/disk/by-id/nvme-SKHynix_HFS512GDE9X081N_FNB6N634510106K5O-part2
DISK=/dev/disk/by-id/nvme-SKHynix_HFS512GDE9X081N_FNB6N634510106K5O-part3
```

#### Make a ZFS pool with encryption and mount points

``` bash
zpool create -O encryption=on -O keyformat=passphrase -O keylocation=prompt -O compression=zstd -O mountpoint=none -O xattr=sa -O acltype=posixacl -o ashift=12 zpool $DISK
# enter the password to decrypt the pool at boot
Enter new passphrase:
Re-enter new passphrase:

# Create datasets
zfs create zpool/root
zfs create zpool/nix
zfs create zpool/var
zfs create zpool/home

# Mount root
mkdir -p /mnt
mount -t zfs zpool/root /mnt -o zfsutil

# Mount nix, var, home
mkdir /mnt/nix /mnt/var /mnt/home
mount -t zfs zpool/nix /mnt/nix -o zfsutil
mount -t zfs zpool/var /mnt/var -o zfsutil
mount -t zfs zpool/home /mnt/home -o zfsutil
```

Output from

``` bash
zpool status
```

  

<!-- -->

    zpool status
      pool: zpool
     state: ONLINE
    ...
    config:

        NAME                               STATE     READ WRITE CKSUM
        zpool                              ONLINE       0     0     0
          nvme-eui.0025384b21406566-part2  ONLINE       0     0     0

#### Format boot partition and enable swap

``` bash
mkfs.fat -F 32 -n boot $BOOT
```

``` bash
mkswap -L swap $SWAP
swapon $SWAP
```

#### Installation

``` bash
# Mount boot
mkdir -p /mnt/boot
mount $BOOT /mnt/boot

# Generate the nixos config
nixos-generate-config --root /mnt
...
writing /mnt/etc/nixos/hardware-configuration.nix...
writing /mnt/etc/nixos/configuration.nix...
For more hardware-specific settings, see https://github.com/NixOS/nixos-hardware.
```

Now edit the configuration.nix that was just created in `/mnt/etc/nixos/configuration.nix` and make sure to have at least the following content in it.

Now check the hardware-configuration.nix in `/mnt/etc/nixos/hardware-configuration.nix` and add whats missing e.g. `options = [ "zfsutil" ]` for all filesystems except boot and `randomEncryption = true;` for the swap partition. Also change the generated swap device to the partition we created e.g. `/dev/disk/by-id/nvme-SKHynix_HFS512GDE9X081N_FNB6N634510106K5O-part2` in this case and `/dev/disk/by-id/nvme-SKHynix_HFS512GDE9X081N_FNB6N634510106K5O-part1` for boot.

Now you may install NixOS with `nixos-install`.

## Importing on boot

If you create a zpool, it will not be imported on the next boot unless you either add the zpool name to

``` nix
boot.zfs.extraPools
```

  

``` nix
## In /etc/nixos/configuration.nix:
boot.zfs.extraPools = [ "zpool_name" ];
```

or if you are using legacy mountpoints, add a

``` nix
fileSystems
```

entry and NixOS will automatically detect that the pool needs to be imported:

``` nix
## In /etc/nixos/configuration.nix:
fileSystems."/mount/point" = {
  device = "zpool_name";
  fsType = "zfs";
};
```

### Zpool created with bus-based disk names

If you used bus-based disk names in the

    zpool create

command, e.g.,

    /dev/sda

, NixOS may run into issues importing the pool if the names change. Even if the pool is able to be mounted (with

``` nix
boot.zfs.devNodes = "/dev/disk/by-partuuid";
```

set), this may manifest as a

    FAULTED

disk and a

    DEGRADED

pool reported by

    zpool status

. The fix is to re-import the pool using disk IDs:

    # zpool export zpool_name
    # zpool import -d /dev/disk/by-id zpool_name

The import setting is reflected in

``` bash
/etc/zfs/zpool.cache
```

, so it should persist through subsequent boots.

### Zpool created with disk IDs

If you used disk IDs to refer to disks in the `zpool create` command, e.g., `/dev/disk/by-id`, then NixOS may consistently fail to import the pool unless `boot.zfs.devNodes = "/dev/disk/by-id"` is also set.

## Mount datasets at boot

zfs-mount service is enabled by default on NixOS 22.05.

To automatically mount a dataset at boot, you only need to set `canmount=on` and `mountpoint=/mount/point` on the respective datasets.

## Changing the Adaptive Replacement Cache size

To change the maximum size of the ARC to (for example) 12 GB, add this to your NixOS configuration:

``` nix
boot.kernelParams = [ "zfs.zfs_arc_max=12884901888" ];
```

## Tuning other parameters

To tune other attributes of ARC, L2ARC or of ZFS itself via runtime modprobe config, add this to your NixOS configuration (keys and values are examples only!):

``` nix
    boot.extraModprobeConfig = ''
      options zfs l2arc_noprefetch=0 l2arc_write_boost=33554432 l2arc_write_max=16777216 zfs_arc_max=2147483648
    '';
```

You can confirm whether any specified configuration/tuning got applied via commands like `zarcsummary` and `zarcstat -a -s " "`.

## Automatic scrubbing

Regular scrubbing of ZFS pools is recommended and can be enabled in your NixOS configuration via:

``` nix
services.zfs.autoScrub.enable = true;
```

You can tweak the interval (defaults to once a week) and which pools should be scrubbed (defaults to all).

## Remote unlock

### Unlock encrypted ZFS via SSH on boot

In case you want unlock a machine remotely (after an update), having an ssh service in initrd for the password prompt is handy:

``` nix
boot = {
  initrd.network = {
    # This will use udhcp to get an ip address.
    # Make sure you have added the kernel module for your network driver to `boot.initrd.availableKernelModules`, 
    # so your initrd can load it!
    # Static ip addresses might be configured using the ip argument in kernel command line:
    # https://www.kernel.org/doc/Documentation/filesystems/nfs/nfsroot.txt
    enable = true;
    ssh = {
      enable = true;
      # To prevent ssh clients from freaking out because a different host key is used,
      # a different port for ssh is useful (assuming the same host has also a regular sshd running)
      port = 2222; 
      # hostKeys paths must be unquoted strings, otherwise you'll run into issues with boot.initrd.secrets
      # the keys are copied to initrd from the path specified; multiple keys can be set
      # you can generate any number of host keys using 
      # `ssh-keygen -t ed25519 -N "" -f /path/to/ssh_host_ed25519_key`
      hostKeys = [ /path/to/ssh_host_rsa_key ];
      # public ssh key used for login
      authorizedKeys = [ "ssh-rsa AAAA..." ];
    };
  };
};
```

- In order to use DHCP in the initrd, network manager must not be enabled and
  ``` nix
  networking.useDHCP = true;
  ```

  must be set.
- If your network card isn't started, you'll need to add the according Kernel module to the Kernel and initrd as well, e.g.

boot.kernelModules = \[ "r8169" \]; boot.initrd.kernelModules = \[ "r8169" \];

</syntaxhighlight>

To know what kernel modules are needed, run `nix shell nixpkgs#pciutils --command lspci -v | grep -iA8 'network\|ethernet'` .

After that you can unlock your datasets using the following ssh command:

    ssh -p 2222 root@host "zpool import -a; zfs load-key -a && killall zfs"

Alternatively you could also add the commands as postCommands to your configuration.nix, then you just have to ssh into the initrd:

    boot = {
      initrd.network = {
        postCommands = ''
        # Import all pools
        zpool import -a
        # Or import selected pools
        zpool import pool2
        zpool import pool3
        zpool import pool4
        # Add the load-key command to the .profile
        echo "zfs load-key -a; killall zfs" >> /root/.profile
        '';
      };
    };

After that you can unlock your datasets using the following ssh command:

    ssh -p 2222 root@host 

## Reservations

On ZFS, the performance will deteriorate significantly when more than 80% of the available space is used. To avoid this, reserve disk space beforehand.

To reserve space create a new unused dataset that gets a guaranteed disk space of 10GB.

``` console
# zfs create -o refreservation=10G -o mountpoint=none zroot/reserved
```

## Auto ZFS trimming

``` nix
services.zfs.trim.enable = true;
```

.

This will periodically run `zpool trim`. Note that this is different from the `autotrim` pool property. For further information, see the `zpool-trim` and `zpoolprops` man pages.

## Take snapshots automatically

See or section in `man configuration.nix`.

## NFS share

With `sharenfs` property, ZFS has build-in support for generating `/etc/exports.d/zfs.exports` file, which in turn is processed by NFS service automatically.

To enable NFS share on a dataset, only two steps are needed:

First, enable <a href="NFS" class="wikilink" title="NFS service">NFS service</a>:

``` nix
services.nfs.server.enable = true;
```

Only this line is needed. Configure firewall if necessary, as described in <a href="NFS" class="wikilink" title="NFS">NFS</a> article.

Then, set `sharenfs` property:

``` console
zfs set sharenfs="ro=192.168.1.0/24,all_squash,anonuid=70,anongid=70" rpool/myData
```

For more options, see `man 5 exports`.

Todo: sharesmb property for Samba.

## Mail notifications (ZFS Event Daemon)

ZFS Event Daemon (zed) monitors events generated by the ZFS Kernel module and runs configured tasks. It can be configured to send an email when a pool scrub is finished or a disk has failed. [zed options](https://search.nixos.org/options?query=services.zfs.zed)

First, we need to configure a mail transfer agent, the program that sends email:

``` nix
{
  age.secrets.msmtp = {
    file = "${inputs.self.outPath}/secrets/msmtp.age";
  };

  # for zed enableMail, enable sendmailSetuidWrapper
  services.mail.sendmailSetuidWrapper.enable = true;

  programs.msmtp = {
    enable = true;
    setSendmail = true;
    defaults = {
      aliases = "/etc/aliases";
      port = 587;
      auth = "plain";
      tls = "on";
      tls_starttls = "on";
    };
    accounts = {
      default = {
        host = "smtp.mail.example.com";
        passwordeval = "cat ${config.age.secrets.msmtp.path}";
        user = "myname@example.com";
        from = "myname@example.com";
      };
    };
  };
}
```

Then, configure an alias for root account. With this alias configured, all mails sent to root, such as cron job results and failed sudo login events, will be redirected to the configured email account.

``` nix
{
  environment.etc.aliases.text = ''
    root: admin@example.com
  '';
}
```

Finally, enable zed mail notification:

``` nix
{
  services.zfs.zed = {
    enableMail = true;
    settings = {
      ZED_EMAIL_ADDR = [ "root" ];
      # send notification if scrub succeeds
      ZED_NOTIFY_VERBOSE = true;
    };
  };
}
```

You can now test this by performing a scrub

``` console
# zpool scrub $pool
```

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>
