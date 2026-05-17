<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/UEFI/zh -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This section of the NixOS on ARM documentation aims to document as much as possible about booting *any* ARM boards using UEFI. This will be written with a heavy bias about *Single Board Computers* (SBCs), as this is where booting is seen as complicated, cumbersome, when not described as impossible.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## The Basics First

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Target Support

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Some things will not be specific to UEFI. For example, board support by the kernel used. This is written assuming that mainline Linux works enough on the target system so that you can install from the generic iso image.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Just as you could on `x86_64` if your platform required it, you can build a customized iso image. Explaining this is out of scope for this article. The same pitfalls apply. For example, the generated configuration will not take into account configuring the customized kernel.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Platform Firmware

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Let's define what a **Platform Firmware** is. It is a generic term I'm using to describe the first thing the CPU starts at boot time. On your typical `x86_64` system, it would be what was previously called the *BIOS*. Now often diminutively called by the name *EFI*. This is what initializes enough of the hardware so that the operating system can start. Additionally, it often provides facilities for the user to do basic configuration, and manage boot options.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In the ARM with SBCs landscape, ***<a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>*** is the de facto solution for the *Platform Firmware*. Though *U-Boot* is confusingly, but rightly, often referred to as a *Boot Loader*. *U-Boot* plays double duties often. It is tasked with *initializing the hardware*, and often also used to handle *loading and booting* the operating system.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### UEFI

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The *[Unified Extensible Firmware Interface](https://en.wikipedia.org/wiki/Unified_Extensible_Firmware_Interface)* it not in itself a tangible thing. Wrongly abstracted, it is a specification used to provide an *interface* to describe a standard boot process, including an environment before the operating system starts, and protocols for operating systems.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

There are multiple implementations of UEFI. Vendors like *American Megatrends*, *Phoenix Technologies* and *Insyde Software* may have produced the one on your personal `x86_64` machine. **TianoCore** is *the* reference UEFI implementation, and Open Source. Luckily enough, *U-Boot* implements enough (and a bit more) of the UEFI spec.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### SBBR? EBBR?

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Other than letter salads, they are *Server Base Boot Requirements* and *Embedded Base Boot Requirements*. Two specifications for ARM. If your target is in compliance with either, booting with UEFI should already be supported. With the minimal UEFI support in *U-Boot*, targets that were not made to be EBBR compliant can be made compliant, or be close enough for what it matters.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## UEFI, on my SBC???

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Believe me or not, it's more likely that you can, if your SBC is well supported by mainline *<a href="U-Boot" class="wikilink" title="U-Boot">U-Boot</a>*. *U-Boot* provides enough UEFI to comply with EBBR, which in turn is enough to allow us to boot the `AArch64` UEFI NixOS iso, and with almost no differences compared to the `x86_64` guide, simply follow the installation instruction to boot into an installed system.

</div>

<span id="Getting_a_Platform_Firmware"></span>

## 获取*平台固件*

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

As an opinionated example, you can get started with [Tow-Boot, a *U-Boot* distribution](https://github.com/Tow-Boot/Tow-Boot), which is intended to make the initial setup a bit easier by abstracting the platform differences so that they do not matter.

</div>

在支持的情况下，Nix 可从其主线存储库中构建 U-boot。更多信息请参阅 <a href="Special:MyLanguage/U-Boot#Building_a_packaged_U-Boot" class="wikilink" title="构建 U-Boot">构建 U-Boot</a>。生成的固件镜像随后可以使用 `flashcp` 或 `flashrom` 等工具刷入 SPI，或通过写入特定偏移位置的方式安装到 EMMC/SD 卡。操作因平台而异，具体请参阅 [针对您平台或主板的 U-boot 上游文档](https://github.com/u-boot/u-boot/tree/master/doc/board)。

<div lang="en" dir="ltr" class="mw-content-ltr">

Any other UEFI compliant *Platform Firmware* can be used.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Getting the installer image (ISO)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Choose one of the images (in rough order of preference):

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [NixOS unstable, new kernel](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal_new_kernel_no_zfs.aarch64-linux) – rolling release, latest mainline kernel, does not build with ZFS as it would often lag behind.
- [NixOS unstable, LTS kernel](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.iso_minimal.aarch64-linux) – may be less compatible with specific hardware, but tracks a more recent Nixpkgs
- [NixOS stable](https://nixos.org/download.html#download-nixos) – release branch, LTS kernel, generally not recommended unless you are confident your hardware is well-supported upstream

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Graphical ISOs are also available in the GNOME and KDE flavors.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This installer image should be written to a USB drive, like usual. In a pinch, it may also be written to an SD image, if your target's platform firmware does not need to be written to that same SD image.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Installing

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Following [the usual installation steps for UEFI](https://nixos.org/manual/nixos/stable/index.html#sec-installation) is almost enough. Here's what you need to be mindful about.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Shared Firmware Storage

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If your *Platform Firmware* lives on the target installation storage, e.g. written to an SD card and you install to the same SD card, you will need need to make sure that:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- You are not overwriting the firmware, if it is not protected by a partition.
- The partition table is not rewritten from scratch / zero.
- To not delete required existing firmware partitions.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Otherwise, you can do as you would usually, create an ESP partition, FAT32, to be mounted at `/boot/`, your preferred rootfs partition, swap if desired, etc.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Bootloader configuration

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Know if your *Platform Firmware**s UEFI implementation has writable EFI vars. This is not true for all UEFI implementations on ARM, but is something to be mindful about. If it does not, has to be set to**`false`*'.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This sample uses GRUB2, but systemd-boot was also verified to work. Since EFI variables cannot be manipulated, using `efiInstallAsRemovable` handles installing GRUB2 to the default fallback location.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### General Tips

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Using the latest kernel is probably a good idea. Hardware support for ARM platforms is always improving, and using the latest kernel, rather than the "latest LTS", might be enough to break it or make it.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Known Issues

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Device Trees

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

As of right now, there is no consensus within Linux distros about the topic of managing device trees for the boot process with UEFI.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This current setup relies on the platform firmware providing an appropriate device tree for the kernel that will run.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

With *U-Boot*, it is possible to make it load a device tree, for example a more up-to-date one, by placing the dtb folder from a kernel build output at the `/dtb` location in the ESP. *U-Boot* will automatically load a device tree according to heuristics, which should be the right one.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It is unknown how much of an actual issue this is in practice.

</div>
