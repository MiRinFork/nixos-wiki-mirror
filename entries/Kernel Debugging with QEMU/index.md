<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kernel Debugging with QEMU -->

## Set up the QEMU VM

### With a Nix-built kernel

Use a NixOS config like below. See <a href="Linux_kernel#Custom_configuration" class="wikilink" title="Linux kernel#Custom configuration">Linux kernel#Custom configuration</a> for more information about patching and configuring the kernel's build.

``` nix
{ config, pkgs, lib, modulesPath, ... }:

{
  imports = [
    (modulesPath + "/virtualisation/qemu-vm.nix")
  ];

  boot.kernelPackages = pkgs.linuxPackagesFor (pkgs.linux.overrideAttrs(a: {
    # To make sure debug_info is not stripped from kernel modules
    dontStrip = true;
  }));

  boot.kernelPatches = [
    {
      name = "enable debugging information";
      patch = null;
      structuredExtraConfig = {
        GDB_SCRIPTS = lib.kernel.yes;
        DEBUG_INFO = lib.kernel.yes;
        KALLSYMS = lib.kernel.yes;
      };
    }
    {
      # https://lkml.kernel.org/r/20250618134629.25700-2-johannes@sipsolutions.net
      name = "scripts: gdb: move MNT_* constants to gdb-parsed";
      patch = (pkgs.fetchpatch {
        url = "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/patch/?id=41a7f737685eed2700654720d3faaffdf0132135";
        hash = "sha256-cWlM6hLGhHUQI87jDbAvLdUb+T34Am+hpjda35Myxfw=";
      });
    }
  ];
  boot.kernelParams = [
    # Avoid kernel address space layout randomization
    "nokaslr"
  ];
  virtualisation.qemu.options = [
    # make qemu listen for gdb on :1234
    "-s"
  ];

  environment.systemPackages = with pkgs; [
    vim
    iotop
    gdb
  ];
  
  system.stateVersion = "25.05";
}
```

#### Loading module symbols and accurate kernel sources

Make sure you're using a branch of nixpkgs that has <https://github.com/NixOS/nixpkgs/pull/432405> applied.

This generates a script that starts gdb with module symbols and kernel sources attached:

``` nix
  users.motd =
    let
      gdbScript = pkgs.writeScript "attach-gdb.sh" ''
        mkdir -p /tmp/gdb
        cd /tmp/gdb
        rm -rf *

        ls ${pkgs.srcOnly config.boot.kernelPackages.kernel} | while read line ; do ln -s ${pkgs.srcOnly config.boot.kernelPackages.kernel}/$line $line ; done

        mkdir kos
        cd kos

        cp ${config.boot.kernelPackages.kernel}/lib/modules/*/kernel/fs/netfs/* .
        cp ${config.boot.kernelPackages.kernel}/lib/modules/*/kernel/fs/9p/* .
        cp ${config.boot.kernelPackages.kernel}/lib/modules/*/kernel/net/9p/* .
        xz -d *
        GDB_SCRIPT_DIR=$(echo ${config.boot.kernelPackages.kernel.dev}/lib/modules/*/build/scripts/gdb)

        gdb \
          -ex "python import sys; sys.path.insert(0, '$GDB_SCRIPT_DIR')" \
          -ex "target remote :1234" \
          -ex "source $GDB_SCRIPT_DIR/vmlinux-gdb.py" \
          -ex "lx-symbols" \
          ${config.boot.kernelPackages.kernel.dev}/vmlinux
      '';
    in ''
      look at /repro/default.json

      kernel at ${config.boot.kernelPackages.kernel}
      kernel dev at ${config.boot.kernelPackages.kernel.dev}

      attach gdb with ${gdbScript} on the host
    '';
```

### With a manually-built kernel

Clone the repository

``` console
$ git clone https://github.com/torvalds/linux.git
```

For kernel dependencies, create a `shell.nix` file in the cloned repo:

``` nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "linux-kernel-build";
  nativeBuildInputs = with pkgs; [
    getopt
    flex
    bison
    gcc
    gnumake
    bc
    pkg-config
    binutils
  ];
  buildInputs = with pkgs; [
    elfutils
    ncurses
    openssl
    zlib
  ];
}
```

Older kernel versions might buildFHSUserEnv as they have absolute shebangs:

``` nix
{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "linux-kernel-build";
  targetPkgs = pkgs: (with pkgs;  [
    getopt
    flex
    bison
    elfutils
    binutils
    ncurses.dev
    openssl.dev
    zlib.dev
    gcc
    gnumake
    bc
  ]);
  runScript = "bash";
}).env
```

#### Generate a config for KVM

If on `make` you get asked some questions, just press enter till you are done, this will select the default answer.

``` console
$ cd linux
$ make mrproper # Clears all artifacts, do this especially if you upgrade from a significant old version
$ nix-shell shell.nix
$ make defconfig kvm_guest.config
$ scripts/config --set-val DEBUG_INFO y # For gdb debug symbols
$ scripts/config --set-val DEBUG y # All pr_debug messages get printed
$ scripts/config --set-val GDB_SCRIPTS y
$ scripts/config --set-val DEBUG_DRIVER y # Enable printk messages in drivers
# everything as one command for copy'n'paste
$ scripts/config --set-val DEBUG_INFO y --set-val DEBUG y  --set-val GDB_SCRIPTS y --set-val DEBUG_DRIVER y
# this might ask for further options, just press enter for every question
$ make -j$(nproc)
```

#### Create a bootable NixOS image with no kernel

Save this as `nixos-image.nix`:

``` nix
{ pkgs ? import <nixpkgs> {} }:
import (pkgs.path + "/nixos/lib/make-disk-image.nix") {
  config = (import (pkgs.path + "/nixos/lib/eval-config.nix") {
    inherit (pkgs) system;
    modules = [{
      imports = [ ./nixos-config.nix ];
    }];
  }).config;
  inherit pkgs;
  inherit (pkgs) lib;
  diskSize = 2048;
  partitionTableType = "none";
  # for a different format
  format = "qcow2";
}
```

Than follows the nixos configuration in a file named `nixos-config.nix`

``` nix
{ pkgs, lib, modulesPath, ... }:

{
  imports = [
    (modulesPath + "/profiles/qemu-guest.nix")
  ];
  boot.loader.grub.enable = false;
  boot.initrd.enable = false;
  boot.isContainer = true;
  boot.loader.initScript.enable = true;
  ## login with empty password
  users.extraUsers.root.initialHashedPassword = "";

  networking.firewall.enable = false;

  services.getty.helpLine = ''
    Log in as "root" with an empty password.
    If you are connect via serial console:
    Type Ctrl-a c to switch to the qemu console
    and `quit` to stop the VM.
  '';

  services.getty.autologinUser = lib.mkDefault "root";

  documentation.doc.enable = false;
  documentation.man.enable = false;
  documentation.nixos.enable = false;
  documentation.info.enable = false;
  programs.bash.enableCompletion = false;
  programs.command-not-found.enable = false;
}
```

Than build with the following commands:

``` console
$ nix-build
# copy out
$ install -m644 result/nixos.qcow2 qemu-image.img
```

Than follow with the next step is launching qemu.

#### Create a bootable Debian image with replaceable kernel

If you want to build a different Linux distro you can use the following instructions to build a debian instead:

``` console
 $ nix-shell -p debootstrap qemu
 $ qemu-img create qemu-image.img 5G
 $ mkfs.ext2 qemu-image.img
 $ mkdir mount-point.dir
 $ sudo mount -o loop qemu-image.img mount-point.dir
 $ sudo debootstrap --arch amd64 buster mount-point.dir
 $ sudo chroot mount-point.dir /bin/bash -i
 $ export PATH=$PATH:/bin
 $ passwd # Set root password
 $ exit
 $ sudo umount mount-point.dir
```

#### Installing tools to the image

The filesystem is mounted read only so to add tools like lspci. Mount and chroot then use apt to install the needed binaries.

``` console
 $ sudo  mount -o loop qemu-image.img mount-point.dir
 $ sudo chroot mount-point.dir /bin/bash -i
 $ export PATH=$PATH:/bin
 $ apt install pciutils tree
 $ sudo umount mount-point.dir 
```

#### Launch qemu

You can find a slighty stripped version of qemu in a package called `qemu_kvm` (qemu without emulation support for other cpu architectures). The `nokaslr` kernel flag is important to be able to set breakpoints in kernel memory. You can also skip the `-S` to not make qemu break on startup and waiting for gdb.

``` console
 $ qemu-system-x86_64 -s -S \
    -kernel arch/x86/boot/bzImage \
    -hda qemu-image.img \
    -append "root=/dev/sda console=ttyS0 nokaslr" \
    -enable-kvm \
    -nographic
```

#### Connect with gdb

``` console
 $ echo "add-auto-load-safe-path `pwd`/scripts/gdb/vmlinux-gdb.py" >> ~/.gdbinit
 $ gdb -ex "target remote :1234" ./vmlinux
 (gdb) continue
```

Note that setting breakpoints in early boot might not work for all functions. If a breakpoint is not triggered as expected try to set the breakpoint later when the VM is fully booted.

#### Language server support

If you want language server support for the kernel code you can generate a compile_commands.json with

``` console
$ python ./scripts/clang-tools/gen_compile_commands.py 
```

This can be used for example in combination with clangd, which scales well to size of the linux kernel.

#### Debugging drivers

Make sure the driver you want to inspect is not compiled into the kernel, look for the option to enable compilation of your driver, to do this execute:

``` console
 $ make nconfig
```

press `F8` and search for your driver, and check if it is set to "Module" with <M>. After compilation copy the driver.ko into the mounted `qemu-image.img`. Unmount start the kernel and break at the `load_module` function and `insmod driver.ko`. Happy hacking!

#### Bugs

1\. With the nixos-config provided above, the console does not work properly. boot.isContainer = true; implies console.enable = false; that disables console. The following can be used as a workaround.

``` nix
console.enable = true;
systemd.services."serial-getty@ttyS0".enable = true;
```

## Using ktest with NixOS

Yellow onion has integrated nixos vms into ktest:

<https://github.com/YellowOnion/ktest/commit/73fadcff949236927133141fcba4bfd76df632e7>

This integration also allows to use incremental kernel builds for rapid development. Checkout the commit message for details.

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
