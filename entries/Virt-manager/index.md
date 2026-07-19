<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Virt-manager -->

[Virt-manager](https://virt-manager.org/) (a.k.a. Virtual Machine Manager) is a GUI application for managing local and remote virtual machines through <a href="libvirt" class="wikilink" title="libvirt">libvirt</a>. It primarily targets KVM VMs, but also manages Xen and LXC (Linux Containers).

## Prequisites

Though Virt-manager (using the KVM hypervisor) is able to take advantage of virtualisation capabilities without any UEFI/BIOS configuration, best performance demands that the host have Vt-x and Vt-d (Intel) or AMD-V and AMD-Vi (AMD) enabled.

These settings can usually be found under the UEFI/BIOS settings.

## Installation

In your configuration file add:

### Networking

To use the default libvirt network, you will need to install the `dnsmasq` package. This is required for DNS and DCHP functionality within the network:

The default network starts off inactive, you must enable it before it is accessible. This can be done by running the following command:

``` console
# virsh net-start default
```

And if you would like to enable it automatically at boot:

``` console
# virsh net-autostart default
```

By default, this will enable a virtual network bridge under the name `virbr0`. You may need to allow it through your firewall filter like so:

### Display

The default video may not allow different resolutions and is limited. It is recommended to use Virtio instead.

For information on how to use Virtio with your VM's, [you can read up on Virtio on the libvirt wiki](https://wiki.libvirt.org/Virtio.html).

### Shared folders

To be able to share a folder with a guest, you will need 'virtiofsd'. The recommended way to solve this problem is now to add `pkgs.virtiofsd` to `virtualisation.libvirtd.qemu.vhostUserPackages`:

``` nix
virtualisation.libvirtd = {
  enable = true;
  qemu.vhostUserPackages = with pkgs; [ virtiofsd ];
};
```

### Windows Guest

See [Virtio-win guest tools](https://github.com/virtio-win/virtio-win-guest-tools-installer) for additional drivers for both paravirtual and emulated hardware

### Guest Agent

When running NixOS as a guest, enable the [QEMU guest agent](https://wiki.qemu.org/Features/GuestAgent) with:

``` nix
{
  services.qemuGuest.enable = true;
  services.spice-vdagentd.enable = true;  # enable copy and paste between host and guest
}
```

The host must [provide the needed virtio serial port](https://wiki.libvirt.org/Qemu_guest_agent.html#setting-qemu-ga-up) under the special name `org.qemu.guest_agent.0`.

### Wayland

In order to run on Wayland, virt-manager must be ran under XWayland with `$ GDK_BACKEND=x11 virt-manager` or a gdk cursor must be set. An example of setting a gdk cursor with home-manager is as follows:

``` nix
home.pointerCursor = {
   gtk.enable = true;
   package = pkgs.vanilla-dmz;
   name = "Vanilla-DMZ";
};
```

## Troubleshooting

### Unable to find 'efi' firmware

The following guide is to fix the following error which will occur when starting a virtual machine after NixOS upgrade: `Error: Error starting domain: operation failed: Unable to find 'efi' firmware that is compatible with the current configuration`

Solution:

1.  Delete old generations: `nix-collect-garbage -d`
2.  Find where the EFI boot loaded file is located: `find /nix/store/ -maxdepth 1 -type d -name "*qemu*" | xargs -I {} find "{}" -type f -name "edk2-x86_64-secure-code.fd"` Find the dir holding the latest qemu. The directory should be something like: `xbfjilai721rzd9rf9dhhpv03xza4xp4-qemu-9.1.3`. Take a note of this directory name.
3.  Open VM in virt-manager, go to XML and within the `<os ...>` tag:
    1.  Edit `<loader ...>` with the above directory name
    2.  Edit `<nvram ...>` with the above directory name.

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
