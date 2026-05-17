<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Continuous Integration (CI) -->

Nix nicely integrates into your CI.

TODO: some general tips & tricks

## Avoid downloading already built results

`nix-build` will always ensure the built store path is put in the local store, be it by building or by downloading from a substituter. On CI, we often only want to check whether we can build the derivation, without using or running the output.

This can be achieved by using `--dry-run` to check whether the result would be fetched, and only building it it has to be built.

[nix-build-if-changed.py](https://gist.github.com/Profpatsch/fbbc9a0006e246076f11efca0387d293) implements this in a relatively straightforward (but naïve) Python script.

[nix-build-uncached](https://github.com/Mic92/nix-build-uncached/) implements it in a slightly more elaborate manner, and is available on nixpkgs (as the `nix-build-uncached` package).

## Caching built results

After building your project you might want to cache the results. The cache server could be a [Cachix](https://cachix.org/) cache, a self-hosted [Attic](https://github.com/zhaofengli/attic) cache or even your own nix machine.

[nix-fast-build](https://github.com/Mic92/nix-fast-build) uses `nix-eval-jobs` in parallel to speed-up the evaluation and building process. It's useful for building flakes that have multiple outputs. It also supports uploading to [Cachix](https://cachix.org/) and [Attic](https://github.com/zhaofengli/attic).

You can also use `nix-copy-closure` to directly upload to a remote /nix/store through a SSH connection. As it's already built in Nix, It's the simplest way to cache the results. Albeit, in my experience it's slower.\[citation needed\]

## Instructions for specific CI Providers

### Travis CI

See <a href="Nix_on_Travis" class="wikilink" title="Nix_on_Travis">Nix_on_Travis</a> article

### Github actions

See [install-nix-action](https://github.com/cachix/install-nix-action) to install nix in Linux/macOS actions. There is also [one action](https://github.com/cachix/cachix-action) to setup [cachix](https://cachix.org/), a hosted binary cache.

[Test Your Apps and Services with GitHub Actions Quickly and for Free, a Nixcademy tutorial](https://nixcademy.com/posts/nixos-integration-test-on-github/)

#### Self-hosted runners

NixOS has a few unofficial modules for running self-hosted GitHub runners. see [srvos](https://nix-community.github.io/srvos/github_actions_runner), [juspay/github-nix-ci](https://github.com/juspay/github-nix-ci)

### Build kite

See the <a href="Buildkite" class="wikilink" title="Buildkite">Buildkite</a> article

### Drone

There is no official NixOS module however both drone and drone-cli are packaged in nixpkgs.

Mic92 has the following [custom module](https://github.com/Mic92/dotfiles/blob/master/nixos/eve/modules/drone/) in his repository. An example public project can be found in [cntr](https://github.com/Mic92/cntr/blob/e1b58463d55567bd795d1f3cfb4c6784f57c895a/.drone.yml) and this project for an example using flakes [Mic92's dotfiles](https://github.com/Mic92/dotfiles/blob/05daca459d96557eeeb72196258e6bffc73c1360/.drone.yml).

### Jenkins

<a href="Jenkins" class="wikilink" title="Jenkins">Jenkins</a>

### Gitlab

NixOS has a module for <a href="Gitlab_runner" class="wikilink" title="Gitlab runner">Gitlab runner</a>

### Garnix

[Garnix](https://garnix.io/) is a nix-specific CI provider that also provides a cache. it currently only works with flake-enabled repos.

### Sourcehut

[Sourcehut](https://sourcehut.org) provides [an official NixOS image](https://man.sr.ht/builds.sr.ht/compatibility.md#nixos)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
