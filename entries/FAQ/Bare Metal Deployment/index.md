<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/Bare Metal Deployment -->

Non-Nix bare metal deployments are typically maintained with a "converging" configuration manager like Puppet or Chef. NixOS's [module system](https://nixos.org/nixos/manual/index.html#sec-writing-modules) replaces these tools for per-host configuration mechanisms, like declaring various services, monitoring options, and configuration file contents. This makes the installation and configuration of your deployment fully declarative.

This module system can also be used to easily create virtual machines equivalent to the finally deployed image. This VM can then be used to run testing to ensure the service would behave as required.

Hydra is the Nix ecosystem's build server, which can provide a nice breakdown of dependencies and more naturally (when compared to Jenkins etc.) understands the robust build dependency tree inherent to Nix's build model: [<https://hydra.nixos.org/>](https://hydra.nixos.org/) and [<https://github.com/nixos/hydra/>](https://github.com/nixos/hydra/).

For example, this page tracks the specific tests required to pass before a new version of NixOS is released: [<https://hydra.nixos.org/job/nixos/trunk-combined/tested#tabs-constituents>](https://hydra.nixos.org/job/nixos/trunk-combined/tested#tabs-constituents).

The VMs that are built from a machine's configuration can easily be integrated with [NixOS's test infrastructure](https://nixos.org/nixos/manual/index.html#sec-nixos-tests) and Hydra to automatically verify package updates and system configurations behave as expected.

These integration tests and builds can be robustly distributed across a build fleet using [Nix's built in distributed build mechanism](https://nix.dev/manual/nix/stable/advanced-topics/distributed-builds). Unlike Jenkins and many other CI tools, the remote builders require no additional setup or specific software installed, beyond the standard Nix daemon configuration.

NixOps can be used to implement orchestration, though for dedicated hardware is not yet capable of handling the provisioning step of the hardware.

Handling initial hardware intake and burn-in would need to be handled separately, however NixOS's support for generating PXE images should make this not too difficult.

Kickstart's disk provisioning portion doesn't have an equal in the NixOS ecosystem, however can be accomplished using PXE-boot images and auto-run boot up phases which run disk formatting steps. For some prior work, check out [<https://github.com/grahamc/packet-provision-nixos-ipxe/>](https://github.com/grahamc/packet-provision-nixos-ipxe/). The parts around system configuration and package installation is completely and thoroughly covered by the module system and system configuration options that exist.
