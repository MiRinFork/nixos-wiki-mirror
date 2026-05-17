<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Coq -->

## Installation

The [Coq proof assistant](https://coq.inria.fr) and associated tools (coqtop, coqc, coq_makefile, …) may be installed globally, by a user, in its profile:

`nix-env -iA nixpkgs.coq`

If you want CoqIDE:

`nix-env -iA nixpkgs.coqPackages.coqide`

Coq can also be run in a local, ephemeral, environment. For instance, the following command will launch coqtop or CoqIDE without installing it in the user profile:

`nix-shell -p coq -c coqtop`

`nix-shell -p coqPackages.coqide -c coqide`

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

A few third-party libraries are available under the *coqPackages* attribute set.

A simple way to use such a library is within a temporary shell, e.g.,

`nix-shell --packages coq coqPackages.mathcomp`

This will open a shell in which both Coq and the [Mathematical Components library](https://math-comp.github.io/math-comp/) are available. Notice that even if Coq is globally installed, it is required to list it as an input of the shell.

### Using non-default versions of packaged libraries

For some libraries, several versions are available in nixpkgs. However, there is a default one and accessing non-default versions is non trivial. For instance, at the time of writing (February 2024, nixos 23.11) `coqPackages.mathcomp` refers to the mathcomp library at version 1.18.0 (for Coq 8.18). An other version of this library may be accessed by overriding its `version` argument, as follows: `coqPackages.mathcomp.override { version = "2.1.0"; }`.

In more complex situations, it may be necessary to override several packages, or to use an overridden package as input to an other one. In order to get a consistent set of Coq libraries, one can use the `overrideScope'` function; for instance `coqPackages.overrideScope' (self: super: { mathcomp = super.mathcomp.override { version = "2.1.0"; }; })` is a set of Coq packages in which mathcomp is at version 2.1.0 (i.e., any package in this set that uses mathcomp will use that version).

### Global installation of libraries

It is possible to globally install a Coq library as any other Nix package. Notice however that it will not be automatically visible to Coq. Coq search for libraries in the directories that are listed in the *COQPATH* environment variable. When using Coq in a Nix shell (as described above), this variable is automatically populated with paths to the Coq libraries that are provided by the shell inputs. You may manually define this variable to point to your profile, e.g.,

`export COQPATH=$HOME/.nix-profile/lib/coq/8.7/user-contrib`

## See also…

Related blog post: <https://yannherklotz.com/nix-for-coq/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
