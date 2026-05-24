<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/Patching Nixpkgs -->

Sometimes it may be required to patch a copy of Nixpkgs directly, rather than use an overlay to patch an individual package. One scenario of where this might happen is if Nixpkgs doesn't contain a change you need, but you find some existing PR that has yet to be merged, and so want to leverage those changes prior to them being merged.

There are many ways to patch Nixpkgs, each with its own advantages and disadvantages. We will go through the most popular ones:

| Name | Method | [IFD](https://nixos.org/manual/nix/unstable/language/import-from-derivation) | Requires Flakes |
|----|----|----|----|
| applyPatch | .patch files | X |  |
| nixpkgs-patcher | .patch files | X | X |
| nix-patcher | .patch files |  | X |
| gh-cherry-pick | git cherry-pick |  |  |
| Nixtamal | .patch files | X |  |

Most of the solutions work on the `.patch` files, but those have a huge disadvantage - they quickly go out of date and have to be constantly rebased. This is especially true for solutions that use Git to apply patches. Another disadvantage may be [IFD](https://nixos.org/manual/nix/stable/language/import-from-derivation), which may result in [performance and runtime issues](https://nixcademy.com/posts/what-is-ifd-ups-and-downs/).

## Usage

For the sake of example, let's say you are using the software package [Ghidra](https://ghidra-sre.org/), and the latest version available on Nixpkgs unstable is [11.1.2](https://search.nixos.org/packages?channel=unstable&from=0&size=50&sort=relevance&type=packages&query=ghidra). You know that the Ghidra developers have recently released 11.2, and want to use it before it's in Nixpkgs. You could try to create an overlay and manually update the package, but maybe in the process, you realize it is not a trivial update. You may find there is already a pending PR to Nixpkgs with the updated version and changes you want, such as [this PR](https://github.com/NixOS/nixpkgs/pull/344917). If you didn't want to wait for that PR to be merged into Nixpkgs, you could apply the PR patch directly to your Nixpkgs instead. There are, of course, other reasons you may wish to use a patched Nixpkgs, and the method applies to any of those cases.

To get your patch, you will usually need to find a list of commits from the desired PR and fetch them. Try to avoid fetching something like <https://github.com/NixOS/nixpkgs/pull/344917.diff>, as it can change if the PR is still open. If you are fetching from GitHub, don't forget to add `?full_index=1` at the end of the URL for better reproducibility.

``` nix
# for https://github.com/NixOS/nixpkgs/pull/344917
pkgs.fetchpatch2 {
  # note the `.diff` at the end!
  url = "https://github.com/NixOS/nixpkgs/commit/55367b381af23045c93f7b85171db850e628ef7d.diff?full_index=1";
  hash = "sha256-/XnEHRQahmHUNstgTVkQC+LGp7Z0wmf+qPVyKntgZG0=";
}
```

Or you can also fetch a range, if you want to fetch multiple commits in one go

``` nix
pkgs.fetchpatch2 {
  # 4c030cf is a parent of the first PR commit
  url = "https://github.com/NixOS/nixpkgs/compare/4c030cf309bffa9cd87336705e96ce941ce977d9...05071d58a87c832f6366fff6c8ec328cb28a2a66.diff?full_index=1";
  hash = "sha256-gH8NHJ+i1snTN/ehFopQko8BfeO0PxQaFRCQCoLzVfg=";
}
```

### Using [`applyPatches`](https://github.com/NixOS/nixpkgs/blob/f6e07eb0e1e42c38f8e0b6ffc221b7bf73bece4b/pkgs/build-support/trivial-builders/default.nix#L981) function

`applyPatches` is a Nixpkgs function that applies a list of patches to a source directory. Internally, it just creates a new derivation via `stdenv.mkDerivation` and passes all of the patches to the usual [`patchPhase`](https://github.com/NixOS/nixpkgs/blob/12c894cb74171bcec130756cc0f77720fca6587d/pkgs/stdenv/generic/setup.sh#L1371-L1404).

``` nix
let
  # to access the `applyPatches` function, you will need
  # to import unpatched Nixpkgs first
  pkgs = import <nixpkgs> {
    # with flakes, you may also need to hardcode the system
    # system = "x86_64-linux";
  };
  nixpkgs-344917-drv =
    pkgs.applyPatches {
      src = pkgs.path;
      patches = [
        (pkgs.fetchpatch2 {
          url = "https://github.com/NixOS/nixpkgs/compare/4c030cf309bffa9cd87336705e96ce941ce977d9...05071d58a87c832f6366fff6c8ec328cb28a2a66.diff?full_index=1";
          hash = "sha256-gH8NHJ+i1snTN/ehFopQko8BfeO0PxQaFRCQCoLzVfg=";
        })
      ];
    };
  nixpkgs-344917 = import nixpkgs-344917-drv { inherit (pkgs.stdenv) system; };
in
nixpkgs-344917.ghidra.version # == 11.2 :tada:
```

In the above example, we create a derivation with the patch applied, called `nixpkgs-344917-drv`. Pay attention, we take the `src` attribute to get back the original (unpatched) Nixpkgs. We then import that new derivation, which we assign to `nixpkgs-344917`. Now we can use `nixpkgs-344917` to access the Ghidra 11.2 package, as well as any other packages normally available in Nixpkgs.

### Using [nixpkgs-patcher](https://github.com/gepbird/nixpkgs-patcher)

nixpkgs-patcher is a nice wrapper around [`applyPatches`](https://wiki.nixos.org/wiki/Nixpkgs/Patching_Nixpkgs#Using_applyPatches_function) which makes integration with NixOS flake's system definition very easy:

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-patcher.url = "github:gepbird/nixpkgs-patcher";

    nixpkgs-patch-ghidra-11-2 = {
      url = "https://github.com/NixOS/nixpkgs/commit/55367b381af23045c93f7b85171db850e628ef7d.diff?full_index=1";
      flake = false;
    };
    nixpkgs-patch-ghidra-11-2-ret-sync = {
      url = "https://github.com/NixOS/nixpkgs/commit/05071d58a87c832f6366fff6c8ec328cb28a2a66.diff?full_index=1";
      flake = false;
    };
  };

  outputs =
    { nixpkgs-patcher, ... }@inputs:
    {
      nixosConfigurations.yourHostname = nixpkgs-patcher.lib.nixosSystem {
        modules = [
          ./configuration.nix
          ./hardware-configuration.nix
        ];
        specialArgs = inputs;
      };
    };
}
```

### Using [nix-patcher](https://github.com/katrinafyi/nix-patcher)

nix-patcher is a script that automatically gets a list of patches from your `flake.nix` and applies them to your Nixpkgs fork sequentially.

``` nix
# flake.nix
{
  inputs = {
    nixpkgs = "github:MyName/nixpkgs/patched-branch";
    nixpkgs-upstream = "github:NixOS/nixpkgs/nixos-unstable";

    nixpkgs-patch-10 = {
      url = "https://github.com/NixOS/nixpkgs/commit/55367b381af23045c93f7b85171db850e628ef7d.diff?full_index=1";
      flake = false;
    };
    nixpkgs-patch-20 = {
      url = "https://github.com/NixOS/nixpkgs/commit/05071d58a87c832f6366fff6c8ec328cb28a2a66.diff?full_index=1";
      flake = false;
    };
  };
}
```

nix-patcher will notice the special "-upstream" and "-patch-" suffixes and match these with "nixpkgs-upstream". When run, the repo and branch to update will be taken from the "nixpkgs" inputs. The upstream, patches, and fork inputs are linked together by their common prefix (here, "nixpkgs").

### Using [gh-cherry-pick](https://github.com/PerchunPak/gh-cherry-pick)

gh-cherry-pick interacts directly with the GitHub API to cherry-pick or merge branches. This tool is unique in that it doesn't depend on or use Nix; it is a generic script that fits perfectly for our use case.

``` bash
# This tool requires a classic token with `repo` and `workflow` permissions
# or a fine-grained token with `contents` and `workflows` permissions
GITHUB_TOKEN=ghp_... gh-cherry-pick \
  --target MyOrg/nixpkgs@patched \
  `: # cherry-pick these commits` \
  NixOS/nixpkgs/3f5ba52cc4701bf341457dfe5f6cb58e0cbb7f83 \
  NixOS/nixpkgs/49ba75edefc8dc4fee45482f77a280ddd7121797 \
  `: # or merge the entire branch!` \
  Someone/nixpkgs@pr-branch
```

Very similar to [nix-patcher](https://wiki.nixos.org/wiki/Nixpkgs/Patching_Nixpkgs#Using_nix-patcher), it maintains a fork of Nixpkgs and applies the patches on it sequentially. The main difference is that it doesn't operate on patch files, but runs [`git cherry-pick`](https://git-scm.com/docs/git-cherry-pick) directly through GitHub API. This is a huge advantage, since Git can automatically rebase commits instead of forcing you to do that.

### Using [Nixtamal](https://nixtamal.toast.al/)

Nixtamal uses both `fetchpatch2` & `applyPatches` under the hood, but lets users declare the remote or local patches in its `manifest.kdl` to be locked to any input — including Nixpkgs.

``` kdl
version "1.0.0"
patches {
    tzpfms-module "../patch/tzpfms-module.patch"
    movim-0_33_1 "https://patch-diff.githubusercontent.com/raw/NixOS/nixpkgs/pull/513278.patch"
}
inputs {
    nixpkgs {
        archive {
            url "https://github.com/NixOS/nixpkgs/archive/{{fresh_value}}.tar.gz"
        }
        hash algorithm=SHA256
        fresh-cmd {
            $ git ls-remote "https://github.com/NixOS/nixpkgs.git" --branches nixos-25.11
            | cut -f1
        }
        patches tzpfms-module movim-0_33_1
    }
}
```

After patches are added, the user must relock:

``` console
$ nixtamal lock nixpkgs
INPUTS
✓ nixpkgs (Archive)                        Fresh

PATCHES
✓ movim-0_33_1                        Prefetched
⌂ tzpfms-module                      Local patch
```

Then the user can seemlessly access their patched Nixpkgs:

``` console
$ nix repl --file nix/tamal
Nix 2.34.6
Type :? for help.
Loading installable ''...
Added 1 variables.
nixpkgs
nix-repl> pkgs = import nixpkgs { }

nix-repl> :p pkgs.movim.version 
0.33.1
```

## Resources

The following are resources that go into more depth on this topic.

- [Patching <nixpkgs>](https://ertt.ca/nix/patch-nixpkgs/)
- [gh-cherry-pick announcement (and discussion about other tools)](https://discourse.nixos.org/t/patch-nixpkgs-using-cherry-picks-without-local-clone/76925)
