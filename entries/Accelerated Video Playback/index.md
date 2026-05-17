<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Accelerated Video Playback -->

<languages/> <translate> Accelerated video playback in NixOS is generally done by adding relevant packages to . </translate>

<translate>

## Installation

</translate> <translate>

### Intel

</translate> <translate> Note, `intel-vaapi-driver` still performs better for browsers (gecko/chromium based) on newer Skylake (2015) processors.[^1] </translate>

<translate> For 32-bit support, use </translate> : <translate>

### AMD

AMD configuration (at least for Ryzen 5 iGPUs) works out of the box: </translate>

<translate>

### NVIDIA

NVIDIA do not officially support accelerated video playback on Linux. A third-party implementation exists, but does not support Chrome[^2], and has significant limitations compared to the other implementations[^3].

NVIDIA users with a separate iGPU should generally prefer to use their iGPU for this, and therefore look to the above Intel and AMD sections instead.

Users with only an NVIDIA GPU can attempt to use the third party implementation; the package is added to `hardware.graphics.extraPackages` by default, but it requires some additional setup to be useful[^4]: </translate>

<translate>

## Testing your configuration

You can test your configuration by running: `nix-shell -p libva-utils --run vainfo` </translate> <translate> See [Arch Linux wiki#Hardware video acceleration](https://wiki.archlinux.org/index.php/Hardware_video_acceleration#Verification) for more information. </translate> <translate>

## Applications

</translate> <translate>

### Chromium

See <a href="Chromium#Accelerated_video_playback" class="wikilink" title="Chromium#Accelerated_video_playback">Chromium#Accelerated_video_playback</a>. </translate> <translate>

### Firefox

See [Arch Linux wiki#Firefox](https://wiki.archlinux.org/index.php/Firefox#Hardware_video_acceleration). </translate> <translate>

### MPV

</translate> <translate> You can place the following configuration in : </translate>

``` ini
hwdec=auto
```

<translate> See [Arch Linux wiki#mpv](https://wiki.archlinux.org/title/mpv#Hardware_video_acceleration). </translate> <translate>

## Also see

- [Arch Linux wiki#Hardware video acceleration](https://wiki.archlinux.org/index.php/Hardware_video_acceleration).
- [Gentoo Wiki#VAAPI.](https://wiki.gentoo.org/wiki/VAAPI)
- [nixos-hardware](https://github.com/NixOS/nixos-hardware) has example configurations for various types of hardware.

</translate>

<a href="Category:Video" class="wikilink" title="Category:Video">Category:Video</a>

[^1]: <https://github.com/intel/media-driver/issues/1024>

[^2]: <https://github.com/elFarto/nvidia-vaapi-driver#chrome>

[^3]: <https://github.com/elFarto/nvidia-vaapi-driver#codec-support>

[^4]: <https://github.com/elFarto/nvidia-vaapi-driver#configuration>
