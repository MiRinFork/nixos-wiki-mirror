<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zen Browser -->

**Zen** is a firefox based browser that promises a calmer internet, and features a sideways based tab system.

## Installation

For any installation method, use nixpkgs-unstable to ensure compatibility with the latest Firefox version.

#### System setup (Flakes)

Add the zen flake to your `flake.nix`

``` nix
{
  ...
  inputs = {
    ...
    zen-browser = {
      url = "github:0xc000022070/zen-browser-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  }
}
```

Add zen to your `environment.systemPackages`

``` nix
{
  inputs,
  ...
}: {
  environment.systemPackages = [
    inputs.zen-browser.packages."${pkgs.stdenv.hostPlatform.system}".default # default, beta, twilight, or twilight-official
  ];
}
```

Default and beta both install the beta version of zen.

#### Home Manager (Flakes)

First add the zen flake to your `flake.nix`

``` nix
{
  ...
  inputs = {
    ...
    zen-browser = {
      url = "github:0xc000022070/zen-browser-flake";
      inputs.nixpkgs.follows = "nixpkgs";
      home-manager.follows = "home-manager";
    };
  }
}
```

Add zen to your Home Manager configuration:

``` nix
{
  imports = [
    inputs.zen-browser.homeModules.beta # beta, twilight, or twilight-official
  ];

  programs.zen-browser = {
    enable = true;
    setAsDefaultBrowser = true;
  };
}
```

Please see the flake repository's [Home Manager Reference Section](https://github.com/0xc000022070/zen-browser-flake#home-manager-reference) or the [Configuration Examples Section](https://github.com/0xc000022070/zen-browser-flake#configuration-examples) for more information on how to declaratively configure Zen with Home Manager.

<a href="Category:Web_Browser" class="wikilink" title="Category:Web Browser">Category:Web Browser</a>
