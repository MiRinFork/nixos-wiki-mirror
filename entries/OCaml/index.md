<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OCaml -->

<figure>
<img src="OCaml_Logo.svg" title="OCaml logo" />
<figcaption>OCaml logo</figcaption>
</figure>

According to the official \[ocaml.org Ocaml website\]:

> `[Ocaml is]... an industrial-strength functional programming language with an emphasis on expressiveness and safety        `

## Developping in OCaml with Nix

Most packages related to OCaml, in particular the OCaml compiler and many libraries, belong to the `ocamlPackages` attribute set of nixpkgs. Tools for OCaml development are, in particular, available:

- the [dune](https://dune.build/) builder;
- the [OCaml language server](https://github.com/ocaml/ocaml-lsp);
- the [ocamlformat formatter](https://github.com/ocaml-ppx/ocamlformat).

### Build tooling

Modern development in OCaml tend to use `dune`, a build system dedicated for OCaml projects. Nixpkgs provide a dedicated helper [buildDuneProject](https://nixos.org/manual/nixpkgs/stable/#sec-language-ocaml-packaging) to facilitate integration with `dune`.

An example minimal flake for OCaml development is available below:

`nix develop` followed by `dune init project myproject` will drop you in a development shell.

#### Opam

OCaml has its own package manager, [opam](https://opam.ocaml.org/). Trying to use it imperatively with Nix will result in errors. However, `opam` can generate a `.opam` file, which can be ingested by tools like [opam-nix](https://github.com/tweag/opam-nix) to automatically generate a Nix derivation.

#### Manual build with ocamlc, findlib, ocamlfind

OCaml libraries are usually located using [findlib](http://projects.camlcity.org/projects/findlib.html) and the associated `ocamlfind` tool. These tools are found under the `ocamlPackages.findlib` attribute and rely on the `OCAMLPATH` environment variable.

A hook in the `findlib` package will automatically populate this variable with the paths to the other libraries. For instance, when starting a shell with `nix-shell --packages ocamlPackages.findlib ocamlPackages.batteries` will set the `OCAMLPATH` variable so that `ocamlfind` can locate the `batteries` library.

This hook also sets the `CAML_LD_LIBRARY_PATH` environment variable that is used for locating the dynamically loaded shared libraries (aka stublibs).

### Scripting with OCaml

OCaml can be used in nix-shell scripts as follows:

``` ocaml
#!/usr/bin/env nix-shell
(*
#!nix-shell --pure -i ocaml -p ocaml
*)

print_string "Hello world! 🚀 \n";;
```

### Using Emacs

[Tuareg](https://github.com/ocaml/tuareg) is an Emacs OCaml mode. It can be installed with `nix-env -iA nixpkgs.emacsPackagesNg.tuareg`.

Emacs must be configured to be able to find this package: you may need to add a line like this to your `.emacs` file, somewhere between `(require 'package)` and `(package-initialize)`:

``` emacs
(add-to-list 'package-directory-list "~/.nix-profile/share/emacs/site-lisp/elpa")
```

There is some more documentation in the [nixpkgs sources](https://github.com/NixOS/nixpkgs/blob/master/pkgs/top-level/emacs-packages.nix).

[Merlin](https://github.com/ocaml/merlin) provides additional functionality to Emacs. It can be installed through `nix-env -iA nixpkgs.ocamlPackages.merlin`.

Beware that merlin is specific to one particular version of OCaml (it won’t work correctly with a compiler of a different version).

To configure Emacs and enable the merlin mode, add the following to your `.emacs`:

``` emacs
(add-to-list 'load-path "~/.nix-profile/share/emacs/site-lisp")
(require 'merlin)
(add-hook 'tuareg-mode-hook 'merlin-mode t)
```

Also, a specific variable (`merlin-command`) of the merlin mode must be overridden (its default is `opam`):

``` emacs
(custom-set-variables
  '(merlin-command "ocamlmerlin")
)
```

A useful complement to merlin is [**ocp-indent**](https://www.typerex.org/ocp-indent.html), a customizable tool to indent OCaml code. It can be installed using `nix-env -iA nixpkgs.ocamlPackages.ocpIndent`. To enable it in Emacs, don’t forget to add the following line to your `.emacs`:

``` emacs
(require 'ocp-indent)
```

### Specific version of the OCaml compiler

Various versions of the `ocamlPackage` attribute set are available, corresponding to various versions of OCaml. For instance, the attribute set `ocaml-ng.ocamlPackages_4_04` contains the OCaml compiler at version 4.04 and OCaml libraries compiled with that particular compiler.

#### Custom version

So as to get the set of OCaml libraries built with/for a custom version of the OCaml compiler, e.g., to enable `flambda` support, you may use the `ocamlPackages.overrideScope` function:

``` nix
ocamlPackagesFlambda = ocamlPackages.overrideScope (self: super: {
  ocaml = super.ocaml.override { flambdaSupport = true; };
});
```

More details: <https://github.com/NixOS/nixpkgs/pull/53357#issuecomment-451727433>

<a href="Category:Languages" class="wikilink" title="Category:Languages">Category:Languages</a>
