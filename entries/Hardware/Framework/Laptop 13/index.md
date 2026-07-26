<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/Framework/Laptop 13 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>Framework Laptop 13</p></th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td></td>
</tr>
<tr>
<td colspan="2" class="title"><p>Laptop 13</p></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p><a href="Hardware/Framework" class="wikilink" title="Framework">Framework</a></p></td>
</tr>
<tr>
<td><p>Support</p></td>
<td><p><a href="https://knowledgebase.frame.work/framework-component-linux-support-matrix-B1gwmFtPgg">components</a></p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>x86_64- linux</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>AI 300 Series</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>7040 Series</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>13 Gen</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>12 Gen</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>11 Gen</p></td>
</tr>
<tr>
<td><p>Status</p></td>
<td><p>supported</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:0x4A6F" class="wikilink" title="0x4A6F">0x4A6F</a></p></td>
</tr>
</tbody>
</table>

</div>

The [Framework Laptop 13](https://frame.work/laptop13) is a configurable, upgradeable, and repairable laptop made by the Framework company.

## Status

The device boots NixOS.

## Known issues

In order to boot you need to disable Secure Boot. To do that, press F2 during boot and go into the "Administer Secure Boot" menu.

## Configuration

Framework-specific NixOS hardware options are bundled within the [nixos-hardware](https://github.com/NixOS/nixos-hardware) project. Also consider checking the <a href="Laptop" class="wikilink" title="Laptop">Laptop</a> page for laptop specific behavior, such as what action to take when the lid is closed.

### BIOS

BIOS updates are distributed through [LVFS](https://fwupd.org/), which can be used by enabling the fwupd service:

``` nix
services.fwupd.enable = true;
```

To check for updates and install them, run:

``` console
$ fwupdmgr update
```

Further instructions and release notes can be found on the [Framework BIOS and Drivers knowledgebase](https://knowledgebase.frame.work/bios-and-drivers-downloads-rJ3PaCexh).

### AMD AI 300 Series

Use an installer with Linux kernel 6.12 or later (at least NixOS Release 25.05 / [NixOS Unstable](https://channels.nixos.org/?prefix=nixos-unstable/)).

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-amd-ai-300-series`
- NixOS Hardware module for channels: `<nixos-hardware/framework/13-inch/amd-ai-300-series>`

### AMD 7040 Series

It is recommended to use [power-profiles-daemon](https://search.nixos.org/options?show=services.power-profiles-daemon.enable) over <a href="Laptop#TLP" class="wikilink" title="tlp"><code>tlp</code></a> for the AMD framework. If standby power consumption is too high (multiple watts) ensure the BIOS version is at least [3.05](https://community.frame.work/t/framework-laptop-13-ryzen-7040-bios-3-05-release-and-driver-bundle/48276)[^1].

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-13-7040-amd`
- NixOS Hardware module for channels: `<nixos-hardware/framework/13-inch/7040-amd>`

### Intel Core Ultra Series 1

Personal experience: On NixOS 24.11 the default kernel appears to be to old (no display brightness adjustment and increased power consumption). Using a newer kernel seems to run nicely:

``` nix
boot.kernelPackages = pkgs.linuxPackages_6_14;
```

### Intel 13 Gen

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-13th-gen-intel`
- NixOS Hardware module for channels: `<nixos-hardware/framework/13-inch/13th-gen-intel>`

Check the [nixos-hardware](https://github.com/NixOS/nixos-hardware/tree/master/framework/13-inch/13th-gen-intel#getting-the-fingerprint-sensor-to-work) Readme on how to get your fingerprint reader to work.

### Intel 12 Gen

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-12th-gen-intel`
- NixOS Hardware module for channels: `<nixos-hardware/framework/13-inch/12th-gen-intel>`

### Intel 11 Gen

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.framework-11th-gen-intel`
- NixOS Hardware module for channels: `<nixos-hardware/framework/13-inch/11th-gen-intel>`

<a href="Category:_Incomplete" class="wikilink" title="Category: Incomplete">Category: Incomplete</a>

[^1]: <https://community.frame.work/t/framework-laptop-13-ryzen-7040-bios-3-05-release-and-driver-bundle/48276/239>
