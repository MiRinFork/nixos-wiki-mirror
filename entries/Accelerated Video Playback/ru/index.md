<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Accelerated Video Playback/ru -->

<languages/>

<div class="mw-translate-fuzzy">

Ускорение воспроизведения видео в NixOS обычно осуществляется путем добавления соответствующих пакетов в .

</div>

<span id="Installation"></span>

## Установка

### Intel

<div lang="en" dir="ltr" class="mw-content-ltr">

Note, `intel-vaapi-driver` still performs better for browsers (gecko/chromium based) on newer Skylake (2015) processors.[^1]

</div>

Для поддержки 32-битной версии используйте :

### AMD

Конфигурация AMD (по крайней мере, для iGPU Ryzen 5) работает из коробки:

<div lang="en" dir="ltr" class="mw-content-ltr">

### NVIDIA

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NVIDIA do not officially support accelerated video playback on Linux. A third-party implementation exists, but does not support Chrome[^2], and has significant limitations compared to the other implementations[^3].

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

NVIDIA users with a separate iGPU should generally prefer to use their iGPU for this, and therefore look to the above Intel and AMD sections instead.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Users with only an NVIDIA GPU can attempt to use the third party implementation; the package is added to `hardware.graphics.extraPackages` by default, but it requires some additional setup to be useful[^4]:

</div>

<span id="Testing_your_configuration"></span>

## Проверьте вашу конфигурацию

Вы можете протестировать вашу конфигурацию выполнив: `nix-shell -p libva-utils --run vainfo`

<div lang="en" dir="ltr" class="mw-content-ltr">

See [Arch Linux wiki#Hardware video acceleration](https://wiki.archlinux.org/index.php/Hardware_video_acceleration#Verification) for more information.

</div>

<span id="Applications"></span>

## Приложения

<span id="Chromium"></span>

<div class="mw-translate-fuzzy">

### Chromium

См. <a href="Chromium#Accelerated_video_playback" class="wikilink" title="Chromium#Accelerated_video_playback">Chromium#Accelerated_video_playback</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See <a href="Chromium#Accelerated_video_playback" class="wikilink" title="Chromium#Accelerated_video_playback">Chromium#Accelerated_video_playback</a>.

</div>

### Firefox

<div class="mw-translate-fuzzy">

### Firefox

</div>

### MPV

Вы можете разместить следующую конфигурацию в :

``` ini
hwdec=auto
```

<div lang="en" dir="ltr" class="mw-content-ltr">

See [Arch Linux wiki#mpv](https://wiki.archlinux.org/title/mpv#Hardware_video_acceleration).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Also see

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Arch Linux wiki#Hardware video acceleration](https://wiki.archlinux.org/index.php/Hardware_video_acceleration).
- [Gentoo Wiki#VAAPI.](https://wiki.gentoo.org/wiki/VAAPI)
- [nixos-hardware](https://github.com/NixOS/nixos-hardware) has example configurations for various types of hardware.

</div>

<a href="Category:Video" class="wikilink" title="Category:Video">Category:Video</a>

[^1]: <https://github.com/intel/media-driver/issues/1024>

[^2]: <https://github.com/elFarto/nvidia-vaapi-driver#chrome>

[^3]: <https://github.com/elFarto/nvidia-vaapi-driver#codec-support>

[^4]: <https://github.com/elFarto/nvidia-vaapi-driver#configuration>
