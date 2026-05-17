<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Incus -->

[](https://linuxcontainers.org/incus/) (<s><a href="wikipedia:en:LXC#LXD" class="wikilink" title="wikipedia:en:LXC#LXD">wikipedia:en:LXC#LXD</a></s>) is a next generation system container and virtual machine manager. It is a community driven alternative to Canonical's <a href="LXD" class="wikilink" title="LXD">LXD</a>, keeping the Apache-2.0 license.

This document aims to provide NixOS specific information related to Incus. For non-NixOS specific documentation, please see the upstream documentation: <https://linuxcontainers.org/incus/docs/main/>

## Installation

The service can be enabled and started by adding the service to your NixOS configuration. It must still be initialized.

`virtualisation.incus.enable = true;`  
`networking.nftables.enable = true;`

See <a href="#Networking/Firewall" class="wikilink" title="#Networking/Firewall">#Networking/Firewall</a> for more information on the latter option.

To provide non-root access to the Incus server, you will want to add your user to the incus-admin group. Don't forget to reboot.

`users.users.YOUR_USERNAME.extraGroups = ["incus-admin"];`

You should now be able to use the incus client to talk to the server.

``` shell-session
[root@nixos:/etc/nixos]# incus version
If this is your first time running Incus on this machine, you should also run: incus admin init
To start your first container, try: incus launch images:ubuntu/22.04
Or for a virtual machine: incus launch images:ubuntu/22.04 --vm

Client version: 6.0.0
Server version: 6.0.0
```

## Initialization

As you can see in the above code block, adding the Incus service will provide a working instance of the server, but is not sufficient on its own to have a complete setup.

For more complex setups, please refer to <https://linuxcontainers.org/incus/docs/main/howto/initialize/>

### Minimal

The simplest way to initialize, Incus will provide a basic directory backed storage pool and a bridged NAT network with DHCP.

`incus admin init --minimal`

### Preseed

NixOS has an option for providing a preseed to Incus, as documented in the initialize link above. This is a declarative initialization, with the caveat that Incus preseed will never remove a resource created. Here is an example that is similar to the Minimal initialization option.

``` nix
virtualisation.incus.preseed = {
  networks = [
    {
      config = {
        "ipv4.address" = "10.0.100.1/24";
        "ipv4.nat" = "true";
      };
      name = "incusbr0";
      type = "bridge";
    }
  ];
  profiles = [
    {
      devices = {
        eth0 = {
          name = "eth0";
          network = "incusbr0";
          type = "nic";
        };
        root = {
          path = "/";
          pool = "default";
          size = "35GiB";
          type = "disk";
        };
      };
      name = "default";
    }
  ];
  storage_pools = [
    {
      config = {
        source = "/var/lib/incus/storage-pools/default";
      };
      driver = "dir";
      name = "default";
    }
  ];
};
```

## Networking/Firewall

When using Incus on NixOS, nftables is required to ensure broadest compatibility with other services that manage firewall rules. Trying to use iptables will fail eval, and this can be fixed by switching to nftables and for simple firewalls should be a drop-in replacement for iptables.

``` nix
networking.nftables.enable = true;
```

By default the NixOS firewall will block DHCP requests to the Incus network, meaning instances will not get an IPv4 address. Ensure you allow 53 for DNS and 67 for DHCPv4 on any Incus bridge network interfaces. This interface name should match the name given during initialization or configured through the incus interfaces.

``` nix
networking.firewall.interfaces.incusbr0.allowedTCPPorts = [
  53
  67
];
networking.firewall.interfaces.incusbr0.allowedUDPPorts = [
  53
  67
];
```

OR, the entire interface can be trusted.

``` nix
networking.firewall.trustedInterfaces = [ "incusbr0" ];
```

Prior to version [NixOS 23.11 "Tapir"](https://nixos.org/blog/announcements/2023/nixos-2311/) the default behavior of the NixOS nftables <a href="Firewall" class="wikilink" title="Firewall">Firewall</a> implementation was to flush the full ruleset at any change to the nftables rules. This behavior has since been changed; however, for back-portability, it still persists in configurations with a value set prior to `"23.11"`. This often results in the Incus ruleset table (named "incus") being wiped, resulting in loss of connectivity across VMs and containers. To prevent this from occurring on affected NixOS instances, the new implementation has to be enabled manually.

``` nix
networking.nftables.flushRuleset = false;
```

## NixOS Instances

To launch a new NixOS container use the following command.

    incus launch images:nixos/unstable nixos -c security.nesting=true

A NixOS virtual machine is launched with the following.

`incus launch --vm images:nixos/unstable nixos -c security.secureboot=false`

## NixOS Images

### Pre-built Images

NixOS images are available at <https://images.linuxcontainers.org/> providing VM and Container images for both stable and unstable NixOS.

``` shell-session
[root@nixos:/etc/nixos]# incus image list images:nixos
+-------------------------------+--------------+--------+---------------------------------------+--------------+-----------------+-----------+----------------------+
|             ALIAS             | FINGERPRINT  | PUBLIC |              DESCRIPTION              | ARCHITECTURE |      TYPE       |   SIZE    |     UPLOAD DATE      |
+-------------------------------+--------------+--------+---------------------------------------+--------------+-----------------+-----------+----------------------+
| nixos/23.11 (3 more)          | 1e606df4d91a | yes    | Nixos 23.11 amd64 (20240521_01:02)    | x86_64       | CONTAINER       | 124.84MiB | 2024/05/21 00:00 UTC |
+-------------------------------+--------------+--------+---------------------------------------+--------------+-----------------+-----------+----------------------+
| nixos/23.11 (3 more)          | a96494ff3c46 | yes    | Nixos 23.11 amd64 (20240521_01:02)    | x86_64       | VIRTUAL-MACHINE | 452.43MiB | 2024/05/21 00:00 UTC |
```

#### Creation

Container and VM images are built by Hydra as part of the [NixOS release](https://github.com/NixOS/nixpkgs/blob/master/nixos/release.nix).

<https://hydra.nixos.org/job/nixos/trunk-combined/nixos.incusContainerImage.x86_64-linux>

<https://hydra.nixos.org/job/nixos/trunk-combined/nixos.incusVirtualMachineImage.x86_64-linux>

The LXC Image Server then consumes them and repackages them using their CI.

Definition: <https://github.com/lxc/lxc-ci/blob/main/jenkins/jobs/image-nixos.yaml>

CI: <https://jenkins.linuxcontainers.org/job/image-nixos/>

## Custom Images

### VMs

All the necessary build infrastructure exists in nixpkgs to build custom images.

Define some NixOS systems.

``` nix
nixosConfigurations = {
  container = inputs.nixpkgs.lib.nixosSystem {
    system = "x86_64-linux";
    modules = [
      "${inputs.nixpkgs}/nixos/modules/virtualisation/lxc-container.nix"
      (
        { pkgs, ... }:
        {
          environment.systemPackages = [ pkgs.vim ];
        }
      )
    ];
  };

  vm = inputs.nixpkgs.lib.nixosSystem {
    system = "x86_64-linux";
    modules = [
      "${inputs.nixpkgs}/nixos/modules/virtualisation/incus-virtual-machine.nix"
      (
        { pkgs, ... }:
        {
          environment.systemPackages = [ pkgs.vim ];
        }
      )
    ];
  };
};
```

Then you can build the image and associated metadata.

``` shell-session
$ nix build .#nixosConfigurations.vm.config.system.build.qemuImage --print-out-paths
/nix/store/znk28bp34bycb3h5k0byb61bwda23q5l-nixos-disk-image

$ nix build .#nixosConfigurations.vm.config.system.build.metadata --print-out-paths
/nix/store/2snjw9y8brfh5gia44jv6bhdhmmdydva-tarball
```

Finally, you can manually import into an Incus storage pool and used to launch instances.

``` bash
$ incus image import --alias nixos-gen/custom/jellyfin /nix/store/2snjw9y8brfh5gia44jv6bhdhmmdydva-tarball/tarball/nixos-system-x86_64-linux.tar.xz /nix/store/znk28bp34bycb3h5k0byb61bwda23q5l-nixos-disk-image/nixos.qcow2
```

To build and import the VM in one command, follow the steps below.

``` bash
$ incus image import --alias nixos-gen/custom/jellyfin $(nix build .#nixosConfigurations.vm.config.system.build.metadata --print-out-paths)/tarball/nixos-system-x86_64-linux.tar.xz $(nix build .#nixosConfigurations.vm.config.system.build.qemuImage --print-out-paths)/nixos.qcow2

# Image imported with fingerprint: ***
```

You can verify the import with the commands below.

``` bash
$ incus image list nixos/custom/vm
+------------------------+--------------+--------+--------------------------------------------------+--------------+-----------+-----------+----------------------+
|         ALIAS          | FINGERPRINT  | PUBLIC |                   DESCRIPTION                    | ARCHITECTURE |   TYPE    |   SIZE    |     UPLOAD DATE      |
+------------------------+--------------+--------+--------------------------------------------------+--------------+-----------+-----------+----------------------+
| nixos/custom/vm | 9d0d6f3df0cc | no     | NixOS Uakari 24.05.20240513.a39a12a x86_64-linux | x86_64       | CONTAINER | 170.31MiB | 2024/05/21 09:21 EDT |
+------------------------+--------------+--------+--------------------------------------------------+--------------+-----------+-----------+----------------------+

$ incus launch nixos/custom/vm
Launching the instance
Instance name is: square-heron

$ incus shell square-heron

[root@nixos:~]# which vim
/run/current-system/sw/bin/vim
```

### Containers

``` bash
$ nix build .#nixosConfigurations.container.config.system.build.squashfs --print-out-paths
/nix/store/24djf2qlpkyh29va8z6pxrqp8x5z6xyv-nixos-lxc-image-x86_64-linux.img

$ nix build .#nixosConfigurations.container.config.system.build.metadata --print-out-paths
/nix/store/2snjw9y8brfh5gia44jv6bhdhmmdydva-tarball
```

``` shell-session
$ incus image import --alias nixos/custom/container /nix/store/2snjw9y8brfh5gia44jv6bhdhmmdydva-tarball/tarball/nixos-system-x86_64-linux.tar.xz /nix/store/24djf2qlpkyh29va8z6pxrqp8x5z6xyv-nixos-lxc-image-x86_64-linux.img
Image imported with fingerprint: 9d0d6f3df0cccec4da7ce4f69952bd389b6dd655fd9070e498f591aaffbb2cda

$ incus image list nixos/custom/container
+------------------------+--------------+--------+--------------------------------------------------+--------------+-----------+-----------+----------------------+
|         ALIAS          | FINGERPRINT  | PUBLIC |                   DESCRIPTION                    | ARCHITECTURE |   TYPE    |   SIZE    |     UPLOAD DATE      |
+------------------------+--------------+--------+--------------------------------------------------+--------------+-----------+-----------+----------------------+
| nixos/custom/container | 9d0d6f3df0cc | no     | NixOS Uakari 24.05.20240513.a39a12a x86_64-linux | x86_64       | CONTAINER | 170.31MiB | 2024/05/21 09:21 EDT |
+------------------------+--------------+--------+--------------------------------------------------+--------------+-----------+-----------+----------------------+

$ incus launch nixos/custom/container -c security.nesting=true
Launching the instance
Instance name is: square-heron

$ incus shell square-heron

[root@nixos:~] which vim
/run/current-system/sw/bin/vim
```

Or, the all in one command:

``` bash
incus image import --alias nixos/custom/vm $(nix build .#nixosConfigurations.vm.config.system.build.metadata --print-out-paths)/tarball/nixos-system-x86_64-linux.tar.xz $(nix build .#nixosConfigurations.vm.config.system.build.qemuImage --print-out-paths)/nixos.qcow2
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a> <a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
