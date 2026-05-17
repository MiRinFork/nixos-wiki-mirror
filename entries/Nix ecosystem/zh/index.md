<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix ecosystem/zh -->

<languages/> **Nix 核心生态系统**是一组技术的集合，旨在以可复现的方式构建、声明性地配置和管理软件包、系统及其依赖项。它通过将函数式编程范式从程序领域扩展到系统领域来实现这一目标，并使用一种动态的、函数式的、惰性求值的领域特定语言（DSL），即 <a href="Special:MyLanguage/Overview_of_the_Nix_Language" class="wikilink" title="Nix 语言">Nix 语言</a>，来指定可复现的构建过程。

此外，还有许多由 Nix 社区开发的<a href="Special:MyLanguage/applications" class="wikilink" title="应用程序">应用程序</a>（***Nix 扩展生态系统***）利用并支持了这些核心技术。

<span id="Official_ecosystem"></span>

## 官方生态系统

| 组件 | 手册(Manual) | 描述 | 用途 | 协议 |
|----|----|----|----|----|
| <a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a> | [NixOS 手册](https://nixos.org/nixos/manual/) | 一个由 Nix 构建*所有*组件的 Linux 发行版，因此支持可重现的、声明式的全系统配置管理以及原子升级和回滚。 | 声明式配置桌面、服务器和集群。 | MIT |
| <a href="Special:MyLanguage/Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> | [Nixpkgs 手册](https://nixos.org/nixpkgs/manual/) | 最大的社区维护的 Nix 软件包和 NixOS 模块仓库，NixOS 的标准版本也托管在这里。 | 分享 Nix 软件包和 NixOS 模块 | MIT |
| <a href="Special:MyLanguage/Hydra" class="wikilink" title="Hydra">Hydra</a> | [Hydra 手册](https://nixos.org/hydra/manual/) | 基于 Nix 的持续构建系统 | 持续构建集群 | GPL-3.0 |
| <a href="Special:MyLanguage/Nix" class="wikilink" title="Nix">Nix</a> | [Nix 手册](https://nixos.org/nix/manual/) | 一款软件包管理器，能解析指定可重现构建的 Nix 表达式，并将结果与依赖关系树的哈希值一起放入存储地址，从而避免依赖关系地狱，并支持多版本安装和回滚。 | Linux 和 Darwin 中的可重现构建和软件包管理 | LGPL-2.1 |

Nix 生态系统核心组件

<table style="width:20%;">
<caption><strong>Nix 核心生态系统技术栈</strong></caption>
<colgroup>
<col style="width: 20%" />
</colgroup>
<tbody>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>NixOS</p>
</div>
<p>一个用 Nixpkgs 构建的 Linux 发行版和配置系统。</p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nixpkgs</p>
</div>
<p>一个巨大的，社区维护的软件仓库。</p></td>
</tr>
<tr>
<td style="text-align: center; border: 1px solid var(--border-color-base); background: var(--background-color-neutral); padding: 1.6rem" width="2%"><div style="font-size: 1.3em; font-weight: bold">
<p>Nix</p>
</div>
<p>一个纯函数式的构建系统。</p></td>
</tr>
</tbody>
</table>

<span id="Usage_of_NixOS"></span>

## NixOS 的使用方式

用户可以像安装其他 Linux 发行版一样，将 *NixOS* 发行版安装到他们的电脑上。他们通过 <https://search.nixos.org> 和本维基查阅有关 *Nixpkgs* 中可安装的软件包和配置选项的信息。他们使用 *Nix* 语言以声明式的方式，在一个文本文件中描述应该安装哪些软件包以及如何配置系统。然后，他们在终端中运行两个命令行程序，将系统转变为所描述的系统。此后，他们像使用任何其他 Linux 系统一样使用该系统。

<span id="Development_of_NixOS"></span>

## NixOS 的开发

*NixOS* 的开发者主要工作在 *Nixpkgs* 上。*NixOS* 本身的开发由三个主要领域组成，同时还有一些体量较小但同样重要的其他领域。主要领域包括打包、模块系统和文档。

- 打包工作在 *Nixpkgs* 中进行，并不仅限于 *NixOS* 或基于 Linux 的平台。那些不专属于 *NixOS* 的软件包（例如运行发行版本身所需的工具）的维护者通常会照顾多个平台，尽管这并非严格要求。

<!-- -->

- 模块系统是配置运行在 *NixOS* 上服务的主要方式。该领域涵盖从“底层”配置（如 *systemd* 单元文件或提供自定义内核配置）到为特定服务生成配置文件的各个方面。模块系统是用户配置 *NixOS* 的主要途径，并位于 *Nixpkgs* 的 `nixos/` 子目录中。

<!-- -->

- 文档主要嵌入在打包和模块系统的数据中，尽管独立的 Markdown 文件也包含在 *Nixpkgs* 仓库中。文档还包括维护网站、维基以及更广泛生态系统的其他方面。前两个类别几乎完全由 *Nix* 语言代码组成，写在文本文件中，而后者则是 *Nix* 代码、Markdown 文件及其他各种格式的混合。

对 *Nixpkgs* 的所有贡献，无论是否影响 *NixOS*，在被合并到 *Nixpkgs* 前都需经过同行评审。许多软件包以及文档和补充材料（如 ISO 或 tarball）会在 *Hydra* 上预先构建，以减少 *NixOS* 用户的更新等待时间。

这三个类别按贡献量来看是最大的，但许多维护者也参与围绕 NixOS 基金会的活动，包括维护网站、*Hydra* 及其他工具运行所需的基础设施，或开发 NixOS 所需的工具。

| 开发类型 | 开发所属 | 示例 |
|----|----|----|
| 平台无关的打包 | *Nixpkgs* | [coreutils 软件包](https://github.com/NixOS/nixpkgs/blob/bf3287dac860542719fe7554e21e686108716879/pkgs/tools/misc/coreutils/default.nix), [*stdenv* 框架](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/stdenv), [Libreoffice 软件包](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/applications/office/libreoffice/default.nix) |
| 平台无关的工具 | *Nixpkgs* 及其他多个仓库 | [上游/默认 Nix 实现（CppNix）](https://github.com/NixOS/nix), [*Hydra* 源代码](https://github.com/NixOS/hydra), [*Nixpkgs* 合并机器人](https://github.com/NixOS/nixpkgs-merge-bot) |
| *NixOS* 工具 | 主要是 *Nixpkgs* | [nixos-rebuild-ng 源代码](https://github.com/NixOS/nixpkgs/tree/5fe6820251dfab92c84ff356a7c7c336f8d8490c/pkgs/by-name/ni/nixos-rebuild-ng), [*NixOS* 安装映像](https://github.com/NixOS/nixpkgs/blob/5fe6820251dfab92c84ff356a7c7c336f8d8490c/nixos/modules/installer/cd-dvd/installation-cd-minimal.nix) |
| *NixOS* 模块系统 | *Nixpkgs* | [显示管理器配置](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/display-managers/default.nix), [1](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/databases/mysql.nix（及其衍生）数据库配置) |
| 基础设施 |  | [本维基的基础设施](https://github.com/NixOS/nixos-wiki-infra), [*NixOS* 基础设施](https://github.com/NixOS/infra) |
| 文档 |  | [本维基](https://wiki.nixos.org), [*stdenv* 文档](https://github.com/NixOS/nixpkgs/blob/8d92119c540d78599ba208010c722a60958810f4/doc/stdenv/stdenv.chapter.md), [*NixOS* IPv6 配置](https://github.com/NixOS/nixpkgs/blob/master/nixos/doc/manual/configuration/ipv6-config.section.md)（可在 [*NixOS* 手册 IPv6 章节](https://nixos.org/manual/nixos/stable/#sec-ipv6) 中查看）, [*Nixpkgs* 贡献指南](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md) |
| 技术组织 |  | [*NixOS* RelEng](https://github.com/NixOS/nixpkgs/issues/390768), [*Nix* 和 *NixOS* RFC](https://github.com/NixOS/rfcs/) |
| 其他 |  | [*NixOS* artwork](https://github.com/NixOS/nixos-artwork), [*NixOS*（及相关）讨论区](https://discourse.nixos.org/), [*NixOS 基金会*](https://github.com/NixOS/foundation) |

*NixOS* 开发的各种示例及相关链接

另请参见：[Nix 组织仓库](https://github.com/NixOS/org)

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
