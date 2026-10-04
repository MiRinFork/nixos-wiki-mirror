<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Archon -->

[Archon](https://www.archon.gg) (formerly the Warcraft Logs Uploader) is the official desktop companion app by RPGLogs for uploading combat logs and live-logging encounters in *World of Warcraft*.

## Installation

### Standard (Once merged into Nixpkgs)

The package is tracked in [PR \#565125](https://github.com/NixOS/nixpkgs/pull/565125). Once merged, add it to your configuration:

``` nix
environment.systemPackages = [
  pkgs.archon
];
```

### Before Merge (Using Flakes)

Before the PR is merged, you can pull the package directly from the PR branch:

``` nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-archon.url = "github:thebigjc/nixpkgs/add-archon";
  };

  outputs = { self, nixpkgs, nixpkgs-archon, ... }: {
    nixosConfigurations.myhostname = nixpkgs.lib.nixosSystem {
      modules = [
        ({ pkgs, ... }: {
          environment.systemPackages = [
            nixpkgs-archon.legacyPackages.${pkgs.system}.archon
          ];
        })
      ];
    };
  };
}
```

### Before Merge (Tarball / Channels)

``` nix
let
  archonPkgs = import (fetchTarball "https://github.com/thebigjc/nixpkgs/archive/refs/heads/add-archon.tar.gz") {};
in {
  environment.systemPackages = [
    archonPkgs.archon
  ];
}
```

## Usage Notes

- **Combat Logging:** To live-log or upload logs, ensure advanced combat logging is enabled in WoW: `/console advancedCombatLogging 1`.
- **Log Location:** Combat logs are typically written to `<WoW directory>/_retail_/Logs/WoWCombatLog.txt`.
- **Wayland & Sandbox:** Archon runs using the Chromium/Electron runtime with `--no-sandbox` inside an FHS wrapper.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
