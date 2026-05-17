<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Using bridges under NixOS -->

In order to use macvtap bridges in KVM, LXC, Xen or another hypervisor on NixOS, you have to configure your DHCP server to not assign an IP address to that interface.

By default, the DHCP server on NixOS configures every interface with an IP.

## Configuration

If you are running `dhcpcd`, then you have to define a `denyInterfaces` parameter:

Issue is relevant for DHCP and bridging.

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
