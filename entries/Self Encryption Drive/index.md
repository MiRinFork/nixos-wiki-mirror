<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Self Encryption Drive -->

To encrypt your drive using the OPAL standard that many modern storage devices implement you have to follow the instructions on this page: <https://github.com/Drive-Trust-Alliance/sedutil/wiki/Encrypting-your-drive>

The relevant configuration bits for NixOS are here: <https://gist.github.com/callahad/a42d1e7edeaffa68517405e35a173b56>

Kernels since 19.03 do have the necessary option **CONFIG_BLK_SED_OPAL** to let this work on suspend/resume. See <https://github.com/NixOS/nixpkgs/pull/56147>

Please be aware that the use of this encryption raises some security concerns and maybe vulnerable to a number of security attacks, see:

- <https://media.ccc.de/v/35c3-9671-self-encrypting_deception>
- <https://wiki.archlinux.org/index.php/Self-Encrypting_Drives>

and <https://logs.nix.samueldr.com/nixos/2019-10-08#2661066>

<a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
