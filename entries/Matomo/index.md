<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Matomo -->

[Matomo](https://matomo.org) ([source code](https://github.com/matomo-org)) is a real-time web analytics platform.

This article extends the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-matomo).

## Plugins

To use plugins one can use [matomo4nix](https://git.helsinki.tools/helsinki-systems/matomo4nix).

``` nix
{ pkgs, lib, ...}:
let

  matomoPackages = (pkgs.callPackage (builtins.fetchGit {
    url = "https://git.helsinki.tools/helsinki-systems/matomo4nix";
    ref = "master";
  }) {}) // {
    withPlugins = matomoPkg: pluginPkgs: pkgs.runCommand "matomo-with-plugins" {} ''
      cp -a ${matomoPkg}/. $out
      find $out -type d -exec chmod 755 {} +
      for i in ${lib.concatStringsSep " " pluginPkgs}; do
        cp -a $i/. $out
      done
    '';
  };

in {

  services.matomo = {
    enable = true;
    hostname = "TODO";
    package = matomoPackages.withPlugins pkgs.matomo (
      with matomoPackages.plugins;
      [
        RebelOIDC
      ]
    );
  };

}
```

<a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
