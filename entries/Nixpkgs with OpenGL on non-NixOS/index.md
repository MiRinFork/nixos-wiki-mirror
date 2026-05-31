<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs with OpenGL on non-NixOS -->

Applications in \`nixpkgs\` handle OpenGL in a certain way. Using these applications outside NixOS requires the use of a wrapper.

## Solutions

<table>
<thead>
<tr>
<th><p>Driver Support</p></th>
<th><p><a href="https://github.com/nix-community/nixGL">NixGL</a></p></th>
<th><p><a href="https://github.com/numtide/nix-gl-host/">nix-gl-host</a></p></th>
<th><p><a href="https://github.com/soupglasses/nix-system-graphics">nix-system-graphics</a></p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>AMD (mesa)</p></td>
<td style="text-align:center;"><p>✅</p></td>
<td style="text-align:center;"><p>❌</p></td>
<td style="text-align:center;"><p>✅</p></td>
</tr>
<tr>
<td><p>Intel (mesa)</p></td>
<td style="text-align:center;"><p>✅</p></td>
<td style="text-align:center;"><p>❌</p></td>
<td style="text-align:center;"><p>✅</p></td>
</tr>
<tr>
<td><p>Nvidia (nouveau)</p></td>
<td style="text-align:center;"><p>✅</p></td>
<td style="text-align:center;"><p>❌</p></td>
<td style="text-align:center;"><p>✅</p></td>
</tr>
<tr>
<td><p>Nvidia (proprietary)</p></td>
<td style="text-align:center;"><p>✅</p></td>
<td style="text-align:center;"><p>✅</p></td>
<td style="text-align:center;"><p>⚠️ Must be manually set to match OS driver version</p></td>
</tr>
<tr>
<td><p>Functionality</p></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td><p>Graphical programs from nix</p></td>
<td colspan="2" style="text-align:center;"><p>⚠️ Must be manually wrapped</p></td>
<td style="text-align:center;"><p>✅</p></td>
</tr>
<tr>
<td><p>Graphical programs from host (non-nix) (<em>e.g.</em> launch non-nix web browser from nixpkgs#kitty)</p></td>
<td colspan="2" style="text-align:center;"><p>❌ Broken</p></td>
<td style="text-align:center;"><p>✅</p></td>
</tr>
<tr>
<td><p>License</p></td>
<td style="text-align:center;"><p>MIT</p></td>
<td style="text-align:center;"><p>Apache-2.0</p></td>
<td style="text-align:center;"><p>MIT</p></td>
</tr>
</tbody>
</table>

<a href="Category:Video" class="wikilink" title="Category:Video">Category:Video</a>
