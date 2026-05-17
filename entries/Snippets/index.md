<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Snippets -->

\_\_TOC\_\_ This page contains some nix script snippets which might be useful.

## Adding compiler flags to a package

``` nix
optimizeWithFlag = pkg: flag:
  pkg.overrideAttrs (attrs: {
    NIX_CFLAGS_COMPILE = (attrs.NIX_CFLAGS_COMPILE or "") + " ${flag}";
  });
```

This function can further be used to define the following helpers:

``` nix
optimizeWithFlags = pkg: flags: pkgs.lib.foldl' (pkg: flag: optimizeWithFlag pkg flag) pkg flags;
optimizeForThisHost = pkg: optimizeWithFlags pkg [ "-O3" "-march=native" "-fPIC" ];
withDebuggingCompiled = pkg: optimizeWithFlag pkg "-DDEBUG";
```

## Overriding callPackage for finding updated upstream packages in own overrides

With this override for the \`callPackage\` function, one can automatically detect if the upstream package set has a newer version of an locally overridden package:

``` nix
callPackage = path: args: let
    override =  super.callPackage path args;
    upstream = optionalAttrs (override ? "name")
      (super.${(parseDrvName override.name).name} or {});
  in if upstream ? "name" &&
        override ? "name" &&
        compareVersions upstream.name override.name != -1
    then
      trace
        "Upstream `${upstream.name}' gets overridden by `${override.name}'."
        override
    else override;
```
