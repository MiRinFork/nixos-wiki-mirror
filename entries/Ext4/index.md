<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ext4 -->

Ext4 is a widely used journaling <a href="filesystems" class="wikilink" title="filesystem">filesystem</a> for Linux.

## Usage

In NixOS, Ext4 can be specified when formatting partitions during installation. For example:

``` console
# mkfs.ext4 /dev/sdX1
```

And configured in your system configuration like so:

Replace the UUID or device path with your actual partition identifier.

## Tools

Some common tools that are installed by default on NixOS for working with the Ext4 filesystem as part of the package:

- `e2fsck`: check and repair the file system
- `tune2fs`: adjust tunable file system parameters
- `resize2fs`: file system resizer

<a href="Category:Filesystem" class="wikilink" title="Category:Filesystem">Category:Filesystem</a>
