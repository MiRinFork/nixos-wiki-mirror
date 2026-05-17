<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/System76/galp5/en -->

<languages />

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>System76 Galago Pro</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Manufacturer</p></td>
<td><p>System76</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>x86_64-linux</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>galp5</p></td>
</tr>
<tr>
<td><p>Status</p></td>
<td><p>supported</p></td>
</tr>
<tr>
<td><p>Maintainer</p></td>
<td><p><a href="User:Ahoneybun" class="wikilink" title="Ahoneybun">Ahoneybun</a></p></td>
</tr>
</tbody>
</table>

</div>

The System76 Galago Pro is a Linux laptop running System76 Open Firmware (based on coreboot+EDK2) from System76

## Status

The device boots NixOS.

## Known issues

## Configuration

### BIOS

These are handled by the firmware-manager package which can be enabled in your configuration like this:

### galp5

#### GTX 1650/1650 Ti

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.system76-galp5-1650`
- NixOS Hardware module for channels: <nixos-hardware/system76/galp5-1650>

### Tech Docs

This goes over replacing and upgrading components such as RAM and drives. <https://tech-docs.system76.com/models/galp5/README.html>

<a href="Category:_Incomplete" class="wikilink" title="Category: Incomplete">Category: Incomplete</a>
