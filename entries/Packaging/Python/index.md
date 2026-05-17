<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Packaging/Python -->

See <a href="Language-specific_package_helpers" class="wikilink" title="Language-specific package helpers">Language-specific package helpers</a> for a list of tools to package python packages.

## Prepare Packaging

When you want to package a new software from a local checkout with the inputs coming from nixpkgs (and not virtualenv+pip) you can use the following `shell.nix` [^1]:

``` nix
with import <nixpkgs> {};
with pkgs.python3Packages;

buildPythonPackage rec {
  name = "mypackage";
  src = ./path/to/source;
  propagatedBuildInputs = [ pytest numpy pkgs.libsndfile ];
}
```

You can now run `nix-shell` and it will drop you in a shell similar to the `python setup.py develop` mode which uses the local code in `./path/to/source` as input. `propagatedBuildInputs` will contain the packages you need in your project. After you've finished developing you can replace the relative path with `fetchFromGitHub { ... }` or [`fetchPypi`](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/fetchpypi/default.nix)` { ... }`.

## Testing out a module in a Python shell

Once you have your derivation written, you can create a <a href="Flakes" class="wikilink" title="flake">flake</a> to give yourself a shell and easily test out the module you wrote the derivation for.

Create a `flake.nix` next to your derivation:

``` nix
{
  description = "Dev shell using external derivation";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        # replace ./derivation.nix with the path (relative to this file) to your derivation
        mypackage = pkgs.python3Packages.callPackage ./derivation.nix {
          lib = pkgs.lib;
        };
      in {
        packages.default = pkgs.python3.withPackages(_: [ mypackage ]);
      });
}
```

Replace "mypackage" with your package name. Then, run the flake to get into a python REPL with your package, ready to be imported:

``` shell-session
$ nix run
Python 3.11.10 (main, Sep  7 2024, 01:03:31) [GCC 13.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import mypackage
>>> # test things out...
```

## Pip and Virtualenv enabled nix-shell

It might be the case that you simply need to prototype fast small projects with `pip` and `virtualenv` without the need for relying on the dependencies being already packaged in nixpkgs.

For a local working python environment you can use the following `shell.nix`[^2].

``` nix
{ pkgs ? import <nixpkgs> { } }:

let
  pythonEnv = pkgs.python3.withPackages(ps: [ ]);

in
pkgs.mkShell {
  packages = [
    pythonEnv
  ];
}
```

When invoked with nix-shell, this environment gives you a readline-enabled Python, plus virtualenv and pip, from which you can create a virtual environment and then proceed to fill it with pip-installed packages from requirements.txt or any other source of packages.

And the only other thing you need to do is figure out which non-Python packages your pip-installable packages will need, and include them in buildInputs.

## Caveats

### ModuleNotFoundError: No module named 'pkg_resources'

If you see this runtime error

    ModuleNotFoundError: No module named 'pkg_resources'

add `setuptools` to your derivation

``` nix
buildPythonPackage {
  # ...
  propagatedBuildInputs = [
    # ...
    setuptools
  ];
}
```

Please report such issues at <https://github.com/NixOS/nixpkgs/issues>

### HTTP 404 with fetchPypi

example error:

> curl: (22) The requested URL returned error: 404  
> error: cannot download stt-1.2.0.tar.gz from any mirror

when we look at <https://pypi.org/project/stt/#files> we see only `*.whl` files:

- `stt-1.2.0-cp310-cp310-win_amd64.whl`
- `stt-1.2.0-cp310-cp310-manylinux_2_24_x86_64.whl`
- `stt-1.2.0-cp310-cp310-macosx_10_10_universal2.whl`
- ...

this means, this is a binary release, so we have two options:

1.  build from source
2.  install binary release

#### build from source

replace this

``` nix
    buildPythonPackage {
      pname = "TODO";
      version = "TODO";
      src = fetchPypi {
        inherit pname version;
        sha256 = ""; # TODO
      };
```

with this

``` nix
    buildPythonPackage {
      pname = "TODO";
      version = "TODO";
      src = fetchFromGitHub {
        owner = "TODO";
        repo = "TODO";
        rev = "v${version}";
        sha256 = ""; # TODO
      };
```

#### install binary release

replace this

``` nix
    buildPythonPackage {
      pname = "TODO";
      version = "TODO";
      src = fetchPypi {
        inherit pname version;
        sha256 = ""; # TODO
      };
```

with this

``` nix
    buildPythonPackage {
      pname = "TODO";
      version = "TODO";
      format = "wheel";
      src = fetchPypi rec {
        inherit pname version format;
        sha256 = ""; # TODO
        dist = python;
        python = "py3";
        #abi = "none";
        #platform = "any";
      };
```

... or use `fetchurl` to download the `*.whl` file directly.  
reference: [fetchPypi implementation](https://github.com/NixOS/nixpkgs/blob/master/pkgs/build-support/fetchpypi/default.nix)

## Fix Missing `setup.py`

The `setup.py` file is required for `buildPythonPackage`, but it's missing in some packages. If you get the following error, you need to one of the workarounds below.

    FileNotFoundError: [Errno 2] No such file or directory: 'setup.py'

If the package has a `pyproject.toml` file, set

``` nix
buildPythonPackage {
  format = "pyproject";
}
```

If both `setup.py` and `pyproject.toml` are missing, you have to add one of these files.

**Note:** sometimes you will be able to find `pyproject.toml` in the source for a package despite it not being present in a `.whl` file. You can inspect the contents of a `.whl` file by downloading it from PyPi and then extracting it with `nix-shell -p python311Packages.wheel --command wheel unpack path/to/package.whl`.

For example, you can create the `setup.py` in the `preBuild` phase.

``` nix
buildPythonPackage {
  preBuild = ''
    cat > setup.py << EOF
from setuptools import setup

with open('requirements.txt') as f:
    install_requires = f.read().splitlines()

setup(
  name='someprogram',
  #packages=['someprogram'],
  version='0.1.0',
  #author='...',
  #description='...',
  install_requires=install_requires,
  scripts=[
    'someprogram.py',
  ],
  entry_points={
    # example: file some_module.py -> function main
    #'console_scripts': ['someprogram=some_module:main']
  },
)
    EOF
  '';
}
```

More info about the `setup.py` can be found [here](https://docs.python.org/3.11/distutils/setupscript.html). (<b>note:</b> from python 3.12 onwards, distutils is deprecated see <https://docs.python.org/3.11/distutils/index.html>)

`scripts` is useful for self-contained python scripts with no local imports.

If a python script has local imports, for example `from .some_module import some_function`, either include all files in the `scripts` array, or add only the entry function to `entry_points`.

In this example, `someprogram.py` would be installed as `$out/bin/someprogram.py`.  
To rename the binary, for example to remove the `.py` file extension, you can use `postInstall`

``` nix
buildPythonPackage {
  # ...
  postInstall = ''
    mv -v $out/bin/someprogram.py $out/bin/someprogram
  '';
}
```

### requirements.txt

`requirements.txt` in it's simplest form is a list of python packages

    numpy
    Requests
    Pillow

`buildPythonPackage` will check these dependencies, but you still must declare the nix dependencies in `buildInputs`, `propagatedBuildInputs`, `checkInputs`, ...

## Automatic packaging

|  | Project | URL | Stars | Status |
|----|----|----|----|----|
| TODO | poetry2nix | <https://github.com/nix-community/poetry2nix> | 884+ | unmaintained |
| TODO | uv2nix | <https://github.com/pyproject-nix/uv2nix> | 675+ |  |
| TODO | pip2nix | <https://github.com/nix-community/pip2nix> | 175+ |  |
| TODO | <s>pypi2nix</s> | <https://github.com/nix-community/pypi2nix> | 194 | archived |

## Testing via this command is deprecated

In most cases, tests will pass anyway and you can ignore the warning.

In some cases, tests will fail, for example:

> running test  
> WARNING: Testing via this command is deprecated and will be removed in a future version. Users looking for a generic test entry point independent of test runner are encouraged to use tox.  
> \[ ... \]  
> TypeError: some_function() missing 1 required positional argument: 'some_argument'

quick fix: run tests with python's [unittest](https://docs.python.org/3/library/unittest.html) module

``` nix
  checkPhase = ''
    runHook preCheck
    ${python3.interpreter} -m unittest
    runHook postCheck
  '';
```

## See also

- [buildPythonPackage implementation](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/interpreters/python/mk-python-derivation.nix)
- [Python](https://nixos.org/manual/nixpkgs/#python) in the nixpkgs manual
- [Python on Nix](https://github.com/on-nix/python) is an "Extensive collection of Python projects from PyPI"
- [Rust section of Nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#examples) - build Rust code in Python projects

## References

<a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a>

[^1]: [nixpkgs manual](https://nixos.org/nixpkgs/manual/#develop-local-package)

[^2]: <https://groups.google.com/forum/#!topic/nix-devel/3qPfwCAV3GE>
