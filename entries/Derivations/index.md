<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Derivations -->

**Derivations** are the <a href="Nix_ecosystem" class="wikilink" title="Nix ecosystem">Nix ecosystem</a> way of describing any reproducible build process. While <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> comes with a plethora of packages, applications and options, there will inevitably come a time when you need to build an application, a library, a package, etc. that is not available *off the shelf* already — those are all derivations *under the hood*. This makes the build process *reproducible* and *predictable*; without changing the derivation's input configuration, the output will remain the same. In essence, a derivation is a *pure function* of an executable, and a set of input configuration, that produces exactly the same output for every invocation, in unique locations on the filesystem.

## Motivation

While the need to build software, package libraries and execute build processes is clear to anyone using any operating system, the natural question that may arise is *Why go out of our way dealing with this complicated process when I can just run a few terminal commands?* For most distributions, the answer is *they don't do things this way*. Most Linux distributions, and most operating systems for that matter, are designed to change over time; the same build process will yield different results each time it's invoked. For example, remember trying to build a package twice; the first time you build it the installation will be successful, but the second time it's built you might get an error about the paths it's trying to write to already existing. Build processes in most Linux distributions are *stateful*, the context in which they're run might change as you're using that system.

However, the Nix ecosystem is *fundamentally* different in this regard; when you build a derivation, a unique path in the <a href="Nix_store" class="wikilink" title="Nix store">Nix store</a> is assigned, and all possible outputs (including filesystem operations) produced by it will be persisted under that path. No other derivation can modify those files; the result of the derivation is **uniquely determined** by its input configuration, and subsequent reruns will produce *exactly* the same outputs . Any potential issues regarding being able to reproduce a build process are addressed *by design*, if a derivation was successful once, it will always build successfully as long as its inputs don't change.

Derivations are a powerful fundamental part of <a href="Nix" class="wikilink" title="Nix">Nix</a> and provide the core platform for managing packages in NixOS. Every package and library you include in your NixOS configuration is a derivation.

## Definition

A **derivation** is defined as *a specification for running an executable on precisely defined input files to repeatably produce output files at uniquely determined file system paths*. Simply put, it describes a set of steps to take some input and produce some output in a deterministic manner.

Derivations can be written manually using the `derivation` function; this is the most fundamental way in which they can be defined. However, since this low-level function is quite simple, building derivations this way can easily become unwieldy and repetitive. To aid in the process of creating derivations, <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> contains [the standard environment](https://nixos.org/manual/nixpkgs/unstable/#chap-stdenv) (also known as the `stdenv`), which provides a set of utility functions for the most common derivation types (e.g. a <a href="Python_libraries" class="wikilink" title="Python package">Python package</a>, a shell script, a <a href="Docker" class="wikilink" title="Docker">Docker</a> container, etc.)

## Writing a derivation

The most fundamental way to create a derivation is using the built-in `derivation` function. While you'll rarely write derivations this way in practice, understanding the low-level mechanics helps clarify what higher-level tools are doing for you. An example is provided in the first subsection. While it wouldn't be feasible to write every single derivation in this way, working through an example is an important step in one's Nix ecosystem journey. The latter subsections include more *production-ready* examples using the higher level utilities available in the ecosystem.

Regardless of how they're built, derivations take an *input* and produce an *output* through a series of *steps*. For most packages, the inputs refer to the source files, the steps refer to the compilation process and are called <a href="Derivations#Phases" class="wikilink" title="phases">phases</a>, and the outputs refer to finalized executable binaries written to some file/directory. This sequence of events can be well described within a standard environment, which the latter sections address.

### Low-level derivations

As mentioned above, writing derivations in this manner can quickly become unwieldy and unfeasible. However, in order to understand why, do check out the main article above to follow the process of writing a derivation while hitting every hurdle that you might hit when building one yourself. Doing so is the best way to understand conceptually how derivations operate. You can see what a well defined low-level derivation might look like, in this case simply creating a script that displays the message *"Hello, world!"*:

### The result of a derivation

When building a derivation, its result will be added to the Nix store, and a symlink will be provided in the current directory, called `result`.

The `$out` variable above has a special meaning in the Nix context: it points to the file that will become the result of the derivation. Thus executing `chmod +x $out` makes the derivation executable. Because directories on POSIX systems are files themselves, the derivation's result can be an entire directory of files.

The actual directory of `$out` is an implementation detail abstracted away by Nix and the stdenv builder. Anything placed within `$out` will then be part of the final derivation. Most derivation aim to follow a FHS-like structure, with the following common subdirectories:

- `$out/bin` contains binaries;
- `$out/lib` contains shared objects
- `$out/include` contains headers

In the context of systems like NixOS or <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, these paths will usually be symlinked into the top-level derivation's directories (the resulting system build).

### Standard environment derivations

The standard environment provides us with a useful utility function for creating derivations called `stdenv.mkDerivation`. Among other things, it ensures we have all the common binaries and libraries we might expect from a Linux build environment already available to us. For example, the derivation above can be rewritten, removing the need to point to the bash and `coreutil` paths ourselves, as follows:

#### Including source code

However, when building applications, packages, or derivations in general, we are almost never manually writing the source code ourselves within the derivation's build steps. Usually, we need to point to the derivation's source code. The `stdenv.mkDerivation` function takes in an attribute called `src`, which points to a location that should be included as one of the derivation's inputs.

When building the derivation, the source code will be copied in the Nix store before proceeding with the build. The reason for this is due to the nature of source code (and external files in general themselves): they *change over time*. Source code gets edited, improved, reverted, etc. By copying the source code *at the time of the derivation* to the Nix store, it becomes *immutable*; any subsequent changes would result in it getting copied to a *different path* in the store. Thus, Nix ensures the guarantees we expect from a derivation: it still is a deterministic output, a function of its inputs.

Grabbing the source code can be done in a number of different ways: it can be a store path, a location on the current system, or it can be downloaded via a [fetcher](https://nixos.org/manual/nixpkgs/unstable/#chap-pkgs-fetchers), which is a special-purpose utility function for exactly this task:

``` nix
stdenv.mkDerivation {
  src = ./relative-path/to/src;

  # or

  src = fetchFromGitHub {
    owner = "torvalds";
    repo = "linux";
    rev = "refs/tags/v6.11";

    hash = "...";
  };
}
```

### Nixpkgs packages

The Nixpkgs repository is relevant in two main ways: it itself contains many higher-level utilities that abstract over the `stdenv.mkDerivation` requirements for the most common use cases, and every <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> package is a derivation in of itself.

#### Utility functions

For example, the derivation at the beginning of this section can be rewritten in just four lines using the `writeShellScript` utility package. It handles most of the little setup required by the standard environment for us. The majority of the derivations that need to be written almost definitely can make use of one of these utility packages. For example:

#### Package metadata

Derivations meant to be included as part of Nixpkgs usually include some metadata under the meta attribute. Common fields include:

- `meta.homepage` and `meta.description` are used to describe and link to relevant information about the upstream source this derivation builds;
- `meta.platforms` is useful for Nixpkgs to determine whether a package can be built on a different system (and whether to allow so in evaluation);
- and `meta.licenses` is useful to check if a package has a suitable license that allows for re-distribution (caching in the official <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a> or in one of the community caches);
- `meta.mainProgram` describes the binary that can be considered the "main" program. For example, the cmake derivation would have this attribute set to `cmake`, which would be resolved as `$out/bin/cmake` when needed.

A fully exhaustive documentation on all meta-attributes can be found in the [Nixpkgs manual](https://nixos.org/manual/nixpkgs/unstable/#chap-meta).

## Phases

The vast majority of derivations follow a fairly established set of stages to their building—for example, configuration, building, installation, etc. Thus, the vast majority of derivations that use the standard environment's `stdenv.mkDerivation`, and any language-specific builders that make use of it, follow a convention of grouping the derivation steps in **phases**, which follow a common established pattern. However, this setup can be overridden for specific packaging systems (e.g. docker, etc.); to reduce complexity, this section will start with the generic phase setup first, expanding on how these can be overridden or modified in later sections.

By default, derivations follow a standard pre-established set of phases, that are meant to mirror how the vast majority of packages are built. Each phase is meant to control a distinct part of the build process, an approach largely inspired by GNU's Autoconf convention of `./configure`, `make`, and `make install`.

Taking the basic definition of a derivation to heart, that of being *a specification for supplying a set of steps to a builder*, each phase is defined to be a sequence of steps written in shell syntax. The phase scripts can use any program or package provided by the standard environment, such as `core-utils`, `gcc`, `gnumake`, `bash`, `gnuinstall`, etc.

By common convention, standard environment derivations contain the following phases, executed in this sequence:

1.  Unpack: handles the preparation of the build environment (e.g. extracting archives, touching files, etc.);
2.  Patch: handles changes to the underlying source code (e.g. patching bugs, adapting the source code to work in a Nix environment, etc.);
3.  Configure: handles the configuration of the build environment, for example detecting system capabilities and setting build parameters;
4.  Build: compiles the source code into binaries, bytecode, or otherwise a distributable form of the source code;
5.  Check: performs any tests on the compiled package, for example the package's test suite;
6.  Install: copies the build artefacts to the output directory, handling any needed changes (e.g. directory structure reorganisation);
7.  Fixup: process the output artefacts to work in a Nix environment (e.g.: strip binaries, override ELF paths, handle dynamic library linking, etc.);
8.  Install Check: performs any tests on the final output, essentially acting as a integration test into the Nix environment;
9.  Dist: creates distribution archives (rarely used).

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
