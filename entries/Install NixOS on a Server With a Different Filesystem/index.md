<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Install NixOS on a Server With a Different Filesystem -->

Usually when installing NixOS, you boot from an external USB device containing the installer, which makes it easy to change the underlying filesystem. On a remote server however, this is usually not possible. This guide shows you how you can still make it work. Here it is shown with a DigitalOcean (DO) droplet initially running Debian, then replacing the original filesystem with ZFS and installing NixOS on it.

The trick to making this work is by building a [kexec](https://en.wikipedia.org/wiki/Kexec) compatible ramdisk NixOS system locally, transfering it to the server and use the `kexec` command to boot into it. Afterwards, you can install NixOS like you usually do.

## Requirements

To follow this guide you need a server with:

- A running Linux installation (This guide uses Debian)
- At least 2GB of RAM
- root ssh access
- The same architecture as your local machine

Note: DigitalOcean allows you to resize the droplet temporarily, which you can use to get enough RAM to do this, while reverting it once done.

## Building the system

To create the installation system, we use [clever's kexec config](https://github.com/cleverca22/nix-tests/tree/master/kexec) with some modifications. Clone the repository and create a file `myconfig.nix` with the following contents:

    {
      imports = [
        ./configuration.nix
      ];

      # Make it use predictable interface names starting with eth0
      boot.kernelParams = [ &quot;net.ifnames=0&quot; ];

      networking = {
        defaultGateway = &quot;x.x.x.x&quot;;
        # Use google's public DNS server
        nameservers = [ &quot;8.8.8.8&quot; ];
        interfaces.eth0 = {
          ipAddress = &quot;y.y.y.y&quot;;
          prefixLength = z;
        };
      };

      kexec.autoReboot = false;

      users.users.root.openssh.authorizedKeys.keys = [
        &quot;ssh-rsa ...&quot;
      ];
    }

Replace `x.x.x.x` with your servers IPv4 gateway, `y.y.y.y` with its IPv4 address and `z` with the subnet mask prefix. In DigitalOcean, you can find this info in your droplet's Networking tab in the Public Network section. Finally, put your ssh public key in the `users.users.root.openssh.authorizedKeys.keys` option.

Build the system configuration with

``` bash
nix-build '<nixpkgs/nixos>' -A config.system.build.kexec_tarball -I nixos-config=./myconfig.nix -Q
```

This may take a while. When it finishes you will find the finished system as a tarball in `./result/tarball`.

## Starting the built NixOS system on the server

Transfer the tarball to the server and ssh into it

``` bash
scp result/tarball/nixos-system-x86_64-linux.tar.xz root@y.y.y.y:.
ssh root@y.y.y.y
```

Then unpack the tarball and run the kexec script

``` bash
cd /
tar -xf ~/nixos-system-x86_64-linux.tar.xz
./kexec_nixos
```

1.  Wait until the `+ kexec -e` line shows up, then terminate the ssh connection by pressing the following keys one after the other: `RETURN` + `~` + `.`.
2.  Wait until you have a ping again by doing `ping y.y.y.y`.
3.  Reconnect with ssh, you should see a warning about the host identification having changed, which is a good sign in our case.
4.  Remove your server's previous entry in `~/.ssh/known_hosts` and try again.

If everything worked, you should now see the `[root@kexec:~]#` prompt. You're now running NixOS entirely in RAM!

## Installing NixOS

[Install NixOS like normal](https://nixos.org/manual/nixos/stable/#sec-installation-manual) (first paragraphs and section do not apply, you can directly go to [formatting](https://nixos.org/manual/nixos/stable/#sec-installation-manual-partitioning)), and make sure to include the following:

- `boot.kernelParams = [ "net.ifnames=0" ];`
- The same network configuration from above This is vital! The kexec will not survive a reboot, and formatting the drive will erase the existing OS. Therefore if you cannot ssh into the installed NixOS, you will be *permanently* unable to connect to the server (unless your VPS allows <a href="wikipedia:Out-of-band_management" class="wikilink" title="Out-of-Bounds management">Out-of-Bounds management</a>).

### Example installation with ZFS

Repartition your main disk using `fdisk` to such a configuration (you can remove all previous partitions):

    /dev/vda1 1M BIOS boot partition (BIOS boot)
    /dev/vda2 200M boot partition (EFI System)
    /dev/vda3 2GB swap partition (Linux swap)
    /dev/vda4 rest, zfs partition (Linux Filesystem)

Create the file systems:

``` bash
mkfs.ext4 /dev/vda2
mkswap /dev/vda3
zpool create -O compress=on -O mountpoint=legacy tank /dev/vda4
zfs create -o xattr=off -o atime=off tank/nix
```

Mount them:

``` bash
swapon /dev/vda3
mount -t zfs tank /mnt
mkdir /mnt/boot /mnt/nix
mount -t zfs tank/nix /mnt/nix
mount /dev/vda2 /mnt/boot
```

Generate the configs:

``` bash
nixos-generate-config --root /mnt
```

Edit `/mnt/etc/nixos/configuration.nix` to something like this:

    { config, pkgs, ... }:

    {
      imports =
        [
          ./hardware-configuration.nix
        ];

      boot.loader.grub.enable = true;
      boot.loader.grub.version = 2;

      boot.kernelParams = [ &quot;net.ifnames=0&quot; ];

      boot.zfs.devNodes = &quot;/dev&quot;;
      boot.loader.grub.device = &quot;/dev/vda&quot;;

      networking = {
        hostName = &quot;foobar&quot;;
        hostId = &quot;12345678&quot;;
        defaultGateway = &quot;x.x.x.x&quot;;
        nameservers = [ &quot;8.8.8.8&quot; ];
        interfaces.eth0 = {
          ipAddress = &quot;y.y.y.y&quot;;
          prefixLength = z;
        };
      };

      services.openssh.enable = true;

      users.users.root.openssh.authorizedKeys.keys = [
        &quot;ssh-rsa ...&quot;
      ];

      system.stateVersion = &quot;18.03&quot;; # Did you read the comment?
    }

And finally, install nixos and cross fingers:

``` bash
nixos-install
reboot
```

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
