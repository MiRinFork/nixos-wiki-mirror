<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vivaldi -->

[Vivaldi](https://vivaldi.com) is a web browser by the Norwegian company Vivaldi Technologies.

## Installation

Simply <a href="Adding_programs_to_PATH" class="wikilink" title="install">install</a> the `vivaldi` package.

## Get it working with KDE Plasma 6

Currently Vivaldi crashes at startup on KDE Plasma 6 due to improper packaging.[^1] A workaround for this is to override the package attributes like the following.

``` nix
(vivaldi.overrideAttrs (oldAttrs: {
  dontWrapQtApps = false;
  dontPatchELF = true;
  nativeBuildInputs = oldAttrs.nativeBuildInputs ++ [pkgs.kdePackages.wrapQtAppsHook];
}))
```

## Force use of password store (KWallet, GNOME Keyring)

To force of specific password store you will have to use flags according to [chromium docs](https://chromium.googlesource.com/chromium/src/+/master/docs/linux/password_storage.md).

Below is an example that modifies the package attributes. Use `gnome-libsecret` for GNOME Keyring and `kwallet6` for KDE Plasma 6

``` nix
(vivaldi.override {
  commandLineArgs = "--password-store=kwallet6";
})
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Browser" class="wikilink" title="Category:Web Browser">Category:Web Browser</a>

[^1]: <https://github.com/NixOS/nixpkgs/pull/292148>

    <https://github.com/NixOS/nixpkgs/issues/310755>
