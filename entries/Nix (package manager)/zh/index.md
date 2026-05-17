<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/zh -->

<languages/> Nix 是一个软件包管理器和构建系统，它解析由 <a href="Nix_Expression_Language" class="wikilink" title="Nix 表达式语言">Nix 表达式语言</a> (惰性求值的纯函数式语言) 指定的可复现的构建指令。Nix 表达式是纯函数[^1]，它接受依赖作为参数，并生成一个 *<a href="Derivations" class="wikilink" title="derivation">derivation</a>*，用于指定该软件包的可复现的构建环境。Nix 把构建的结果存储在由完整依赖树的哈希值指定的唯一地址中，从而创建了一个不可变的包存储 (即 <a href="#Nix_store" class="wikilink" title="nix store">nix store</a>)，使得原子升级、回滚、以及同时安装同一软件包的不同版本成为可能，从根本上消除了[依赖地狱](https://en.wikipedia.org/wiki/Dependency_hell)。

<span id="Usage"></span>

## 用法

### 安装

在 <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 上，Nix 已经自动安装好了。

如果你想在其他 Linux 发行版或在 macOS 上使用 Nix, 你可以按照 [Nix 手册的安装章节](https://nixos.org/manual/nix/stable/installation/installation)来安装 Nix。

<span id="Nix_commands"></span>

### Nix 命令

<a href="Nix_(command_line_utilities)" class="wikilink" title="Nix 命令">Nix 命令</a>在 [Nix 参考手册](https://nixos.org/manual/nix/stable/command-ref/command-ref)中有详细记录：主要命令，工具命令和实验性命令。在 2.0 版本（于 2018 年 2 月发布）之前，命令有所不同。

### 配置

在 NixOS 上, Nix 可以通过 \[<https://search.nixos.org/options?query=nix>. `nix` 选项\]进行配置。

独立的 Nix 通过 `nix.conf` 进行配置（其通常位于 `/etc/nix/`）。可用选项的详细说明可在 [Nix 参考手册](https://nixos.org/manual/nix/stable/command-ref/conf-file)中找到.

你也可以使用 <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> 配置 Nix，它为单用户管理声明式环境。对于系统范围的配置，可以在 Linux 上使用 [System Manager](https://github.com/numtide/system-manager)，在 macOS 上使用 [nix-darwin](https://github.com/LnL7/nix-darwin)。

<span id="Internals"></span>

## 内部组成

### Nix store

由 Nix 构建的软件包会被放置在只读的 *Nix store* 中，通常位于 `/nix/store`。每个软件包都会被赋予一个唯一的地址，该地址由加密哈希值、软件包名称和版本组成，例如 `/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`。这些前缀对构建过程中的所有输入进行哈希，包括源文件、完整的依赖树、编译器参数等。这使得 Nix 能够同时安装同一软件包的不同版本，甚至是同一版本的不同构建（例如使用不同编译器构建的变体）。在添加、移除或更新软件包时，存储中的内容不会被删除；相反，*profiles* 中指向这些软件包的符号链接会被添加、移除或更改。

<span id="Cleaning_the_Nix_store"></span>

#### 清理 Nix store

有关清理 Nix store 的信息，请参阅 。

<span id="Nix_store_corruption"></span>

#### Nix store 损坏

有关修复 Nix store 损坏的信息，请参阅 。

<span id="Valid_Nix_store_names"></span>

#### 有效的 Nix store 名称

### Profiles

為了構建一個一致的用戶和系統環境，Nix 會將 Nix store 中的條目符號連結到 *profiles* 中。這是 Nix 實現回滾的前端：由於 store 是不可變的且保留先前版本的 profile，將系統還原到先前的狀態只需簡單地將符號連結更改為先前的 profile。更精確地說，Nix 將二進位檔符號連結到 Nix store 中代表用戶環境的條目中。這些用戶環境隨後被符號連結到儲存在 `/nix/var/nix/profiles` 中被標注的 profile，而它們則進一步符號連結到使用者的 `~/.nix-profile`。

<span id="Sandboxing"></span>

### 沙盒

启用沙盒构建后，Nix 将为每个构建过程设置一个隔离环境。这用于移除构建环境中的的其它隐藏依赖项，以提高构建结果的可复现性。这包括在构建过程中对 `fetch*` 函数之外的网络访问，以及对 Nix Store 之外的文件访问的不可行。根据操作系统的不同，对其他资源的访问也会被阻止（例如，在 Linux 上，进程间通信也是被隔离的）。

沙盒在 Linux 上預設是開啟的，在 macOS 上則否。 在 [Nixpkgs](https://github.com/NixOS/nixpkgs/) 的提取請求 (pull request) 中，請開啟沙盒模式進行測試（請見提取請求模版中的 `Tested using sandboxing`），因為在 [官方 Hydra 構建](https://nixos.org/hydra/)中，沙盒會被使用。

要为 Nix 配置沙盒，请在 `/etc/nix/nix.conf` 中设置 `sandbox = true`；要为 NixOS 配置沙盒，请在 `configuration.nix` 中设置 `nix.useSandbox = true;`。自 NixOS 17.09 起，`nix.useSandbox` 选项默认为 `true`。

<span id="Alternative_Interpreters"></span>

### 可选的解释器

目前正在進行一項計畫，從零開始使用 Rust 重新實作 Nix。

- [tvix](https://cs.tvl.fyi/depot/-/tree/tvix)

有一個社群領導的 Nix 2.18 分支叫做 Lix，專注於正確性、可用性和成長性。同時它還為 Nix 部份組件加入 Rust 端口，但不像從零開始重寫的 Tvix。

- [lix](https://lix.systems/)

早期的尝试可以在 [riir-nix](https://riir-nix.github.io/) 找到。

## 备注

<references />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: 值在计算过程中不会改变。当函数的输入不变时，函数总是输出相同的结果。
