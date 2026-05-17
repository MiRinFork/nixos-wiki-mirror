<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Bisecting -->

[Bisecting](https://git-scm.com/docs/git-bisect) is a feature of version control systems such as <a href="Git" class="wikilink" title="Git">Git</a> and <a href="Mercurial" class="wikilink" title="Mercurial">Mercurial</a> to easily pinpoint regressions. Owing to their reproducibility, Nix and NixOS are well-suited to this. As a result, we will list a few tips for using tools like this in the Nix context.

## Commit selection

There are different ways to tweak `git bisect`'s commit selection to reduce the required builds:

- `git bisect start` flag [`--first-parent`](https://git-scm.com/docs/git-bisect#Documentation/git-bisect.txt---first-parent): select merge commits, which depending on the repository can help for caching as well as commit stability.
- [`hydrasect`](https://github.com/blitz/hydrasect): select cached commits cached by Hydra
- [`nixpkgs-staging-bisecter`](https://github.com/symphorien/nixpkgs-staging-bisecter): reduce number of derivations to be built.
- [`npc`](https://github.com/samestep/npc): bisect Nixpkgs as a flake input (see below), only considering historical channel bumps instead of all `master` commits.

## Automating bisects

- [`git bisect run`](https://git-scm.com/docs/git-bisect#_bisect_run): runs the selected command until the culprit is found.
- [`nix-bisect`](https://github.com/timokau/nix-bisect): helps better judge outcome (`git bisect`'s `good` vs `bad` `skip`) and gives nicer outputs than `git bisect run`.

### Bisecting dependencies

While for regressions from changes in a Nix project itself we can bisect following the regular process, bisecting regression in dependencies is a bit different in the sense the repository you would build is separate from the repository you are bisecting. One can do this by running a bisect from a local checkout of the dependency that induced the regression.

#### Bisecting inputs of <a href="Flakes" class="wikilink" title="Flake">Flake</a> projects

For dependencies managed using Flakes, such a `bisect run` can be used with Nix Flake commands' flag `--override-input` to override specific inputs to use the bisected dependency in its inputs.

Using `git bisect run` from your local checkout of the dependency that caused the regression, the flake directory to run a command for can be overridden for a NixOS configuration, for example, using <a href="nixos-rebuild" class="wikilink" title="nixos-rebuild">nixos-rebuild</a>'s `--flake` flag. If we can reproduce the issue using a `dry-build`, this might then look like: `git bisect run nixos-rebuild dry-build --override-input $DEPENDENCY_NAME $(pwd) --flake `<NIXOS_CONFIG_DIR>`#`<FLAKE_ATTRIBUTE>.

For a regular Nix Flake project, we do not have a command flag like <a href="nixos-rebuild" class="wikilink" title="nixos-rebuild">nixos-rebuild</a>'s `--flake` to specify the directory of your project. We might then address this by wrapping the Nix command in a script changing directory there, for example using: `git bisect run sh -c "cd `<PROJECT_DIR>`; nix flake check --override-input `<DEPENDENCY_NAME>` $(pwd)"`.

<a href="Category:Version_control" class="wikilink" title="Category:Version control">Category:Version control</a>
