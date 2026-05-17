<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Appimage/zh -->

<languages/> [AppImage](https://appimage.org/) 是一种 Linux 应用程序的单体打包格式。它将所有依赖项都包含在一个文件中，该文件由一个可执行文件和一个附加的文件系统组成。

<span id="Usage"></span>

## 用法

<span id="Run"></span>

### 运行

在大多数发行版中，只需下载 `.AppImage` 文件，使用 `chmod +x $AppImage` 使其可执行，然后执行即可。但这在 NixOS 中无法直接使用，因为 AppImage 文件通常（即使并非总是）依赖于硬编码路径中的某些系统库。

``` shell
$ nix-shell -p appimage-run
$ appimage-run $AppImageFile
```

<span id="Packaging"></span>

### 打包

请参阅 [nixpkgs 手册中包装 AppImage 软件的部分](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-appimageTools)。简而言之，提取 AppImage，并将所有依赖项添加为 Nix 构建依赖项。 以下示例是 Quba 程序的 Derivation，它以 AppImage 的形式分发。

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

## 配置

<span id="Register_AppImage_files_as_a_binary_type_to_binfmt_misc"></span>

### 将 AppImage 文件作为二进制类型注册到 binfmt_misc

您可以通过 [binfmt_misc](https://en.wikipedia.org/wiki/Binfmt_misc#External_links) 来告诉 <a href="Special:MyLanguage/Linux_kernel" class="wikilink" title="Linux 内核">Linux 内核</a>在执行某些二进制文件时使用哪个解释器（例如 `appimage-run`），具体方式可以通过文件扩展名或魔数匹配来实现。下面的 NixOS 配置会注册 AppImage 文件（魔数为“AI”+ 0x02 的 ELF 文件），并使用 `appimage-run` 作为解释器运行：

``` nixos
programs.appimage = {
  enable = true;
  binfmt = true;
};
```

这样 AppImage 文件就可以像普通程序一样直接调用

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
