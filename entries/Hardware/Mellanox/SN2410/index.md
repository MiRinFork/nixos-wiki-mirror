<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Mellanox/SN2410 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Mellanox SN2410</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>Mellanox (now NVIDIA)</p></td>
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
<td><p><a href="User:Rv32ima" class="wikilink" title="rv32ima">rv32ima</a></p></td>
</tr>
</tbody>
</table>

</div>

The Mellanox SN2410 is a 25GbE/100GbE network switch manufactured by Mellanox (now NVIDIA). It has 48 25GbE ports, and 8 100GbE ports. This switch uses GRUB (by default) and has a relatively standard UEFI BIOS, meaning that it can easily run NixOS without much trouble.

## Setup

In order to get NixOS working with this switch (and all of it's many ethernet ports), some manual configuration is needed. You can use a regular installer ISO to get NixOS on this machine, but for all ports to be functional, some extra configuration is needed. Add this to your system's configuration:

``` nix
    boot.kernelPatches = [
      {
        name = "mlx-stuff";
        patch = null;
        extraConfig = ''
          MELLANOX_PLATFORM y
          MLXREG_HOTPLUG m
          MLXREG_IO m
          MLXREG_LC m
          NVSW_SN2201 m
          SENSORS_MLXREG_FAN m
        '';
      }
    ];

    boot.blacklistedKernelModules = [
      "i2c_mux_reg"
    ];
```

This adds in some missing kernel drivers for the switch into your kernel, and blacklists the \`i2c_mux_reg\` driver (which interferes with the mlxsw_spectrum driver).

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
