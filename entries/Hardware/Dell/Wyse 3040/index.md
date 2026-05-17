<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Dell/Wyse 3040 -->

Dell Wyse 3040 is a small Thinclient that can be used as a powersaving Mini-Server.

**NixOS 23.05**

There is a Bug in the 6.1 Linux Kernel that leads to a kernelpanic after 30min to 2h operation.

Solution: in /etc/nixos/configuration.nix

`boot.kernelPackages = pkgs.linuxKernel.packages.linux_5_15;`

`boot.kernel.sysctl."kernel.panic" = 60;`

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
