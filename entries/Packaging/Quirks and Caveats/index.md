<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Packaging/Quirks and Caveats -->

This article is about the quirks on how to package software where the source code is available.

A good start for packaging your first piece if software is the [Quickstart Chapter in the nixpkgs manual](http://nixos.org/nixpkgs/manual/#chap-quick-start) Also see the <a href="Generic_Algorithm_on_Doing_Packaging" class="wikilink" title="Generic Algorithm on doing Packaging">Generic Algorithm on doing Packaging</a>

For packaging executable without building them from source check out the article <a href="Packaging_Binaries" class="wikilink" title="Packaging Binaries">Packaging Binaries</a>.

## Build software with Autotools

Add `autoreconfHook` to `nativeBuildInputs` to automatically build software which uses `automake` and `autoconf`:

``` nix
nativeBuildInputs = [ ...  autoreconfHook ];
```

Examples in nixpkgs:

- [samplicator](https://github.com/NixOS/nixpkgs/blob/f4c253ff2f68fbe3e302f944e8347233d9dc8c9d/pkgs/tools/networking/samplicator/default.nix)

## Configure Scripts that are using pkg-config

Some configure scripts are using `pkg-config` to determine the location of libraries and headers. Nixpkgs supports this by adding `pkg-config` to `nativeBuildInputs`

``` nix
nativeBuildInputs = [ ...  pkg-config ];
```

Examples in nixpkgs:

- [libmms](https://github.com/NixOS/nixpkgs/blob/96d41e393da3ca27fbcc7c82b7221a5c923460c0/pkgs/development/libraries/libmms/default.nix#L13)

One typical error when `pkg-config` is required but not in the `nativeBuildInputs` is the following during the configure phase:

``` shell
./configure: line 20832: syntax error near unexpected token `nss,'
./configure: line 20832: `                      PKG_CHECK_MODULES(nss, nss)'
```

## Package simple python scripts

For scripts like a single Python file, it is not necessary to specify `src` in `mkDerivation`. When you want to use `buildPythonPackage` the sources need to provide a `setup.py` file which also is overkill for a lot of projects. The default `mkDerivation` will attempt to unpack your source code. This can be prevented by applying `unpackPhase = ":";` (`:` is a no-op in shell scripts).

``` nix
myscript-package = pkgs.stdenv.mkDerivation {
  name = "myscript";
  buildInputs = [
    (pkgs.python36.withPackages (pythonPackages: with pythonPackages; [
      consul
      six
      requests
    ]))
  ];
  unpackPhase = ":";
  installPhase = "install -m755 -D ${./myscript.py} $out/bin/myscript";
};
```

`stdenv`'s `patchShebangs` will automatically replace shebangs in the fixup phase, for ex. `#!/usr/bin/env python3` with dependencies given in `buildInputs`. As the derivation got `pkgs.python36.withPackages (...)` in `buildInputs`, it will create a [virtualenv](https://virtualenv.pypa.io/en/stable/)-like python wrapper. The python wrapper will have all specified dependencies and will be used to call the script.

In NixOS, the package can be put into `environment.systemPackages`, and `myscript` will be available as a global command.

Source: [nh2 @ StackOverflow](http://stackoverflow.com/questions/43837691/how-to-package-a-single-python-script-with-nix/43837692#43837692)

A more lightweight alternative is to use `nix-shell` in the shebang line as described in this [blog post](https://web.archive.org/web/20230330010914/http://iam.travishartwell.net/2015/06/17/nix-shell-shebang/). This causes the expression to be evaluated and built every time the script is run; this means that the dependencies will always be kept up to date, but since nix-shell only creates a temporary GC root the dependencies may be removed by a garbage collection, so this approach is not advisable for users who don't have an internet connection available all the time.

## Caveats

After packaging software and successfully generating an executable some functions of the package might still not work. This is a collection of error and how to fix them:

### GLib-GIO-Message: Using the 'memory' GSettings backend. Your settings will not be saved or shared with

Sometime the error mesage might be also:

``` nix
GLib-GIO-ERROR **: No GSettings schemas are installed on the system 
```

Fixed by adding `wrapGAppsHook` to buildInputs:

``` nix
nativeBuildInputs = [ ...  wrapGAppsHook ];
```

Sample PR in nixpkgs:

- [networkmanagerapplet](https://github.com/NixOS/nixpkgs/pull/24617/files)

### Namespace Gdk not available

You will need `/nix/store/*-gtk+3-*/lib/girepository-1.0` in `GI_TYPELIB_PATH`.

Similar solution as above, solved by:

``` nix
  nativeBuildInputs = [ ...  wrapGAppsHook ];
  buildInputs = [ gtk3 ];
```

### ImportError: libstdc++.so.6: cannot open shared object file: No such file

This can happen when importing python libraries: Solution: add `${stdenv.cc.cc.lib}/lib/libstdc++.so.6` to the `LD_LIBRARY_PATH`.

A sample `shell.nix`:

``` nix
{ pkgs ? (import <nixpkgs> {}).pkgs }:
with pkgs;
mkShell {
  buildInputs = [
    python3Packages.virtualenv # run virtualenv .
    python3Packages.pyqt5 # avoid installing via pip
    python3Packages.pyusb # fixes the pyusb 'No backend available' when installed directly via pip
  ];
  shellHook = ''
    # fixes libstdc++ issues and libgl.so issues
    LD_LIBRARY_PATH=${stdenv.cc.cc.lib}/lib/:/run/opengl-driver/lib/
    # fixes xcb issues :
    QT_PLUGIN_PATH=${qt5.qtbase}/${qt5.qtbase.qtPluginPrefix}
  '';
}
```

### Test cannot access `/etc/protocols`, `/etc/services` or expects a special `/etc/passwd` when building in sandbox

Sometimes libraries try to fetch protocol specs via `socket.getprotobyname('tcp')` which fails in sandboxes because /etc/protocols is unaccessible. Override pre- and postCheck phases with this:

``` nix
     preCheck = ''
       export NIX_REDIRECTS=/etc/protocols=${pkgs.iana-etc}/etc/protocols \
         LD_PRELOAD=${pkgs.libredirect}/lib/libredirect.so
     '';
     postCheck = ''
       unset NIX_REDIRECTS LD_PRELOAD
     ''; 
```

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
