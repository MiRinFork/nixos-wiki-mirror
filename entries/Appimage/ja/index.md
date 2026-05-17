<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Appimage/ja -->

<languages/>

<div lang="en" dir="ltr" class="mw-content-ltr">

[AppImage](https://appimage.org/) is a monolithic packaging format for linux applications. It contains all dependencies in one file that is composed of an executable with a tacked on filesystem.

</div>

<span id="Usage"></span>

## 使い方

<span id="Run"></span>

### 実行

ほとんどのLinuxディストリビューションでは、`.AppImage`ファイルをダウンロードし、それを実行可能ファイル`chmod +x $AppImage`にして実行するだけです。ただし、AppImageファイルは通常（常にではないにしても）ハードコードされたパス内の特定のシステムライブラリに依存するため、NixOSではそのままでは機能しません。

``` shell
$ nix-shell -p appimage-run
$ appimage-run $AppImageFile
```

<span id="Packaging"></span>

### パッケージング

<div class="mw-translate-fuzzy">

[nixpkgs manual on wrapping AppImage packages](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-appimageTools)を参照してください。要するに、AppImageが抽出され、依存関係がnixビルド依存関係として追加されます。 次の例は、AppImageとしても配布されているプログラム、Qubaの派生です。

</div>

``` nix
{
  lib,
  appimageTools,
  fetchurl,
}:

let
  version = "1.4.0";
  pname = "quba";

  src = fetchurl {
    url = "https://github.com/ZUGFeRD/quba-viewer/releases/download/v${version}/Quba-${version}.AppImage";
    hash = "sha256-EsTF7W1np5qbQQh3pdqsFe32olvGK3AowGWjqHPEfoM=";
  };

  appimageContents = appimageTools.extractType1 { inherit name src; };
in
appimageTools.wrapType2 rec {
  inherit pname version src;

  extraInstallCommands = ''
    substituteInPlace $out/share/applications/${pname}.desktop \
      --replace-fail 'Exec=AppRun' 'Exec=${meta.mainProgram}'
  '';

  meta = {
    description = "Viewer for electronic invoices";
    homepage = "https://github.com/ZUGFeRD/quba-viewer";
    downloadPage = "https://github.com/ZUGFeRD/quba-viewer/releases";
    license = lib.licenses.asl20;
    sourceProvenance = with lib.sourceTypes; [ binaryNativeCode ];
    maintainers = with lib.maintainers; [ onny ];
    platforms = [ "x86_64-linux" ];
  };
}
```

<span id="Configuration"></span>

## 設定

<span id="Register_AppImage_files_as_a_binary_type_to_binfmt_misc"></span>

### AppImageファイルタイプをバイナリタイプとしてbinfmt_miscに登録する

<div lang="en" dir="ltr" class="mw-content-ltr">

You can tell the <a href="Linux_kernel" class="wikilink" title="Linux kernel">Linux kernel</a> to use an interpreter (e.g. `appimage-run`) when executing certain binary files through the use of [binfmt_misc](https://en.wikipedia.org/wiki/Binfmt_misc#External_links), either by filename extension or magic number matching. Below NixOS configuration registers AppImage files (ELF files with magic number "AI" + 0x02) to be run with `appimage-run` as interpreter:

</div>

``` nixos
programs.appimage = {
  enable = true;
  binfmt = true;
};
```

この方法では、AppImageファイルを通常のプログラムのように直接呼び出すことができます。

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
