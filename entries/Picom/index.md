<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Picom -->

[picom](https://github.com/yshui/picom) is a standalone <a href="compositor" class="wikilink" title="compositor">compositor</a> for <a href="Xorg" class="wikilink" title="Xorg">Xorg</a>, suitable for use with window managers that do not provide compositing. picom is a fork of [compton](https://github.com/chjj/compton/), which is a fork of [xcompmgr-dana](https://web.archive.org/web/20150429182855/http://oliwer.net/xcompmgr-dana/), which in turn is a fork of xcompmgr.

## Installation

Put the following line into your system or <a href="Home_Manager" class="wikilink" title="home-manager">home-manager</a> config to install picom and enable it's service:

``` nix
services.picom.enable = true;
```

If you just want to install picom without automatically running it every time your system boots, use this instead:

``` nix
packages.picom.enable = true;
```

## Installing a custom fork

Picom is known for having multiple forks, each having their own features such as animations, better performance or fixes that the most popular forks don't implement. Usually these forks are not available in <a href="nixpkgs" class="wikilink" title="nixpkgs">nixpkgs</a>. But with the following code you can compile and build custom versions from any source. [Nurl](https://github.com/nix-community/nurl) can be used to generate fetch calls.

``` nix
environment.systemPackages = with pkgs; [
  (picom.overrideAttrs (oldAttrs: rec {
    src = fetchFromGitHub {
      owner = "pijulius";
      repo = "picom";
      rev = "da21aa8ef70f9796bc8609fb495c3a1e02df93f9";
      hash = "sha256-rxGWAot+6FnXKjNZkMl1uHHHEMVSxm36G3VoV1vSXLA=";
    };
  }))
];
```

## Troubleshooting

### Issues with Nvidia proprietary drivers

See <a href="Nvidia#Fix_app_flickering_with_Picom" class="wikilink" title="Nvidia#Fix_app_flickering_with_Picom">Nvidia#Fix_app_flickering_with_Picom</a>

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
