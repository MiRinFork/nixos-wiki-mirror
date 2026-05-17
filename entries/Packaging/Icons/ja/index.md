<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Packaging/Icons/ja -->

<languages /> <span id="Application_icons"></span>

## アプリケーションアイコン

アプリケーションアイコンは`$out/share/icons/hicolor`にインストールされる必要があります。

<div lang="en" dir="ltr" class="mw-content-ltr">

Example code for the now outdated [scribus v1.4](https://github.com/nixos/nixpkgs/blob/c8e5c5c2228ddd58f01b7229e0bb4a92a9585990/pkgs/applications/office/scribus/1_4.nix) app:

</div>

``` nix
{ lib
, stdenv
, fetchurl
, imagemagick
}:

let
  icon = fetchurl {
    url = "https://gist.githubusercontent.com/ejpcmac/a74b762026c9bc4000be624c3d085517/raw/18edc497c5cb6fdeef1c8aede37a0ee68413f9d3/scribus-icon-centered.svg";
    sha256 = "0hq3i7c2l50445an9glhhg47kj26y16svfajc6naqn307ph9vzc3";
  };
in

stdenv.mkDerivation rec {
  pname = "scribus";

  nativeBuildInputs = [
    imagemagick # convert
  ];

  # ...

  postInstall = ''
    for i in 16 24 48 64 96 128 256 512; do
      mkdir -p $out/share/icons/hicolor/''${i}x''${i}/apps
      convert -background none -resize ''${i}x''${i} ${icon} $out/share/icons/hicolor/''${i}x''${i}/apps/${pname}.png
    done
  '';

}
```

`-background none`は背景が透明なアイコンを作成します。 代替案：`-background white`

<span id="See_also"></span>

### 参考

<div lang="en" dir="ltr" class="mw-content-ltr">

Another example handling icons [obsidian](https://github.com/NixOS/nixpkgs/blob/6d8e9b4f6197f7ce5106069f13debfc8e9b1fa8b/pkgs/applications/misc/obsidian/default.nix#L62).

</div>
