<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Shell scripts/zh -->

<languages/>

函数 `writeShellScript` 可用于向 Nix 表达式中添加 Shell 脚本。

``` nix
someBuildHelper = { name, sha256 }:
  stdenv.mkDerivation {
    inherit name;
    outputHashMode = "recursive";
    outputHashAlgo = "sha256";
    outputHash = sha256;
    builder = writeShellScript "builder.sh" ''
      echo "hi, my name is ''${0}" # escape bash variable
      echo "hi, my hash is ${sha256}" # use nix variable
      echo "hello world" >output.txt
    '';
  };
```

<span id="External_builder.sh_script"></span>

## 外部 builder.sh 脚本

较长的 Bash 脚本通常会保存为外部脚本文件，并在 Nix 中调用：

另见：

- [创造一个无源 derivation](https://github.com/NixOS/nixpkgs/issues/23099)
- [Nix Pills: 第 7 章. 制作 Derivation](https://nixos.org/guides/nix-pills/working-derivation.html)

### runCommand + builder.sh

除了使用 `stdenv.mkDerivation` 之外，还可以通过 `runCommand` 来调用外部的 Bash 脚本：

<span id="Packaging"></span>

## 打包

示例：

``` nix
# nix-build -E 'with import <nixpkgs> { }; callPackage ./default.nix { }'

{ stdenv
, lib
, fetchFromGitHub
, bash
, subversion
, makeWrapper
}:
  stdenv.mkDerivation {
    pname = "github-downloader";
    version = "08049f6";
    src = fetchFromGitHub {
      # https://github.com/Decad/github-downloader
      owner = "Decad";
      repo = "github-downloader";
      rev = "08049f6183e559a9a97b1d144c070a36118cca97";
      sha256 = "073jkky5svrb7hmbx3ycgzpb37hdap7nd9i0id5b5yxlcnf7930r";
    };
    buildInputs = [ bash subversion ];
    nativeBuildInputs = [ makeWrapper ];
    installPhase = ''
      mkdir -p $out/bin
      cp github-downloader.sh $out/bin/github-downloader.sh
      wrapProgram $out/bin/github-downloader.sh \
        --prefix PATH : ${lib.makeBinPath [ bash subversion ]}
    '';
  }
```

`wrapProgram` 会将原始脚本移动到 `.github-downloader.sh-wrapped`。

<span id="Command_not_found"></span>

### 命令未找到

例如，脚本会抛出错误 `svn: command not found`，这是因为缺少依赖包 `subversion`。

当某个命令缺失时，可以使用 `nix-locate` 来查找对应的软件包名称。例如，`stat` 命令：

``` console
$ nix-locate bin/stat | grep 'bin/stat$'
coreutils.out       0 s /nix/store/vr96j3cxj75xsczl8pzrgsv1k57hcxyp-coreutils-8.31/bin/stat
```

<span id="Debugging_embedded_scripts"></span>

## 调试嵌入脚本

当 Bash 脚本执行失败时，它只会输出错误信息，而不会显示出错的代码位置。

要跟踪命令和行号，可以使用

``` console
$ nix-build -E 'with import <nixpkgs> { }; callPackage ./test-trace.nix { }'
this derivation will be built:
  /nix/store/2v5biwny8plpyk2bv6cfr41ppp0a1i4k-output.txt.drv
building '/nix/store/2v5biwny8plpyk2bv6cfr41ppp0a1i4k-output.txt.drv'...
++ Line 9: echo hello
++ Line 11: set +o xtrace
/nix/store/ppidmnpd5m762x9kqj8jd3g7df7dknrz-output.txt
```

## POSIX shell

某些环境（例如基于 BusyBox 的 OpenWRT）仅提供“受限” Shell（使用 `sh` 而非 `bash`）

在 NixOS 上，POSIX shells 由软件包 `dash` 和 `posh` 提供。

<span id="See_also"></span>

## 另见

- <a href="Nix-shell_shebang" class="wikilink" title="Nix-shell shebang">Nix-shell shebang</a>
- [Nixpkgs 手册中的 Shell 函数章节](https://nixos.org/manual/nixpkgs/stable/#ssec-stdenv-functions)
- [nix-shell 和 Shebang 行](https://gist.github.com/travisbhartwell/f972aab227306edfcfea)
- [使用 Nix 的 Shell 脚本](https://ertt.ca/nix/shell-scripts/)

<a href="Category:Development{{#translation:}}" class="wikilink" title="Shell scripts">Shell scripts</a> <a href="Category:Shell{{#translation:}}" class="wikilink" title="Shell scripts">Shell scripts</a>
