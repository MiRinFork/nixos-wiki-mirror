<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flake Parts -->

[Flake Parts](https://github.com/hercules-ci/flake-parts) is a framework that leverages the NixOS <a href="NixOS_modules" class="wikilink" title="module system">module system</a> to write modular and organized <a href="flakes" class="wikilink" title="flakes">flakes</a>. It provides options that represent standard flake attributes and establishes an easy way to work with `system`. It is a minimal and very lightweight mirror of the flake schema.

The major benefit of flake-parts is being able to write modular flakes with the full power of the module system, with error handled. It is a great option and alternative to [flake-utils](https://github.com/numtide/flake-utils), a wrapper which is largely [discouraged](https://ayats.org/blog/no-flake-utils) from being used.

There is documentation available for a variety of flake-parts powered modules available on <https://flake.parts>.

## Getting Started

It is very easy to introduce flake-parts into your already existing `flake.nix`, or to a completely new project as well. A minimal template is provided below:

``` nix
{
  description = "Your new project, powered by flake-parts!";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; # This should point to whichever nixpkgs rev you want.
  };

  outputs = { flake-parts, ... } @ inputs: flake-parts.lib.mkFlake { inherit inputs; } {
    imports = [
      # ./module.nix
      # inputs.foo.flakeModule
    ];

    perSystem = { config, self', inputs', pkgs, system, ... }: {
      # Allows definition of system-specific attributes
      # without needing to declare the system explicitly!
      #
      # Quick rundown of the provided arguments:
      # - config is a reference to the full configuration, lazily evaluated
      # - self' is the outputs as provided here, without system. (self'.packages.default)
      # - inputs' is the input without needing to specify system (inputs'.foo.packages.bar)
      # - pkgs is an instance of nixpkgs for your specific system
      # - system is the system this configuration is for

      # This is equivalent to packages.<system>.default
      packages.default = pkgs.hello;
    };

    flake = {
      # The usual flake attributes can be defined here, including
      # system-agnostic and/or arbitrary outputs.
    };

    # Declared systems that your flake supports. These will be enumerated in perSystem
    systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
  };
}
```

## Writing Modules

Modules are written in exactly the same way as NixOS modules. The main exposed attributes are `perSystem` and `flake`. You can reference the `self` and `inputs` attribute at the top-level, though generally you will likely not need it. An example of writing a module can be seen below:

``` nix
# flake/packages.nix
{ self, inputs, ... }: {
  perSystem = { pkgs, ... }: {
    packages.hello = pkgs.hello;
  };
}
```

The above module can then be imported and referenced in the main flake (or other modules)

``` nix
# flake.nix
{
  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { flake-parts, ... } @ inputs: flake-parts.lib.mkFlake { inherit inputs; } {
    imports = [
      ./flake/packages.nix
    ];

    systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
  };
}
```

On evaluation the flake will expose 4 distinct outputs under packages:

``` console
$ nix flake show --all-systems
path:/path/to/flake.nix?lastModified=omitted&narHash=omitted
└───packages
    ├───aarch64-darwin
    │   └───hello: package 'hello-2.12.1'
    ├───aarch64-linux
    │   └───hello: package 'hello-2.12.1'
    ├───x86_64-darwin
    │   └───hello: package 'hello-2.12.1'
    └───x86_64-linux
        └───hello: package 'hello-2.12.1'
```

## See also

- [Introduction](https://flake.parts/) - flake-parts

<a href="Category:Flakes" class="wikilink" title="Category:Flakes">Category:Flakes</a>
