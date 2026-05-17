<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Data Science workgroup -->

This workgroup is dedicated towards improving the state of the data science stack in Nixpkgs. This includes work on packages and modules for scientific computation, artificial intelligence and data processing, as well as data science IDEs.

### JupyterLab

The [JupyterWith](https://github.com/tweag/jupyterWith) repo "provides a Nix-based framework for the definition of declarative and reproducible Jupyter environments. These environments include JupyterLab - configurable with extensions - the classic notebook, and configurable Jupyter kernels."

Alternatively, [there is an unmerged pull request](https://github.com/NixOS/nixpkgs/pull/49807) with work to easily deploy arbitrary kernels and jupyter extensions with nix. There are some limitations due to jupyterlab extensions relying heavily on npm and webpack to compile the javascript modules. Thus an unpure setup was considered easiest to get it working. If the pull request were merged, the following \`default.nix\` shell would install 20 jupyerlab extension + 4 kernels (c, python, go, and ansible). All that would need to be edited by user would be kernels, additionalExtensions, and buildInputs. The rest would be automatic and would launch a jupyterlab instance for you.

``` nix
{ pkgs ? import <nixpkgs> {}, pythonPackages ? pkgs.python36Packages }:

let kernels = [
      pkgs.python36Packages.ansible-kernel
      pythonPackages.jupyter-c-kernel
      pkgs.gophernotes
    ];

    additionalExtensions = [
      "@jupyterlab/toc"
      "@jupyterlab/fasta-extension"
      "@jupyterlab/geojson-extension"
      "@jupyterlab/katex-extension"
      "@jupyterlab/mathjax3-extension"
      "@jupyterlab/plotly-extension"
      "@jupyterlab/vega2-extension"
      "@jupyterlab/vega3-extension"
      "@jupyterlab/xkcd-extension"
      "jupyterlab-drawio"
      "@jupyterlab/hub-extension"
      "jupyterlab_bokeh"
    ];
in
pkgs.mkShell rec {
  buildInputs = [
    ### Base Packages
    pythonPackages.jupyterlab pkgs.nodejs

    ### Extensions
    pythonPackages.ipywidgets
    pythonPackages.ipydatawidgets
    pythonPackages.ipywebrtc
    pythonPackages.pythreejs
    pythonPackages.ipyvolume
    pythonPackages.jupyterlab-git
    pythonPackages.jupyterlab-latex
    pythonPackages.ipyleaflet
    pythonPackages.ipympl
  ] ++ kernels;

  shellHook = ''
    TEMPDIR=$(mktemp -d -p /tmp)
    mkdir -p $TEMPDIR
    cp -r ${pkgs.python36Packages.jupyterlab}/share/jupyter/lab/* $TEMPDIR
    chmod -R 755 $TEMPDIR
    echo "$TEMPDIR is the app directory"

    # kernels
    export JUPYTER_PATH="${pkgs.lib.concatMapStringsSep ":" (p: "${p}/share/jupyter/") kernels}"

# labextensions
${pkgs.lib.concatMapStrings
     (s: "jupyter labextension install --no-build --app-dir=$TEMPDIR ${s}; ")
     (pkgs.lib.unique
       ((pkgs.lib.concatMap
           (d: pkgs.lib.attrByPath ["passthru" "jupyterlabExtensions"] [] d)
           buildInputs) ++ additionalExtensions))  }
jupyter lab build --app-dir=$TEMPDIR

# start jupyterlab
jupyter lab --app-dir=$TEMPDIR
  '';

}
```

Some recent examples of work done on libraries:

- [nlp](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+nlp+)
- [scikit-learn](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+sklearn)
- [tensorflow](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+tensorflow)

There has also been notable work on the data science infra :

- [Jupyter](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+jupyter)
- [Jupyterlab package](https://github.com/NixOS/nixpkgs/pull/38566)
- [Jupyterhub](https://github.com/NixOS/nixpkgs/pulls?utf8=%E2%9C%93&q=is%3Apr+jupyterhub)

with such highlights as [Jupyter kernels written in Nix](https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/services/development/jupyter/default.nix):

It looks like NixOS is well on its way to becoming a solid data science platform; the reproducible and language agnostic approach is a natural match to the task. But perhaps a coordinated effort be fruitful step up the game?

Lets continue the discussion here and at \#nixos-data.

## Channels

[\#datascience:nixos.org on Matrix](https://matrix.to/#/#datascience:nixos.org)

## People

<a href="User:Ixxie" class="wikilink" title="Ixxie">Ixxie</a>
