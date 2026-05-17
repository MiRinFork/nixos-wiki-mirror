<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tup -->

From the tup manual: "Tup is a file-based build system".

## Known Issues

### tup rebuilds too often

When using `updater.full_dep`, tup rebuilds the full project every time you reboot due to mtime changes in /run/current-system.

The solution is to always use tup via `nix-shell --pure` so that /run/current-system is not in PATH

Github issue: [tup/#397](https://github.com/gittup/tup/issues/397)

Another method that minimizes changes to PATH is to create symlinks to tools with Tup:

``` tup
# Tuprules.tup - export a bang-rule that calls the Dhall interpreter
DHALL_LINK = $(TUP_CWD)/dhall
!dhall = | $(DHALL_LINK) |> $(DHALL_LINK)/bin/dhall |>
```

``` tup
# Tupfile - build a symlink to the nixpkgs#dhall package 
include_rules
: |> nix build nixpkgs#dhall --out-link %o |> $(DHALL_LINK)
```

### mount does not unmount

Tup can either not find fusermount OR the fusermount that tup finds is not setuid when using --pure.

Github issue: [nixpkgs/#107516](https://github.com/NixOS/nixpkgs/issues/107516)

There is no real solution to this other than 1. patching tup to use setuid fusermount 2. (maybe) setting tup as setuid.

### pkg-config can not find my packages

When using nix-shell, pkg-config, and tup; pkg-config calls via tup do not find any packages.

You must add export lines to your tupfile that correspond to the variables set by NixOS pkg-config:

`  export PKG_CONFIG_PATH`  
`  export PKG_CONFIG_PATH_FOR_TARGET`  
`  export PKG_CONFIG_FOR_TARGET`

You also have to export NIX_PKG_CONFIG\* variables, which can change based on platform:

` export NIX_PKG_CONFIG_WRAPPER_TARGET_TARGET_x86_64_unknown_linux_gnu`

You can verify this by adding `: |> pkg-config --list-all > %o |> pkg-list.txt` into your Tupfile and seeing which libraries are available via pkg-config.

### Flakes

A Tup rule must not use a flake that resides in the same tup project as the rule because the nix command can aggressively access files in the vicinity of flake.nix. The flake should be external to the tup project or it can be stored within the same repository but only on a different branch, which would then then be registered in the local nix flake registry.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
