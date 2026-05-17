<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Mtr -->

## About

`mtr` is a network diagnostic tool that combines ping and traceroute into one program. Nixpkgs contains two flavors of it: the standalone application and a prometheus-ready exporter:

``` nix
{
  programs.mtr.enable = true;
  services.mtr-exporter.enable = true;
}
```

## Issues

### mtr needs to be called with sudo

To avoid the need to escalate privileges when calling `mtr` create a setcap wrapper by setting

``` nix
programs.mtr.enable = true;
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
