<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/zh-hans -->

<languages/> **Nixpkgs**是最大的Nix包仓库和NixOS模块。该仓库存储在GitHub上，由社区维护，并得到<a href="NixOS_Foundation" class="wikilink" title="NixOS基金会">NixOS基金会</a>的官方支持。

搜索可用的包和选项，见<a href="Searching_packages" class="wikilink" title="搜索包">搜索包</a>。

正如NixOS 24.11发行公告所强调的，*“NixOS已经被认为是最与时俱进的发行版和包最多的发行版”。*Nixpkgs能成为杰出的Linux包仓库，归功于社区的持续贡献。

<span id="Subpages"></span>

## 子页面

这里有一些关于操作`nixpkgs`的文章：

<span id="Releases"></span>

## 发行版本

托管在Nixpkgs上的包和模块通过多个<a href="channel_branches" class="wikilink" title="频道分支">频道分支</a>分发，以供特定用途。实际上，它们的区别在于更新必须在官方[nixos.org Hydra实例](https://nixos.org/hydra/manual/#idm140737315980672)上通过的测试等级，以及它们的更新数量。

对于<a href="NixOS" class="wikilink" title="NixOS">NixOS</a>用户，`nixos-unstable`频道分支是滚动发行版，包通过构建测试和<a href="NixOS_VM_tests" class="wikilink" title="虚拟机上的集成测试">虚拟机上的集成测试</a>，并通过操作系统方面的测试（这意味着测试对象还有<a href="Xorg" class="wikilink" title="X服务器">X服务器</a>、<a href="KDE" class="wikilink" title="KDE">KDE</a>、各种服务器和低级细节如安装<a href="Bootloader" class="wikilink" title="引导加载程序（bootloaders）">引导加载程序（bootloaders）</a>和运行NixOS安装步骤之类）。

对于独立<a href="Nix" class="wikilink" title="Nix">Nix</a>用户，`nixpkgs-unstable`频道分支是滚动发行版，包只通过基本的构建测试，持续更新。

<a href="NixOS" class="wikilink" title="NixOS">NixOS</a>和<a href="Nix" class="wikilink" title="Nix">Nix</a>用户都可以使用稳定（stable）频道分支（见 <https://status.nixos.org/> 获取当前频道）以只接受修复关键漏洞和安全隐患的保守更新。稳定频道分支在五月底和十一月底各发行一次。

在NixOS上使用稳定频道，用户体验可与其他Linux发行版相媲美。

<span id="Alternatives"></span>

## 替代品

由于Nixpkgs*只是*Nix表达式，你可以用你自己的来源扩展或替换逻辑。 事实上，有一些对Nixpkgs的扩展和完全替代，见<a href="Alternative_Package_Sets" class="wikilink" title="可选的包集合">可选的包集合</a>文章。

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
