<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Updating NixOS/en -->

<languages/>

## Introduction

<a href="NixOS" class="wikilink" title="NixOS">NixOS</a> stands out due to its declarative configuration and atomic updates, which ensure that system updates are predictable, reversible, and don’t risk breaking the setup. This approach guarantees consistency across versions, allowing any changes to be easily rolled back. NixOS also offers flexibility, multi-version support, and advanced dependency management, making it an excellent choice for developers and system administrators.

As part of this process, only repository channels are updated or removed during updates. The system **requires an Internet connection** to download the latest changes, and users **cannot** directly modify the system. For optimal stability, security, and access to new features, regular updates — ideally **once a week** — are recommended.

## Rebuilding the system after editing configuration.nix file

To apply the configuration changes made in `/etc/nixos/configuration.nix` without updating the channels, <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> and package versions. This is typically used when you've edited the system configuration, and you just want to apply those changes:

``` console
# nixos-rebuild switch
```

## For non-flake configurations

What follows is a short set of instructions. Further details can be found in the [NixOS Manual.](https://nixos.org/manual/nixos/stable/#sec-upgrading)

### Updating NixOS channels

``` console
# nix-channel --update
```

For more information on channels, see the main <a href="Channel_branches" class="wikilink" title="Channel branches">Channel branches</a> page.

### Rebuilding the system after updating channels

If you want to not only apply your configuration changes but also update the packages and system environment to the latest versions available from the Nixpkgs repository. This is typically used when you want to ensure you are using the latest versions of your software and system services:

``` console
# nixos-rebuild switch
```

To apply configuration changes and new package updates only **after** rebooting the system, use the following command instead:

``` console
# nixos-rebuild boot
```

### Updating channel and rebuilding the system

The below command is a shortcut equivalent to running **nix-channel --update nixos; nixos-rebuild switch** previously described:

``` console
# nixos-rebuild switch --upgrade
```

### Changing Nixpkgs version

To see what is the latest channel available, see <https://channels.nixos.org/>.

``` console
# nix-channel --add https://channels.nixos.org/nixos-<version> nixos
```

### Deleting old generations

``` console
# nix-collect-garbage -d
```

### Example of a system update

``` console
# nix-channel --update && nixos-rebuild switch && reboot
```

## For flake based configurations

Because <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> do not use channels and instead rely on explicitly defined inputs, updating a configuration involves modifying the system’s `flake.nix` to reference the desired versions of inputs. For example:

Once the input URLs have been updated, refresh the flake lockfile with:

``` console
# nix flake update
```

Finally, rebuild the system configuration to apply the changes:

``` console
# nixos-rebuild switch
```

## Tips and tricks

### Limiting the maximum number of running jobs

Sometimes, the update process may hang when the system CPU has a high number of cores. You can limit the maximum number of running jobs:

``` console
# nixos-rebuild switch --option max-jobs 8
```

To make the change permanent, add the following to your configuration.nix:

``` nix
nix = {
  settings = {
    max-jobs = 8;
  };
};
```

<a href="Category:NixOS{{#translation:}}" class="wikilink" title="Updating NixOS">Updating NixOS</a>
