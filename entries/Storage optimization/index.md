<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Storage optimization -->

A recurring problem with NixOS is lack of space on `/`. Even if you only occasionally use Nix, it is easy for `/nix/store` to grow beyond reasonable sizes. What follows are generic notes on how to reduce the growth of the <a href="Nix_store" class="wikilink" title="Nix store">Nix store</a>.

## Optimising the store

Here, we demonstrate how to configure `nix` to save space via hardlinking store files.

### Automatic

To turn on periodic optimisation of the nix store, set the following option in `/etc/nixos/configuration.nix`:

Alternatively, the store can be optimised during *every* build. This may slow down builds, as discussed [here](https://github.com/NixOS/nix/issues/6033). To enable this behavior, set the following option:

### Manual

Run . This is a potentially long operation.

## Garbage collection

By default, the Nix store will not remove any entries that are no longer used, thus it can accumulate derivations you might no longer need.[^1] They can be deleted with [^2] or .[^3]

### Removing old generations

NixOS keeps old configurations of your system around so that you can always rollback to a previous configuration if something goes wrong. You can also select which generation to boot into via GRUB. However these previous generations are <a href="Storage_optimization#Garbage_collection_roots" class="wikilink" title="GC roots">GC roots</a> (see below) that can keep around old, unnecessary software in your nix store. You can check what system generations you have by:

``` console
$ sudo nix-env -p /nix/var/nix/profiles/system --list-generations
...
  58   2021-09-04 02:56:54
  59   2021-09-05 07:12:43
  60   2021-09-05 22:12:13   (current)
```

You can remove all other NixOS generations besides the current one:

``` console
$ sudo nix-collect-garbage -d
...
4394 store paths deleted, 3467.28 MiB freed
```

There are also user-specific generations for different things (eg. home-manager). These can be removed with:

``` console
$ nix-collect-garbage -d
```

### Garbage collection roots

Note that if a result file still exists in the file system, and your Nix configuration has both `keep-outputs = true` and `keep-derivations = true`, all the dependencies used to build it will be kept. To see which result files prevent garbage collection, run:

``` console
$ nix-store --gc --print-roots
...
/nix/var/nix/profiles/per-user/root/channels-4-link -> /nix/store/254b6pkhhnjywvj5c0lp2vdai8nz4p0g-user-environment
/nix/var/nix/profiles/system-398-link -> /nix/store/wmndyzzrbc9fyjw844jmvzwgwgcinq7s-nixos-system-iron-16.0916.09pre.custom
/root/forkstat/result -> /nix/store/i5glmg3wk2a48x52rhd92zip1cmc0kq9-forkstat-git
/run/booted-system -> /nix/store/8jkrl9jyq7hqxb6xpwcaghpdm26gq98j-nixos-system-iron-16.0916.09pre.custom
/run/current-system -> /nix/store/wmndyzzrbc9fyjw844jmvzwgwgcinq7s-nixos-system-iron-16.0916.09pre.custom
```

GC roots can be found in `/nix/var/nix/gcroots`. The following script demonstrates how this directory can be used to (for example) query the state of manually made result symlinks:

``` console
$ find -H /nix/var/nix/gcroots/auto -type l | xargs -I {} sh -c 'readlink {}; realpath {}; echo'
```

This acts a simpler (but faster) version of `--print-roots` and could be implemented as a bash alias for convenience.

### Look for `result` symlinks

If you use `nix-build`, but not `--no-build-output`, your file system will be filled with `result` symlinks to various derivations. In the example above, note the following symlinks:

``` bash
/home/danbst/stack/new/website/server/result -> /nix/store/1jhmp6vl364p32r8bjigk65qh1xa562f-server-0.1.0.0
/home/ec2-user/result -> /nix/store/q35aq2sh5dbyka6g6f6qb7b8msxwds5m-nixos-system-iron-16.03.1299.a8e0739
/root/forkstat/result -> /nix/store/i5glmg3wk2a48x52rhd92zip1cmc0kq9-forkstat-git
```

How much space do these (apparently) abandoned derivations use?

``` console
$ du -sch $(nix-store -qR /root/forkstat/result /home/ec2-user/result /home/danbst/stack/new/website/server/result)
...
3.4G    total
```

Not all of the derivations are garbage in this case, but quite a few are:

``` console
# rm /root/forkstat/result /home/ec2-user/result /home/danbst/stack/new/website/server/result
# nix-collect-garbage -d
...
690 store paths deleted, 1817.99 MiB freed
```

Look for system derivations in particular. Those are created on many occasions, for example when running `nixos-rebuild build-vm`

### Reboot

As you see, the reference in `/run/booted-system` is a GC root, so it won't be cleared until reboot. If you don't want to reboot, just `rm /run/booted-system` that link and rerun `sudo nix-collect-garbage`.

### Pinning

Running the following command:

``` console
$ nix-instantiate shell.nix --indirect --add-root ./.nix-gc-roots/shell.drv ...
```

Will create a persistent snapshot of your `shell.nix` dependencies, which then won't be garbage collected, as long as you have configured `keep-outputs = true` (and haven't changed the default of `keep-derivations = true`). This is useful if your project has a dependency with no substitutes available, or you don't want to spend time waiting to re-download your dependencies every time you enter the shell.

You need to re-run that `nix-instantiate` command any time your `shell.nix` changes.

And there is a subtle gotcha if your `shell.nix` happens to evaluate to more than one derivation: `nix-instantiate` will number each derivation sequentially, so if you change your `shell.nix` to contain *fewer* derivations, such that (for example) the name of the last GC root starts with `shell.drv-7`, then `shell.drv-{8,9,10,11,12...}` will be dangling and unused.

The easiest way to get around this is to delete the `./.nix-gc-roots` directory periodically (i.e., any time you re-run the `nix-instantiate` command).

Don't forget to periodically check your GC roots, and remove any that you no longer need.

### Automation

Garbage collection can be automated,[^4] for example:

If using nix-darwin, use this to run on 0th day of every week: This can result in redownloads (tarballs fetched with `import (builtins.fetchTarball ...)` for example are not referenced anywhere and removed on GC), but it frees you from runnning GC manually.

It is also possible to automatically run garbage collection whenever there is not enough space left.<ref group="cf.">: min-free and max-free

</ref>

For example, to free up to 1GiB whenever there is less than 100MiB left:

``` nix
nix.extraOptions = ''
  min-free = ${toString (100 * 1024 * 1024)}
  max-free = ${toString (1024 * 1024 * 1024)}
'';
```

This is particularly useful when the store is on its own partition, see <a href="#Moving_the_store" class="wikilink" title="below">below</a>.

## Moving the store

can reside on another device, which is useful if your root device is very small, and you have another, larger drive available.

If the new partition is on the same device, some benefit can be gained by formatting the partition on which resides with a different file system. For example: on a Raspberry Pi, could be used for a gain in I/O throughput.

Regardless of `/nix`'s filesystem, it can also be mounted with `noatime` (as seen in the example below). This will reduce metadata writes, improving I/O and the device's lifespan.

This is easiest to set up while installing NixOS, but `/nix` can be moved on a live system:

*All commands below are executed with root privileges*

1.  Create a new partition
2.  Mount this new partition over `/mnt`
3.  mount -o defaults,noatime /dev/disk/by-label/nix /mnt/nix

</syntaxhighlight>

1.  Copy everything from `/nix` to `/mnt` *Trailing slashes are important*, in that without them, `rsync` will create an additional directory of the same name at the destination.
2.  rsync --archive --hard-links --acls --one-file-system --verbose /nix/{store,var} /mnt/nix

</syntaxhighlight>

1.  Mount the new partition as the new `/nix`
2.  umount /mnt/nix
3.  mount /dev/disk/by-label/nix /nix

</syntaxhighlight>

1.  Restart

\$ systemctl stop nix-daemon.service \$ systemctl restart nix-daemon.socket \$ systemctl start nix-daemon.service

</syntaxhighlight>

1.  Add the new `/nix` partition to your `/etc/nixos/configuration.nix`

{

`  # ...`  
`  fileSystems."/nix" = {`  
`    device = "/dev/disk/by-label/nix";`  
`    fsType = "ext4";`  
`    neededForBoot = true;`  
`    options = [ "noatime" ];`  
`  };`

}

</syntaxhighlight>

1.  Apply your configuration
2.  nixos-rebuild switch

</syntaxhighlight>

1.  Reboot to be sure `/nix/store` is properly mounted

*Optionally*

1.  After reboot, check that `/nix` is mounted over your partition
2.  mount \| grep "/nix" && echo "Nix store is on a new partition" \|\| echo "Nix is on the old partition"

</syntaxhighlight>

1.  Once **you are sure** everything works, you can delete the old store
2.  mkdir /tmp/old_root
3.  mount --bind / /tmp/old_root
4.  rm --recursive /tmp/old_root/nix
5.  umount /tmp/old_root
6.  rmdir /tmp/old_root

</syntaxhighlight>

## See also

<references group="cf."/>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>

[^1]: [Nix Manual, 11. Garbage Collection](https://nixos.org/nix/manual/#sec-garbage-collection)

[^2]:

[^3]:
    , under

[^4]:
