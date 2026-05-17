<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: DaVinci Resolve -->

[Black Magic DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) is a program for video editing, color effects and A/V post production. For FOSS alternatives you might want to look into [Shotcut](https://www.shotcut.org/) and [Kdenlive](https://kdenlive.org/).

## Installation

There are [two versions](https://github.com/NixOS/nixpkgs/blob/504dc57774510c1213a8a3a04d03048893d8edce/pkgs/by-name/da/davinci-resolve/package.nix#L37) of [Black Magic DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve) on NixOS.

`* ``davinci-resolve`` (the free version)`  
`* ``davinci-resolve-studio`` (the paid version)`

For Linux, DaVinci Resolve Free has [only partial h.264 and h.265 support due to licensing restrictions](https://www.reddit.com/r/davinciresolve/comments/y4ytkl/why_no_mp4h264_support_on_linux/). AAC audio is also not supported in the Free version.

## Drivers

DaVinci Resolve requires a GPU that supports either OpenCL 1.2 or CUDA 11.

### AMD

There are multiple options to run DaVinci Resolve with AMD cards, but it strongly depends on the generation of your AMD card. Also make sure to read the <a href="AMD_GPU" class="wikilink" title="AMD GPU page">AMD GPU page</a> (this wiki) and the [DaVinci Resolve entry on Archwiki](https://wiki.archlinux.org/title/DaVinci_Resolve).

| GPU Generation | Series | DaVinci Resolve Compatibility | ROCm Support | AMDGPU Support | Rusticl Support | Confirmed |
|----|----|----|----|----|----|----|
| Pre-GCN (Terascale) | Radeon HD 2000–6000 Series | ❌ No GPU Compute (Software Only) | ❌ Not Supported | ❌ Uses Radeon DRM | ❌ Most Terascale GPUs lack OpenCL support in Rusticl. Rusticl officially targets Gallium drivers, but `r600g` lacks full OpenCL support. | ❌ No OpenCL. Please let us know if you got it running with `r600g` |
| GCN 1.0 & 1.1 | Radeon HD 7000, R9 270/280 Series | Limited (OpenCL 1.1) | ❌ Not Supported | Experimental | Partially (Some support via `radeonsi` but limited OpenCL) | Only working if card is supported in `amdgpu` open-source driver! |
| GCN 1.2 (Gen 3) | Radeon R9 285, R9 380, R9 Fury | Moderate (OpenCL 1.2) | ❌ Not Supported | ✅ Yes | ✅ Rusticl supported via `radeonsi` & Mesa | ✅ Confirmed with amdgpu, radeonsi and OpenCL via Mesa (Rusticl). See the demo configuration below |
| GCN 4th Gen (Polaris) | Radeon RX 400/500 Series | Moderate (OpenCL 1.2) | Supported up to ROCm 5.6 | ✅ Yes | ✅ Rusticl supported via `radeonsi` & Mesa | ✅ Confirmed with `amdgpu`, `radeonsi`, and OpenCL via Rusticl (Mesa) |
| GCN 5th Gen (Vega) | Radeon RX Vega Series | Moderate (OpenCL 1.2) | Supported up to ROCm 5.6 | ✅ Yes | ✅ Rusticl supported via `radeonsi` & Mesa | ✅ Confirmed |
| RDNA (Navi) | Radeon RX 5000 Series | Good (OpenCL 1.2) | Supported | ✅ Yes | ✅ Rusticl supported via `radeonsi` & Mesa | ✅ Confirmed |
| RDNA2 (Navi 2x) | Radeon RX 6000 Series | Good (OpenCL 1.2) | Supported | ✅ Yes | ✅ Rusticl supported via `radeonsi` & Mesa | ✅ Confirmed |
| RDNA3 (Navi 3x) | Radeon RX 7000 Series | Good (OpenCL 1.2) | Supported | ✅ Yes | ✅ Rusticl supported via `radeonsi` & Mesa | ✅ Confirmed |

AMD GPU Compatibility with DaVinci Resolve on Linux

Cheap and minimal supported cards to look out for are the *Radeon R9* series starting from GCN 1.2 and higher. Find more information about the <a href="wikipedia:AMDgpu_(Linux_kernel_module)" class="wikilink" title="AMDgpu (Linux kernel module)">AMDgpu (Linux kernel module)</a> which is upstreamed with Linux. There is also the proprietary **amdgpu-pro** driver which has [mixed results](https://www.reddit.com/r/NixOS/comments/13vcufk/install_radeon_6650xt_pro_drivers/). The free drivers (amdgpu) are better.

**Here is a confirmed minimal configuration for amdgpu, radeonsi and OpenCL via Mesa (Rusticl):**

``` nix
{
  config,
  lib,
  pkgs,
  ...
}:
{
  environment.systemPackages = with pkgs; [
    davinci-resolve
  ];
  environment.variables = {
    RUSTICL_ENABLE = "radeonsi";
  };
  hardware.graphics = {
    enable = true;
    extraPackages = with pkgs; [
      mesa.opencl # Enables Rusticl (OpenCL) support
    ];
  };
}
```

### Intel

DaVinci Resolve has partial support for Intel GPUs on Linux. Audio playback works on the Fairlight page, but the video timeline does not work. To add Intel support, add one of the option to your `configuration.nix`:

``` nix
 hardware.graphics = {
    enable = true;
    enable32Bit = true;
    extraPackages = with pkgs; [
        intel-compute-runtime # For Intel 12th Gen and newer
        intel-compute-runtime-legacy1 # For Intel Gen 8, 9, 11
    ];
  };
```

## X11 or Wayland

Currently, DaVinci Resolve can not run on native Wayland. This is due to qtwayland version mismatch. See [nixpkgs issue](https://github.com/NixOS/nixpkgs/issues/341634) .

If you want to maximize your chances you can try and start davinci in the following way to check for ROCM or Rusticl support

`ROC_ENABLE_PRE_VEGA=1 RUSTICL_ENABLE=amdgpu,amdgpu-pro,radv,radeon,radeonsi DRI_PRIME=1 QT_QPA_PLATFORM=xcb davinci-resolve`

## OpenFX Plugins

The usual install location `/usr/OFX/Plugins` is not available on NixOS. Fortunately, DaVinci Resolve supports loading OpenFX plugins from locations specified in `OFX_PLUGIN_PATH`. This environment variable can be configured comfortably by adding the following code listing to the system configuration:

``` nixos
environment.variables = {
    OFX_PLUGIN_PATH = lib.concatStringsSep ";" [
      # specify plugin packages here
    ];
};
```

Plugins usually contain a directory called `$PLUGINNAME.ofx.bundle` with a `.ofx` file somewhere inside of it. Since the coercion of a package to a string outputs its store location and the paths specified in the environment variable are traversed recursively, it is not necessary to specify the precise location of the ofx bundle in the nix store.

## Troubleshooting

### Resolve crashes/fails to start

If it doesn't launch, and crashes when running `davinci-resolve`, then try running it as root.

If it didn't help, you can view the error log at `~/.local/share/DaVinciResolve/logs/ResolveDebug.txt` to pinpoint the issue.

If you can spot a line similar to `Cannot mix incompatible Qt library (5.15.12) with this library (5.15.2)`, and have configured QT options in your NixOS configuration (`qt.enable = true;`), try disabling them.

### Resolve crashes on Edit/Fusion tab with Intel iGPU

If you are using `intel-compute-runtime-legacy1` and DaVinci Resolve crashes whenever you try to switch to Edit or Fusion tab, it indicates the issue with the latest package. If you want to learn more about how pinning packages to specific versions works, you can read <a href="FAQ/Pinning_Nixpkgs" class="wikilink" title="this article">this article</a>.

Here's the solution for <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="flake-based">flake-based</a> NixOS system:

### Cannot import video file

DaVinci Resolve's free edition does not come with H264/H265 support. You need to convert your video to a supported video format, like DNxHD/DNxHR and Cineform. you can do this with `ffmpeg`. With FFmpeg installed, assuming your video is called `video.mp4`, you can use the following command to convert:

`ffmpeg -i video.mp4 -c:v dnxhd -profile:v dnxhr_hq -c:a pcm_s16le -pix_fmt yuv422p output.mov`

This command will convert your video to a DNxHR video and your audio to uncompressed 16bit PCM. For 24bit PCM, use `-c:a pcm_s24le` instead.

You can know more about DNxHD/HR profiles with the command `ffmpeg -h encoder=dnxhd`

Resolve also supports Cineform and a few other formats. For Cineform encoding, use the `cfhd` encoder.

### Unsupported GPU Processing Mode

If DaVinci Resolve shows a popup asking to review GPU configuration in preferences, and if there is no GPU detected in "Memory and GPU" in preferences, you can try the following in your `configuration.nix`:

``` nix
hardware.graphics = {
   enable = true;
 };
hardware.amdgpu.opencl.enable = true;
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
