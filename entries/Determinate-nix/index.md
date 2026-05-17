<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Determinate-nix -->

[Determinate Nix](https://docs.determinate.systems/determinate-nix/) is [Determinate Systems](https://determinate.systems)’ enterprise‑grade, validated downstream distribution of NixOS/Nix that retains full compatibility with upstream Nix while adding performance‑boosting features such as parallel evaluation and lazy trees.

## Setup

Add the input `determinate` and the module `determinate.nixosModules.default` to your system flake.nix configuration

``` nix
{
  inputs.determinate.url = "https://flakehub.com/f/DeterminateSystems/determinate/*";
  inputs.nixpkgs.url = "nixpkgs/nixos-25.11";
 
  outputs = { determinate, nixpkgs, ... }: {
    nixosConfigurations.my-workstation = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      modules = [
        # Load the Determinate module
        determinate.nixosModules.default
      ];
    };
  };
}
```

After that add the two extra options to your `nixos-rebuild` command and apply changes

``` bash
sudo nixos-rebuild \
  --option extra-substituters https://install.determinate.systems \
  --option extra-trusted-public-keys cache.flakehub.com-3:hJuILl5sVK4iKm86JzgdXW12Y2Hwd5G07qKtHTOcDCM= \
  --flake ... \
  switch
```

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>
