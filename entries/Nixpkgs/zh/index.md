<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/zh -->

<languages/> **Nixpkgs** 是最大的 <a href="Nix" class="wikilink" title="Nix">Nix</a> 軟體包儲存庫和 <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 模組。儲存庫 [託管在 GitHub 上](https://github.com/nixos/nixpkgs) 並且由社群維護，另外還有 <a href="NixOS_Foundation" class="wikilink" title="NixOS Foundation">NixOS Foundation</a> 的官方支持。

尋找可用的套件和選項，請看 <a href="Searching_packages" class="wikilink" title="尋找套件">尋找套件</a>。

如同在 NixOS 24.11 釋出[發布會](https://nixos.org/blog/announcements/2024/nixos-2411/)所強調的，*「NixOS 已經被認為是 [最即時更新的發行版](https://repology.org/repositories/statistics/newest) 和 [最多軟體包的發行版](https://repology.org/repositories/statistics/total)。」* 這歸功於-{zh-hans:社区; zh-hant:社群}-的持續貢獻使 Nixpkgs 成為最重要且最強大的 Linux 軟體包儲存庫。

<span id="Subpages"></span>

## 子頁面

這裡有一系列關於操作 `nixpkgs` 的文章：

<span id="Releases"></span>

## 釋出版本

軟體包和模組託管在 Nixpkgs 被分配成多種 <a href="channel_branches" class="wikilink" title="頻道分支">頻道分支</a> 用於特定用途。在實務上，它們的不同在於更新必須在官方 [nixos.org Hydra 伺服器](https://nixos.org/hydra/manual/#idm140737315980672) 上通過的測試，以及它們的更新頻率。

對於 <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 用戶而言，`nixos-unstable`（不穩定）頻道是滾動式更新，軟體包通過構建測試和 <a href="NixOS_VM_tests" class="wikilink" title="虛擬機上的整合測試">虛擬機上的整合測試</a>，並經過作業系統方面的測試（意思是 <a href="Xorg" class="wikilink" title="X server">X server</a>、<a href="KDE" class="wikilink" title="KDE">KDE</a>、不同的視窗系統和低階的細節例如 <a href="Bootloader" class="wikilink" title="啟動程式 (bootloader)">啟動程式 (bootloader)</a> 和運行 NixOS 系統安裝步驟也會經過測試）。

對於獨立 <a href="Nix" class="wikilink" title="Nix">Nix</a> 用戶，`nixpkgs-unstable` 頻道是滾動式更新，軟體包只經過基本構建測試，並且滾動升級。

<a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 和 <a href="Nix" class="wikilink" title="Nix">Nix</a> 用戶都可以使用穩定頻道（参见 <https://status.nixos.org/> 获取当前频道）以仅接收修复关键漏洞和安全问题的保守更新。穩定頻道半年會释出一次，分别在五月底和十一月底。

在 NixOS 上使用穩定頻道的體驗，可與其他 Linux 發行版的使用者體驗相媲美。

<span id="Alternatives"></span>

## 替代品

基於 Nixpkgs 「只是」Nix 表達式，你可以自行增加或替換邏輯在你自己的來源。 事實上，有一系列的擴充套件同時是 Nixpkgs 完全的替代品，請見 <a href="Alternative_Package_Sets" class="wikilink" title="替代套件組">替代套件組</a> 文章。

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
