<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ESP-IDF -->

[ESP-IDF](https://github.com/espressif/esp-idf) is the official framework to develop programs for the Espressif Systems [ESP32](https://en.wikipedia.org/wiki/ESP32) series microcontrollers. This guide explains how to install and use ESP-IDF on NixOS.

## The easy way

The ESP32 toolchain and ESP-IDF have been packaged in <https://github.com/mirrexagon/nixpkgs-esp-dev>. If you have Nix 2.4 or later, you can get a shell with everything you need to build ESP-IDF projects for ESP32 with this command (no need to download anything yourself):

``` sh
nix --experimental-features 'nix-command flakes' develop github:mirrexagon/nixpkgs-esp-dev#esp-idf-full
```

If you have an older version of Nix that doesn't support flakes, you can clone the repo and use one of the included shell files:

``` sh
mkdir ~/esp
cd ~/esp
git clone https://github.com/mirrexagon/nixpkgs-esp-dev.git
cd nixpkgs-esp-dev
nix-shell shells/esp32-idf.nix
```

See the [README](https://github.com/mirrexagon/nixpkgs-esp-dev#readme) for more information.

## The manual way

If you want to set up the environment yourself, here is one way to do it.

### Setting up the toolchain

ESP-IDF uses the Xtensa or risc-v32 ESP32 GCC toolchain. Espressif hosts the official [prebuilt binaries](https://github.com/espressif/crosstool-NG/releases) on GitHub. Sadly, these are not statically compiled, and do not work on NixOS without the use of a FHS environment. I will use `buildFHSUserEnv` to make the binaries work. Let's make a derivation out of this:

``` nix
{ stdenv, lib, fetchurl, makeWrapper, buildFHSUserEnv }:

let
  fhsEnv = buildFHSUserEnv {
    name = "esp32-toolchain-env";
    targetPkgs = pkgs: with pkgs; [ zlib ];
    runScript = "";
  };
in

stdenv.mkDerivation rec {
  pname = "esp32-toolchain";
  version = "2021r2-patch3";

  src = fetchurl {
#    url = "https://github.com/espressif/crosstool-NG/releases/download/esp-${version}/riscv32-esp-elf-gcc8_4_0-esp-${version}-linux-amd64.tar.gz";
#    hash = "sha256-F5y61Xl5CtNeD0FKGNkAF8DxWMOXAiQRqOmGfbIXTxU=";
    url = "https://github.com/espressif/crosstool-NG/releases/download/esp-${version}/xtensa-esp32-elf-gcc8_4_0-esp-${version}-linux-amd64.tar.gz";
    hash = "sha256-nt0ed2J2iPQ1Vhki0UKZ9qACG6H2/2fkcuEQhpWmnlM=";
  };

  buildInputs = [ makeWrapper ];

  phases = [ "unpackPhase" "installPhase" ];

  installPhase = ''
    cp -r . $out
    for FILE in $(ls $out/bin); do
      FILE_PATH="$out/bin/$FILE"
      if [[ -x $FILE_PATH ]]; then
        mv $FILE_PATH $FILE_PATH-unwrapped
        makeWrapper ${fhsEnv}/bin/esp32-toolchain-env $FILE_PATH --add-flags "$FILE_PATH-unwrapped"
      fi
    done
  '';

  meta = with lib; {
    description = "ESP32 toolchain";
    homepage = https://docs.espressif.com/projects/esp-idf/en/stable/get-started/linux-setup.html;
    license = licenses.gpl3;
  };
}
```

Create a new directory `~/esp` and save this derivation as `~/esp/esp-toolchain.nix`.

### Setting up ESP-IDF and the development shell

Clone the [espressif/esp-idf](https://github.com/espressif/esp-idf) repository:

``` sh
cd ~/esp
git clone --recursive https://github.com/espressif/esp-idf.git
```

Now that we have ESP-IDF in place, it's time to set up the `nix-shell` environment with all the dependencies we need.

``` nix
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "esp-idf-env";
  buildInputs = with pkgs; [
    (pkgs.callPackage ./esp32-toolchain.nix {})

    git
    wget
    gnumake

    flex
    bison
    gperf
    pkg-config

    cmake

    ncurses5

    ninja

    (python3.withPackages (p: with p; [
      pip
      virtualenv
    ]))
  ];

  shellHook = ''
    export IDF_PATH=$(pwd)/esp-idf
    export PATH=$IDF_PATH/tools:$PATH
    export IDF_PYTHON_ENV_PATH=$(pwd)/.python_env

    if [ ! -e $IDF_PYTHON_ENV_PATH ]; then
      python -m venv $IDF_PYTHON_ENV_PATH
      . $IDF_PYTHON_ENV_PATH/bin/activate
      pip install -r $IDF_PATH/tools/requirements/requirements.core.txt
    else
      . $IDF_PYTHON_ENV_PATH/bin/activate
    fi
  '';
}
```

Save this as `~/esp/shell.nix`.

You can now enter the development shell with the ESP32 toolchain and dependencies of ESP-IDF:

``` sh
cd ~/esp
nix-shell
```

That's all you need to start developing with ESP-IDF on NixOS! The next step is to follow the [ESP-IDF Get Started guide](https://esp-idf.readthedocs.io/en/latest/get-started/index.html#start-a-project) from section "Start a project" onward.

## See also

- [esp32.nix](https://github.com/bgamari/esp32.nix) provides nix expression for building the esp32 sdk as well as micropython.
- [esp32-baremetal](https://github.com/taktoa/esp32-baremetal) has an example how to build esp32 firmware without relying on an sdk.
- [tutorial](https://web.archive.org/web/20240621182952/https://specific.solutions.limited/projects/hanging-plotter/electronics) for setting up the prebuilt toolchain with vscode

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>
