<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Stolen Syntax -->

The Nix language allows any name to be used in an attribute set, but Nix, some libraries, and the ecosystem in general assign special meaning to some names that appear in attribute sets that consist of otherwise freely named variables.

This page presents a cross-section of well known "keywords" used in attribute sets in various components.

Since neither the runtime, not the language reserve these keywords, these keywords are described *stolen* rather than *reserved*.

## Nix language

- `outPath`
- `__functor`
- `__toString`

## nix-build

- `recurseForDerivations`

## The wider ecosystem

- `_type` for nominal typing. Should contain a string. Pioneered by the module system (?)
- ~~`type`~~ in principle this one is available for domain specific use! That is, unless you want the attrset to double as a "derivation" in the CLI.

## Module system

- `_type`
- `config`, `options` (etc) (switches away from shorthand syntax)
- `_module` option tree is omitted from the returned config and is intended for module system specific use
- `_key`
- `_class`
- `_file`
- ...

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
