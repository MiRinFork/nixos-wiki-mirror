<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Applications/zh -->

<languages/>

本文列出了专为 Nix 构建或基于 Nix 开发的应用程序；这构成了所谓的***扩展 Nix 生态系统***的清单（关于核心 Nix 生态系统，请参阅 <a href="Special:MyLanguage/Nix_Ecosystem" class="wikilink" title="Nix 生态系统">Nix 生态系统</a>）。

如果您正在寻找 Linux 软件/应用程序，您应该查看 <a href=":Category:Software" class="wikilink" title="软件">软件</a>。

<span id="Non-NixOS_Distributions"></span>

## 非 NixOS 发行版

基于 Nix 构建的各类应用程序包括：

- [not-os](https://github.com/cleverca22/not-os) - 为嵌入式设备构建系统固件

<span id="Built_with_Nix"></span>

## 基于 Nix 构建

利用 Nix 的项目。

- [styx](https://github.com/styx-static/styx) - 基于 Nix 表达式语言的静态网站生成器
- [bionix](https://github.com/PapenfussLab/bionix) - 生物信息学流水线（pipeline）管理与执行工具
- [ethereum.nix](https://nix-community.github.io/ethereum.nix/) - 一套 Nix 软件包与 NixOS 模块，旨在简化以太坊相关服务及基础设施的运维
- [nixos-mailserver](https://gitlab.com/simple-nixos-mailserver/nixos-mailserver) - 简单易用且功能完备的 NixOS 邮件服务器

<span id="Nix_Platform"></span>

## Nix 平台

为 Nix 增加支持（例如针对额外平台或主要功能）的项目。

- [nix-darwin](https://github.com/nix-darwin/nix-darwin) - 适用于 Darwin 的 NixOS 模块
- [musnix](https://github.com/musnix/musnix) - 适用于 NixOS 的实时音频模块
- [nixGl](https://github.com/nix-community/nixGL) - 用于在 NixOS 之外运行 OpenGL 应用程序的包装器

<span id="Nix_Tooling"></span>

## Nix 工具

专为 Nix 生态系统构建的各类工具（例如对 Nix 核心工具的增强或替代方案）。

<span id="General_configuration"></span>

### 常规配置

- [home-manager](https://github.com/nix-community/home-manager) - 使用 Nix 管理用户环境的系统
- [plasma-manager](https://github.com/nix-community/plasma-manager) - 使用 Home-manager 管理 KDE Plasma
- [Nixvim](https://github.com/nix-community/nixvim) - 基于 Nix 模块构建的 Neovim 发行版
- [nvf](https://github.com/NotAShelf/nvf) - 模块化、可扩展且可移植的 Neovim 配置框架

### Flakes

- [deploy-rs](https://github.com/serokell/deploy-rs) - Nix Flake 部署工具
- [flake-utils-plus](https://github.com/gytis-ivaskevicius/flake-utils-plus) - Flake 模板与辅助库（是对下方 flake-utils 的扩展）
- [flake-utils](https://github.com/numtide/flake-utils) - 一组用于构建 Flake 的实用函数
- [flake-parts](https://github.com/hercules-ci/flake-parts) - 利用模块系统简化 Nix Flakes
- [snowfall](https://snowfall.org/) - 基于 Nix Flakes，为系统、软件包、模块、Shell 环境、模板等提供统一配置方案。

<span id="Archives"></span>

### 归档

- [narfuse](https://github.com/taktoa/narfuse) - 用于将 Nix 归档 (NAR) 文件挂载为虚拟 Nix 存储的 FUSE 文件系统

<span id="Clustering"></span>

### 集群管理

- [nix-delegate](https://github.com/awakesecurity/nix-delegate) - 用于分布式 Nix 构建的便捷工具

<span id="Comparison"></span>

### 差异对比

- [nix-diff](https://github.com/Gabriel439/nix-diff) - 比较 Nix 推导（derivations）
- [niff](https://github.com/FRidh/niff) - 比较两个 Nix 表达式以确定哪些属性发生了变化
- [nvd](https://khumba.net/projects/nvd/) - Nix/NixOS 软件包版本差异比较工具
- [lix-diff](https://github.com/isabelroses/lix-diff) - Nix/NixOS 闭包差异比较工具

<span id="Dependencies"></span>

### 依赖分析

- [nix-tree](https://github.com/utdemir/nix-tree) - Nix derivation 的交互式依赖浏览工具
- [nix-visualize](https://github.com/craigmbooth/nix-visualize) - 将指定软件包的依赖关系可视化为图表
- [npins](https://github.com/andir/npins) - 用于管理 Nix 项目中各类依赖的简单工具
- [niv](https://github.com/nmattia/niv) - 实现 Nix 项目依赖管理的便捷工具
- [Nixtamal](https://nixtamal.toast.al/) - 实现 Nix 输入锁定的工具

<span id="Nix_language_tools"></span>

### Nix 语言工具

<span id="Language_servers"></span>

#### 语言服务器

- [nil](https://github.com/oxalica/nil) - Nix 语言服务器，一款用于编写 Nix 代码的增量分析辅助工具
- [nixd](https://github.com/nix-community/nixd) - Nix 语言服务器，比 nil 更新，功能更丰富

<span id="Static_analysis_/_linters"></span>

#### 静态分析 / 代码检查工具

- [deadnix](https://github.com/astro/deadnix) - 移除 .nix 文件中的无用代码
- [statix](https://github.com/oppiliappan/statix) - Nix 编程语言的代码检查工具与建议工具
- [nixf-diagnose](https://github.com/inclyc/nixf-diagnose) - 代码检查工具 —— nixf-tidy（属于 [nixd](https://github.com/nix-community/nixd) 项目）的命令行封装

<span id="Formatters"></span>

#### 格式化工具

- [nixfmt](https://github.com/NixOS/nixfmt) - Nix 代码官方格式化工具
- [alejandra](https://github.com/kamadorueda/alejandra) - Nix 代码非官方格式化工具

<span id="Package_maintenance"></span>

### 软件包维护

- [nix-update](https://github.com/Mic92/nix-update/) - 更新 Nix 软件包的瑞士军刀式工具。
- [nixpkgs-review](https://github.com/Mic92/nixpkgs-review) - 审查 nixpkgs 的拉取请求。
- [nix-init](https://github.com/nix-community/nix-init) - 根据 URL 生成 Nix 软件包。
- [nixpkgs-hammering](https://github.com/jtojnar/nixpkgs-hammering) - 强制执行一系列严苛规则，旨在指出并解释 nixpkgs 软件包拉取请求中的常见错误。

<span id="Debugging"></span>

### 调试

- [dwarffs](https://github.com/edolstra/dwarffs) - 自动从 cache.nixos.org 获取供 gdb 使用的 DWARF 调试信息文件
- [nixseparatedebuginfod](https://github.com/symphorien/nixseparatedebuginfod) - 获取供 gdb 等支持 debuginfod 的工具使用的调试符号和源文件

<span id="Search"></span>

### 搜索工具

- [nix-index](https://github.com/nix-community/nix-index) - 快速定位包含特定文件的 Nix 软件包
- [nix-du](https://github.com/symphorien/nix-du) - 找出 Nix 存储中占用磁盘空间的 GC 根（gc-roots）
- [nix-info](https://github.com/nix-hackers/nix-info) - 类似于 Homebrew info 的 Nix 信息查询工具
- [userscan](https://github.com/flyingcircusio/userscan) - 扫描包含手动编译程序的目录，并将其注册到 Nix 垃圾回收器中
- [nix-search-cli](https://github.com/peterldowns/nix-search-cli) - 用于在 search.nixos.org 上搜索软件包的命令行工具

### Shell

- [nix-bash-completions](https://github.com/hedning/nix-bash-completions) - 针对 `nix*` 命令的 Bash 自动补全功能
- [nixos-shell (Mic92)](https://github.com/Mic92/nixos-shell) - 在 Shell 中启动轻量级 NixOS 虚拟机（类似于 Vagrant）
- [nixos-shell (chrisfarms)](https://github.com/chrisfarms/nixos-shell) - 类似于 nix-shell，但针对 NixOS 模块；可构建版本见 [此分支](https://github.com/wavewave/nixos-shell/tree/submodule)
- [extra-container](https://github.com/erikarvstedt/extra-container) - 从命令行运行声明式 NixOS 容器；类似于 nixos-shell (chrisfarms)

<span id="Other"></span>

### 其他

- [nix-bundle](https://github.com/nix-community/nix-bundle) - 将 Nix 属性打包为单文件可执行程序
- [nix-user-chroot](https://github.com/lucabrunox/nix-user-chroot) - 允许非特权用户在任意系统上安装 Nix
- [nh](https://github.com/nix-community/nh) - nixos-rebuild 的重写版本，集成了 nvd 差异对比、nix-output-manager 构建树视图以及软件包搜索等提升使用体验的功能
- [nixos-cli](https://github.com/nix-community/nixos-cli) - 一款用于轻松管理 NixOS 系统的多合一工具，整合了所有 \`nixos-\*\` 命令的功能

<span id="Nix_Operations"></span>

## Nix 运维

Nix 生态系统的运维工具：

<span id="Official"></span>

### 官方

- [Hydra](https://github.com/nixos/hydra) - Nix 官方的持续集成与构建系统
- [NixOps](https://github.com/NixOS/nixops) - Nix 官方的部署工具（目前已停止维护），用于将应用部署到网络或云端的 NixOS 机器上

<span id="Deployment"></span>

### 部署

- [Bento](https://github.com/rapenne-s/bento) - 一款 NixOS 集群管理工具，支持非全天候在线的远程系统。

<!-- -->

- [colmena](https://github.com/zhaofengli/colmena) - 一款 NixOS 部署工具
- [comin](https://github.com/nlewo/comin) - 一款持续从 Git 仓库拉取并进行部署的工具
- [deploy-rs](https://github.com/serokell/deploy-rs) - 一款简单的多配置（multi-profile）Nix-flake 部署工具

<!-- -->

- <a href="Special:MyLanguage/krops" class="wikilink" title="krops">krops</a> - 一个用于远程或本地部署 NixOS 系统的轻量级工具包
- [lollypops](https://github.com/pinpox/lollypops) - 一个支持并行且无状态的 NixOS 部署工具
- [Morph](https://github.com/DBCDK/morph) - 一个 NixOS 部署工具
- [Nixinate](https://github.com/MatthewCroughan/nixinate) - 一个 Nix flake 库，提供应用输出，用于通过 SSH 管理现有的 NixOS 主机
- `nixos-build --target-host`
- [Nixus](https://github.com/Infinisil/nixus) - 一个实验性的 NixOS 部署工具
- [wire](https://github.com/forallsys/wire) - 一个用于部署 NixOS 系统的工具。其用法灵感来自 colmena，但它并非 colmena 的分叉。

### Docker

- [Arion](https://github.com/hercules-ci/arion) - 使用 Nix 模块配置 Docker Compose
- [Nixery](https://nixery.dev) - 基于 Nix 即时生成容器镜像

### Kubernetes

- [kubenix](https://github.com/xtruder/kubenix) - 用 Nix 编写的 Kubernetes 资源构建器
- [nix-kubernetes](https://github.com/xtruder/nix-kubernetes) - 用 Nix 编写的 Kubernetes 部署管理器

<span id="Alternative_nix_implementations_&amp;_parser"></span>

## 其他 Nix 实现与解析器

- [hnix](https://github.com/haskell-nix/hnix) (Haskell，解析器与求值器)
- [rnix](https://github.com/nix-community/rnix-parser) (Rust，解析器)
- [go-nix](https://github.com/orivej/go-nix) (Go，解析器与 Nix 兼容的文件哈希计算器)
- [nix-idea](https://github.com/NixOS/nix-idea/tree/master/src/main/java/org/nixos/idea/lang) (Java，解析器)
- [lix](https://lix.systems/) (C++，[NixOS/nix](https://github.com/NixOS/nix) 的分叉)
- [snix](https://snix.dev/) (Rust，CLI、求值器与存储层)

<span id="Additional_unofficial_ecosystem"></span>

## 额外的非官方生态系统

使用 Nix 无需这些服务。这些服务均与 <a href="Special:MyLanguage/NixOS_Foundation" class="wikilink" title="NixOS 基金会">NixOS 基金会</a> 无关。

[Cachix](https://cachix.org)：即服务形式的二进制缓存。公共缓存免费，私有（需令牌访问）缓存采用订阅制。  
[Hercules CI](https://hercules-ci.com)：利用无状态构建代理简化 CI 设置。开源项目免费，私有仓库按用户数订阅。  
[Garnix](https://garnix.io)：基于 Nix 的 CI、缓存（公测阶段）及云托管（内测阶段）服务。目前免费，但也提供商业方案。  
[nixbuild.net](https://nixbuild.net/)：面向 x86_64 和 AArch64 架构的远程 Nix 构建服务。按使用量付费。  

<span id="See_also"></span>

## 另见

- [awesome-nix](https://github.com/nix-community/awesome-nix)
- <a href="Special:MyLanguage/Language-specific_package_helpers" class="wikilink" title="特定语言的软件包辅助工具">特定语言的软件包辅助工具</a>
- <a href="Special:MyLanguage/Alternative_Package_Sets" class="wikilink" title="替代软件包集">替代软件包集</a>
- <a href="Special:MyLanguage/Configuration_Collection" class="wikilink" title="从他人的 NixOS 配置中获取灵感">从他人的 NixOS 配置中获取灵感</a>
- [NixOS 软件包搜索](https://search.nixos.org/packages) 用于搜索 NixOS 软件包

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Nix{{#translation:}}" class="wikilink" title="Category:Nix{{#translation:}}">Category:Nix{{#translation:}}</a>
