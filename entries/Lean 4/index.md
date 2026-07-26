<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Lean 4 -->

## Building Lean 4 projects

Use the following

``` nix
leanPackages.buildLakePackage {
  pname = "my-project";
  version = "0.1.0";
  src = ./.;
  leanDeps = with leanPackages; [ mathlib ];
  lakeHash = null; # all deps nix-managed; set to lib.fakeHash for Lake-managed deps
}
```
