<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Banana Pi BPI-M5 -->

## Status

Work in progress

## Building Amlogic-compatible U-Boot

### Building U-Boot

**Note:** Do not use the severely outdated [BPI-M5-bsp](https://github.com/BPI-SINOVOIP/BPI-M5-bsp) or [Amlogic-u-boot](https://github.com/Dangku/Amlogic-u-boot) to build u-boot.

``` shell-session
$ git clone git://git.denx.de/u-boot.git
$ cd u-boot
$ nix-shell -p ubootTools gcc-arm-embedded dtc flex bison python swig
$ make -j$(nproc) ARCH=arm CROSS_COMPILE=aarch64-unknown-linux-gnu- bananapi-m5_defconfig
$ make -j$(nproc) ARCH=arm CROSS_COMPILE=aarch64-unknown-linux-gnu-
$ cd ..
```

### Creating Amlogic Package

**Note:** The following steps require an AMD64 platform.

``` shell-session
$ git clone https://github.com/LibreELEC/amlogic-boot-fip
$ cd amlogic-boot-fip
$ mkdir -p output-bananapim5/
$ ./build-fip.sh bananapi-m5 ../u-boot/u-boot.bin output-bananapim5
$ hexdump -C -n 32 output-bananapim5/u-boot.bin | grep "40 41 4d 4c"
$ cd ..
```

Verify that the new u-boot.bin contains `40 41 4d 4c` (`@AML`) at 0x10 onwards.

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#SD_card_images_.28SBCs_and_similar_platforms.29" class="wikilink" title="NixOS_on_ARM instructions to get the SD card image">NixOS_on_ARM instructions to get the SD card image</a> and decompress it.

Once the image has been decompressed, the Amlogic U-Boot package needs to be copied to byte 512+ inside the image (replace the image with the name downloaded and decompressed image):

``` shell-session
$ sudo dd if=amlogic-boot-fip/output-bananapim5/u-boot.bin of=nixos-sd-image-22.11.2620.de5448dab58-aarch64-linux.img conv=fsync,notrunc bs=512 seek=1
```

Then, copy the image onto the eMMC or sdcard using the <a href="NixOS_on_ARM#Installation_steps" class="wikilink" title="the installation steps">the installation steps</a>.

In order to get a serial console output, it is required to replace `ttyAMA0` with `ttyAML0` in the `/boot/extlinux/extlinux.conf` file inside the image. The easiest way is to just mount the respective folder after the image has been flashed on the SD-card

``` shell-session
$ sudo mount /dev/sdX /mnt/
$ sudo sed -i 's/ttyAMA0/ttyAML0/g' /mnt/boot/extlinux/extlinux.conf
```

## Resources

- [Official product page](https://wiki.banana-pi.org/Banana_Pi_BPI-M5)
- [Installation here is based on the U-Boot for Odroid C4 documentation](https://u-boot.readthedocs.io/en/latest/board/amlogic/odroid-c4.html)

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
