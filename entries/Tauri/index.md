<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tauri -->

## Development environment with `nix-shell`

References

- <a href="Development_environment_with_nix-shell" class="wikilink" title="https://wiki.nixos.org/wiki/Development_environment_with_nix-shell"><span>https://wiki.nixos.org/wiki/Development_environment_with_nix-shell</span></a> (2025-01-23)
- <https://v2.tauri.app/start/prerequisites/> (2025-01-23)

``` nix
# Run with `nix-shell shell.nix`
let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    pkg-config
    wrapGAppsHook4
    cargo 
    cargo-tauri # Optional, Only needed if Tauri doesn't work through the traditional way.
    nodejs # Optional, this is for if you have a js frontend
    rustc # Needed for dev server (npm tauri dev)
  ];

  buildInputs = with pkgs; [
    librsvg
    webkitgtk_4_1
  ];

  shellHook = ''
    export XDG_DATA_DIRS="$GSETTINGS_SCHEMAS_PATH" # Needed on Wayland to report the correct display scale
  '';
}
```

## Building a Tauri app on nixpkgs?

A distribution mechanism has been implemented for Tauri applications within Nixpkgs. Refer to the Nixpkgs documentation for implementation details. [here](https://nixos.org/manual/nixpkgs/unstable/#tauri-hook)

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a>
