<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flakes/en -->

<languages />

**Nix flakes** are an [experimental feature](https://nix.dev/manual/nix/stable/contributing/experimental-features) first introduced in the 2.4 <a href="Nix" class="wikilink" title="Nix">Nix</a> release, aiming to address a number of areas of improvement for the Nix ecosystem: they provide a uniform structure for Nix projects, allow for pinning specific versions of each dependencies, and sharing these dependencies via lock files, and overall make it more convenient to write reproducible Nix expressions.

A flake is a directory which directly contains a Nix file called `flake.nix`, that follows a very specific structure. Flakes introduce a URL-like syntax for specifying remote resources. To simplify the URL syntax, flakes use a registry of symbolic identifiers, allowing the direct specification of resources through syntax such as `github:NixOS/nixpkgs`.

Flakes also allow for locking references and versions, which can then be queried and updated programatically via the inputs . Additionally, an experimental CLI utility accepts flake references for expressions that build, run, and deploy packages.

## Flake file structure

Minimally, a flake file contains a description of the flake, a set of input dependencies and an output. You can generate a very basic flake file at any time using nix flake init. This will populate the current directory with a file called flake.nix that will contain something akin to:

In the example above, you can see the description, the input specified as a GitHub repository with a specific branch (here `nixos/nixpkgs` on the `nixos-unstable` branch), and an output that makes use of the input. The output simply specifies that the flake contains one package for the x86_64 architecture called `hello`. Even if your flake's output wouldn't use its input (however, in practice, that is highly unlikely), the output still needs to be a Nix function.

### Nix configuration

It is possible to override the global Nix configuration set in your `nix.conf` file for the purposes of evaluating a flake. This can be useful, for example, for setting up binary caches specific to certain projects, while keeping the global configuration untouched. The flake file can contain a nixConfig attribute with any relevant configuration settings supplied. For example, enabling the nix-community binary cache would be achieved by:

## Setup

### Enabling flakes temporarily

When using any <a href="Nix_command" class="wikilink" title="nix command"><code>nix</code> command</a>, add the following command-line options:

``` shell
 --experimental-features 'nix-command flakes'
```

### Enabling flakes permanently

#### NixOS

Add the following to the <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration_system_configuration" class="wikilink" title="NixOS configuration">NixOS configuration</a>:

``` nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

#### Home Manager

Add the following to your <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> config:

``` nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

#### Nix standalone

Add the following to `~/.config/nix/nix.conf` or `/etc/nix/nix.conf`:

``` text
experimental-features = nix-command flakes
```

## Usage

### The nix flakes command

The subcommand is described in .

This flake produces a single flake output `packages`. And within that, `x86_64-linux` is a system-specifc attribute set. And within that, two package <a href="derivations" class="wikilink" title="derivations">derivations</a> `default` and `hello`. You can find outputs with the of a flake as shown below:

``` console
$ nix flake show
└───packages
    └───x86_64-linux
        ├───default: package 'hello-2.12.2'
        └───hello: package 'hello-2.12.2'
```

#### Development shells

A `devShell` is a Nix-provided <a href="Development_environment_with_nix-shell#nix_develop" class="wikilink" title="development environment">development environment</a> defined within a flake. It lets you declare a reproducible shell environment with the tools, libraries, and environment variables you need for the development of a specific project. This is flake equivalent to defining a `nix-shell`.

``` nix
{
  description = "Example flake with a devShell";

  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.x86_64-linux.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          hello
        ];
        shellHook = ''
          echo "Welcome to the devShell!"
        '';
      };
    };
}
```

To enter the development shell environment:

``` console
$ nix develop
```

#### Build specific attributes in a flake repository

Running `nix build` will look in the `legacyPackages` and `packages` output attributes for the corresponding <a href="derivations" class="wikilink" title="derivation">derivation</a> and then your system architecture and build the default output. If you want to specify a build attribute in a flake repository, you can run `nix build .#`<attr>. In the example above, if you wanted to build the `packages.x86_64-linux.hello` attribute, run:

``` console
$ nix build .#hello
```

Likewise, you can specify an attribute with the run command: `nix run .#hello` and the develop command: `nix develop .#hello`.

## Flake schema

The flake.nix file is a Nix file but that has special restrictions (more on that later).

It has 4 top-level attributes:

- `description` is a string describing the flake.

<!-- -->

- `inputs` is an attribute set of all the dependencies of the flake. The schema is described below.

<!-- -->

- `outputs` is a function of one argument that takes an attribute set of all the realized inputs, and outputs another attribute set whose schema is described below.

<!-- -->

- `nixConfig` is an attribute set of values which reflect the [values given to nix.conf](https://nixos.org/manual/nix/stable/command-ref/conf-file.html). This can extend the normal behavior of a user's nix experience by adding flake-specific configuration, such as a <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>.

### Input schema

[The nix flake inputs manual](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-inputs).

[The nix flake references manual](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-references).

The inputs attribute defines the dependencies of the flake. For example, nixpkgs has to be defined as a dependency for a system flake in order for the system to build properly.

<a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> can be defined using the following code:

`inputs.nixpkgs.url = "github:NixOS/nixpkgs/`<branch name>`";`

Nixpkgs can alternatively also point to an url cached by the NixOS organization:

`inputs.nixpkgs.url = "https://nixos.org/channels/nixpkgs-unstable/nixexprs.tar.xz";`

In this example the input would point to the \`nixpkgs-unstable\` channel.

For any repository with its own flake.nix file, the website must also be defined. Nix knows where the nixpkgs repository is, so stating that it's on GitHub is unnecessary.

For example, adding <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> as an input would look something like this:

`inputs.hyprland.url = "github:hyprwm/Hyprland";`

If you want to make Hyprland follow the nixpkgs input to avoid having multiple versions of nixpkgs, this can be done using the following code:

`inputs.hyprland.inputs.nixpkgs.follows = "nixpkgs";`

Using curly brackets (`{}`), we can shorten all of this and put it in a table. The code will look something like this:

``` nix
inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/<branch name>";
  hyprland = {
    url = "github:hyprwm/Hyprland";
    inputs.nixpkgs.follows = "nixpkgs";
  };
};
```

By default, Git submodules in package `src`'s won't get copied to the nix store, this may cause the build to fail. Flakes in Git repositories can declare that they need Git submodules to be enabled. Since Nix version [2.27](https://discourse.nixos.org/t/nix-2-27-0-released/62003), you can enable submodules by:

``` nix
  inputs.self.submodules = true;
```

### Output schema

The output schema is described the [nix flake check manual page](https://nix.dev/manual/nix/2.33/command-ref/new-cli/nix3-flake-check.html#evaluation-checks).

Once the inputs are resolved, they're passed to the function \`outputs\` along with with \`self\`, which is the directory of this flake in the store. \`outputs\` returns the outputs of the flake, according to the following schema.

Where:

- <system> is something like "x86_64-linux", "aarch64-linux", "i686-linux", "x86_64-darwin"

<!-- -->

- <name> is an attribute name like "hello".

<!-- -->

- <flake> is a flake name like "nixpkgs".

<!-- -->

- <store-path> is a `/nix/store..` path

``` nix
{ self, ... }@inputs:
{
  # Executed by `nix flake check`
  checks."<system>"."<name>" = derivation;
  # Executed by `nix build .#<name>`
  packages."<system>"."<name>" = derivation;
  # Executed by `nix build .`
  packages."<system>".default = derivation;
  # Executed by `nix run .#<name>`
  apps."<system>"."<name>" = {
    type = "app";
    program = "<store-path>";
    meta = {description = "..."; inherit otherMetaAttrs; };
  };
  # Executed by `nix run . -- <args?>`
  apps."<system>".default = { type = "app"; program = "..."; meta = {description = "..."; inherit otherMetaAttrs; }; };

  # Formatter (alejandra, nixfmt, treefmt-nix or nixpkgs-fmt)
  formatter."<system>" = derivation;
  # Used for nixpkgs packages, also accessible via `nix build .#<name>`
  legacyPackages."<system>"."<name>" = derivation;
  # Overlay, consumed by other flakes
  overlays."<name>" = final: prev: { };
  # Default overlay
  overlays.default = final: prev: { };
  # Nixos module, consumed by other flakes
  nixosModules."<name>" = { config, ... }: { options = {}; config = {}; };
  # Default module
  nixosModules.default = { config, ... }: { options = {}; config = {}; };
  # Used with `nixos-rebuild switch --flake .#<hostname>`
  # nixosConfigurations."<hostname>".config.system.build.toplevel must be a derivation
  nixosConfigurations."<hostname>" = {};
  # Used by `nix develop .#<name>`
  devShells."<system>"."<name>" = derivation;
  # Used by `nix develop`
  devShells."<system>".default = derivation;
  # Hydra build jobs
  hydraJobs."<attr>"."<system>" = derivation;
  # Used by `nix flake init -t <flake>#<name>`
  templates."<name>" = {
    path = "<store-path>";
    description = "template description goes here?";
  };
  # Used by `nix flake init -t <flake>`
  templates.default = { path = "<store-path>"; description = ""; };
}
```

You can also define additional arbitrary attributes, but these are the outputs that Nix knows about.

## Core usage patterns

### Making your evaluations pure

Nix flakes are evaluated in a pure evaluation mode, meaning that access to the external environment is restricted to ensure reproducibility. To maintain purity when working with flakes, consider the following:

- and require a `sha256` argument to be considered pure.

<!-- -->

- `builtins.currentSystem` is non-hermetic and impure as it reflects the host system performing the evaluation. This can usually be avoided by passing the system (i.e., x86_64-linux) explicitly to derivations requiring it.

<!-- -->

- `builtins.getEnv` is also impure. Avoid reading from environment variables and likewise, do not reference files outside of the flake's directory.

### Defining a flake for multiple architectures

Flakes force you to specify a program for each supported architecture. An example below shows how to write a flake that targets multiple architectures.

``` nix
{
  description = "A flake targeting multiple architectures";

inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

outputs = { self, nixpkgs }: let
    systems = [ "x86_64-linux" "aarch64-linux" ];
    forAllSystems = f: builtins.listToAttrs (map (system: {
      name = system;
      value = f system;
    }) systems);
  in {
    packages = forAllSystems (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      hello = pkgs.hello;
      default = pkgs.hello;
    });
  };
}
```

You can also use third-parties projects like <a href="Flake_Utils" class="wikilink" title="flake-utils">flake-utils</a> or <a href="Flake_Parts" class="wikilink" title="flake-parts">flake-parts</a> that automatically provide code to avoid this boilerplate. To avoid re-defining the program multiple times, refer to <a href="Flake_Utils#Defining_a_flake_for_multiple_architectures" class="wikilink" title="Flake Utils#Defining a flake for multiple architectures">Flake Utils#Defining a flake for multiple architectures</a>

### Using overlays

To use <a href="Overlays" class="wikilink" title="Overlays">Overlays</a> with flakes, refer to <a href="Overlays#In_a_Nix_flake" class="wikilink" title="Overlays#In a Nix flake">Overlays#In a Nix flake</a> page.

### Enable unfree software

To allow for <a href="Unfree_software" class="wikilink" title="unfree software">unfree software</a> in a flake project, you need to explicitly allow it by setting `config.allowUnree = true;` when importing Nixpkgs.

``` nix
{
  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  outputs = { self, nixpkgs, flake-compat }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; config.allowUnfree = true;};
    in {
      ...
    };
}
```

## NixOS configuration with flakes

It is possible to manage a <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> system configuration using flakes, gaining the benefits of reproducible, declarative inputs and streamlined updates.

For details and examples, see <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a>.

## Development tricks

### Automatically switch nix shells with direnv

It is possible to automatically activate different Nix shells when navigating between project directories by using <a href="Direnv" class="wikilink" title="Direnv">Direnv</a>. Additional Nix integration with Direnv can be achieved with [nix-direnv](https://github.com/nix-community/nix-direnv).

### Pushing Flakes to Cachix

<https://docs.cachix.org/pushing#flakes>

### Flake support in projects without flakes

The [flake-compat](https://github.com/edolstra/flake-compat) library provides a compatibility layer that allows projects using traditional `default.nix` and `shell.nix` files to operate with flakes. For more details and usage examples, see the <a href="Flake_Compat" class="wikilink" title="Flake Compat">Flake Compat</a> page.

Another project that allows consuming flakes from non-flake projects is [flake-inputs](https://github.com/fricklerhandwerk/flake-inputs).

### Accessing flakes from Nix expressions

If you want to access a flake from within a regular Nix expression on a system that has flakes enabled, you can use something like `(builtins.getFlake "/path/to/directory").packages.x86_64-linux.default`, where 'directory' is the directory that contains your `flake.nix`.

### Efficiently build multiple flake outputs

To push *all* flake outputs automatically, checkout [devour-flake](https://github.com/srid/devour-flake#usage).

### Build a package added in a PR

    nix build github:nixos/nixpkgs?ref=pull/<PR_NUMBER>/head#<PACKAGE>

this allows building a package that has not yet been added to nixpkgs.

note that this will download a full source tarball of nixpkgs. if you already have a local clone, using that may be faster due to delta compression:

    git fetch upstream pull/<PR_NUMBER>/head && git checkout FETCH_HEAD && nix build .#PACKAGE

this allows building a package that has not yet been added to nixpkgs.

### How to add a file locally in git but not include it in commits

When a <a href="git" class="wikilink" title="git">git</a> folder exists, flake will only copy files added in git to maximize reproducibility (this way if you forgot to add a local file in your repo, you will directly get an error when you try to compile it). However, for development purpose you may want to create an alternative flake file, for instance containing configuration for your preferred editors as described [here](https://discourse.nixos.org/t/local-personal-development-tools-with-flakes/22714/8)… of course without committing this file since it contains only your own preferred tools. You can do so by doing something like that (say for a file called `extra/flake.nix`):

    git add --intent-to-add extra/flake.nix
    git update-index --skip-worktree --assume-unchanged extra/flake.nix

### Rapid iteration of a direct dependency

One common pain point with using Nix as a development environment is the need to completely rebuild dependencies and re-enter the dev shell every time they are updated. The `nix develop --redirect `<flake>` `<directory> command allows you to provide a mutable dependency to your shell as if it were built by Nix.

Consider a situation where your executable, `consumexe`, depends on a library, `libdep`. You're trying to work on both at the same time, where changes to `libdep` are reflected in real time for `consumexe`. This workflow can be achieved like so:

``` bash
cd ~/libdep-src-checkout/
nix develop # Or `nix-shell` if applicable.
export prefix="./install" # configure nix to install it here
buildPhase   # build it like nix does
installPhase # install it like nix does
```

Now that you've built the dependency, `consumexe` can take it as an input. **In another terminal**:

``` bash
cd ~/consumexe-src-checkout/
nix develop --redirect libdep ~/libdep-src-checkout/install
echo $buildInputs | tr " " "\n" | grep libdep
# Output should show ~/libdep-src-checkout/ so you know it worked
```

If Nix warns you that your redirected flake isn't actually used as an input to the evaluated flake, try using the `--inputs-from .` flag. If all worked well you should be able to `buildPhase && installPhase` when the dependency changes and rebuild your consumer with the new version *without* exiting the development shell.

## See also

### Official sources

- [Flakes](https://nix.dev/concepts/flakes) - nix.dev

<!-- -->

- [Nix flake command reference manual](https://nixos.org/manual/nix/unstable/command-ref/new-cli/nix3-flake.html) - Many additional details about flakes, and their parts.

<!-- -->

- [spec describing flake inputs in more detail](https://github.com/NixOS/nix/blob/master/src/nix/flake.md)

<!-- -->

- [RFC 49](https://github.com/NixOS/rfcs/pull/49) (2019) - Original flakes specification

### Guides

- [Flakes aren't real and can't hurt you](https://jade.fyi/blog/flakes-arent-real/) (Jade Lovelace, 2024)

<!-- -->

- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book)(Ryan4yin, 2023) - 🛠️ ❤️ An unofficial NixOS & Flakes book for beginners.

<!-- -->

- [Nix Flakes: an Introduction](https://xeiaso.net/blog/nix-flakes-1-2022-02-21) (Xe Iaso, 2022)

<!-- -->

- [Practical Nix Flakes](https://serokell.io/blog/practical-nix-flakes) (Alexander Bantyev, 2021) - Intro article on working with Nix and Flakes

<!-- -->

- [Nix Flakes, Part 1: An introduction and tutorial](https://www.tweag.io/blog/2020-05-25-flakes/) (Eelco Dolstra, 2020)

<!-- -->

- [Nix Flakes, Part 2: Evaluation caching](https://www.tweag.io/blog/2020-06-25-eval-cache/) (Eelco Dolstra, 2020)

<!-- -->

- [Nix Flakes, Part 3: Managing NixOS systems](https://www.tweag.io/blog/2020-07-31-nixos-flakes/) (Eelco Dolstra, 2020)

<!-- -->

- [Nix flakes 101: Introduction to nix flakes](https://www.youtube.com/watch?v=QXUlhnhuRX4&list=PLgknCdxP89RcGPTjngfNR9WmBgvD_xW0l) (Jörg Thalheim, 2020) YouTube video

### Useful flake modules

- <a href="Flake_Utils" class="wikilink" title="flake-utils">flake-utils</a>: Library to avoid some boiler-code when writing flakes

<!-- -->

- <a href="Flake_Parts" class="wikilink" title="flake-parts">flake-parts</a>: Library to help write modular and organized flakes

<!-- -->

- <a href="Flake_Compat" class="wikilink" title="flake-compat">flake-compat</a>: A compatibility layer for flakes

<!-- -->

- [building Rust and Haskell flakes](https://github.com/nix-community/todomvc-nix)

<a href="Category:Software" class="wikilink" title="Software">Software</a> <a href="Category:Nix" class="wikilink" title="Nix">Nix</a> <a href="Category:Nix_Language" class="wikilink" title="Nix Language">Nix Language</a> <a href="Category:Flakes" class="wikilink" title="Flakes">Flakes</a>
