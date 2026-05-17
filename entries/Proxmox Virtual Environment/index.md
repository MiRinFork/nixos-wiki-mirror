<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Proxmox Virtual Environment -->

[](https://www.proxmox.com/proxmox-ve) - shortened *PVE* - (<a href="wikipedia:en:{{PAGENAME}}" class="wikilink" title="wikipedia:en:{{PAGENAME}}">wikipedia:en:{{PAGENAME}}</a>) is a platform for containerization and virtualization.

PVE is open source and is based on Debian GNU/Linux (with a customized kernel from Ubuntu) and supports a variety of filesystems (e.g.<a href="ZFS" class="wikilink" title="ZFS">ZFS</a>) and storage-backends/network-filesystems (e.g.<a href="Ceph" class="wikilink" title="Ceph">Ceph</a>). <a href="Ceph" class="wikilink" title="Ceph">Ceph</a> can be setup, administrated and monitored through the Webinterface, just as most other functions of PVE. There is also an API and a way to configure PVE through Configfiles and CLI-Commands.

<figure>
<img src="Proxmox-VE-8-0-Cluster-Summary.png" title="Proxmox-VE-8-0-Cluster-Summary" />
<figcaption>Proxmox-VE-8-0-Cluster-Summary</figcaption>
</figure>

PVE can manage a "data center" as a cluster of machines and storage through a unified Webgui that allows management of the whole cluster through each of the nodes.

Proxmox VE uses

- <a href="#KVM" class="wikilink" title="#KVM">#KVM</a> for virtualization and
- <a href="#LXC" class="wikilink" title="#LXC">#LXC</a> for containerization.

NixOS runs on both.

> The instructions should work for PVE 7.2 and later with NixOS 22.05 and later.

## Deploying Proxmox with NixOS

The [proxmox-nixos](https://github.com/SaumonNet/proxmox-nixos/) project allows to run the Proxmox Hypervisor on top of NixOS.

## KVM

It is possible to generate generic qcow2 images and attach them to VMs with `qm importdisk` as shown [here](https://pve.proxmox.com/wiki/Migration_of_servers_to_Proxmox_VE#Importing_to_Proxmox_VE).

A better option is to generate a VMA image that can be imported as a VM on Proxmox VE. With this method, many VM configuration options such as CPU, memory, network interfaces, and serial terminals can be specified in nix instead of manually setting them on the Proxmox UI.

### Generating VMA

> The first run will take some time, as a patched version of qemu with support for the VMA format needs to be built

    nix run github:nix-community/nixos-generators -- --format proxmox

Pass additional nix configuration to the template with `--configuration filename.nix`. In addition to NixOS module options, proxmox-specific options present in [nixos/modules/virtualisation/proxmox-image.nix](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/virtualisation/proxmox-image.nix) can be used to set core, memory, disk and other VM hardware options.

### Deploying on Proxmox VE

The generated vma.zst file can be copied to `/var/lib/vz/dump/` (or any other configured VM dump storage path). A new VM can be spun up from it either using the GUI or the CLI:

    qmrestore /var/lib/vz/dump/vzdump-qemu-nixos-21.11.git.d41882c7b98M.vma.zst &lt;vmid&gt; --unique true

> note: the MAC address of net0 defaults to `00:00:00:00:00:00`. This must either be overridden through `proxmox.qemuConf.net0`, or the `unique` attribute must be set to true when importing the image on Proxmox.

By default, the generated image is set up to expose a serial terminal interface for ease of access.

    root@proxmox-server:~# qm start &lt;vmid&gt;
    root@proxmox-server:~# qm terminal &lt;vmid&gt;
    starting serial terminal on interface serial0 (press Ctrl+O to exit)

    &lt;&lt;&lt; NixOS Stage 1 &gt;&gt;&gt;

    loading module dm_mod...
    running udev...
    Starting version 249.4
    .
    .
    .
    [  OK  ] Reached target Multi-User System.


    &lt;&lt;&lt; Welcome to NixOS 21.11.git.d41882c7b98M (x86_64) - ttyS0 &gt;&gt;&gt;

    Run 'nixos-help' for the NixOS manual.

    nixos login: root (automatic login)


    [root@nixos:~]#

### Network configuration

Cloud-init can be enabled with

    services.cloud-init.network.enable = true;

This will enable systemd-networkd, allowing cloud-init to set up network interfaces on boot.

## LXC

### Generating LXC template

    nix run github:nix-community/nixos-generators -- --format proxmox-lxc

### Privileged LXCs

While it’s not necessary, `proxmoxLXC.privileged` can be set to true to enable the DebugFS mount in privileged LXCs. If enabled on unprivileged LXCs, this will fail to mount.

### Network configuration

The proxmox LXC template uses systemd-networkd by default to allow network configuration by Proxmox. `proxmoxLXC.manageNetwork` can be set to true to disable this.

### Deploying on Proxmox VE

Copy the tarball to Proxmox, then create a new LXC with this template through the web UI or the CLI. The “nesting” feature needs to be enabled. Newer versions of Proxmox will have it enabled by default.

As of now, not all of the configuration options on the web UI work for Proxmox LXCs. Network configuration and adding SSH keys to root user work, while setting a password for the root user and setting hostname don’t.

It is suggested to set a root password within the container on first boot.

The template built above without any options does not come with `/etc/nixos/configuration.nix`. A minimal working example is presented below. Be sure to run `nix-channel --update`, reboot the container running before `nixos-rebuild switch`.

``` nix
{ pkgs, modulesPath, ... }:

{
  imports = [
    (modulesPath + "/virtualisation/proxmox-lxc.nix")
  ];

  environment.systemPackages = [
    pkgs.vim
  ];
}
```

### LXC Console

You may need to set the Console Mode option to /dev/console (instead of the default of "tty") in order to make the console shell work.

### LXC See also

- earlier wiki page <a href="Proxmox_Linux_Container" class="wikilink" title="Proxmox Linux Container">Proxmox Linux Container</a>

## Name

*Proxmox Virtual Environment* is also called

  
short *Proxmox VE*,

shortened *PVE*,

just *Proxmox*.

Proxmox is the firm of the company *Proxmox Server Solutions GmbH*. Besides *Proxmox Virtual Environment* (*PVE*)[^1] there are other products called *Proxmox Backup Server* (*PBS*)[^2] and *Proxmox Mail Gateway* (*PMG*)[^3].

## References

<references />

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>

[^1]: <https://pve.proxmox.com/>

[^2]: <https://pbs.proxmox.com/>

[^3]: <https://pmg.proxmox.com/>
