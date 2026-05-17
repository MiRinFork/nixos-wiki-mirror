<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Development environment with nix-shell -->

Nix can be used to provide some kind of **virtual environment** through the `nix-shell` command.

If you already have a nix package definition of your project it's easy: Just use `nix-shell` instead of `nix-build` and you will end up in a bash shell that reproduce the build-environment of your package. You can also override[1](https://nixos.org/nixpkgs/manual/#sec-pkg-override) your package in a `shell.nix` file to add test and coverage dependencies, that are not necessary for the actual build of the package, but that you want for your development environment.

But, if you don't (or you don't want to) have a package definition you can still use a nix-shell to provide a reproducible development environment. To do so, you have to create a `shell.nix` file at the root of your repository. For example, if you want to have rustc with libraries and hello you can write:

``` nix
{
  pkgs ? import <nixpkgs> { },
}:
pkgs.callPackage (
  {
    mkShell,
    hello,
    rustc,
    pkg-config,
    openssl,
  }:
  mkShell {
    strictDeps = true;
    # host/target agnostic programs
    depsBuildBuild = [
      hello
    ];
    # compilers & linkers & dependency finding programs
    nativeBuildInputs = [
      rustc
      pkg-config
    ];
    # libraries
    buildInputs = [
      openssl
    ];
  }
) { }
```

Then just run:

Or, to be more explicit:

Now you have rustc available in your shell:

``` bash
$ rustc --version
rustc 1.80.1 (3f5fd8dd4 2024-08-06) (built from a source tarball)
```

To be sure that the tools installed on your system will not interfere with the dependencies that you've defined in the shell you can use the `--pure` option.

If you'd like to load a local nix expression into a shell you can do it by modifying the earlier example a little bit, see comments in the earlier example for where to put your package:

``` nix
{
  pkgs ? import <nixpkgs> {
    overlays = [
      (final: prev: {
        my-package = prev.callPackage ./my-package.nix { };
      })
    ];
  },
}:
pkgs.callPackage (
  {
    mkShell,
    my-package
  }:
  mkShell {
    strictDeps = true;
    buildInputs = [
      my-package
    ];
  }
) { }
```

If you want to see how to manually run the various phases of a given derivation from a nix-shell (useful to debug), see <a href="Nixpkgs/Create_and_debug_packages#Using_nix-shell_for_package_development" class="wikilink" title="Nixpkgs/Create_and_debug_packages#Using_nix-shell_for_package_development">Nixpkgs/Create_and_debug_packages#Using_nix-shell_for_package_development</a>.

## nix develop

For <a href="Flakes" class="wikilink" title="Flakes">Flakes</a>-based projects (`flake.nix` file in project root), we replace `nix-shell` with `nix develop`

Example: Building Nix in a development shell, to get <a href="Incremental_builds" class="wikilink" title="Incremental builds">Incremental builds</a> = faster recompiles. This is because Nix evaluations are cached.

    git clone https://github.com/NixOS/nix --depth 1
    cd nix
    nix develop

Now what? Let's read the manual:

    less README.md
    less doc/manual/src/contributing/hacking.md

The contributing guide for Nix says:

    To build all dependencies and start a shell in which all environment
    variables are set up so that those dependencies can be found:

    ```console
    $ nix-shell
    ```

    To build Nix itself in this shell:

    ```console
    [nix-shell]$ ./bootstrap.sh
    [nix-shell]$ ./configure $configureFlags --prefix=$(pwd)/outputs/out
    [nix-shell]$ make -j $NIX_BUILD_CORES
    ```

So, in our `nix develop` shell, we run

    ./bootstrap.sh
    ./configure $configureFlags --prefix=$(pwd)/outputs/out
    make -j $NIX_BUILD_CORES

This will compile Nix to `./outputs/out/bin/nix`

Let's make some changes to the source code, and run `make` again.  
Now the compilation should be much faster (see <a href="Incremental_builds" class="wikilink" title="Incremental builds">Incremental builds</a>)

## stdenv.mkDerivation

Let's assume you have a `default.nix` file

``` nix
{ stdenv, python }:
stdenv.mkDerivation {
  pname = "some-package";
  strictDeps = true;
  nativeBuildInputs = [ python ];
  version = "0.0.1";
  src = /home/yourname/path/to/project; # can be a local path, or fetchFromGitHub, fetchgit, ...
}
```

Then you can start a development shell with

``` bash
nix-shell -E 'with import <nixpkgs> { }; callPackage ./default.nix { }'
```

In this shell, you can run the phases of stdenv.mkDerivation:

``` bash
# clean build: copy sources from /nix/store
echo "src = $src" && cd $(mktemp -d) && unpackPhase && cd *

# dirty build: keep cache files from last buildPhase, to compile faster
# this is useful to make many small changes to a large project
# after each change, just run `buildPhase`
#cd $HOME/path/to/project

configurePhase

buildPhase # most time is spent here

checkPhase && installPhase && fixupPhase
```

## cross env

The comments in the code snippets on `nativeBuildInputs` and `buildInputs` above might seem pedantic --- who cares about build-time vs run-time when we're just making a dev environment, not a real package! However, the distinction becomes of practical importance if one wants a cross compilation development environment. In that case one would begin file with something like:

``` nix
{ pkgs ? import <nixpkgs> { crossSystem.config = "exotic_arch-unknown-exotic_os"; } }:
```

and `nativeBuildInputs` would be for the native platform, while `buildInputs` would be for the foreign platform. That's a much more practical distinction: any tool that's miscategorized one won't be able to run, and any library that's miscategorized one won't be able to link!

## Troubleshooting

When compiling software which links against local files (e.g. when compiling with rust's cargo), you may encounter the following problem:

``` bash
= note: impure path `/[...]' used in link
```

This happens due to a specialty in nix: `ld` is wrapped in a shell script which refuses to link against files not residing in the nix store, to ensure the purity of builds. Obviously this is not useful when building locally, for example in your home directory. To disable this behavior simply set

``` bash
NIX_ENFORCE_PURITY=0
```

in the nix-shell.

### No GSettings schemas are installed on the system

When working with gtk, the `XDG_DATA_DIRS` must contain a path to the gtk schemas, if not an application may crash with the error above.

For packages we use `wrapGAppsHook` in `nativeBuildInputs`, however in nix-shell this is not working as expected. To get your application to work in nix-shell you will need to add the following to your `mkShell` expression:

``` nix
mkShell {
  ...
  strictDeps = true;
  buildInputs = [ gtk3 ];
  shellHook = ''
     export XDG_DATA_DIRS=$GSETTINGS_SCHEMAS_PATH
  '';
}
```

This may also called: `$GSETTINGS_SCHEMA`**`S`**`_PATH`.

### Icons not working

Similar to the Gsettings issue, icons can be added with XDG_DATA_DIRS:

     XDG_DATA_DIRS=...:${hicolor-icon-theme}/share:${gnome3.adwaita-icon-theme}/share

## See Also

- <a href="Direnv" class="wikilink" title="Direnv">Direnv</a>
- <a href="Command_Shell#Using_a_different_shell_in_nix-shell_and_nix_develop" class="wikilink" title="Command Shell#Using a different shell in nix-shell and nix develop">Command Shell#Using a different shell in nix-shell and nix develop</a>
- [C++ with Nix in 2023, Part 1: Developer Shells, Nixcademy](https://nixcademy.com/posts/cpp-with-nix-in-2023-part-1-shell/)

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
