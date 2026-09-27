<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: VMware -->

## NixOS as VMWare Guest

### VMWare Video Driver

Enable vmware video driver for better performance:

``` nix
services.xserver.videoDrivers = [ "vmware" ];
```

### VMware Guest Tools

Enable VMWare guest tools:

``` nix
virtualisation.vmware.guest.enable = true;
```

And note that **file copying, pasting, and dragging** between guest and host are **only supported on Xorg, not Wayland.**

For example, in the GDM and GNOME desktop environments, to use Xorg, click on the settings button at the bottom right corner of the login screen and select the "GNOME on Xorg" option.

## Troubleshooting

### Guest issues

This section covers issues you might have running NixOS as a guest VM in VMware Workstation or similar.

#### Copy-pasting and file dragging integration not working in GNOME Wayland

The VMware guest tools install in headless mode by default if `services.xserver.enable` is `false`. Add:

``` nix
virtualisation.vmware.guest.headless = false;
environment.etc."xdg/autostart/vmware-user.desktop".text = ''
  [Desktop Entry]
  Type=Application
  Name=VMware User Agent
  Exec=/run/wrappers/bin/vmware-user-suid-wrapper
  NoDisplay=true
'';
```

to your config to override this and add the necessary XDG autostart entry.

#### Display issues

##### Cannot change resolution in KDE Plasma ISO

If you are unable to change resolution in a guest VM while booted into the NixOS Plasma graphical installer ISO...

This appears to be an issue where if KScreen is running as a service it will instantly revert to the default resolution [1](https://forum.kde.org/viewtopic.php?t=157213).

Disabling the **KScreen 2** Service under Background Services allows resolution settings to apply properly.

If you continue to have issues, running `journalctl` should print a system log with debug info which might help in resolving the issue.

#### Mouse issues

##### Mouse buttons above 5 do not work

If your mouse's thumb buttons or other additional buttons do not work, set guest to use advanced mouse. For your NixOS-based guest VM, add the below lines to its *.vmx* configuration file:

` mouse.vusb.enable = "TRUE"`  
` mouse.vusb.useBasicMouse = "FALSE"`

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Virtualization" class="wikilink" title="Category:Virtualization">Category:Virtualization</a>
