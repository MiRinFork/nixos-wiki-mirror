<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenCV -->

[OpenCV](https://opencv.org/) is the world's largest and most popular computer vision library[^1]. It is open source under the <a href="wikipedia:Apache_License" class="wikilink" title="Apache License">Apache License</a> 2[^2]. OpenCV interfaces with many languages such as C++, Python and Java[^3].

Due to needing dynamically linked libraries and not having all necessary dependencies packaged with the base version of the OpenCV package for all uses, this page was created to help with the initial hassle of getting OpenCV to run in development environments.

## Python

To use OpenCV with Python it is generally recommended to use the Python3XXPackage package found in <a href="nixpkgs" class="wikilink" title="nixpkgs">nixpkgs</a>. Although, as OpenCV is written mainly in C++[^4], it relies heavily on stdlibc which is a dynamically linked library. Attempting to run any OpenCV algorithms in Python may thereby lead to errors such as this:

``` bash
ImportError: libstdc++.so.6: cannot open shared object file: No such file or directory
```

There are two main ways of solving this issue, using a shell.nix or flakes.

### Shell.nix Example

``` nix
{ pkgs ? import <nixpkgs> {} }:

let
  pythonWithOpencv = pkgs.python3.withPackages (ps: [
    ps.opencv4
  ]);
in
pkgs.mkShell {
  buildInputs = [
    pythonWithOpencv
    pkgs.pkg-config
    pkgs.stdenv.cc.cc.lib
  ];

  shellHook = ''
    export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH
    echo "Python with OpenCV ready (cv2 version: $(python -c 'import cv2; print(cv2.__version__)'))"
  '';
}
```

### Flake.nix Example

``` nix
{
  description = "Python development environment with OpenCV";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        python-with-opencv = pkgs.python3.withPackages (ps: [
          ps.opencv4
        ]);
      in {
        devShell = pkgs.mkShell {
          buildInputs = [
            python-with-opencv
            pkgs.pkg-config
            pkgs.stdenv.cc.cc.lib
          ];

          shellHook = ''
            export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH
            echo "Python environment ready with OpenCV $(python -c 'import cv2; print(cv2.__version__)')"
          '';
        };
      }
    );
}
```

Both the dev shell and flake examples only allow for the base compilation of OpenCV. You can enable other flags such as gtk support to use functions like cv2.imshow() by using [overrides](https://nixos.org/guides/nix-pills/17-nixpkgs-overriding-packages.html). Beware, this may cause a full recompilation of OpenCV as you're changing build flags and that specific combination may not be cached for your system.

### Shell.nix Override Example

``` nix
{ pkgs ? import <nixpkgs> {
    overlays = [
      (self: super: {
        opencv4 = super.opencv4.override {
          enableGtk3 = true;
          enablePython = true;
        };
      })
    ];
  }
}:

pkgs.mkShell {
  buildInputs = [
    (pkgs.python3.withPackages (ps: [ pkgs.opencv4 ]))
    pkgs.stdenv.cc.cc.lib
  ];
  LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
}
```

### Flake.nix Override Example

``` nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        overlays = [
          (final: prev: {
            opencv4 = prev.opencv4.override {
              enableGtk3 = true;
              enablePython = true;
            };
          })
        ];
      };
    in {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          (pkgs.python3.withPackages (ps: [ pkgs.opencv4 ]))
          pkgs.stdenv.cc.cc.lib
        ];
        LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
      };
    };
}
```

## Rust

It is important to note that the most popular OpenCV package for rust, [opencv-rust](https://github.com/twistedfall/opencv-rust), is just a series of bindings for the C++ version of OpenCV, and is thereby unsafe. Errors that occur while trying to use these bindings may just fail quietly or return an error from the underlying C++ code. There is an effort to implement most of the main computer vision algorithms entirely in rust called [rust-cv](https://github.com/rust-cv/cv). The package has not been actively maintained since July of 2023.

The opencv-rust package does not include the C++ bindings, thereby requiring it to be installed alongside the package itself. Luckily, it is packaged in nixpkgs and using it is just a question of getting it on our system, the crate does the rest of the work.

### Flake.nix Example

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          glib
          ffmpeg
          libva
          pkg-config
          opencv
        ];
        shellHook = ''
          export LIBCLANG_PATH="${pkgs.llvmPackages.libclang.lib}/lib";
        '';
      };
    };
}
```

You may also want to override the base package. You can do this easily with this example:

### Flake.nix Override Example

``` nixos
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          gtk2
          glib
          ffmpeg
          libva
          pkg-config
          (opencv.override { enableGtk2 = true; })
        ];
        shellHook = ''
          export LIBCLANG_PATH="${pkgs.llvmPackages.libclang.lib}/lib";
        '';
      };
    };
}
```

<a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a> <a href="Category:Rust" class="wikilink" title="Category:Rust">Category:Rust</a>

[^1]: <https://opencv.org/>

[^2]: <https://github.com/opencv/opencv?tab=Apache-2.0-1-ov-file#>

[^3]:

[^4]: <https://github.com/opencv/opencv>
