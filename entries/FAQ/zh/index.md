<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/zh -->

<languages/> 为了避免重复回答那些经常被问到的问题以及处理新手常遇到的麻烦，这些问题被收录在这里。

<http://unix.stackexchange.com/questions/tagged/nixos> 也可用于提问。

<span id="Why_is_there_a_new_wiki?_What_is_with_nixos.wiki?"></span>

### 为什么创建了一个新的维基？nixos.wiki 怎么了？

旧的 wiki（nixos.wiki）存在以下几个问题：

- 许多组件（MediaWiki、PHP、ICU）严重过时。
  - MediaWiki 1.29（生命周期结束于 2018 年），当前版本为 1.35（生命周期结束于 2023 年 12 月）
  - PHP 7.3.33（生命周期结束于 2021 年 12 月）
  - ICU 64.2
- Cloudflare 的 DDoS 防御有时会导致维基编辑失败。
- 没有所见即所得（WYSIWYG）的编辑器。
- 维基的基础设施本应在上线后公开，但最终未能公开。

我们曾通过多种渠道（电子邮件、Matrix）多次尝试解决这些问题，历时多年，但始终未能得到直接答复。最后一次联系是由 zimbatm 代表 <a href="NixOS_Foundation" class="wikilink" title="NixOS 基金会">NixOS 基金会</a> 与维护者沟通，询问关于新维基合作的可能性。答案是否定的。随着旧维基不断恶化且维护者未作回应，将内容分叉到一个新维基成为了唯一的解决方法。

另请参阅：

- <https://wiki.nixos.org/wiki/User:Winny/WikiRisks>
- <https://greasyfork.org/en/scripts/495011-redirect-to-wiki-nixos-org（用于将> nixos.wiki 链接重定向到此处的简单用户脚本）

<span id="Why_is_Nix_written_in_C++_rather_than_a_functional_language_like_Haskell?"></span>

### 为什么 Nix 是用 C++ 编写的，而不是使用像 Haskell 这样的函数式语言？

主要是因为 Nix 旨在轻量级、易于学习且具有良好的可移植性（零依赖）。

<span id="How_to_keep_build-time_dependencies_around_/_be_able_to_rebuild_while_being_offline?"></span>

### 如何保留构建时依赖/在离线状态下重新构建？

``` nix
# /etc/nixos/configuration.nix
{ config, pkgs, lib, ... }:
{
  nix.settings = {
    keep-outputs = true;
    keep-derivations = true;
    # See https://nixos.org/manual/nix/stable/command-ref/conf-file.html
    # for a complete list of Nix configuration options.
  };
}
```

请查阅“man configuration.nix”文件以了解这些选项。重新构建系统以使这些选项生效：

``` bash
nixos-rebuild switch
```

列出构成系统闭包的所有存储路径并实例化它们：

``` bash
nix-store -qR $(nix-instantiate '<nixpkgs/nixos>' -A system) | xargs nix-store -r
warning: you did not specify `--add-root'; the result might be removed by the garbage collector

<build output and list of successfully realised paths>
```

对您的用户和其他配置文件重复该步骤：

``` bash
nix-store -qR ~/.nix-profile | xargs nix-store -r
```

对于列在 */nix/var/nix/profiles/* 或其子目录中的配置文件，可以忽略此警告。

有关更多信息，请参阅 nix-store 和 nix-instantiate 的手册。

<span id="Why_-_instead_of_-?"></span>

### 为什么使用 <hash>-<name> 而不是 <name>-<hash>？

在少数需要深入查看 /nix/store 的情况下，将哈希值的前几位放在开头更方便记忆和使用。 也就是说，几乎可以仅通过哈希的前 4-5 个字符唯一地识别一个存储路径。 （这比先输入完整的包名再加上哈希的前几位要更高效。）

此外，由于开头部分长度一致，查看一系列软件包列表时在视觉上也更容易解析。

如果你仍然想知道原因，请在 shell 中运行 `ls -1 /nix/store | sort -R -t - -k 2 | less` 命令。*(? 不清楚)*

如果你不经常进行垃圾回收，或者正在测试编译变体，可能会发生这种情况：

``` bash
q0yi2nr8i60gm2zap46ryysydd2nhzhp-automake-1.11.1/
vbi4vwwidvd6kklq2kc0kx3nniwa3acl-automake-1.11.1/
wjgzir57hcbzrq3mcgxiwkyiqss3r4aq-automake-1.11.1/
1ch5549xnck37gg2w5fh1jgk6lkpq5mc-nixos-build-vms/
4cmjlxknzlvcdmfwj0ih0ggqsj5q73hb-nixos-build-vms/
7fv4kwi5wwwzd11ili3qwg28xrj8rxw2-nixos-build-vms/
8jij13smq9kdlqv96hm7y8xmbh2c54iy-nixos-build-vms/
j714mv53xi2j4ab4g2i08knqr137fd6l-nixos-build-vms/
xvs7y09jf7j48p6l0p87iypgpq470jqw-nixos-build-vms/
```

<span id="I&#039;ve_updated_my_channel_and_something_is_broken,_how_can_I_rollback_to_an_earlier_channel?"></span>

### 我更新了我的 channel后出现问题，如何回滚到之前的 channel？

查看可用的各代 channel：

``` bash
nix-env --list-generations -p /nix/var/nix/profiles/per-user/root/channels
18   2014-04-17 09:16:28
19   2014-06-13 10:31:24 
20   2014-08-12 19:09:20   (current)
```

回滚到上一代的方法：

``` bash
nix-env --rollback -p /nix/var/nix/profiles/per-user/root/channels
switching from generation 20 to 19
```

切换到指定世代：

``` bash
nix-env --switch-generation 18 -p /nix/var/nix/profiles/per-user/root/channels
switching from generation 20 to 18
```

<span id="I&#039;m_working_on_a_new_package,_how_can_I_build_it_without_adding_it_to_nixpkgs?"></span>

### 我正在开发一个新软件包，如何在不将其添加到 nixpkgs 的情况下构建它？

``` bash
nix-build -E 'with import <nixpkgs> { }; callPackage ./mypackage.nix { }'
```

如果您想在 64 位系统上测试，可以将 callPackage 替换为 callPackage_i686 来构建 32 位版本的软件包。

<span id="How_can_I_compile_a_package_with_debugging_symbols_included?"></span>

### 我如何编译包含调试符号的包？

要使用 -Og 和 -g 参数构建软件包，且不去除调试符号，请使用：

``` bash
nix-build -E 'with import <nixpkgs> { }; enableDebugging fooPackage'
```

另见 <a href="Debug_Symbols" class="wikilink" title="Debug Symbols">Debug Symbols</a>

<span id="How_can_I_force_a_rebuild_from_source_even_without_modifying_the_nix_expression?"></span>

### 即使不修改 nix 表达式，我如何强制从源代码重建？

以 root 用户身份运行 nix-build 时，可以使用 --check 标志：

``` bash
sudo nix-build --check -A ncdu
```

<span id="How_can_I_manage_software_with_nix-env_like_with_configuration.nix?"></span>

### 我如何使用 nix-env 管理软件，就像使用 configuration.nix 一样？

有很多方法，其中一种如下：

1.  <span lang="en" dir="ltr" class="mw-content-ltr">Create a meta package called *userPackages* your *~/.config/nixpkgs/config.nix* file with the packages you would like to have in your environment:</span>
    ``` nix
    with (import <nixpkgs> {});
    {
      packageOverrides = pkgs: with pkgs; {
        userPackages = buildEnv {
          inherit ((import <nixpkgs/nixos> {}).config.system.path)
          pathsToLink ignoreCollisions postBuild;
          extraOutputsToInstall = [ "man" ];
          name = "user-packages";
          paths = [ vim git wget ];
        };
      };
    }
    ```
2.  <span lang="en" dir="ltr" class="mw-content-ltr">Install all specified packages using this command:</span>
    ``` bash
    nix-env -iA userPackages -f '<nixpkgs>'
    ```

<div lang="en" dir="ltr" class="mw-content-ltr">

Now you can add and remove packages from the paths list and rerun nix-env to update your user local packages.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Another way is using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.

</div>

<span id="I&#039;ve_downloaded_a_binary,_but_I_can&#039;t_run_it,_what_can_I_do?"></span>

### 我下载了一个二进制文件，但是无法运行它，我该怎么办？

<div lang="en" dir="ltr" class="mw-content-ltr">

Binaries normally do not work out of the box when you download them because they normally just assume that libraries can be found in hardcoded paths such as `/lib`. However this assumption is incorrect on NixOS systems due to the inner workings of `nix` - there is no default path, everything gets set to the corresponding version on compile time.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you are new to packaging proprietary software you should check out the <a href="Packaging_Binaries" class="wikilink" title="Packaging Binaries Tutorial">Packaging Binaries Tutorial</a>.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you are in a hurry and just want to get shit running, continue reading:  

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can use [nix-ld](https://github.com/Mic92/nix-ld) to run compiled binaries. For example, if your binary needs zlib and openssl:

</div>

``` nix
programs.nix-ld = {
  enable = true;
  libraries = [ pkgs.zlib pkgs.openssl ];
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Log out and back in to apply the environment variables it sets, and you can then directly run the binary.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you don't want to configure the list of libraries manually, a quick and dirty way to run nearly any precompiled binary is the following:

</div>

``` nix
programs.nix-ld = {
  enable = true;
  libraries = pkgs.steam-run.args.multiPkgs pkgs;
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

This uses the libraries that are used by <a href="Steam" class="wikilink" title="Steam">Steam</a> to simulate a traditional Linux FHS environment to run games in. It's a [big list](https://github.com/NixOS/nixpkgs/blob/nixos-unstable/pkgs/by-name/st/steam/package.nix) that usually contains all the libraries your binary needs to run.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Another possibility is to use [patchelf](https://nixos.org/patchelf.html) to set the library path and dynamic linker appropriately, since compiled binaries have hard-coded interpreter and require certain dynamic libraries.

</div>

``` nix
# mybinaryprogram.nix
with import <nixpkgs> {}; 
stdenv.mkDerivation rec {
  name = "somename";
  buildInputs = [ makeWrapper ];
  buildPhase = "true";
  libPath = lib.makeLibraryPath with xlibs;[ libXrandr libXinerama libXcursor ];
  unpackPhase = "true";
  installPhase = ''
    mkdir -p $out/bin
    cp ${./mybinaryprogram} $out/bin/mybinaryprogram
  '';
  postFixup = ''
    patchelf \
      --set-interpreter "$(cat $NIX_CC/nix-support/dynamic-linker)" \
      --set-rpath "${libPath}" \
      $out/bin/mybinaryprogram
  '';
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

This can be built with:

</div>

``` bash
nix-build mybinaryprogram.nix
```

<div lang="en" dir="ltr" class="mw-content-ltr">

And run with:

</div>

``` bash
./result/bin/mybinaryprogram
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Another possibility is using a FHS-compatible Sandbox with [buildFHSUserEnv](https://nixos.org/nixpkgs/manual/#sec-fhs-environments)

</div>

``` nix
# fhsUser.nix
{ pkgs ? import <nixpkgs> {} }:
(pkgs.buildFHSUserEnv {
  name = "example-env";
  targetPkgs = pkgs: with pkgs; [
    coreutils
  ];
  multiPkgs = pkgs: with pkgs; [
    zlib
    xorg.libXxf86vm
    curl
    openal
    openssl_1_0_2
    xorg.libXext
    xorg.libX11
    xorg.libXrandr
    mesa_glu
  ];
  runScript = "bash";
}).env
```

<div lang="en" dir="ltr" class="mw-content-ltr">

the sandbox can be entered with

</div>

``` bash
nix-shell fhsUser.nix
```

<div lang="en" dir="ltr" class="mw-content-ltr">

If your target application can't find shared libraries inside buildFHSUserEnv, you may run [nix-de-generate](https://github.com/lexleogryfon/de-generate) for target application inside FHS, which will generate newenv.nix file, an nix-expression of buildFHSUserEnv with resolved dependencies for shared libraries.

</div>

<span id="What_are_channels_and_how_do_they_get_updated?"></span>

### 什么是频道以及如何更新？

<div lang="en" dir="ltr" class="mw-content-ltr">

[Nixpkgs](https://github.com/NixOS/nixpkgs) is the git repository containing all packages and NixOS modules/expressions. Installing packages directly from Nixpkgs master branch is possible but a bit risky as git commits are merged into master before being heavily tested. That's where channels are useful.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A "channel" is a name for the latest "verified" git commits in Nixpkgs. Each channel has a different definition of what "verified" means. Each time a new git commit is verified, the channel declaring this verification gets updated. Contrary to an user of the git master branch, a channel user will benefit both from verified commits and binary packages from the binary cache.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Channels are reified as git branches in the [nixpkgs repository](https://github.com/NixOS/nixpkgs) and as disk images in the [channels webpage](https://nixos.org/channels/). There are several channels, each with its own use case and verification phase:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- **nixos-unstable**
  - **description** Use this when you want the latest package and module versions while still benefiting from the binary cache. You can use this channel on non-NixOS systems. This channel corresponds to NixOS’s main development branch, and may thus see radical changes between channel updates. This channel is not recommended for production systems.
  - **definition** this channel is updated depending on [release.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release.nix) and [release-lib.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-lib.nix)
- **nixos-unstable-small**
  - **description** This channel is identical to `nixos-unstable` described above, except that this channel contains fewer binary packages. This means the channel gets updated faster than `nixos-unstable` (for instance, when a critical security patch is committed to NixOS’s source tree). However, the binary cache may contain less binary packages and thus using this channel may require building more packages from source than `nixos-unstable`. This channel is mostly intended for server environments and as such contains few GUI applications.
  - **definition** this channel is updated depending on [release-small.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-small.nix) and [release-lib.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-lib.nix)
- **nixos-YY.MM** (where **YY** is a 2-digit year and **MM** is a 2-digit month, such as [*nixos-17.03*](https://nixos.org/channels/nixos-15.09/))
  - **description** These channels are called **stable** and only get conservative bug fixes and package upgrades. For instance, a channel update may cause the Linux kernel on your system to be upgraded from 3.4.66 to 3.4.67 (a minor bug fix), but not from 3.4.x to 3.11.x (a major change that has the potential to break things). Stable channels are generally maintained until the next stable branch is created.
  - **definition** this channel is updated depending on [release.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release.nix) and [release-lib.nix](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/release-lib.nix)
- **nixos-YY.MM-small** (where **YY** is a 2-digit year and **MM** is a 2-digit month, such as [nixos-15.09-small](https://nixos.org/channels/nixos-15.09-small/))
  - **description** The difference between `nixos-YY.MM-small` and `nixos-YY.MM` is the same as the one between `nixos-unstable-small` and `nixos-unstable` (see above)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Channel update works as follows:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

1.  Each channel has a particular job at **hydra.nixos.org** which must succeed:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- For NixOS: the trunk-combined [tested](http://hydra.nixos.org/job/nixos/trunk-combined/tested) job, which contains some automated NixOS tests.
- For nixos-small: the unstable-small [tested](http://hydra.nixos.org/job/nixos/unstable-small/tested) job.
- For nixpkgs: the trunk [unstable](http://hydra.nixos.org/job/nixpkgs/trunk/unstable) job, which contains some critical release packages.

</div>

2.  <span lang="en" dir="ltr" class="mw-content-ltr">Once the job succeeds at a particular nixpkgs commit, **cache.nixos.org** will download binaries from **hydra.nixos.org**.</span>
3.  <span lang="en" dir="ltr" class="mw-content-ltr">Once the above download completes, the channel updates.</span>

<div lang="en" dir="ltr" class="mw-content-ltr">

You can checkout the nixpkgs git and reset it to a particular commit of a channel. This will not affect your access to the binary cache.

</div>

<span id="How_do_I_know_where&#039;s_nixpkgs_channel_located_and_at_which_commit?"></span>

### 我如何知道 nixpkgs 频道位于哪里以及在哪个提交？

<div lang="en" dir="ltr" class="mw-content-ltr">

First `echo $NIX_PATH` to see where nix looks for the expressions. Note that nix-env uses *~/.nix-defexpr* regardless of *\$NIX_PATH*.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to know where <nixpkgs> is located:

</div>

``` bash
nix-instantiate --find-file nixpkgs
```

<div lang="en" dir="ltr" class="mw-content-ltr">

To know the commit, open the .version-suffix file in the nixpkgs location. The hash after the dot is the git commit.

</div>

<span id="Nixpkgs_branches"></span>

### Nixpkgs 分支

<div lang="en" dir="ltr" class="mw-content-ltr">

Branches on the nixpkgs repo have a relationship with channels, but that relationship is not 1:1.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Some branches are reified as channels (e.g. the `nixos-XX.YY` branches, or `nix(os|pkgs)-unstable`), whereas others are the starting point for those branches (e.g. the `master` or `release-XX.YY` branches). For example:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- When a change in master needs to be backported to the current NixOS release, it is cherry-picked into the current `release-XX.YY` branch
- <a href="Channel_branches#Channel_update_process" class="wikilink" title="Hydra">Hydra</a> picks up this change, runs tests, and if those tests pass, updates the corresponding `nixos-XX.YY` branch, which is then reified as a channel.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

So in short, the `relase-XX.YY` branches have not been run through Hydra yet, whereas the `nixos-XX.YY` ones have.

</div>

<span id="There&#039;s_an_updated_version_for_$software_on_nixpkgs_but_not_in_channels,_how_can_I_use_it?"></span>

### nixpkgs 上有 \$software 的更新版本，但在频道中没有，我该如何使用它？

<div lang="en" dir="ltr" class="mw-content-ltr">

You can jump the queue and use `nix-shell` with a `NIX_PATH` pointing to a tarball of the channel to get a shell for that software. Some building may occur. This will not work for system services.

</div>

``` command
NIX_PATH=nixpkgs=https://github.com/NixOS/nixpkgs/archive/release-17.09.tar.gz nix-shell -p $software
```

<span id="There&#039;s_an_updated_version_for_$software_on_the_unstable_branch,_but_I_use_stable,_how_can_I_use_it?"></span>

### 不稳定分支上有软件 \$software 的更新版本，但我用的是稳定版，我该如何使用它？

<div lang="en" dir="ltr" class="mw-content-ltr">

Before going ahead with this, note that firstly, this likely means that the package you intend to update has had a major version change. If you have used it previously, there is a chance that your existing data either will not work with the new version or will need to be migrated; If in doubt, consult the upstream documentation of the package.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Secondly, while you're less likely to run into issues on NixOS than on, for example, Debian when installing packages from different releases, it's not impossible.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Nix ensures that libraries and (usually) runtime dependencies of packages are kept separate, so that you can trivially have many versions of those dependencies installed, without affecting the versions of said dependencies used by important system components. This ensures that you cannot accidentally break your package manager by, say, updating Python, as is quite common on other distros.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Nix cannot however ensure that there will be no incompatibilities with services of which there can inherently be only one running instance. As an example, if you try to use a package from unstable on a stable system that requires a feature in systemd that is not yet present in the systemd version on stable, this package will not work; it's simply not possible to run two different versions of systemd simultaneously.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Nonetheless, it's quite uncommon that end-user facing applications rely on such singleton services, or at the very least they will typically have internal backwards compatibility. As such, mixing channels is usually unproblematic in practice, and even if not, NixOS' rollback features make it trivial to recover from problems should they occur.

</div>

<span id="Using_channels"></span>

#### 使用频道

<div lang="en" dir="ltr" class="mw-content-ltr">

First we need to add the unstable channel to our system channels:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

``` console
$ sudo nix-channel --add https://nixos.org/channels/nixos-unstable nixos-unstable
$ sudo nix-channel --update
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Then we can import this channel using the angle-bracket notation to refer to it:

</div>

``` nixos
# configuration.nix
{ 
  config,
  pkgsUnstable,
  ...
}: {
  # We add a new `pkgsUnstable` to the module arguments; this allows
  # us to easily use `pkgsUnstable` in other modules as well, without
  # having to evaluate it again.
  _module.args.pkgsUnstable = import <nixos-unstable> { inherit (config.nixpkgs) config; };

  environment.systemPackages = [
    # Once we have created our `pkgsUnstable`, we can easily use
    # packages from it wherever NixOS modules expect derivations
    pkgsUnstable.hello
  ];
}
```

<span id="Using_flakes"></span>

#### 使用 Flakes

<div lang="en" dir="ltr" class="mw-content-ltr">

We simply add the unstable branch to our flake inputs, and pass them into the NixOS module system using `specialArgs`:

</div>

``` nix
# flake.nix
{
  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixos-25.05/nixexprs.tar.xz";
    nixpkgs-unstable.url = "https://channels.nixos.org/nixos-unstable/nixexprs.tar.xz";
  };

  outputs = { nixpkgs, ... } @ inputs: {
    # Note that the hostname "nixos" and the system tuple used here are
    # examples.
    nixosConfigurations."nixos" = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";

      modules = [
        ./configuration.nix
      ];

      # Any attributes of `specialArgs` will be added to our NixOS module
      # arguments.
      #
      # We've bound `nixpkgs-unstable` to the `inputs` variable using the `@`
      # syntax; if we add any other flake inputs in the future those will also
      # be added to our module arguments.
      specialArgs.flake-inputs = inputs;
    };
  };
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Using this in `configuration.nix` then looks as follows:

</div>

``` nixos
# configuration.nix
{
  pkgs,
  flake-inputs,
  ...
}: {
  environment.systemPackages = [
    flake-inputs.nixpkgs-unstable.legacyPackages.${pkgs.system}.hello
  ];
}
```

<span id="How_do_I_install_a_specific_version_of_a_package_for_build_reproducibility_etc.?"></span>

### 如何安装特定版本的软件包以实现构建可重复性等？

<div lang="en" dir="ltr" class="mw-content-ltr">

See <a href="FAQ/Pinning_Nixpkgs" class="wikilink" title="FAQ/Pinning Nixpkgs">FAQ/Pinning Nixpkgs</a> and <a href="How_to_fetch_Nixpkgs_with_an_empty_NIX_PATH" class="wikilink" title="How to fetch Nixpkgs with an empty NIX PATH">How to fetch Nixpkgs with an empty NIX PATH</a>. Find the version of nixpkgs with the package version you want and pin nixpkgs to that. However, be aware that the pinning of a package of another nixpkgs version results in a much larger package size as not only the package itself but all dependencies (down to libc) have older versions.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

if you just want the old version of the single package but with new dependencies it is often easier to copy the package description into your scope and add it to your `configuration.nix` via: `mypackage-old = pkgs.callPackage ./mypackage-old.nix {};`.You can try to build the package as described in <a href="FAQ#I.27m_working_on_a_new_package.2C_how_can_I_build_it_without_adding_it_to_nixpkgs.3F" class="wikilink" title="the FAQ: building a single derivation">the FAQ: building a single derivation</a>.

</div>

<span id="An_error_occurs_while_fetching_sources_from_an_url,_how_do_I_fix_it?"></span>

### 从 URL 获取源时发生错误，我该如何修复？

<div lang="en" dir="ltr" class="mw-content-ltr">

First try to update the local nixpkgs expressions with `nix-channel --update` (these describe where to download sources from and how to build them). Try your build again and the url might have already been correctly updated for the package in question. You can also subscribe the unstable channel (which includes the most up-to-date expressions) with `nix-channel --add `[`http://nixos.org/channels/nixpkgs-unstable`](http://nixos.org/channels/nixpkgs-unstable), update and try the build again.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If that fails you can update the url in the nix expression yourself. <a href="#How_do_I_know_where&#39;s_nixpkgs_channel_located_and_at_which_commit?" class="wikilink" title="Navigate to your channel&#39;s expressions">Navigate to your channel's expressions</a> and find the package in one of the subdirectories. Edit the respective *default.nix* file by altering the *url* and *sha256*. You can use `nix-prefetch-url url` to get the SHA-256 hash of source distributions.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If the shell complains that you do not have write privileges for the file system, you will have to enable them.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

start a new shell with a private mount namespace (Linux-only)

</div>

``` bash
sudo unshare -m bash
```

<div lang="en" dir="ltr" class="mw-content-ltr">

remount the filesystem with write privileges (as root)

</div>

``` bash
mount -o remount,rw /nix/store
```

<div lang="en" dir="ltr" class="mw-content-ltr">

update the file

</div>

``` bash
nano <PATH_TO_PACKAGE>/default.nix
```

<div lang="en" dir="ltr" class="mw-content-ltr">

exit to shell where /nix/store is still mounted read-only

</div>

``` bash
exit
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Be sure to [report the incorrect url](https://github.com/NixOS/nixpkgs/issues) or [fix it yourself](https://github.com/NixOS/nixpkgs/pulls).

</div>

<span id="How_do_I_know_the_sha256_to_use_with_fetchgit,_fetchsvn,_fetchbzr_or_fetchcvs?"></span>

### 我如何知道要与 fetchgit、fetchsvn、fetchbzr 或 fetchcvs 一起使用的 sha256？

<div lang="en" dir="ltr" class="mw-content-ltr">

Install `nix-prefetch-scripts` and use the corresponding nix prefetch helper.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For instance to get the checksum of a git repository use:

</div>

``` bash
nix-prefetch-git https://git.zx2c4.com/password-store
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Or, use `lib.fakeHash` as the fetcher's hash argument, and attempt to build; Nix will tell you the actual and expected hash's mismatch, and you may copy the actual hash.

</div>

<span id="Should_I_use_http://hydra.nixos.org/_as_a_binary_cache?"></span>

### 我应该使用 <http://hydra.nixos.org/> 作为二进制缓存吗？

不可以。截至 2017 年，所有构建工件都直接推送到 <http://cache.nixos.org/> 并在那里可用，因此将 <http://hydra.nixos.org/> 设置为二进制缓存不再具有任何功能。

<span id="I&#039;m_trying_to_install_NixOS_but_my_WiFi_isn&#039;t_working_and_I_don&#039;t_have_an_ethernet_port"></span>

### 我正在尝试安装 NixOS，但我的 WiFi 无法使用，而且我没有以太网端口

<div lang="en" dir="ltr" class="mw-content-ltr">

Most phones will allow you to share your WiFi connection over USB. On Android you can enable this setting via *Settings* \> *Wireless & Networks* / More ... \> *Tethering & portable hotspot* \> *USB tethering*. This should be enough to allow you to install NixOS, and then fix your WiFi. iPhones only let you tether using your data connection rather than WiFi.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

It is also possible to build a custom NixOS installation ISO containing all the dependencies needed for an offline installation, but the default installation ISOs require internet connectivity.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

For connecting to your WiFi, see <a href="NixOS_Installation_Guide#Wireless" class="wikilink" title="NixOS_Installation_Guide#Wireless">NixOS_Installation_Guide#Wireless</a>

</div>

<span id="How_can_I_disable_the_binary_cache_and_build_everything_locally?"></span>

### 我如何禁用二进制缓存并在本地构建所有内容？

<div lang="en" dir="ltr" class="mw-content-ltr">

Set the binary caches to an empty list: `nix.binaryCaches = [];` in `configuration.nix` or pass ad-hoc `--option binary-caches ''` as parameter to nix-build or its wrappers.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This is also useful to make simple configuration changes in NixOS (ex.: network related), when no network connectivity is available:

</div>

``` bash
nixos-rebuild switch --option binary-caches ''
```

<span id="How_do_I_enable_sandboxed_builds_on_non-NixOS?"></span>

### 如何在非 NixOS 上启用沙盒构建？

<div lang="en" dir="ltr" class="mw-content-ltr">

Two options have to be added to make sandboxed builds work on Nix, *build-use-sandbox* and *build-sandbox-paths*:

</div>

``` nix
# /etc/nix/nix.conf
build-use-sandbox = true
build-sandbox-paths = $(nix-store -qR $(nix-build '<nixpkgs>' -A bash) | xargs echo /bin/sh=$(nix-build '<nixpkgs>' -A bash)/bin/bash)
```

<div lang="en" dir="ltr" class="mw-content-ltr">

On NixOS set the following in *configuration.nix*:

</div>

``` nix
nix.settings.sandbox = true;
```

<div lang="en" dir="ltr" class="mw-content-ltr">

See <a href="Nix_package_manager#Sandbox_builds" class="wikilink" title="Nix package manager#Sandbox_builds">Nix package manager#Sandbox_builds</a> for more details.

</div>

<span id="How_can_I_install_a_package_from_unstable_while_remaining_on_the_stable_channel?"></span>

### 我如何在稳定频道上安装来自不稳定频道的软件包？

<div lang="en" dir="ltr" class="mw-content-ltr">

If you simply want to run a *nix-shell* with a package from unstable, you can run a command like the following:

</div>

``` bash
nix-shell -I nixpkgs=channel:nixpkgs-unstable -p somepackage
```

<div lang="en" dir="ltr" class="mw-content-ltr">

It is possible to have multiple nix-channels simultaneously. To add the unstable channel with the specifier *unstable*,

</div>

``` bash
sudo nix-channel --add https://nixos.org/channels/nixos-unstable nixos-unstable
```

<div lang="en" dir="ltr" class="mw-content-ltr">

After updating the channel

</div>

``` bash
sudo nix-channel --update nixos-unstable
```

<div lang="en" dir="ltr" class="mw-content-ltr">

queries via `nix-env` will show packages from both *stable* and *unstable*. Use this to install unstable packages into your user environment. The following snippet shows how this can be done in *configuration.nix*.

</div>

``` nix
{ config, pkgs, ... }:
let
  unstable = import <nixos-unstable> {};
in {
  environment.systemPackages = [ unstable.PACKAGE_NAME ];
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

This only changes what version of `PACKAGE_NAME` is available on `$PATH`. If the package you want to take from unstable is installed through a NixOS module, you must use <a href="overlays" class="wikilink" title="overlays">overlays</a>:

</div>

``` nix
{ config, pkgs, ... }:
let
  unstable = import <nixos-unstable> {};
in {
  nixpkgs.overlays = [
    (self: super: {
       PACKAGE_NAME = unstable.PACKAGE_NAME;
    })
  ];
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Note that this will rebuild all packages depending on the overlaid package, which may be a lot. Some modules offer a `services.foo.package` to change the actual derivation used by the module without and overlay, and without recompiling dependencies ([example](https://nixos.org/manual/nixos/stable/options.html#opt-services.gvfs.package)).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want to install unfree packages from unstable you need to also set allowUnfree by replacing the import statment above with:

</div>

``` nix
import <nixos-unstable> { config = { allowUnfree = true; }; }
```

<span id="I&#039;m_unable_to_connect_my_USB_HDD_|_External_HDD_is_failing_to_mount_automatically"></span>

### 我无法连接我的 USB HDD \| 外部 HDD 无法自动安装

<div lang="en" dir="ltr" class="mw-content-ltr">

**Note:** If you're using a kernel with at least version 5.6, you don't need to explicitly add this.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

exfat is not supported in NixOS by default - since there are legality issues still with exFAT filesystem.

</div>

``` bash
su nano /etc/nixos/configuration.nix
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Add this line to your configuration file.

</div>

``` bash
boot.extraModulePackages = [ config.boot.kernelPackages.exfat-nofuse ];
```

<div lang="en" dir="ltr" class="mw-content-ltr">

After saving the file rebuild NixOS:

</div>

``` bash
nixos-rebuild switch
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Restart NixOS.

</div>

<span id="What_is_the_origin_of_the_name_&quot;Nix&quot;"></span>

### “Nix” 这个名字的由来

<div lang="en" dir="ltr" class="mw-content-ltr">

The name `Nix` comes from the Dutch word [niks](https://en.wiktionary.org/wiki/nix) which means *nothing*. It reflects the fact that Nix derivations do not have access to anything that has not been explicitly declared as an input.[^1]

</div>

<span id="What_does_it_mean_to_say_that_NixOS_is_&quot;immutable&quot;"></span>

### NixOS 中的“不可变”是什么意思

<div lang="en" dir="ltr" class="mw-content-ltr">

Immutability is a property of data, in general, which means that the data cannot be modified after it is created. In the context of an operating system, it really means that certain parts of the system have this property. In the case of Nix and NixOS, that includes the Nix store, where files can be created but not modified after the time they are created. It does not apply to every part of the operating system, in that users can still modify their own files in their home directory, for example.

</div>

<span id="I&#039;m_getting_‘infinite_recursion’_errors_when_trying_to_do_something_clever_with_imports"></span>

### 当我尝试使用 `imports` 做一些巧妙的事情时，我得到了“无限递归”（infinite recursion）错误

<div lang="en" dir="ltr" class="mw-content-ltr">

Evaluating the `imports` attribute of a NixOS module (such as configuration.nix) is a prerequisite for evaluating just about everything else, so trying anything clever with `imports` is a common source of infinite recursion (because the evaluator can't determine the values of packages and options without knowing what is imported, and can't determine what is imported without knowing the values of packages or options).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You should not try to conditionally import other modules based on other values. Make your imports unconditional, and make the modules that you're importing have conditional *behavior* based on the values of options.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

If it helps, think of `imports` as akin to an `#include` directive in C.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

(Note that none of this applies to the [`import` built-in Nix language function](https://nix.dev/manual/nix/stable/language/builtins#builtins-import), which is its own thing.)

</div>

<span id="References"></span>

## 参考

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>

[^1]: Eelco Dolstra et al. “Nix: A Safe and Policy-Free System for Software Deployment.” LiSA (2004), <https://pdfs.semanticscholar.org/5fd8/8f89bd8738816e62808a1b7fb12d3ab14a2f.pdf>
