<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: String-parsing in Nix -->

## String parsers

Some string parsers written in Nix

### YAML

- <https://github.com/DavHau/fromYaml>
- <https://github.com/arcnmx/nixexprs/blob/master/lib/from-yaml.nix>

### TOML

- <https://github.com/mozilla/nixpkgs-mozilla/blob/master/lib/parseTOML.nix>

### XML

- <https://github.com/nprindle/nix-parsec/pull/6>
- [fromXML builtin? (nixpkgs#57239)](https://github.com/NixOS/nixpkgs/issues/57239)

### yarn.lock

Lockfile for [yarn](https://yarnpkg.com/), a package manager for JavaScript

- <https://github.com/nix-community/dream2nix/blob/main/src/subsystems/nodejs/translators/yarn-lock/parser.nix>
- <https://github.com/nix-community/npmlock2nix/pull/29>
- <https://github.com/nprindle/nix-parsec/pull/3>

### mix.lock

Lockfile for [mix](https://hex.pm/docs/usage), a package manager for Erlang

- <https://github.com/nprindle/nix-parsec/pull/3>

### Lisp

- <https://github.com/utdemir/nixlisp/blob/main/nix/parser.nix>
- <https://github.com/nprindle/nix-parsec/pull/4>

### Arithmetic

- <https://github.com/nprindle/nix-parsec/tree/master/examples/arithmetic>

### cabal.project.freeze

Lockfile for [cabal](https://cabal.readthedocs.io/en/stable/cabal-commands.html#cabal-freeze), a package manager for Haskell

- <https://github.com/nix-community/dream2nix/blob/main/src/subsystems/haskell/translators/cabal-freeze/parser.nix>

### IPv4 address

- <https://github.com/NixOS/nix/issues/1491#issuecomment-318273971>

### UUID

- <https://github.com/nprindle/nix-parsec/tree/master/examples/uuids>

### Linux kernel config

- <https://github.com/nprindle/nix-parsec/tree/master/examples/kernel-config>

### Python setup.cfg

- <https://github.com/seppeljordan/nix-setuptools/blob/master/lib/setuptools.nix>

### PureScript

- <https://github.com/purs-nix/purs-nix/blob/master/parser.nix>

## Parser combinators

Build complex parsers from many small parsers

- <https://github.com/nprindle/nix-parsec> - API is similar to [megaparsec](https://github.com/mrkkrp/megaparsec) in Haskell

### Grammars

- antlr <https://github.com/antlr/grammars-v4>
- tree-sitter <https://github.com/search?q=tree-sitter+grammar>

## See also

- [Add an Earley parser builtin (nix#1491)](https://github.com/NixOS/nix/issues/1491)
- [purenix - compile PureScript to Nix](https://github.com/purenix-org/purenix)
- String parsing in other Functional Programming Languages
  - String parsing in Haskell ([google](https://www.google.com/search?q=String+parsing+in+Haskell))

<a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a> <a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
