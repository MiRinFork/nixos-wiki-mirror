<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: IPXE -->

[iPXE](https://ipxe.org/) is an open-source network boot firmware.

## Customize Nix Package

While common iPXE configurations are already built & cached centrally, building custom iPXE images can be useful to make it easier to use in different environments, e.g. equipped with otherwise unsupported hardware. All [build configuration options](https://ipxe.org/buildcfg), [hardware drivers](https://ipxe.org/appnote/hardware_drivers) & [pre-configured targets](https://ipxe.org/appnote/buildtargets) are listed in the official iPXE documentation. This section should help you to “translate“ the instructions from the iPXE documentation to a working nix equivalent.

The iPXE [package.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/by-name/ip/ipxe/package.nix) in <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> allows you to change the build configuration and/or to build targets with a specific set of drivers. For that the package defines attributes which can be easily overriden.

`additionalOptions` allows you to define [build configuration options](https://ipxe.org/buildcfg). Where iPXE requires you to add a `#define OPTION_NAME` to a C header file, you can do the same by adding `"OPTION_NAME"` to the option list. Be aware that the iPXE option does not list all available options by design, you can find others by examining the C header files in `src/config` in their [GitHub repository](https://github.com/ipxe/ipxe.git). `additionalTargets` allows you to build iPXE artifacts for use in different environments. It is an attribute set, mapping from a target name to the resulting name of the output file. For iPXE, the target name defines which drivers (or set of drivers from a pre-configured target) should be compiled into your additional artifact. The general syntax of the target name is `[platform]/[driver].[extension]`, where multiple drivers are separated with `--`.[^1] The syntax is further explained [here](https://ipxe.org/appnote/buildtargets), where also a list of pre-configured targets (i.e. set of drivers) designed for common use cases is presented. A list of additional drivers is available [there](https://ipxe.org/appnote/hardware_drivers).

### Example as Standalone Flake

Following is a <a href="Flakes" class="wikilink" title="flake">flake</a> as a full standalone example. Its intended use is to be able to quickly compile a custom iPXE artifact for use on outside systems.

``` nix
{
  description = "custom iPXE build for USB network cards";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/unstable";
  outputs =
    { nixpkgs, ... }:
    {
      packages.x86_64-linux.ipxe = nixpkgs.legacyPackages.x86_64-linux.ipxe.override {
        additionalOptions = [
          "USB_HCD_USBIO"
        ];
        additionalTargets = {
          # build for platform: x86_64-efi
          # with driver (sets): ipxe, ecm, ncm
          # build a (normal) efi binary
          "bin-x86_64-efi/ipxe--ecm--ncm.efi" = "ipxe-usbnet.efi";
        };
      };
    };
}
```

Given the flake above, you can build your additional target by running `nix build nixpkgs#ipxe`. Then the custom artifact should be available behind the `result` symlink, in this example as `result/ipxe-usbnet.efi`. This does also compile the default outputs, but this should not be a big problem as they share nearly all of their code and so the compiler can reuse most of its work for all targets.

<a href="Category:Booting" class="wikilink" title="Category:Booting">Category:Booting</a>

[^1]: <https://ipxe.org/appnote/buildtargets>
