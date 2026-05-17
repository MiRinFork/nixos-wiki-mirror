<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Prisma -->

[Prisma](https://www.prisma.io/) ORM is a modern, type-safe ORM for <a href="Node.js" class="wikilink" title="Node.js">Node.js</a> and <a href="TypeScript" class="wikilink" title="TypeScript">TypeScript</a> that simplifies database access and management. It provides:

- A schema-driven approach for defining your data model and generating a tailored, type-safe client.
- Built-in tools for managing migrations (Prisma Migrate) and inspecting your data visually (Prisma Studio).
- Support for multiple databases (e.g., PostgreSQL, MySQL, SQLite) with a focus on developer productivity and code safety.

To use Prisma in your Node.js application you must install the `prisma` and `prisma-engines` packages and set some environment variables.

### Shell.nix example

``` nix
{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.prisma-engines
    pkgs.prisma
  ];

  shellHook = ''
    export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig"
    export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
    export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
    export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
    export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
  '';
}
```

### Flake.nix example

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
  in {
    devShells.x86_64-linux.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        prisma-engines
        prisma
      ];
      shellHook = ''
        export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig";
        export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
        export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
        export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
        export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
      '';
    };
  };
}
```

<a href="Category:JavaScript" class="wikilink" title="Category:JavaScript">Category:JavaScript</a>
