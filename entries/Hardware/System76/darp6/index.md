<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hardware/System76/darp6 -->

<div class="infobox">

<table>
<thead>
<tr>
<th colspan="2" class="title"><p>System76 Darter Pro</p></th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td></td>
</tr>
<tr>
<td colspan="2" class="title"><p>System76 Darter Pro</p></td>
</tr>
<tr>
<td><p>Manufacturer</p></td>
<td><p>System76</p></td>
</tr>
<tr>
<td><p>Architecture</p></td>
<td><p>x86_64-linux</p></td>
</tr>
<tr>
<td colspan="2" class="title"><p>darp6</p></td>
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

The System76 Darter Pro is a Linux laptop running System76 Open Firmware (based on coreboot+EDK2) from System76

## Status

The device boots NixOS.

## Known issues

## Configuration

### BIOS

These are handled by the firmware-manager package which can be enabled in your configuration like this:

` {`  
`   hardware.system76.enableAll = true;`  
` };`

### darp6

#### Intel 10th Gen

- NixOS Hardware module for flakes: `nixos-hardware.nixosModules.system76-darp6`
- NixOS Hardware module for channels: <nixos-hardware/system76/darp6>

### Tech Docs

This goes over replacing and upgrading components such as RAM and drives.

<https://tech-docs.system76.com/models/darp6/README.html>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
