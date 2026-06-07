<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS/zh -->

<languages/>

[NixOS](https://nixos.org/) 是一个基于 <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> 包管理器与构建系统的 Linux 发行版。它支持 <a href="Wikipedia:Declarative_programming" class="wikilink" title="声明式">声明式</a> 的系统级 <a href="Wikipedia:Configuration_management" class="wikilink" title="配置管理">配置管理</a> 以及 <a href="Wikipedia:Atomicity_(database_systems)" class="wikilink" title="原子化">原子化</a> 升级和回滚，同时它仍支持 <a href="Wikipedia:Imperative_programming" class="wikilink" title="命令式">命令式</a> 的包管理和用户管理。在 NixOS 中，发行版的所有组件 — 包括 <a href="Wikipedia:Linux_kernel" class="wikilink" title="系统内核">系统内核</a>、已安装的 <a href="Wikipedia:Package_manager" class="wikilink" title="软件包">软件包</a> 和系统配置文件 — 均由 <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> 从被称为 <a href="Special:MyLanguage/Nix_(language)" class="wikilink" title="Nix 表达式">Nix 表达式</a> 的 <a href="Wikipedia:Pure_function" class="wikilink" title="纯函数">纯函数</a> 中构建。

由于 Nix 使用了 <a href="Wikipedia:Executable" class="wikilink" title="二进制">二进制</a> 缓存机制，这便为面向二进制分发（如 Debian）和面向 <a href="Wikipedia:Source_code" class="wikilink" title="源码">源码</a> 分发（如 Gentoo）的方法提供了一种独特的折中方案。预编译的二进制程序被视作标准组件，在其无法获取时，自助编译的软件包与模块将被自动构建。

NixOS 稳定版本每年发布两次（大约在五月底和十一月底）。NixOS 由 [Eelco Dolstra](https://edolstra.github.io/) 和 <a href="Wikipedia:Armijn_Hemel" class="wikilink" title=" Armijn Hemel"> Armijn Hemel</a> 创建，并于 2003 年首次发布。目前由 <a href="Special:MyLanguage/Nix_Community#NixOS_Foundation" class="wikilink" title="NixOS 基金会">NixOS 基金会</a> 管理下的社区开发与维护。

<span id="Installation"></span>

## 安装

完整的安装指南请参阅 [NixOS 手册的 Installation 章节](https://nixos.org/nixos/manual/index.html#ch-installation)。此维基还包含替代或补充指南，例如 <a href="Special:MyLanguage/NixOS_as_a_desktop" class="wikilink" title="桌面设备上的 NixOS">桌面设备上的 NixOS</a>。

大多数用户通过 [任一 ISO 镜像](https://nixos.org/download/#nixos-iso) 安装 NixOS。每个支持架构均有 “graphical”（图形化安装）和 “minimal”（最小化安装）两种 ISO 变体；图形化镜像适用于计划安装桌面环境的用户，而最小化镜像适用于计划将 NixOS 充当服务器或期望更小 ISO 镜像文件的用户。ISO 镜像为混合镜像，可以刻录到光盘介质或原封不动地复制到 USB 驱动器上并直接启动。请参阅安装指南以了解详情。

除了 ISO 镜像，[下载页面](https://nixos.org/download/#nixos-iso) 还提供了多种安装 NixOS 的替代方法。这些方法包括：

- OVA 格式的虚拟机（兼容 VirtualBox）；
- Amazon EC2 AMIs;

此外，许多现有的 Linux 安装可以通过 [nixos-infect](https://github.com/elitak/nixos-infect) 或 [nixos-in-place](https://github.com/jeaye/nixos-in-place) 转换为 NixOS 安装；这对于在不原生支持 NixOS 的主机提供商平台安装 NixOS 十分有用。

<span id="System_architectures"></span>

### 系统架构

NixOS 对大多数 x86_64 设备和通用 ARM64 设备提供了开箱即用的支持。

<span id="32-bit_x86_architectures"></span>

#### 32 位 x86 架构

对于 32 位 x86 架构（即 `i686`）的支持正在减少。大多数包仍然可以编译和运行，但它们的缓存可用性显著降低[^1]。32 位 x86 架构不再提供预构建的 ISO 镜像文件，但其仍可手动构建。

<span id="64-bit_x86_architectures"></span>

#### 64 位 x86 架构

大多数 `x86_64` 设备都能顺利运行 NixOS。

<span id="32-bit_ARM_architectures"></span>

#### 32 位 ARM 架构

NixOS 不官方支持 ARM32 设备（例如 `armv6` 和 `armv7l`），不过对于其中部分设备，可能存在社区支持。

<span id="64-bit_ARM_architectures"></span>

#### 64 位 ARM 架构

只要设备支持通用 systemd 引导过程，NixOS 便可开箱即用。但是，使用专有引导加载程序的特定设备可能存在运行问题。

<span id="MIPS_architectures"></span>

#### MIPS 架构

NixOS 对于 MIPS 架构的支持有限， Nixpkgs 中可能存在部分对于此架构的支持。但并未有官方支持。

<span id="RISC-V_architectures"></span>

#### RISC-V 架构

NixOS 不为 RISC-V 设备提供官方支持。不过，一些设备可能会受到社区支持。

<span id="Usage"></span>

## 用法

<span id="declarative-configuration"></span>

<span id="Declarative_Configuration"></span>

### 声明式配置

NixOS 的一个核心特征便是其声明式配置模型，其中整个系统状态 — 包括已安装的软件包、系统服务和设置 — 均在配置文件中描述。主配置文件通常位于 `/etc/nixos/configuration.nix`。

配置的更改通过使用 `nixos-rebuild switch` 原子化应用，从而确保可复现性并能回滚到之前状态。大多数用户使用版本控制系统来追踪配置文件，以实现一致且可移植的系统设置。在其他系统中，这些缺陷通常是事后才通过 Puppet、Ansible 或 Chef 等配置管理解决方案来弥补，甚至完全无法弥补。这些工具将系统配置与预期的状态描述进行协调。然而，其并未集成到操作系统的设计中，而只是简单地叠加在操作系统之上。因此，当操作系统配置的某个方面未在预期状态描述中指定时，其配置仍然可能会有所不同。

与传统发行版通常将系统配置散布于各处需手动编辑的文件中不同，NixOS 将配置管理直接集成到操作系统中。这种方式消除了配置漂移，使得 NixOS 十分适合自动化、可复现的部署。

关于 NixOS 配置的更多细节和示例，请参阅 <a href="Special:MyLanguage/NixOS_system_configuration" class="wikilink" title="NixOS 系统配置">NixOS 系统配置</a>。

<span id="Imperative_Operations"></span>

### 命令式操作

尽管 NixOS 通常尽可能以声明式方式进行配置，但在某些情况下，命令式操作仍然是必需的；这包括了用户环境管理和频道管理。

<span id="User_Environments"></span>

#### 用户环境

除了声明式系统配置之外，NixOS 用户还可以使用 Nix 的命令式 nix-env 指令在用户层面安装软件包，而无需更改系统状态。有关更多信息，请参阅 <a href="Special:MyLanguage/Nix#User_Environments" class="wikilink" title="Nix 文档的用户环境部分">Nix 文档的用户环境部分</a>。

<span id="Channels"></span>

#### 频道

在 <a href="Special:MyLanguage/Nix_ecosystem" class="wikilink" title="Nix 生态系统">Nix 生态系统</a> 中，<a href="Special:MyLanguage/Channel_branches" class="wikilink" title="频道（channels）">频道（channels）</a>是一种用于分发 <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nix 软件包">Nix 软件包</a> 和 <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> 模块定义的机制。频道代表一组经过精心维护、版本控制的软件包定义和系统配置，通常对应于一个特定版本或最新的可用开发状态。

在使用频道时，您的系统或 <a href="Special:MyLanguage/User_Environment" class="wikilink" title="用户环境">用户环境</a> 会从一个 URL 拉取软件包定义和选项，该 URL 指向 Nix 软件包集合（Nixpkgs）及相关 NixOS 模块的特定快照。

关于如何使用和配置 Nix 频道的更多信息，请参阅 <a href="Special:MyLanguage/Channel_branches" class="wikilink" title="频道分支">频道分支</a>。

<span id="Internals"></span>

## 内部机制

<span id="Comparison_with_traditional_Linux_Distributions"></span>

### 与传统 Linux 发行版比较

*Main Article: <a href="Special:MyLanguage/Nix_vs._Linux_Standard_Base" class="wikilink" title="比较Nix和Linux标准基础">比较Nix和Linux标准基础</a>*

NixOS 与其他 Linux 发行版的主要区别在于，NixOS 不遵循 <a href="Wikipedia:Linux_Standard_Base" class="wikilink" title="Linux 标准规范（LSB）">Linux 标准规范（LSB）</a> 的文件系统结构。在遵循 LSB 的系统中，软件通常存储在 `/{,usr}/{bin,lib,share}` 目录下，而配置文件通常存储在 `/etc`。如果程序的可执行文件被放置在 LSB 的某个 `/bin` 目录下，那么它就可以在用户环境中被访问。当一个程序引用动态链接库时，它将在 LSB 目录（`/lib`、`/usr/lib`）中搜索所需的库。

然而，在 NixOS 中，`/lib` 和 `/usr/lib` 目录并不存在。相反，所有系统库文件、可执行文件、内核、固件和配置文件都存放在 <a href="Special:MyLanguage/Nix_(package_manager)#Nix_store" class="wikilink" title="Nix store">Nix store</a> 中。`/nix/store` 下的文件和目录均由构建数据的描述信息经哈希后命名。所有位于 Nix Store 的文件与目录均不可变。 `/bin` 和 `/usr/bin` 几乎不存在：它们分别只包含 `/bin/sh` 和 `/usr/bin/env`，以提供与使用 shebang 行的现有脚本的最低兼容性。用户级环境通过大量指向所需软件包和辅助文件的符号链接来实现。 这些环境被称作 <a href="Special:MyLanguage/Nix#Profiles" class="wikilink" title="Profiles">Profiles</a>，被存储于 `/nix/var/nix/profiles`，每个用户拥有其独有的 Profiles。 通过这种结构化的系统组织方式，NixOS 获得了优于传统 Linux 发行版的核心优势，例如原子化操作和回滚支持。

<span id="Usage_of_the_Nix_store"></span>

### Nix Store 的使用

新手的大多数困惑源于配置文件和所有已安装软件包均存储于只读的 `/nix/store` 目录树下这一事实。这实际上使得手动编辑系统配置变得不可能；所有配置更改必须通过编辑 `/etc/nixos/configuration.nix` 文件并运行 `nixos-rebuild switch` 后才可生效。NixOS 提供了 <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="模块系统">模块系统</a> 以供编辑所有需要的配置。用户应在期望通过低层级的 NixOS 功能（如 activation scripts）手动添加文件或配置之前，首先使用 [配置选项搜索工具](https://search.nixos.org/options) 检查所需选项是否已存在。

系统的纯粹性（purity）使得系统配置的集中存储成为可能，而无需编辑多个文件。此配置方式可以根据需要进行分发或版本控制。它还提供了确定性：如果您提供相同的输入、相同版本的 Nixpkgs 和相同的 `/etc/nixos/configuration.nix` 文件，您将得到完全相同的系统状态。

<span id="Modules"></span>

### 模块

定义于 <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> 的 <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS 模块系统">NixOS 模块系统</a> 提供了定制操作系统配置所需的方法。通常被用于启用并定制如 Nginx 这样的服务、启用固件以及定制内核。

所有模块配置通常都是通过向 `/etc/nixos/configuration.nix` 文件添加选项来完成。维基上的大多数示例都展示了如何使用此文件来配置操作系统。

NixOS 的模块系统实现了一个类型系统，以允许对选项设置进行类型检查。它还支持将多处定义的选项进行自动合并。这使得您可以将配置分散到多个文件中，而您在这些文件中设置的选项最终都会被合并在一起：

请参阅 [NixOS 手册的模块部分](https://nixos.org/manual/nixos/stable/index.html#sec-writing-modules) 以获取更多详细信息。

<span id="Generations"></span>

### 世代

每当使用 `nixos-rebuild switch` 命令重构系统状态时，都将创建一个新的世代（generation）。您可以随时回滚到上一个世代，这在配置更改（或系统更新）被证明造成破坏时非常有用。

您可以通过以下命令回滚：

``` console
$ nix-env --rollback               # roll back a user environment
$ nixos-rebuild switch --rollback  # roll back a system environment
```

NixOS 还会在引导加载程序菜单中放置前几代系统的条目，因此，作为最后的手段，您可以通过重启来恢复到之前的配置。将当前启动的版本设置为默认运行：

``` console
$ /run/current-system/bin/switch-to-configuration boot
```

由于 NixOS 会保留前几代系统状态以供回滚，因此更新后不会立即从系统中删除旧软件包版本。您可以手动删除旧版本：

``` console
$ # delete generations older than 30 days
$ nix-collect-garbage --delete-older-than 30d

$ # delete ALL previous generations - you can no longer rollback after running this
$ nix-collect-garbage -d                       
```

列出世代：

``` console
$ # as root
$ nix-env --list-generations --profile /nix/var/nix/profiles/system
```

切换世代：

``` console
$ # as root switch to generation 204
$ nix-env --profile /nix/var/nix/profiles/system --switch-generation 204
```

删除损坏的世代：

``` console
$ # as root delete broken generations 205 and 206 
$ nix-env --profile /nix/var/nix/profiles/system --delete-generations 205 206
```

您可以通过设置 `/etc/nixos/configuration.nix` 中的 [nix.gc](https://search.nixos.org/options?query=nix.gc) 选项来配置自动垃圾回收。这是推荐操作，因为它可以降低 Nix Store 的大小。

<span id="See_also"></span>

## 另见

- <a href="Special:MyLanguage/NixOS_modules" class="wikilink" title="NixOS 模块">NixOS 模块</a> - 一个用于模块化 <a href="Special:MyLanguage/Overview_of_the_Nix_Expression_Language#Expressions" class="wikilink" title="Nix 表达式">Nix 表达式</a>的库，为 <a href="#declarative-configuration" class="wikilink" title="NixOS 的声明式配置">NixOS 的声明式配置</a> 提供支持。
- <a href="Special:MyLanguage/NixOS_VM_tests" class="wikilink" title="NixOS VM 测试">NixOS VM 测试</a> - 一个基于 <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>、<a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a>、QEMU 和 Perl 用于创建可复现基础设施测试的库。
- [NixOS & Flakes Book](https://github.com/ryan4yin/nixos-and-flakes-book) (Ryan4yin, 2023) - 🛠️ ❤️ 一本非官方的 NixOS & Flakes 新手入门书籍。

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>

[^1]: <https://discourse.nixos.org/t/limited-cache-availability-for-i686-32-bits-x86-architecture/37626>
