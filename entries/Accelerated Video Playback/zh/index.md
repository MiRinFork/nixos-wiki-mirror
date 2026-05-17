<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Accelerated Video Playback/zh -->

<languages/> NixOS 中的视频播放加速通常是通过向 添加相关包来完成的。

<span id="Installation"></span>

## 安装

### Intel

注意，`intel-vaapi-driver` 在较新的 Skylake (2015) 处理器上对于浏览器（基于 gecko/chromium）仍然表现更好。[^1]

对于 32 位支持，请使用 :

### AMD

AMD 相关硬件（至少对于 Ryzen 5 iGPU 系列）支持开箱即用：

### NVIDIA

NVIDIA 官方并未支持 Linux 上的视频播放加速。虽然存在第三方实现，但不支持 Chrome[^2]，并且与其他实现[^3]相比存在显著限制。

拥有独立 iGPU 的 NVIDIA 用户通常应该更喜欢使用他们的 iGPU 来实现此目的，因此请参考上面的 Intel 和 AMD 部分。

仅具有 NVIDIA GPU 的用户可以尝试使用第三方实现；默认情况下，添加软件包到 `hardware.graphics.extraPackages`，但之后需要进行一些额外的设置才能使用[^4]：

<span id="Testing_your_configuration"></span>

## 测试您的配置

您可以通过运行以下命令来测试您的配置：`nix-shell -p libva-utils --run vainfo` 有关更多信息，请参阅 [Arch Linux wiki 的硬件视频加速](https://wiki.archlinux.org/index.php/Hardware_video_acceleration#Verification)。 <span id="Applications"></span>

## 应用

### Chromium

请参阅 <a href="Special:MyLanguage/Chromium#Accelerated_video_playback" class="wikilink" title="Chromium 视频加速">Chromium 视频加速</a>.

### Firefox

请参阅 [Arch Linux wiki 的 Firefox 部分](https://wiki.archlinux.org/index.php/Firefox#Hardware_video_acceleration).

### MPV

您可以将以下配置放在 中：

``` ini
hwdec=auto
```

请参阅 [Arch Linux wiki 的 mpv 部分](https://wiki.archlinux.org/title/mpv#Hardware_video_acceleration).

## 另请参阅

- [Arch Linux wiki 的硬件视频加速](https://wiki.archlinux.org/index.php/Hardware_video_acceleration)。
- [nixos-hardware](https://github.com/NixOS/nixos-hardware) 包含各种硬件类型的示例配置。

<a href="Category:Video" class="wikilink" title="Category:Video">Category:Video</a>

[^1]: <https://github.com/intel/media-driver/issues/1024>

[^2]: <https://github.com/elFarto/nvidia-vaapi-driver#chrome>

[^3]: <https://github.com/elFarto/nvidia-vaapi-driver#codec-support>

[^4]: <https://github.com/elFarto/nvidia-vaapi-driver#configuration>
