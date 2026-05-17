<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NTFS -->

New Technology File System (NTFS) is a proprietary journaling <a href="Filesystems" class="wikilink" title="file system">file system</a> developed by Microsoft. It is still in use by modern Windows systems, although NTFS has not evolved since the release of version 3.1 in 2001.

## Mount NTFS filesystem on boot

Using <a href="nixos-generate-config" class="wikilink" title="nixos-generate-config">nixos-generate-config</a> to automatically generate Nix config is the recommended way to setup filesystems.

1\. Run to list device names. 2. Mount the device using [](https://man7.org/linux/man-pages/man8/mount.8.html), where replaced with your device name and replaced with an existing folder path to mount your drive. 3. Run to generate hardware configuration. This will <strong>automatically</strong> add all currently mounted devices to . 4. Add to to get write access, where <strong>replaced with your UID</strong>:

5\.

## Troubleshooting

### Read-only file system

This is most likely caused by Windows not marking the disk as "clean" and unmounted.

To verify:

    journalctl -b0 | grep -i "The disk contains an unclean file system"

It should return a similar message to what follows:

    The disk contains an unclean file system (0,0). Metadata
    kept in Windows cache, refused to mount. Falling back to
    read-only mount because the NTFS partition is in an unsafe
    state. Please resume and shutdown Windows fully (no
    hibernation or fast restarting.)

If you have shutdown Windows fully, and not used hibernation, it may be caused by the <em>fast startup</em> or <em>fast boot</em> feature of Windows. It has been reported that major Windows updates may reset this setting to <strong>on</strong>.

[This TechNet entry](https://social.technet.microsoft.com/wiki/contents/articles/25908.fast-startup-how-to-disable-if-it-s-causing-problems.aspx) explains how to disable fast startup. Additionally, [this blog post on howtogeek.com](https://www.howtogeek.com/243901/the-pros-and-cons-of-windows-10s-fast-startup-mode/) explains how the fast startup mode works, and how to disable it.

### Unable to mount ntfs3 with dirty volume

When attempting to mount an `NTFS` partition using the `ntfs3` filesystem driver via the package, the mount operation may fail:

``` console
# mount /dev/sda1 /mnt -t ntfs3
mount: /mnt: wrong fs type, bad option, bad superblock on /dev/sda1, missing codepage or helper program, or other error.
       dmesg(1) may have more information after failed mount system call.
```

With the resulting dmesg output:

``` console
# dmesg
...
[168659.819978] ntfs3: sda1: It is recommened to use chkdsk.
[168659.820833] ntfs3: sda1: volume is dirty and "force" flag is not set!
```

This indicates that the NTFS volume has the “dirty” flag set. In this state, the `ntfs3` driver refuses to mount the filesystem.

To clear the dirty flag, run `ntfsfix` on the affected partition:

``` console
# ntfsfix --clear-dirty /dev/sda1
```

If `ntfsfix` fails with an error `Windows is hibernated, refused to mount`, the partition can be mounted using `ntfs-3g` with the hibernation file removed:

``` console
# ntfs-3g -o remove_hiberfile /dev/sda1 /mnt
```

<a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a>
