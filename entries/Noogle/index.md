<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Noogle -->

# Noogle

[Noogle](https://noogle.dev) is a community maintained search page designed specifically for NixOS users and maintainers. It knows about all standard nix functions which are typically used via the `builtins`, `lib` and `pkgs` attributes.

Noogle.dev is especially useful when:

- you are looking for a function doing a certain transformation. For example: [List -\> AttributeSet](https://noogle.dev/q?from=list&to=attrset) [List -\> String](https://noogle.dev/q?from=list&to=string) [AttributeSet -\> List](https://noogle.dev/q?from=attrset&to=list)

<!-- -->

- quick companion for looking up how to use a certain function.
- fuzzy searching within all the functions
- finding the source position of functions

## Discoverability

Functions are indexed via tree-traversal of the nix attribute sets. Nix's position tracking is used in conjunction with static analysis based on the rnix AST to backtrace each function to its declaration in the source code.

Documentation content stems from doc-comments or from the `builtins` c++ documentation in nix in case it is a builtins function or an alias to a builtins function.

All the documentation content is essentially the same as in the . The difference is that noogle contains all functions, where the only contains parts of `lib`.

## Aliases

Noogle uses internal function characteristics and properties of the nix evaluator to detect aliases.

For example: `lib.lists.concatLists` is the same as calling `lib.concatLists` or `builtins.concatLists`

## Updates

Noogle is updated daily against the master branch of nix (builtins) and nixpkgs (lib, pkgs,...)

## API

Search query params

`  route: /q`

`  queries: term from to page limit`

`  Example: `[`https://noogle.dev/q?from=list&to=list&limit=20&page=2&term=map`](https://noogle.dev/q?from=list&to=list&limit=20&page=2&term=map)

Download the dataset at: <http://noogle.dev/api/v1/data>

<a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
