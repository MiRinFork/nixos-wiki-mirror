<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nftables -->

This page is a work-in-progress, please reference the [nftables wiki](https://wiki.nftables.org/), [netfilter.org's webpage on the nftables project](https://netfilter.org/projects/nftables/), or the [archlinux wiki page for nftables](https://wiki.archlinux.org/title/Nftables).

### Enabling nftables via options

Whether to enable nftables and use nftables based firewall if enabled. nftables is a Linux-based packet filtering framework intended to replace frameworks like iptables.

Note that if you have Docker enabled you will not be able to use nftables without intervention. Docker uses iptables internally to setup NAT for containers. This module disables the ip_tables kernel module, however Docker automatically loads the module. Please see <https://github.com/NixOS/nixpkgs/issues/24318#issuecomment-289216273> for more information.

There are other programs that use iptables internally too, such as libvirt. For information on how the two firewalls interact, see [nftables wiki FAQ answer to "How to nftables and iptables interact when uses on the same system?](https://wiki.nftables.org/wiki-nftables/index.php/Troubleshooting#Question_4._How_do_nftables_and_iptables_interact_when_used_on_the_same_system.3F).

Some network configurations may prevent VMs from having network access, see <a href="Networking#Virtualization" class="wikilink" title="https://wiki.nixos.org/wiki/Networking#Virtualization"><span>https://wiki.nixos.org/wiki/Networking#Virtualization</span></a>.

``` nixos
networking.nftables.enable = true
```
