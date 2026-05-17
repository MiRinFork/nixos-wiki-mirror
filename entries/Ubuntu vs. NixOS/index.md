<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ubuntu vs. NixOS -->

<div class="table-responsive">

<table>
<thead>
<tr>
<th><p>|Task</p></th>
<th><p>|Ubuntu</p></th>
<th><p>|NixOS (system-wide and root)</p></th>
<th><p>|NixOS (user) and Nix in general</p></th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="4" style="text-align:center"><p><strong>Basic concepts</strong></p></td>
</tr>
<tr>
<td></td>
<td></td>
<td><p>This column will let you do everything you can with Ubuntu and more.</p></td>
<td><p>This column just isn't possible in Ubuntu.</p></td>
</tr>
<tr>
<td><p>Who can install packages and who can run them?</p></td>
<td><p>All packages are always system-wide and only root can install packages.</p></td>
<td><p>Packages root installs are system-wide. It does so through /etc/nixos/configuration.nix. If root installs packages the same way users do, through ~/.nixpkgs/config.nix, they are also global. Root's default profile is the system-wide default profile.</p></td>
<td><p>Users can install their own packages and have their own profiles (environments) through ~/.nixpkgs/config.nix</p></td>
</tr>
<tr>
<td><p>Package manager</p></td>
<td><p>apt which is really running on top of dpkg, sometimes wrapped by UIs like aptitude.</p></td>
<td><p>nix, but many system-wide operations are provided by nixos packages.</p></td>
<td><p>Just nix without the involvement of nixos.</p></td>
</tr>
<tr>
<td><p>How do you select your official sources and major releases</p></td>
<td><p>These are baked into the distribution (e.g. Ubuntu version X). Upgrades are hard and permanent.</p></td>
<td><p>At any time you select from a collection of channels. They're system-wide when set by root. You can roll back changes or switch channels with ease.</p></td>
<td><p>Channels are per-user if they're not set by root.</p></td>
</tr>
<tr>
<td><p>Where are packages installed?</p></td>
<td><p>apt installs globally into /bin/, /usr/, etc.</p></td>
<td><p>System-wide packages are in /run/current-system/sw/ (these are installed because of /etc/nixos/configuration.nix) and /nix/var/nix/profiles/default/bin/ (this is the profile managed by root). Note that the files are just symlinks to the real packages managed by nix in /nix/store/.</p></td>
<td><p>User packages are in ~/.nix-profile/. Note that the files are just symlinks to the real packages managed by nix in /nix/store/.</p></td>
</tr>
<tr>
<td><p>When changes take effect</p></td>
<td><p>As soon as the command runs. Commands are not atomic and can leave your machine in a bad state.</p></td>
<td><p>Most of the time you modify the configuration file and apply changes with nixos-rebuild switch <strong>TODO</strong>: How does one get nixos to do all the work for a switch and separate out the actual switching from fetching/building?</p></td>
<td><p>Most of the time you apply changes with nix-env -i all <strong>TODO</strong>: How does one get nix to do all the work for a switch and separate out the actual switching from fetching/building?</p></td>
</tr>
<tr>
<td><p>Packages</p></td>
<td><p>Uniformly referred to as packages</p></td>
<td><p>Technically called "derivations" but everyone calls them packages.</p></td>
<td><p>Technically called "derivations" but everyone calls them packages.</p></td>
</tr>
<tr>
<td colspan="4" style="text-align:center"><p><strong>Package management</strong></p></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td><p>Install a package for all users</p></td>
<td><pre class="console"><code>$ sudo apt-get install emacs</code></pre></td>
<td><p>1. Add to /etc/nixos/configuration.nix:</p>
<div class="sourceCode" id="cb2"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb2-1"><a href="#cb2-1" aria-hidden="true" tabindex="-1"></a>environment<span class="op">.</span>systemPackages = <span class="kw">with</span> pkgs<span class="op">;</span> <span class="op">[</span></span>
<span id="cb2-2"><a href="#cb2-2" aria-hidden="true" tabindex="-1"></a>  wget <span class="co"># let&#39;s assume wget was already present</span></span>
<span id="cb2-3"><a href="#cb2-3" aria-hidden="true" tabindex="-1"></a>  emacs</span>
<span id="cb2-4"><a href="#cb2-4" aria-hidden="true" tabindex="-1"></a><span class="op">]</span>;</span></code></pre></div>
<p>2. Run :</p>
<pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td><pre class="console"><code>$ nix-env -iA nixos.emacs</code></pre>
<p>Or with collections, add the package to your ~/.nixpkgs/config.nix and run</p>
<pre class="console"><code>$ nix-env -iA nixos.all</code></pre></td>
</tr>
<tr>
<td><p>Install a package for a specific user only</p></td>
<td><p>Not possible</p></td>
<td><p>1. Add to /etc/nixos/configuration.nix:</p>
<div class="sourceCode" id="cb6"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb6-1"><a href="#cb6-1" aria-hidden="true" tabindex="-1"></a>users<span class="op">.</span>users<span class="op">.</span>alice<span class="op">.</span>packages = <span class="kw">with</span> pkgs<span class="op">;</span> <span class="op">[</span> emacs <span class="op">]</span>;</span></code></pre></div>
<p>2. Run:</p>
<pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td><p>1. Add to ~/.nixpkgs/config.nix:</p>
<div class="sourceCode" id="cb8"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb8-1"><a href="#cb8-1" aria-hidden="true" tabindex="-1"></a>users<span class="op">.</span>users<span class="op">.</span>alice<span class="op">.</span>packages = <span class="kw">with</span> pkgs<span class="op">;[</span> emacs <span class="op">]</span>;</span></code></pre></div>
<p>2. Run:</p>
<pre class="console"><code>$ nix-env -iA nixos.all</code></pre></td>
</tr>
<tr>
<td><p>Install a service</p></td>
<td><pre class="console"><code>$ sudo apt install openssh-server</code></pre></td>
<td><p>1. Add to /etc/nixos/configuration.nix:</p>
<div class="sourceCode" id="cb11"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb11-1"><a href="#cb11-1" aria-hidden="true" tabindex="-1"></a>services<span class="op">.</span>openssh<span class="op">.</span>enable = <span class="cn">true</span>;</span></code></pre></div>
<p>2. Run:</p>
<pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td><p>Not possible</p></td>
</tr>
<tr>
<td><p>Uninstall a package</p></td>
<td><div class="sourceCode" id="cb13"><pre class="sourceCode bash"><code class="sourceCode bash"><span id="cb13-1"><a href="#cb13-1" aria-hidden="true" tabindex="-1"></a><span class="fu">sudo</span> apt-get remove emacs</span></code></pre></div></td>
<td><p>remove from /etc/nixos/configuration.nix</p>
<pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td><pre class="console"><code>$ nix-env --uninstall emacs</code></pre></td>
</tr>
<tr>
<td><p>Uninstall a package removing its configuration</p></td>
<td><pre class="console"><code>$ sudo apt-get purge emacs</code></pre></td>
<td><p>All configuration is in configuration.nix</p></td>
<td></td>
</tr>
<tr>
<td><p>Update the list of packages</p></td>
<td><pre class="console"><code>$ sudo apt-get update</code></pre></td>
<td><pre class="console"><code>$ sudo nix-channel --update</code></pre></td>
<td><pre class="console"><code>$ nix-channel --update</code></pre></td>
</tr>
<tr>
<td><p>Upgrade packages</p></td>
<td><pre class="console"><code>$ sudo apt-get upgrade</code></pre></td>
<td><pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td><pre class="console"><code>$ nix-env -u</code></pre></td>
</tr>
<tr>
<td><p>Check for broken dependencies</p></td>
<td><pre class="console"><code>$ sudo apt-get check</code></pre></td>
<td><pre class="console"><code>$ nix-store --verify --check-contents</code></pre></td>
<td><p>unneeded!</p></td>
</tr>
<tr>
<td><p>List package dependencies</p></td>
<td><pre class="console"><code>$ apt-cache depends emacs</code></pre></td>
<td><p>Show the direct dependencies:</p>
<pre class="console"><code>$ nix-store --query --requisites /run/current-system</code></pre>
<p>or show a nested ASCII tree of dependencies:</p>
<pre class="console"><code>$ nix-store -q --tree /nix/var/nix/profiles/system</code></pre>
<p>(/run/current-system and /nix/var/nix/profiles/system are symbolic links that eventually end up at the same place.)</p></td>
<td><pre class="console"><code>$ nix-store --query --references\
  $(nix-instantiate &#39;&lt;nixpkgs&gt;&#39; -A emacs)</code></pre>
<p>For installed packages:</p>
<pre class="console"><code>$ nix-store --query --references $(which emacs)</code></pre></td>
</tr>
<tr>
<td><p>List which packages depend on this one (reverse dependencies)</p></td>
<td><pre class="console"><code>$ apt-cache rdepends emacs</code></pre></td>
<td></td>
<td><p>For installed packages (only print reverse dependencies *which are already installed*):</p>
<pre class="console"><code>$ nix-store --query --referrers $(which emacs)</code></pre></td>
</tr>
<tr>
<td><p>Verify all installed packages</p></td>
<td><pre class="console"><code>$ debsums</code></pre></td>
<td><pre class="console"><code>$ sudo nix-store --verify --check-contents</code></pre></td>
<td><pre class="console"><code>$ nix-store --verify --check-contents</code></pre></td>
</tr>
<tr>
<td><p>Fix packages with failed checksums</p></td>
<td><p>Reinstall broken packages</p></td>
<td><pre class="console"><code>$ sudo nix-store --verify --check-contents --repair</code></pre></td>
<td><pre class="console"><code>$ nix-store --verify --check-contents --repair</code></pre></td>
</tr>
<tr>
<td><p>Select major version and stable/unstable</p></td>
<td><p>Change sources.list and apt-get dist-upgrade. A an extremely infrequent and destructive operation. The nix variants are safe and easy to use.</p></td>
<td><pre class="console"><code>$ nix-channel --add\
   https://nixos.org/channels/nixpkgs-unstable &lt;name&gt;</code></pre>
<p>Add the unstable channel. At that address you will find names for other versions and variants. Name can be any string.</p>
<pre class="console"><code>$ nix-channel --remove &lt;name&gt;</code></pre>
<p>To eliminate a channel.</p>
<pre class="console"><code>$ nix-channel --list</code></pre>
<p>To show all installed channel.</p></td>
<td><p>When run by a user channels work locally, when run by root they're used as the system-wide channels.</p></td>
</tr>
<tr>
<td><p>Private package repository</p></td>
<td><p>PPA</p></td>
<td><p>Define your package tree as in the general column, and include it in configuration.nix, then list your packages in systemPackages to make them available system wide</p></td>
<td><p>See <a href="https://sandervanderburg.blogspot.de/2014/07/managing-private-nix-packages-outside.html">1</a></p></td>
</tr>
<tr>
<td><p>Install a particular version of a package</p></td>
<td><pre class="console"><code>$ apt-get install package=version</code></pre></td>
<td><p>Although Nix on its own doesn't understand the concept of package versioning, you can install and play with older (or newer!) software via <a href="FAQ/Pinning_Nixpkgs" class="wikilink" title="FAQ/Pinning Nixpkgs">FAQ/Pinning Nixpkgs</a> with <a href="https://lazamar.co.uk/nix-versions">https://lazamar.co.uk/nix-versions</a>.</p>
<p>For instance, to launch an older version of Vim you could use:</p>
<pre class="console"><code>$ nix-shell \
    -p vim \
    -I nixpkgs=\https://github.com/NixOS/nixpkgs/archive/4bba6650a6a5a2009e25bdeed8c1e871601a9bfb.tar.gz</code></pre></td>
<td></td>
</tr>
<tr>
<td colspan="4" style="text-align:center"><p><strong>Package configuration</strong></p></td>
</tr>
<tr>
<td><p>Configure a package</p></td>
<td><pre class="console"><code>$ sudo dpkg-reconfigure &lt;package&gt;</code></pre></td>
<td><p>Edit /etc/nixos/configuration.nix</p></td>
<td><p>Edit ~/.nixpkgs/config.nix; <strong>TODO</strong>: More details about how to edit</p></td>
</tr>
<tr>
<td><p>Global package configuration</p></td>
<td><p>Modify configuration file in /etc/</p></td>
<td><p>Edit /etc/nixos/configuration.nix</p></td>
<td></td>
</tr>
<tr>
<td><p>Find packages</p></td>
<td><pre class="console"><code>$ apt-cache search emacs</code></pre></td>
<td><pre class="console"><code>$ nix-env -qaP &#39;.*emacs.*&#39;</code></pre>
<p>or</p>
<pre class="console"><code>$ nix search nixpkgs emacs</code></pre></td>
<td><pre class="console"><code>$ nix-env -qaP &#39;.*emacs.*&#39;</code></pre>
<p>or</p>
<pre class="console"><code>$ nix search nixpkgs emacs</code></pre></td>
</tr>
<tr>
<td><p>Show package description</p></td>
<td><pre class="console"><code>$ apt-cache show emacs</code></pre></td>
<td><pre class="console"><code>$ nix-env -qa --description &#39;.*emacs.*&#39;</code></pre></td>
<td><pre class="console"><code>$ nix-env -qa --description &#39;.*emacs.*&#39;</code></pre></td>
</tr>
<tr>
<td><p>Show files installed by package</p></td>
<td><pre class="console"><code>$ dpkg -L emacs</code></pre></td>
<td><pre class="console"><code>$ readlink -f $(which emacs)
 /nix/store/ji06y4haijly0i0knmr986l2dajffv1p-emacs-24.4/bin/emacs-24.4</code></pre>
<p>then</p>
<pre class="console"><code>$du -a /nix/store/ji06y4haijly0i0knmr986l2dajffv1p-emacs-24.4</code></pre></td>
<td><pre class="console"><code></code></pre></td>
</tr>
<tr>
<td><p>Show package for file</p></td>
<td><pre class="console"><code>$ dpkg -S /usr/bin/emacs</code></pre></td>
<td><p>follow the symlink or</p>
<pre class="console"><code>nix-locate /bin/emacs</code></pre>
<p>(requires</p>
<pre class="console"><code>nix-index</code></pre>
<p>package)</p></td>
<td><p>(same)</p></td>
</tr>
<tr>
<td colspan="4" style="text-align:center"><p><strong>Services</strong></p></td>
</tr>
<tr>
<td><p>Start a service</p></td>
<td><pre class="console"><code>$ sudo systemctl start apache</code></pre></td>
<td><pre class="console"><code>$ sudo systemctl start apache</code></pre></td>
<td></td>
</tr>
<tr>
<td><p>Stop a service</p></td>
<td><pre class="console"><code>$ sudo systemctl stop apache</code></pre></td>
<td><pre class="console"><code>$ sudo systemctl stop apache</code></pre></td>
<td></td>
</tr>
<tr>
<td><p>Enable a service</p></td>
<td><pre class="console"><code>$ sudo systemctl enable apache</code></pre></td>
<td><p>In /etc/nixos/configuration.nix, add</p>
<pre class="console"><code>services.tor.enable = true;</code></pre>
<p>, then run</p>
<pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td></td>
</tr>
<tr>
<td><p>Disable a service</p></td>
<td><pre class="console"><code>$ sudo systemctl disable apache</code></pre></td>
<td><p>In /etc/nixos/configuration.nix, add</p>
<pre class="console"><code>services.tor.enable = false;</code></pre>
<p>, then run</p>
<pre class="console"><code>$ sudo nixos-rebuild switch</code></pre></td>
<td></td>
</tr>
<tr>
<td><p>Where your log files live</p></td>
<td><p>/var/log/</p></td>
<td><p>System-wide packages /var/log/</p></td>
<td><p>User packages ~/.nix-profile/var/log/</p></td>
</tr>
<tr>
<td><p>Adding a user</p></td>
<td><pre class="console"><code>$ sudo adduser alice</code></pre></td>
<td><p>Add</p>
<div class="sourceCode" id="cb69"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb69-1"><a href="#cb69-1" aria-hidden="true" tabindex="-1"></a>users<span class="op">.</span>users<span class="op">.</span>alice =</span>
<span id="cb69-2"><a href="#cb69-2" aria-hidden="true" tabindex="-1"></a> <span class="op">{</span> <span class="va">isNormalUser</span> <span class="op">=</span> <span class="cn">true</span><span class="op">;</span></span>
<span id="cb69-3"><a href="#cb69-3" aria-hidden="true" tabindex="-1"></a>   <span class="va">home</span> <span class="op">=</span> <span class="st">&quot;/home/alice&quot;</span><span class="op">;</span></span>
<span id="cb69-4"><a href="#cb69-4" aria-hidden="true" tabindex="-1"></a>   <span class="va">description</span> <span class="op">=</span> <span class="st">&quot;Alice Foobar&quot;</span><span class="op">;</span></span>
<span id="cb69-5"><a href="#cb69-5" aria-hidden="true" tabindex="-1"></a>   <span class="va">extraGroups</span> <span class="op">=</span> <span class="op">[</span> <span class="st">&quot;wheel&quot;</span> <span class="st">&quot;networkmanager&quot;</span> <span class="op">];</span></span>
<span id="cb69-6"><a href="#cb69-6" aria-hidden="true" tabindex="-1"></a>   <span class="va">openssh</span>.<span class="va">authorizedKeys</span>.<span class="va">keys</span> <span class="op">=</span></span>
<span id="cb69-7"><a href="#cb69-7" aria-hidden="true" tabindex="-1"></a>      <span class="op">[</span> <span class="st">&quot;ssh-dss AAAAB3Nza... alice@foobar&quot;</span> <span class="op">];</span></span>
<span id="cb69-8"><a href="#cb69-8" aria-hidden="true" tabindex="-1"></a> <span class="op">}</span>;</span></code></pre></div>
<p>to /etc/nixos/configuration.nix and then call</p>
<div class="sourceCode" id="cb70"><pre class="sourceCode nix"><code class="sourceCode nix"><span id="cb70-1"><a href="#cb70-1" aria-hidden="true" tabindex="-1"></a>nixos<span class="op">-</span>rebuild switch</span></code></pre></div></td>
<td></td>
</tr>
<tr>
<td colspan="4" style="text-align:center"><p><strong>Misc tasks</strong></p></td>
</tr>
<tr>
<td><p>List binaries</p></td>
<td><pre class="console"><code>$ ls /usr/bin/</code></pre></td>
<td><pre class="console"><code>$ ls /run/current-system/sw/bin &amp;&amp;\
ls /nix/var/nix/profiles/default/bin/</code></pre></td>
<td><pre class="console"><code>$ ls ~/.nix-profile/bin</code></pre></td>
</tr>
<tr>
<td><p>Get the current version number</p></td>
<td><pre class="console"><code>$ cat /etc/debian_version</code></pre></td>
<td><pre class="console"><code>$ nixos-version</code></pre></td>
<td></td>
</tr>
<tr>
<td><p>Get sources for a package</p></td>
<td><div class="sourceCode" id="cb76"><pre class="sourceCode bash"><code class="sourceCode bash"><span id="cb76-1"><a href="#cb76-1" aria-hidden="true" tabindex="-1"></a><span class="ex">$</span> sudo apt-get source emacs</span></code></pre></div></td>
<td></td>
<td><p>In Debian, apt-get source gets both the patched upstream source and the recipe for the package. Those need two steps in Nix.</p>
<p>To find the package's attribute path:</p>
<pre class="console"><code>$ nix-env -qaP emacs</code></pre>
<p>or</p>
<pre class="console"><code>$ nox emacs</code></pre>
<p>To download the source as specified by the package recipe:</p>
<div class="sourceCode" id="cb79"><pre class="sourceCode bash"><code class="sourceCode bash"><span id="cb79-1"><a href="#cb79-1" aria-hidden="true" tabindex="-1"></a><span class="ex">nix-build</span> <span class="st">&#39;&lt;nixpkgs&gt;&#39;</span> <span class="at">-A</span> emacs.src</span></code></pre></div>
<p>The patched source is usually not a derivation itself, but can be produced for most packages with the following command:</p>
<div class="sourceCode" id="cb80"><pre class="sourceCode bash"><code class="sourceCode bash"><span id="cb80-1"><a href="#cb80-1" aria-hidden="true" tabindex="-1"></a><span class="ex">nix-shell</span> <span class="st">&#39;&lt;nixpkgs&gt;&#39;</span> <span class="at">-A</span> emacs<span class="dt">\</span></span>
<span id="cb80-2"><a href="#cb80-2" aria-hidden="true" tabindex="-1"></a> <span class="at">--command</span> <span class="st">&#39;unpackPhase; cd $sourceRoot; patchPhase&#39;</span></span></code></pre></div></td>
</tr>
<tr>
<td><p>Compile &amp; install a package from source</p></td>
<td></td>
<td></td>
<td><pre class="console"><code>git clone foobar
cat &gt;default.nix &lt;&lt;EOF
with import &lt;nixpkgs&gt; { };
lib.overrideDerivation foobar (oldAttrs : {
src = ./foobar;
})
EOF
nix-build</code></pre></td>
</tr>
<tr>
<td><p>Install a binary package</p></td>
<td></td>
<td></td>
<td><p>e.g. via <a href="https://github.com/Mic92/nix-ld#nix-ld">nix-ld</a></p></td>
</tr>
<tr>
<td><p>Install a .deb</p></td>
<td><pre class="console"><code>$ sudo dpkg -i package.deb</code></pre></td>
<td></td>
<td><p>Install dpkg with Nix, then</p>
<div class="sourceCode" id="cb83"><pre class="sourceCode bash"><code class="sourceCode bash"><span id="cb83-1"><a href="#cb83-1" aria-hidden="true" tabindex="-1"></a><span class="ex">dpkg</span> <span class="at">-i</span> package.deb</span></code></pre></div>
<p>While this is technically possible it will in all likelihood not work.</p></td>
</tr>
</tbody>
</table>

</div>

## See also

- <a href="Cheatsheet" class="wikilink" title="Cheatsheet">Cheatsheet</a>
- <https://nixcademy.com/cheatsheet/>
  - <https://nixcademy.com/downloads/cheatsheet.pdf>

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
