<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Terms and Definitions in Nix Project -->

<languages/> <translate> If you come across a term or word you don't know, add it here.

<table>
<thead>
<tr>
<th scope="col" style="width:50px;"><p>Term</p></th>
<th scope="col" style="width: 60px;"><p>Context</p></th>
<th><p>Meaning</p></th>
<th><p>Related Links</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>|</p>
<div id="user_environment">
</div>
<p><a href="User_Environment" class="wikilink" title="User Environment">User Environment</a></p></td>
<td><p>| Nix</p></td>
<td><p>| A set of "active" applications. These applications usually exist in the Nix store. A single Nix user may have multiple <em>user environments</em>. <em>Profiles</em> and <em>generations</em> are closely related.</p></td>
<td><p>| <br />
<br />
</p></td>
</tr>
<tr>
<td><p>| (User) Profile</p></td>
<td><p>| Nix</p></td>
<td><p>| Profiles simplify managing and switching between <em>user environments</em>, and thus control which applications and system configurations are in active use. Generally, a <em>profile</em> is a link to a <em>generation</em>, and the corresponding <strong>profiles</strong> folder collects a list of generations. A standalone Nix installation (i.e. on a Linux distro that is not NixOS) operates mainly on <em>user</em> profiles. In NixOS, there is also a <em>system</em> profile that manages the system-wide configuration (e.g. <em>/etc</em>, the kernel, <em>initrd</em>, <em>systemd</em>). Other tools like <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> may also have their own profiles. By default, a user's active profile is stored at <em>~/.nix-profile</em>:</p>
<pre class="shell"><code>$ ls -l ~/.nix-profile
lrwxrwxrwx ... /home/username/.nix-profile -&gt;
/nix/var/nix/profiles/per-user/username/profile</code></pre></td>
<td><p>| <a href="http://nixos.org/nix/manual/#sec-profiles">Nix Manual: Profiles</a><br />
<a href="https://nixos.org/guides/nix-pills/install-on-your-running-system.html#idm140737320787760">Nix Pills - The first profile</a></p></td>
</tr>
<tr>
<td><p>|</p>
<div id="generation">
</div>
<p>Generation</p></td>
<td><p>| Nix</p></td>
<td><p>| An instance of a <em>user environment</em>. When a user makes any change to their environment, such as installing or removing packages, a new <em>generation</em> of the environment is created instead of modifying the environment in-place. This ensures that updates are atomic and the user can easily roll-back to any previous generation if something goes wrong. The <em>current generation</em> is a user's currently active user profile.</p></td>
<td><p>| <a href="https://nix.dev/manual/nix/stable/package-management/profiles">Nix Manual: Profiles</a></p></td>
</tr>
<tr>
<td><p>| Derivation</p></td>
<td><p>| Nix</p></td>
<td><p>| A Nix expression which describes a build action. Derivations are analogous to package definitions in other package managers. High-level derivations, such as the ones describing packages in <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>, get evaluated into low-level derivations (called <em>store derivations</em>), for instance by using the <code>nix-instantiate</code> command. <code>nix-store --realise</code> runs the build commands described in the low-level derivation, producing one or more <em>output paths</em>. <code>nix-build</code> is a user-friendly wrapper for the previous two commands.</p></td>
<td><p>| <a href="http://nixos.org/nix/manual/#gloss-derivation">Nix Manual: Glossary - Derivation</a><br />
<a href="http://nixos.org/nix/manual/#ssec-derivation">Nix Manual: Derivation</a></p></td>
</tr>
<tr>
<td><p>| Output path</p></td>
<td><p>| Nix</p></td>
<td><p>| A <em>store path</em> produced by a derivation. These are generally analogous to built packages, or pieces of them.</p>
<pre class="shell"><code>$ ls -ld /nix/store/*-firefox-9*/
dr-xr-xr-x ... /nix/store/v4b8...3d0w-firefox-92.0/</code></pre></td>
<td><p>| <a href="http://nixos.org/nix/manual/#ssec-derivation">Nix Manual: Derivation</a></p></td>
</tr>
<tr>
<td><p>| <code>rec { }</code></p></td>
<td><p>| Nix expressions</p></td>
<td><p>| The <code>{ }</code> block contains "mutually recursive" attributes, which means they can refer to each other.</p></td>
<td><p>| <a href="https://nix.dev/manual/nix/2.24/language/syntax.html#recursive-sets">Nix Manual: Syntax and semantics: Recursive sets</a></p></td>
</tr>
<tr>
<td><p>| <code>expression evaluator</code></p></td>
<td><p>| Nix</p></td>
<td><p>| The part of the Nix program which reads and evaluates a Nix expression.</p></td>
<td><p>| <a href="http://nixos.org/nix/manual/#sec-common-options">Nix Manual: Common Options</a> <code>--arg</code><br />
<a href="http://nixos.org/nix/manual/#ssec-builtins">Nix Manual: Built-in Functions</a></p></td>
</tr>
<tr>
<td><p>| <code>stdenv</code></p></td>
<td><p>| Nix expressions</p></td>
<td><p>| An attribute which contains things expected in the most basic Unix environment. (e.g. Bash shell, <code>gcc</code>, <code>cp</code>, <code>tar</code>, <code>grep</code>, etc.)</p></td>
<td><p>| <a href="https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/all-packages.nix#L224">all-packages.nix: <code>stdenv =</code></a>]</p></td>
</tr>
<tr>
<td><p>| <code>config.nix</code> or <code>nixpkgs-config.nix</code></p></td>
<td><p>| NixOS Wiki</p></td>
<td><p>| A Nix expression retrieved by and applied to the <code>all-packages.nix</code> Nix expression. This file enables an end-user to customize the Nix expressions contained in the community-owned NixPkgs list or to define entirely new Nix expressions to use with Nix commands. This file's path can be overridden by the <code>NIXPKGS_CONFIG</code> environment variable.</p></td>
<td><p>| <a href="https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/all-packages.nix#L54">all-packages.nix: <code>config</code></a> <a href="https://github.com/NixOS/nixpkgs/blob/master/doc/release-notes.xml#L366">NixPkgs Release Notes</a></p></td>
</tr>
<tr>
<td><p>| attribute path</p></td>
<td><p>| nix-env takes this if you pass the `-A` flag <a href="http://nixos.org/nix/manual/#opt-attr">1</a></p></td>
<td><p>| an unambiguous identifier for a package</p></td>
<td><p>|</p></td>
</tr>
<tr>
<td><p>| symbolic package name</p></td>
<td><p>| <a href="http://nixos.org/nix/manual/#sec-building-simple">2</a></p></td>
<td><p>| This string represents what you commonly think of as a package. There can be multiple packages with the symbolic name "hello".</p></td>
<td><p>|</p></td>
</tr>
<tr>
<td><p>| selector</p></td>
<td><p>| this term is used in nix-env error messages <a href="https://github.com/NixOS/nix/blob/bdc4a0b54d54146448061dd9a248212f98a9f801/src/nix-env/nix-env.cc">3</a>, it seems to be actually a DrvName struct <a href="https://github.com/NixOS/nix/blob/bdc4a0b54d54146448061dd9a248212f98a9f801/src/libexpr/names.cc">4</a> (a derivation name)</p></td>
<td><p>| see "symbolic package name"</p></td>
<td><p>|</p></td>
</tr>
<tr>
<td><p>| selection path</p></td>
<td><p>| nix-shell error message <a href="https://github.com/NixOS/nix/blob/bdc4a0b54d54146448061dd9a248212f98a9f801/src/libexpr/attr-path.cc#L73">5</a></p></td>
<td><p>| see "attribute path"<a href="http://nixos.org/irc/logs/log.20151103">6</a></p></td>
<td><p>|</p></td>
</tr>
<tr>
<td><p>| derivation name</p></td>
<td><p>| manual<a href="http://nixos.org/nix/manual/#rsec-nix-env-install">7</a>, source code <a href="https://github.com/NixOS/nix/blob/bdc4a0b54d54146448061dd9a248212f98a9f801/src/libexpr/names.cc">8</a></p></td>
<td><p>| see "symbolic package name"</p></td>
<td><p>|</p></td>
</tr>
<tr>
<td><p>| package name</p></td>
<td><p>| IRC<a href="http://nixos.org/irc/logs/log.20151103">9</a></p></td>
<td><p>| see "symbolic package name"</p></td>
<td><p>|</p></td>
</tr>
<tr>
<td><p>| attribute selection path</p></td>
<td><p>| source<a href="https://github.com/NixOS/nix/blob/bdc4a0b54d54146448061dd9a248212f98a9f801/src/libexpr/attr-path.cc#L41">10</a></p></td>
<td><p>| see "attribute path"</p></td>
<td><p>| &lt;!--</p></td>
</tr>
<tr>
<td><p>| <code>(term)</code></p></td>
<td><p>| (where you saw the term)</p></td>
<td><p>| (meaning)</p></td>
<td><p>| (related links) --&gt;</p></td>
</tr>
</tbody>
</table>

</translate>

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
