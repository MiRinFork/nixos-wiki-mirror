<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Raspberry Pi 5 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Raspberry Pi 5 Family</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Raspberry_Pi_5,_8_GB_RAM.jpg" title="A Raspberry Pi 5." width="256" />
<figcaption>A Raspberry Pi 5.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Raspberry Pi Foundation</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>AArch64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>Custom, UEFI or u-boot</p></td>
</tr>
<tr>
<td><p>Boot order</p></td>
<td><p>Configurable; SD, USB, Netboot</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p>leo60228</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Raspberry Pi 5B</p></td>
</tr>
<tr>
<td><p>SoC</p></td>
<td><p>BCM2712</p></td>
</tr>
</tbody>
</table>

</div>

The Raspberry Pi family of devices is a series of single-board computers made by the Raspberry Pi Foundation. They are all based on Broadcom System-on-a-chip (SoCs).

## Current Status

NixOS is not officially supported on the Raspberry Pi 5, and the community efforts to bring the operating system to the development board have been less successful than the ones targeting the previous generation, the <a href="NixOS_on_ARM/Raspberry_Pi_4" class="wikilink" title="Raspberry Pi 4">Raspberry Pi 4</a>. It is advisable, for the time being, that all critical projects continue using and deploying the older model, for which the support is significantly more robust.

For the adventurous, there are multiple community efforts enabling NixOS on the board, with various degrees of user friendliness, support availability or robustness, some of which can be found in the *Other solutions* section below. Amongst them, the community has flagged one repository that seems to have achieved a reasonable trade-off between all the necessary requirements for such a project; this is described in the *Proposed Solution* section below. While by no means official, and its level of support still under development, it is a good enough starting ground for people wanting to take advantage of their Raspberry Pi 5.

However, this solution reuses proprietary software distributed by the Raspberry Pi Foundation; which is highly criticized by the NixOS community, and the Linux community at large, for reasons including reproducibility, transparency, security, predictibility, etc. There are efforts in the community to address these issues as well, and the following sub-section is an overview into these efforts.

### Generic UEFI boot support

NixOS doesn't run out-of-box, but relies on several tweaks on the boot process that are maintained by different individuals and spread over multiple repositories. The Raspberry Pi 5's boot process follows the [typical boot stages on embedded devices](https://youtu.be/UvFG76qM6co?t=308), and has the following boot loader steps by default:

The pain points for NixOS support are the Pi's [custom EEPROM boot bootloader](https://github.com/raspberrypi/rpi-eeprom), its [proprietary, closed-source firmware](https://github.com/raspberrypi/firmware) (code to use to hardware components) and [its separately maintained Linux kernel](https://github.com/raspberrypi/linux), all of which we would need to update, build and test constantly and separately from the other NixOS Linux kernel variations, which is a large, unmaintainable burden for the NixOS community when the Pi 5 is not the only supported SoC.

The more sustainable goal would be to move towards UEFI support, which would mimic how desktop computers boot into the NixOS operating system, thus minimising the amount of bespoke maintenance needed for the development board. This is what this process would look like:

The ROM and EEPROM can't be modified, as they are built into the hardware on the development board. However, [UEFI](https://de.wikipedia.org/wiki/Unified_Extensible_Firmware_Interface) is also used for booting normal Intel/AMD computers, and the [systemd-boot](https://www.freedesktop.org/software/systemd/man/latest/systemd-boot.html) boot loader is THE software that allows us to have and select from multiple NixOS generations on boot (and perform rollbacks if we messed up). Further details about the steps involved in achieving this can be found in the *Other Solutions* section, under *Generic UEFI Boot.*

Finally, there should also be [U-Boot](https://github.com/u-boot/u-boot) support soon, as most development boards are widely supported by the project. In that case, the boot process would look like:

## Proposed Solution

There is a repository aiming to develop a declarative way of defining Raspberry Pi setups, including, but not limited to, the Raspberry Pi 5. The project is called [nixos-raspberrypi](https://github.com/nvmd/nixos-raspberrypi?tab=readme-ov-file), and so far seems to be successful at achieving functioning system builds. It also provides a binary cache, speeding up iteration and deployment.

Take note that this solution reuses the proprietary firmware distributed by The Raspberry Pi Foundation. If that's not desired, one of the *Other Solutions* may be preferable.

Setting up a NixOS system on your Raspberry Pi 5 consists of a number of steps. First, it's important to get a SD Image installer onto the device. If you're not currently running on an ARM system (almost definitely the case), you have three options:

1.  Bootstrap a build machine onto the Raspberry Pi 5, for example with a standard Raspberry Pi OS SD card (use rpi-imager to enable sshd and set wifi credentials for a headless experience), \`apt install nix\` and run nix as root
2.  Cross compile the image
3.  Hope that the compiled image is available in the cache

### Step 1: Building the SD Image

The project provides build images as well, which are modified versions of the nix-hardware ones. Before getting into building one, in order to make use of the community binary caches, and potentially avoid rebuilding the image, make sure you are added to the trusted users in your own nix configuration: Or, alternatively, in your nixos configuration: Afterwards, you can build one of the SD images:

``` console
$ nix build github:nvmd/nixos-raspberrypi#installerImages.rpi5
```

You can either <a href="Cross_Compiling" class="wikilink" title="cross-compile">cross-compile</a> the image on your system, or alternatively, you can install the "normal" Raspberry Pi OS on your Raspberry Pi 5, then install Nix standalone (multi-user), and set it up as a <a href="distributed_build" class="wikilink" title="distributed build">distributed build</a> machine.

Finally, simply copy the image to the current directory from the `result` directory, extract it and write it to a USB drive, and boot to this drive on the raspberry pi (by default the raspberry pi will first try to boot the SD card, then the USB drive, so just don't put any SD card when booting and plug it later. Note that since the installer will format the SD card, you cannot put the installer on the SD card itself). You can find more information on the <a href="NixOS_on_ARM/Installation" class="wikilink" title="NixOS on ARM/Installation">NixOS on ARM/Installation</a> page.

### Step 2: Installing NixOS

Once you're running an installer image, you can create a flake referencing the repository. For example:Finally, simply `nixos-rebuild switch --flake .#yourHostname` the flake.

## Other Solutions

In general, as shown in in the first section, the closed source and proprietary software powering part of the Raspberry Pi development boards is a big source of contention. Therefore, there are largely two kinds of solutions going forward: **moving towards a generic boot process**, and **using proprietary software**, each with advantages and disadvantages.

### Using proprietary software

Besides the current *Proposed Solution*, there has been one more attempt at <https://github.com/tstat/raspberry-pi-nix> (just follow the example and hints at <https://github.com/tstat/raspberry-pi-nix/issues/13>) and has the best out-of-the-box experience. You have to remote-build many Nix packages, probably the kernel as well, yourself (e.g. using the [Pi without NixOS as an intermediate remote builder](https://wiki.nixos.org/wiki/Distributed_build)) and that can take several hours though.

### Generic UEFI Boot

This solution is technically more complex than the others, and the overview is separated into sections.

#### Raspberry Pi Boot stages

To understand the adaptions for NixOS better, it's helpful to understand more about the stages:

1\. **ROM boot loader**: The first-stage boot loader comes "burned in" on the Pi in a tiny <a href="wikipedia:Programmable_ROM#One_time_programmable_memory" class="wikilink" title="One-Time-Programmable memory (OTP)">One-Time-Programmable memory (OTP)</a> so it cannot be changed anymore. It's **only able to load the next second-stage boot loader below**, and reset it in case you have messed up.

See the [official documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#first-stage-bootloader).

Nothing to adapt here.

2\. **EEPROM boot loader**: The second-stage boot loader comes built-in on the Pi in a larger, rewriteable <a href="wikipedia:EEPROM" class="wikilink" title="EEPROM">EEPROM</a>. **This loader is also very limited and is only able to search for and start yet another, third-stage boot loader from other** storage hardware like an SD card, an NVMe SSD, a USB disk, or from the network.

This loader (like many second-stage boot loaders of other devices) is so size-constrained that it only contains the bare minimum code to be able to read from an FAT formatted partition. That's why you see and want a separate small `/boot` partition on your SD card or SSD that is formatted "FAT" or "VFAT", while your main data is stored on a second "rootfs" or `/` partition with fancy, newer partition types like "ext4", "ZFS" or "btrfs".

See the [official documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#second-stage-bootloader).

See [EEPROM image releases](https://github.com/raspberrypi/rpi-eeprom/releases) for improved and wider hardware support. This boot loader can be updated via the `rpi-eeprom-update` terminal tool (also [available in Nixpkgs](https://search.nixos.org/packages?channel=unstable&type=packages&query=raspberrypi-eeprom)) and loads the binary images (the `firmware-2712/pieeprom-*.bin` files) from the [rpi-eeprom GitHub project](https://github.com/raspberrypi/rpi-eeprom/tree/master/firmware-2712).

Nothing to adapt here yet. However, there's a [feature request to support smaller third-stage boot loaders in this second-stage](https://github.com/raspberrypi/firmware/issues/1857).

3\. **Firmware boot loader**: The third-stage boot loader is loaded from the first partition (usually called `/boot`) of an SD card, NVME SSD or other storage hardware described above. Because **size is usually not an issue here, you can have large, fully-fledged boot loaders** like [systemd-boot](https://www.freedesktop.org/software/systemd/man/latest/systemd-boot.html) (default with NixOS; requires UEFI), or full [U-Boot](https://github.com/u-boot/u-boot) (popular with embedded devices like the Pi) or [GRUB](https://www.gnu.org/software/grub/) (generally popular among Linux distros).

However, **the standard Pi 5 setup has no third-stage boot loader**. The second stage EEPROM boot loader loads the firmware (code to control other hardware on the Pi 5; [device tree files](https://en.wikipedia.org/wiki/Devicetree) in compact binary format `*.dtb`), some settings (`cmdline.txt` for kernel settings, `config.txt` for firmware settings), and the Linux kernel itself from a `/boot/firmware/` folder. On the Pi 5's default Debian image this is the `kernel2712.img` (specialized, more-performant kernel named after the Pi 5's Brodcom BCM2712 ARMv8 SoC chip) or as a fallback the `kernel8.img` (generic, slower ARMv8 kernel for the Pi 4 that also works for Pi 5) that you find on the [Pi firmware GitHub project](https://github.com/raspberrypi/firmware/tree/master/boot).

See the [official documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#differences-on-raspberry-pi-5).

#### Setting up a generic UEFI NixOS

The task to get a generic NixOS setup requires a

1.  UEFI boot loader for Pi 5: There exists a WIP [EDK2 for Pi 5 Github project](https://github.com/worproject/rpi5-uefi) but with a few limitations see the project for details.
2.  systemd-boot boot loader: Works
3.  generic Linux kernel that works for the Pi 5's ARM v8 processor and hardware: An almost generic Pi 5 compatible kernel exists [at the NixOS-hardware repository](https://github.com/NixOS/nixos-hardware/blob/master/raspberry-pi/5/default.nix); it's an adaption from a kernel for the Pi 4)

` 1. ROM -> 2. EEPROM -> 3. UEFI boot loader (EDK2) -> 4. systemd-boot boot loader -> Pi 4/5-adapted NixOS Kernel -> NixOS`

1\. **Install EDK2** (UEFI firmware implementation):

We need the first partition of the SD card (or NVMe SSD, etc.) again to be formatted as FAT but marked as an ESP (EFI System Partition) to conform to (U)EFI standards. In this partition we need to place the EDK2 firmware file `RPI_EFI.fd` and a `config.txt` file with a line `armstub=RPI_EFI.fd` which instructs the EEPROM boot loader to load EDK2 instead of a Linux loader stub.

See the [EDK2 for Pi 5 Github project](https://github.com/worproject/rpi5-uefi); the releases already contain both of these files.

See a [guide on how to setup partitions and these files](https://github.com/NixOS/nixpkgs/issues/260754#issuecomment-1908664693).

2\. **Install systemd-boot, kernel and NixOS**:

The rest is a usual NixOS installation on a second partition with the caveat to **select a Linux kernel that supports the Pi 5** like the [Pi 5 compatible Linux kernel is available in nixos-hardware](https://github.com/NixOS/nixos-hardware/pull/927).

Follow [this guide](https://github.com/NixOS/nixpkgs/issues/260754#issuecomment-1936211154) to build a NixOS system closure that you can install manually onto the Pi with a `nixos-install` call. That install tool will install the systemd-boot loader at `/boot/EFI/systemd/systemd-bootaa64.efi` and the kernel files at `/boot/EFI/nixos/*.efi` onto your first ESP partition and the rest of the NixOS system into your second partition.

#### Alternative board-specific installation notes

First, install EDK2, following the [instructions from the port README](https://github.com/worproject/rpi5-uefi#getting-started). With EDK2 installed as the Platform Firmware, you can follow the <a href="NixOS_on_ARM/UEFI" class="wikilink" title="standard instructions for UEFI on ARM">standard instructions for UEFI on ARM</a>.

EDK2 enables booting a mainline kernel, but hardware support will be very limited. Notably, you'll need to perform the installation using Wi-Fi, as Ethernet is unsupported. Once the system is installed, you can switch to the vendor's modified kernel. This is not (yet?) available in Nixpkgs, so you'll need to get it from [a flake](https://gitlab.com/vriska/nix-rpi5). If you're not using flakes, you can simply add this to your configuration:

For the vendor kernel to boot properly, you must switch from ACPI to Device Tree in the UEFI settings (at Device Manager → Raspberry Pi Configuration → ACPI / Device Tree → System Table Mode). When using the vendor kernel (which provides full power management support), you may additionally wish to remove `force_turbo=1` from `/boot/config.txt`.

If you are using nixos-unstable, then you can also use the rpi4 kernel (which is a generic aarch64 kernel for Pi 3 and later models). Although, due to a smaller page size, this will have slightly worse performance:

#### Troubleshooting

##### GPU

For the GPU drivers to work, `dtoverlay=vc4-kms-v3d-pi5` must be added to `/boot/config.txt`, and the vendor kernel must currently be used. Only Wayland-based compositors are supported without additional configuration (see the nixos-hardware PR linked previously). Note that Xwayland applications may produce broken graphics on KDE; the root cause of this issue has not yet been evaluated.

The rpi5-uefi download does not include overlays. You can get them by copying the `boot/overlays` folder from [the firmware repository](https://github.com/raspberrypi/firmware) to `/boot` (so that `/boot/overlays/vc4-kms-v3d-pi5.dtbo` is available).

##### Bluetooth

If your Bluetooth doesn't show up, and you are getting errors in dmesg regarding the serial port at 107050c00, add the following to your NixOS configuration:

#### Using the Pi 5 as a remote builder to build native ARM packages for the Pi 5

Building an NixOS system image that can be flashed to an SD card or NVMe SSD requires to **build ARM binaries**, more specifically for the `"aarch64-linux"`platform. From a typical Intel/AMD computer we can either

- **emulated native compile using QEMU** virtualization by enabling the [binfmt](https://docs.kernel.org/admin-guide/binfmt-misc.html) kernel feature on NixOS configuration setting `boot.binfmt.emulatedSystems = [ "aarch64-linux" ];`). This can be fast if everything is downloaded pre-compiled from the cache.nixos.org cache and only few packages really need local compilation. In reality it can be extremely slow, e.g. compiling a Linux kernel alone can take days.
- **cross-compile** to ARM using as to happen natively, but nothing will be cached from cache.nixos.org as this is not pre-build. So the compile itself is fast but there will be a lot more to compile locally. In practice it's quite fragile, because you may encounter packages that don't really support cross-compilation get stuck.
- **native compile on an remote builder** like the Pi 5 itself running its custom Debian Linux at the beginning or later NixOS. This is quite simple to setup and reasonably fast as most packages are pre-build and cached on cache.nixos.org, and building a remaining Linux kernel only takes 2-3h on the Pi 5.

**Setting up the Pi 5 as a remote native builder** can be done following the steps at <a href="Distributed_build" class="wikilink" title="https://wiki.nixos.org/wiki/Distributed_build"><span>https://wiki.nixos.org/wiki/Distributed_build</span></a>. The rough steps are as follows:

1.  **Install the Nix package manager** on Pi 5 Debian OS the normal, multi-user way with `sh <(curl -L https://nixos.org/nix/install) --daemon`. If you already have NixOS running on the Pi 5, then you can skip this step.
2.  **Setup a `ssh` connection** from your local machine to the Pi, especially adding `SetEnv PATH=/nix/var/nix/profiles/default/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin` to the Pi's `/etc/ssh/sshd_config` file. If you already have NixOS running on the Pi 5, then you can skip this step.
3.  **Make the remote Pi known to you local computer** by adding it as a `nix.buildMachines` entry to your `/etc/nix/configuration.nix` file and use connection protocol `ssh-ng`(!).
4.  You can then **build, e.g. an NixOS sd card image** with a call similar to `nix build .\#nixosConfigurations.pi5.config.system.build.sdImage`
5.  **flash that resulting image onto an SD card** or NVMe SSD using a call similar to `zstdcat result/sd-image/nixos-sd-image-23.11.20230703.ea4c80b-aarch64-linux.img.zst | sudo dd of=/dev/mmcblk0 bs=100M status=progress` and place that card into the Pi 5.

Missing:

1.  How to do cross-compilation. ( and/or explain why the above emulation is required at all)

#### Deploy and Update the Pi 5 NixOS system once it's running NixOS

Once the Pi 5 is running NixOS, you can update it with newer NixOS system configurations using e.g. the usual `nix-rebuild`

tool with a call similar to

`nixos-rebuild --flake .#pi5 --build-host piuser@pi5 --target-host piuser@pi5 --use-remote-sudo switch`

that uses the SSH connection from the remote builder section.

See [this guide](https://nixcademy.com/2023/08/10/nixos-rebuild-remote-deployment/) for a good explanation of this terminal call.

<a href="Category:NixOS_on_ARM" class="wikilink" title="Category:NixOS on ARM">Category:NixOS on ARM</a>
