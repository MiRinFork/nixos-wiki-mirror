<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Quarto -->

Quarto is an open-source technical publishing system that allows you to render markdown and code chunks into technical documents. It supports several kinds of formats including HTML, PDF, and word documents.

The quarto package from nixpkgs by itself will render `qmd` markdown without any extra requirements. However in order to render R, Python, or other code chunks, you will need to include those tools.

You can use the following in your system's `configuration.nix` file:

``` nix
environment.systemPackages = let
    myPythonPackages = ps: with ps; [
      pandas
      statsmodels
      scikit-learn
      sympy
    ];
    myRPackages = with pkgs.rPackages; [
      reticulate # wanted by quarto to execute Python when using R.
      # any other RPackages - you can reuse this list for R and RStudio
    ]
    patchedQuarto = (pkgs.quarto.override {
        extraPythonPackages = myPythonPackages;
        extraRPackages = myRPackages;
      }).overrideAttrs (oldAttrs: { # Remove this overrideAttrs patch when fixed. See https://github.com/NixOS/nixpkgs/issues/519484#issuecomment-4667477454
      postPatch = (oldAttrs.postPatch or "") + ''
        substituteInPlace bin/quarto.js \
          --replace-fail "syntax-highlighting" "highlight-style"
      '';
    });
  in with pkgs; [
    #### next generation of Rmarkdown for Python, Julia, R, and JS:
    patchedQuarto
    #### Your command-line Python:
    (python3.withPackages (myPythonPackages))
    #### R and RStudio:
    (rWrapper.override {packages = myRPackages; })
    (rstudioWrapper.override { packages = myRPackages; })
  ];
```

similarly a \`flake.nix\` file with \`nix develop\`:

``` nix
{
  description = "Minimal Quarto and SymPy environment";
  inputs = {
    nixpkgs.url = "github:Nixos/nixpkgs/nixos-unstable";
  };
  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      myPythonPackages = ps: with ps; [ sympy ];
      myRPackages = with pkgs.rPackages; [ reticulate ];
      pythonEnv = pkgs.python3.withPackages (myPythonPackages);
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = [
          ((pkgs.quarto.override {
            extraPythonPackages = myPythonPackages;
            extraRPackages = myRPackages;
          }).overrideAttrs (oldAttrs: {
            # Remove this overrideAttrs patch when fixed.
            # See https://github.com/NixOS/nixpkgs/issues/519484#issuecomment-4667477454
            postPatch = (oldAttrs.postPatch or "") + ''
              substituteInPlace bin/quarto.js \
                --replace-fail "syntax-highlighting" "highlight-style"
            '';
          }))
          pythonEnv
          (pkgs.rWrapper.override {packages = myRPackages; })
        ];
        shellHook = ''
          echo "Quarto Environment Active (Pure Flake)"
          echo "Quickstart: run 'quarto render document.qmd'"
        '';
      };
    };
}
```

Or you can use the following `default.nix` or `shell.nix` file with `nix-shell` (and you don't have to pass in your Python packages via `override`):

``` nix
let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  packages = with pkgs; [

    #### The core tool can render markdown without any additional requirements:
    # quarto # commenting until this is fixed in nixpkgs - until then use below patch,
    #### see https://github.com/NixOS/nixpkgs/issues/519484#issuecomment-4667477454
    (quarto.overrideAttrs (oldAttrs: {
      postPatch = (oldAttrs.postPatch or "") + ''
        substituteInPlace bin/quarto.js \
          --replace-fail "syntax-highlighting" "highlight-style"
      '';
    }))
    
    # Render python code chunks.
    python3
    rPackages.reticulate

    # Add Python packages as needed.
    # python3Packages.matplotlib
    
    # Render R Code chunks
    R

    # Add R Package as needed.
    # rPackages.httr
    
    # A LaTex distribution is needed to render PDF documents.
    # You may be able to use a smaller distribution or customize depending on your needs.
    texliveFull
  ];
}
```

This nix shell gives you the tools render markdown documents with different kinds of code chunks. The following snippet can be placed in a "main.qmd" file.

    ---
    title: Quarto Document
    ---

    ## Section Title

    A quarto document with bash, R and python code.

    ```{sh}
    which R
    which python
    ```

    ```{r}
    plot(mpg ~ cyl, mtcars)
    ```

    ```{python}
    import os
    os.listdir()
    ```

You can render this document into various formats:

``` bash
quarto render main.qmd --to html
quarto render main.qmd --to docx
quarto render main.qmd --to pdf
```

See more examples on the official quarto website. (https://quarto.org/)

## Issue Rendering PDF Documents

    No TeX installation was detected.

    Please run 'quarto install tinytex' to install TinyTex.
    If you prefer, you may install TexLive or another TeX distribution.

If you encounter this message while generating PDF documents, you need to add a LaTex distribution to your path (e.g. texLiveFull). If you use "quarto install tinytex", quarto will download a dynamically linked binary that is incompatible with nix. If you've previously run this command, you may need to remove it before rendering PDF documents works as intended

## Issue with reticulate not finding the python installation

``` ini
13.                 └─knitr (local) engine(options)
 14.                   └─reticulate::eng_python(options)
 15.                     └─reticulate:::eng_python_initialize(options = options, envir = environment())
 16.                       └─reticulate:::ensure_python_initialized()
 17.                         └─reticulate:::initialize_python()
 18.                           └─reticulate (local) python_not_found("Installation of Python not found, Python bindings not loaded.")
```

If you encounter this message when trying to render python chunks, one solution is to add the following to default.nix example above so that 'reticulate' knows where python3(in this example) lives in the nix store:

``` diff
@@ -24,4 +24,7 @@
     # You may be able to use a smaller distribution or customize depending on your needs.
     texliveFull
   ];
+  shellHook = ''
+    export RETICULATE_PYTHON=$(which python3)
+  '';
```

When the issue appears in vscodium, one can fix it via wrapping `codium` binary:

``` nix
pkgs.vscodium.overrideAttrs (old: {
  installPhase = ''
    ${old.installPhase or ""}
    wrapProgram $out/bin/codium \
      --set RETICULATE_PYTHON ${pkgs.python3}/bin/python3
  '';
})
```
