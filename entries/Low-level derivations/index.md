<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Low-level derivations -->

Writing **low-level derivations** without the convenience of the <a href="standard_environment" class="wikilink" title="standard environment">standard environment</a> requires understanding the core fundamentals of how <a href="Nix" class="wikilink" title="Nix">Nix</a> works. While writing <a href="derivations" class="wikilink" title="derivations">derivations</a> in this manner is not common, they can be useful when no utility present in the standard environment matches the required use case, as well as being an essential learning tool for understanding why `stdenv.mkDerivation` is needed in most cases.

In the section below, we'll start by writing a simple derivation that creates a script which displays the message *"Hello, world"* when run. While developing the Nix file, we'll be encountering the same challenges that led the Nix community to develop more ergonomic tooling. Each obstacle we hit - from missing system dependencies to path management - illustrates a core principle of Nix's purely functional build model. By the end, you'll understand both what makes Nix powerful and why most derivations use abstraction layers.

## A *Hello, world* example

Our goal is simple: creating a script that displays *"Hello, world!"*. If we were to simply create a script ourselves, it might look like this: When running this script (e.g. `$ ./example.sh`) we'll get exactly the output we want. However, we're trying to build the script using Nix. Our first approach might be to write a simple derivation similar to: There are a number of elements in this Nix file, but remembering the conceptual model of a framework makes quick work of figuring them out: a derivation is a set of *inputs along with an executable* that produces a deterministic *output*, following a list of *steps.* Here our inputs are quite literally the key-value pairs in the derivation <a href="Attribute_set" class="wikilink" title="attrset">attrset</a>: the `name` of the derivation and the system it's being built *for*. The executable (called the `builder`) is the program found at `/bin/bash`. And the steps are:

1.  Write the string `#!/bin/bash` to the output file (`$out`);
2.  Write the string `echo "Hello, World!"` to the output file;
3.  Make the output file executable.

However, if we try to build this example:

This failure could potentially be surprising. We don't have any syntactic errors, and the logic of the script sure looks good. Let's dive in into what's happening. First, we can see that the derivation is being built under the `/nix/store/l6s955asmyc22nx7y5pg3ngnzg30r4vb-hello-world.drv` path in the <a href="Nix_store" class="wikilink" title="Nix store">Nix store</a>. The hash for the derivation is how Nix is able to guarantee isolation between different invocations of a derivation with different *inputs*. The hash is essentially generated as a function of the input attrset.

However, the builder failed, because it couldn't find `/bin/bash`. This happens because the <a href="Nix_ecosystem" class="wikilink" title="Nix ecosystem">Nix ecosystem</a> isolates our build environment from the system itself, we cannot use a binary that isn't defined in our derivation, in this case <a href="bash" class="wikilink" title="bash">bash</a> itself! In order to use it, we need to add it as an input to our derivation, by referencing the package directly:

Building the package again, we'll come across another surprising error:

Turns out `chmod` is not part of our build environment either; that's how minimal the low-level derivation environment is! However, before we fix the script in a similar manner, let's observe another important detail: the store path. Compare the build location of this example, and the previous one; the SHAs are different! That is because our derivation has different inputs to the one before, therefore it's built under a different location in the Nix store. And to highlight this, without fixing the script, let's build it again:

The SHA is the same, because our inputs haven't changed. This is the essence to why derivations are *pure functions* of their inputs.

In rewriting our derivation, we need to import `chmod`, which is part of the `coreutils` package. We could point to the binary similarly to how we did it before, but for variation, let's modify our `PATH` variable instead:

Let's rebuild it again, noticing how the SHA will change again, as we changed our derivation's inputs:

This time it built successfully. Finally, let's run our script:

As mentioned above, building derivations this way can be unwieldy. But working through this example should shed some light onto why the community has built the standard environment, providing utility functions to build derivations for the most common use cases.

### Standard environment

For practicality purposes, let's compare this to the standard environment way of doing this. Using `stdenv.mkDerivation` gives us access to the common Linux utilities pre-included for us, so we don't have to do the package importing ourselves:

### Nixpkgs utilities

Even further up the chain of abstractions, <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> contains many pre-built utilities for us that handle some of the configuration involved in the standard environment as well. In our case, we can use the `writeShellScript`:
