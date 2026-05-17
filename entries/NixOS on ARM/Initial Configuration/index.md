<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Initial Configuration -->

## NixOS installation & configuration

The installation image is actually a MBR partition table plus two partitions; a FAT16 /boot and a ext4 root filesystem. The image is designed such that it's possible to directly reuse the SD image's partition layout and "install" NixOS on the very same SD card by simply replacing the default configuration.nix and running nixos-rebuild. Using this installation method is strongly recommended, though if you know exactly what you're doing and how U-Boot on your board works, you can use nixos-install as usual. To help with the SD card installation method, the boot scripts on the image automatically resize the rootfs partition to fit the SD card on the first boot.

- To generate a default `/etc/nixos/configuration.nix` file, run `sudo nixos-generate-config`.

<!-- -->

- You can also use an existing template:

Note: the default configuration.nix will contain something like `imports = [ <nixos/modules/installer/sd-card/sd-image-armv7l-multiplatform.nix> ];` do not include that in your final installation or you will experience interesting problems. It is only for building the installation image!

#### First rebuild on ARMv6 and ARMv7

To rebuild your system, run: `sudo nixos-rebuild switch`
