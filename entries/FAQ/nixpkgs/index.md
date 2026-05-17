<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/nixpkgs -->

Question: When I do an `import `<nixpkgs>` {}`, which *channel* or path gets imported.

Answer:

Use `nix repl '`<nixpkgs>`'` on shell and then enter `path` in the repl to know what nixpkgs is currently being used.

Nix tools use `$NIX_PATH` to decide which path to use in the `import` call. The first entry in that variable is typically <userhome>`/.nix-defexpr/channels`. If a user has explicitly added a channel named `nixpkgs`, then that channel is used in the `import `<nixpkgs> call. Otherwise, the `nixpkgs=` named entry is used for the `import `<nixpkgs> call.

Some tools don't fully respect `$NIX_PATH` and instead search `~/.nix-defexpr` so there might be some unexpected behavior.
