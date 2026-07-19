<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Modular Services -->

Modular Services are a new experimental module system support in Nixpkgs, that aims to expand the module systems (Eg. NixOS, home-manager, nix-darwin, etc) ecosystem with modularity and portability. Modular services is designed to integrate/compose with other modules systems such as NixOS.

## Difference between Traditional Module Systems (such as NixOS) vs Modular Services

Modular services are built for composability, re-usability, are not defined in sets of options, portable. Where as traditional modules are the opposite.

## How to use

- System:

``` nix
  system.services.<name> = {
    # Usage inside of the traditional module system like NixOS...
    imports = [ pkgs.example.services.default ];
    example.allowAll = false;
  };
```

- User:

``` nix
  system.user.services.<name> = {
    # Usage inside of the traditional module system like NixOS...
    imports = [ pkgs.example.services.default ];
    example.allowAll = false;
  };
```

## Resources

1.  

2.
