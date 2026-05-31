<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS-based distributions -->

NixOS has spawned a number of distributions and distribution-like projects throughout its existence. This page is intended to record details about notable Linux distributions related to nix and NixOS in some capacity whether they are forks, downstreams, starter configurations that yield a NixOS environment, independent OS projects merely built with nix, or some combination thereof.

Entries on this page are categorized by their relation to nix, their release status, and a brief description of what the project aims to do, or any other notable differences between it and NixOS.

When appropriate, entries are noted as having significant deviations from NixOS, such as having an alternate kernel, an alternate init system (PID 1), or whether some part of the nix project was forked in order to create it.

## Linux distributions and their relation to NixOS

This table lists a non-exhaustive selection of Linux distributions based on NixOS, forked from NixOS, or derived from Nix or NixOS in any other way.

<table>
<thead>
<tr>
<th><p>Distribution</p></th>
<th><p>Repository</p></th>
<th><p>Relation to NixOS</p></th>
<th><p>Status</p></th>
<th><p>Notes</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p><a href="https://asterinas.github.io/">Asterinas NixOS</a></p></td>
<td><p><a href="https://github.com/asterinas/asterinas">https://github.com/asterinas/asterinas</a></p></td>
<td><ul>
<li>Based on NixOS</li>
<li>Alternate kernel</li>
</ul></td>
<td><p>Released</p></td>
<td><p>Asterinas is a hybrid kernel written in rust with the aim of replicating Linux at the syscall level. Asterinas NixOS is an operating system built using nix and nixpkgs, but with the Asterinas kernel instead of the Linux kernel.</p></td>
</tr>
<tr>
<td><p><a href="https://athenaos.org/">Athena OS</a></p></td>
<td><p><a href="https://github.com/Athena-OS/athena">https://github.com/Athena-OS/athena</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Pre-release</p></td>
<td><p>For pentesting. Currently available under both Arch and Nix/NixOS</p></td>
</tr>
<tr>
<td><p><a href="https://auxolotl.org">Auxolotl</a></p></td>
<td><p><a href="https://git.auxolotl.org/auxolotl">https://git.auxolotl.org/auxolotl</a></p></td>
<td><ul>
<li>Built with nix</li>
<li>Alternative to nixpkgs</li>
</ul></td>
<td><p>Work in progress (WIP)</p></td>
<td><p>Auxolotl (or aux) is a community-made alternative to nixpkgs. It borrows some ideas from Guix, such as a binary bootstrap. It is also working to improve on the developer experience of nixpkgs. Not yet ready for daily use.</p></td>
</tr>
<tr>
<td><p>Bureautix</p></td>
<td><p><a href="https://github.com/cloud-gouv/bureautix-example">https://github.com/cloud-gouv/bureautix-example</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Beta</p></td>
<td><p>Bureautix is a working implementation of Sécurix for use in office workstations, IT operations, and bureaucratic institutions who want a secure operating system.</p></td>
</tr>
<tr>
<td><p>Cosmix Saigon</p></td>
<td><p><a href="https://codeberg.org/thesaigoneer/cosmix-saigon">https://codeberg.org/thesaigoneer/cosmix-saigon</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>A spin of the Nixbook project with Cosmic as the primary desktop environment.</p></td>
</tr>
<tr>
<td><p><a href="https://docs.ctrl-os.com/">CTRL-OS</a></p></td>
<td><p>N/A</p></td>
<td><ul>
<li>Based on NixOS</li>
<li>LTS of nixpkgs</li>
</ul></td>
<td><p>Open Beta</p></td>
<td><p>CTRL-OS is a commercially supported downstream distribution of NixOS focused on embedded devices. Offers a 5 year long-term support release that meets the conditions of the Cyber Resilience Act (CRA).</p></td>
</tr>
<tr>
<td><p>Darnix</p></td>
<td><p><a href="https://github.com/jonhermansen/darnix">https://github.com/jonhermansen/darnix</a></p></td>
<td><ul>
<li>Built with nix</li>
<li>Alternative kernel</li>
<li>Alternative PID 1</li>
</ul></td>
<td><p>Work in Progress (WIP)</p></td>
<td><p>A working Darwin environment built using nix. Includes a working Darwin kernel and XNU. Not yet ready for daily use.</p></td>
</tr>
<tr>
<td><p>EduOS</p></td>
<td><p><a href="https://gitlab.com/eduos2/EduOS">https://gitlab.com/eduos2/EduOS</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>A purpose-built operating system used for administering the high-school French national exam in computer science.</p></td>
</tr>
<tr>
<td><p>Finix</p></td>
<td><p><a href="https://github.com/finix-community/finix">https://github.com/finix-community/finix</a></p></td>
<td><ul>
<li>Based on NixOS</li>
<li>Alternative PID 1</li>
<li>Soft fork of nixpkgs</li>
</ul></td>
<td><p>Work in progress (WIP)</p></td>
<td><p>NixOS with finit as PID 1. Currently working in an experimental capacity with most systems.</p></td>
</tr>
<tr>
<td><p><a href="https://glfos.org/">GLF OS</a></p></td>
<td><p><a href="https://framagit.org/gaming-linux-fr/glf-os/glf-os">https://framagit.org/gaming-linux-fr/glf-os/glf-os</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>Community distro for beginners and gaming oriented</p></td>
</tr>
<tr>
<td><p><a href="https://guix.gnu.org/">Guix System</a></p></td>
<td><p><a href="https://codeberg.org/guix/guix.git">https://codeberg.org/guix/guix.git</a></p></td>
<td><ul>
<li>Fork of nix</li>
<li>Alternative kernel</li>
<li>Alternative package set</li>
</ul></td>
<td><p>Released</p></td>
<td><p>NixOS but Guile Scheme instead of Nix and GNU underpinnings. Forked via "Developer &amp; code sharing, project merging".</p></td>
</tr>
<tr>
<td><p><a href="https://www.liminix.org/">Liminix</a></p></td>
<td><p><a href="https://gti.telent.net/dan/liminix">https://gti.telent.net/dan/liminix</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Work in progress (WIP)</p></td>
<td><p>Nix-based OpenWRT-style embedded Linux system for configuring consumer wifi routers.</p></td>
</tr>
<tr>
<td><p><a href="https://jovian-experiments.github.io/Jovian-NixOS/">Jovian-NixOS</a></p></td>
<td><p><a href="https://github.com/Jovian-Experiments/Jovian-NixOS/">https://github.com/Jovian-Experiments/Jovian-NixOS/</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>A set of configuration and packages for running NixOS on a Steamdeck.</p></td>
</tr>
<tr>
<td><p><a href="https://mobile-nixos.github.io/mobile-nixos/index.html">Mobile NixOS</a></p></td>
<td><p><a href="https://github.com/mobile-nixos/mobile-nixos">https://github.com/mobile-nixos/mobile-nixos</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>A mobile-phone operating system built using NixOS. Works only on select devices.</p></td>
</tr>
<tr>
<td><p><a href="https://nixbookos.org/">NixBook</a></p></td>
<td><p><a href="https://github.com/mkellyxp/nixbook">https://github.com/mkellyxp/nixbook</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>Self-updating, simple, minimal, set-and-forget, Chromebook-like NixOS operating system for total beginners. Offers "standard" and "minimal" flavors. Aims to be a replacement to Windows and MacOS for average users.</p></td>
</tr>
<tr>
<td><p>NixBSD</p></td>
<td><p><a href="https://github.com/nixos-bsd/nixbsd/">https://github.com/nixos-bsd/nixbsd/</a></p></td>
<td><ul>
<li>Fork of nixpkgs</li>
<li>Alternative kernel</li>
</ul></td>
<td><p>Released</p></td>
<td><p>Unofficial NixOS fork with a FreeBSD kernel.</p></td>
</tr>
<tr>
<td><p>NixNG</p></td>
<td><p><a href="https://github.com/nix-community/NixNG/">https://github.com/nix-community/NixNG/</a></p></td>
<td><ul>
<li>Based on NixOS</li>
<li>Alternative PID 1</li>
</ul></td>
<td><p>Work in progress (WIP)</p></td>
<td><p>Lightweight NixOS for containers with multiple non-<code>systemd</code> init systems and a "minimal by default" package set.</p></td>
</tr>
<tr>
<td><p>NASty</p></td>
<td><p><a href="https://github.com/nasty-project/nasty">https://github.com/nasty-project/nasty</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>WIP but released ;)</p></td>
<td><p>NAS operating system built on NixOS and bcachefs.</p></td>
</tr>
<tr>
<td><p>Sécurix</p></td>
<td><p><a href="https://github.com/cloud-gouv/securix">https://github.com/cloud-gouv/securix</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Beta</p></td>
<td><p>Sécurix is a NixOS-based secure operating system tailored for small to medium-sized teams. It provides a minimal, hardened environment with strong isolation, reproducibility, and policy-driven configurations to ensure operational security and compliance.</p></td>
</tr>
<tr>
<td><p>sixos</p></td>
<td><p><a href="https://codeberg.org/amjoseph/sixos">https://codeberg.org/amjoseph/sixos</a></p></td>
<td><ul>
<li>Based on NixOS</li>
<li>Alternative PID 1</li>
</ul></td>
<td><p>Work in progress (WIP)</p></td>
<td><p>NixOS with s6 as the init system. Also includes an alternative to the overlay system, and an alternative boot manager, ownerboot.</p></td>
</tr>
<tr>
<td><p><a href="https://snowflakeos.org/">SnowflakeOS</a></p></td>
<td><p><a href="https://github.com/snowfallorg">https://github.com/snowfallorg</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Alpha</p></td>
<td><p>For beginners. Not yet ready for daily use.</p></td>
</tr>
<tr>
<td><p><a href="https://spectrum-os.org/">Spectrum</a></p></td>
<td><p><a href="https://spectrum-os.org/git/">https://spectrum-os.org/git/</a></p></td>
<td><ul>
<li>Includes <code>nixpkgs</code></li>
</ul></td>
<td><p>Work in progress (WIP)</p></td>
<td><p>Spectrum is a project that aims to create a computer operating system, based on the principle of security by compartmentalization, that has a lower barrier to entry and is easier to use and maintain than other such systems.</p></td>
</tr>
<tr>
<td><p><a href="https://vpsadminos.org/">vpsAdminOS</a></p></td>
<td><p><a href="https://github.com/vpsfreecz/vpsadminos">https://github.com/vpsfreecz/vpsadminos</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Released</p></td>
<td><p>vpsAdminOS is a small OS serving as a host for unprivileged Linux system containers. It is based on NixOS and not-os.</p></td>
</tr>
</tbody>
</table>

## Deprecated distributions

Entries in this list are deprecated, unmaintained, under-maintained, or suspected abandoned. Some active distributions may still continue development of these projects as a fork.

<table>
<thead>
<tr>
<th><p>Distribution</p></th>
<th><p>Repository</p></th>
<th><p>Relation to NixOS</p></th>
<th><p>Reason Deprecated</p></th>
<th><p>Notes</p></th>
</tr>
</thead>
<tbody>
<tr>
<td><p><a href="https://noteed.com/not-os/">not-os</a></p></td>
<td><p><a href="https://github.com/noteed/not-os/">https://github.com/noteed/not-os/</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Unmaintained</p></td>
<td><p>An operating system builder for embedded systems.</p></td>
</tr>
<tr>
<td><p>RedNixOS</p></td>
<td><p><a href="https://github.com/redcode-labs/RedNixOS/">https://github.com/redcode-labs/RedNixOS/</a></p></td>
<td><ul>
<li>Based on NixOS</li>
</ul></td>
<td><p>Unmaintained</p></td>
<td><p>A NixOS build for cybersecurity enthusiasts.</p></td>
</tr>
</tbody>
</table>

<a href="Category:Lists" class="wikilink" title="Category:Lists">Category:Lists</a>
