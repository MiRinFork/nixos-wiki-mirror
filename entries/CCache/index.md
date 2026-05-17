<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: CCache -->

CCache is useful for <a href="Packaging" class="wikilink" title="Packaging">Packaging</a> large packages with <a href="Incremental_builds" class="wikilink" title="Incremental builds">Incremental builds</a>.

With CCache, recompile time can be reduced from many hours to a few minutes.

## NixOS

On NixOS, the `programs.ccache` module can be used to partially enable CCache.

``` nix
programs.ccache.enable = true;
```

However, without specifying `programs.ccache.packageNames` the CCache wrapper is not configured. The wrapper configuration can be added to your Nix overlays.

``` nix
nixpkgs.overlays = [
  (self: super: {
    ccacheWrapper = super.ccacheWrapper.override {
      extraConfig = ''
        export CCACHE_COMPRESS=1
        export CCACHE_DIR="${config.programs.ccache.cacheDir}"
        export CCACHE_UMASK=007
        if [ ! -d "$CCACHE_DIR" ]; then
          echo "====="
          echo "Directory '$CCACHE_DIR' does not exist"
          echo "Please create it with:"
          echo "  sudo mkdir -m0770 '$CCACHE_DIR'"
          echo "  sudo chown root:nixbld '$CCACHE_DIR'"
          echo "====="
          exit 1
        fi
        if [ ! -w "$CCACHE_DIR" ]; then
          echo "====="
          echo "Directory '$CCACHE_DIR' is not accessible for user $(whoami)"
          echo "Please verify its access permissions"
          echo "====="
          exit 1
        fi
      '';
    };
  })
];
```

The CCache directory also needs to be added to the builder sandboxes.

``` nix
nix.settings.extra-sandbox-paths = [ config.programs.ccache.cacheDir ];
```

Run `sudo nixos-rebuild switch` to enable these options before attempting to use CCache for a derivation.

### Derivation CCache

Packages can built with CCache by overriding `stdenv` in the derivation.

``` nix
nixpkgs.overlays = [
  (self: super: {
    ffmpeg = super.ffmpeg.override { stdenv = super.ccacheStdenv; };
  })
];
```

Some packages do not use `stdenv` directly. You may need to plumb it through other dependencies first.

Note, that if the package is a top-level package, you may instead add it to the `programs.ccache.packageNames` list.

``` nix
programs.ccache.packageNames = [ "ffmpeg" ];
```

### System CCache

todo

### Monitor CCache

The NixOS module creates a script that can be used to monitor the CCache directory without sudo.

    nix-ccache --show-stats

## Non-NixOS

Create the cache folder:

    sudo mkdir -m0770 -p /nix/var/cache/ccache

    # Linux
    sudo chown --reference=/nix/store /nix/var/cache/ccache

    # macOS workaround for chown --reference
    nix-shell -p coreutils --run 'sudo chown --reference=/nix/store /nix/var/cache/ccache'

Add the path to the derivation sandbox by adding `extra-sandbox-paths` to `nix.conf`

    extra-sandbox-paths = /nix/var/cache/ccache

Then configure the CCache wrapper script.

``` nix
nixpkgs.overlays = [
  (self: super: {
    ccacheWrapper = super.ccacheWrapper.override {
      extraConfig = ''
        export CCACHE_COMPRESS=1
        export CCACHE_DIR="/nix/var/cache/ccache"
        export CCACHE_UMASK=007
        if [ ! -d "$CCACHE_DIR" ]; then
          echo "====="
          echo "Directory '$CCACHE_DIR' does not exist"
          echo "Please create it with:"
          echo "  sudo mkdir -m0770 '$CCACHE_DIR'"
          echo "  sudo chown root:nixbld '$CCACHE_DIR'"
          echo "====="
          exit 1
        fi
        if [ ! -w "$CCACHE_DIR" ]; then
          echo "====="
          echo "Directory '$CCACHE_DIR' is not accessible for user $(whoami)"
          echo "Please verify its access permissions"
          echo "====="
          exit 1
        fi
      '';
    };
  })
];
```

### Derivation CCache

Packages can built with CCache by overriding `stdenv` in the derivation.

``` nix
nixpkgs.overlays = [
  (self: super: {
    ffmpeg = super.ffmpeg.override { stdenv = super.ccacheStdenv; };
  })
];
```

Some packages do not use `stdenv` directly. You may need to plumb it through other dependencies first.

### Monitor CCache status

    # watch ccache size
    sudo watch du -sh /nix/var/cache/ccache

    # watch ccache stats
    sudo watch ccache --dir /nix/var/cache/ccache --show-stats

## Sloppiness

By default, `stdenv` inserts `-frandom-seed` C compiler flag with a value that changes whenever the derivation hash has changed. Consequently, this behavior completely defeats any usage of `ccacheWrapper` To counterpart this behavior, add the following line to the ccache config (typically `/var/cache/ccache/ccache.conf`):

    sloppiness = random_seed

Be warned that this configuration option might affect reproducibility of builds, and could lead to cache poisoning. See [issue 109033](https://github.com/NixOS/nixpkgs/issues/109033) for more details.

## See also

- <https://leanprover.github.io/lean4/doc/make/nix.html>
- [sandbox-paths in nix.conf](https://nixos.org/manual/nix/stable/command-ref/conf-file.html)

<a href="Category:_Development" class="wikilink" title="Category: Development">Category: Development</a>
