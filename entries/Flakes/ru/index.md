<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flakes/ru -->

<languages />

<div class="mw-translate-fuzzy">

**Nix Flakes** (Флейки Nix) — это <a href="Experimental_Nix_features" class="wikilink" title="экспериментальная функция">экспериментальная функция</a>, впервые представленная в релизе <a href="Nix" class="wikilink" title="Nix">Nix</a> 2.4, которая направлена на решение ряда задач по улучшению экосистемы Nix: Флейки предоставляют единую структуру для Nix-проектов, позволяя фиксировать конкретные версии каждой зависимости, делиться этими зависимостями с помощью lock-файлов и в целом делать запись репродуцируемых Nix-выражений более удобной.

</div>

Флейк — это каталог, который содержит файл Nix с именем `flake.nix`, который следует очень конкретной структуре. Флейки вводят похожий на URL синтаксис для указания удалённых ресурсов. Чтобы упростить синтаксис, флейки используют реестр символических идентификаторов, что позволяет напрямую ссылаться на ресурсы в следующей форме: `github:NixOS/nixpkgs`.

Флейки также поддерживают фиксацию ссылок и версий, которые затем могут быть запрошены и обновлены программно через inputs. Кроме того, экспериментальная утилита командной строки принимает flake-ссылки для выражений, которые собирают, выполняют и развёртывают пакеты.

<span id="Flake_file_structure"></span>

<div class="mw-translate-fuzzy">

## Структура flake-файла

В простейшем виде flake-файл содержит описание флейка, набор входных зависимостей (inputs) и выход (output). Вы можете сгенерировать шаблонный flake-файл в любой момент с помощью `nix flake init`. Это создаст в текущей директории файл `flake.nix`, содержащий примерно следующее: В примере выше вы можете видеть описание, вход (input), указанный как репозиторий GitHub с конкретной веткой (здесь `nixos/nixpkgs` на ветке `nixos-unstable`), и выход (output), который использует этот input. Output в этом примере просто определяет, что в флейке есть один пакет для архитектуры x86_64 под именем `hello`. Даже если output вашего флейка не использует его inputs (что на практике маловероятно), output всё равно должен быть Nix-функцией.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<span id="Nix_configuration"></span>

<div class="mw-translate-fuzzy">

### Конфигурация Nix

Можно переопределить глобальную конфигурацию Nix, заданную в файле `nix.conf`, чтобы оценить работу флейка. Это может быть полезно, например, для установки бинарных кэшей, специфичных для проекта, пока глобальная конфигурация останется нетронутой. Flake-файл может содержать атрибут `nixConfig` с любыми релевантными настройками. Например, чтобы включить бинарный кэш nix-community, можно добавить:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It is possible to override the global Nix configuration set in your `nix.conf` file for the purposes of evaluating a flake. This can be useful, for example, for setting up binary caches specific to certain projects, while keeping the global configuration untouched. The flake file can contain a nixConfig attribute with any relevant configuration settings supplied. For example, enabling the nix-community binary cache would be achieved by:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Setup

</div>

<span id="Enabling_flakes_temporarily"></span>

<div class="mw-translate-fuzzy">

#### Временно включить поддержку Flakes

</div>

<div class="mw-translate-fuzzy">

При использовании любой команды `nix` добавьте следующие параметры командной строки:

</div>

``` shell
 --experimental-features 'nix-command flakes'
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Enabling flakes permanently

</div>

<span id="NixOS"></span>

<div class="mw-translate-fuzzy">

#### Включить flakes на постоянной основе в NixOS

</div>

Добавьте следующее в <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration_system_configuration" class="wikilink" title="Конфигурацию NixOS">Конфигурацию NixOS</a>:

``` nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

<span id="Home_Manager"></span>

<div class="mw-translate-fuzzy">

##### В других Дистрибутивах, с Home-Manager

</div>

<div class="mw-translate-fuzzy">

Добавьте следующее в свою конфигурацию Home-Manager:

</div>

``` nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

<span id="Nix_standalone"></span>

<div class="mw-translate-fuzzy">

##### Другие Дистрибутивы, без Home-Manager

</div>

<div class="mw-translate-fuzzy">

</div>

Добавьте следующее в `~/.config/nix/nix.conf` или `/etc/nix/nix.conf`:

``` text
experimental-features = nix-command flakes
```

<span id="Usage"></span>

<div class="mw-translate-fuzzy">

### Основное Использование Flake

</div>

<div class="mw-translate-fuzzy">

</div>

<div class="mw-translate-fuzzy">

Для флейков в репозиториях git, только файлы из рабочего дерева (Working tree) будут скопированы в хранилище

</div>

<div class="mw-translate-fuzzy">

Поэтому если вы используете git для ваших флейков, не забывайте применять `git add` ко всем файлам репозитория, после того как вы их создаёте

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### The nix flakes command

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The subcommand is described in .

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This flake produces a single flake output `packages`. And within that, `x86_64-linux` is a system-specifc attribute set. And within that, two package <a href="derivations" class="wikilink" title="derivations">derivations</a> `default` and `hello`. You can find outputs with the of a flake as shown below:

</div>

``` console
$ nix flake show
└───packages
    └───x86_64-linux
        ├───default: package 'hello-2.12.2'
        └───hello: package 'hello-2.12.2'
```

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Development shells

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A `devShell` is a Nix-provided <a href="Development_environment_with_nix-shell#nix_develop" class="wikilink" title="development environment">development environment</a> defined within a flake. It lets you declare a reproducible shell environment with the tools, libraries, and environment variables you need for the development of a specific project. This is flake equivalent to defining a `nix-shell`.

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

To enter the development shell environment:

</div>

``` console
$ nix develop
```

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Build specific attributes in a flake repository

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Running `nix build` will look in the `legacyPackages` and `packages` output attributes for the corresponding <a href="derivations" class="wikilink" title="derivation">derivation</a> and then your system architecture and build the default output. If you want to specify a build attribute in a flake repository, you can run `nix build .#`<attr>. In the example above, if you wanted to build the `packages.x86_64-linux.hello` attribute, run:

</div>

``` console
$ nix build .#hello
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Likewise, you can specify an attribute with the run command: `nix run .#hello` and the develop command: `nix develop .#hello`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Flake schema

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The flake.nix file is a Nix file but that has special restrictions (more on that later).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It has 4 top-level attributes:

</div>

- `description` это строка описывающая flake.

<div lang="en" dir="ltr" class="mw-content-ltr">

- `inputs` is an attribute set of all the dependencies of the flake. The schema is described below.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- `outputs` is a function of one argument that takes an attribute set of all the realized inputs, and outputs another attribute set whose schema is described below.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- `nixConfig` is an attribute set of values which reflect the [values given to nix.conf](https://nixos.org/manual/nix/stable/command-ref/conf-file.html). This can extend the normal behavior of a user's nix experience by adding flake-specific configuration, such as a <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a>.

</div>

<span id="Input_schema"></span>

### Входная схема

<div lang="en" dir="ltr" class="mw-content-ltr">

[The nix flake inputs manual](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-inputs).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

[The nix flake references manual](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-references).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The inputs attribute defines the dependencies of the flake. For example, nixpkgs has to be defined as a dependency for a system flake in order for the system to build properly.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

<a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> can be defined using the following code:

</div>

`inputs.nixpkgs.url = "github:NixOS/nixpkgs/`<branch name>`";`

<div lang="en" dir="ltr" class="mw-content-ltr">

Nixpkgs can alternatively also point to an url cached by the NixOS organization:

</div>

`inputs.nixpkgs.url = "https://nixos.org/channels/nixpkgs-unstable/nixexprs.tar.xz";`

<div lang="en" dir="ltr" class="mw-content-ltr">

In this example the input would point to the \`nixpkgs-unstable\` channel.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For any repository with its own flake.nix file, the website must also be defined. Nix knows where the nixpkgs repository is, so stating that it's on GitHub is unnecessary.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For example, adding <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> as an input would look something like this:

</div>

`inputs.hyprland.url = "github:hyprwm/Hyprland";`

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to make Hyprland follow the nixpkgs input to avoid having multiple versions of nixpkgs, this can be done using the following code:

</div>

`inputs.hyprland.inputs.nixpkgs.follows = "nixpkgs";`

<div lang="en" dir="ltr" class="mw-content-ltr">

Using curly brackets (`{}`), we can shorten all of this and put it in a table. The code will look something like this:

</div>

``` nix
inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/<branch name>";
  hyprland = {
    url = "github:hyprwm/Hyprland";
    inputs.nixpkgs.follows = "nixpkgs";
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

By default, Git submodules in package `src`'s won't get copied to the nix store, this may cause the build to fail. Flakes in Git repositories can declare that they need Git submodules to be enabled. Since Nix version [2.27](https://discourse.nixos.org/t/nix-2-27-0-released/62003), you can enable submodules by:

</div>

``` nix
  inputs.self.submodules = true;
```

<div lang="en" dir="ltr" class="mw-content-ltr">

### Output schema

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The output schema is described the [nix flake check manual page](https://nix.dev/manual/nix/2.33/command-ref/new-cli/nix3-flake-check.html#evaluation-checks).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Once the inputs are resolved, they're passed to the function \`outputs\` along with with \`self\`, which is the directory of this flake in the store. \`outputs\` returns the outputs of the flake, according to the following schema.

</div>

В которой:

<div lang="en" dir="ltr" class="mw-content-ltr">

- <system> is something like "x86_64-linux", "aarch64-linux", "i686-linux", "x86_64-darwin"

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <name> is an attribute name like "hello".

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <flake> is a flake name like "nixpkgs".

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <store-path> is a `/nix/store..` path

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

You can also define additional arbitrary attributes, but these are the outputs that Nix knows about.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Core usage patterns

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Making your evaluations pure

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Nix flakes are evaluated in a pure evaluation mode, meaning that access to the external environment is restricted to ensure reproducibility. To maintain purity when working with flakes, consider the following:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- and require a `sha256` argument to be considered pure.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- `builtins.currentSystem` is non-hermetic and impure as it reflects the host system performing the evaluation. This can usually be avoided by passing the system (i.e., x86_64-linux) explicitly to derivations requiring it.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- `builtins.getEnv` is also impure. Avoid reading from environment variables and likewise, do not reference files outside of the flake's directory.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Defining a flake for multiple architectures

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Flakes force you to specify a program for each supported architecture. An example below shows how to write a flake that targets multiple architectures.

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

You can also use third-parties projects like <a href="Flake_Utils" class="wikilink" title="flake-utils">flake-utils</a> or <a href="Flake_Parts" class="wikilink" title="flake-parts">flake-parts</a> that automatically provide code to avoid this boilerplate. To avoid re-defining the program multiple times, refer to <a href="Flake_Utils#Defining_a_flake_for_multiple_architectures" class="wikilink" title="Flake Utils#Defining a flake for multiple architectures">Flake Utils#Defining a flake for multiple architectures</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Using overlays

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To use <a href="Overlays" class="wikilink" title="Overlays">Overlays</a> with flakes, refer to <a href="Overlays#In_a_Nix_flake" class="wikilink" title="Overlays#In a Nix flake">Overlays#In a Nix flake</a> page.

</div>

<span id="Enable_unfree_software"></span>

<div class="mw-translate-fuzzy">

## Включить несвободное ПО

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To allow for <a href="Unfree_software" class="wikilink" title="unfree software">unfree software</a> in a flake project, you need to explicitly allow it by setting `config.allowUnree = true;` when importing Nixpkgs.

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

## NixOS configuration with flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It is possible to manage a <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> system configuration using flakes, gaining the benefits of reproducible, declarative inputs and streamlined updates.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For details and examples, see <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a>.

</div>

<span id="Development_tricks"></span>

## Трюки для разработки

<span id="Automatically_switch_nix_shells_with_direnv"></span>

<div class="mw-translate-fuzzy">

### Автоматическое переключение оболочек nix с nix-direnv

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It is possible to automatically activate different Nix shells when navigating between project directories by using <a href="Direnv" class="wikilink" title="Direnv">Direnv</a>. Additional Nix integration with Direnv can be achieved with [nix-direnv](https://github.com/nix-community/nix-direnv).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Pushing Flakes to Cachix

</div>

<https://docs.cachix.org/pushing#flakes>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Flake support in projects without flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

The [flake-compat](https://github.com/edolstra/flake-compat) library provides a compatibility layer that allows projects using traditional `default.nix` and `shell.nix` files to operate with flakes. For more details and usage examples, see the <a href="Flake_Compat" class="wikilink" title="Flake Compat">Flake Compat</a> page.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Another project that allows consuming flakes from non-flake projects is [flake-inputs](https://github.com/fricklerhandwerk/flake-inputs).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Accessing flakes from Nix expressions

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to access a flake from within a regular Nix expression on a system that has flakes enabled, you can use something like `(builtins.getFlake "/path/to/directory").packages.x86_64-linux.default`, where 'directory' is the directory that contains your `flake.nix`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Efficiently build multiple flake outputs

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To push *all* flake outputs automatically, checkout [devour-flake](https://github.com/srid/devour-flake#usage).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Build a package added in a PR

</div>

    nix build github:nixos/nixpkgs?ref=pull/<PR_NUMBER>/head#<PACKAGE>

<div lang="en" dir="ltr" class="mw-content-ltr">

this allows building a package that has not yet been added to nixpkgs.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

note that this will download a full source tarball of nixpkgs. if you already have a local clone, using that may be faster due to delta compression:

</div>

    git fetch upstream pull/<PR_NUMBER>/head && git checkout FETCH_HEAD && nix build .#PACKAGE

<div lang="en" dir="ltr" class="mw-content-ltr">

this allows building a package that has not yet been added to nixpkgs.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### How to add a file locally in git but not include it in commits

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

When a <a href="git" class="wikilink" title="git">git</a> folder exists, flake will only copy files added in git to maximize reproducibility (this way if you forgot to add a local file in your repo, you will directly get an error when you try to compile it). However, for development purpose you may want to create an alternative flake file, for instance containing configuration for your preferred editors as described [here](https://discourse.nixos.org/t/local-personal-development-tools-with-flakes/22714/8)… of course without committing this file since it contains only your own preferred tools. You can do so by doing something like that (say for a file called `extra/flake.nix`):

</div>

    git add --intent-to-add extra/flake.nix
    git update-index --skip-worktree --assume-unchanged extra/flake.nix

<div lang="en" dir="ltr" class="mw-content-ltr">

### Rapid iteration of a direct dependency

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

One common pain point with using Nix as a development environment is the need to completely rebuild dependencies and re-enter the dev shell every time they are updated. The `nix develop --redirect `<flake>` `<directory> command allows you to provide a mutable dependency to your shell as if it were built by Nix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Consider a situation where your executable, `consumexe`, depends on a library, `libdep`. You're trying to work on both at the same time, where changes to `libdep` are reflected in real time for `consumexe`. This workflow can be achieved like so:

</div>

``` bash
cd ~/libdep-src-checkout/
nix develop # Or `nix-shell` if applicable.
export prefix="./install" # configure nix to install it here
buildPhase   # build it like nix does
installPhase # install it like nix does
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Now that you've built the dependency, `consumexe` can take it as an input. **In another terminal**:

</div>

``` bash
cd ~/consumexe-src-checkout/
nix develop --redirect libdep ~/libdep-src-checkout/install
echo $buildInputs | tr " " "\n" | grep libdep
# Output should show ~/libdep-src-checkout/ so you know it worked
```

<div lang="en" dir="ltr" class="mw-content-ltr">

If Nix warns you that your redirected flake isn't actually used as an input to the evaluated flake, try using the `--inputs-from .` flag. If all worked well you should be able to `buildPhase && installPhase` when the dependency changes and rebuild your consumer with the new version *without* exiting the development shell.

</div>

<span id="See_also"></span>

## См. также

<div lang="en" dir="ltr" class="mw-content-ltr">

### Official sources

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Flakes](https://nix.dev/concepts/flakes) - nix.dev

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nix flake command reference manual](https://nixos.org/manual/nix/unstable/command-ref/new-cli/nix3-flake.html) - Many additional details about flakes, and their parts.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [spec describing flake inputs in more detail](https://github.com/NixOS/nix/blob/master/src/nix/flake.md)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [RFC 49](https://github.com/NixOS/rfcs/pull/49) (2019) - Original flakes specification

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Guides

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Flakes aren't real and can't hurt you](https://jade.fyi/blog/flakes-arent-real/) (Jade Lovelace, 2024)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book)(Ryan4yin, 2023) - 🛠️ ❤️ An unofficial NixOS & Flakes book for beginners.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nix Flakes: an Introduction](https://xeiaso.net/blog/nix-flakes-1-2022-02-21) (Xe Iaso, 2022)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Practical Nix Flakes](https://serokell.io/blog/practical-nix-flakes) (Alexander Bantyev, 2021) - Intro article on working with Nix and Flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nix Flakes, Part 1: An introduction and tutorial](https://www.tweag.io/blog/2020-05-25-flakes/) (Eelco Dolstra, 2020)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nix Flakes, Part 2: Evaluation caching](https://www.tweag.io/blog/2020-06-25-eval-cache/) (Eelco Dolstra, 2020)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nix Flakes, Part 3: Managing NixOS systems](https://www.tweag.io/blog/2020-07-31-nixos-flakes/) (Eelco Dolstra, 2020)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Nix flakes 101: Introduction to nix flakes](https://www.youtube.com/watch?v=QXUlhnhuRX4&list=PLgknCdxP89RcGPTjngfNR9WmBgvD_xW0l) (Jörg Thalheim, 2020) YouTube video

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Useful flake modules

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Flake_Utils" class="wikilink" title="flake-utils">flake-utils</a>: Library to avoid some boiler-code when writing flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Flake_Parts" class="wikilink" title="flake-parts">flake-parts</a>: Library to help write modular and organized flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Flake_Compat" class="wikilink" title="flake-compat">flake-compat</a>: A compatibility layer for flakes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [building Rust and Haskell flakes](https://github.com/nix-community/todomvc-nix)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:Software" class="wikilink" title="Software">Software</a> <a href="Category:Nix" class="wikilink" title="Nix">Nix</a> <a href="Category:Nix_Language" class="wikilink" title="Nix Language">Nix Language</a> <a href="Category:Flakes" class="wikilink" title="Flakes">Flakes</a>
