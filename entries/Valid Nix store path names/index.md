<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Valid Nix store path names -->

All files and folders in `/nix/store` match the regular expression

    [0-9a-z]{32}-[-.+_?=0-9a-zA-Z]+

- `[0-9a-f]{32}` is the hash
- `[-.+_?=0-9a-zA-Z]+` is the name

## See also

- <a href="Nix_package_manager#Internals" class="wikilink" title="Nix package manager#Internals">Nix package manager#Internals</a>
- <https://discourse.nixos.org/t/clarification-on-package-names-and-versions/9819/8>
- function `checkName` in <https://github.com/NixOS/nix/blob/master/src/libstore/path.cc>

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
