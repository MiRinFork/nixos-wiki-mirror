<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Noisemaker -->

<https://noisemaker.readthedocs.io/en/latest/>

Right now nixpkgs contains tensorflow 2.1.0 but has it disabled for python 3.8 (as it's not officially supported upstream either).

## with tensorflow 2.3.0 from a branch

Using nixpkgs from <https://github.com/NixOS/nixpkgs/pull/95824> , you can update setup.py to change '==' versions to '\>=' for the dependencies for which NixOS is shipping newer versions, and then use the following shell.nix:

``` nix
with import <nixpkgs> {};
with python3Packages;

buildPythonPackage rec {
  name = "noisemaker";
  src = /path/to/py-noisemaker;
  propagatedBuildInputs = [
    virtualenv
    pillow
    tensorflow_2
    click
  ];
}
```

## with tensorflow 2.3.0 from pip in a venv

'python3 -m venv venv' doesn't seem to work with python 3.7, so I'm sticking with 3.8.

noisemaker wants exactly version 6.2.0 of Pillow. The pillow in nixpkgs is a different version, so this will be fetched and built with setup.py. To make sure it can correctly find the C libraries it uses, we use fshUserEnv and add some development headers:

``` nix
    { pkgs ? import <nixpkgs> {} }:
    
    let
      my-python-packages = python-packages: with python-packages; [
      ];
    in
    (pkgs.buildFHSUserEnv {
      name = "noisemaker";

      targetPkgs = pkgs: [
        (pkgs.python3.withPackages my-python-packages)
        pkgs.zlib.dev
        pkgs.libjpeg.dev
        pkgs.gcc
      ];
    }).env
```

Then create noisemaker in a venv:

``` console
 $ python3 -m venv venv
 $ source venv/bin/activate
 $ python3 setup.py develop
```

Add a newer tensorflow from pip:

``` console
$ pip install tensorflow
```

And run noisemaker:

``` console
$ noisemaker
```

(this will generate 'noise.png')
