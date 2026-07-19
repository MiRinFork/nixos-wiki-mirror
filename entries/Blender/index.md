<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Blender -->

[Blender](https://www.blender.org/) is an open-source 3D suite for modelling, animation, VFX, and more.

## Installation

The default `blender` nix package is compiled without support for any compute APIs (CUDA, OptiX, oneAPI, HIP), and can be installed with the following in your configuration.

``` nix
environment.systemPackages = with pkgs; [
  blender
];
```

If you want to install Blender with support for compute APIs, see: <a href="#Advanced_Installation" class="wikilink" title="#Advanced Installation">#Advanced Installation</a>

## Configuration

### Installing With Additional Python Packages

To install additional Python modules into Blender, use the `withPackages` attribute.

Example using a normal Blender package:

``` nix
environment.systemPackages = with pkgs; [
  (blender.withPackages(ps: [ ps.pyserial ps.fs ]))
];
```

Examples using abnormal Blender Packages:

``` nix
let
  blender-cuda = blender.override {config.cudaSupport=true; config.rocmSupport=false; };
in {

  environment.systemPackages = with pkgs; [
    (blender-cuda.withPackages(ps: [ ps.yq ]))
#   (pkgsRocm.blender.withPackages(ps: [ ps.pyserial ps.fs ]))
  ];
}
```

In these functions, `ps` is an alias for `python313Packages`.

Installing with additional packages will result in a binary named `blender-wrapped`, as it adds the python modules by wrapping Blender in a custom Python environment.

When using a binary or unofficial Blender nix package, support for this feature will vary depending on if and how the packager implemented it.

A workaround if using a package that doesn't support `withPackages` is to install the python packages globally.

``` nix
environment.systemPackages = with pkgs; [
  python313Packages.yq
  python313Packages.pyserial
];
```

Or if it fits your use case better, you can install them in a nix-shell and run Blender from within that shell.

## Tips & Tricks

### Blendfarm

The Blendfarm network renderer for Blender is handled by . A very simple example configuration is shown below.

## Advanced Installation

- <a href="#Binary_Packages" class="wikilink" title="#Binary Packages">#Binary Packages</a> for Blender binary packages with support for all APIs
- <a href="#CUDA_&amp;_OptiX" class="wikilink" title="#CUDA &amp; OptiX">#CUDA &amp; OptiX</a> for support for NVIDIA's CUDA & OptiX
- <a href="#HIP" class="wikilink" title="#HIP">#HIP</a> for support for AMD's HIP
- <a href="#oneAPI" class="wikilink" title="#oneAPI">#oneAPI</a> for support for Intel's oneAPI
- <a href="#Last_Resorts" class="wikilink" title="#Last Resorts">#Last Resorts</a> if all other methods don't work for your situation

### Binary Packages

These are alternative distribution methods that package the Blender binaries, meaning they have support for all APIs.

#### Steam

Installing [Blender through Steam](https://store.steampowered.com/app/365670/Blender/) will run Linux native Blender in the Steam Runtime environment, and it will receive automatic updates through Steam. Note that if you make Steam run the Windows version (through Proton) by selecting "Force the use of a specific Steam Play compatibility tool" under Properties \> Compatibility, the APIs will fail as they will not have the relevant Windows drivers.

#### The blender-bin Flake

The unofficial [blender-bin](https://github.com/edolstra/nix-warez/tree/master/blender) flake, provided by edolstra, packages the binary release of Blender for NixOS, and hosts it on FlakeHub [here](https://flakehub.com/flake/edolstra/blender-bin?view=usage). The following demonstrates how to add the flake to a <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="flake-based configuration">flake-based configuration</a>.

### CUDA & OptiX

By default Nixpkgs builds software with CUDA (and therefore OptiX) support disabled, because of the unfree license. For Blender there are multiple ways around this, detailed below.

#### The cudaSupport Flag

Whether a compatible package is built with CUDA support is managed by the `cudaSupport` flag enabled.

The following example shows how to override specifically the Blender package for CUDA support, for general information on the topic see: <a href="CUDA#Enabling_CUDA_In_Packages" class="wikilink" title="Enabling CUDA In Packages">Enabling CUDA In Packages</a>.

``` nix
environment.systemPackages = with pkgs; [
  (blender.override {config.cudaSupport=true; config.rocmSupport=false;})

/* (blender.override {
    config.cudaSupport=true;
    config.rocmSupport=true;}) # to compile blender with both HIP and CUDA/OptiX support */
];
```

If installing Blender with `cudaSupport`, it is highly recommended you set up a <a href="CUDA#Setting_up_CUDA_Binary_Cache" class="wikilink" title="CUDA binary cache">CUDA binary cache</a>. If you do not have one set up, and install Blender with `cudaSupport`, your machine will be compiling Blender from source.

Compiling Blender is very resource-intensive, so if you are unable to use a binary cache, please see the associated warning and information in <a href="CUDA#Enabling_CUDA_In_Packages" class="wikilink" title="CUDA#Enabling CUDA In Packages">CUDA#Enabling CUDA In Packages</a>.

#### Community Flakes

In addition to the <a href="#The_blender-bin_Flake" class="wikilink" title="#blender-bin flake">#blender-bin flake</a>, there is also [blender-cuda-nixos](https://github.com/adithyagenie/blender-cuda-nixos), which compiles Blender with `cudaSupport` enabled and caches it on cachix so you don't need to build it yourself. For the most up-to-date instructions on adding it to your configuration, see its [README](https://github.com/adithyagenie/blender-cuda-nixos/blob/master/README.md).

### HIP

With the deprecation of the `blender-hip` package,[^1] the easiest way to add Blender with HIP support is now with the `pkgsRocm.blender` package. Other methods are to use the `rocmSupport` config variable, or to use a <a href="#Binary_Packages" class="wikilink" title="#Binary Package">#Binary Package</a>.

The below example is Blender-specific. For more general information on enabling ROCm/HIP in your configuration, see: <a href="AMD_GPU#Enabling_ROCm_&amp;_HIP_For_Packages" class="wikilink" title="AMD GPU#Enabling ROCm &amp; HIP For Packages">AMD GPU#Enabling ROCm &amp; HIP For Packages</a>.

``` nix
environment.systemPackages = with pkgs; [

  pkgsRocm.blender

/* (blender.override {
    config.rocmSupport=true;
    config.cudaSupport=false;}) # (equivalent to `pkgsRocm.blender`) */

/* (blender.override {
    config.cudaSupport=true;
    config.rocmSupport=true;}) # to compile blender with both HIP and CUDA/OptiX support */
];
```

### oneAPI

Currently, Nixpkgs has extremely limited oneAPI support (see ), which is explicitly blocking . As such, the current only way to have oneAPI support on NixOS is through one of the <a href="#Binary_Packages" class="wikilink" title="#Binary Packages">#Binary Packages</a>.

### Last Resorts

If nothing else works for your situation, you can also download the Blender binary from [blender.org](https://www.blender.org/download/) and run it in NixOS using a program like <a href="Nix-ld" class="wikilink" title="nix-ld">nix-ld</a> or [nix-alien](https://github.com/thiagokokada/nix-alien), patch the binary manually (see: <a href="Packaging/Binaries" class="wikilink" title="Packaging/Binaries">Packaging/Binaries</a>), or try using a container like <a href="Distrobox" class="wikilink" title="Distrobox">Distrobox</a> (see: [Distrobox: Using the GPU Inside the Container](https://distrobox.it/useful_tips/#using-the-gpu-inside-the-container)).

## Known Issues

### UI is dim on Vulkan backend and KDE Plasma

A cross-distro issue on KDE Plasma with NVIDIA. A workaround option that doesn't require downgrading is to force XWayland by running Blender with the following command. See more information at the related on Blender's repo.

``` sh
WAYLAND_DISPLAY=0 blender
```

## References

<references />

[^1]:
