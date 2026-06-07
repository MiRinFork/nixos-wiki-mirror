<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Comparison of NixOS setups -->

This table provides a **comparison of NixOS setups**, may them be templates, user or domain-specific setups, and more. It can be useful to NixOS users who want to take inspiration and learn from existing configurations.

## Definitions

Name  
Name of the setup.

Domain  
The application of the setup, including template, user configuration, or domain-specific configuration.

Flakes  
Whether it implements <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> or not.

Home Manager  
Whether it makes use of <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> or not.

Secrets  
A list of supported <a href="Comparison_of_secret_managing_schemes" class="wikilink" title="secret management schemes">secret management schemes</a>.

File system  
A list of the main file systems used (e.g. BTRFS, ZFS, EXT4, etc).

System encryption  
Whether it has encryption on a system level or not, and the software it uses for encryption (e.g. LUKS, ZFS native, etc).

Opt-in state  
Whether it supports opt-in state or not.

Display server  
A list of supported display servers (e.g. X, Wayland, etc)

Desktop environment  
A list of supported desktop environments (e.g. i3, GNOME, KDE, LXQt, Sway, XFCE, Xmonad, etc).

Maintained  
Whether its repository has commits in the last 10 months or not.

Repository  
Link to the repository.

## General information

<table>
<thead>
<tr>
<th><p>Name</p></th>
<th><p>Domain</p></th>
<th><p><a href="Flakes" class="wikilink" title="Flakes">Flakes</a></p></th>
<th><p><a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a></p></th>
<th><p><a href="Comparison_of_secret_managing_schemes" class="wikilink" title="Secrets">Secrets</a></p></th>
<th><p>File system</p></th>
<th><p>System encryption</p></th>
<th><p>Opt-in state</p></th>
<th><p>Display server</p></th>
<th><p>Desktop environment / Window manager</p></th>
<th><p>Maintained</p></th>
<th><p>Repository</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Digga</p></td>
<td><p>Library, framework</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>agenix</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p><a href="https://github.com/divnix/digga/issues/503">No</a></p></td>
<td><p><a href="https://github.com/divnix/digga">divnix/digga</a></p></td>
</tr>
<tr>
<td><p>DevOS</p></td>
<td><p>Template (Digga)</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>agenix</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p><a href="https://github.com/divnix/digga/issues/503">No</a></p></td>
<td><p><a href="https://github.com/divnix/digga/tree/main/examples/devos">divnix/digga/examples/devos</a></p></td>
</tr>
<tr>
<td><p>hlissner/dotfiles</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>agenix</p></td>
<td><p><a href="ZFS" class="wikilink" title="ZFS">ZFS</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>bspwm</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/hlissner/dotfiles">hlissner/dotfiles</a></p></td>
</tr>
<tr>
<td><p>~hutzdog/dotfiles</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>pass-secret-service</p></td>
<td><p><a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>Awesome</p></td>
<td><p>No</p></td>
<td><p><a href="https://man.sr.ht/~hutzdog/dotfiles">~hutzdog/dotfiles</a></p></td>
</tr>
<tr>
<td><p>nixos-flake-example</p></td>
<td><p>Template</p></td>
<td><p>Yes</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/colemickens/nixos-flake-example">colemickens/nixos-flake-example</a></p></td>
</tr>
<tr>
<td><p>SoxinOS</p></td>
<td><p>Template</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>sops-nix</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>i3</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/SoxinOS/soxin">SoxinOS/soxin</a></p></td>
</tr>
<tr>
<td><p>not-os</p></td>
<td><p>Domain-specific<br />
(embedded system)</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/cleverca22/not-os">cleverca22/not-os</a></p></td>
</tr>
<tr>
<td><p>NixOS-WSL</p></td>
<td><p>Template (WSL)</p></td>
<td><p>Yes</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/Trundle/NixOS-WSL">Trundle/NixOS-WSL</a></p></td>
</tr>
<tr>
<td><p>Simple NixOS Mailserver</p></td>
<td><p>Domain-specific<br />
(mail server)</p></td>
<td><p>Yes</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://gitlab.com/simple-nixos-mailserver/nixos-mailserver">simple-nixos-mailserver/nixos-mailserver</a></p></td>
</tr>
<tr>
<td><p>Nix Portable</p></td>
<td><p>Domain-specific<br />
(portable Nix binary)</p></td>
<td><p>Yes</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/DavHau/nix-portable">DavHau/nix-portable</a></p></td>
</tr>
<tr>
<td><p>rasendubi/dotfiles</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>GPG, Yubikey</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>EXWM</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/rasendubi/dotfiles">rasendubi/dotfiles</a></p></td>
</tr>
<tr>
<td><p>RGBCube/NCC</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>agenix</p></td>
<td><p><a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a>, <a href="Ext4" class="wikilink" title="Ext4">Ext4</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>Wayland</p></td>
<td><p>Hyprland</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/RGBCube/NCC">RGBCube/NCC</a></p></td>
</tr>
<tr>
<td><p>puffnfresh/nix-files</p></td>
<td><p>User configuration</p></td>
<td><p>No</p></td>
<td><p>Yes</p></td>
<td></td>
<td><p><a href="ZFS" class="wikilink" title="ZFS">ZFS</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X, Wayland</p></td>
<td><p>XMona, Xfce, Sway</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/puffnfresh/nix-files">puffnfresh/nix-files</a></p></td>
</tr>
<tr>
<td><p>Shabka</p></td>
<td><p>User configuration</p></td>
<td><p>No</p></td>
<td><p>Yes</p></td>
<td></td>
<td><p><a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>i3</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/kalbasit/shabka">kalbasit/shabka</a></p></td>
</tr>
<tr>
<td><p>MatthewCroughan/nixcfg</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>None</p></td>
<td><p><a href="ZFS" class="wikilink" title="ZFS">ZFS</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>No</p></td>
<td><p>Wayland</p></td>
<td><p>Sway</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/MatthewCroughan/nixcfg">MatthewCroughan/nixcfg</a></p></td>
</tr>
<tr>
<td><p>Icy-Thought/Snowflake</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>agenix</p></td>
<td><p><a href="Ext4" class="wikilink" title="Ext4">Ext4</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>Xmonad, LeftWM, Gnome, KDE Plasma</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/Icy-Thought/Snowflake">Icy-Thought/Snowflake</a></p></td>
</tr>
<tr>
<td><p>NixOSEncryptedLiveCD</p></td>
<td><p>Domain-specific</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td></td>
<td></td>
<td><p>Yes (LUKS)</p></td>
<td><p>Yes</p></td>
<td><p>X, Wayland</p></td>
<td><p>GNOME, KDE, Mate, LXQt, Enlightenment, Sway, Xfce, Lumina</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/adrianparvino/NixOSEncryptedLiveCD">adrianparvino/NixOSEncryptedLiveCD</a></p></td>
</tr>
<tr>
<td><p>tudurom/dotfiles</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>agenix</p></td>
<td><p><a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a>, <a href="ZFS" class="wikilink" title="ZFS">ZFS</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>Yes</p></td>
<td><p>X, Wayland</p></td>
<td><p>Sway, Gnome</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/tudurom/dotfiles">tudurom/dotfiles</a></p></td>
</tr>
<tr>
<td><p>balsoft/nixos-config</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td></td>
<td><p><a href="Ext4" class="wikilink" title="Ext4">Ext4</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>Yes</p></td>
<td><p>Wayland</p></td>
<td><p>Sway</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/balsoft/nixos-config">balsoft/nixos-config</a></p></td>
</tr>
<tr>
<td><p>srid/nixos-config</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td></td>
<td><p><a href="Ext4" class="wikilink" title="Ext4">Ext4</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X</p></td>
<td><p>Xmonad, Gnome, KDE Plasma</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/srid/nixos-config">srid/nixos-config</a></p></td>
</tr>
<tr>
<td><p>mt-caret/nix-config</p></td>
<td><p>User configuration</p></td>
<td><p>No</p></td>
<td><p>Yes</p></td>
<td></td>
<td><p><a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a></p></td>
<td><p>No</p></td>
<td><p>Yes</p></td>
<td><p>X</p></td>
<td><p>Xmonad</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/mt-caret/nix-config">mt-caret/nix-config</a></p></td>
</tr>
<tr>
<td><p>grahamc/nixos-config</p></td>
<td><p>User configuration</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td></td>
<td><p><a href="ZFS" class="wikilink" title="ZFS">ZFS</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>No</p></td>
<td><p>X, Wayland</p></td>
<td><p>i3, Sway</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/grahamc/nixos-config">grahamc/nixos-config</a></p></td>
</tr>
<tr>
<td><p><a href="user:Ericson2314" class="wikilink" title="Ericson2314">Ericson2314</a>/nixos-configuration</p></td>
<td><p>User configuration</p></td>
<td><p>No</p></td>
<td><p>Yes</p></td>
<td></td>
<td><p><a href="ZFS" class="wikilink" title="ZFS">ZFS</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>No</p></td>
<td><p>X, Wayland</p></td>
<td><p>Sway, Xmonad</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://github.com/Ericson2314/nixos-configuration">Ericson2314/nixos-configuration</a></p></td>
</tr>
<tr>
<td><p>vms.nix</p></td>
<td><p>Domain-specific<br />
(virtual machines)</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td></td>
<td><p><a href="Ext4" class="wikilink" title="Ext4">Ext4</a></p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p><a href="https://github.com/Nekroze/vms.nix">Nekroze/vms.nix</a></p></td>
</tr>
<tr>
<td><p>engmark/root</p></td>
<td><p>User configuration</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>None</p></td>
<td><p>None</p></td>
<td><p>No</p></td>
<td><p>No</p></td>
<td><p>X, Wayland</p></td>
<td><p>GNOME, KDE Plasma</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://gitlab.com/engmark/root">engmark/root</a></p></td>
</tr>
<tr>
<td><p>kiara/cfg</p></td>
<td><p>User configuration</p></td>
<td><p>Yes</p></td>
<td><p>Yes</p></td>
<td><p>sops-nix</p></td>
<td><p><a href="Btrfs" class="wikilink" title="Btrfs">Btrfs</a></p></td>
<td><p>Yes (LUKS)</p></td>
<td><p>Yes</p></td>
<td><p>Wayland</p></td>
<td><p>Niri</p></td>
<td><p>Yes</p></td>
<td><p><a href="https://codeberg.org/kiara/cfg">kiara/cfg</a></p></td>
</tr>
</tbody>
</table>

## External links

- [GitHub search by most starred "nixos language:nix"](https://github.com/search?o=desc&p=1&q=nixos+language%3Anix&s=stars&type=Repositories)
- [Most starred public NixOS repos on GitLab](https://gitlab.com/explore/projects/topics/nixos?sort=stars_desc&visibility_level=20)

<a href="Category:Community" class="wikilink" title="Category:Community">Category:Community</a> <a href="Category:Lists" class="wikilink" title="Category:Lists">Category:Lists</a>
