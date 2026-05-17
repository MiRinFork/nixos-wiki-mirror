<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Filesystems -->

<a href="category:filesystem" class="wikilink" title="category:filesystem">category:filesystem</a> is a NixOS option that allows the user to mount filesystems at specific mount points. The mounted filesystems may also be encrypted. Also see [the fileSystem option documentation](https://nixos.org/manual/nixos/stable/options.html#opt-fileSystems).

For boot mount options, [check here](https://manpages.ubuntu.com/manpages/noble/en/man8/mount.8.html#filesystem-independent%20mount%20options).

Common example filesystem mount. You can put this in configuration.nix:

``` nix
 fileSystems."/mnt/exampleDrive" = {
   device = "/dev/disk/by-uuid/4f999afe-6114-4531-ba37-4bf4a00efd9e";
   fsType = "exfat";
   options = [ # If you don't have this options attribute, it'll default to "defaults" 
     # boot options for fstab. Search up fstab mount options you can use
     "users" # Allows any user to mount and unmount
     "nofail" # Prevent system from failing if this drive doesn't mount
     "exec" # Permit execution of binaries and other executable files
   ];
 };
```

## Making disk visible in your file explorer

You might not see the disk in your file explorer (ie GNOME Nautilus). Add to the options: `x-gvfs-show` and it'll show up.

## Porting /etc/fstab

The options specified in /etc/fstab may not be fully compatible with NixOS fileSystems options. For example, here are some options NixOS doesn't recognize that are available on some Linux distributions:

- iocharset
- rw (but it seems to not be needed)
- uid with username rather than actual uid

## Mount order

Without any specification, the mount order is up to the implementation (probably alphabetic).

Should the order in which filesystems are mounted is important, users should make use of the [ option](https://nixos.org/manual/nixos/stable/options.html#opt-fileSystems._name_.depends). This is useful for example in <a href="#Bind_mounts" class="wikilink" title="#Bind mounts">#Bind mounts</a>

## Bind mounts

> Bind mounting allows a filesystem hierarchy or a file to be mounted at a different mount point. Unlike a symbolic link, a bind mount does not exist on the filesystem itself.[^1]

These are used to make files or folders available in other parts of the filesystem hierarchy. In order to do so both source and target filesystems have to be mounted first.

``` nix
fileSystems."/mnt/datastore".label = "datastore";
fileSystems."/mnt/aggregator".label = "aggregator";

####################
# Bind mounts

# Mount /mnt/datastore/applications/app1 on /mnt/aggregator/app1
# Accessing /mnt/aggregator/app1 will actually access /mnt/datastore/...
fileSystems."/mnt/aggregator/app1" = {
  depends = [
      # The mounts above have to be mounted in this given order
      "/mnt/datastore" 
      "/mnt/aggregator" 
  ];
  device = "/mnt/datastore/applications/app1";
  fsType = "none";
  options = [
    "bind"
    "ro" # The filesystem hierarchy will be read-only when accessed from /mnt/aggregator/app1
  ];
};
```

## Tips and tricks

### SSD TRIM support

On NixOS, [TRIM](https://en.wikipedia.org/wiki/Trim_(computing)) support is enabled by default by the option. This periodically discards unused blocks on supported storage devices, helping to maintain SSD performance over time.

The trimming schedule is controlled by the option. Continuous trimming (as set by the `discard`, see `man mount(8)`) mount option is not recommended as it can negatively impact SSD performance.

Additionally, setting `noatime` can reduce the number of disk writes and can improve system performance.

# References

<references />

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>

[^1]: [Wikipedia - Bind mount](https://en.wikipedia.org/wiki/Mount_(Unix)#Bind_mounting)
