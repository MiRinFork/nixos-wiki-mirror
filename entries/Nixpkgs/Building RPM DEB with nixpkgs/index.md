<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/Building RPM DEB with nixpkgs -->

------------------------------------------------------------------------

Please note that this page is under construction and the provided information is incomplete. Reach out to [matthiasbeyer](https://github.com/matthiasbeyer) if this page was not updated in a long time.

------------------------------------------------------------------------

## How it works

To build deb/rpm packages with nix/nixpkgs, it is critical to understand the process. Hence a short intro:

To build a deb or rpm package with nixpkgs, the build process needs a *disk image* which it then uses to boot a virtual machine (as in Qemu). Inside this virtual machine, the deb/rpm package is compiled from a *tarball* and then packaged using the respective tools for deb/rpm packaging.

Luckily, all that requirements are shipped inside nixpkgs itself.

## Preparation of the host machine

The host machine has to be prepared for the build process.

In the evaluation for this article, a CentOS 7 amd64 machine running in vmware was used. On the machine, the nix package manager was installed via `curl https://nixos.org/nix/install | sh` as suggested on <https://nixos.org/nix/> \> "Get Nix".

The configuration file `/etc/nix/nix.conf` was edited for the following contents:

    sandbox = false
    system-features = [ kvm nixos-test benchmark big-parallel ]

This step might not be necessary on a NixOS installation.

## How to build a deb/rpm with nixpkgs

The following approach can be used to try out building a `.deb` package with nixpkgs:

1.  Clone the official nixpkgs repository into `~/nixpkgs`
2.  Add a file to the nixpkgs repository `./deb.nix` with the following contents:

(In this scenario, ncurses was built for testing the whole approach)

``` nix
let
  pkgs = (import ./default.nix {});
  vm    = pkgs.vmTools.diskImageFuns.centos7x86_64 {};
  args = {
    diskImage = vm;
    diskImageFormat = "qcow2";
    src       = pkgs.ncurses.src;
    name      = "ncurses-deb";
    buildInputs = [];
    meta.description = "No descr";
  };
in pkgs.releaseTools.debBuild args
```

and then this file was called: `nix-build ./deb.nix`.

This loads the relevant disk images from the channel mirror and spins up the Qemu VM to build the package. The deb file (in this case, as we're building a deb with the expression from above) is located in ./result/debs/ after a successful build.
