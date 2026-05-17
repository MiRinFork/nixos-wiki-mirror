<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Cleaning the nix store -->

Sometimes your store fills up the disk, but a simple

``` text
nix-store --gc
```

does not seem to clean all that much.

This usually means that you have some old collection roots that keep old versions of nixpkgs around.

Sometimes `result` files created by an ad-hoc `nix-build` bind a lot of resources, these can be found by running:

``` shell
nix-store --gc --print-roots | egrep -v "^(/nix/var|/run/\w+-system|\{memory|/proc)"
# Darwin
nix-store --gc --print-roots | egrep -v "^(/nix/var|/run/\w+-system|\{libproc)"
```

Additional Resources about cleaning up the *nix-store*:

- <https://matthewrhone.dev/nixos-package-guide#cleanup-old-packages-user-wide>
- <a href="Storage_optimization" class="wikilink" title="Storage optimization">Storage optimization</a>
- <https://old.reddit.com/r/NixOS/comments/8m1n3d/taking_out_the_trash/>

There are multiple tools that can help with discovering *gcroots* and calculate the disk size:

- <https://github.com/symphorien/nix-du>
- <https://github.com/utdemir/nix-tree>
- <https://github.com/cdepillabout/nix-query-tree-viewer>
- <https://github.com/craigmbooth/nix-visualize>

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
