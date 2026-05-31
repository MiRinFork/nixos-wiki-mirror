<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Spicetify-Nix -->

<div style="border: 1px solid var(--color-progressive--hover); background: var(--background-color-progressive-subtle); padding: 30px; border-radius: 5px; margin: 10px 0px; display: flex; align-items: center;">

<div style="color: var(--color-progressive--hover); font-size: 40px; margin-right: 15px; background: var(--background-color-progressive-subtle); display: flex; line-height: 0; align-items: center;">

❄

</div>

<div style="color: var(--color-progressive--hover); font-size: 15px; font-style: normal; font-weight: 400; line-height: normal; text-align: left;">

This guide requires an understanding of <a href="Flakes" class="wikilink" title="flakes">flakes</a>.

</div>

</div>

<div style="border: 1px solid var(--color-content-added); background: var(--background-color-success-subtle); padding: 15px; border-radius: 5px; margin: 10px 0px; display: flex; justify-content: space-between; align-items: center;">

<div style="color: var(--color-content-added); font-size: 14px; font-style: normal; font-weight: 400; line-height: normal; text-align: left;">

[Spotify](https://spotify.com/)

</div>

<div style="color: var(--color-content-added); font-size: 14px; font-style: normal; font-weight: 400; line-height: normal; text-align: center;">

[License: Unfree](https://wiki.nixos.org/wiki/Unfree_software#Using_unfree_packages/)

</div>

<div style="color: var(--color-content-added); font-size: 14px; font-style: normal; font-weight: 400; line-height: normal; text-align: right;">

[Terms of Service](https://www.spotify.com/legal/end-user-agreement/)

</div>

</div>

[Spicetify-Nix](https://github.com/Gerg-L/spicetify-nix/) is a comprehensive repository designed to integrate Spicetify with the Nix package manager and NixOS. This repository offers a Nix package and NixOS module for Spicetify, simplifying the installation and configuration process on NixOS systems. It supports various themes, extensions, and customizations to improve the <a href="Spotify" class="wikilink" title="Spotify">Spotify</a> user experience. The NixOS module provides predefined options and parameters, ensuring a straightforward setup.

## Installation

#### Using flakes

Include the following input in your <strong>flake.nix</strong> file.

``` nix
spicetify-nix.url = "github:Gerg-L/spicetify-nix";
```

Afterwards, import the module depending on your use of global or home configuration.

``` nix
imports = [
  # For NixOS
  inputs.spicetify-nix.nixosModules.default
  # For home-manager
  inputs.spicetify-nix.homeManagerModules.default
  # For nix-darwin
  inputs.spicetify-nix.darwinModules.default
];
```

## Configuration

#### Basic

``` nix
programs.spicetify =
let
  spicePkgs = inputs.spicetify-nix.legacyPackages.${pkgs.stdenv.hostPlatform.system};
in
{
  enable = true;
  theme = spicePkgs.themes.catppuccin;
}
```

#### Advanced

``` nix
programs.spicetify =
let
  spicePkgs = inputs.spicetify-nix.legacyPackages.${pkgs.stdenv.hostPlatform.system};
in
{
  enable = true;

  enabledExtensions = with spicePkgs.extensions; [
    adblock
    hidePodcasts
    shuffle # shuffle+ (special characters are sanitized out of extension names)
  ];
  enabledCustomApps = with spicePkgs.apps; [
    newReleases
    ncsVisualizer
  ];
  enabledSnippets = with spicePkgs.snippets; [
    rotatingCoverart
    pointer
  ];

  theme = spicePkgs.themes.catppuccin;
  colorScheme = "mocha";
}
```

## Tips and Tricks

#### Location of Options

The options are found in the [rendered docs](https://gerg-l.github.io/spicetify-nix/options.html).

The extensions, customApps, and themes are found in the docs: [extensions.html](https://gerg-l.github.io/spicetify-nix/extensions.html), [custom-apps.html](https://gerg-l.github.io/spicetify-nix/custom-apps.html), [themes.html](https://gerg-l.github.io/spicetify-nix/themes.html).

#### Unpackaged Parameters

Below are instructions on how to package <strong>customApps</strong> that are not in the module by default.

``` nix
programs.spicetify.enabledCustomApps= [
  ({
      # The source of the customApp
      src = pkgs.fetchFromGitHub {
        owner = "";
        repo = "";
        rev = "";
        hash = "";
      };
      # The actual file name of the customApp usually ends with .js
      name = "";
  })
];
```

Keep in mind that this can be applied to the other parameters as well. A custom theme allows for more options to be applied.

``` nix
programs.spicetify.theme = {
  # Name of the theme
  name = "";
  # The source of the theme
  src = pkgs.fetchFromGitHub {
    owner = "";
    repo = "";
    rev = "";
    hash = "";
  };
  
  # Additional theme options all set to defaults
  # the docs of the theme should say which of these 
  # if any you have to change
  injectCss = true;
  injectThemeJs = true;
  replaceColors = true;
  sidebarConfig = true;
  homeConfig = true;
  overwriteAssets = false;
  additonalCss = "";
};
```

## Troubleshooting

## References

1.  <https://spotify.com>
2.  <https://github.com/Gerg-L/spicetify-nix>
3.  <https://www.spotify.com/legal/end-user-agreement>
4.  <https://gerg-l.github.io/spicetify-nix/options.html>
5.  <https://github.com/Gerg-L/spicetify-nix/blob/master/docs/EXTENSIONS.md>
6.  <https://github.com/Gerg-L/spicetify-nix/blob/master/docs/CUSTOMAPPS.md>
7.  <https://github.com/Gerg-L/spicetify-nix/blob/master/docs/THEMES.md>

<a href="Category:Desktop" class="wikilink" title="Category:Desktop">Category:Desktop</a>
