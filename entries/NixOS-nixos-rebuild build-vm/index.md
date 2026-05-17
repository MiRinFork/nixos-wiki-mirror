<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS:nixos-rebuild build-vm -->

The commands

- `nixos-rebuild build-vm`
- `nixos-rebuild build-vm-with-bootloader`

will build a virtual machine running NixOS with your system's configuration (usually `/etc/nixos/configuration.nix`) by using <a href="Qemu" class="wikilink" title="Qemu">Qemu</a>.

One of its usages is for testing new configurations without needing to try them on the host.

# Usage

## Create login user

Before calling one of the commands above, you will have to create a user with an initial password first which you can login to because your passwords of your current system are not carried over to the virtual machine.

Here is an example for a default user which you can simply add to your system config:

``` nix
users.users.nixosvmtest.isSystemUser = true;
users.users.nixosvmtest.initialPassword = "test";

users.groups.nixosvmtest = {};
users.users.nixosvmtest.group = "nixosvmtest";
```

See this [discourse-answer](https://discourse.nixos.org/t/default-login-and-password-for-nixos/4683/2) for more information.

## Create and run virtual machine

Create the virtual machine by using of the commands above. Afterwards you will find an executable file in `./result/bin`. By executing the file qemu will open up and you can start testing the system.

## Examples

``` bash
# build vm of your system config
nixos-rebuild build-vm

# e.g. to specify the environment variables / cores used
nixos-rebuild build-vm\
  -I nixos-config=./configuration.nix\
  -I nix_path='<nixpkgs/nixos>'\
  --max-jobs 4\
  --show-trace

# From the man page: This boots using the regular boot loader of your configuration
# rather than booting directly into the kernel and initial ramdisk of the system.
nixos-rebuild build-vm-with-bootloader
```

# Configure Virtual Machine

By default, the virtual machine is configured to have 1 CPU and 1024MiB memory. It may be too small for testing with a desktop environment enabled inside. You can configure the allocated resources with either

- [`virtualisation.vmVariant`](https://search.nixos.org/options?channel=25.05&show=virtualisation.vmVariant&query=virtualisation.vmVariant)
- [`virtualisation.vmVariantWithBootloader`](https://search.nixos.org/options?channel=25.05&show=virtualisation.vmVariantWithBootLoader&query=virtualisation.vmVariant)

by adding the following to your config:

``` nix
# replace `vmVariant` with `vmVariantWithBootLoader` if you are going to use `build-vm-with-bootloder`.
virtualisation.vmVariant = {
  # the following configuration is added only when building VM with `build-vm`
  virtualisation = {
    memorySize = 2048; # use 2048MiB memory
    cores = 3;         # use 3 cpu cores
  };
}
```

# Troubleshooting

## Still can't login after updating configuration

When running a virtual machine a file called `$hostname.qcow2` is created in your current working directory. After changing your `/etc/nixos/configuration.nix` delete this file, rebuild and then start the new virtual machine. Now you should be able to login.

# Networking

## qemu

To enable connecting from your host to your virtual machine, you'll need to forcefully override the default networking settings to apply those from <https://wiki.qemu.org/Documentation/Networking#How_to_get_SSH_access_to_a_guest> instead. For example, to expose the VM's port 80 on the (unprivileged) port 8009 of the 'localhost' of the host:

``` nix
{ config, pkgs, lib, modulesPath, ... }:

{
  imports = [
    (modulesPath + "/virtualisation/qemu-vm.nix")
  ];

  virtualisation.qemu.networkingOptions = lib.mkForce [
    "-device e1000,netdev=net0"
    "-netdev user,id=net0,hostfwd=tcp:127.0.0.1:8009-:80,\${QEMU_NET_OPTS:+,$QEMU_NET_OPTS}"
  ];

  networking.firewall.allowedTCPPorts = [
    80
  ];
}
```

# Alternatives

## Bootable ISO

Build it as a [bootable ISO image](https://nix.dev/tutorials/nixos/building-bootable-iso-image):

## VM

``` nix
{ 
...
  imports = [ 
    <nixos/nixos/modules/virtualisation/virtualbox-image.nix> ]
...
```

`nix build -f '`<nixpkgs/nixos>`' -I nixos-config=./configuration.nix config.system.build.virtualBoxOVA` [Source](https://discourse.nixos.org/t/nixos-rebuild-build-vm-not-portable-across-linux-distributions/28564/4)

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
