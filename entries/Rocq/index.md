<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Rocq -->

[Rocq](https://rocq-prover.org/) (formerly known as Coq) is an interactive theorem prover. Consult the [nixpkgs manual](https://nixos.org/manual/nixpkgs/unstable/#sec-language-rocq) for more information about using Rocq with Nix.

## Installation

Rocq and associated tools (repl, checker, makefile generator, compiler, …) may be install globally, by a user, in its profile:

`nix-env -iA nixpkgs.rocq-core`

Rocq can also be run in a local, ephemeral, environment. For instance, the following command will launch the Rocq repl without installing it in the user profile:

`nix-shell -p rocq-core --command "rocq top"`

You will probably also want the standard library (Stdlib) for Rocq containing definitions and lemmas about lists, relations, numbers, … It can be done by using the *rocqPackages* package set:

`nix-env -iA nixpkgs.rocqPackages.stdlib`

More details about libraries can be found in the <a href="Rocq#Using_libraries" class="wikilink" title="Using libraries">Using libraries</a>

<em>The *rocq-core* package can also be installed using *rocqPackages.rocq-core*.</em>

## Coq compatibility

In order to keep the compatibility with preexisting tools, compilation pipelines and workflows, the *coq* package is still available with its associated tools being aliases to the new Rocq variants (e.g. *coqc* corresponding to *rocq compile*). This compatibility package can be installed via:

`nix-env -iA nixpkgs.coq`

In the same way of *rocqPackages*, a *coqPackages* packages set is available to go with the *coq* compatibility package.

## RocqIDE

Using the RocqIDE can be done by adding a flag to the *coq* compatibility package asking to also build the IDE. Here is a command spawning a nix shell having the IDE and running it (last tested in July 2026, on nixpkgs 26.05):

`nix-shell -p "coq.override { buildIde = true; }" --command rocqide`

## ProofGeneral

[ProofGeneral](https://proofgeneral.github.io/) is a “generic <a href="Emacs" class="wikilink" title="Emacs">Emacs</a> interface for proof assistants”. A working <a href="Emacs" class="wikilink" title="Emacs">Emacs</a> is needed.

To install ProofGeneral, you can use the corresponding attribute:

`nix-env -iA nixpkgs.emacsPackages.proofgeneral_HEAD`

Then, the following line should be added to Emacs configuration (aka *.emacs*):

`(require 'proof-site "~/.nix-profile/share/emacs/site-lisp/ProofGeneral/generic/proof-site")`

The ProofGeneral mode automatically sets the *electric-indent-mode* (recomputes the indentation of a line when leaving it), that some find extremely annoying. To disable it, the following line may be added to the *.emacs* file:

`(when (fboundp 'electric-indent-mode) (electric-indent-mode 0))`

There is an additional annoyance with evil-mode; see [two](https://github.com/syl20bnr/spacemacs/issues/8853#issuecomment-302706114) [discussions](https://github.com/ProofGeneral/PG/issues/174#issuecomment-293719295) describing a work-around, namely to include the following before loading evil-mode:

`(setq evil-want-abbrev-expand-on-insert-exit nil)`

## Using libraries

A few third-party libraries are available under the *rocqPackages* attribute set.

A simple way to use such a library is within a temporary shell, e.g.,

`nix-shell --packages rocqPackages.rocq-core rocqPackages.stdlib rocqPackages.mathcomp`

This will open a shell in which both Rocq and the [Mathematical Components library](https://math-comp.github.io/math-comp/) are available. Notice that even if Rocq is globally installed, it is required to list it as an input of the shell.

### Using non-default versions of packaged libraries

For some libraries, several versions are available in nixpkgs. However, there is a default one and accessing non-default versions is non trivial. For instance, at the time of writing (July 2026, nixpkgs 26.05) `rocqPackages.mathcomp` refers to the mathcomp library at version 2.5.0 (for Coq 9.1). An other version of this library may be accessed by overriding its `version` argument, as follows: `ocqPackages.mathcomp.override { version = "mathcomp-2.6.0"; }` with *mathcomp-2.6.0* being the [tag name of a release on the Mathcomp GitHub repo](https://github.com/math-comp/math-comp/releases/tag/mathcomp-2.6.0).

In more complex situations, it may be necessary to override several packages, or to use an overridden package as input to an other one. In order to get a consistent set of Rocq libraries, one can use the `overrideScope` function; for instance `rocqPackages.overrideScope (self: super: { mathcomp = super.mathcomp.override { version = "mathcomp-2.6.0"; }; })` is a set of Rocq packages in which *mathcomp* is at version 2.6.0 (i.e., any package in this set that uses *mathcomp* will use that version).

### Global installation of libraries

It is possible to globally install a Rocq library as any other Nix package. Notice however that it will not be automatically visible to Rocq. Rocq searches for libraries in the directories that are listed in the *ROCQPATH* (or *COQPATH* for compatibility) environment variable. When using Rocq in a Nix shell (as described above), this variable is automatically populated with paths to the Rocq libraries that are provided by the shell inputs. You may manually define this variable to point to your profile, e.g.,

`export ROCQPATH=$HOME/.nix-profile/lib/coq/9.1/user-contrib`

## See also

Related blog post: <https://yannherklotz.com/nix-for-coq/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
