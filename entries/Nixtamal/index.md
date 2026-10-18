<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixtamal -->

[Nixtamal](https://nixtamal.toast.al) is an input pinner for Nix projects.

### Key features

- Automate the manual work of input pinning for dependency management
- Allow easy ways to lock & refresh those inputs
- Declarative <abbr>KDL</abbr> manifest file over imperative <abbr>CLI</abbr> flags
- diff/grep-friendly lockfile
- Declarative patch/diff management for inputs
- Host-, forge-, <abbr>VCS</abbr>-agnostic
- Choose eval time fetchers (builtins) or build time fetchers (Nixpkgs, default) — which opens up fetching now-supported Darcs, Pijul, & Fossil
- Supports mirrors, failing over when a server is down
- Override hash algorithm on a per-project & per-input basis — including BLAKE3 support [^1]
- Custom freshness commands
- Blueprints for opinionated, stable-Nix-compatible, base project structure setup
- No experimental Nix features required

### Notes

<references />

[^1]: Opting in requires enabling `blake3-hashes` [experimental feature](https://nix.dev/manual/nix/2.31/development/experimental-features.html#xp-feature-blake3-hashes) which requires Nix 2.31+
