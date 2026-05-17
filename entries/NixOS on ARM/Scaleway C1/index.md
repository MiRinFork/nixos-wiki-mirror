<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS on ARM/Scaleway C1 -->

NixOS historically had some support[^1] to work on Scaleway C1 servers. It may be possible to boot a C1 server using the approach described in <a href="Install_NixOS_on_Scaleway_X86_Virtual_Cloud_Server" class="wikilink" title="Install NixOS on Scaleway X86 Virtual Cloud Server">Install NixOS on Scaleway X86 Virtual Cloud Server</a>.

At the time of writing (Dec 2017), that servers does not boot the NixOS kernel, although boot the kernel from <http://mirror.scaleway.com/kernel/armv7l/4.9.67-mainline-rev1/> using instructions from <a href="Install_NixOS_on_Scaleway_X86_Virtual_Cloud_Server" class="wikilink" title="Install_NixOS_on_Scaleway_X86_Virtual_Cloud_Server">Install_NixOS_on_Scaleway_X86_Virtual_Cloud_Server</a> with the only difference in tags: instead of X86's:

``` nix
KEXEC_KERNEL=/boot/nixos-kernel
KEXEC_INITRD=/boot/nixos-initrd
KEXEC_APPEND=init=/boot/nixos-init
```

There should be

``` nix
KEXEC_KERNEL=http://mirror.scaleway.com/kernel/armv7l/4.9.93-mainline-rev1/zImage
KEXEC_INITRD=/boot/nixos-initrd
KEXEC_APPEND=init=/boot/nixos-init
```

It is to be investigated the difference between those kernels.

[^1]: [lib/systems/platforms.nix](https://github.com/NixOS/nixpkgs/blob/67ba83a934dc04c5f7bafec2370e9080b9a2de8f/lib/systems/platforms.nix#L339)
