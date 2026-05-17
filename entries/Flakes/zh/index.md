<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flakes/zh -->

<languages />

**Nix flakes** 是 <a href="Nix" class="wikilink" title="Nix">Nix</a> 2.4 版本中首次引入的一项[实验性功能](https://nix.dev/manual/nix/stable/contributing/experimental-features)，旨在解决 Nix 生态系统许多领域的改进问题：它们为 Nix 项目提供了一个统一结构、允许固定每个依赖项的特定版本并通过锁文件共享这些依赖项，同时总体上使编写可复现的 Nix 表达式变得更加方便。

Flake 是一个直接包含 `flake.nix` 文件的目录，该文件内容遵循一种特定结构。Flakes 引入了一种类似 URL 的语法 来指定远程资源。为了简化这种 URL 语法，Flakes 使用符号标识符注册表，这允许通过类似 `github:NixOS/nixpkgs` 的语法直接指定资源。

Flakes 还允许锁定引用和版本，然后通过 inputs 以可编程方式进行查询和更新。此外，一个实验性的 CLI 实用程序接受 flake 引用作为参数，该引用指向用于构建、运行和部署软件包的表达式。

<span id="Flake_file_structure"></span>

## Flake 文件结构

一个最小化的 flake 文件包含该 flake 的描述（description），一组输入依赖项（inputs）和一个输出（outputs）。您可以随时使用 `nix flake init` 命令来生成一个非常基础的 flake 文件。这将在当前目录下创建一个名为 `flake.nix` 的文件，其内容类似于：

在上述示例中，您可以看到对该 flake 的**描述**、指定为某 Github 仓库特定分支的**输入**（此为 `nixos/nixpkgs` 仓库的 `nixos-unstable` 分支）以及一个使用该输入的**输出**。该输出简单地指定了该 flake 包含一个用于 x86_64 架构名为 `hello` 的包。即使您的 flake 输出不使用其输入（尽管这在实践中极不可能），其输出仍需要是一个 Nix 函数。

<span id="Nix_configuration"></span>

### Nix 配置

为了推导 flake，您可以覆盖 `nix.conf` 文件中设置的全局 Nix 配置。例如，这可用于设置特定项目的二进制缓存源，同时保持全局配置不变。Flake 文件中可包含一个 nixConfig 属性，并在其中设置相关配置。例如，启用 nix-community 二进制缓存可以通过以下方式实现：

<span id="Setup"></span>

## 设置

<span id="Enabling_flakes_temporarily"></span>

### 临时启用 Flakes

当使用任意 <a href="Nix_command" class="wikilink" title="nix 命令"><code>nix</code> 命令</a>时，添加如下命令行参数：

``` shell
 --experimental-features 'nix-command flakes'
```

<span id="Enabling_flakes_permanently"></span>

### 永久启用 Flakes

#### NixOS

添加如下内容至 <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration_system_configuration" class="wikilink" title="NixOS 配置">NixOS 配置</a>:

``` nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

#### Home Manager

添加如下内容至您的 <a href="Home_Manager" class="wikilink" title="home manager">home manager</a> 配置:

``` nix
  nix.settings.experimental-features = [ "nix-command" "flakes" ];
```

<span id="Nix_standalone"></span>

#### Nix 独立程序

添加如下内容至 `~/.config/nix/nix.conf` 或 `/etc/nix/nix.conf`:

``` text
experimental-features = nix-command flakes
```

<span id="Usage"></span>

## 用法

<span id="The_nix_flakes_command"></span>

### Nix Flakes 命令

的子命令在 中被描述。

此 flake 生成一个单 Flake 输出 `packages`。其中，`x86_64-linux` 是系统特定的属性集。其中包含两个软件包的 <a href="derivations" class="wikilink" title="Derivations（派生/定义）">Derivations（派生/定义）</a>：`default` 和 `hello`。您可以使用 给出某 flake 的输出，如下所示：

``` console
$ nix flake show
└───packages
    └───x86_64-linux
        ├───default: package 'hello-2.12.2'
        └───hello: package 'hello-2.12.2'
```

<span id="Development_shells"></span>

#### 开发环境 Shell

`devShell` 是定义在 flake 中由 Nix 提供的<a href="Development_environment_with_nix-shell#nix_develop" class="wikilink" title="开发环境">开发环境</a>。它允许您声明一个可复用的 Shell 环境，其中将包含开发特定项目所需的工具、库和环境变量。这相当于在 flake 中定义一个 `nix-shell`。

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

进入开发环境 Shell：

``` console
$ nix develop
```

<span id="Build_specific_attributes_in_a_flake_repository"></span>

#### 在 flake 仓库中构建特定属性

运行 `nix build` 将在 `legacyPackages` 和 `packages` 输出属性中查找相应的 <a href="derivations" class="wikilink" title="derivation">derivation</a>，然后基于您的系统架构构建默认输出项。如果您想在 flake 仓库中指定构建属性，可以运行 `nix build .#`<attr>。在上面的示例中，如果您想构建 `packages.x86_64-linux.hello` 属性，请运行：

``` console
$ nix build .#hello
```

同样，您可以给 `run` 命令：`nix run .#hello` 和 `develop`命令：`nix develop .#hello`指定属性。

<span id="Flake_schema"></span>

## Flake 规范

`flake.nix` 文件是一个具有特殊限制的 Nix 文件（稍后会详细介绍）。

它有 4 个顶级属性：

- `description`：描述此 flake 的字符串。

<!-- -->

- `inputs`：一个包含此 flake 所有依赖项的属性集。相关规范见下述内容。

<!-- -->

- `outputs`： 一个接收参数的函数，其参数为所有所需输入的属性集，并输出另一个属性集，其规范如下所述。

<!-- -->

- `nixConfig`：一个属性集，包含了 [赋予 nix.conf 的值](https://nixos.org/manual/nix/stable/command-ref/conf-file.html)。这可以通过添加特定于 flake 的配置（例如 <a href="Binary_Cache" class="wikilink" title="二进制缓存源">二进制缓存源</a>）来扩展用户 nix 操作的正常行为。

<span id="Input_schema"></span>

### 输入规范

[Nix flake inputs 手册](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-inputs).

[Nix flake 引用手册](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-flake.html#flake-references).

`inputs` 属性定义了 flake 的依赖项。例如，为了让系统能够正确构建，nixpkgs 必须被定义为系统 flake 的依赖项。

<a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> 可使用以下代码进行定义：

`inputs.nixpkgs.url = "github:NixOS/nixpkgs/`<branch name>`";`

Nixpkgs 也可以指向一个由 NixOS 组织缓存的 URL：

`inputs.nixpkgs.url = "https://nixos.org/channels/nixpkgs-unstable/nixexprs.tar.xz";`

在此示例中，输入将指向 `nixpkgs-unstable` 频道（channel）。

对于任何包含 flake.nix 文件的仓库，其所属网站也必须被定义。Nix 知道 nixpkgs 仓库的位置，因此没有必要声明它在 GitHub 上。

例如，将 <a href="Hyprland" class="wikilink" title="Hyprland">Hyprland</a> 添加为输入看起来像这样：

`inputs.hyprland.url = "github:hyprwm/Hyprland";`

如果您想让 Hyprland 的 nixpkgs 依赖跟随 nixpkgs 输入以避免出现多个版本的 nixpkgs，可以使用以下代码来完成：

`inputs.hyprland.inputs.nixpkgs.follows = "nixpkgs";`

使用大括号 (`{}`)，我们可以缩短这些内容并将其放在一个表中。代码如下所示：

``` nix
inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/<branch name>";
  hyprland = {
    url = "github:hyprwm/Hyprland";
    inputs.nixpkgs.follows = "nixpkgs";
  };
};
```

默认情况下，包 `src` 中的 Git 子模块不会被复制到 Nix Store，这可能会导致构建失败。Git 仓库中的 Flakes 可以声明它们需要启用 Git 子模块。从 Nix 版本 [2.27](https://discourse.nixos.org/t/nix-2-27-0-released/62003) 开始，您可以通过以下方式启用子模块：

``` nix
  inputs.self.submodules = true;
```

<span id="Output_schema"></span>

### 输出规范

[Nix flake check 手册页](https://nix.dev/manual/nix/2.33/command-ref/new-cli/nix3-flake-check.html#evaluation-checks)中对输出规范进行了描述。

一旦 Inputs 被解析，它们就会与 `self` 一起传递给函数 `outputs`，`self` 是此 flake 在 Store 中的目录。`outputs` 根据以下规范返回 flake 的输出。

其中：

- <system> 为类似“x86_64-linux”、“aarch64-linux”、“i686-linux”、“x86_64-darwin”的值

<!-- -->

- <name> 是一个属性名称，如“hello”。

<!-- -->

- <flake> 是一个 flake 名称， 如“nixpkgs”。

<!-- -->

- <store-path> 是 `/nix/store..` 的路径。

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

您还可以定义其他任意属性，但以上这些是 Nix 已知的输出。

<span id="Core_usage_patterns"></span>

## 核心使用模式

<span id="Making_your_evaluations_pure"></span>

### 使您的推导更纯

Nix Flakes 在纯粹推导模式下进行，这意味着对于外部环境的访问被限制以确保可复现性。要保持使用 Flakes 时的纯粹性（Purity），请考虑以下方式：

- 和 需要传入 `sha256` 参数才会被视为纯函数。

<!-- -->

- `builtins.currentSystem` 函数是非确定且不纯的，因为它返回的是执行推导的主机系统。通常可以通过将系统类型（例如 x86_64-linux）显式传递给需要它的 Derivations 来避免使用。

<!-- -->

- `builtins.getEnv` 函数也是不纯的。请避免从环境变量中读取数据，同样，也不要引用 flake 目录之外的文件。

<span id="Defining_a_flake_for_multiple_architectures"></span>

### 为多架构定义 Flake

Flakes 强制要求您为每种支持的架构指定一个程序。以下示例展示了如何编写一个针对多种架构的 flake。

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

您还可以使用如 <a href="Flake_Utils" class="wikilink" title="flake-utils">flake-utils</a> 或 <a href="Flake_Parts" class="wikilink" title="flake-parts">flake-parts</a> 的第三方项目来编写，它们会提供代码来避免此类样板代码。为了避免多次重新定义程序，请参阅 <a href="Flake_Utils#Defining_a_flake_for_multiple_architectures" class="wikilink" title="Flake Utils#Defining a flake for multiple architectures">Flake Utils#Defining a flake for multiple architectures</a>

<span id="Using_overlays"></span>

### 使用 overlays

要将 <a href="Overlays" class="wikilink" title="Overlays">Overlays</a> 与 Flakes 一起使用，请参阅 <a href="Overlays#In_a_Nix_flake" class="wikilink" title="Overlays#In a Nix flake">Overlays#In a Nix flake</a> 页面。

<span id="Enable_unfree_software"></span>

### 启用非自由软件

为了在 flake 项目中允许使用 <a href="Unfree_software" class="wikilink" title="非自由软件">非自由软件</a>，您需要在导入 Nixpkgs 时通过设置 `config.allowUnfree = true;` 来明确允许它。

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

<span id="NixOS_configuration_with_flakes"></span>

## 启用 Flake 的 NixOS 配置

可使用 Flakes 管理 <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 系统配置，以获得可复现、声明式输入和简化更新的优点。

关于详情与示例，请参阅 <a href="NixOS_system_configuration#Defining_NixOS_as_a_flake" class="wikilink" title="NixOS system configuration#Defining NixOS as a flake">NixOS system configuration#Defining NixOS as a flake</a>。

<span id="Development_tricks"></span>

## 开发技巧

<span id="Automatically_switch_nix_shells_with_direnv"></span>

### 使用 direnv 自动切换 Nix shell

在项目目录之间导航时，使用 <a href="Direnv" class="wikilink" title="Direnv">Direnv</a> 可以自动激活不同的 Nix shell。Nix 与 Direnv 的额外集成参阅 [nix-direnv](https://github.com/nix-community/nix-direnv)。

<span id="Pushing_Flakes_to_Cachix"></span>

### 推送 Flakes 至 Cachix

<https://docs.cachix.org/pushing#flakes>

<span id="Flake_support_in_projects_without_flakes"></span>

### 非 Flake 项目中的 Flake 支持

[flake-compat](https://github.com/edolstra/flake-compat) 库提供了一个兼容层，允许使用传统 `default.nix` 和 `shell.nix` 文件的项目与 Flakes 兼容。更多详情和使用示例，请参阅 <a href="Flake_Compat" class="wikilink" title="Flake Compat">Flake Compat</a> 页面。

另一个允许在非 flake 项目中使用 Flakes 的项目是 [flake-inputs](https://github.com/fricklerhandwerk/flake-inputs)。

<span id="Accessing_flakes_from_Nix_expressions"></span>

### 从 Nix 表达式访问 Flakes

如果您想在启用了 Flakes 功能的系统上从常规 Nix 表达式中访问 flake，可以使用类似 `(builtins.getFlake "/path/to/directory").packages.x86_64-linux.default` 的代码，其中“directory”是包含 `flake.nix` 的目录。

<span id="Efficiently_build_multiple_flake_outputs"></span>

### 高效构建多个 Flake 输出

要自动推送*所有* flake 输出，请查看 [devour-flake](https://github.com/srid/devour-flake#usage)。

<span id="Build_a_package_added_in_a_PR"></span>

### 构建一个添加至 PR 中的包

    nix build github:nixos/nixpkgs?ref=pull/<PR_NUMBER>/head#<PACKAGE>

这允许构建尚未添加到 nixpkgs 的包。

请注意，这将下载 nixpkgs 的完整 tarball 压缩档。如果您已有本地克隆，由于增量压缩机制，使用它可能会更快：

    git fetch upstream pull/<PR_NUMBER>/head && git checkout FETCH_HEAD && nix build .#PACKAGE

这允许构建尚未添加到 nixpkgs 的包。

<span id="How_to_add_a_file_locally_in_git_but_not_include_it_in_commits"></span>

### 如何在 git 中添加一个本地文件但不将其包含在提交中

当 <a href="git" class="wikilink" title="git">git</a> 文件夹存在时，flake 将仅复制在 git 中添加的文件，以最大限度地提高可复现性（因此，如果您忘记在代码库中添加本地文件，则在尝试编译时会直接出错）。但是，有时出于开发目的您可能需要创建一个备用的 flake 文件，例如包含您首选编辑器的配置，如[此处所述](https://discourse.nixos.org/t/local-personal-development-tools-with-flakes/22714/8)，这种情况下当然无需提交此文件，因为它只包含您自己首选的工具。在上述情况下，您可以执行以下操作（例如，创建了一个名为 `extra/flake.nix` 的文件）：

    git add --intent-to-add extra/flake.nix
    git update-index --skip-worktree --assume-unchanged extra/flake.nix

<span id="Rapid_iteration_of_a_direct_dependency"></span>

### 直接依赖项的快速迭代

使用 Nix 作为开发环境的一个常见痛点是，每次更新依赖项时都需要完全重构并重新进入开发 shell。`nix develop --redirect `<flake>` `<directory> 命令允许您向 shell 提供可变的依赖项，就像它是由 Nix 构建的一样。

考虑这样一个场景：您的可执行程序 `consumexe` 依赖于一个库 `libdep`。你希望同时开发这两个项目，并且对 `libdep` 的修改能够实时反映到 `consumexe` 中。这种工作流程可以通过以下方式实现：

``` bash
cd ~/libdep-src-checkout/
nix develop # Or `nix-shell` if applicable.
export prefix="./install" # configure nix to install it here
buildPhase   # build it like nix does
installPhase # install it like nix does
```

现在您已经构建了依赖项，`consumexe` 可以将其作为输入。**在另一个终端中**：

``` bash
cd ~/consumexe-src-checkout/
nix develop --redirect libdep ~/libdep-src-checkout/install
echo $buildInputs | tr " " "\n" | grep libdep
# Output should show ~/libdep-src-checkout/ so you know it worked
```

如果 Nix 警告您重定向的 flake 实际上并未用作已推导 flake 的输入，请尝试使用 `--inputs-from .` 标志。如果一切顺利，您应该能够在依赖项更改时执行 `buildPhase && installPhase` 操作，并使用新版本依赖重建您的程序，而*无需*退出开发 shell。

<span id="See_also"></span>

### 另见

<span id="Official_sources"></span>

### 官方来源

- [Flakes](https://nix.dev/concepts/flakes) - nix.dev

<!-- -->

- [Nix flake 命令参考手册](https://nixos.org/manual/nix/unstable/command-ref/new-cli/nix3-flake.html) - 关于 Flakes 及其各部分的更多附加细节。

<!-- -->

- [更详细地描述 Flakes Inputs 的规范](https://github.com/NixOS/nix/blob/master/src/nix/flake.md)

<!-- -->

- [RFC 49](https://github.com/NixOS/rfcs/pull/49) (2019) - 原始 Flakes 规范

<span id="Guides"></span>

### 指南

- [Flakes 并非幻象，亦非洪水猛兽](https://jade.fyi/blog/flakes-arent-real/) (Jade Lovelace, 2024)

<!-- -->

- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book)(Ryan4yin, 2023) - 🛠️ ❤️ 一本非官方的 NixOS & Flakes 新手入门书籍。

<!-- -->

- [Nix Flakes：一个简要介绍](https://xeiaso.net/blog/nix-flakes-1-2022-02-21) (Xe Iaso, 2022)

<!-- -->

- [Practical Nix Flakes](https://serokell.io/blog/practical-nix-flakes) (Alexander Bantyev, 2021) - 关于使用 Nix 和 Flakes 的介绍文章。

<!-- -->

- [Nix Flakes, 第一节：介绍和教程](https://www.tweag.io/blog/2020-05-25-flakes/) (Eelco Dolstra, 2020)

<!-- -->

- [Nix Flakes, 第二节：推导缓存](https://www.tweag.io/blog/2020-06-25-eval-cache/) (Eelco Dolstra, 2020)

<!-- -->

- [Nix Flakes, 第三节：管理 NixOS 系统](https://www.tweag.io/blog/2020-07-31-nixos-flakes/) (Eelco Dolstra, 2020)

<!-- -->

- [Nix flakes 101: Introduction to nix flakes](https://www.youtube.com/watch?v=QXUlhnhuRX4&list=PLgknCdxP89RcGPTjngfNR9WmBgvD_xW0l) (Jörg Thalheim, 2020) YouTube 视频

<span id="Useful_flake_modules"></span>

### Flake 实用模块

- <a href="Flake_Utils" class="wikilink" title="flake-utils">flake-utils</a>：一个用于简化 Flakes 编写、避免样板代码的库

<!-- -->

- <a href="Flake_Parts" class="wikilink" title="flake-parts">flake-parts</a>：帮助编写模块化、结构化 Flakes 的库

<!-- -->

- <a href="Flake_Compat" class="wikilink" title="flake-compat">flake-compat</a>：Flakes 兼容层

<!-- -->

- [构建 Rust 和 Haskell 的 flakes](https://github.com/nix-community/todomvc-nix)

<a href="Category:Software" class="wikilink" title="软件">软件</a> <a href="Category:Nix" class="wikilink" title="Nix">Nix</a> <a href="Category:Nix_Language" class="wikilink" title="Nix 语言">Nix 语言</a> <a href="Category:Flakes" class="wikilink" title="Flakes">Flakes</a>
