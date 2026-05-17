<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Godot-Mono -->

Godot-Mono is <a href="Godot" class="wikilink" title="Godot">Godot</a>'s game engine supporting C# language for creating both 2D and 3D games.

## Installation

Add `pkgs.godot-mono` (GDScript + C#) to `environment.systemPackages`.

## Export Templates

On Godot upgrade, the new export template version can be automatically provisioned this way:

`home.file.".local/share/godot/export_templates/${builtins.replaceStrings [ "-" ] [ "." ] pkgs.godot-mono_4-export-templates.version}".source = pkgs.godot-mono_4-export-templates;`

Note: \`pkgs.godot-mono_4-export-templates\` package is still pending in nixpkgs.

## Configuring VSCode Editor for Godot-Mono (C#)

As Godot editor has poor support for C#, VSCode editor is recommended.

You can install and configure VSCode using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> as such:

### Minimal/Small Example

### More elaborate Example

## Configure VSCode as External Editor in Godot 4

Click **Editor** \[top menu\] -\> **Editor Settings** \[menu item\] -\> **General** \[Tab\] -\> Search for "dotnet" -\> **Dotnet** \[Category\] -\> **Editor** \[Sub-Category\]:

- **Exec Path** -\> Add the output of `which code`, on my case would be: `/etc/profiles/per-user/REPLACE-USERNAME/bin/code`
- **Exec Flags** -\> `{project} --goto {file}:{line}:{col}`
- **External Editor** -\> `Visual Studio Code and VSCodium`

<a href="Category:Csharp" class="wikilink" title="Category:Csharp">Category:Csharp</a>
