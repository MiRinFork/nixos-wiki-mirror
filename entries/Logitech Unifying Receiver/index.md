<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Logitech Unifying Receiver -->

[Logitech Unifying Receiver](http://www.logitech.com/349/6072) is a wireless receiver that can connect up to 6 compatibles wireless mice and keyboards to your computer.

## Setup with NixOS

Just add the following lines to

`   hardware.logitech.wireless.enable = true;`  
`   hardware.logitech.wireless.enableGraphical = true;`

then

`   sudo nixos-rebuild switch`

## Additional tips

See [this page on ArchLinux wiki](https://wiki.archlinux.org/index.php/Logitech_Unifying_Receiver)

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
