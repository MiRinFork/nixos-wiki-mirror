<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Dell/D6000 Universal Dock -->

## Displaylink Graphic Driver

The <a href="Displaylink" class="wikilink" title="Displaylink">Displaylink</a> entry shows all the steps in getting the graphics part of the Universal Dock / Docking Station up and running.

## Enabling IPv6

So there seems to be an issue in the kernel drivers which makes Ethernet Multicast not working with this docking station [(bug report and patches here)](https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1779173). Somehow these patches or workarounds never got upstream, but with this code snippet you can include the patches easily inside your `configuration.nix` if you put the patches in a subdirectory for instance `linux_kernel_cdc_ncm_patches`:

``` nix
{
  ...
  boot.kernelPatches = lib.singleton {
    name = "enable-d6000";
    patch = [
      ./linux_kernel_cdc_ncm_patches/0001-Hook-into-usbnet_change_mtu-respecting-usbnet-driver.patch
      ./linux_kernel_cdc_ncm_patches/0002-Admit-multicast-traffic.patch
    ];
  };
  ...
}
```

<a href="Category:incomplete" class="wikilink" title="Category:incomplete">Category:incomplete</a>
