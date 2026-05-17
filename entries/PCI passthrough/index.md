<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PCI passthrough -->

This guide details the configuration of PCI device passthrough using [VFIO](https://docs.kernel.org/driver-api/vfio.html) and [OVMF](https://github.com/tianocore/tianocore.github.io/wiki/OVMF) (an open-source [UEFI](https://en.wikipedia.org/wiki/UEFI) implementation for [QEMU](https://www.qemu.org/)) on NixOS. This setup allows you to assign a physical PCI device (typically a GPU) to a virtual machine (VM) at native hardware performance.

Prerequisites:

- Hardware with Intel VT-d or AMD-Vi enabled in BIOS.

<!-- -->

- A dedicated PCI device such as a GPU that is not required by the host system.

<!-- -->

- Kernel supporting IOMMU and VFIO. The default NixOS is sufficient.

# Configuration

For more in-depth information on PCI passthrough that is not specific to NixOS, refer to the [PCI passthrough via OVMF](https://wiki.archlinux.org/index.php/PCI_passthrough_via_OVMF) article on the Arch Wiki.

## VFIO Modules

The following kernel modules are required for PCI passthrough:

- `vfio_pci`
- `vfio`
- `vfio_iommu_type1`

If other drivers (e.g., for early modesetting such as `i915`, `amdgpu`, `radeon`, `nouveau`, etc.) are in use, they must be loaded after the VFIO modules.

After updating the configuration, run `nixos-rebuild switch` and reboot to ensure the required modules are loaded at boot.

## Kernel Parameters

To enable IOMMU functionality, the following <a href="Linux_kernel#Customizing_kernel_module_parameters" class="wikilink" title="kernel parameters">kernel parameters</a> are required:

- `intel_iommu=on` — for Intel CPUs

<!-- -->

- `amd_iommu=on` — for AMD CPUs

Additionally, specify the PCI vendor and device IDs of the devices to passthrough using the `vfio-pci.ids` parameter. These IDs can be obtained using the `lspci -nn` command.

``` console
$ lspci -nn
...
01:00.0 VGA compatible controller [0300]: Advanced Micro Devices, Inc. [AMD/ATI] Hawaii XT / Grenada XT [Radeon R9 290X/390X] [1002:67b0]
01:00.1 Audio device [0403]: Advanced Micro Devices, Inc. [AMD/ATI] Hawaii HDMI Audio [Radeon R9 290/290X / 390/390X] [1002:aac8]
```

In this example, an AMD GPU is passed through to the virtual machine. Note that the ids to both the VGA controller and it's associated audio device get passed to the kernel parameters

## libvirtd / QEMU

Enable the <a href="libvirt" class="wikilink" title="libvirt">libvirt</a> daemon with <a href="QEMU" class="wikilink" title="QEMU">QEMU</a> and OVMF (UEFI firmware) support. Secure Boot and TPM emulation are also enabled via swtpm and OVMF configuration.

Additionally, the <a href="Virt-manager" class="wikilink" title="Virt-manager">Virt-manager</a> application can be enabled for graphical VM management.

For more information on configuring virtualization, refer to the module options.

### Adding user to libvirtd group

For non-root users to manage virtual machines, add your user to the `libvirtd` group. Replace `myUser` with your actual username:

## VM setup and configuration

To configure networking for your virtual machine, you will need to set up a network. If you choose to use the default libvirt network, refer to the <a href="libvirt#Default_networking" class="wikilink" title="libvirt#Default networking">libvirt#Default networking</a> section for detailed instructions.

For instructions on setting up a virtual machine with attached PCI devices using `virt-manager`, refer to the [Setting up an OVMF-based guest virtual machine](https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF#Setting_up_an_OVMF-based_guest_virtual_machine) page on the Arch Wiki.

# See Also

- [PCI passthrough via OVMF - ArchWiki](https://wiki.archlinux.org/index.php/PCI_passthrough_via_OVMF)
- [Gaming in a Windows VM with NixOS - pigs.dev (April, 2025)](https://pigs.dev/posts/2025-04-15-gaming-in-vm-with-nixos.html)
- [A GPU Passthrough Setup for NixOS (with VR passthrough too!) - astrid.tech (September, 2022)](https://astrid.tech/2022/09/22/0/nixos-gpu-vfio/)
- [Notes on PCI Passthrough on NixOS using QEMU and VFIO - alexbakker.me (September, 2019)](https://alexbakker.me/post/nixos-pci-passthrough-qemu-vfio.html)
- [PCI Passthrough - GitHub Gist by techhazard (April, 2017)](https://gist.github.com/techhazard/1be07805081a4d7a51c527e452b87b26)

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a> <a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>
