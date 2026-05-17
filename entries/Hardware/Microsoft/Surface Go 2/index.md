<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Microsoft/Surface Go 2 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Microsoft Surface Go 2</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2"><figure>
<img src="Microsoft_surface_go_2.jpg" title="A Microsoft Surface GO 2." width="256" height="256" />
<figcaption>A Microsoft Surface GO 2.</figcaption>
</figure></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Microsoft</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>x86_64</p></td>
</tr>
<tr>
<td><p>Bootloader</p></td>
<td><p>64-bit GRUB</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:onny" class="wikilink" title="onny">onny</a></p></td>
</tr>
</tbody>
</table>

</div>

The Surface Go 2 is a portable 2-in-1 detachable tablet computer by Microsoft, featuring a 10.5-inch PixelSense Display, Intel® Pentium® Gold or Pentium® M processors, and optional LTE connectivity.

## Setup

Support for webcam and LTE modem requires a custom kernel from the [linux-surface](https://github.com/linux-surface/linux-surface) project. Adapt the `flake.nix` of your system configuration to include the [nixos-hardware repository](https://github.com/NixOS/nixos-hardware) and the specific module for your device: `nixos-hardware.nixosModules.microsoft-surface-go`.

``` nix
{
  description = "NixOS configuration with flakes";
  inputs.nixos-hardware.url = "github:NixOS/nixos-hardware/master";

  outputs = { self, nixpkgs, nixos-hardware }: {
    # replace <your-hostname> with your actual hostname
    nixosConfigurations.<your-hostname> = nixpkgs.lib.nixosSystem {
      # ...
      modules = [
        # ...
        nixos-hardware.nixosModules.microsoft-surface-go
      ];
    };
  };
}
```

After that rebuild your system and reboot the machine.

If the LTE modem does not appear in your network manager directly, a [small workaround script](https://github.com/linux-surface/linux-surface/wiki/Surface-Go-2#enabling-the-lte-modem) is required. Add this to your system configuration

``` nix
systemd.services.lte_modem_fix = let
  modemFixScript = pkgs.writeScriptBin "fix_lte_modem" ''
    #!${pkgs.stdenv.shell}
    echo -n 16383 > /sys/bus/usb/devices/2-3:1.0/net/wwp0s20f0u3/cdc_ncm/rx_max
    echo -n 16383 > /sys/bus/usb/devices/2-3:1.0/net/wwp0s20f0u3/cdc_ncm/tx_max
    echo -n 16384 > /sys/bus/usb/devices/2-3:1.0/net/wwp0s20f0u3/cdc_ncm/rx_max
    echo -n 16384 > /sys/bus/usb/devices/2-3:1.0/net/wwp0s20f0u3/cdc_ncm/tx_max
  '';
in {
  wantedBy = ["multi-user.target"];
  serviceConfig = {
    Type = "oneshot";
    ExecStart = "${modemFixScript}/bin/fix_lte_modem";
  };
};
systemd.services.ModemManager.wantedBy = ["multi-user.target"];
```

It will take a couple of seconds for the modem to appear.

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
