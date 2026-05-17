<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Starsector -->

**[Starsector](https://fractalsoftworks.com/)** (formerly “Starfarer”) is an open-world single-player space-combat, roleplaying, exploration, and economic game. You take the role of a space captain seeking fortune and glory however you choose.

## Installation

Install starsector by adding following into your NixOS config:

``` nixos
  environment.systemPackages = [
    pkgs.starsector
  ];
```

## Tips and tricks

To change the amount of memory, the starsector game can use, add the following command to NixOS.

``` nixos
  environment.systemPackages = [
    # overrides the NixOS package, starsector, see: https://wiki.nixos.org/wiki/Starsector
    (pkgs.starsector.overrideAttrs ({ ... }: {
      postInstall = ''
        cp ${dotfiles/starsector/settings.json} $out/share/starsector/data/config/settings.json

        substituteInPlace $out/share/starsector/.starsector.sh-wrapped \
          --replace-fail "Xms1536m" "Xms8192m" \
          --replace-fail "Xmx1536m" "Xmx8192m"
      '';
    }))
  ];
```

This commands takes the `settings.json` and changes the commandline parameters:`Xms` `Xmx` to take `8192m` or `8GiB` of RAM.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a>
