<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/Why not use nix-env -i foo? -->

<onlyinclude>

## Why not use nix-env -i hello?

`nix-env -i hello` is slower and tends to be less precise than `nix-env -f '`<nixpkgs>`' -iA hello`. This is because it will evaluate all of nixpkgs searching for packages with the name `hello`, and install the one [determined to be the latest](https://nixos.org/nix/manual/#description-1) (which may not even be the one that you want). Meanwhile, with `-A`, nix-env will evaluate only the given attribute in nixpkgs. This will be significantly faster, consume significantly less memory, and more likely get you what you want.

`nix-env -u` has the same problem, searching for all the packages in the user environment by name and upgrading them. This may lead to unwanted major-version upgrades like JDK 8 → JDK 9. If you want to have a declarative user environment, you may wish to use <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. It is also possible to home-bake a pure nix solution like [LnL's](https://gist.github.com/LnL7/570349866bb69467d0caf5cb175faa74). With this setup, you can update your packages by simply running `nix-rebuild`.</onlyinclude>
