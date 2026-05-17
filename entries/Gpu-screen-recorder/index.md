<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Gpu-screen-recorder -->

[gpu-screen-recorder](https://git.dec05eba.com/gpu-screen-recorder/about/) is a screen recorder that has minimal impact on system performance by recording your monitor using the GPU only, similar to [ShadowPlay](https://www.nvidia.com/en-us/geforce/geforce-experience/shadowplay/) on Windows.

#### Supported codecs

##### Video

- H264 (default on Intel)
- HEVC (default on AMD and NVIDIA)
- AV1

##### Audio

- Opus (default)
- AAC
- FLAC

## Installation

``` nix
  programs.gpu-screen-recorder.enable = true; # For promptless recording on both CLI and GUI

  environment.systemPackages = with pkgs; [
    gpu-screen-recorder-gtk # GUI app
  ];
```

## Troubleshooting

#### libnvidia-fbc.so.1: cannot open shared object file: No such file or directory

The possibility of this error arising exists if you possess an NVIDIA graphics card, as the package does not include the NVIDIA X11 libraries in its wrapper by default.

1.  Make sure your <a href="Nvidia" class="wikilink" title="drivers">drivers</a> are installed.
2.  Install the missing the NVENC patch for your card. [nvidia-patch](https://github.com/icewind1991/nvidia-patch-nixos) is a great overlay which you can use
3.  Override the package build inputs and add the library to the wrapper.

``` nix
{
  environment.systemPackages = [
    (pkgs.runCommand "gpu-screen-recorder" {
      nativeBuildInputs = [ pkgs.makeWrapper ];
    } ''
      mkdir -p $out/bin
      makeWrapper ${pkgs.gpu-screen-recorder}/bin/gpu-screen-recorder $out/bin/gpu-screen-recorder \
        --prefix LD_LIBRARY_PATH : ${pkgs.libglvnd}/lib \
        --prefix LD_LIBRARY_PATH : ${config.boot.kernelPackages.nvidia_x11}/lib
    '')
  ];
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
