<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Updating NixOS/zh -->

<languages/>

<span id="Introduction"></span>

## 介绍

<div lang="en" dir="ltr" class="mw-content-ltr">

<a href="NixOS" class="wikilink" title="NixOS">NixOS</a> stands out due to its declarative configuration and atomic updates, which ensure that system updates are predictable, reversible, and don’t risk breaking the setup. This approach guarantees consistency across versions, allowing any changes to be easily rolled back. NixOS also offers flexibility, multi-version support, and advanced dependency management, making it an excellent choice for developers and system administrators.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

As part of this process, only repository channels are updated or removed during updates. The system **requires an Internet connection** to download the latest changes, and users **cannot** directly modify the system. For optimal stability, security, and access to new features, regular updates — ideally **once a week** — are recommended.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Rebuilding the system after editing configuration.nix file

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To apply the configuration changes made in `/etc/nixos/configuration.nix` without updating the channels, <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> and package versions. This is typically used when you've edited the system configuration, and you just want to apply those changes:

</div>

``` console
# nixos-rebuild switch
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## For non-flake configurations

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

What follows is a short set of instructions. Further details can be found in the [NixOS Manual.](https://nixos.org/manual/nixos/stable/#sec-upgrading)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Updating NixOS channels

</div>

``` console
# nix-channel --update
```

<div lang="en" dir="ltr" class="mw-content-ltr">

For more information on channels, see the main <a href="Channel_branches" class="wikilink" title="Channel branches">Channel branches</a> page.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Rebuilding the system after updating channels

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to not only apply your configuration changes but also update the packages and system environment to the latest versions available from the Nixpkgs repository. This is typically used when you want to ensure you are using the latest versions of your software and system services:

</div>

``` console
# nixos-rebuild switch
```

To apply configuration changes and new package updates only **after** rebooting the system, use the following command instead:

``` console
# nixos-rebuild boot
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Updating channel and rebuilding the system

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The below command is a shortcut equivalent to running **nix-channel --update nixos; nixos-rebuild switch** previously described:

</div>

``` console
# nixos-rebuild switch --upgrade
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Changing Nixpkgs version

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To see what is the latest channel available, see <https://channels.nixos.org/>.

</div>

``` console
# nix-channel --add https://channels.nixos.org/nixos-<version> nixos
```

<span lang="en" dir="ltr" class="mw-content-ltr">=== Deleting old generations ===</span>

``` console
# nix-collect-garbage -d
```

<span lang="en" dir="ltr" class="mw-content-ltr">=== Example of a system update ===</span>

``` console
# nix-channel --update && nixos-rebuild switch && reboot
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## For flake based configurations

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Because <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> do not use channels and instead rely on explicitly defined inputs, updating a configuration involves modifying the system’s `flake.nix` to reference the desired versions of inputs. For example:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Once the input URLs have been updated, refresh the flake lockfile with:

</div>

``` console
# nix flake update
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Finally, rebuild the system configuration to apply the changes:

</div>

``` console
# nixos-rebuild switch
```

<span id="Tips_and_tricks"></span>

## 提示和技巧

<div lang="en" dir="ltr" class="mw-content-ltr">

### Limiting the maximum number of running jobs

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Sometimes, the update process may hang when the system CPU has a high number of cores. You can limit the maximum number of running jobs:

</div>

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
