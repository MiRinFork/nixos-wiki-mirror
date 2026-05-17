<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dwm -->

`dwm` is a window manager made by the suckless team.

## Installation

Enable `dwm` in your system configuration:

``` nix
services.xserver.windowManager.dwm.enable = true;
```

## Creating an override

### Patching dwm

To patch dwm, override `services.xserver.windowManager.dwm.package` as below:

``` nix
services.xserver.windowManager.dwm.package = pkgs.dwm.override {
  patches = [
    # for local patch files, replace with relative path to patch file
    ./path/to/local.patch
    # for external patches
    (pkgs.fetchpatch {
      # replace with actual URL
      url = "https://dwm.suckless.org/patches/path/to/patch.diff";
      # replace hash with the value from `nix-prefetch-url "https://dwm.suckless.org/patches/path/to/patch.diff" | xargs nix hash to-sri --type sha256`
      # or just leave it blank, rebuild, and use the hash value from the error
      hash = "";
    })
  ];
};
```

### Using custom sources

If you have a locally stored source tree for dwm with changes already applied, you can use that instead:

``` nix
services.xserver.windowManager.dwm.package = pkgs.dwm.overrideAttrs {
  src = ./path/to/dwm/source/tree;
};
```

Alternatively, you can set `src` to [the output of a fetcher](https://nixos.org/manual/nixpkgs/stable/#chap-pkgs-fetchers), if you have the source tree stored online.

## Troubleshooting

If your change does not appear to take effect:

- You must **not** have `dwm` listed anywhere in your `environment.systemPackages` or `home.packages`.
- Remove any packages installed via `nix-env` or `nix profile`.
- After rebuilding and switching, reboot and check again.

## See also

- <a href="St" class="wikilink" title="St">St</a>
- [DMenu](https://tools.suckless.org/dmenu/)

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
