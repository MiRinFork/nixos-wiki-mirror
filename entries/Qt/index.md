<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Qt -->

## Development

To develop Qt applications in NixOS you may use nix-shell or direnv. For using nix-shell just run this command in the terminal:

``` console
$ nix-shell -p qt5Full -p qtcreator --run qtcreator
```

Tip: if it finds no Qt Kits, `rm -rf ~/.config/QtProject*` and start again. Sometimes it finds a kit, but cannot find a suitable qt version for it, in this case you can also type `which qmake` in your nix-shell and add a new entry in the `QT-Versions` tab in `Tools->Options->Kits`.

For using direnv, create a **shell.nix** file in the root of your project and paste these lines into it:

Also, create **.envrc** file and paste: `use_nix` into it.

### Explicit Dependencies

If fetching the entirety of `pkgs.qt6.full` is not appealing and you know which parts of Qt you need, your first instinct might be adding something like `pkgs.qt6.qtdeclarative` for creating QML-based Qt programs to `buildInputs`, **however** that will not work and you will get compile errors for missing libraries. `pkgs.qt6.full` is actually [creating an environment that contains all Qt libraries](https://github.com/NixOS/nixpkgs/blob/nixos-24.11/pkgs/development/libraries/qt-6/default.nix#L94-L144) that allows `qmake` and tools to find those libraries, so you must do the same and `pkgs.qt6.env` will help make one. For example:

## Packaging

[See](https://nixos.org/manual/nixpkgs/stable/#sec-language-qt) for the entry in the nixpkgs manual.

Qt applications can't be called with `callPackage`, since they expect more inputs. Namely `qtbase` and `wrapQtAppsHook`. Instead they should be called with `libsForQt5.callPackage`.

``` nix
#nix-repl
myapp = callPackage ./build/myapp/default.nix { } # Will complain it wasn't called with qtbase, etc.
myapp = libsForQt5.callPackage ./build/myapp/default.nix { } # Should work
```

## Projects using python (e.g. PyQt5)

It's possible to package a program that uses internally python and Qt (like PyQt5) by providing a python executable with the appropriate libraries like that `myPython = python3.withPackages (pkgs: with pkgs; [ pyqt5 ]);`. \``wrapQtAppsHook`\` even seems to be optional when using \`mkderivation\` (at least this program can be run without) since anyway it does not patch scripts.

``` nix
{ mkDerivation,
  lib,
  stdenv,
  fetchFromGitHub,
  jack2,
  which,
  python3,
  qtbase,
  qttools,
  wrapQtAppsHook,
  liblo,
  git,
}:
let
  myPython = python3.withPackages (pkgs: with pkgs; [ pyqt5 liblo pyliblo pyxdg ]);
in
mkDerivation rec {
  pname = "RaySession";
  version = "0.11.1";

  src = fetchFromGitHub {
    owner = "Houston4444";
    repo = pname;
    rev = "v${version}";
    sha256 = "sha256-EbDBuOcF0JQq/LOrakb040Yfrpdi3FOB1iczQTeXBkc=";
  };

  # This patch is required to be able to create a new session, but not a problem to compile and start the program
  # patches = [ ./copy_template_writable.patch ];

  # Otherwise lrelease-qt is not found:
  postPatch = ''
   substituteInPlace Makefile \
     --replace "lrelease-qt4" "${qttools.dev}/bin/lrelease" \
     --replace '$(DESTDIR)/' '$(DESTDIR)$(PREFIX)' # Otherwise problem with installing manual etc...
  '';

  nativeBuildInputs = [
    myPython
    wrapQtAppsHook # Not really useful since it will not pack scripts. And actually it seems that it's not required?
    which
    qttools
  ];
  propagatedBuildInputs = [ myPython qtbase jack2 git ];

  # Prefix must be set correctly due to sed -i "s?X-PREFIX-X?$(PREFIX)?"
  makeFlags = [ "PREFIX=$(out)" ]; # prefix does not work since due to line "install -d $(DESTDIR)/etc/xdg/"
}
```

Call it with

``` nix
{ pkgs ? import <nixpkgs> {} }:
pkgs.libsForQt5.callPackage ./derivation.nix {}
```

For actual python applications, you may also use something like that (to test) :

``` nix
python3.pkgs.buildPythonApplication {
  pname = "blabla";
  version = "3.32.2";

  nativeBuildInputs = [
    wrapQtAppsHook
    ...
  ];

  dontWrapQtApps = true; # wrapQtApps won't patch script anyway. TODO: save to use if it contains executables? 

  # Arguments to be passed to `makeWrapper`, only used by buildPython*
  preFixup = ''
        qtWrapperArgs+=("''${gappsWrapperArgs[@]}")
        # You can manually patch scripts using: wrapQtApp "$out/bin/myapp". TODO: check when it's required.
  '';
}
```

## Migrating apps from Qt5 to Qt6

1.  Replace `libsForQt5.callPackage` with `qt6Packages.callPackage`
2.  Add the dependency [qt5compat](https://www.qt.io/blog/porting-from-qt-5-to-qt-6-using-qt5compat-library)
3.  Hope for the best ; )

`qt5compat` is only needed for Qt5 projects, which are not-yet migrated to Qt6.

Maybe add libraries like `qtwayland`

Conditional blocks in qmake `*.pro` files

``` pro
lessThan(QT_MAJOR_VERSION, 6) {
  # qt5, qt4, ...
  QT += x11extras
}
equals(QT_MAJOR_VERSION, 6) {
  # qt6
  QT += core-private
}
```

See also:

- [Porting to Qt 6](https://doc.qt.io/qt-6/portingguide.html)
- [How to check the selected version of Qt in a .pro file?](https://stackoverflow.com/questions/18663331)

## Hello world involving QML, Qt5, nix and cmake, qmake or meson

You can find [here](https://gist.github.com/tobiasBora/04d0febda0b3f09707b5e1b7b85390a5) a minimal example to use QML, cmake, nix and Qt5, and [here](https://gist.github.com/tobiasBora/6f114cca1affb5528c872ca01d7e28c1) is the same example with qmake instead and [here](https://gist.github.com/tobiasBora/812701e8741814393f3df7b23a11eb4b) is the same with meson instead. There is nothing special to nix there, but note that if you provide the qml file using something like `qrc:///main.qml`, then you need to write a qrc file that lists all the resources that must be included in the qt resource manager. This file is then used to compile the resources and include them in the binary (you have to compile the binaries, either automatically with cmake or qmake, or manually using rcc). With cmake you compile it using `qt5_add_resources(SOURCES qml.qrc)` ([doc](https://doc.qt.io/qt-5/qtcore-cmake-qt5-add-resources.html)) as illustrated in the above example (make sure to use a variable as the source and to reuse the same variable in `add_executable`).

## Troubleshooting

### This application failed to start because it could not find or load the Qt platform plugin ??? in ""

    qt.qpa.plugin: Could not find the Qt platform plugin "xcb" in ""
    This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.

The package will need to be fixed to use \[the new <https://github.com/NixOS/nixpkgs/issues/65399> `wrapQtAppsHook`\]. The hook wraps every qt application with adding `QT_PLUGIN_PATH` and `XDG_DATA_DIRS` as well as `XDG_CONFIG_DIRS`.See [wrap-qt-apps-hook.sh in nixpkgs](https://github.com/NixOS/nixpkgs/blob/nixos-19.09/pkgs/development/libraries/qt-5/hooks/wrap-qt-apps-hook.sh)

### Debugging methods

As a general rule, exporting `QT_DEBUG_PLUGINS=1` make qt print where it looks for plugins.

If a plugin exists in a directory but is ignored with a message like `QLibraryPrivate::loadPlugin failed on "/nix/store/...-teamspeak-client-3.1.6/lib/teamspeak/platforms/libqxcb.so" : "Cannot load library /nix/store/...-client-3.1.6/lib/teamspeak/platforms/libqxcb.so: "` it can be that the library cannot be `dlopen()`ed because of dependencies/rpath issues and needs `patchelf`ing. Exporting `LD_DEBUG=libs` may prove helpful in this scenario.
