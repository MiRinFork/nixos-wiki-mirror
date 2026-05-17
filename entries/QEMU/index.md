<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: QEMU -->

[QEMU](https://www.qemu.org/) is a generic and open source machine emulator and virtualizer.

For running virtual machines as a services see <a href="Libvirt" class="wikilink" title="Libvirt">Libvirt</a>.

## Setup

To install the main QEMU program system-wide, add the following to your `configuration.nix`:

``` nix
  environment = {
    systemPackages = [ pkgs.qemu ];
  };
```

### Quick EMU

Quickly create and run highly optimised desktop virtual machines for Linux, macOS and Windows; with just two commands.

<https://github.com/quickemu-project/quickemu>

``` bash
quickget windows 11
quickemu --vm windows-11.conf
```

## Configuration

### UEFI firmware support

To enable UEFI firmware support in Virt-Manager, Libvirt, Gnome-Boxes etc. add following snippet to your system configuration and apply it

``` nix
systemd.tmpfiles.rules = [ "L+ /var/lib/qemu/firmware - - - - ${pkgs.qemu}/share/qemu/firmware" ];
```

### Run binaries of different architecture

Following configuration will enable the emulation of different architectures. For example to run aarch64 and riscv64 binaries on an native x86_64 host, add following part to your system configuration, apply it and reboot your system.

``` nix
boot.binfmt.emulatedSystems = [
  "aarch64-linux"
  "riscv64-linux"
];
```

## Tips and tricks

### Emulate different architecture

The following <a href="Flake" class="wikilink" title="Flake">Flake</a> file constructs and executes a NixOS virtual machine with an architecture distinct from that of the host system; in this example, it utilizes aarch64.

Save the snippet as `flake.nix` and run `nix run` in the same directory to bootup the VM.

``` nix
{
  description = "Nix flake to build and run a NixOS VM for aarch64";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-24.05";
  };

  outputs = { self, nixpkgs }:
  let
    # Put your actual system of your machine here. In VM terms it is the "HOST"
    buildPlatform = "x86_64-linux";

    # Put the system you want to emulate here. In VM terms it is the "GUEST"
    hostPlatform = "aarch64-linux";

    pkgs = import nixpkgs { system = buildPlatform; };

    vmConfig = (pkgs.nixos {
      imports = [ "${nixpkgs}/nixos/modules/installer/cd-dvd/installation-cd-base.nix" ];
      nixpkgs = { inherit buildPlatform hostPlatform; };
    });
    vmIso = vmConfig.config.system.build.isoImage;
    vmPkgs = vmConfig.pkgs;

    vmScript = pkgs.writeShellScriptBin "run-nixos-vm" ''
      ${pkgs.qemu}/bin/qemu-system-aarch64 \
        -machine virt,gic-version=max \
        -cpu max \
        -m 2G \
        -smp 4 \
        -drive file=$(echo ${vmIso}/iso/*.iso),format=raw,readonly=on \
        -nographic \
        -bios ${vmPkgs.OVMF.fd}/FV/OVMF.fd
    '';

  in {
    packages.x86_64-linux.default = vmScript;
  };
}
```

Alternatively a different iso file can be specified in the drive-parameter, for example for Ubuntu Server ARM64.

Make sure to adjust the 2 toplevel variables to set up the cross compilation correctly. If your target is not AARCH64, you have to use the correct qemu binay in the start script.

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
