<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on Hetzner Cloud -->

Hetzner Cloud in 2023 offers amd64 instances on both Intel and AMD hardware, as well as arm64 instanced based on the Ampere Altra Q80, in three locations in Europe, as well as two in America.

The pricing of the arm64 instances is generally considered very competitive, compared to similarly specced amd64 instances.

## Installation

There are several ways to install NixOS, such as the "traditional" ISO installation, <a href="nixos-infect" class="wikilink" title="nixos-infect">nixos-infect</a> or <a href="nixos-anywhere" class="wikilink" title="nixos-anywhere">nixos-anywhere</a>.

### Traditional ISO installation

In the Hetzner console, mount the NixOS minimal ISO into your server, and use the console to install NixOS.

#### x86_64

At time of writing, Hetnzer's x86_64 servers use legacy boot.

First, create a new MBR partition table.

` parted /dev/sda --script mklabel msdos`

Then create a 512MB boot partition with ext4

` parted /dev/sda --script mkpart primary ext4 1MiB 513MiB`  
` parted /dev/sda --script set 1 boot on`  
` mkfs.ext4 -L boot /dev/sda1`

Create a swap partition. This example uses 8GB, you may want to research the correct amount for your server size. Note the end of the swap partition in this command is 8577MiB, this is the value used in the next command.

` parted /dev/sda --script mkpart primary linux-swap 513MiB 8577MiB`  
` mkswap -L swap /dev/sda2`  
` swapon /dev/sda2`

Create a root partition using the rest of the disk with ext4.

` parted /dev/sda --script mkpart primary ext4 8577MiB 100%`  
` mkfs.ext4 -L nixos /dev/sda3`

If you don't mount the partitions you've just created, the NixOS installer will produce an error in the form \`Failed to get blkid info (returned 512) for on tmpfs at <path>/<prefix>-install-grub.pl\`.

` # Mount the partitions to /mnt and /mnt/boot.`  
` mount /dev/disk/by-label/nixos /mnt`  
` mkdir /mnt/boot`  
` mount /dev/disk/by-label/boot /mnt/boot`

Finally, install. Install from a remote flake:

` sudo nixos-install --flake github:`<username>`/`<repo>`#`<id>

Once installed, unmount the ISO and reboot.

##### Hetzner base configuration

In the example below, the id would be \`hetzner-x86_64\`.

The \`flake.nix\` file in the repo should be of the form:

` {`  
`   inputs = {`  
`     nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";`  
`   };`  
` `  
`   outputs = { nixpkgs, ... }: {`  
`     nixosConfigurations = {`  
`       hetzner-x86_64 = nixpkgs.lib.nixosSystem {`  
`         system = "x86_64-linux";`  
`         modules = [`  
`           ./configuration.nix`  
`         ];`  
`       };`  
`     };`  
`   };`  
` }`

With the referenced \`configuration.nix\` in the form.

Note the filesystems configuration, which matches the partition scheme, and the \`availableKernelModules\` section which includes modules that enable ext4 at boot.

Also note the user \`username\` which is configured to be part of the \`wheel\` group, and can therefore use \`sudo\`.

` { pkgs, ... }:`  
` `  
` {`  
`   nix.settings = {`  
`     experimental-features = "nix-command flakes";`  
`   };`  
`   `  
`   environment.systemPackages = [`  
`     pkgs.vim`  
`     pkgs.git`  
`   ];`  
`   `  
`   fileSystems."/" = {`  
`     device = "/dev/disk/by-label/nixos";`  
`     fsType = "ext4";`  
`   };`  
`   fileSystems."/boot" = {`  
`     device = "/dev/disk/by-label/boot";`  
`     fsType = "ext4";`  
`   };`  
`   swapDevices = [`  
`     {`  
`       device = "/dev/disk/by-label/swap";`  
`     }`  
`   ];`  
`   `  
`   time.timeZone = "Europe/London";`  
`   i18n.defaultLocale = "en_US.UTF-8";`  
`   console.keyMap = "us";`  
`   `  
`   boot.loader.grub.enable = true;`  
`   boot.loader.grub.device = "/dev/sda";`  
`   boot.initrd.availableKernelModules = [ "ahci" "xhci_pci" "virtio_pci" "virtio_scsi" "sd_mod" "sr_mod" "ext4" ];`  
`   `  
`   users.users = {`  
`     root.hashedPassword = "!"; # Disable root login`  
`     username = {`  
`       isNormalUser = true;`  
`       extraGroups = [ "wheel" ];`  
`       openssh.authorizedKeys.keys = [`  
`         `*`ssh-rsa `<your_ssh_public_key>*  
`       ];`  
`     };`  
`   };`  
`   `  
`   security.sudo.wheelNeedsPassword = false;`  
`   `  
`   services.openssh = {`  
`     enable = true;`  
`     settings = {`  
`       PermitRootLogin = "no";`  
`       PasswordAuthentication = false;`  
`       KbdInteractiveAuthentication = false;`  
`     };`  
`   };`  
`   `  
`   networking.firewall.allowedTCPPorts = [ 22 ];`  
`   `  
`   system.stateVersion = "24.11";`  
` }`

To access the VM, you will need to ensure that port 22 on the VM is opened via the Hetzner firewall if that is configured.

### nixos-anywhere

The tutorial assumes you already have an account on Hetzner Cloud, and no prior access to a system with NixOS or nix CLI utility installed.

1.  First upload your SSH key via the Hetzner Web UI
2.  Then click yourself a VM. For the OS choose Ubuntu but anything should work. This guide was tested with x86_64-linux but aarch64 should work with the note from below.
3.  Using a code editor on your host computer, create 4 files. File contents, as well as the location of where to put corresponding file are indicated below:
4.  /tmp/my-hetzner-vm/hardware-configuration.nix

{ config, lib, pkgs, modulesPath, ... }:

{

` imports = [`  
`   (modulesPath + "/profiles/qemu-guest.nix")`  
` ];`

` networking.useDHCP = lib.mkDefault true;`  
` nixpkgs.hostPlatform = lib.mkDefault "x86_64-linux";`

}

</syntaxhighlight>

``` nix
# /tmp/my-hetzner-vm/disko-config.nix

{
  disko.devices = {
    disk = {
      main = {
        type = "disk";
        device = "/dev/sda";
        content = {
          type = "gpt";
          partitions = {
            boot = {
              size = "1M";
              type = "EF02";
              priority = 1;
            };
            ESP = {
              size = "512M";
              type = "EF00";
              content = {
                type = "filesystem";
                format = "vfat";
                mountpoint = "/boot";
              };
            };
            root = {
              size = "100%";
              content = {
                type = "filesystem";
                format = "ext4";
                mountpoint = "/";
              };
            };
          };
        };
      };
    };
  };
}
```

``` nix
# /tmp/my-hetzner-vm/configuration.nix

{ config, lib, pkgs, ... }:

{
  imports =
    [
      ./hardware-configuration.nix
      ./disko-config.nix
    ];

  boot.loader.grub.enable = true;

  services.openssh.enable = true;

  users.users.eugene = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    initialHashedPassword = "$y$j9T$2DyEjQxPoIjTkt8zCoWl.0$3mHxH.fqkCgu53xa0vannyu4Cue3Q7xL4CrUhMxREKC"; # Password.123
  };

  programs.neovim = {
    enable = true;
    defaultEditor = true;
  };

  system.stateVersion = "24.11";
}        
```

**Note**: the value of `initialHashedPassword` above was obtained using `mkpasswd` command in Linux, and corresponds to `Password.123` string used as password.

``` nix
# /tmp/my-hetzner-vm/flake.nix

{
  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixos-24.11";
    };

    disko = {
      url = "github:nix-community/disko";
      inputs = {
        nixpkgs = {
          follows = "nixpkgs";
        };
      };
    };
  };

  outputs = inputs@{ self, nixpkgs, ... }: {
    nixosConfigurations = {
      my-hetzner-vm = nixpkgs.lib.nixosSystem {
        system = "x86_64-linux";

        modules = [
          ./configuration.nix
          inputs.disko.nixosModules.disko
        ];
      };
    };
  };
}
```

1.  To build NixOS from the flake run:

nix run --extra-experimental-features 'nix-command flakes' github:nix-community/nixos-anywhere -- --flake /tmp/my-hetzner-vm#my-hetzner-vm --target-host root@0.0.0.0 --build-on-remote

</syntaxhighlight>

**Note**: replace `0.0.0.0` with an IP address obtained during an earlier step. The NixOS on Hetzner is installed!

### disko

TODO: it would be neat to document how to boot from the NixOS ISO and create the machine based on an online description including <https://github.com/nix-community/disko> specs - should be a quick way to set up bespoke 'throwaway' machines.

references:

- <a href="Disko" class="wikilink" title="Disko">Disko</a>
- [sample regular hardware config](https://github.com/feelssexy/hetzner-auto-nixos/blob/main/hardware-configuration.nix)
- [sample config using disko](https://github.com/LGUG2Z/nixos-hetzner-cloud-starter/blob/master/disk-config.nix)

### nixos-infect

Beside the manual installation, one way to setup NixOS is to replace an existing installation, for example the latest Ubuntu image, with [nixos-infect](https://github.com/elitak/nixos-infect).

#### Cloud-init

You don't even need to log into the Ubuntu image, you can run nixos-infect from the 'could-init' as documented at <https://github.com/elitak/nixos-infect/tree/master#hetzner-cloud>

#### Manually

- Boot into the existing operating system, preferably Ubuntu or Debian
- Login as root or with root permissions
- Deploy your SSH public key for the current root user. This key will be used later for authentication into the NixOS system.
- Run following script. Replace `NIX_CHANNEL` variable with the version string you wish to install.

``` bash
curl https://raw.githubusercontent.com/elitak/nixos-infect/master/nixos-infect | NIX_CHANNEL=nixos-24.11 bash -x
```

- Reboot into NixOS

### Declarative

- [nixops](https://github.com/NixOS/nixops-hetzner)
- [terranix-hcloud](https://github.com/terranix/terranix-hcloud/)
- [teraflops](https://github.com/aanderse/teraflops)
- [nixos-hcloud-packer](https://github.com/selaux/nixos-hcloud-packer)

## Network configuration

Hetzner Cloud offers both IPv4 (/32 subnet) and IPv6 (/64 subnet) connectivity to each machine. The assigned addresses can be looked up on the [Hetzner Cloud Console](https://console.hetzner.cloud) from the "Networking" tab on the instance details. The public IPv4 address of the server can automatically obtained be via DHCP. For IPv6 you have to statically configure both address and gateway.

``` nix
systemd.network.enable = true;
systemd.network.networks."30-wan" = {
  matchConfig.Name = "ens3"; # either ens3 or enp1s0, check 'ip addr'
  networkConfig.DHCP = "ipv4";
  address = [
    # replace this subnet with the one assigned to your instance
    "2a01:4f8:aaaa:bbbb::1/64"
  ];
  routes = [
    { Gateway = "fe80::1"; }
  ];
};
```

### Static IPv4 configuration

The IPv4 address can also be configured statically. The trick here is, that the gateway needs to be configured with the `onlink` flag, because it is not in the same subnet as your public IP address, but still very much on that same link.

``` nix
systemd.network.networks."30-wan" = {
  matchConfig.Name = "ens3"; # either ens3 (amd64) or enp1s0 (arm64)
  networkConfig.DHCP = "no";
  address = [
    # replace this address with the one assigned to your instance
    "A.B.C.D/32"
    # replace this subnet with the one assigned to your instance
    "2a01:4f8:AAAA:BBBB::1/64"
  ];
  routes = [
    { Gateway = "172.31.1.1"; GatewayOnLink = true; }
    { Gateway = "fe80::1"; }
  ];
};
```

## AArch64 (CAX instance type) specifics

If the screen goes blank after selecting the boot option in the bootloader, the following snippet makes sure that GPU drivers are available in initrd, and the correct device gets used for the serial console:

``` nix
boot.initrd.kernelModules = [ "virtio_gpu" ];
boot.kernelParams = [ "console=tty" ];
```

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
