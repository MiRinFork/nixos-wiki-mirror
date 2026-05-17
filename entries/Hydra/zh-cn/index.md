<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Hydra/zh-cn -->

<languages />

Hydra 是一个用于持续集成测试和软件发布的工具，它使用一种纯函数式语言来描述构建作业及其依赖关系。持续集成是一种提高软件开发过程质量的简单技术。一个自动化系统会持续或定期地检出项目的源代码，进行构建、运行测试，并为开发人员生成报告。因此，可能意外提交到代码库中的各种错误都会被自动发现。

Hydra 官方服务器提供了预构建的二进制包，以加快 Nixpkgs 的更新速度：用户无需在自己的计算机上进行编译。

[Hydra 手册](https://nixos.org/hydra/manual/) 提供了 Hydra 功能与特性的概述，以及最新的安装指南。

<span id="Installation"></span>

## 安装

完整部署的启用过程同样非常简单：

``` nix
  services.hydra = {
    enable = true;
    hydraURL = "http://localhost:3000"; # externally visible URL
    notificationSender = "hydra@localhost"; # e-mail of Hydra service
    # a standalone Hydra will require you to unset the buildMachinesFiles list to avoid using a nonexistant /etc/nix/machines
    buildMachinesFiles = [];
    # you will probably also want this, otherwise *everything* will be built from scratch
    useSubstitutes = true;
  };
```

如果你没有修改 `services.hydra.dbi` 选项，该模块会自动启用 <a href="PostgreSQL" class="wikilink" title="postgresql">postgresql</a>。数据库结构会由 Hydra 服务自动创建；但请注意，部分状态数据会存储在数据库中，因此目前尚无法实现完全无状态的配置——请务必做好备份。

- 请参阅 nixos-option，或访问 [NixOS 选项页面](https://search.nixos.org/options?query=services.hydra) 以查看所有可用选项

<span id="Web_Configuration"></span>

### 网站配置

<div lang="en" dir="ltr" class="mw-content-ltr">

Hydra will provide the web interface [at localhost](http://localhost:3000/) port 3000. However you need to create a new admin user (as UNIX user `hydra`) before being able to perform any changes:

</div>

``` bash
# su - hydra
$ hydra-create-user alice --full-name 'Alice Q. User' \
    --email-address 'alice@example.org' --password-prompt --role admin
```

<span id="Virtual_machine"></span>

### 虚拟机

如果未显式进行其他配置，Hydra 将默认使用 localhost 作为构建机。默认情况下，用于在虚拟机中执行构建的系统特性（如 “kvm” 或 “nixos-test”）不会被启用。此类作业将会无限期地处于排队状态。可以通过如下方式启用这些选项：

``` nix
{
  nix.buildMachines = [
    { hostName = "localhost";
      protocol = null;
      system = "x86_64-linux";
      supportedFeatures = ["kvm" "nixos-test" "big-parallel" "benchmark"];
      maxJobs = 8;
    }
  ];
}
```

此选项会导致创建文件 /etc/nix/machines。若 Hydra 服务配置仍设置为 buildMachinesFiles = \[\]，则该文件将被忽略，因此请移除此选项，或将 `/etc/nix/machines` 添加到该配置中。

<span id="Flake_jobset"></span>

## Flake 作业集

按照如下方式配置作业集：

- Type: <a href="Flakes" class="wikilink" title="Flake">Flake</a>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Flake URI: an URI to a repo containing a Flake like git+https://git.myserver.net/user/repo.git

</div>

Flake 输出应包含属性 `hydraJobs`，其值为一个属性集；该属性集可包含嵌套结构，并可引用 derivation。

一个使 Hydra 构建所有软件包的示例 Flake 输出可能如下所示：

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };
  outputs = { self, nixpkgs, ... }: {
    packages.x86_64-linux = {
      ...
    };

    hydraJobs = {
      inherit (self)
        packages;
    };
  };
}
```

<span id="Restricted_Mode"></span>

### 受限模式

Hydra 会在 [受限模式](https://nixos.org/manual/nix/stable/command-ref/conf-file.html#conf-restrict-eval) 下对 flakes 进行求值。此模式会阻止访问 nix store 之外的文件，包括作为 flake 输入获取的文件。请更新你的 `nix.settings.allowed-uris`，加入你预期用于获取 flake 输入的 URI 前缀：

``` nix
nix.settings.allowed-uris = [
  "github:"
  "git+https://github.com/"
  "git+ssh://github.com/"
];
```

<span id="Build_a_single_Package_from_nixpkgs"></span>

## 从 nixpkgs 构建单个软件包

<div lang="en" dir="ltr" class="mw-content-ltr">

Right now it is not possible to build a single package from nixpkgs with just that input. You will need to provide a supplementary repository which defines what to build. For examples you can check the [hydra-example by makefu](https://github.com/makefu/hydra-example) and in the [Hydra Manual](https://nixos.org/hydra/manual/#idm140737315920320).

</div>

<span id="Imperative_Building"></span>

### 命令式构建

这些步骤是构建 `hello` 软件包所必需的。

1.  使用 `hydra-create-user` 创建用户后，登录 Hydra

<!-- -->

1.  创建新项目

- identifier: example-hello

<!-- -->

- display name: example-hello

1.  Actions -\> Create jobset

- identifier: hello

<!-- -->

- Nix expression: `release.nix` in `hydra-example` -\> 将对给定输入中的文件 release.nix 进行求值

<!-- -->

- check interval: 60

<!-- -->

- scheduling shares: 1

<!-- -->

- Inputs:

<div lang="en" dir="ltr" class="mw-content-ltr">

| Input Name | Type | Value | Note |
|----|----|----|----|
| nixpkgs | git checkout | <https://github.com/nixos/nixpkgs> nixos-21.11 | will check out branch nixos-21.11, will be made available to the nix expression via <nixpkgs>. |
| hydra-example | git checkout | <https://github.com/makefu/hydra-example> | hydra-example is used by the jobset as input, `release.nix` is in the root directory |

</div>

创建后，该 jobset 应会进入**求值阶段**（evaluation phase），此阶段将会获取各项输入。由于在继续之前需要先下载完整的 `nixpkgs` 仓库，因此这一阶段可能需要一些时间。求值完成后，结果应为一个将被构建的单一作业。

<span id="Declarative_Building"></span>

### 声明式构建

<div lang="en" dir="ltr" class="mw-content-ltr">

Since 2016, Hydra supports declarative creation of jobsets. Check out the [example repository and description by Shea Levy](https://github.com/shlevy/declarative-hydra-example).

</div>

<span id="Hydra_Internals"></span>

## Hydra 内部机制

<span id="Definitions"></span>

### 定义

本小节概述了 Hydra 专用定义及其配置方法。

<span id="Project"></span>

#### 项目

一组来自单一输入（例如一次 git 检出）的 Job 集群，是你首先需要创建的内容。每个 Job 都应能够独立于其他 Job 进行构建。在大多数情况下，一个项目对应于单一代码仓库，例如 `nixpkgs`。它类似于 Jenkins 中的项目定义。

<span id="Jobsets"></span>

#### 作业集

作业集是将要运行的一组作业（jobs）列表。通常，一个作业集会对应某个特定分支（如 master、staging、stable）。作业集由其输入（inputs）定义，并会在这些输入发生变化时触发。例如，当某个分支新增提交（commit）时。不同的作业集之间也可以存在依赖关系。

<span id="Job"></span>

#### 作业

作为作业集的一部分构建的闭包（例如单个软件包、ISO 镜像或 tarball）。

<span id="Release_Set"></span>

#### 发布集合

定义发行版中描述的所有作业。按照惯例，通常会使用名为`release.nix`的文件。关于其结构的详细说明，请参阅 [Hydra 手册中的 Build Recipes](https://nixos.org/hydra/manual/#idm140737315920320)。

<span id="Evaluation"></span>

#### 评估

将 nix 代码解释为一组 `.drv 文件` 的过程。这些文件是所有相关输出的构建配方。你可以通过运行 `nix show-derivation nixpkgs.hello` 来检查这些文件。

<span id="Build"></span>

#### 构建

作为发布集合的一部分而被触发的作业实例化过程。

<span id="Known_Issues"></span>

## 已知问题

<div lang="en" dir="ltr" class="mw-content-ltr">

- hydra-queue-runner sometimes gets stuck even with builds are in the queue, and the builds are not scheduled. The issue is being tracked [here](https://github.com/NixOS/hydra/issues/366). In the meantime, a workaround is to add a cron job that regularly restarts the hydra-queue-runner systemd service. Possible fix: [1](https://github.com/NixOS/hydra/commit/73ca325d1c0f7914640a63764c9a6d448fde5bd0)

</div>

- 如果你看到 `error: unexpected end-of-file`，它可能意味着多种问题，其中一些包括：

1.  你的 Hydra 服务器与构建器之间的 Nix 版本不匹配

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  It can also mean that `hydra-queue-runner` needs privileges on the build server. Reference: [2](https://github.com/NixOS/nix/issues/2789)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- The default timeout for git operations is 600 seconds [3](https://github.com/NixOS/hydra/issues/1181), which might cause fetches of large repositories like [nixos/nixpkgs](https://github.com/NixOS/nixpkgs) to fail: `` error fetching latest change from git repo at `https://github.com/nixos/nixpkgs': timeout ``. The timeout can be increased with the following configuration.nix snippet:

</div>

``` nix
{
  services.hydra.extraConfig = ''
    <git-input>
      timeout = 3600
    </git-input>
  '';
}
```

<span id="Hydra_for_NixOS_releases"></span>

## 用于 NixOS 发布的 Hydra

Hydra 用于管理 Nix 项目的官方发布版本。该项目的 Hydra 服务器：https://hydra.nixos.org/

一些适用于 Nix 项目的 Hydra 跟踪器：

- [Nixpkgs](https://hydra.nixos.org/project/nixpkgs)

<!-- -->

- [NixOS](https://hydra.nixos.org/project/nixos)

<span id="Resources"></span>

## 资源

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Video: Setting up a Hydra Build Farm by Peter Simons (2016)](https://www.youtube.com/watch?v=RXV0Y5Bn-QQ)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Hydra Caveats by Joepie91](https://gist.github.com/joepie91/c26f01a787af87a96f967219234a8723)

</div>

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Hydra" class="wikilink" title="Category:Hydra">Category:Hydra</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
