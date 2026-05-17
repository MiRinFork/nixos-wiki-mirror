<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: How to fetch Nixpkgs with an empty NIX PATH -->

The `NIX_PATH` environment variable is not the only way to fetch a Nixpkgs instance. You can also use a pure, declarative Nixpkgs source by fetching its tarball:

Remember to replace the example git revision (`4a817d2`...) with the desired revision of Nixpkgs. When building such a file for the very first time, Nix will refuse to evaluate a tarball that has an invalid or missing hash. Fortunately, the error message that will be printed contains the real hash to be used; simply replace `sha256 = "";` with `sha256 = "hash that Nix will give you";`, and rebuild the file.

You can also use the `nix-prefetch-url` utility to obtain the correct SHA256 hash without needing to build a spurious derivation.

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
