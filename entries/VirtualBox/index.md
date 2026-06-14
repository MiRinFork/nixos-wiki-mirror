<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: VirtualBox -->

[VirtualBox](https://www.virtualbox.org/) is a virtualisation hypervisor. It has powerful a GUI included for managing virtual machines.

## NixOS Installation

VirtualBox can be installed on NixOS without problems, put this snippet in your `configuration.nix`

``` nix
{
   virtualisation.virtualbox.host.enable = true;
   users.extraGroups.vboxusers.members = [ "user-with-access-to-virtualbox" ];
}
```

Adding users to the group vboxusers allows them to use the virtualbox functionality.

true</code>. If you put `virtualbox` into your `environment.systemPackages`, VirtualBox won't be able to access it's driver, and attempting to start a VM will fail with the error NS_ERROR_FAILURE (0X80004005).}}

## VirtualBox Oracle Extensions

Oracle VirtualBox Extensions are required if you want to forward usb2 or usb3 to your guests. The Extensions are unfree.

``` nix
{
   nixpkgs.config.allowUnfree = true;
   virtualisation.virtualbox.host.enable = true;
   virtualisation.virtualbox.host.enableExtensionPack = true;
}
```

Possible solutions:

- Use a pinned vbox module, see how to pin: <https://github.com/NixOS/nixpkgs/issues/41212>
- Also see <https://stackoverflow.com/questions/48838411/install-virtualbox-modules-from-nixos-unstable-in-configuration-nix>
- Use module from <https://github.com/NixOS/nixpkgs/pull/71127> (unsafe) if you'd like to avoid recompilation.
- Use <a href="Virt-manager" class="wikilink" title="Virt-manager">Virt-manager</a> instead of VirtualBox

## VirtualBox Guest Additions

``` nix
{
  virtualisation.virtualbox.guest.enable = true;
  virtualisation.virtualbox.guest.dragAndDrop = true;
}
```

## Troubleshooting

- If running on Wayland, make sure to enable and properly configure a suitable [XDG portal](https://search.nixos.org/options?query=xdg.portal), otherwise the program will crash when attempting to open a file selector.

## See also

- [virtualisation.virtualbox options](https://search.nixos.org/options?query=virtualisation.virtualbox)

<a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
