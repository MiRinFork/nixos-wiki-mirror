<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Installation -->

## Installation

### Getting the installer

#### UEFI iso

Continue to the <a href="NixOS_on_ARM/UEFI" class="wikilink" title="UEFI">UEFI</a> page.

#### SD card images (SBCs and similar platforms)

For `AArch64` it is possible to download images from Hydra.

- [25.11](https://hydra.nixos.org/job/nixos/release-25.11/nixos.sd_image.aarch64-linux)
- [25.05](https://hydra.nixos.org/job/nixos/release-25.05/nixos.sd_image.aarch64-linux)
- [unstable (LTS kernel)](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.sd_image.aarch64-linux)
- [unstable (Latest kernel)](https://hydra.nixos.org/job/nixos/trunk-combined/nixos.sd_image_new_kernel_no_zfs.aarch64-linux)

On the page click on the latest successful build to get a download link under build products.

### Installation steps

The .img files can be directly written to a microSD/SD card (minimal recommended size: 4 GB) using dd, once uncompressed from the ZSTD container. The SD card needs to be unmounted first.

Once the NixOS image file is downloaded, run the following command to install the image onto the SD Card, replace `/dev/mmcblk0` with the path to the SD card (use `dmesg` to find it out) and image.img with the path to the image.

`sudo dd if=image.img of=/dev/mmcblk0`

This should be enough to get you started, you may now boot your device for the first time.

The base images are configured to boot up with a serial TTY ( RX/TX UART ) @ 115200 Baud. That way you not necessarily have to have a HDMI Display and keyboard.

Note: If the image has the extension `.zst`, it will need to be decompressed before writing to installation device. Use

`nix-shell -p zstd --run "zstdcat image.img.zst | dd of=/dev/mmcblk0 status=progress"`

to decompress the image on-the-fly.

Continue with <a href="NixOS_on_ARM/Initial_Configuration" class="wikilink" title="NixOS_on_ARM/Initial_Configuration">NixOS_on_ARM/Initial_Configuration</a>.
