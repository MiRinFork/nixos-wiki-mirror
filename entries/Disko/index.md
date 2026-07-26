<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Disko -->

<languages/> <translate> <strong>[Disko](https://github.com/nix-community/disko)</strong> is a utility and <a href="NixOS_modules" class="wikilink" title="NixOS module">NixOS module</a> for declarative disk partitioning.

[Disko Documentation Index](https://github.com/nix-community/disko/blob/master/docs/INDEX.md)

## Usage

The following example creates a new GPT partition table for the disk `/dev/vda` including two partitions for EFI boot and a <a href="Special:MyLanguage/bcachefs" class="wikilink" title="bcachefs">bcachefs</a> root filesystem.

</translate> <translate>

The following command will apply the disk layout specified in the configuration and mount them afterwards. Warning: This will erase all data on the disk.

</translate> <translate> </translate> <translate>

``` console
# nix run github:nix-community/disko/latest -- --mode disko ./disko-config.nix
```

Alternativley use a disk layout configuration of a [remote repository](https://github.com/Lassulus/flakes-testing) containing a `flake.nix` file as an entry point.

``` console
# nix run github:nix-community/disko/latest -- --mode disko --flake github:Lassulus/flakes-testing#fnord
```

The commands above requires <a href="Special:MyLanguage/Flake" class="wikilink" title="Flake">Flake</a> features available on your system.

To verify both partitions got mounted correctly, run

``` console
# mount | grep /mnt
```

## Configuration

In case the NixOS base system was installed on a partition layout bootstrapped with Disko, the disk config itself can be integrated into the system. First copy the file, for example `disko-config.nix` into your system configuration directory

``` console
# cp disko-config.nix /etc/nixos/
```

Add the Disko module on a flake-enabled system. Insert the required input and reference it and your `disko-config.nix` in the modules section. For alternative installation methods consult the Disko [quickstart guide](https://github.com/nix-community/disko/blob/master/docs/quickstart.md).

</translate> <translate>

Ensure that there are no automatically generated entries of `fileSystems` options in `/etc/nixos/hardware-configuration.nix`. Disko will automatically generate them for you. Rebuild your system to apply the Disko configuration.

</translate>

<a href="Category:Filesystem{{#translation:}}" class="wikilink" title="Category:Filesystem{{#translation:}}">Category:Filesystem{{#translation:}}</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a>
