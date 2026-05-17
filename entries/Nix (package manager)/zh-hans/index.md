<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/zh-hans -->

<languages/> Nix是一个包管理器和构建系统，它解析由<a href="Nix_Expression_Language" class="wikilink" title="Nix表达式语言">Nix表达式语言</a> (一种惰性求值的纯函数式语言) 指定的可复现的构建指令。Nix表达式是纯函数[^1]，它接受依赖作为参数，并为该软件包生成一个指定可复现构建环境的*<a href="Derivations" class="wikilink" title="derivation">derivation</a>*。Nix把构建结果存储在由整个依赖树的哈希值指定的唯一地址，从而创建一个不可变的包存储 (即<a href="#Nix_store" class="wikilink" title="nix store">nix store</a>)，使得原子升级、回滚、同时安装同一软件包的不同版本成为可能，从根本上消除了[依赖地狱](https://en.wikipedia.org/wiki/Dependency_hell)。

<span id="Usage"></span>

## 用法

### 安装

在<a href="NixOS" class="wikilink" title="NixOS">NixOS</a>上，Nix已经被自动安装。

在其他Linux发行版或macOS上，你可以按照[Nix手册中的安装部分](https://nixos.org/manual/nix/stable/installation/installation)来安装Nix。

<span id="Nix_commands"></span>

### Nix命令

<a href="Nix_(command_line_utilities)" class="wikilink" title="Nix命令">Nix命令</a>在[Nix参考手册](https://nixos.org/manual/nix/stable/command-ref/command-ref)中有详细说明，分为主要命令、工具命令和实验性命令。在2.0版本（发布于2018年2月）之前，命令有所不同。

### 配置

在NixOS上，Nix可通过\[<https://search.nixos.org/options?query=nix>. `nix`选项\]配置。

独立的Nix通过`nix.conf`（通常在`/etc/nix/`下）配置。可用选项的细节[在Nix参考手册中](https://nixos.org/manual/nix/stable/command-ref/conf-file)。

<a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>为单一用户管理声明式环境，也可用于配置Nix。对于系统级配置，可在Linux上使用System Manager，在macOS上使用nix-darwin。

<span id="Internals"></span>

## 内部细节

<span id="Nix_store"></span>

### Nix存储（Nix store）

Nix构建得到的包放在只读的*Nix存储*，正常情况下在`/nix/store`。每个包被赋予唯一地址，该地址由加密哈希值后跟包名称和版本指定，比如`/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`。前缀哈希值来自对构建过程中所有输入的哈希，包括源文件、整个依赖树、编译器标志等。这让Nix能同时安装同一个包的不同版本，甚至同一版本的不同构建，比如不同编译器构建的变体。在添加、移除或更新包时，不会从存储中移除任何包，而是在*配置文件*（profiles）里添加、移除或修改指向这些包的符号链接。

<span id="Cleaning_the_Nix_store"></span>

### 清理Nix存储

有关清理Nix存储的信息，参考。

<span id="Nix_store_corruption"></span>

#### Nix存储损坏

有关修复损坏的Nix存储的信息，参考。

<span id="Valid_Nix_store_names"></span>

#### 有效的Nix存储名称

<span id="Profiles"></span>

### 配置文件（Profiles）

为了搭建一致的用户或系统环境，Nix将Nix存储的条目符号链接到*配置文件*。这是Nix允许回滚功能的前端：由于存储不可变，先前版本的配置文件被保留，恢复到更早的状态只需要改变符号链接到先前的配置文件。更精确地说，Nix将二进制文件符号链接到Nix存储中表示用户环境的条目。然后这些用户环境被符号链接到`/nix/var/nix/profiles`里被标记的配置文件，后者又被符号链接到该用户的`~/.nix-profile`。

<span id="Sandboxing"></span>

### 沙盒化

当启用沙盒构建时，Nix会为每个构建过程设置一个隔离的环境。它用于移除构建环境中额外的隐藏依赖，以提高可复现性。这包括在构建过程中禁止`fetch*`函数之外对网络的访问，和Nix存储之外对文件的访问。根据操作系统的不同，对其他资源的访问也会被阻止（例如，进程间通信在Linux上被隔离）。

沙盒化在Linux上默认启用，在macOS上默认禁用。 Nixpkgs的拉取请求（pull requests）中，要求在沙盒化启用条件下测试构建（见拉取请求模板中的`Tested using sandboxing`），因为在[官方Hydra构建](https://nixos.org/hydra/)中使用了沙盒化。

为Nix配置沙盒化，在`/etc/nix/nix.conf`里设置`sandbox = true`。为NixOS配置沙盒化，在`configuration.nix`里设置`nix.useSandbox = true;`。从NixOS 17.09开始，`nix.useSandbox`选项默认为`true`

<span id="Alternative_Interpreters"></span>

### 可选的解释器

一项用Rust从零开始重新实现Nix的工作正在进行。

<div lang="en" dir="ltr" class="mw-content-ltr">

- [tvix](https://cs.tvl.fyi/depot/-/tree/tvix)

</div>

Nix 2.18有一个名叫Lix的社区领导分支，专注于正确性、易用性和成长性。尽管它也将一些Nix组件移植到Rust，它不是Tvix那样从零开始的重写版本。

<div lang="en" dir="ltr" class="mw-content-ltr">

- [lix](https://lix.systems/)

</div>

更早的尝试可在riir-nix找到

## 备注

<references />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: 值在计算过程中不会改变。当输入不变时，函数总是得到相同的输出。
