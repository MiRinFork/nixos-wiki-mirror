<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Adding support for new boards -->

### The easiest way

Assuming upstream U-Boot supports the board through a defconfig, it is possible possible to build U-Boot using the cross-compiling architecture from an x86_64 host. Here's a sample use.

``` shell-session
# Assuming you're in a recent nixpkgs checkout
$ nix-shell \
    -I "nixpkgs=$PWD" \
    -p 'let plat = pkgsCross.aarch64-multiplatform; in plat.buildUBoot{defconfig = "orangepi_zero_plus2_defconfig"; extraMeta.platforms = ["aarch64-linux"]; BL31 = "${plat.armTrustedFirmwareAllwinner}/bl31.bin"; filesToInstall = ["u-boot-sunxi-with-spl.bin"];}'
```

For armv7 and armv6 `pkgsCross.arm-embedded` should work, this is available in the unstable channel (19.03 and following) by setting `-I "nixpkgs=/path/to/new-nixpkgs-checkout`.

This should build whatever is needed for, and then build U-Boot for the desired defconfig, then open a shell with the build in `$buildInputs`. Do note that this particular invocation may need more changes than only the defconfig if built for other than allwinner boards.

Here's an example command, for allwinner boards, on how to write to an SD card.

``` shell-session
$ sudo dd if=$buildInputs/u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

### The easy way

*(if you're lucky)*

If your board is an ARMv7 board supported by multi_v7_defconfig and you have access to U-Boot on the board, getting `sd-image-armv7l-linux.img` to boot is the easiest option:

- If you're lucky and your U-Boot build comes with the extlinux.conf support built in, the image boots out-of-the-box. This is the case for all (upstream) Allwinner and Tegra U-Boots, for instance.
- Otherwise, you can get the boot information (path to kernel zImage, initrd, DTB, command line arguments) by extracting `extlinux.conf` from the boot partition of the image, and then attempt to boot it via the U-Boot shell, or some other mechanism that your board's distro uses (e.g. `uEnv.txt`).

#### Building U-Boot from your NixOS PC

Assuming

- Your board is supported upstream by U-Boot or there is a recent enough fork with `extlinux.conf` support.
- You do not have nix setup on an ARM device
- Your nix isn't setup for cross-compilation

It is still possible to build U-Boot using tools provided by NixOS.

In the following terminal session, replace `orangepi_pc_defconfig` with the appropriate board [from the configs folder](http://git.denx.de/?p=u-boot.git;a=tree;f=configs;hb=HEAD) of U-Boot.

The name of the final file will change depending on the board. For this specific build, and most Allwinner builds, the file will be named `u-boot-sunxi-with-spl.bin`.

You can flash this file to boot device with

Note: This mailing list contains a patch which may help some builds: <https://lists.denx.de/pipermail/u-boot/2016-December/275664.html>

### The hard way

Alternatively/if all else fails, you can do it the hard way and bootstrap NixOS from an existing ARM Linux installation.

### Contributing new boards to nixpkgs

- Add a new derivation for your board's U-Boot configuration, see for example ubootPine64LTS in .
- If your board's U-Boot configuration doesn't use the `extlinux.conf` format by default, create a patch to enable it. Some C hacking skills & U-Boot knowledge might be required. For some pointers, see this patch to enable it on the Versatile Express.
- Make a pull request, also containing the board-specific instructions.
