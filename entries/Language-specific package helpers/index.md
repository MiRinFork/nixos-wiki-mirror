<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Language-specific package helpers -->

\_\_NOTOC\_\_ The Nixpkgs-provided helpers can be found in the [Nixpkgs manual](http://nixos.org/nixpkgs/manual/#chap-language-support).

### Elisp

- [emacs2nix](https://github.com/ttuegel/emacs2nix)

### Erlang

- [hex2nix](https://github.com/erlang-nix/hex2nix)
- [nix-rebar3](https://github.com/axelf4/nix-rebar3) Builds rebar3 projects, without any Nix code generation.

### Go

- [go2nix](https://github.com/kamilchm/go2nix)
- [dep2nix](https://github.com/nixcloud/dep2nix)
- For go 1.11+ modules: [vgo2nix](https://github.com/adisbladis/vgo2nix)
- [gomod2nix](https://github.com/nix-community/gomod2nix)

### Haskell

- [cabal2nix](https://github.com/NixOS/cabal2nix)
- [haskell-overridez](https://github.com/adetokunbo/haskell-overridez) - Simplify usage of nix dependencies during haskell development
- [snack](https://github.com/nmattia/snack)

### JavaScript / Node.js

- [node2nix](https://github.com/svanderburg/node2nix), Recommend for use in nixpkgs
- [napalm](https://github.com/nmattia/napalm), Imports package-lock.json into nix directly
- yarn-based (carry the same name but different implementations), yarn is a drop-in for \`npm\`:
  - [yarn2nix](https://github.com/moretea/yarn2nix) by moretea
  - [yarn2nix](https://github.com/Profpatsch/yarn2nix) by Profpatsch
  - [yarn-plugin-nixify](https://github.com/stephank/yarn-plugin-nixify) by stephank
- [bower2nix](https://github.com/rvl/bower2nix)

### Lua

- [luarocks2nix](https://github.com/nix-community/luarocks-nix) works with <https://github.com/NixOS/nixpkgs/pull/33903>

### OCaml

- [opam2nix](https://github.com/timbertson/opam2nix)

### Perl

- [cpan2nix](https://gitee.com/volth/cpan2nix/)

### PureScript

- [purs-nix](https://github.com/purs-nix/purs-nix)

### Python

- [uv2nix](https://github.com/pyproject-nix/uv2nix) - uv2nix turns uv projects into Nix derivations
- [poetry2nix](https://github.com/nix-community/poetry2nix) - poetry2nix turns Poetry projects into Nix derivations without the need to actually write Nix expressions.
- [nixpkgs-pytools](https://github.com/nix-community/nixpkgs-pytools) - semi-automated way to add python packages to nixpkgs.
- [pynixify](https://github.com/cript0nauta/pynixify) - Create a nixpkgs overlay with human-readable expressions for each package
- [pip2nix](https://github.com/johbo/pip2nix) - Generate nix expressions for Python packages.

Abandoned / discontinued:

- [pypi2nix](https://github.com/garbas/pypi2nix) - Generate Nix expressions for Python packages
- [python2nix](https://github.com/proger/python2nix)
- [nix-pip](https://github.com/badi/nix-pip)
- [mach-nix](https://github.com/DavHau/mach-nix) - Create reproducible python environments from \`requirements.txt\` (using Nix)

### Ruby

- [bundix](https://github.com/manveru/bundix)

### Rust

- [naersk](https://github.com/nmattia/naersk) Pure nix, works well with dependencies from crates.io. Builds rust crates dependencies in one derivation and the crate itself in another.
- [crate2nix](https://github.com/nix-community/crate2nix) Uses \`buildRustCrate\` from \`nixpkgs\` to build all dependencies independently. Either check in the generated build file or use it via "import from derivation".
- [cargo2nix](https://github.com/cargo2nix/cargo2nix) Uses a \`mkCrate\` wrapper around Cargo and \`rustc\` to build all dependencies independently. Supports cross-compilation, alternative registries, and \`nix-shell\` integration.
- [crane](https://github.com/ipetkov/crane) Builds rust crate dependencies in one derivation and the crate itself in another. Boilerplate setup for running test suites.

### Scala

- [sbtix](https://gitlab.com/nightkr/Sbtix)
- [sbt-derivation](https://github.com/zaninime/sbt-derivation)

### Zig

- [zon2nix](https://github.com/nix-community/zon2nix)

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:Go" class="wikilink" title="Category:Go">Category:Go</a> <a href="Category:Haskell" class="wikilink" title="Category:Haskell">Category:Haskell</a> <a href="Category:JavaScript" class="wikilink" title="Category:JavaScript">Category:JavaScript</a> <a href="Category:Perl" class="wikilink" title="Category:Perl">Category:Perl</a> <a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a> <a href="Category:Ruby" class="wikilink" title="Category:Ruby">Category:Ruby</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>
