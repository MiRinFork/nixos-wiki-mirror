<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: CUDA -->

NixOS supports using NVIDIA GPUs for pure computing purposes, not just for graphics. For example, many users rely on NixOS for machine learning both locally and on cloud instances. These use cases are supported by the [@NixOS/cuda-maintainers team](https://github.com/orgs/NixOS/teams/cuda-maintainers) on GitHub ([project board](https://github.com/orgs/NixOS/projects/27)). If you have an issue using your NVIDIA GPU for computing purposes [open an issue](https://github.com/NixOS/nixpkgs/issues/new/choose) on GitHub and tag `@NixOS/cuda-maintainers`.

## Driver Installation

Assuming you've followed the <a href="NVIDIA" class="wikilink" title="NVIDIA">NVIDIA</a> page correctly, and have a CUDA compatible GPU, you shouldn't need to do any further configuration. You can confirm your CUDA version by running the following command in your terminal.

## `cudatoolkit`, `cudnn`, and related packages

The CUDA toolkit is available in a [number of different versions](https://search.nixos.org/packages?channel=unstable&from=0&size=50&buckets=%7B%22package_attr_set%22%3A%5B%22cudaPackages%22%5D%2C%22package_license_set%22%3A%5B%5D%2C%22package_maintainers_set%22%3A%5B%5D%2C%22package_platforms%22%3A%5B%5D%7D&sort=relevance&type=packages&query=cudatoolkit). Please use the latest major version. You can see where they're defined in nixpkgs [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/cuda-modules/cudatoolkit/releases.nix).

Several "CUDA-X" libraries are packages as well. In particular,

- cuDNN is packaged [here](https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/cuda-modules/cudnn).
- cuTENSOR is packaged [here](https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/cuda-modules/cutensor).

There are some possible ways to setup a development environment using CUDA on NixOS. This can be accomplished in the following ways:

- By making a FHS user env

``` nix
# flake.nix, run with `nix develop`
# Run with `nix-shell cuda-fhs.nix`
{ pkgs ? import <nixpkgs> {} }:
let
   # Change according to the driver used: stable, beta
   nvidiaPackage = pkgs.linuxPackages.nvidiaPackages.stable;
in
(pkgs.buildFHSEnv {
  name = "cuda-env";
  targetPkgs = pkgs: with pkgs; [ 
    git
    gitRepo
    gnupg
    autoconf
    curl
    procps
    gnumake
    util-linux
    m4
    gperf
    unzip
    cudatoolkit
    nvidiaPackage
    libGLU libGL
    xorg.libXi xorg.libXmu freeglut
    xorg.libXext xorg.libX11 xorg.libXv xorg.libXrandr zlib 
    ncurses5
    stdenv.cc
    binutils
  ];
  multiPkgs = pkgs: with pkgs; [ zlib ];
  runScript = "bash";
  profile = ''
    export CUDA_PATH=${pkgs.cudatoolkit}
    # export LD_LIBRARY_PATH=${nvidiaPackage}/lib
    export EXTRA_LDFLAGS="-L/lib -L${nvidiaPackage}/lib"
    export EXTRA_CCFLAGS="-I/usr/include"
  '';
}).env
```

- By making a nix-shell

``` nix
# flake.nix, run with `nix develop`# Run with `nix-shell cuda-shell.nix`
{ pkgs ? import <nixpkgs> {} }:
let
   nvidiaPackage = pkgs.linuxPackages.nvidiaPackages.stable;
in
pkgs.mkShell {
   name = "cuda-env-shell";
   buildInputs = with pkgs; [
     git gitRepo gnupg autoconf curl
     procps gnumake util-linux m4 gperf unzip
     cudatoolkit nvidiaPackage
     libGLU libGL
     xorg.libXi xorg.libXmu freeglut
     xorg.libXext xorg.libX11 xorg.libXv xorg.libXrandr zlib 
     ncurses5 stdenv.cc binutils
   ];
   shellHook = ''
      export CUDA_PATH=${pkgs.cudatoolkit}
      # export LD_LIBRARY_PATH=${nvidiaPackage}/lib:${pkgs.ncurses}/lib
      export EXTRA_LDFLAGS="-L/lib -L${nvidiaPackage}/lib"
      export EXTRA_CCFLAGS="-I/usr/include"
   '';          
}
```

- By making a flake.nix

``` nix
# flake.nix, run with `nix develop`
{
  description = "CUDA development environment";
  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config.allowUnfree = true;
      config.cudaSupport = true;
      config.cudaVersion = "12";
    };
    # Change according to the driver used: stable, beta
    nvidiaPackage = pkgs.linuxPackages.nvidiaPackages.stable;
  in {
    # alejandra is a nix formatter with a beautiful output
    formatter."${system}" = nixpkgs.legacyPackages.${system}.alejandra;
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        ffmpeg
        fmt.dev
        cudaPackages.cuda_cudart
        cudatoolkit
        nvidiaPackage
        cudaPackages.cudnn
        libGLU
        libGL
        xorg.libXi
        xorg.libXmu
        freeglut
        xorg.libXext
        xorg.libX11
        xorg.libXv
        xorg.libXrandr
        zlib
        ncurses
        stdenv.cc
        binutils
        uv
      ];

      shellHook = ''
        export LD_LIBRARY_PATH="${nvidiaPackage}/lib:$LD_LIBRARY_PATH"
        export CUDA_PATH=${pkgs.cudatoolkit}
        export EXTRA_LDFLAGS="-L/lib -L${nvidiaPackage}/lib"
        export EXTRA_CCFLAGS="-I/usr/include"
        export CMAKE_PREFIX_PATH="${pkgs.fmt.dev}:$CMAKE_PREFIX_PATH"
        export PKG_CONFIG_PATH="${pkgs.fmt.dev}/lib/pkgconfig:$PKG_CONFIG_PATH"
      '';
    };
  };
}
```

## Setting up CUDA Binary Cache

The binary cache contains pre-built CUDA packages. By adding it to your system, Nix will fetch these packages instead of building them, saving valuable time and processing power.

For more information, refer to the <a href="Binary_Cache#Using_a_binary_cache_Using_a_binary_cache" class="wikilink" title="Using a binary cache">Using a binary cache</a> page.

### NixOS

Add the cache to `substituters` and `trusted-public-keys` inside your system configuration:

### Non-NixOS

You have to add `substituters` and `trusted-public-keys` to `/etc/nix/nix.conf`:

If your user is in `trusted-users`, you can also add the cache in your home directory:

## Enabling CUDA In Packages

By default, software packaged in source code form has CUDA support disabled, because of the unfree license. There are multiple options to solve this.

You can enable builds with CUDA support with a nixpkgs wide configuration.

``` nix
nixpkgs.config.cudaSupport = true;
```

Or you can override individual packages.

``` nix
environment.systemPackages = with pkgs; [
 (mlt.override {config.cudaSupport=true;})
];
```

Or you can use binary-packaged versions of CUDA compatible software, such as [blender-bin](https://github.com/edolstra/nix-warez/tree/master/blender) for Blender.

Without a <a href="#Setting_up_CUDA_Binary_Cache" class="wikilink" title="CUDA cache">CUDA cache</a>, any CUDA compatible package installed with `cudaSupport` will be compiled from source. This is because NixOS Foundation does not build (and therefore [cache.nixos.org](https://cache.nixos.org/) does not cache) CUDA packages.

For larger programs like Blender, that process can be very resource-intensive. If you are installing large CUDA-enabled package(s) that either are not cached or you are not using a cache, then (especially on older or weaker hardware) it is recommended to reduce the number of cores and/or jobs that the process will take, to prevent a system freeze from resource limits. This can be done with the `--max-jobs` / `-j` and `--cores` flags, for more details see the [Tuning Cores & Jobs](https://github.com/NixOS/nix/blob/master/doc/manual/source/advanced-topics/cores-vs-jobs.md) manual page.

If you don't want to deal with the increased time that compilation will take when `--max-jobs` / `-j` and `--cores` are set below maximum, you can also try simply closing other running processes to see if that frees up enough resources for compilation to be successful.

→ For specifics on setting up Blender with CUDA (and OptiX) see: <a href="Blender#CUDA_&amp;_OptiX" class="wikilink" title="Blender#CUDA &amp; OptiX">Blender#CUDA &amp; OptiX</a>.

## Some things to keep in mind when setting up CUDA in NixOS

- Some GPUs, like Tesla K80, don't work with the latest drivers, so you must specify them in the option `hardware.nvidia.package` getting the value from your selected kernel, for example, `config.boot.kernelPackages.nvidia_x11_legacy470`. You can check which driver version your GPU supports by visiting the [nvidia site](https://www.nvidia.com/Download/index.aspx) and checking the driver version.
- Even with the drivers correctly installed, some software, like Blender, may not see the CUDA GPU. Make sure your system configuration has the option `hardware.graphics.enable` enabled.

## CUDA under WSL

This (surprisingly) works just fine using nixpkgs 23.05 provided that you prefix the `LD_LIBRARY_PATH` in your interactive environment with the WSL library directory. For nix shell this looks like:

## See also

- [nixos-cuda-example](https://github.com/grahamc/nixos-cuda-example)
- [nix-shell envs for Cuda](https://github.com/grahamc/nixos-cuda-example/pull/2)
- [CUDA setup on NixOS](https://discourse.nixos.org/t/cuda-setup-on-nixos/1118)
- [eGPU with nvidia-docker on intel-xserver](https://github.com/NixOS/nixpkgs/issues/131608)
- [Tesla K80 based CUDA setup with Terraform on GCP](https://discourse.nixos.org/t/cuda-in-nixos-on-gcp-for-a-tesla-k80/)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
