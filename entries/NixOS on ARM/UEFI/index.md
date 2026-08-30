<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/UEFI -->

<languages/> <translate>

This section of the NixOS on ARM documentation aims to document as much as possible about booting *any* ARM boards using UEFI. This will be written with a heavy bias about *Single Board Computers* (SBCs), as this is where booting is seen as complicated, cumbersome, when not described as impossible.

# The Basics First

## Target Support

Some things will not be specific to UEFI. For example, board support by the kernel used. This is written assuming that mainline Linux works enough on the target system so that you can install from the generic iso image.

Just as you could on `x86_64` if your platform required it, you can build a customized iso image. Explaining this is out of scope for this article. The same pitfalls apply. For example, the generated configuration will not take into account configuring the customized kernel.

## Platform Firmware

Let's define what a **Platform Firmware** is. It is a generic term I'm using to describe the first thing the CPU starts at boot time. On your typical `x86_64` system, it would be what was previously called the *BIOS*. Now often diminutively called by the name *EFI*. This is what initializes enough of the hardware so that the operating system can start. Additionally, it often provides facilities for the user to do basic configuration, and manage boot options.

In the ARM with SBCs landscape, ***<a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>*** is the de facto solution for the *Platform Firmware*. Though *U-Boot* is confusingly, but rightly, often referred to as a *Boot Loader*. *U-Boot* plays double duties often. It is tasked with *initializing the hardware*, and often also used to handle *loading and booting* the operating system.

## UEFI

The *[Unified Extensible Firmware Interface](https://en.wikipedia.org/wiki/Unified_Extensible_Firmware_Interface)* it not in itself a tangible thing. Wrongly abstracted, it is a specification used to provide an *interface* to describe a standard boot process, including an environment before the operating system starts, and protocols for operating systems.

There are multiple implementations of UEFI. Vendors like *American Megatrends*, *Phoenix Technologies* and *Insyde Software* may have produced the one on your personal `x86_64` machine. **TianoCore** is *the* reference UEFI implementation, and Open Source. Luckily enough, *U-Boot* implements enough (and a bit more) of the UEFI spec.

### SBBR? EBBR?

Other than letter salads, they are *Server Base Boot Requirements* and *Embedded Base Boot Requirements*. Two specifications for ARM. If your target is in compliance with either, booting with UEFI should already be supported. With the minimal UEFI support in *U-Boot*, targets that were not made to be EBBR compliant can be made compliant, or be close enough for what it matters.

# UEFI, on my SBC???

Believe me or not, it's more likely that you can, if your SBC is well supported by mainline *<a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>*. *U-Boot* provides enough UEFI to comply with EBBR, which in turn is enough to allow us to boot the `AArch64` UEFI NixOS iso, and with almost no differences compared to the `x86_64` guide, simply follow the installation instruction to boot into an installed system.

## Getting a *Platform Firmware*

As an opinionated example, you can get started with [Tow-Boot, a *U-Boot* distribution](https://github.com/Tow-Boot/Tow-Boot), which is intended to make the initial setup a bit easier by abstracting the platform differences so that they do not matter.

Where supported, Nix can be used to build U-boot from its main-line repositories. See <a href="U-Boot#Building_a_packaged_U-Boot" class="wikilink" title="U-Boot#Building a packaged U-Boot">U-Boot#Building a packaged U-Boot</a> for further information. The resulting firmware image can then be flashed to SPI with tools such as `flashcp` or `flashrom`, or installed to EMMC/SD card by writing to specific offsets. This is platform specific, refer to [upstream U-boot documentation for your platform or board](https://github.com/u-boot/u-boot/tree/master/doc/board).

Any other UEFI compliant *Platform Firmware* can be used.

## Getting the installer image (ISO)

=

Choose one of the images (in rough order of preference):

- [NixOS unstable, new kernel](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal_new_kernel_no_zfs.aarch64-linux) – rolling release, latest mainline kernel, does not build with ZFS as it would often lag behind. (This image hasn't built in over a year as of August 2026, avoid using it)
- [NixOS unstable, LTS kernel](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal.aarch64-linux) – may be less compatible with specific hardware, but tracks a more recent Nixpkgs
- [NixOS stable](https://nixos.org/download.html#download-nixos) – release branch, LTS kernel, generally not recommended unless you are confident your hardware is well-supported upstream

Graphical ISOs are also available in the GNOME and KDE flavors.

This installer image should be written to a USB drive, like usual. In a pinch, it may also be written to an SD image, if your target's platform firmware does not need to be written to that same SD image.

### Installing

Following [the usual installation steps for UEFI](https://nixos.org/manual/nixos/stable/index.html#sec-installation) is almost enough. Here's what you need to be mindful about.

#### Shared Firmware Storage

If your *Platform Firmware* lives on the target installation storage, e.g. written to an SD card and you install to the same SD card, you will need need to make sure that:

- You are not overwriting the firmware, if it is not protected by a partition.
- The partition table is not rewritten from scratch / zero.
- To not delete required existing firmware partitions.

Otherwise, you can do as you would usually, create an ESP partition, FAT32, to be mounted at `/boot/`, your preferred rootfs partition, swap if desired, etc.

#### Bootloader configuration

Know if your *Platform Firmware**s UEFI implementation has writable EFI vars. This is not true for all UEFI implementations on ARM, but is something to be mindful about. If it does not, has to be set to**`false`*'.

This sample uses GRUB2, but systemd-boot was also verified to work. Since EFI variables cannot be manipulated, using `efiInstallAsRemovable` handles installing GRUB2 to the default fallback location.

# General Tips

Using the latest kernel is probably a good idea. Hardware support for ARM platforms is always improving, and using the latest kernel, rather than the "latest LTS", might be enough to break it or make it.

# Known Issues

## Device Trees

As of right now, there is no consensus within Linux distros about the topic of managing device trees for the boot process with UEFI.

This current setup relies on the platform firmware providing an appropriate device tree for the kernel that will run.

With *U-Boot*, it is possible to make it load a device tree, for example a more up-to-date one, by placing the dtb folder from a kernel build output at the `/dtb` location in the ESP. *U-Boot* will automatically load a device tree according to heuristics, which should be the right one. Device trees are not automatically copied to the ESP by NixOS, and this may be potentially problematic when one wants to use NixOS `hardware.deviceTree.overlays` options - a rebuild will succeed, but the overlay will not be applied on the next boot.

If one is using systemd-boot, this can be worked around by providing the device tree's full path to `hardware.deviceTree.name` - for example, `hardware.deviceTree.name = "rockchip/rk3328-rock64.dtb";` for a PINE64 ROCK64 board. </translate>
