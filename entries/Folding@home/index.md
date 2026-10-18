<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Folding@home -->

## Foreword

From Wikipedia:

> **Folding@home** (**FAH** or **F@h**) is a distributed computing project aimed to help scientists develop new therapeutics for a variety of diseases by the means of simulating protein dynamics. This includes the process of protein folding and the movements of proteins, and is reliant on simulations run on volunteers' personal computers. Folding@home is currently based at the University of Pennsylvania and led by Greg Bowman, a former student of Vijay Pande.[^1]

## Installation

Basic installation requires following changes to the configuration:

``` nix
# Enable the Folding@home service.
services.foldingathome.enable = true;

# Create a system user that belongs to a group of the same name.
users.users.foldingathome = {
  isSystemUser = true;
  group = "foldingathome";
};
# Create a group "foldingathome" for the user
users.groups.foldingathome = {};

# The default service configuration is flawed, as 
# DynamicUser doesn't have the necessary permissions 
# to execute the cores that live in /var/lib/private
systemd.services.foldingathome.serviceConfig = {
  DynamicUser = lib.mkForce false;
  User = "foldingathome";
  Group = "foldingathome";
};
```

## Using computing power of GPUs

If you desire to use compute power of a GPU, then make the following changes to your configuration:

### Platform independent

``` nix
users.users.foldingathome.extraGroups = [ "video" "render" ];
```

### AMD

``` nix
hardware.graphics = {
  enable = true;
  extraPackages = [ pkgs.rocmPackages.clr.icd ];
};
```

### NVIDIA

The following configuration is hypothetical , as I don't have a machine with an Nvidia GPU.

As a hypothetical point of reference, I used the RTX 4070:

``` nix
hardware.graphics.enable = true;
services.xserver.videoDrivers = [ "nvidia" ];  # needed even if you run headless or Wayland

hardware.nvidia = {
  modesetting.enable = true;
  open = true;  # the 4070 (Ada) supports the open kernel modules
  package = config.boot.kernelPackages.nvidiaPackages.stable;
};
```

### Intel Arc Battlemage (B570, B580)

Again, this is also a hypothetical but furthermore, a path rarely trodden. Theoretically possible, but untested.

Folding@home cores need double-precision (FP64) math. **Intel Arc Alchemist (A310, A380, A750, A770)** GPUs don't have the hardware implementation for FP64; it's handled by the driver. **Battlemage (B570 and B580)** cards do have the FP64 hardware.

One user reported v8.3 recognized the card but showed `support: false` and couldn’t download GPU work units. Those posts are from 2024-2025, so I don’t know the status today, in October 2026.[^2]

If you want to try regardless:

``` nix
hardware.graphics = {
  enable = true;
  extraPackages = [ pkgs.intel-compute-runtime ];
};
```

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>

[^1]: <https://en.wikipedia.org/wiki/Folding@home>

[^2]: <https://forum.foldingathome.org/viewtopic.php?p=366886>
