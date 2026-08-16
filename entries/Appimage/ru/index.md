<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Appimage/ru -->

<languages/>

<div class="mw-translate-fuzzy">

[AppImage](https://appimage.org/) - тип монолитных пакетов для приложений Linux. Содержит все зависимости приложения в одном файле, состоящем из исполняемого файла и встроенной файловой системы.

</div>

<span id="Usage"></span>

## Использование

<span id="Run"></span>

### Запуск

В большинстве дистрибутивов все, что нужно сделать, это загрузить файл `.AppImage`, сделать его исполняемым `chmod +x $AppImage` и выполнить его. Однако это не работает в NixOS «из коробки», поскольку файлы AppImage обычно (если не всегда) зависят от определенных библиотек находящихся в жёстко заданных путях.

``` shell
$ nix-shell -p appimage-run
$ appimage-run path/to/application.AppImage
```

<div lang="en" dir="ltr" class="mw-content-ltr">

##### Appimage apps cannot access host fonts, icons and themes

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

See: <a href="Fixes_for_non-Nix_applications#Flatpak,_Distrobox,_Appimage_and_other_non-Nix_applications_can&#39;t_find_system_fonts/icons/themes" class="wikilink" title="Fixes for non-Nix applications#Flatpak, Distrobox, Appimage and other non-Nix applications can&#39;t find system fonts/icons/themes">Fixes for non-Nix applications#Flatpak, Distrobox, Appimage and other non-Nix applications can't find system fonts/icons/themes</a>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

##### Additional Packages

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Some appimages still have issues, so you can override for additional pkgs such as

</div>

``` nix
programs.appimage.enable = true;
programs.appimage.binfmt = true;
programs.appimage.package = pkgs.appimage-run.override 
{
  extraPkgs = pkgs: 
  [
    pkgs.icu
    pkgs.libxcrypt-legacy
    pkgs.python312
    pkgs.python312Packages.torch
  ]; 
};
```

<span id="Packaging"></span>

### Создание AppImage

<div class="mw-translate-fuzzy">

См. руководство [Nixpkgs manual on wrapping AppImage packages](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-appimageTools). Если кратко, AppImage извлекается, а все зависимости добавляются в качестве зависимостей сборки nix. Следующий пример представляет собой производную для программы Quba, которая также распространяется в виде AppImage.

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

## Настройка

<span id="Register_AppImage_files_as_a_binary_type_to_binfmt_misc"></span>

## Зарегистрируйте файлы AppImage как исполняемый тип в binfmt_misc

<div class="mw-translate-fuzzy">

Вы можете указать ядру Linux использовать интерпретатор (например, `appimage-run`) при выполнении определенных двоичных файлов через использование [binfmt_misc](https://en.wikipedia.org/wiki/Binfmt_misc#External_links), либо по расширению имени файла, либо по совпадению магических чисел. Приведенная ниже конфигурация NixOS регистрирует файлы AppImage (ELF-файлы с магическим числом "AI" + 0x02) для запуска с помощью `appimage-run` в качестве интерпретатора.

</div>

``` nixos
programs.appimage = {
  enable = true;
  binfmt = true;
};
```

<div class="mw-translate-fuzzy">

Таким образом файлы AppImage могут вызываться напрямую, как если бы они были обычными программами

</div>

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
