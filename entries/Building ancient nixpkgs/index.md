<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Building ancient nixpkgs -->

Nix's reproducibility allows for easy building of ancient nixpkgs checkouts.

An attempt to get firefox 2.0 running can be found here: <https://github.com/ckiee/nixpkgs/commits/2007-fixing>

## Replacing outdated nix.cs.uu.nl

You may find that the build fails as it cannot find some tarballs. This is solved by updating the primary mirror URL to one that is still running:

``` shell
for x in $(find); do sed -i 's/nix.cs.uu.nl/tarballs.nixos.org/g' "$x"; done
for x in $(find); do sed -i 's/dist\/tarballs\///g' "$x"; done
```

You will also want to run `nix-build` with the `--no-substitute` flag to avoid any outdated caches.

## Replacing outdated package sources

`nix-build` may fail while trying to fetch a package from a 3rd-party mirror. If this happens, you will need to search the internet for another mirror from which you can fetch the package; for certain nixpkgs versions you will need to ensure it does not force-redirect to SSL as `curl` was not built with SSL support in early versions.

You can manually add a tarball to the store by using `nix-prefetch-url`. You have to use the same checksum algorithm used in the nixpkgs definition with the `--type` parameter.

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
