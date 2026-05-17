<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Uutils -->

The [Uutils](https://uutils.github.io/) project reimplements ubiquitous command line utilities in memory-safe Rust.

## Coreutils

### Introduction

[Uutils Coreutils](https://uutils.github.io/coreutils/) is a cross-platform memory-safe reimplementation of [GNU Coreutils](https://www.gnu.org/s/coreutils/) in Rust

While all programs have been implemented, some options might be missing or different behavior might be experienced

<small>For details, see [Uutils Coreutils - GNU Coreutils Test Coverage](https://uutils.github.io/coreutils/docs/test_coverage.html)</small>

Though the main goal of the project is compatibility, [Uutils Coreutils](https://uutils.github.io/coreutils/) supports a few features that are not supported by [GNU Coreutils](https://www.gnu.org/s/coreutils/)

<small>For details, see [Uutils Coreutils - Extensions](https://github.com/uutils/coreutils/blob/main/docs/src/extensions.md)</small>

[Nixpkgs - `uutils-coreutils`](https://search.nixos.org/packages?show=uutils-diffutils)

<small>If you want a prefixed package for some reason, use [`uutils-coreutils`](https://search.nixos.org/packages?show=uutils-coreutils) instead</small>

## Findutils

[Uutils Findutils](https://uutils.github.io/findutils/) is a cross-platform memory-safe reimplementation of GNU findutils: `xargs`, `find`, `locate` and `updatedb`

It aims to be a drop-in replacement of the original GNU findutils commands

[Nixpkgs - `uutils-findutils`](https://search.nixos.org/packages?show=uutils-findutils)

## Diffutils

[Uutils Diffutils](https://uutils.github.io/diffutils/) is is a cross-platform memory-safe reimplementation of GNU findutils: `diff`, `cmp`, `diff3` and `sdiff`

It aims to be a drop-in replacement of the original GNU diffutils commands

[Nixpkgs - `uutils-diffutils`](https://search.nixos.org/packages?show=uutils-diffutils)

## Installation

To do a systemwide replacement of gnu utils with uutils you can use system.replaceDependencies.

*Warning: as of February 2026 this seems to break nixos-rebuild, as uutils mv uses an interactive prompt where coreutils don't*

It should be noted that the name of the dependency is hardcoded in the binaries, therefore the name of the replacing dependency needs to have exactly the same length as the name of the source dependency. To do this declaratively this snippet should be added to your configs:

This is of course still quite a hacky solution, as the name of the resulting binaries will simply be padded with the char '\_'. A better solution might be found in the future.

<small>For details, see [NixOS - Discourse: "How to use uutils-coreutils instead of the builtin coreutils?" (8904) - Comment 36](https://discourse.nixos.org/t/how-to-use-uutils-coreutils-instead-of-the-builtin-coreutils/8904/36?u=malix)</small>}}

\]

<a href="Category:CLI_Applications" class="wikilink" title="Category:CLI_Applications">Category:CLI_Applications</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
