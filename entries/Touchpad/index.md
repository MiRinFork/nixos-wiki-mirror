<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Touchpad -->

## Clickpad issues

If your touchpad physical click (or clickpad) like for Lenovo Thinkpad or MacBook touchpad is disabled after a kernel update, this might be due to a kernel bug on the 6.1+ Linux.

To restore the previous behavior, add to your Nixos hardware configuration:

``` nix
  # Avoid touchpad click to tap (clickpad) bug. For more detail see:
  # https://wiki.archlinux.org/title/Touchpad_Synaptics#Touchpad_does_not_work_after_resuming_from_hibernate/suspend
  boot.kernelParams = [ "psmouse.synaptics_intertouch=0" ];
```

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
