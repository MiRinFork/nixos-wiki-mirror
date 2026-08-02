<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Obsidian -->

[**Obsidian**](https://obsidian.md) is a proprietary note-taking application and Markdown editor. Notes are stored as regular files inside directories called *vaults*.

## Installation

### NixOS

``` nix
{
  nixpkgs.config.allowUnfree = true;

  environment.systemPackages = with pkgs; [
    obsidian
  ];
}
```

### Home Manager

<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> can install Obsidian and manage settings for individual vaults.

``` nix
{
  programs.obsidian = {
    enable = true;

    vaults.notes.target = "Documents/Obsidian";

    defaultSettings.app = {
      alwaysUpdateLinks = true;
      spellcheck = true;
    };
  };
}
```

The vault path is relative to the user's home directory. The example above manages `~/Documents/Obsidian`.

The `notes` attribute is only an internal Home Manager name.

## Core plugins

Core plugins are included with Obsidian and can be enabled declaratively:

``` nix
{
  programs.obsidian.defaultSettings.corePlugins = [
    "backlink"
    "bookmarks"
    "daily-notes"
    "file-explorer"
    "global-search"
    "templates"
  ];
}
```

Plugin-specific settings can also be declared:

``` nix
{
  programs.obsidian.defaultSettings.corePlugins = [
    {
      name = "daily-notes";
      settings = {
        folder = "Daily";
        format = "YYYY-MM-DD";
      };
    }
    {
      name = "templates";
      settings.folder = "Templates";
    }
  ];
}
```

## Community plugins and themes

Home Manager supports packaged plugins and themes, but does not provide a package collection for them.

The third-party [nix-obsidian-extensions](https://github.com/karaolidis/nix-obsidian-extensions) flake provides packages from the official Obsidian registries.

### Flake input

Add the input to `flake.nix`:

``` nix
{
  inputs = {
    # ...

    obsidian-extensions = {
      url = "github:karaolidis/nix-obsidian-extensions";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  # ...
}
```

### Overlay

Apply the overlay to the package set used by Home Manager:

``` nix
{
  nixpkgs.overlays = [
    inputs.obsidian-extensions.overlays.default
  ];
}
```

This adds:

- `pkgs.obsidianPlugins`
- `pkgs.obsidianThemes`

When Home Manager is used as a NixOS module with `home-manager.useGlobalPkgs = true`, apply the overlay in the NixOS configuration.

Standalone Home Manager supports the same `nixpkgs.overlays` option.

### Installing plugins and themes

``` nix
{ pkgs, ... }:

{
  programs.obsidian = {
    enable = true;

    vaults.notes.target = "Documents/Obsidian";

    defaultSettings = {
      communityPlugins = with pkgs.obsidianPlugins; [
        dataview
        obsidian-git
        obsidian-importer
        vim-yank-highlight
      ];

      themes = with pkgs.obsidianThemes; [
        catppuccin
      ];
    };
  };
}
```

Plugin attributes use the IDs from the official Obsidian plugin registry. They do not always match the display names shown in Obsidian.

Available extensions can be listed with:

``` console
# Plugins
$ nix eval \
    --json \
    github:karaolidis/nix-obsidian-extensions#legacyPackages.x86_64-linux.obsidianPlugins \
    --apply builtins.attrNames

# Themes
$ nix eval \
    --json \
    github:karaolidis/nix-obsidian-extensions#legacyPackages.x86_64-linux.obsidianThemes \
    --apply builtins.attrNames
```

Plugin settings can be written to their `data.json` files:

``` nix
{
  programs.obsidian.defaultSettings.communityPlugins = [
    {
      pkg = pkgs.obsidianPlugins.example-plugin;
      settings = {
        exampleOption = true;
      };
    }
  ];
}
```

## Declarative and manual management

Declaratively managed plugins and themes are linked from the immutable Nix store.

Therefore:

- they generally cannot be updated from Obsidian;
- manual changes may be replaced on the next activation;
- removing them from the Nix configuration removes them from the managed vault.

To manage plugins and themes manually, leave their options unset:

``` nix
{
  programs.obsidian = {
    enable = true;

    vaults.notes.target = "Documents/Obsidian";

    defaultSettings = {
      communityPlugins = null;
      themes = null;
    };
  };
}
```

Both options are `null` by default.

## Applying the configuration

``` console
# NixOS
$ sudo nixos-rebuild switch --flake .

# Standalone Home Manager
$ home-manager switch --flake .
```

## See also

- [Obsidian documentation](https://help.obsidian.md)
- [Home Manager options](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.obsidian.enable)
- [nix-obsidian-extensions](https://github.com/karaolidis/nix-obsidian-extensions)
- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>
- <a href="Logseq" class="wikilink" title="Logseq">Logseq</a>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Note_taking" class="wikilink" title="Category:Note taking">Category:Note taking</a>
