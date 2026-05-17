<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on RISCV/VisionFive 2 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>VisionFive 2</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Riscv_visionfive2.jpg" title="A VisionFive 2." width="256" />
<figcaption>A VisionFive 2.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>StarFive</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>RISC-V</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Custom or UEFI</p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>Configurable; SD, USB, Netboot</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p>onny</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>VisionFive 2</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>JH7110</p></td>
</tr>
</tbody>
</table>

</div>

The [VisionFive 2](https://github.com/starfive-tech/VisionFive2) is a single board computer (SBC) that uses a RISC-V processor with an integrated GPU. It supports Linux operating system and various multimedia features, such as 4K video decoding and OpenGL ES 3.212.

## Status

See <https://rvspace.org/en/project/JH7110_Upstream_Plan> for an overview of which features are already supported by the latest mainline kernel used by NixOS.

Please note that HDMI display patches haven't been merged yet.

# Setup

Precompiled SD-card images with unstable NixOS can be found [on misuzu's Hydra instance](https://hydra.ztier.in/job/nixos/nixos-unstable/sd-image-riscv64-new-kernel-no-zfs-installer-cross/latest). Before flashing the image, use `unzstd` to unpack the downloaded archive.

### Manually build a SD-card image

First create this <a href="Flake" class="wikilink" title="Flake">Flake</a> file

If you want to use an alternative filesystem for system root, for example <a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a>, you could change the `sdImage`-part to this. Currently [this patch](https://github.com/NixOS/nixpkgs/pull/434122) is required to produce a functioning btrfs image.

It might be helpful to add <a href="RISC-V#Binary_cache" class="wikilink" title="third-party binary cache configuration">third-party binary cache configuration</a> to this system configuration.

Run following command to build the SD-card image

``` bash
nix build .#
```

### Flashing the image

After successfull build or unpack, flash the resulting file (build file is in the directory `results/sd-image`) to the target device such as a NVME SSD or in this example the SD-card (`/dev/mmcblk*`). Note that everything on the target device gets erased.

``` bash
dd if=result/sd-image/nixos-sd-image-23.11pre-git-riscv64-linux-starfive-visionfive2.img of=/dev/mmcblk0 status=progress
```

# Usage

The board has "boot mode pins", from which we can control what device should be booted from.

See official documentation <https://doc-en.rvspace.org/VisionFive2/Quick_Start_Guide/VisionFive2_SDK_QSG/boot_mode_settings.html> .

First enable booting from SD-card or NVME SSD by setting jumper 1 and 2 to "FLASH/QSPI mode" (both QSPI and SDIO mode support booting from an SD card):

<figure>
<img src="Visionfive_2_jumper_config_sdcard_boot.jpg" title="Visionfive_2_jumper_config_sdcard_boot.jpg" width="803" height="803" />
<figcaption>Visionfive_2_jumper_config_sdcard_boot.jpg</figcaption>
</figure>

For UART access, wire GND (black), RX (blue) and TX (purple) to your adapter <img src="Visionfive2_uart_wiring.jpg" title="Visionfive2_uart_wiring.jpg" width="802" height="802" alt="Visionfive2_uart_wiring.jpg" />Update board firmware

``` bash
sudo visionfive2-firmware-update-flash
```

Bootstrap NixOS system configuration at `/etc/nixos/configuration.nix`

``` bash
nixos-generate-config
```

It is recommended to <a href="RISC-V#Binary_cache" class="wikilink" title="configure third-party binary caches">configure third-party binary caches</a> to speed up build times.

# Tips and tricks

## Using the Visionfive 2 as a remote builder to build native RISCV packages for e.g. the Visionfive 2

Building an NixOS system image that can be flashed to an SD card or NVMe SSD requires to **build RISCV binaries**, more specifically for the `"riscv64-linux"`platform. From a typical Intel/AMD computer we can either

- **emulated native compile using QEMU** virtualization by enabling the binfmt kernel feature on NixOS configuration setting `boot.binfmt.emulatedSystems = [ "riscv64-linux" ];`). This can be fast if everything is downloaded pre-compiled from the cache.nixos.org cache (not supported yet though) and only few packages really need local compilation. In reality it can be extremely slow, e.g. compiling a Linux kernel alone can take days.
- **cross-compile** to RISCV from another (e.g. "x86_64-linux) machine using the setup in the example above. However very few packages will be cached from cache.nixos.org as cross-compiled packages are less likely to be pre-build than native compiled. So the compile itself is fast but there will be a lot more to compile locally. In practice this can be quite fragile, because you may encounter packages that don't really support cross-compilation get stuck.
- **native compile on an remote builder** like the Visionfive 2 itself running its custom Debian Linux at the beginning or later NixOS. This is quite simple to setup and reasonably fast as most packages can be pre-build and cached on cache.nixos.org, and building a remaining Linux kernel only takes 3h on the Visionfive 2.

**Setting up the Visionfive 2 as a remote native builder** can be done following the steps at <a href="Distributed_build" class="wikilink" title="https://wiki.nixos.org/wiki/Distributed_build"><span>https://wiki.nixos.org/wiki/Distributed_build</span></a>. The rough steps are as follows:

1.  **Install the Nix package manager** on Visionfive 2 Debian OS the normal, multi-user way with `sh <(curl -L https://nixos.org/nix/install) --daemon`. If you already have NixOS running on the Visionfive 2, then you can skip this step.
2.  **Setup a `ssh` connection** from your local machine to the Visionfive 2, especially adding `SetEnv PATH=/nix/var/nix/profiles/default/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin` to the Pi's `/etc/ssh/sshd_config` file. If you already have NixOS running on the Visionfive 2, then you can skip this step.
3.  **Make the remote Visionfive 2 known to you local computer** by adding it as a `nix.buildMachines` entry to your `/etc/nix/configuration.nix` file and use connection protocol `ssh-ng`(!).
4.  You can then **build, e.g. an NixOS sd card image** with a call similar to `nix build .\#nixosConfigurations.visionfive2.config.system.build.sdImage`
5.  **flash that resulting image onto an SD card** or NVMe SSD using a call similar to `zstdcat result/sd-image/nixos-sd-image-23.11.20230703.ea4c80b-riscv64-linux.img.zst | sudo dd of=/dev/mmcblk0 bs=100M status=progress` and place that card into the Visionfive 2.

## Deploy and Update the Visionfive 2 NixOS system once it's running NixOS

Once the Visionfive 2 is running NixOS, you can update it with newer NixOS system configurations using e.g. the usual `nix-rebuild`

tool with a call similar to

`nixos-rebuild --flake .#visionfive2 --build-host user@visionfive2 --target-host user@visionfive2 --use-remote-sudo switch`

that uses the SSH connection from the remote builder section.

See [this guide](https://nixcademy.com/2023/08/10/nixos-rebuild-remote-deployment/) for a good explanation of this terminal call.

# See also

- There's also a port of the UEFI reference implementation EDK2 available at <https://github.com/starfive-tech/edk2> to support a future generic RISCV Linux image that can be booted from any RISCV device.
