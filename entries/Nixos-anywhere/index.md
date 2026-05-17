<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixos-anywhere -->

[nixos-anywhere](https://github.com/nix-community/nixos-anywhere) is a tool for installing NixOS to a remote machine. It uses kexec to boot into a temporary ram based NixOS system. From there, it can use a tool called disko to erase and repartition an entire disk, and install NixOS.

More information can be found on the official documents. <https://github.com/nix-community/nixos-anywhere>

# Installing MBR

The official documents recommend installing a GPT partition table, and installing an msdos partition table is not well supported, and there are no official examples. This is unfortunate, as many VPS do not use UEFI boot and are not over 4TB for the root partition. Additionally, on a VPS with limited disk space, it can be an unnecessary waste to create a separate partition for /boot.

Fortunately, it is possible to install an msdos partition table in spite of the lack of support. With an msdos partition table, a bootable system can be made with only 1 partition, allowing utilization of all 100% disk space. Below is a simple example for installing a <a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a> root filesystem as the only partition on disk. If a swap partition is desired, it can be added after install, as Btrfs has support for live filesystem resizing.

    # disk-config.nix
    # Example to create a msdos partition
    { lib, ... }:
    {
      disko.devices = {
        disk.disk1 = {
          device = lib.mkDefault "/dev/sda";
    #      type = "disk";
          content = {
            type = "table";
            format = "msdos";
            partitions = [
              {
                part-type = "primary";
                fs-type = "btrfs";
                name = "root";
                bootable = true;
                content = {
                  type = "filesystem";
                  format = "btrfs";
                  extraArgs = [ "-f" "-O block-group-tree" ];
                  mountpoint = "/";
                  mountOptions = [ "compress=zstd" ];
                };
              }
            ];
          };
        };
      };
    }

<a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
