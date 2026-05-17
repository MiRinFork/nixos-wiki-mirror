<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenModelica -->

[OpenModelica](https://openmodelica.org/) is an open-source modeling and simulation environment for the Modelica language, used for designing, simulating, and analyzing complex dynamic systems. It provides tools for creating models, running simulations, and visualizing results, supporting applications in engineering and science.

## Installation

``` bash
nix-shell -p openmodelica.combined
```

This is not working. There are several problems:

1.  The installed version will be 1.18.0 but currently (2025-06-09) the latest version is 1.25.0.
2.  One dependency is `qtwebkit` but this is currently (NixOS 25.05 (Warbler)) marked as an insecure package.
    1.  When allowing `qtwebkit` as insecure package to be installed then during the build process of `qtwebkit` there are compilation errors.

## Build from source

See here (working for NixOS 25.05 as of 2025-06-10): <https://github.com/MBanucu/NixOS2505BuildOpenModelicaFromSource>

<a href="Category:Scientific_applications" class="wikilink" title="Category:Scientific applications">Category:Scientific applications</a>
