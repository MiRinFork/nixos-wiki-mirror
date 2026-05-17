<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Documentation Gaps -->

This page details some known documentation gaps in the official NixOS/Nixpkgs documentation.

## What are setup hooks?

<http://nixos.org/nixpkgs/manual/#ssec-setup-hooks> enumerates projects that provide them. I think they're scripts that get run in dependent derivations during `$stdenv/setup`

> **Answer:**
>
> Mostly yes. Some of them [are automatically enabled by default](https://github.com/NixOS/nixpkgs/blob/c3b2c5bf77f9d437b4656f0244bcdf2ab8d0102c/pkgs/stdenv/generic/default.nix#L101-L111). Others you can enable on-demand, by adding them to your `buildInputs` — e.g. `buildInputs = [ makeWrapper ];` (to find the "proper" name for this use, you must go [top-level hunting](https://search.nix.gsc.io/?q=makeWrapper%20%3D&i=nope&files=&repos=)). Then they will either auto-inject some steps into build phases (e.g. [`pkg-config`](https://github.com/NixOS/nixpkgs/blob/0e9e77750818f40303c72ad658b3dca299591e4f/pkgs/development/tools/misc/pkgconfig/default.nix#L8) or autoconf), or allow you to use some useful scripts during build easily (e.g. `makeWrapper` — see [wrapProgram](https://github.com/NixOS/nixpkgs/blob/0e9e77750818f40303c72ad658b3dca299591e4f/pkgs/build-support/setup-hooks/make-wrapper.sh#L130) and [makeWrapper](https://github.com/NixOS/nixpkgs/blob/0e9e77750818f40303c72ad658b3dca299591e4f/pkgs/build-support/setup-hooks/make-wrapper.sh#L1) docs for details, then [grep in nixpkgs](https://github.com/search?q=repo%3ANixOS%2Fnixpkgs%20wrapProgram&type=code) for numerous usage examples).
>
> See also [<nixpkgs>/pkgs/build-support/setup-hooks](https://github.com/NixOS/nixpkgs/tree/master/pkgs/build-support/setup-hooks) for a list of some common setup hooks.

## What's the relationship between `nix-env` and `buildEnv`

AFAICT, `nix-env` somehow assembles a `buildEnv` expression and the realization of that expression becomes a profile, somehow.

1.  [**nix**/user-env/](https://github.com/NixOS/nix/blob/2c42a9dbaa805f4f29561d9a1c10b41dfe98dcfa/src/nix-env/user-env.cc#L123)
2.  [**nix**/src/nix-env/buildenv.nix](https://github.com/NixOS/nix/blob/master/src/nix-env/buildenv.nix)
3.  [**nix**/src/libstore/builtins/buildenv.cc](https://github.com/NixOS/nix/blob/master/src/libstore/builtins/buildenv.cc)

**\#1** loads the nix file in **\#2** and uses it to merge everything together, and **\#2** uses a copy of **\#3** that was compiled when nix got built.

Have a look also at [**nixpkgs**/pkgs/build-support/buildenv/default.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/buildenv/default.nix)

## How to add a new cross-compilation target/platform?

Creating a new `crossSystem` requires many parameters, which are severely undocumented. The official manual only glances over how to use cross compilation for pre-existing platforms, but not how to define new platforms.

## Does nix support binary grafting like guix?

Grafting in guix is the concept ofr replacing a dependency in a package without needing to rebuild every package using it as build input. This functionality can be used to significantly lower the time of rebuilding packages with security updates.

In nixpkgs there is [replace-dependency](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/replace-dependency.nix) which provides this functionality but it is neither used nor explicitly documented as of right now (2017-06-22).

> **Answer:** There is an open [pull request](https://github.com/NixOS/nixpkgs/pull/10851/) and [blog article](https://www.theshortlog.com/posts/nix-security-updates-update/) to implement security updates

## Tips for using nix-shell for development

> mkShell is like stdenv.mkDerivationto dedicated for shell.nix. It adds one more feature where multiple package build inputs can all be merged together. This is useful when developing in a repo that has multiple packages (micro-services).

## The structure and placement of nixpkgs

Basically something that documents what all the directories mean and where things are placed and how they are structured and why.

## A list of all the trivial builders and build support

And an explanation of what they do and what they are used for.

## How do manpages work? Or: `environment.pathsToLink` and `buildEnv`

I'm trying to understand how manpages work in Nix/NixOS.

There is a pacakge called [`man-db`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/tools/misc/man-db/default.nix#L29), which seems to be looking in `/nix/var/nix/profiles/default/share/man` for manpages. It can build a cache at `/var/cache/man/nixpkgs`.

Under NixOS (on my machine, running NixOS 20.09), these paths do not exist. `man-db` is installed as a NixOS module, the configuration is at [`nixos/modules/misc/documentation.nix`](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/misc/documentation.nix#L104) in the nixpkgs repository. Manpages are in `/run/current-system/sw/share/man`, and the cache resides in `/var/cache/man/nixos`.

What I don't understand is: How are these paths populated? In the module, if `man` is enabled, `environment.pathsToLink` is set to `[ "/share/man" ]`. The documentation describes this option as "List of directories to be symlinked in /run/current-system/sw". Does this mean that for every package in `environment.systemPackages`, it does something like `for f in ${pkg}/share/man/* ; do ln -s $f /run/current-system/sw/share/man/$fname ; done`? I could only find that `environment.systemPackages` is later used to make a `buildEnv`, but what `buildEnv` does is a mystery to me.

So, to summarize my ramblings, I guess I would find a thorough documentation of buildEnv very helpful.

<a href="Category:Community" class="wikilink" title="Category:Community">Category:Community</a>
