<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wake on LAN -->

Wake on LAN (WoL) is a method used to turn on the target computer over the network.

## 1 Hardware Settings

Wake on LAN can be enabled when the following two conditions are met:

1.  Target computer's motherboard and Network Interface Controller (NIC) has Wake on Lan support.
2.  Target computer has to be physically connected (with a cable) to a router or to the source computer for WoL to work properly or your wireless card has Wake on Wireless (WoWLAN or WoW) support.

Prepare BIOS/UEFI:

1.  Enable the Wake on LAN feature. Different motherboard manufacturers use slightly different language for this feature. Look for terminology such as "PCI Power up", "Allow PCI wake up event" or "Boot from PCI/PCI-E".
2.  (If available in BIOS/UEFI) Make sure that ErP is **disabled**, otherwise your Ethernet card will not be powered and will not be able to recieve any wake-up packets sent form another device.
3.  (If available in BIOS/UEFI) Make sure that "Deep Sx" is **disabled**, otherwise your Ethernet card might not be powered when the computer is powered off (S5 state). Found at *Advanced \> Chipset Configuration \> PCH Configuration \> Deep Sx* in the Aptio Setup Utility, American Megatrends, Inc. Version 2.15.1227, Core Version: 4.6.5.3, BIOS Version 5404 x64 on an *ASUS Z9PE-D8 WS* Mainboard.

## 2 NixOS Configuration

## 2.1 Enable Wake on Lan for a Network Interface

The following example enables Wake on Lan for **ens3** interface and opens port 9 (WoL UDP Port) for target computer. After enabling, you may need to restart your computer too see these changes take effect.

``` nix
networking = {
  interfaces = {
    ens3 = {
      wakeOnLan.enable = true;
    };
  };
  firewall = {
    allowedUDPPorts = [ 9 ];
  };
};
```

## 2.2 Source Configuration and usage

After setting up the target computer, install **wakeonlan** package on the source computer.

``` nix
environment.systemPackages = with pkgs; [
  wakeonlan
];
```

The output of the **ip a** command contains the **link/ether address** under the ens3 interface. Copy this and run it as shown in the example command.

In this example Target IP is 192.168.1.50.

``` bash
wakeonlan -i 192.168.1.50 {your_link/ether_adress}
```

<a href="Category:Networking" class="wikilink" title="Category:Networking">Category:Networking</a> <a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
