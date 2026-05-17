<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixpkgs/Contributing -->

Development in NixOS is primarily driven by the work in [nixpkgs on GitHub](https://github.com/nixos/nixpkgs). This repository contains both all packages available in your NixOS channel and all the options you can use for configuring your system with your `configuration.nix`. To get your text editor to recognize Nix expressions, consider installing a Nix <a href="Editor_Modes_for_Nix_Files" class="wikilink" title="Editor Modes for Nix Files">Editor Modes for Nix Files</a>.

## Report issues

Any issue can be reported in the [nixpkgs issue tracker](https://github.com/nixos/nixpkgs/issues) on GitHub. Keep in mind that all work on nixpkgs is being done by volunteers and you cannot expect a quick response and solution for all problems you may face. In general Pull Requests have a much shorter round-trip-time.

## Create pull requests

If you want to see your package being provided by a channel, creating an issue will most likely not be enough. It is up to you to create a nix package description in Nixpkgs and create a pull request in the Nixpkgs repository. Pull requests are a way to tell a GitHub project that you've created some changes, which maintainers can easily review, comment on, and finally merge into the repository.

See [How to create pull requests](https://github.com/NixOS/nixpkgs/blob/master/CONTRIBUTING.md#how-to-create-pull-requests) in nixpkgs CONTRIBUTING.md.

### Hack Nixpkgs

Make any modifications you want to your local copy of the repository, then build the package from the root of the `nixpkgs` directory with:

``` bash
nix-build -A $yourpackage
```

The output of your build will be located under the `result/` subdirectory. Try running the freshly built binaries in `result/bin` and check that everything is OK.

To test the changes on a NixOS machine, rebuild the system using your newly hacked Nixpkgs by executing:

``` bash
sudo nixos-rebuild switch -I nixpkgs=/path/to/local/nixpkgs
```

### Run tests locally

Pushing commits to Github will run tests on Github.  
We can run these tests locally, to reduce "commit noise" from failing tests

    cd nixpkgs

    # Basic evaluation checks
    nix-build pkgs/top-level/release.nix -A tarball.nixpkgs-basic-release-checks \
    --arg supportedSystems '[ "aarch64-darwin" "aarch64-linux" "x86_64-linux" "x86_64-darwin"  ]'

    # list all derivations
    nix-env --query --available --out-path --file ./. --show-trace

    # build
    nix-build -A $yourpackage

Tests on Github:

- [Basic evaluation checks](https://github.com/NixOS/nixpkgs/blob/master/.github/workflows/basic-eval.yml)
- [Checking EditorConfig](https://github.com/NixOS/nixpkgs/blob/master/.github/workflows/editorconfig.yml)
  - Read <https://editorconfig.org/#download> to configure your editor
- [ofborg-eval](https://github.com/NixOS/ofborg#how-does-ofborg-call-nix-build) will call `nix-build -A $yourpackage`

#### Called without required argument

This error is produced by `nixpkgs-basic-release-checks` (Basic evaluation checks)

    anonymous function at /path/to/your-package.nix called without required argument 'some-dependency'

Usually, a dependency (some-dependency) is not available on a certain platform, for example on `aarch64-darwin`

To see how other packages handle this dependency:

    cd nixpkgs/pkgs
    grep -r some-dependency
    # -r = --recursive

##### Avoid alias

Solution 1: Replace alias names with the real package names. For example:

- utillinux → util-linux
- double_conversion → double-conversion

##### Make optional

Solution 2: Make it an optional dependency:

    { lib
    , stdenv
    , some-dependency ? null
    , another-dependency
    }:

    stdenv.mkDerivation {
      buildInputs =
        [ another-dependency ]
        ++ lib.optionals (!stdenv.isDarwin) [ some-dependency ]
        # some-dependency is missing on darwin
      ;
    }

### Manage your local repository

Tips & tricks for managing your `nixpkgs` checkout are kept in the <a href="Git#Management_of_the_nixpkgs_git_repository" class="wikilink" title="page on git">page on git</a>.

## Becoming a Nixpkgs maintainer

See [maintainers](https://github.com/NixOS/nixpkgs/tree/master/maintainers) in nixpkgs

### Building all of the packages you maintain

``` bash
nix-build maintainers/scripts/build.nix --argstr maintainer your-nick
```

## Maintain your nixpkgs fork

### Update master

Add nixpkgs as a remote called upstream:

``` sh
git remote add upstream https://github.com/NixOS/nixpkgs.git
```

You only have to do it once.

``` sh
git checkout master        #1
git fetch upstream
git branch -u upstream/master
```

1\. make sure you're on the master branch

after the above steps you only have to `git pull` to update the master branch

[source](https://stackoverflow.com/a/7244456)

<a href="Category:Community" class="wikilink" title="Category:Community">Category:Community</a>
