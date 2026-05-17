<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/Cannot Find Package -->

<onlyinclude>

## I cannot find \$package when running `nix-env -qaP` even with channels configured

Not all packages are listed. Packages may not be listed because:

- the package is unfree, like e.g. *unrar* and *teamspeak_client*; see <a href="Unfree_software" class="wikilink" title="Unfree software">Unfree software</a> for more information
- the package is part of an attribute set and `nix-env` doesn't recurse into this set (see *pkgs.recurseIntoAttrs*), use `nix-env -qaP -A haskellPackages` for listing these entries

</onlyinclude>
