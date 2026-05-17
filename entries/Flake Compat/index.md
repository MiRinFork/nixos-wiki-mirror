<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flake Compat -->

[Flake Compat](https://github.com/edolstra/flake-compat) is a compatibility layer for Nix <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> that lets projects written in the old style Nix (`default.nix` and `shell.nix`) use inputs and outputs from flake style Nix setups.

The flake-compat library downloads the inputs of the flake, pass them to the flake’s `outputs` function and return an attribute set containing `defaultNix` and `shellNix` attributes. The attributes will contain the output attribute set with an extra `default` attribute pointing to current platform’s `defaultPackage` (resp. `devShell` for `shellNix`).

# Usage

To integrate flake-compat into a project, place the following into `default.nix` (for `shell.nix`, replace `defaultNix` with `shellNix`) to use the shim:

Then in your `flake.nix`, add `flake-compat.url = "github:edolstra/flake-compat";` to your inputs.

## Example usage

An example flake.nix that packages a simple shell script:

The shell script being packaged:

With this setup, running `nix run` will build and execute the flake as expected. When using flake-compat, it becomes possible to run traditional commands like `nix-build` which will return a derivation using the flake’s output definitions.

<a href="Category:Flakes" class="wikilink" title="Category:Flakes">Category:Flakes</a>
