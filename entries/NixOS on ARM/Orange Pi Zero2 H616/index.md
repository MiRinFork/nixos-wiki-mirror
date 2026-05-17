<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Orange Pi Zero2 H616 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Orange Pi Zero2 (H616)</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Orange-pi-zero-two-h616.png" title="An Orange Pi Zero Plus2 (H5)." width="256" />
<figcaption>An Orange Pi Zero Plus2 (H5).</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Xunlong / Orange Pi</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p><a href="https://hydra.nixos.org/job/nixpkgs/trunk/ubootOrangePiZero2.aarch64-linux">Upstream u-boot</a><a href="#fn1" class="footnote-ref" id="fnref1" role="doc-noteref"><sup>1</sup></a></p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:Ein-shved" class="wikilink" title="Ein-shved">Ein-shved</a></p></td>
</tr>
</tbody>
</table>
<section id="footnotes" class="footnotes footnotes-end-of-document" role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><a href="https://github.com/NixOS/nixpkgs/pull/125743">https://github.com/NixOS/nixpkgs/pull/125743</a><a href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></li>
</ol>
</section>

</div>

## Status

Upstream unstable NixOS AArch64 image will boot on the Orange Pi Zero2 (H616), using the proper upstream u-boot.

The limited support of allwiner H616 soc was introduced to the Linux upstream kernel since 6.0 version, see <a href="#Periphery" class="wikilink" title="periphery">periphery</a> for details.

## Board-specific installation notes

### Fastest way

First follow the <a href="NixOS_on_ARM#Installation" class="wikilink" title="generic installation steps">generic installation steps</a> to get the installer image on an SD card.

U-Boot needs to be copied to specific sectors on the microSD card with `dd`. Download u-boot for the board, and copy it to the correct location with (again, replace `/dev/sdX` with the correct path to the SD card device):

``` bash
sudo dd if=u-boot-sunxi-with-spl.bin of=/dev/sdX bs=1024 seek=8
```

Then, install using the <a href="NixOS_on_ARM#NixOS_installation_.26_configuration" class="wikilink" title="installation and configuration steps">installation and configuration steps</a>.

### Better way

To get the more useful output from board better to build image with kernel which supports more periphery (like USB). See <a href="#Periphery" class="wikilink" title="periphery">periphery</a>.

## Serial console

The default console configuration from sd-image-aarch64 works out of the box.

## Ethernet

Connected at 1Gbps mode.

## Periphery

Current newest numerated kernel version 6.1 does not contains full H616 sock support. At least some regulators and USB blocks are [missing](https://github.com/torvalds/linux/blob/v6.1-rc8/arch/arm64/boot/dts/allwinner/sun50i-h616.dtsi) in DTS. But they are [available](https://github.com/torvalds/linux/blob/master/arch/arm64/boot/dts/allwinner/sun50i-h616.dtsi) in master branch.

Here is flake with which an image with better periphery support (at least - USB) may be build.

``` nix
{
  description = "Build image for OrangePi Zero 2";
  inputs = {
    nixpkgs.url = github:nixos/nixpkgs/nixos-22.11;
  };
  outputs = { self, nixpkgs }: let
    system = "aarch64-linux";

    #Build manipulation
    stateVersion = "22.11";   # NixOS Version
    useUnstableKernel = true; # Set to false to use mainline kernel
    compressImage = true;     # Set to false to disable image compressing

    pkgs = nixpkgs.legacyPackages.x86_64-linux.pkgsCross.aarch64-multiplatform;

    # Build unstable kernel
    kernel =
      with pkgs;
      with lib;
      buildLinux rec {
        kernelPatches = [
          linuxKernel.kernelPatches.bridge_stp_helper
          linuxKernel.kernelPatches.request_key_helper
        ];
        src = fetchGit {
          url = git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git;
          rev = "8395ae05cb5a2e31d36106e8c85efa11cda849be";
        };
        version = "6.1.0";
        modDirVersion = version;
        extraMeta.branch = versions.majorMinor version;
      };

    # Boot related configuration
    bootConfig = let
      bootloaderPackage = pkgs.ubootOrangePiZero2;
      bootloaderSubpath = "/u-boot-sunxi-with-spl.bin";
      # Disable ZFS support to prevent problems with fresh kernels.
      filesystems = pkgs.lib.mkForce [ "btrfs" "reiserfs" "vfat" "f2fs" "xfs"
                                       "ntfs" "cifs" /* "zfs" */ "ext4" "vfat"
                                     ];
    in {
      system.stateVersion = stateVersion;
      boot.kernelPackages = if useUnstableKernel
        then pkgs.linuxPackagesFor kernel
        else pkgs.linuxPackages_latest;
      boot.supportedFilesystems = filesystems;
      boot.initrd.supportedFilesystems = filesystems;
      sdImage = {
        postBuildCommands = ''
          # Emplace bootloader to specific place in firmware file
          dd if=${bootloaderPackage}${bootloaderSubpath} of=$img    \
            bs=8 seek=1024                                          \
            conv=notrunc # prevent truncation of image
        '';
        inherit compressImage;
      };
    };

    # NixOS configuration
    nixosSystem = nixpkgs.lib.nixosSystem rec {
      inherit system;
      modules = [
        # Default aarch64 SOC System
        "${nixpkgs}/nixos/modules/installer/sd-card/sd-image-aarch64.nix"
        # Minimal configuration
        "${nixpkgs}/nixos/modules/profiles/minimal.nix"
        { config = bootConfig; }
        # Put your configuration here. e.g. ./configuration.nix
      ];
    };
  in {
    inherit system;
    # Run nix build .#images.orangePiZero2 to build image.
    images = {
      orangePiZero2 = nixosSystem.config.system.build.sdImage;
    };
  };
}
```

### USB

The suggested master kernel supports only the onboard usb ports (not sure about USB type-C). If you want to use extension board or D+/D- pins, you need to add dts overlay to enable ehci and ohci ports. Just enable them all, putting this to configuration:

``` nix
      hardware.deviceTree = {
        enable = true;
        filter = "sun50i-h616-orangepi-zero2.dtb";
        overlays = [
          {
            name = "sun50i-h616-orangepi-zero2.dtb";
            dtsText = ''
              /dts-v1/;
              /plugin/;

              / {
                compatible = "xunlong,orangepi-zero2", "allwinner,sun50i-h616";
              };

              &ehci0 {
                status = "okay";
              };

              &ehci1 {
                status = "okay";
              };

              &ehci2 {
                status = "okay";
              };

              &ehci3 {
                status = "okay";
              };

              &ohci0 {
                status = "okay";
              };

              &ohci1 {
                status = "okay";
              };

              &ohci2 {
                status = "okay";
              };

              &ohci3 {
                status = "okay";
              };
            '';
          }
        ];
      };
```

### WiFi

According to SOC [dts](https://github.com/torvalds/linux/blob/master/arch/arm64/boot/dts/allwinner/sun50i-h616.dtsi), Wi-Fi does not supported yet in mainline.

### HDMI

According to SOC [dts](https://github.com/torvalds/linux/blob/master/arch/arm64/boot/dts/allwinner/sun50i-h616.dtsi), HDMI does not supported yet in mainline.

## Resources

- [Official product page](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-Zero-2.html)
- [wiki page](https://linux-sunxi.org/Xunlong_Orange_Pi_Zero2)

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
