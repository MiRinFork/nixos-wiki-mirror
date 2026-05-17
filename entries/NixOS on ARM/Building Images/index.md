<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Building Images -->

## Build your own image natively

You can customize image by using the following snippet.

``` nix
# save as sd-image.nix somewhere
{ ... }: {
  imports = [
    <nixpkgs/nixos/modules/installer/sd-card/sd-image-aarch64.nix>
  ];
  # put your own configuration here, for example ssh keys:
  users.users.root.openssh.authorizedKeys.keys = [
     "ssh-ed25519 AAAAC3NzaC1lZDI1.... username@tld"
  ];
}
```

Then build with:

``` nix
$ nix-build '<nixpkgs/nixos>' -A config.system.build.sdImage -I nixos-config=./sd-image.nix
```

Note that this requires a machine with aarch64. You can however also build it from your laptop using an aarch64 remote builder as described in <a href="Distributed_build" class="wikilink" title="Distributed build">Distributed build</a> or ask for access on the [community aarch64 builder](https://github.com/nix-community/aarch64-build-box).

if you use the experimental flake, instead of doing the above stuff, can put the following lines in `flake.nix`, `git add flake.nix` and build with `nix build .#images.rpi2`:

``` nix
{
  description = "Build image";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
  outputs = { self, nixpkgs }: rec {
    nixosConfigurations.rpi2 = nixpkgs.lib.nixosSystem {
      modules = [
        "${nixpkgs}/nixos/modules/installer/sd-card/sd-image-raspberrypi.nix"
        {
          nixpkgs.config.allowUnsupportedSystem = true;
          nixpkgs.hostPlatform.system = "armv7l-linux";
          nixpkgs.buildPlatform.system = "x86_64-linux"; #If you build on x86 other wise changes this.
          # ... extra configs as above
        }
      ];
    };
    images.rpi2 = nixosConfigurations.rpi2.config.system.build.sdImage;
  };
}
```

### Cross-compiling

It is possible to cross-compile from a different architecture. To cross-compile to `armv7l`, on the same `sd-image.nix` add in `crossSystem`:

``` nix
{ ... }: {
  nixpkgs.crossSystem.system = "armv7l-linux";
  imports = [
    <nixpkgs/nixos/modules/installer/sd-card/sd-image-aarch64.nix>
  ];
  # ...
}
```

### Compiling through binfmt QEMU

It is also possible to compile for aarch64 on your non-aarch64 local machine, or a remote builder, by registering QEMU as a binfmt wrapper for the aarch64 architecture. This <b>wrapper uses emulation</b> and will therefore be slower than comparable native machines or cross-compiling.

To enable the binfmt wrapper on NixOS, add the following to `configuration.nix`

``` nix
{
  boot.binfmt.emulatedSystems = [ "aarch64-linux" ];
}
```

Then, add `--argstr system aarch64-linux` to the build command:

``` nix
$ nix-build '<nixpkgs/nixos>' -A config.system.build.sdImage -I nixos-config=./sd-image.nix --argstr system aarch64-linux
```

If you are building on non-NixOS machine with QEMU binfmt wrapper configured, you will want to configure nix daemon to let it know that it can build for aarch64. Add the following line to `/etc/nix/nix.conf`: `extra-platforms = aarch64-linux arm-linux`

If you want to build just one specific package, use this:

``` nix
nix-build '<nixpkgs/nixos>' -A pkgs.theRequiredPackage --argstr system aarch64-linux -I nixos-config=/path/to/target/machine/nixos/config/copy
```

(the last option should not be required on NixOS machines)

### Compiling through QEMU/kvm

It is also possible to build nixos images through full emulation using QEMU/kvm but will be way slower than native and binfmt QEMU.

## Alternatives to building custom images

### Stock NixOS installer image with custom U-Boot

The [Mic92/nixos-aarch64-images](https://github.com/Mic92/nixos-aarch64-images) repository provides a mechanism to modify the official NixOS installer to embed the board-specific U-Boot firmware required for different boards. This method does not require QEMU or native ARM builds since the existing Hydra-built U-Boot binaries are used.

### Editing the image manually

For some simple operations, like adding an SSH public key, the expected usage for new users is to manually edit the image, add the proper directory and `authorized_keys` file, with proper modes.

``` console
$ namei -l /home/nixos/.ssh/authorized_keys
f: /home/nixos/.ssh/authorized_keys
drwxr-xr-x root   root  /
drwxr-xr-x root   root  home
drwx------ nixos  users nixos
drwx------ nixos  users .ssh
-rw------- nixos  users authorized_keys
```
