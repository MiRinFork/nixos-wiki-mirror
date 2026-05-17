<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vagrant Box -->

The vagrant cloud [has a NixOS box](https://app.vagrantup.com/nixos), but it is an older revision and hasn't been updated for a short while[^1], it is currently stuck to the much older 16.09 release.

The tooling used to build the boxes is still available and still maintained. It is **@zimbatm**'s \[<https://github.com/zimbatm/nixbox> nixbox\] project.

## Building a recent box

There are some small caveats with the tooling, one will need to do a bit of work to get it working, and then working in a reliable manner on slower hardware.

First, in the `nixos-x86_64.json` file, remove the post-processor of type atlas, unless you want to push the image on the vagrant cloud (you're on your own there).

Then, it may be necessary to increase the `boot_wait` a bit, on a Haswell laptop-class CPU, with SSD, 30 seconds was a few seconds too short, doubling is almost sure to be enough for most uses. This is only used once during the build of the .box file.

Then, continue with the [instructions in the README](https://github.com/zimbatm/nixbox#building-the-images).

## NixOS Plugin

The [vagrant-nixos-plugin](https://github.com/zimbatm/vagrant-nixos-plugin) project adds nix provisioning for NixOS guests in vagrant. The project's README should explain its use.

<hr />

[^1]: <https://logs.nix.samueldr.com/nixos/2018-01-10#822772>
