<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Neovim/zh -->

<languages/>

  
*另见: <a href="Special:MyLanguage/Vim" class="wikilink" title="Vim">Vim</a>*

[Neovim](https://neovim.io/)[^1] 是一款高度可扩展的开源文本编辑器，旨在改进和现代化流行的 <a href="Special:MyLanguage/Vim" class="wikilink" title="Vim">Vim</a>[^2] 编辑器。它被设计为 Vim 的无缝衔接替代品，在保持与大多数 Vim 插件和配置的兼容性的同时，提供额外的功能和改进。Neovim 注重可扩展性、易用性和性能。

它引入了强大的插件架构，支持异步插件执行，这可以显著提升某些操作的性能。它还内置了终端模拟器，允许用户直接在编辑器中运行 shell 命令。该项目注重代码质量和可维护性，拥有简洁且文档完善的代码库，方便开发者贡献代码。

<span id="Installation"></span>

## 安装

#### Shell

要在不修改系统配置的情况下临时在 shell 环境中使用 Neovim，您可以运行：

这样就能在当前 shell 中使用 Neovim 编辑器了。之后，您可以通过输入 `nvim` 来启动 Neovim。

<span id="System_setup"></span>

#### 系统设置

要在系统范围内安装 Neovim，使其可供所有用户使用，请将以下内容添加到您的配置中：

使用 `nixos-rebuild switch` 或 `home-manager switch` 重建系统后，Neovim 将被安装且可使用。

<span id="Configuration"></span>

## 配置

<span id="Basic"></span>

#### 基础

<span id="Advanced"></span>

#### 进阶

## 小技巧

<span id="Package_Variations"></span>

#### 包的变体

请查看 [Neovim Nightly Overlay](https://github.com/nix-community/neovim-nightly-overlay)[^3] 以安装最新的 Neovim nightly 版本。

您可以通过以下命令运行主版本：

<span id="Plugin_Management"></span>

#### 插件管理

<span id="Frameworks"></span>

#### 框架

如果您不想手动配置系统，NixOS 提供了多种预定义配置和社区支持的选项。以下列举其中一些：

- [LazyVim](https://www.lazyvim.org/)[^4]
- [AstroNvim](https://astronvim.com/)[^5]
- [NVChad](https://nvchad.com/)[^6]

默认情况下，LazyVim 会阻止加载非 LazyVim 管理的插件。这包括所有通过 Nix 安装的插件。如果您想同时使用 Nix 和 LazyVim 安装插件，请将以下内容添加到您的 LazyVim 配置中：

[源码](https://github.com/folke/lazy.nvim/issues/402#issuecomment-2084997594)

<span id="FHS_wrapper"></span>

#### FHS 包装

您可以创建自定义的 Neovim FHS 包装器

该 FHS 封装示例基于 nixpkgs 中的一个贡献代码[^7]。 有关包含使用类似 FHS 环境设置 `mason.nvim` 的扩展配置，请参阅此 [NixOS/nixpkgs 问题评论](https://github.com/NixOS/nixpkgs/issues/281219#issuecomment-2284713258)。

## 故障排除

<span id="lua-language-server:_Dynamically_linked_executable_error"></span>

#### lua-language-server: 动态链接可执行文件错误

在您的`~/.local/state/nvim/lsp.log`文件中，您会看到以下错误：

这个问题可以在 Stack Overflow 上找到解决方案[^8]。

<span id="See_also"></span>

## 另见

<div lang="en" dir="ltr" class="mw-content-ltr">

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – For declarative Neovim configuration at the user level: [Neovim module in Home Manager](https://nix-community.github.io/home-manager/options.html#opt-programs.neovim.enable)
- [Official Documentation](https://neovim.io/doc/) – Official Neovim documentation.
- [NixOS options for Neovim](https://search.nixos.org/options?channel=unstable&query=programs.neovim) – System-level Neovim configuration.
- [Neovim discussions on NixOS Discourse](https://discourse.nixos.org/search?q=neovim) – Community tips, troubleshooting, and use cases.
- [Neovim Overlay on Nixpkgs](https://github.com/nix-community/neovim-overlay) – For nightly builds and additional Neovim packages.

</div>

<span id="References"></span>

## 参考

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>

[^1]: Neovim 团队, "Home - Neovim", Neovim 官方网站, 最后更新日期：2025年3月；访问日期：2025年6月。 <https://neovim.io/>

[^2]: NixOS 维基社区, "Vim", NixOS 维基, 最后编辑于 2025 年 2 月 24 日，访问于 2025 年 6 月。 <https://wiki.nixos.org/wiki/Vim>

[^3]: Nix 社区, "neovim-nightly-overlay", GitHub, 最后更新于 2025 年 6 月，访问于 2025 年 6 月。https://github.com/nix-community/neovim-nightly-overlay

[^4]: LazyVim 团队, "入门教程", LazyVim 官方网站, © 2025, 访问于 2025年6月。 <https://www.lazyvim.org/>

[^5]: AstroNvim 团队, "AstroNvim", AstroNvim 官方网站, N/A, 访问于 2025年6月。 <https://astronvim.com/>

[^6]: Siduck, "NvChad", NvChad 官方网站, © 2025, 访问于 2025年6月。 <https://nvchad.com/>

[^7]: NixOS，“功能：自定义 Neovim FHS 封装”（Pull Request \#334032），GitHub，2025 年，访问于 2025 年 6 月。https://github.com/NixOS/nixpkgs/pull/334032

[^8]: Stack Overflow 贡献者，“对‘无法在 NixOS 上启动动态链接可执行文件...’的解答”，Stack Overflow，2025，访问于 2025 年 6 月。https://stackoverflow.com/a/78215911/27134695
