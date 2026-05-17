<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Droidcam -->

[Droidcam](https://droidcam.app/) is a mobile app (Android, iOS). With Droidcam the mobile device can be used as webcam for a PC.

## Using it as a virtual camera with OBS Studio

Its possible to use Droidcam as a virtual camera in <a href="OBS_Studio" class="wikilink" title="OBS Studio">OBS Studio</a> with the following <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> configuration:

``` nixos
{ pkgs, ... }:

{
  programs.obs-studio = {
    enable = true;
    enableVirtualCamera = true;
    plugins = with pkgs.obs-studio-plugins; [
      droidcam-obs
    ];
  };
}
```

Since this adds a kernel module, you will need to reboot your system. Once rebooted, open OBS Studio and add a DroidCam OBS source to a scene. Then activate the virtual camera to and make sure it is linked to your selected scene.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
