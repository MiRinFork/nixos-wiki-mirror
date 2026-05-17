<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Accelerated Video Playback/en -->

<languages/> Accelerated video playback in NixOS is generally done by adding relevant packages to .

## Installation

### Intel

Note, `intel-vaapi-driver` still performs better for browsers (gecko/chromium based) on newer Skylake (2015) processors.[^1]

For 32-bit support, use :

### AMD

AMD configuration (at least for Ryzen 5 iGPUs) works out of the box:

### NVIDIA

NVIDIA do not officially support accelerated video playback on Linux. A third-party implementation exists, but does not support Chrome[^2], and has significant limitations compared to the other implementations[^3].

NVIDIA users with a separate iGPU should generally prefer to use their iGPU for this, and therefore look to the above Intel and AMD sections instead.

Users with only an NVIDIA GPU can attempt to use the third party implementation; the package is added to `hardware.graphics.extraPackages` by default, but it requires some additional setup to be useful[^4]:

## Testing your configuration

You can test your configuration by running: `nix-shell -p libva-utils --run vainfo` See [Arch Linux wiki#Hardware video acceleration](https://wiki.archlinux.org/index.php/Hardware_video_acceleration#Verification) for more information.

## Applications

### Chromium

See <a href="Chromium#Accelerated_video_playback" class="wikilink" title="Chromium#Accelerated_video_playback">Chromium#Accelerated_video_playback</a>.

### Firefox

See [Arch Linux wiki#Firefox](https://wiki.archlinux.org/index.php/Firefox#Hardware_video_acceleration).

### MPV

You can place the following configuration in :

``` ini
hwdec=auto
```

See [Arch Linux wiki#mpv](https://wiki.archlinux.org/title/mpv#Hardware_video_acceleration).

## Also see

- [Arch Linux wiki#Hardware video acceleration](https://wiki.archlinux.org/index.php/Hardware_video_acceleration).
- [nixos-hardware](https://github.com/NixOS/nixos-hardware) has example configurations for various types of hardware.

<a href="Category:Video" class="wikilink" title="Category:Video">Category:Video</a>

[^1]: <https://github.com/intel/media-driver/issues/1024>

[^2]: <https://github.com/elFarto/nvidia-vaapi-driver#chrome>

[^3]: <https://github.com/elFarto/nvidia-vaapi-driver#codec-support>

[^4]: <https://github.com/elFarto/nvidia-vaapi-driver#configuration>
