<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Unfree software -->

Unfree software refers to software that has restrictive licensing on modification and/or redistribution. This type of software cannot be freely provided or distributed in an official capacity, which means that unfree software is neither built by <a href="Hydra" class="wikilink" title="Hydra">Hydra</a>, nor cached on the official <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>. Despite this, Nixpkgs offers a very large collection of unfree software as derivations, however they cannot be used by default without configuring Nixpkgs and opting in to unfree software usage.

[Nixpkgs manual on allowing unfree packages](https://nixos.org/manual/nixpkgs/stable/#sec-allow-unfree)

## Allowing unfree software

By default, nix will refuse to evaluate any <a href="Derivations" class="wikilink" title="derivation">derivation</a> containing unfree software, prompting the user to read the manual for more details. This behaviour can be configured in different ways depending on the context of the derivation.

### Unfree software in Flakes

For allowing unfree software in a flake-based config, see: <a href="Flakes#Enable_unfree_software" class="wikilink" title="Flakes#Enable_unfree_software">Flakes#Enable_unfree_software</a>.

### Unfree software using Home Manager

Depending on your <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> installation, there are multiple ways to allow unfree software.

#### Standalone Home Manager

If your Home Manager configuration isn't integrated into your <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> configuration (i.e. you switch generations using `home-manager switch` and not by rebuilding the whole system), then you may allow unfree software by setting the nixpkgs option in your config:

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
