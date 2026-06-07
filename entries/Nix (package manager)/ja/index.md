<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (package manager)/ja -->

<languages/>

<div class="mw-translate-fuzzy">

Nixは、<a href="Nix_Expression_Language" class="wikilink" title="Nix Expression Language">Nix Expression Language</a> で表現された再現可能なビルド命令を解析するパッケージマネージャーおよびビルドシステムであり、これは遅延評価を伴う純粋関数型言語である。Nix expressions は、依存関係を引数として取り、パッケージに対して再現可能なビルド環境*<a href="Derivations" class="wikilink" title="derivation">derivation</a>*を作成する純粋関数[^1]です。Nixは、ビルドの結果を完全な依存関係ツリーのハッシュで指定された一意のアドレスに保存し、不変のパッケージストアを作成することで、原子的な更新、ロールバックを実現する。また、異なるバージョンのパッケージを同時にインストールすることで、根本的に[依存関係地獄](https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82%E5%9C%B0%E7%8D%84)を防ぐ。

</div>

<span id="Usage"></span>

## 使い方

<span id="Installation"></span>

<div class="mw-translate-fuzzy">

### インストール

<a href="NixOS" class="wikilink" title="NixOS">NixOSでは</a>、Nix は最初からインストールされている。

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

On <a href="NixOS" class="wikilink" title="NixOS">NixOS</a>, Nix is automatically installed.

</div>

<div class="mw-translate-fuzzy">

他の Linux ディストリビューションや macOS 上では、[installation section of the Nix manual](https://nixos.org/manual/nix/stable/installation/installation)に従ってインストールできる。

</div>

<span id="Nix_commands"></span>

### Nix コマンド

<div class="mw-translate-fuzzy">

<a href="Nix_(command_line_utilities)" class="wikilink" title="Nix コマンド">Nix コマンドは</a>、[Nix リファレンスマニュアル](https://nixos.org/manual/nix/stable/command-ref/command-ref)に、主なコマンド、ユーティリティ、および実験コマンドが文書化されている。バージョン2.0(2018年2月リリース)以前は、さまざまなコマンドが存在していた。

</div>

<span id="Configuration"></span>

<div class="mw-translate-fuzzy">

### 設定

NixOS 上では、\[<https://search.nixos.org/options?query=nix>. `nix` option\]を用いてNixで設定することができる。

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

On NixOS, Nix can be configured using the [`nix` option](https://search.nixos.org/options?query=nix).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Standalone Nix is configured through `nix.conf` (usually found in `/etc/nix/`). Details on the available options are [found in the Nix reference manual](https://nix.dev/manual/nix/stable/command-ref/conf-file).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can also configure Nix using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, which manages declarative environments for a single user. For system-wide configuration, you can use [System Manager](https://github.com/numtide/system-manager) on Linux and [nix-darwin](https://github.com/nix-darwin/nix-darwin) on macOS.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Internals

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Nix store

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Packages built by Nix are placed in the read-only *Nix store*, normally found in `/nix/store`. Each package is given a unique address specified by a cryptographic hash followed by the package name and version, for example `/nix/store/nawl092prjblbhvv16kxxbk6j9gkgcqm-git-2.14.1`. These prefixes hash all the inputs to the build process, including the source files, the full dependency tree, compiler flags, etc. This allows Nix to simultaneously install different versions of the same package, and even different builds of the same version, for example variants built with different compilers. When adding, removing or updating a package, nothing is removed from the store; instead, symlinks to these packages are added, removed or changed in *profiles*.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Cleaning the Nix store

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For information relating to cleaning the Nix store, refer to .

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Nix store corruption

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For information relating to fixing a corrupted Nix store, refer to .

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Valid Nix store names

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Profiles

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In order to construct a coherent user or system environment, Nix symlinks entries of the Nix store into *profiles*. These are the front-end by which Nix allows rollbacks: since the store is immutable and previous versions of profiles are kept, reverting to an earlier state is simply a matter of change the symlink to a previous profile. To be more precise, Nix symlinks binaries into entries of the Nix store representing the user environments. These user environments are then symlinked into labeled profiles stored in `/nix/var/nix/profiles`, which are in turn symlinked to the user's `~/.nix-profile`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Sandboxing

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

When sandbox builds are enabled, Nix will setup an isolated environment for each build process. It is used to remove further hidden dependencies set by the build environment to improve reproducibility. This includes access to the network during the build outside of `fetch*` functions and files outside the Nix store. Depending on the operating system access to other resources are blocked as well (ex. inter process communication is isolated on Linux).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Sandboxing is enabled by default on Linux, and disabled by default on macOS. In pull requests for [Nixpkgs](https://github.com/NixOS/nixpkgs/) people are asked to test builds with sandboxing enabled (see `Tested using sandboxing` in the pull request template) because in [official Hydra builds](https://nixos.org/hydra/) sandboxing is also used.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To configure Nix for sandboxing, set `sandbox = true` in `/etc/nix/nix.conf`; to configure NixOS for sandboxing set `nix.useSandbox = true;` in `configuration.nix`. The `nix.useSandbox` option is `true` by default since NixOS 17.09.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Alternative Interpreters

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

There is an ongoing effort to reimplement Nix, from the ground up, in Rust.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [tvix](https://code.tvl.fyi/tree/tvix)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

There is also a community-led fork of Nix 2.18 named Lix, focused on correctness, usability, and growth. While it has also ported some components of Nix to Rust, it is not a ground-up rewrite like Tvix.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [lix](https://lix.systems/)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Earlier attempts can be found on [riir-nix](https://riir-nix.github.io/)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Notes

</div>

<references />

<a href="Category:Pedias" class="wikilink" title="Category:Pedias">Category:Pedias</a> <a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a> <a href="Category:Incomplete" class="wikilink" title="Category:Incomplete">Category:Incomplete</a> <a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>

[^1]: 変数は不変で、引数が変化しない場合、関数は常に同じ値を返す。
