<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Python -->

## Python development environments with Nix

Nix supports a number of approaches to creating "development environments" for Python programming. These provide functionality analogous to [virtualenv](https://virtualenv.pypa.io/en/latest/) or [conda](https://docs.conda.io/en/latest/): a shell environment with access to pinned versions of the `python` executable and Python packages.

### Using the Nixpkgs Python infrastructure via `shell.nix` (recommended)

Nixpkgs has the few last Python versions packaged, as well as a consequent set of Python packages packaged that you can use to quickly create a Python environment.

Create a file `shell.nix` in the project directory, with the following template:

``` nix
# shell.nix
let
  # We pin to a specific nixpkgs commit for reproducibility.
  # Last updated: 2024-04-29. Check for new commits at https://status.nixos.org.
  pkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/cf8cc1201be8bc71b7cbbbdaf349b22f4f99c7ae.tar.gz") {};
in pkgs.mkShell {
  packages = [
    (pkgs.python3.withPackages (python-pkgs: with python-pkgs; [
      # select Python packages here
      pandas
      requests
    ]))
  ];
}
```

In this example, we create a Python environment with packages `pandas` and `requests`.

You can find Python packages that are available in Nixpkgs using [search.nixos.org](https://search.nixos.org/packages). For instance, type a Python package name like `numpy` in the search bar and click on the search button on the right. You can narrow down results by clicking on eg. "python311Packages" in the "Package sets" section on the left. Note that in the snippet above, on lines 10-11, each package is listed in the form `python-pkgs.`<name> where <name> corresponds to the one found in [search.nixos.org](https://search.nixos.org/packages) . See [Nix language basics](https://nix.dev/tutorials/nix-language.html) for more information on the `python-pkgs` attribute set.

Once you have picked the Python packages you want, run `nix-shell` (or `nix develop -f shell.nix`) to build the Python environment and enter it. Once in the environment Python will be available in your PATH, so you can run eg. `python --version`.

Note that with NixOS, this method can be used to install packages at the system level, e.g.

``` nix
environment.systemPackages = with pkgs; [
  # ...
  (python3.withPackages (python-pkgs: with python-pkgs; [
      pandas
      requests
  ]))
];
```

### Using R packages in python with rpy2

``` nix
environment.systemPackages = with pkgs; [
  # ...
  (python3.withPackages (python-pkgs: with python-pkgs; [
      pandas
      requests
      rpy2
  ]))

  # don't use rWrapper.override
  rPackages.tidyverse
  rPackages.uwot
];
```

### Using Nix shell (new command line)

``` console
$ nix shell --impure --expr '(import <nixpkgs> {}).python3.withPackages (ps: with ps; [ swh-core swh-scanner ])'
```

If you don't use the channels any more, you can replace <nixpkgs> by an instance of the `NixOS/nixpkgs` repository using its absolute path.

#### Using a Python package not in Nixpkgs

Python packages in Nixpkgs are created and updated by Nixpkgs maintainers. Although the community invests a great effort to keep a complete and up-to-date package set, some packages you want may be missing, out of date, or broken. To use your own packages in a Nix environment, you may package it yourself.

The following is a high-level overview. For a complete explanation, see [Developing with Python](https://nixos.org/manual/nixpkgs/unstable/#developing-with-python) in the Nixpkgs Manual.

Generally, you may create a file that looks like this:

``` nix
# toolz.nix
{
  lib,
  buildPythonPackage,
  fetchPypi,
  setuptools,
  wheel,
}:

buildPythonPackage rec {
  pname = "toolz";
  version = "0.10.0";

  src = fetchPypi {
    inherit pname version;
    hash = "sha256-CP3V73yWSArRHBLUct4hrNMjWZlvaaUlkpm1QP66RWA=";
  };

  # do not run tests
  doCheck = false;

  # specific to buildPythonPackage, see its reference
  pyproject = true;
  build-system = [
    setuptools
    wheel
  ];
}
```

Given the file above is named `toolz.nix` and is the same directory as the previous `shell.nix` , you can edit `shell.nix` to use the package `toolz` above like so:

``` nix
# shell.nix
let
  pkgs = import <nixpkgs> {};

  python = pkgs.python3.override {
    self = python;
    packageOverrides = pyfinal: pyprev: {
      toolz = pyfinal.callPackage ./toolz.nix { };
    };
  };

in pkgs.mkShell {
  packages = [
    (python.withPackages (python-pkgs: [
      # select Python packages here
      python-pkgs.pandas
      python-pkgs.requests
      python-pkgs.toolz
    ]))
  ];
}
```

Next time you enter the shell specified by this file, Nix will build and include the Python package you have written.

### Running Python packages which requires compilation and/or contains libraries precompiled without `nix`

If you want to use some Python packages containing libraries precompiled without `nix` as for example [`grpcio`](https://pypi.org/project/grpcio/) or [`Numpy`](https://pypi.org/project/numpy), you may encounter the following error :

``` shell-session
$ python -c 'import grpc'
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/.../grpc/__init__.py", line 22, in <module>
    from grpc import _compression
  File "/.../grpc/_compression.py", line 20, in <module>
    from grpc._cython import cygrpc
ImportError: libstdc++.so.6: cannot open shared object file: No such file or directory
```

This means that the Python package depends on compiled dynamically linked binaries that your NixOs environment fail to resolve.

On NixOS, installing packages that need to compile code or use C libraries from outside of the `nix` package manager may fail if dependencies are not found in the expected locations. There are multiple ways to solve this, and most of them are just different ways for adding `/nix/store/...` to `$LD_LIBRARY_PATH`.

After doing one of the following, you should be able to install compiled libraries using `venv`, `poetry`, `uv`, `conda` or other packages managers.

#### Using nix overlay

``` nix
{
  nixpkgs.overlays = [(
    self: super: rec {
      # https://github.com/NixOS/nixpkgs/blob/c339c066b893e5683830ba870b1ccd3bbea88ece/nixos/modules/programs/nix-ld.nix#L44
      # > We currently take all libraries from systemd and nix as the default.
      pythonldlibpath = lib.makeLibraryPath (with super; [
        zlib zstd stdenv.cc.cc curl openssl attr libssh bzip2 libxml2 acl libsodium util-linux xz systemd
      ]);
      # here we are overriding python program to add LD_LIBRARY_PATH to it's env
      python = super.stdenv.mkDerivation {
        name = "python";
        buildInputs = [ super.makeWrapper ];
        src = super.python311;
        installPhase = ''
          mkdir -p $out/bin
          cp -r $src/* $out/
          wrapProgram $out/bin/python3 --set LD_LIBRARY_PATH ${pythonldlibpath}
          wrapProgram $out/bin/python3.11 --set LD_LIBRARY_PATH ${pythonldlibpath}
        '';
      };
      poetry = super.stdenv.mkDerivation {
        name = "poetry";
        buildInputs = [ super.makeWrapper ];
        src = super.poetry;
        installPhase = ''
          mkdir -p $out/bin
          cp -r $src/* $out/
          wrapProgram $out/bin/poetry --set LD_LIBRARY_PATH ${pythonldlibpath}
        '';
      };
    }
  )];
  environment.systemPackages = with pkgs; [
    python  # here python will be taken from the overlay up here
    poetry
  ];
}
```

#### Using [nix-ld](https://github.com/nix-community/nix-ld)

``` nix
{
  programs.nix-ld = {
    enable = true;
    libraries = with pkgs; [
      zlib zstd stdenv.cc.cc curl openssl attr libssh bzip2 libxml2 acl libsodium util-linux xz systemd
    ];
  };
  # https://github.com/nix-community/nix-ld?tab=readme-ov-file#my-pythonnodejsrubyinterpreter-libraries-do-not-find-the-libraries-configured-by-nix-ld
  environment.systemPackages = [
    (pkgs.writeShellScriptBin "python" ''
      export LD_LIBRARY_PATH=$NIX_LD_LIBRARY_PATH
      exec ${pkgs.python3}/bin/python "$@"
    '')
  ];
  # another (dangerous) solution
  # environment.systemPackages = with pkgs; [ python3 ];
  # programs.bash = {
  #   enable = true;
  #   initExtra = ''
  #     export LD_LIBRARY_PATH=$LD_LIBRARY_PATH''${LD_LIBRARY_PATH:+:}$NIX_LD_LIBRARY_PATH
  #   '';
  # };
}
```

#### Using [fix-python](https://github.com/GuillaumeDesforges/fix-python/)

Install with:

``` console
$ nix profile install github:GuillaumeDesforges/fix-python
```

Enter the venv and run:

``` console
$ fix-python --venv .venv
```

#### Using `buildFHSEnv` (Recommended)

``` nix
#!/usr/bin/env nix-shell
{ pkgs ? import <nixpkgs> { } }:
(
  let base = pkgs.appimageTools.defaultFhsEnvArgs; in
  pkgs.buildFHSEnv (base // {
    name = "FHS";
    targetPkgs = pkgs: (with pkgs; [
      gcc glibc zlib
    ]);
    runScript = "zsh";
    extraOutputsToInstall = [ "dev" ];
  })
).env
```

#### Using a custom nix-shell

The following configuration automatically fix the dependencies:

``` nixos
let
  python = pkgs.python311;
  # We currently take all libraries from systemd and nix as the default
  # https://github.com/NixOS/nixpkgs/blob/c339c066b893e5683830ba870b1ccd3bbea88ece/nixos/modules/programs/nix-ld.nix#L44
  pythonldlibpath = lib.makeLibraryPath (with pkgs; [
    zlib zstd stdenv.cc.cc curl openssl attr libssh bzip2 libxml2 acl libsodium util-linux xz systemd
  ]);
  patchedpython = (python.overrideAttrs (
    previousAttrs: {
      # Add the nix-ld libraries to the LD_LIBRARY_PATH.
      # creating a new library path from all desired libraries
      postInstall = previousAttrs.postInstall + ''
        mv  "$out/bin/python3.11" "$out/bin/unpatched_python3.11"
        cat << EOF >> "$out/bin/python3.11"
        #!/run/current-system/sw/bin/bash
        export LD_LIBRARY_PATH="${pythonldlibpath}"
        exec "$out/bin/unpatched_python3.11" "\$@"
        EOF
        chmod +x "$out/bin/python3.11"
      '';
    }
  ));
  # if you want poetry
  patchedpoetry =  ((pkgs.poetry.override { python3 = patchedpython; }).overrideAttrs (
    previousAttrs: {
      # same as above, but for poetry
      # not that if you dont keep the blank line bellow, it crashes :(
      postInstall = previousAttrs.postInstall + ''

        mv "$out/bin/poetry" "$out/bin/unpatched_poetry"
        cat << EOF >> "$out/bin/poetry"
        #!/run/current-system/sw/bin/bash
        export LD_LIBRARY_PATH="${pythonldlibpath}"
        exec "$out/bin/unpatched_poetry" "\$@"
        EOF
        chmod +x "$out/bin/poetry"
      '';
    }
  ));
in
{
  environment.systemPackages = with pkgs; [
    patchedpython
    # if you want poetry
    patchedpoetry
  ];
}
```

This configuration set the `LD_LIBRARY_PATH` environment variable before running python using the `overrideAttrs`[^1] function to override the `postInstall` script of cpython `mkDerivation`[^2].

#### Prefix library paths using wrapProgram

wrapProgram is a part of the makeWrapper build input[^3]. By combining it with the symlinkJoin, we can create a wrapper around the Python executable that will always set the required library paths. It’s worth noting that, for this solution to be compatible with Darwin, we need to use a different wrap prefix, as shown in the example below.

``` nixos
let
  # We currently take all libraries from systemd and nix as the default
  # https://github.com/NixOS/nixpkgs/blob/c339c066b893e5683830ba870b1ccd3bbea88ece/nixos/modules/programs/nix-ld.nix#L44
  pythonldlibpath = lib.makeLibraryPath (with pkgs; [
    zlib zstd stdenv.cc.cc curl openssl attr libssh bzip2 libxml2 acl libsodium util-linux xz systemd
  ]);
  # Darwin requires a different library path prefix
  wrapPrefix = if (!pkgs.stdenv.isDarwin) then "LD_LIBRARY_PATH" else "DYLD_LIBRARY_PATH";
  patchedpython = (pkgs.symlinkJoin {
    name = "python";
    paths = [ pkgs.python312 ];
    buildInputs = [ pkgs.makeWrapper ];
    postBuild = ''
      wrapProgram "$out/bin/python3.12" --prefix ${wrapPrefix} : "${pythonldlibpath}"
    '';
  });
in
{
  environment.systemPackages = with pkgs; [
    patchedpython
  ];
}
```

### Using `venv`

To create a Python virtual environment with `venv`:

``` console
$ nix-shell -p python3 --command "python -m venv .venv --copies"
```

You can then activate and use the Python virtual environment as usual and install dependencies with `pip` and similar.

### Using uv

> A single tool to replace `pip`, `pip-tools`, `pipx`, `poetry`, `pyenv`, `virtualenv`, and more.

uv is written in Rust and does *not* need Python as a prerequisite. Use the `uv` command to initialize Python projects, add Python packages, create or update virtual environments (in `.venv` folders), etc. as [described in the uv docs](https://docs.astral.sh/uv/concepts/projects/). Use uv's [tool interface](https://docs.astral.sh/uv/guides/tools/) to install and run Python packages that provide a CLI.

As a system package

``` nix
environment.systemPackages = with pkgs; [
    uv
];
```

or as a home-manager package

``` nix
home.packages = with pkgs; [
    uv
];
```

If you use uv it's recommended that you install the Python versions you need using the `uv python install` command, e.g.

``` console
$ uv python install 3.14 --preview --default
```

You may want to set the `UV_PYTHON_DOWNLOADS=never` environment variable in your shell to stop uv from downloading Python binaries automatically if needed. Setting `environment.localBinInPath = true;` is highly recommended, because uv will install binaries in `~/.local/bin`.

### Using poetry

``` nix

# shell.nix
let
  pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  packages = with pkgs; [
    python310
    (poetry.override { python3 = python310; })
  ];
}
```

#### poetry2nix

[poetry2nix](https://github.com/nix-community/poetry2nix) uses the contents of a `poetry.lock` and `pyproject.toml` file to create Nix derivations. It has several functions for generating development environments and python projects. Because some older python projects rely on deprecated build systems (see [edgecase.md](https://github.com/nix-community/poetry2nix/blob/master/docs/edgecases.md) for more info), poetry2nix provides overrides so these packages can still be built.

### Using micromamba

Install the `micromamba` package to create environments and install packages as [documented by micromamba](https://github.com/mamba-org/mamba#micromamba).

To activate an environment you will need a [FHS environment](https://nixos.org/manual/nixpkgs/stable/#sec-fhs-environments) e.g.:

``` console
$ nix-shell -E 'with import <nixpkgs> {}; (pkgs.buildFHSEnv { name = "fhs"; }).env'
$ eval "$(micromamba shell hook -s bash)"
$ micromamba activate my-environment
$ python
>>> import numpy as np
```

Eventually you'll probably want to put this in a shell.nix so you won't have to type all that stuff every time e.g.:

``` shell
{ pkgs ? import <nixpkgs> {}}:
let
  fhs = pkgs.buildFHSEnv {
    name = "my-fhs-environment";

    targetPkgs = _: [
      pkgs.micromamba
    ];

    profile = ''
      set -e
      eval "$(micromamba shell hook --shell=posix)"
      export MAMBA_ROOT_PREFIX=${builtins.getEnv "PWD"}/.mamba
      if ! test -d $MAMBA_ROOT_PREFIX/envs/my-mamba-environment; then
          micromamba create --yes -q -n my-mamba-environment
      fi
      micromamba activate my-mamba-environment
      micromamba install --yes -f conda-requirements.txt -c conda-forge
      set +e
    '';
  };
in fhs.env
```

### Using conda

Install the package `conda` and run

``` console
$ conda-shell
$ conda-install
$ conda env update --file environment.yml
```

#### Imperative use

It is also possible to use `conda-install` directly. On first use, run:

``` console
$ conda-shell
$ conda-install
```

to set up conda in `~/.conda`

### Using pixi

Install the `pixi` package to create environments and install packages as [documented by pixi](https://pixi.sh/latest/):

``` console
$ pixi init
$ pixi add python
```

To activate an environment you will need a [FHS environment](https://nixos.org/manual/nixpkgs/stable/#sec-fhs-environments) e.g. a [flake.nix](https://github.com/NixOS/nixpkgs/issues/316443#issuecomment-2151963505) [^4]

``` nixos
{
  description = "pixi env";
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs =
    { flake-utils, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        fhs = pkgs.buildFHSEnv {
          name = "pixi-env";

          targetPkgs = _: [ pkgs.pixi ];
        };
      in
      {
        devShell = fhs.env;
      }
    );
}
```

Then using [`nix develop`](https://wiki.nixos.org/wiki/Development_environment_with_nix-shell#nix_develop) the environment can be activated:

``` console
$ nix develop
$ pixi s
$ python
>>> import numpy as np
```

#### Using Home Manager

Alternatively an [FHS environment](https://nixos.org/manual/nixpkgs/stable/#sec-fhs-environments) can wrap pixi using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> e.g[^5]

``` nixos
{ lib, pkgs, ... }:
{
  home.packages = [
    (pkgs.buildFHSEnv {
      name = "pixi";
      runScript = "pixi";
      targetPkgs = pkgs: with pkgs; [ pixi ];
    })
  ];
}
```

Then the environment can be activated:

``` console
$ pixi s
$ python
>>> import numpy as np
```

## Package a Python application

### With `setup.py`

To package a Python application that uses `setup.py` you can use `buildPythonApplication`. More details about this and similar functions can be found in [the nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#building-packages-and-applications).

For example, we can package this simple flask server `main.py:`

``` python
#!/usr/bin/env python

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
```

We also need a `setup.py` file, like this:

``` python
from setuptools import setup, find_packages

setup(name='myFlaskServer',
      version='1.0',
      # Modules to import from other scripts:
      packages=find_packages(),
      # Executables
      scripts=["main.py"],
     )
```

Then, we use the `buildPythonApplication` in the `default.nix`:

``` nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.python3Packages.buildPythonApplication {
  pname = "myFlaskApp";
  version = "0.1.0";

  propagatedBuildInputs = with pkgs.python3Packages; [
    flask
  ];

  src = ./.;
}
```

Finally, build your project using `nix-build`. The result will be executable in `./result/bin/app.py`.

### With `pyproject.toml`

When your project is using `pyproject.toml`you can use [pyproject.nix](https://github.com/nix-community/pyproject.nix) to package your application.

First, a simple file structure could look like this:

    ├── app/
        └── main.py
    ├── flake.nix
    ├── pyproject.toml
    └── README.md

To reuse the example from above, we use the same flask application:

``` python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
```

Also, you need to define the `pyproject.toml`. Here, we only show some of the important parts. Please refer to `pyproject.nix` [documentation](https://pyproject-nix.github.io/pyproject.nix/use-cases/pyproject.html) for a full example.

``` toml
[project]
name = "my-app"
version = "0.1.0"
description = "Simple app"

# define any Python dependencies
dependencies = [
  "flask>3",
]

# define the CLI executable
# Here, we define the entry point to be the 'main()' function in the module 'app/main.py'
[project.scripts]
cli = "app.main:main"
```

We package the application by calling the `loadPyproject` function from `pyproject.nix`. Again, we only show a minimal example. More information can be found in the [documentation](https://pyproject-nix.github.io/pyproject.nix/use-cases/pyproject.html). Note that this example relies on flakes in contrast to some of the others on this page.

``` nix
{
  description = "A basic flake using pyproject.toml project metadata";

  inputs = {
    pyproject-nix = {
      url = "github:nix-community/pyproject.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { nixpkgs, pyproject-nix, ... }:
    let
      inherit (nixpkgs) lib;

      project = pyproject-nix.lib.project.loadPyproject {
        # Read & unmarshal pyproject.toml relative to this project root.
        # projectRoot is also used to set `src` for renderers such as buildPythonPackage.
        projectRoot = ./.;
      };

      # This example is only using x86_64-linux
      pkgs = nixpkgs.legacyPackages.x86_64-linux;

      python = pkgs.python3;

    in
    {
      # Build our package using `buildPythonPackage
      packages.x86_64-linux.default =
        let
          # Returns an attribute set that can be passed to `buildPythonPackage`.
          attrs = project.renderers.buildPythonPackage { inherit python; };
        in
        # Pass attributes to buildPythonPackage.
        # Here is a good spot to add on any missing or custom attributes.
        python.pkgs.buildPythonPackage (attrs // {
          env.CUSTOM_ENVVAR = "hello";
        });
    };
}
```

To run the application, call `nix run`.

You can also launch an IDE under `nix develop` and get full dependency resolution. For example, the following command opens VS Code in the constructed environment:

``` shell-session
$ nix develop --command code
```

## Nixpkgs Python contribution guidelines

### Libraries

According to the [official guidelines](https://nixos.org/nixpkgs/manual/#contributing-guidelines) for Python, new package expressions for libraries should be placed in

``` bash
pkgs/development/python-modules/<name>/default.nix
```

.

Those expressions are then referenced from `pkgs/top-level/python-packages.nix` as in

``` nix
  aenum = callPackage ../development/python-modules/aenum { };
```

### Applications

Applications meant to be executed should be referenced directly from `pkgs/top-level/all-packages.nix`.

Other Python packages used in the Python package of the application should be taken from the `callPackage` argument `pythonPackages` , which guarantees that they belong to the same "pythonPackage" set. For example:

``` nix
{
  lib,
  pythonPackages,
}:
buildPythonApplication {
  propagatedBuildInputs = [ pythonPackages.numpy ];
  # ...
}
```

## Special Modules

### GNOME

`gobject-introspection` based python modules need some environment variables to work correctly. For standalone applications, `wrapGAppsHook` (see the [relevant documentation](https://nixos.org/nixpkgs/manual/#sec-language-gnome)) wraps the executable with the necessary variables. But this is not fit for development. In this case use a `nix-shell` with `gobject-introspection` and all the libraries you are using (gtk and so on) as `buildInputs`. For example:

``` console
$ nix-shell -p gobjectIntrospection gtk3 'python2.withPackages (ps: with ps; [ pygobject3 ])' --run "python -c \"import pygtkcompat; pygtkcompat.enable_gtk(version='3.0')\""
```

Or, if you want to use matplotlib interactively:

``` console
$ nix-shell -p gobject-introspection gtk3 'python36.withPackages(ps : with ps; [ matplotlib pygobject3 ipython ])'
$ ipython
```

``` python
In [1]: import matplotlib
In [2]: matplotlib.use('gtk3agg')
In [3]: import matplotlib.pyplot as plt
In [4]: plt.ion()
In [5]: plt.plot([1,3,2,4])
```

You can also set `backend : GTK3Agg` in your `~/.config/matplotlib/matplotlibrc` file to avoid having to call `matplotlib.use('gtk3agg')`.

## Debug Build

See [python wiki on debug build](https://docs.python.org/3/using/configure.html#python-debug-build).

In order to use a CPython interpreter built using `--with-pydebug` during configure phase, override any of the python packages passing `enableDebug = true` argument:

``` nix
pythonDebug = pkgs.python310.override { enableDebug = true; };
```

## Installing Multiple Versions

can be used to install multiple versions without conflicts ():

In this case you may run Python 3.13 via or and Python 3.14 via .

## Performance

The derivation of CPython that is available via `nixpkgs` only contains optimizations that do not harm reproducibility. Link-Time-Optimization (LTO) is only enabled on 64-bit Linux systems, while Profile Guided Optimization (PGO) is currently disabled. See [Configuring Python 3.1.3. Performance options](https://docs.python.org/3/using/configure.html#performance-options) Additionally, when compiling something within `nix-shell` or a derivation security hardening flags are passed to the compiler by default which may have a small performance impact.

At the time of writing certain optimizations cause Python wheels to be non-reproducible and increase install times. For a detailed overview of the trials and tribulations of discovering such performance regressions see [Why is the nix-compiled Python slower?](https://discourse.nixos.org/t/why-is-the-nix-compiled-python-slower/18717).

### Regression

With the `nixpkgs` version of Python you can expect anywhere from a 30-40% regression on synthetic benchmarks. For example:

``` console
## Ubuntu's Python 3.8
$ python3.8 -c "import timeit; print(timeit.Timer('for i in range(100): oct(i)', 'gc.enable()').repeat(5))"
[7.831622750498354, 7.82998560462147, 7.830805554986, 7.823807033710182, 7.84282516874373]
## nix-shell's Python 3.8
[nix-shell:~]$ python3.8 -c "import timeit; print(timeit.Timer('for i in range(100): oct(i)', 'gc.enable()').repeat(5))"
[10.431915327906609, 10.435049421153963, 10.449542525224388, 10.440207410603762, 10.431304694153368]
```

However, synthetic benchmarks are not necessarily reflective of real-world performance. In common real-world situations, the performance difference between optimized and non-optimized interpreters is minimal. For example, using `pylint` with a significant number of custom linters to scan a very large Python codebase (\>6000 files) resulted in only a 5.5% difference. Other workflows that were not performance sensitive saw no impact to their run times.

### Possible Optimizations

If you run code that heavily depends on Python performance, and you desire the most performant Python interpreter possible, here are some possible things you can do:

- **Enable the `enableOptimizations` flag for your Python derivation**. See [Example](https://discourse.nixos.org/t/why-is-the-nix-compiled-python-slower/18717/10). Do note that this will cause you to compile Python the first time that you run it which will take a few minutes.
- **Switch to a newer version of Python**. In the example above, going from 3.8 to 3.10 yielded an average 7.5% performance improvement, but this is only a single benchmark. Switching versions most likely won't make all your code 7.5% faster.
- **Disable hardening**. Beware this only yields a small performance boost and it has impacts beyond Python code. See [Hardening in Nixpkgs](https://nixos.org/manual/nixpkgs/stable/#sec-hardening-in-nixpkgs).

**Ultimately, it is up to your use case to determine if you need an optimized version of the Python interpreter. We encourage you to benchmark and test your code to determine if this is something that would benefit you.**

## Troubleshooting

### My module cannot be imported

If you are unable to do `import yourmodule` there are a number of reasons that could explain that.

First, make sure that you installed/added your module to python. Typically you would use something like `(python3.withPackages (ps: with ps; [ yourmodule ]))` in the list of installed applications.

It is also still possible (e.g. when using nix-shell) that you aren't using the python interpreter you want because another package provides its own `python3.withPackages` in buildInputs, for example, yosys. In this case, you should either include that package (or all needed packages) in your withPackages list to only have a single Python interpreter. Or you can change the order of your packages, such that the `python3.withPackages` comes first, and becomes the Python interpreter that you get.

If you packaged yourself your application, make sure to use `buildPythonPackage` and <b>not</b> `buildPythonApplication` or `stdenv.mkDerivation`. The reason is that `python3.withPackages` [filters](https://github.com/NixOS/nixpkgs/blob/91d1eb9f2a9c4e3c9d68a59f6c0cada8c63d5340/pkgs/top-level/python-packages.nix#L57) the packages to check that they are built using the appropriate python interpreter: this is done by verifying that the derivation has a `pythonModule` attribute and only buildPythonPackage [sets this value](https://github.com/NixOS/nixpkgs/blob/91d1eb9f2a9c4e3c9d68a59f6c0cada8c63d5340/pkgs/top-level/python-packages.nix#L43) (passthru [here](https://github.com/NixOS/nixpkgs/blob/91d1eb9f2a9c4e3c9d68a59f6c0cada8c63d5340/pkgs/top-level/python-packages.nix#L75)) thanks to, notably `passthru = { pythonModule = python; }`. If you used `stdenv.mkDerivation` then you can maybe set this value manually, but it's safer to simply use `buildPythonPackage {format = "other"; … your derivation …}` instead of `mkDerivation`.

## See also

- ["Python" in Nixpkgs Manual](https://nixos.org/manual/nixpkgs/unstable/#python)

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a> <a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a>

[^1]: <https://nixos.org/manual/nixpkgs/stable/#sec-pkg-overrideAttrs>

[^2]: <https://github.com/NixOS/nixpkgs/blob/24.05/pkgs/development/interpreters/python/cpython/default.nix>

[^3]: <https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/setup-hooks/make-wrapper.sh>

[^4]: Suggested flake.nix by [@jonas-w](https://github.com/jonas-w) in response to **[\#316443 <bdi>Unable to add / run packages with pixi</bdi>](https://github.com/NixOS/nixpkgs/issues/316443)**

[^5]: Suggested home manager config by [@jennydaman](https://github.com/jennydaman) in response to **[\#316443 <bdi>Unable to add / run packages with pixi</bdi>](https://github.com/NixOS/nixpkgs/issues/316443)**
