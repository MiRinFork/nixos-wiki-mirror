<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Godot -->

[Godot](https://godotengine.org/) is an open-source game engine, capable of creating both 2D and 3D games.

## Installation

Add `pkgs.godot` (GDScript only) to `environment.systemPackages`.

For installing Godot-Mono (C#), see <a href="Godot-Mono" class="wikilink" title="Godot-Mono">Godot-Mono</a> article.

## Export Templates

On Godot upgrade, the new export template can be automatically provisioned this way:

`home.file.".local/share/godot/export_templates".source = "${pkgs.godot_4-export-templates-bin}/share/godot/export_templates";`

### Android Export Target

Accept Android license:

`nixpkgs.config.android_sdk.accept_license = true;`

Add to your system the usual Android and Java development packages, such as:

`environment.systemPackages = with pkgs; [`  
`  android-studio`  
`  android-tools`  
`  androidenv.androidPkgs.androidsdk`  
`  androidenv.androidPkgs.emulator`  
`  androidenv.androidPkgs.ndk-bundle`  
`  jdk # Java`  
`];`

Configure Godot's **Editor** -\> **Editor Settings** -\> **General** \[Tab\] -\> **Export** \[Category\] -\> **Android** \[Sub-item\], as such:

- **Android SDK Path:** Reference `pkgs.androidenv.androidPkgs.androidsdk` path. Like: `/nix/store/p2cdj75bbzswjc84789cmlwhy6ll7avr-androidsdk/libexec/android-sdk/`
- **Java SDK Path:** Reference `pkgs.jdk` path. Like: `/nix/store/55qm2mvhmv7n2n6yzym1idrvnlwia73z-openjdk-21.0.5+11`

### Running Exported Application in NixOS

Use `steam-run` to run a Godot exported project without having to fix paths for Nix.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:IDE" class="wikilink" title="Category:IDE">Category:IDE</a>
