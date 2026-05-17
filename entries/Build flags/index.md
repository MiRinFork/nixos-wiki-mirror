<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Build flags -->

### Building a package for a specific CPU

By default, packages built for, say, x86_64 do not take advantage of the feature of more recent CPUs so that the executables you compile also work on older CPUs of the same architecture. This is essential because of the <a href="Binary_Cache" class="wikilink" title="binary cache">binary cache</a> feature of Nix: if a package is compiled on <a href="Hydra" class="wikilink" title="Hydra">Hydra</a> for a recent CPU, older systems using Hydra may download software that they can't run.

However, you can build some package or even all your system to take advantage of the specific model of your CPU. Note that you will not be able to take advantage of the binary cache (except for FODs) and thus must build everything locally from scratch. The first step is to determine the `-march` and `-mtune` arguments that you want to pass to gcc. In the following we want to target a skylake CPU so we use `-march=skylake -mtune=skylake`.

#### Building a single package

You need to be a trusted user to override the local system feature.

Then build the file: `nix-build optimised_openssl.nix --option system-features gccarch-skylake`

#### Adapting a derivation to specific plaforms

The technique above should pass the correct flags to gcc so that it uses the processor to its fullest. However, some build systems or configure scripts want to know whether to enable some processor-specific instructions, for example SSE. One way to do so is to inspect the `stdenv.hostPlatform.*Support` predicates. Here is an example from g2o: `cmakeFlags = [ "-DDISABLE_SSE3=${ if stdenv.hostPlatform.sse3Support then "OFF" else "ON"}" ]`

Available [flags](https://unix.stackexchange.com/questions/43539/what-do-the-flags-in-proc-cpuinfo-mean) are defined in [lib/systems/architectures.nix](https://github.com/NixOS/nixpkgs/blob/master/lib/systems/architectures.nix).

#### Building the whole system on NixOS

### Building an impure package with `-march=native`

To build an openssl specially tailored to the local CPU, build

``` nix
let
  pkgs = import <nixpkgs> {
    overlays = [
      (self: super: {
        stdenv = super.impureUseNativeOptimizations super.stdenv;
      })
    ];
  };
in
  pkgs.openssl
```

<a href="Category:Development" class="wikilink" title="Category:Development">Category:Development</a> <a href="Category:nix" class="wikilink" title="Category:nix">Category:nix</a>
