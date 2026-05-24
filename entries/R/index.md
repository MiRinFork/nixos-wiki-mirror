<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: R -->

[R](https://www.r-project.org/) comes with a very large number of packages, many of which available through nixpkgs. In particular, any package available through [CRAN](https://cran.r-project.org/).

Similarly to <a href="Python" class="wikilink" title="Python">Python</a>, your packages must be declared when installing R. Commands such as `install.packages("ggplot2")` will not work.

To install R with a collection of packages, a new nix package must be defined, for instance \<syntaxhighlight lang="nix\> with pkgs; let

` R-with-my-packages = rWrapper.override{ packages = with rPackages; [ ggplot2 dplyr xts ]; };`

in ...

</syntaxhighlight>

and then you can put `R-with-my-packages` into your `environment.systemPackages` for a system-wide installation, for instance.

If you with to use \`nix-shell\` to generate an on-the-fly environment with some R packages, the command is similar:

``` console
$ nix-shell --packages 'rWrapper.override{packages = [ rPackages.ggplot2 ];}'
```

## RStudio

RStudio uses a standard set of packages and ignores any custom R environments, like the one set up above. To install it you can use `rstudioWrapper` just as we used `rWrapper` earlier. \<syntaxhighlight lang="nix\> RStudio-with-my-packages = rstudioWrapper.override{ packages = with rPackages; \[ ggplot2 dplyr xts \]; };

</syntaxhighlight>

## Positron

Currently, the easiest way to use positron with nix is with mkShell:

``` nix
let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  packages = [
    # Positron
    pkgs.positron-bin

    # R & packages.
    pkgs.R
    pkgs.rPackages.httr
    pkgs.rPackages.ggplot2

    # Python, ipykernel & packages.
    # pkgs.python313
    # pkgs.python313Packages.ipykernel # NOTE: Required for python.
    # pkgs.python313Packages.pandas
    # pkgs.python313Packages.requests
  ];
}
```

Other utilities like rWrapper are not compatible.

## Jupyter Notebook

Use [jupyterWith](https://github.com/tweag/jupyterWith)

This **shell.nix** file creates a jupyter environment with the IRKernel available.

``` nix
{ pkgs ? import <nixpkgs> {} }:                                                 
let                                                             
  jupyter = import (pkgs.fetchFromGitHub {                                      
    owner = "tweag";                                                            
    repo = "jupyterWith";                         
    # Replace this with current revision.                              
    rev = "269999caa8d506e93ff56c8643cecb91ded2fdef";                           
    sha256 = "08iig872ay8d711n2gbfzrf496m9x9a9xwr0xca9hn7j61c3xr43";            
    fetchSubmodules = true;                                                     
  }) {};                                                                        
                                                                                
  kernels = jupyter.kernels;                                                    
                                                                                
  irkernel = kernels.iRWith {                
      name = "nixpkgs";                                                         
      # Libraries to be available to the kernel.                                
      packages = p: with p; [                                                   
        ggplot2                                                          
      ];                                           
    };                                                                          
                                                                                
  jupyterEnvironment = (jupyter.jupyterlabWith {                                
      kernels = [ irkernel ];                                                   
    });                                                                         
in                                                                              
  jupyterEnvironment.env                 
```

## R with Lorri

An example of a **shell.nix** for usage with [lorri](https://github.com/nix-community/lorri) is shown below:

``` nix
let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    buildInputs = with pkgs; [
      R
      rPackages.rmarkdown
      rPackages.knitr
    ];
  }
```

## R with Flakes and nix-direnv

R and accompanying R-packages can be installed using a <a href="Flakes" class="wikilink" title=" Flake"> Flake</a> and then managed/activated with [nix-direnv](https://github.com/nix-community/nix-direnv) to create a reproducible development environment. After the initial setup of nix-direnv (instructions provided on the GitHub README), there is a [flake template](https://github.com/nix-community/nix-direnv/blob/master/templates/flake/flake.nix) provided by the nix-direnv maintainers to get started. Run `nix flake new -t github:nix-community/nix-direnv .` to initialize the flake template in your current directory. This will create a \`flake.nix\` file that can be edited to setup the R-environment:

``` nix
{
  description = "A basic flake with a shell";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [ R rPackages.pagedown chromium pandoc ];
       };
    });
}
```

Saving the file and then running `direnv allow` in the terminal of the project directory will execute the \`flake.lock\` and build the shell. This will install the current version of R and the R-package {pagedown} that is in <nixpkgs>. Note additional system dependencies may need installed for certain packages to work such as pandoc for document conversion with {rmarkdown}. Here, chromium is installed in the \`buildInputs\` so the `chrome_print` function can be used from {pagedown}.

[Emacs has support for direnv](https://github.com/wbolster/emacs-direnv) which can be setup to use R with ESS. Direnv functionality can also be set in Doom Emacs under :tools in the \`init.el\` file in \`.doom.d\` folder.

## Install an R-package from GitHub

The R-packages available in <nixpkgs> are generated from a recent snapshot of CRAN. You may find certain packages a version behind or want to install a package not on CRAN/Bioconducter. R-packages can be installed from GitHub using \`buildRPackage\` and \`fetchFromGitHub\`. An example of installing {rmarkdown} from GitHub using a Flake:

``` nix
{
  description = "A basic flake with a shell";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      rmark = pkgs.rPackages.buildRPackage {
        name = "rmarkdown";
        src = pkgs.fetchFromGitHub{
          owner = "rstudio";
          repo = "rmarkdown";
          rev = "b87ca50c8c4d5a5876333b598aed4eb84de925a3";
          sha256 = "12mhmmibizbxgmsns80c8h97rr7rclv9hz98zpgsl26hw3s4l0vm";
        };
   propagatedBuildInputs = with pkgs.rPackages; [bslib evaluate jsonlite knitr stringr tinytex yaml xfun];
      };
    in {
      devShells.default = pkgs.mkShell {
        nativeBuildInputs = [ pkgs.bashInteractive ];
        buildInputs = with pkgs; [ R rmark pandoc ];
      };
    });
}
```

You will need to obtain the \`rev\` and \`sha256\` for the package on github [which can be found by using the \`nix-prefetch-git\` command line tool.](https://search.nixos.org/packages?show=nix-prefetch-git&type=packages&query=nix-prefetch-git) For the above example, running `nix-prefetch-git `[`https://github.com/rstudio/rmarkdown`](https://github.com/rstudio/rmarkdown) from a terminal will generate the information. You may need to manually specify other R-package/system dependencies for the specific package in the \`propagatedBuildInputs\`. This information can be found in the \`DESCRIPTION\` file of the R-package source directory.

## Install an R package from source

If you need a specific version of a package or find one that is not available in Nixpkgs, you can use \`rPackages.buildRPackage\` to build from source. The example below builds S4Arrays from BioConductor.

``` nix
let
  pkgs = import <nixpkgs> { };
  customPackage = pkgs.rPackages.buildRPackage {
    name = "S4Arrays";
    src = pkgs.fetchurl {
      url = "https://www.bioconductor.org/packages/release/bioc/src/contrib/S4Arrays_1.8.1.tar.gz";
      hash = "sha256-8f2oA0xgwI6CucXbMU1yJC4W6tiVMcDAk8D3Ur3zxw8=";
    };
    buildInputs = with pkgs.rPackages; [
      pkgs.R
      Matrix
      abind
      BiocGenerics
      S4Vectors
      IRanges
      crayon
    ];
  };
in
pkgs.mkShell {
  packages = with pkgs.rPackages; [
    pkgs.R
    Matrix
    abind
    BiocGenerics
    S4Vectors
    IRanges
    crayon
    customPackage # the package we built from source.
  ];
}
```

## A note on knitr

To knit a .Rmd file to a pdf (or .Rnw), you need to have included in your envronment `pkgs.texlive.combined.scheme-full`as well as `pandoc` or it will fail to knit. None of the other texlive packages contain the proper "frame" package. Note there are likely other workarounds but this requires the least effort.

If `R` is included (using wrapper) but `pandoc` is not wanted in the user environment, one can expose it just for the R with

``` nix
(rWrapper.override{
  packages = with rPackages; [
    markdown
    # other plugins go also here
  ];
}).overrideAttrs (old: {
  buildInputs = (old.buildInputs or []) ++ [
    pkgs.pandoc
  ];
});
```

## Other Editors

**with vim** - <a href="Nvim-r" class="wikilink" title=" nvim-r"> nvim-r</a>

**with emacs** - [emacs speaks statistics](http://ess.r-project.org/)

## External Documentation

- [R user guide in nixpkgs manual](https://nixos.org/manual/nixpkgs/stable/#r)

## Officer package

When the R package "officer" has been installed from the Nix package manager, "save_as_docx" does not work:

    Error in write_xml.xml_document(private$doc, file = private$filename) : 
    Error closing file
    Calls: save_as_docx ... print.rdocx -> <Anonymous> -> write_xml -> write_xml.xml_document
    In addition: Warning messages:
    1: In write_xml.xml_document(private$doc, file = private$filename) :
    Permission denie [1501]
    2: In write_xml.xml_document(private$doc, file = private$filename) :
    Permission denie [1501]

However officer does work if installed using the conventional install.packages() which can be enabled as discussed in <https://churchman.nl/tag/r/>

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
