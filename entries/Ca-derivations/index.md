<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ca-derivations -->

**ca derivations** (or more formally *Floating content-addressed derivations*) is an upcoming feature of the Nix package manager.

Without entering too much into the details − [this blog post](https://www.tweag.io/blog/2020-09-10-nix-cas/) or [the relevant section in Eelco’s PhD thesis](https://edolstra.github.io/pubs/phd-thesis.pdf#page=143) provide a more detailed explanation of the underlying idea and its consequences − content-addressed Nix is an extension of the Nix model bringing several new possibilities. In particular, it enables “early cutoff” (stopping a rebuild if it can be proved that the end-result will be the same as something already known), which could reduce hydra’s (and yours) load and storage a lot. It also changes the Trust model of Nix, allowing for example several users to share the same store without trusting each other.

## Setting-up Nix for CA derivations

Being still an experimental feature, CA derivations currently require an explicit opt-in.

### On NixOS

In NixOS this can be achieved with the following options in configuration.nix.

``` nix
{ pkgs, ... }: {
   nix.settings.experimental-features = [
    "ca-derivations"
  ];
}
```

### Non NixOS

Make sure the file \`/etc/nix/nix.conf\` exists and contains the following:

``` ini
experimental-features = ca-derivations
```

## Using CA derivations

The feature is opt-in, meaning that each derivation must individually be marked as content-addressed. When using `nixpkgs-unstable`, this can be done by setting `__contentAddressed = true` in the call to mkDerivation.

It is also possible to mark all the derivations as content-addressed by default, by passing `config.contentAddressedByDefault = true` as argument to nixpkgs.

## Ensuring that a derivation is properly content-addressed

Once a derivation has been built, one can check that it is indeed content-addressed by running `nix path-info --sigs {outPath}`. If this yields a line containing `ca:fixed:r:…`, then it means that the path is indeed content-addressed (and as such is trusted by your system). For example:

``` console
$ nix-build '<nixpkgs>' --arg config '{ contentAddressedByDefault = true; }' -A vim
/nix/store/988jq9bj7s336q48bzdaamcl90k5g1yw-vim-8.2.2567
$ nix path-info --sigs ./result
/nix/store/988jq9bj7s336q48bzdaamcl90k5g1yw-vim-8.2.2567    ca:fixed:r:sha256:0z37vk3ndszn3p2in3li6rk3kln1lfqd9b6vl6w0qhkn7bixqibc
```

## Links

Tweag + Nix dev update \#12: <https://discourse.nixos.org/t/tweag-nix-dev-update-12/13185/3>

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
