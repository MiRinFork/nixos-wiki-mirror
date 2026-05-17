<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix For Lang Packaging -->

# Overview

Nixpkgs includes many packages written in many different languages. Each language has their own special needs which means that we end-up re-implementing similar but not exactly the same features for all these systems.

This page tries to summarize where these differences are found. Ideally this will give you an understanding of why this is a hard problem, and hopefully we can also start changing the languages so that they work better with Nix.

## Step zero

The first integration usually looks like this:

``` nix
{ stdenv, lang }:
stdenv.mkDerivation {
  name = "my-package";
  src = "...";
  buildInputs = [ lang ];
  buildPhase = ''
    lang build
  '';
  installPhase = ''
    cp buildfolder $out
  '';
}
```

Where the \`lang build\` command:

- fetches all the project dependencies over the network (usually talking to a package registry)
- unpacks the dependencies into the project structure or in a folder under \$HOME
- builds the dependencies
- builds the project

The main advantage is that it's easy to use and doesn't require a lot of coordination between nix and \$lang.

On the downside:

- the build is impure, the output may vary between runs
- build sandboxing cannot be enabled (\`--option use-sandbox true\`).
- if any dependencies of the project change, the whole project needs to be rebuilt

## Fetchers

Fetchers are special types of derivation which have network access even under sandbox. In exchange they ask for a sha256 which is checked against the \$out at build time. We are thus guaranteed of the output content even if the fetcher our sources change.

This is used by some \$lang integration to fetch all the project dependencies, either in individual chunks or as a whole. It means that some cooperation is needed for nix to place the dependencies in the right place for the \$lang build system to pick them up.

Plus:

- only fetch if the dependency list has changed
- able to cache the build dependencies

Cons:

- fetcher sha256 changes tend to be discovered late since they get cached
- tools don't generally guarantee on-disk format
- cooperation is needed between \$lang and nix

## Interspersing nix with \$lang build system

When a project has N dependencies, if each dependency could be built in isolation, then only those who change would need to be rebuilt. For this to work, the nix code has to figure out the exact dependency set and run each builds into their own derivation. This is not always possible because languages make assumptions about where the packages are installed and packages start reaching into the filesystem for build dependencies in other packages. Or even worse they start mutating other packages.

Pros:

- less rebuild

Cons:

- higher cooperation needed between \$lang and nix

## Overrides

When a project has a N dependencies, often these dependencies need additional buildInputs. Or the package needs to be patched for one reason or another.

Depending on how the dependencies are being built, some layer of indirection might be useful to inject those changes into the package build system.

A lot of build issues stem from the lack of distinction between build and runtime dependencies. Some languages don't seem to support that for some reason.

## Generating nix from lockfiles

A lot of the time, a \$lang2nix is provided to translate the dependency set into nix code. In general this becomes easier when a .lock file is provided because the \$lang-specific dependency resolution has already been done. It is even easier if all the dependencies have an associated sha256 that matches how nix calculates them.

## Curating a set of \$lang dependencies

Some languages have been collected into lists of \$lang packages within Nixpkgs. Each package is then pointed at the nixpkgs versions of its dependencies. (This is the Python preferred approach.)

Pros:

- Visibility
- Fewer touchpoints in the face of updates (esp. for security)

Cons:

- More work on Nix-side for both library and application maintainers - the process is very manual.

## Extending stdenv.mkDerivation

It's tricky to extend the stdenv.mkDerivation to make it open for extension. TODO: add more on the subject

## Overlays and binary cache

It would be nice to explore how nixpkgs-\$lang overlays could be used as extensions of the package registries. I played with that with the rubygems.org repo and just the hashes where already taking 1GB on disk. This leads me to believe that we would be better off with API results.

Associated to that, a lot of developers are dreaming of having a \$lang binary cache that they can tap into. Especially with languages like Haskell that take a long time to build. Compiling all the packages, times number of languages, times number of build input changes in nixpkgs. This leads me to believe that it would be better to help said developer to setup a CI + binary cache that they can use that only compiles the subset of packages and single nixpkgs snapshot that they are using.

## Git dependencies and hashing

One difficulty is to agree on what hash should be generated for git repositories.

Most languages assume that a repo URL and git commit SHA1 are enough to uniquely identify the code. But nix also wants a sha256.

Another difficulty is that because the \`.git\` folder is not guaranteed to have exactly the same content between clones (due to changes to the pack files), it makes it hard to always get the sha256. In most cases the \`.git\` folder can be removed to avoid these differences but it's not always possible. For example if the repo needs git submodules, or if the build system invokes \`git\` to find out repo metadata that get included in the build output, then the \`.git\` folder needs to be kept.

In the GitHub case (and probably Bitbucket, GitLab, ...), the service also provides tarballs of specific hashes. Regularly the tarball output is also changed so nixpkgs resorts on hashing the unpacked content instead.

All this means that there are many possible variations and it's going to be hard to agree on which-one is the best.

## What \$lang can do to make our lives easier

- The package registry should return sha256 of the packages with all their API results
- Avoid changing the on-disk format of unpacked packages
- Lockfiles should contain sha256 of all the dependencies
- The \$lang build tool could expose it's build plan to help interspersing nix
- ...

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a> <a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:Nixpkgs" class="wikilink" title="Category:Nixpkgs">Category:Nixpkgs</a>
