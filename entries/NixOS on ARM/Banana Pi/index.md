<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Banana Pi -->

## Building U-Boot

``` bash
$ git clone git://git.denx.de/u-boot.git
$ cd u-boot
$ nix-shell -p ubootTools gcc-arm-embedded dtc flex bison swig 'python311.withPackages(ps: with ps; [ setuptools ])' openssl libuuid gnutls
$ make -j4 ARCH=arm CROSS_COMPILE=arm-none-eabi- Bananapi_defconfig 
$ make -j4 ARCH=arm CROSS_COMPILE=arm-none-eabi-
```

## Board-specific installation notes

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image.

U-Boot needs to be copied to specific sectors on the microSD card with `dd`:

``` bash
sudo dd if=u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

## SATA Port multiplier (PMP)

It [used to be necessary](http://forum.lemaker.org/thread-9207-1-1.html) to make some changes to the kernel source and recompile, but on recent linux versions (including the one shipped with the NixOS arm image) this is no longer necessary. Instead, all that is required is merely to set

``` nix
boot.kernelParams = ["ahci_sunxi.enable_pmp=1"]
```

in `configuration.nix`. Note that this will prevent the use of a hard drive connected to the SATA port directly without a port multiplier in between.

See [here](https://linux-sunxi.org/SATA#PMP_support_-_using_SATA_port_multipliers_with_sunxi_devices) for more details.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
