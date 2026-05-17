<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Solokey -->

This article describes how you can integrate [Solokeys](https://github.com/solokeys) with NixOS. For the most part you can follow <a href="Yubikey" class="wikilink" title=" the guide for Yubikey"> the guide for Yubikey</a>.

Important, of you want to e.g. upgrade your solokey you also need some [additonal udev rules](https://docs.solokeys.io/udev/). So the following setup allows you to use your key for sudo as well as you are able to update your solokey

``` nix
{ config, pkgs, ... }:
{
programs.gnupg.agent = {
    enable = true;
    enableSSHSupport = true;
};
security.pam.services = {
    login.u2fAuth = true;
    sudo.u2fAuth = true;
};
# https://github.com/solokeys/solo2-cli/blob/main/70-solo2.rules
services.udev.packages = [
    pkgs.yubikey-personalization
    (pkgs.writeTextFile {
    name = "wally_udev";
    text = ''
        # NXP LPC55 ROM bootloader (unmodified)
        SUBSYSTEM=="hidraw", ATTRS{idVendor}=="1fc9", ATTRS{idProduct}=="0021", TAG+="uaccess"
        # NXP LPC55 ROM bootloader (with Solo 2 VID:PID)
        SUBSYSTEM=="hidraw", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="b000", TAG+="uaccess"
        # Solo 2
        SUBSYSTEM=="tty", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="beee", TAG+="uaccess"
        # Solo 2
        SUBSYSTEM=="usb", ATTRS{idVendor}=="1209", ATTRS{idProduct}=="beee", TAG+="uaccess"
    '';
    destination = "/etc/udev/rules.d/70-solo2.rules";
    })
];
}
```

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
