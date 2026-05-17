<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/QEMU -->

## Status

NixOS on ARM through QEMU is possible, by using qemu-system-arm on QEMU's 'virt' machine, and the u-boot image for qemu.

## Board-specific installation notes

### Required images

First get some recent `sd-image-armv7l-linux.img` and `uboot-qemu_arm_defconfig-*_u-boot.bin` as described <a href="NixOS_on_ARM" class="wikilink" title="the main NixOS on ARM page">the main NixOS on ARM page</a>.

### Creating qcow image

Convert the sd card image to qcow, and resize it a bit:

    qemu-img convert -f raw -O qcow2 sd-image-armv7l-linux.img sd-image-armv7l-linux.qcow2
    qemu-img resize sd-image-armv7l-linux.qcow2 +5G

## Booting using qemu

The following command will boot QEMU's 'virt' machine with u-boot and the converted sdcard image, exposing four cpu cores and 2GB of RAM:

    qemu-system-arm -machine virt,highmem=off -bios uboot-qemu_arm_defconfig-2018.03_u-boot.bin -drive if=none,file=sd-image-armv7l-linux.qcow2,id=mydisk -device ich9-ahci,id=ahci -device ide-drive,drive=mydisk,bus=ahci.0 -netdev user,id=net0 -device virtio-net-pci,netdev=net0 -nographic -smp 4 -m 2G

    U-Boot 2018.03 (Mar 13 2018 - 12:02:19 +0000)

    DRAM:  2 GiB
    WARNING: Caches not enabled
    In:    pl011@9000000
    Out:   pl011@9000000
    Err:   pl011@9000000
    Net:   No ethernet found.
    Hit any key to stop autoboot:  0 
    scanning bus for devices...
    Target spinup took 0 ms.
    SATA link 1 timeout.
    SATA link 2 timeout.
    SATA link 3 timeout.
    SATA link 4 timeout.
    SATA link 5 timeout.
    AHCI 0001.0000 32 slots 6 ports 1.5 Gbps 0x3f impl SATA mode
    flags: 64bit ncq only 
      Device 0: (0:0) Vendor: ATA Prod.: QEMU HARDDISK Rev: 2.5+
                Type: Hard Disk
                Capacity: 7137.4 MB = 6.9 GB (14617528 x 512)

    Device 0: (0:0) Vendor: ATA Prod.: QEMU HARDDISK Rev: 2.5+
                Type: Hard Disk
                Capacity: 7137.4 MB = 6.9 GB (14617528 x 512)
    ... is now current device
    Scanning scsi 0:1...
    Found /extlinux/extlinux.conf
    Retrieving file: /extlinux/extlinux.conf
    847 bytes read in 7 ms (118.2 KiB/s)
    ------------------------------------------------------------
    1:  NixOS - Default
    Enter choice: 1:    NixOS - Default
    Retrieving file: /extlinux/../nixos/b44d5kfyaixzkzy780br46ls3812cfx3-initrd-initrd
    7084057 bytes read in 122 ms (55.4 MiB/s)
    Retrieving file: /extlinux/../nixos/ajja3hfl2p4dadbg93rrs0zqrclisrwj-linux-4.16.1-zImage
    6550016 bytes read in 112 ms (55.8 MiB/s)
    append: systemConfig=/nix/store/km910m22ibjl6rjzfjiivn2mp71d86d6-nixos-system-nixos-18.09.git.1034aa8e9cb init=/nix/store/km910m22ibjl6rjzfjiivn2mp71d86d6-nixos-system-nixos-18.09.git.1034aa8e9cb/init loglevel=7 console=ttyS0,115200n8 console=ttymxc0,115200n8 console=ttyAMA0,115200n8 console=ttyO0,115200n8 console=ttySAC2,115200n8 console=tty0
    Kernel image @ 0x40400000 [ 0x000000 - 0x63f200 ]
    ## Flattened Device Tree blob at 40000000
       Booting using the fdt blob at 0x40000000
       Using Device Tree in place at 40000000, end 40012fff

    Starting kernel ...

    [    0.000000] Booting Linux on physical CPU 0x0
    [    0.000000] Linux version 4.16.1 (nixbld@localhost) (gcc version 7.3.0 (GCC)) #1-NixOS SMP Sun Apr 8 12:29:52 UTC 2018
    [    0.000000] CPU: ARMv7 Processor [412fc0f1] revision 1 (ARMv7), cr=10c5387d
    […]

    <<< Welcome to NixOS 18.09.git.1034aa8e9cb (armv7l) - ttyAMA0 >>>

    The "root" account has an empty password.  


    Run `nixos-help` or press <Alt-F8> for the NixOS manual.

    nixos login: root (automatic login)


    [root@nixos:~]# 

## QEMU AArch64

     $ nix-build -A pkgsCross.aarch64-multiplatform.ubootQemuAarch64
     $ qemu-system-aarch64 -nographic \
        -machine virt -cpu cortex-a57 \
        -bios result/u-boot.bin \
        ./nixos-sd-image-21.03pre262561.581232454fd-aarch64-linux.img \
        -m 4G

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
