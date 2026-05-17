<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Package naming conventions -->

When looking through the available Nix packages, one might find some naming conventions.

| Suffix | Use |
|----|----|
| `-bin` | The binary is copied from upstream, not build from source using Nix. A `-bin` version is only available if a source-based version already exists, and there exists a meaninful difference between the two. An example is the Hashicorp Vault package that doesn't include the web UI, but the `-bin` version does. |
| `-unwrapped` | Some packages provide options for customization that don't affect the main build, and is thus done in the `-unwrapped` package. The package is then wrapped to provide customization without having to recompile the package. This is an implementation detail, you generally don't want to directly use an `-unwrapped` version. |

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
