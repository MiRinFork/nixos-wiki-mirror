<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS Installation Guide/multibootusb -->

When using [multibootusb](http://multibootusb.org/) to create a boot stick, which can boot multiple ISOs and then booting the NixOS ISO from it, there is a problem with mounting the ISO in the first stage.

It says something like

    An error occurred in stage 1 of the boot process, which must 
    mount the root filesystem on '/mnt-root' and start the stage 2. 
    Press one of the following keys:
      i) to launch an interactive shell
      f) to start an interactive shell having pid 1 
         (needed if you want to start stage 2's init manually)
      r) to reboot immediately
      *) to ignore the error and continue

Then press i to launch a shell. In the shell execute

``` console
# fdisk -l #To find the block device for your multiboot partition on the usb stick.
# mkdir /mnt
# mount /dev/sdXY /mnt #Use the multiboot partition's block device
# mount -o loop -t iso9660 /mnt/multiboot/nixos-<version>-linux/nixos-<version>-linux.iso /mnt-root/iso/
# exit
```

Now the boot process should continue as usual.
