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

To use uutils as your system coreutils, just add it to PATH with high priority.

Attempting to replace all with a hacky replaceDependencies solution is not recommended or will be supported.

<a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
