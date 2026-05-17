<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OSX-KVM -->

The [OSX-KVM](https://github.com/kholia/OSX-KVM) project provides a quick method of running macOS on Linux machines.

## Installation

Enable virtualisation support in your system configuration by adding following lines

``` nix
{
  virtualisation.libvirtd.enable = true;
  users.extraUsers.youruser.extraGroups = [ "libvirtd" ];

  boot.extraModprobeConfig = ''
    options kvm_intel nested=1
    options kvm_intel emulate_invalid_guest_state=0
    options kvm ignore_msrs=1
  '';
}
```

Replace `youruser` with the user name of your running system. After applying the configuration, reboot your system so the changes to the kernel modules can take effect.

## Usage

Jonas Heinrich (GitHub user @onny) created a fork of the OSX-KVM repository with a flake. You can clone the fork and simply `nix run`, or, since the fork is several commits behind the original repo, you can complete the steps manually (see below), or copy the flake.nix to a clone of the original repo.

For the forked repo, git clone and run `nix run` to prepare and run a macOS system:

``` bash
git clone -b flake https://github.com/onny/OSX-KVM.git
cd OSX-KVM
nix run
```

Alternatively, clone the original repo, <https://github.com/kholia/OSX-KVM>. Then, copy over @onny's flake and `nix run`, or run the following manually. You will need the `python3` and `qemu` packages.

``` bash
# to fetch BaseSystem.dmg
python ./fetch-macOS-v2.py

# to convert BaseSystem.dmg to BaseSystem.img
qemu-img convert BaseSystem.dmg -O raw BaseSystem.img

# to create virtual hard drive image file mac_hdd_ng.img
qemu-img create -f qcow2 mac_hdd_ng.img 128G

# run launch script
# this runs qemu-system-x86_64 with the necessary arguments
source ./OpenCore-Boot.sh
```

In all cases, you can adjust the CPU count, memory, or other options in `./OpenCore-Boot.sh`. Currently (commit [da4b23b](https://github.com/kholia/OSX-KVM/tree/da4b23b5e92c5b939568700034367e8b7649fe90)), the script [recommends changing the CPU to `Haswell-noTSX` for macOS Sonoma](https://github.com/kholia/OSX-KVM/blob/da4b23b5e92c5b939568700034367e8b7649fe90/OpenCore-Boot.sh#L16).

On the first run, QEMU will boot into the macOS recovery image. From the boot menu, select the macOS Disk Utility and erase / format the virtual hard drive that will be used for installation (find the one with the same size as created in the script, 128GB by default).

Then choose the (re-)installer from the boot menu and select the previously created disk image as the installation target. This will then download the full image of the selected macOS version.

On the next boot, you will see a new boot entry containing the actual installation.

## See also

- [ngi-nix/OSX-KVM](https://github.com/ngi-nix/OSX-KVM): This implementation is based on [macOS-Simple-KVM](https://github.com/foxlet/macOS-Simple-KVM), and may not be as complete or polished as [kholia/OSX-KVM](https://github.com/kholia/OSX-KVM). Usage instructions are available in the repository README.

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
