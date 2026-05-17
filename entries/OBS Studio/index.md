<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OBS Studio -->

[OBS Studio](https://obsproject.com/) is free and open-source software for video recording and live streaming, licensed under the GNU GPLv2 license.

### Installing Plugins

Plugins are available from the `obs-studio-plugins` package set.

They can be installed by using either the <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> or <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> module:

``` nix
{ config, pkgs, ... }:
{
  programs.obs-studio = {
    enable = true;

    # optional Nvidia hardware acceleration
    package = (
      pkgs.obs-studio.override {
        cudaSupport = true;
      }
    );

    plugins = with pkgs.obs-studio-plugins; [
      wlrobs
      obs-backgroundremoval
      obs-pipewire-audio-capture
      obs-vaapi #optional AMD hardware acceleration
      obs-gstreamer
      obs-vkcapture
    ];
  };
}
```

or by wrapping the package with `wrapOBS`:

``` nix
environment.systemPackages = [
  (pkgs.wrapOBS {
    plugins = with pkgs.obs-studio-plugins; [
      wlrobs
      obs-backgroundremoval
      obs-pipewire-audio-capture
      obs-vaapi #optional AMD hardware acceleration
      obs-gstreamer
      obs-vkcapture
    ];
  })
];
```

**Package collision**: Including both `obs-studio` and `(pkgs.wrapOBS {...` in `environment.systemPackages` will result in a package collision; if plugins are needed, only include the "wrapped" version, which sets the plugins directory to include Nix-managed plugins (see [pkgs/applications/video/obs-studio/wrapper.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/video/obs-studio/wrapper.nix).

**Missing hardware acceleration**: Sometimes you need to set "Output Mode" to Advanced in settings Output tab to see the hardware accelerated Video Encoders options.

### Using the Virtual Camera

The virtual camera requires the `v4l2loopback` <a href="Linux_kernel#Custom_kernel_modules" class="wikilink" title="kernel module">kernel module</a> to be installed, a loopback device configured, and polkit enabled so OBS can access the virtual device.

This can be done in NixOS with:

``` nixos
programs.obs-studio.enableVirtualCamera = true;
```

Or by setting the kernel options manually, this is useful if you need to add an additional loopback device as shown below:

``` nix
{ config, ... }:
{
  boot.extraModulePackages = with config.boot.kernelPackages; [
    v4l2loopback
  ];
  boot.kernelModules = [ "v4l2loopback" ];
  boot.extraModprobeConfig = ''
    options v4l2loopback devices=1 video_nr=1 card_label="OBS Cam" exclusive_caps=1
  '';
  security.polkit.enable = true;
}
```

It is possible to use <a href="Droidcam" class="wikilink" title="Droidcam">Droidcam</a> as virtual camera.

If you use a digital camera as a webcam via [gphoto2](http://gphoto.org/) you will need an additional loopback device to use this camera as a virtual camera. For a setup like this you may wish to change the above v4l2loopback module config to something like this:

``` nix
boot.extraModprobeConfig = ''
  options v4l2loopback devices=2 video_nr=1,2 card_label="OBS Cam, Virt Cam" exclusive_caps=1
'';
```

For more the [arch wiki entry on v4l2loopback](https://wiki.archlinux.org/title/V4l2loopback#Loading_the_kernel_module) is a good reference.

In addition to `gphoto2` you will need the `v4l-utils` and `ffmpeg` packages so that you can use gphoto2 to send the raw feed from your camera to the virtual camera via ffmpeg for example using a command like this[^1]:

``` bash
gphoto2 --stdout autofocusdrive=1 --capture-movie | ffmpeg -i - -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 /dev/video2
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>

[^1]: <https://austingil.com/dslr-webcam-linux/>
