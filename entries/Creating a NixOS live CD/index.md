<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Creating a NixOS live CD -->

<translate>

## Motivation

Creating a modified NixOS LiveCD out of an existing working NixOS installation has a number of benefits:

- Ensures authenticity.

<!-- -->

- No need for internet access.

<!-- -->

- It is easy to add your own packages and configuration changes to the image.

## Building

Building minimal NixOS installation CD with the `nix-build` command by creating this `iso.nix`-file. In this example with <a href="Neovim" class="wikilink" title="Neovim">Neovim</a> preinstalled.

</translate>

``` nix
{ config, pkgs, ... }:
{
  imports = [
    <nixpkgs/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix>

    # Provide an initial copy of the NixOS channel so that the user
    # doesn't need to run "nix-channel --update" first.
    <nixpkgs/nixos/modules/installer/cd-dvd/channel.nix>
  ];
  environment.systemPackages = [ pkgs.neovim ];
}
```

<translate>

Build the image via:

</translate>

``` bash
nix-build '<nixpkgs/nixos>' -A config.system.build.isoImage -I nixos-config=iso.nix
```

<translate>

Alternatively, use Nix <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> to generate a ISO installation image, using the `nixos-24.05` branch as nixpkgs source:

</translate> <translate>

The following commands will generate the iso-image:

</translate>

``` console

# nix build path:$PWD
```

<translate>

The resulting image can be found in `result`:

</translate>

``` console
$ ls result/iso/
nixos-24.05.20240721.63d37cc-x86_64-linux.iso
```

<translate>

### Testing the image

To inspect the contents of the ISO image:

</translate>

``` console
$ mkdir mnt
$ sudo mount -o loop result/iso/nixos-*.iso mnt
$ ls mnt
boot  EFI  isolinux  nix-store.squashfs  version.txt
$ umount mnt
```

<translate>

To boot the ISO image in an emulator:

</translate>

``` console
$ nix-shell -p qemu
$ qemu-system-x86_64 -enable-kvm -m 256 -cdrom result/iso/nixos-*.iso
```

<translate>

### SSH

In your `iso.nix`:

</translate>

``` nix
{
  ...
  # Enable SSH in the boot process.
  systemd.services.sshd.wantedBy = pkgs.lib.mkForce [ "multi-user.target" ];
  users.users.root.openssh.authorizedKeys.keys = [
    "ssh-ed25519 AaAeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee username@host"
  ];
  ...
}
```

<translate>

### Static IP Address

Static IP addresses can be set in the image itself. This can be useful for VPS installation.

</translate>

``` nix
{
  ...
  networking = {
    usePredictableInterfaceNames = false;
    interfaces.eth0.ipv4.addresses = [{
      address = "64.137.201.46";
      prefixLength = 24;
    }];
    defaultGateway = "64.137.201.1";
    nameservers = [ "8.8.8.8" ];
  };
  ...
}
```

<translate>

### Building faster

The build process is slow because of compression.

Here are some timings for `nix-build`:

| squashfsCompression             | Time | Size |
|---------------------------------|------|------|
| `lz4`                           | 100s | 59%  |
| `gzip -Xcompression-level 1`    | 105s | 52%  |
| `gzip`                          | 210s | 49%  |
| `xz -Xdict-size 100%` (default) | 450s | 43%  |

Compression results

See also: [mksquashfs benchmarks](https://gist.github.com/baryluk/70a99b5f26df4671378dd05afef97fce)

If you don't care about file size, you can use a faster compression by adding this to your `iso.nix`:

</translate>

``` nix
{
  isoImage.squashfsCompression = "gzip -Xcompression-level 1";
}
```

<translate>

## See also

- [NixOS Manual: Building a NixOS (Live) ISO](https://nixos.org/manual/nixos/stable/index.html#sec-building-image).

</translate>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Deployment" class="wikilink" title="Category:Deployment">Category:Deployment</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
