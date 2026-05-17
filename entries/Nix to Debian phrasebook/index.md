<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix to Debian phrasebook -->

<table style="width:98%;">
<colgroup>
<col style="width: 18%" />
<col style="width: 25%" />
<col style="width: 27%" />
<col style="width: 28%" />
</colgroup>
<thead>
<tr>
<th width="18%"><p>Task</p></th>
<th width="25%"><p>Ubuntu</p></th>
<th width="27%"><p>NixOS (system-wide and root)</p></th>
<th width="28%"><p>NixOS (user) and Nix in general</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>Install a package</p></td>
<td><p><code>sudo apt-get install emacs</code></p></td>
<td><p>In /etc/nixos/configuration.nix: <code>systemPackages = with pkgs; [ &lt;other packages...&gt; emacs ];</code></p></td>
<td><p><code>nix-env -iA nixpkgs.emacs</code></p></td>
</tr>
<tr>
<td><p>Uninstall a package</p></td>
<td><p><code>sudo apt-get remove emacs</code></p></td>
<td><p>remove from /etc/nixos/configuration.nix: <code>sudo nixos-rebuild switch</code></p></td>
<td><p><code>nix-env -e emacs</code></p></td>
</tr>
<tr>
<td><p>Uninstall a package removing its configuration</p></td>
<td><p><code>apt-get purge emacs</code></p></td>
<td><p>All configuration is in configuration.nix</p></td>
<td></td>
</tr>
<tr>
<td><p>Update the list of packages</p></td>
<td><p><code>sudo apt-get update</code></p></td>
<td><p><code>sudo nix-channel --update</code></p></td>
<td><p><code>nix-channel --update</code></p></td>
</tr>
<tr>
<td><p>Upgrade packages</p></td>
<td><p><code>sudo apt-get upgrade</code></p></td>
<td><p><code>sudo nixos-rebuild switch</code></p></td>
<td><p><code>nix-env -u</code></p></td>
</tr>
<tr>
<td><p>Check for broken dependencies</p></td>
<td><p><code>sudo apt-get check</code></p></td>
<td><p><code>nix-store --verify --check-contents</code></p></td>
<td><p>unneeded!</p></td>
</tr>
<tr>
<td><p>List package dependencies</p></td>
<td><p><code>apt-cache depends emacs</code></p></td>
<td><p><code>nix-store --query --requisites $(readlink -f /run/current-system) &amp;&amp; nix-store -q --tree /nix/var/nix/profiles/system</code></p></td>
<td><p><code>nix-store --query --references $(nix-instantiate '</code><nixpkgs><code>' -A emacs)</code></p></td>
</tr>
<tr>
<td><p>List which packages depend on this one (reverse dependencies)</p></td>
<td><p><code>apt-cache rdepends emacs</code></p></td>
<td><p>For installed packages (only print reverse dependencies <em>which are already installed</em>): <code>nix-store --query --referrers $(which emacs)</code></p></td>
<td></td>
</tr>
<tr>
<td><p>Verify all installed packages</p></td>
<td><p><code>debsums</code></p></td>
<td><p><code>sudo nix-store --verify --check-contents</code></p></td>
<td><p><code>nix-store --verify --check-contents</code></p></td>
</tr>
<tr>
<td><p>Fix packages with failed checksums</p></td>
<td><p>Reinstall broken packages</p></td>
<td><p><code>sudo nix-store --verify --check-contents --repair</code></p></td>
<td><p><code>nix-store --verify --check-contents --repair</code></p></td>
</tr>
<tr>
<td><p>Select major version and stable/unstable</p></td>
<td><p>Change sources.list and apt-get dist-upgrade. A an extremely infrequent and destructive operation. The nix variants are safe and easy to use.</p></td>
<td><p>Add the unstable channel. At that address you will find names for other versions and variants. Name can be any string. <code>nix-channel --add </code><a href="https://nixos.org/channels/nixpkgs-unstable"><code>https://nixos.org/channels/nixpkgs-unstable</code></a><code> </code><name>Remove a channel. <code>nix-channel --remove </code><name><br />
Show all installed channel. <code>nix-channel --list</code></p></td>
<td><p>When run by a user channels work locally, when run by root they're used as the system-wide channels.</p></td>
</tr>
<tr>
<td><p>Private package repository</p></td>
<td><p>PPA</p></td>
<td><p>Define your package tree as in the general column, and include it in configuration.nix, then list your packages in systemPackages to make them available system wide.</p></td>
<td></td>
</tr>
<tr>
<td><p>Configure a package</p></td>
<td><p>sudo dpkg-reconfigure <package></p></td>
<td><p>edit /etc/nixos/configuration.nix</p></td>
<td><p>edit ~/.nixpkgs/config.nix</p></td>
</tr>
<tr>
<td><p>Find packages</p></td>
<td><p><code>apt-cache search emacs</code> or <code>apt search</code></p></td>
<td><p><code>nix-env -qaP '.*emacs.*'</code></p></td>
<td><p><code>nix-env -qaP '.*emacs.*'</code></p></td>
</tr>
<tr>
<td><p>Find a package which provides a file</p></td>
<td><p>with <code>apt-file</code> installed: <code>apt-file search bin/emacs</code></p></td>
<td><p>with <code>nix-index</code> installed: <code>nix-locate bin/emacs</code></p></td>
<td><p><code>nix-locate bin/emacs</code></p></td>
</tr>
<tr>
<td><p>Show package description</p></td>
<td><p><code>apt-cache show emacs</code></p></td>
<td><p><code>nix-env -qa --description '.*emacs.*'</code></p></td>
<td><p><code>nix-env -qa --description '.*emacs.*'</code></p></td>
</tr>
<tr>
<td><p>Show files installed by package</p></td>
<td><p><code>dpkg -L emacs</code></p></td>
<td><p><code>du -a $(readlink -f $(which emacs))</code></p></td>
<td></td>
</tr>
<tr>
<td><p>Show package for file</p></td>
<td><p><code>dpkg -S /usr/bin/emacs</code></p></td>
<td><p>follow the symlink</p></td>
<td><p>follow the symlink</p></td>
</tr>
<tr>
<td><p>Adding a user</p></td>
<td><p>sudo adduser alice</p></td>
<td><p>Add <code>users.extraUsers.alice = { isNormalUser = true; home = "/home/alice"; description = "Alice Foobar"; extraGroups = [ "wheel" "networkmanager" ]; openssh.authorizedKeys.keys = [ "ssh-dss AAAAB3Nza... alice@foobar" ]; };</code> to /etc/nixos/configuration.nix. Then run <code>nixos-rebuild switch</code></p></td>
<td></td>
</tr>
<tr>
<td><p>List binaries</p></td>
<td><p><code>ls /usr/bin/</code></p></td>
<td><p><code>ls /run/current-system/sw/bin &amp;&amp; ls /nix/var/nix/profiles/default/bin/</code></p></td>
<td><p><code>ls ~/.nix-profile/bin</code></p></td>
</tr>
<tr>
<td><p>Get the current version number</p></td>
<td><p><code>cat /etc/debian_version</code></p></td>
<td><p><code>nixos-version</code></p></td>
<td><p><code>nix-instantiate --eval '</code><nixpkgs><code>' -A lib.nixpkgsVersion</code></p></td>
</tr>
<tr>
<td><p>Get sources for a package</p></td>
<td><p><code>apt-get source emacs</code></p></td>
<td><p>In Debian, apt-get source gets both the patched upstream source and the recipe for the package. Those need two steps in Nix. To find the package recipe: <code>grep -r emacs $(nix-instantiate --eval --expr '</code><nixpkgs><code>')</code><br />
To download the source as specified by the package recipe: <code>nix-build '</code><nixpkgs><code>' -A emacs.src</code><br />
The patched source is usually not a derivation itself, but can be produced for most packages with the following command: <code>nix-shell '</code><nixpkgs><code>' -A emacs --command 'unpackPhase; patchPhase'</code><br />
Compile &amp; install a package from source <code>git clone foobar &amp;&amp; echo "with import </code><nixpkgs><code> { }; stdenv.lib.overrideDerivation foobar (oldAttrs: { src = ./foobar })" &gt; default.nix &amp;&amp; nix-build</code></p></td>
<td></td>
</tr>
<tr>
<td><p>Install a .deb</p></td>
<td><p><code>dpkg -i package.deb</code></p></td>
<td><p>Install dpkg with Nix, then <code>dpkg -i package.deb</code></p></td>
<td></td>
</tr>
</tbody>
</table>
