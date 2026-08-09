<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Appimage/en -->

<languages/> [AppImage](https://appimage.org/) is a monolithic packaging format for linux applications. It contains all dependencies in one file that is composed of an executable with a tacked on filesystem.

## Usage

### Run

On most distros, all one has to do is download the `.AppImage` file, make it executable `chmod +x $AppImage`, and execute it. This doesn't work in NixOS out of the box though, as AppImage files usually (if not always) depend on certain system libraries in hardcoded paths.

``` shell
$ nix-shell -p appimage-run
$ appimage-run path/to/application.AppImage
```

##### Additional Packages

Some appimages still have issues, so you can override for additional pkgs such as

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

### Packaging

See the [nixpkgs manual on wrapping AppImage packages](https://nixos.org/manual/nixpkgs/stable/#sec-pkgs-appimageTools). In short, the AppImage is extracted and any dependencies are added as Nix build dependencies. Following example is a derivation for the program Quba, which is also distributed as AppImage.

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

## Configuration

### Register AppImage files as a binary type to binfmt_misc

You can tell the <a href="Linux_kernel" class="wikilink" title="Linux kernel">Linux kernel</a> to use an interpreter (e.g. `appimage-run`) when executing certain binary files through the use of [binfmt_misc](https://en.wikipedia.org/wiki/Binfmt_misc#External_links), either by filename extension or magic number matching. Below NixOS configuration registers AppImage files (ELF files with magic number "AI" + 0x02) to be run with `appimage-run` as interpreter:

``` nixos
programs.appimage = {
  enable = true;
  binfmt = true;
};
```

This way AppImage files can be invoked directly as if they were normal programs.

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a>
