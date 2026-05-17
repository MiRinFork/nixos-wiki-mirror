<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: JAX -->

[JAX](https://github.com/google/jax) is a framework for program transformation, esp. for automatic differentiation and machine learning. It's available in <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a> in the `python3Packages.` packages.

## Example shell.nix, CPU only

``` nix
let
  # Last updated 01/31/2022. Check status.nixos.org for updates.
  pkgs = import (fetchTarball("https://github.com/NixOS/nixpkgs/archive/376934f4b7ca6910b243be5fabcf3f4228043725.tar.gz")) {};
in pkgs.mkShell {
  buildInputs = with pkgs; [
    python3
    python3Packages.jax
    python3Packages.jaxlib
  ];
}
```

## Example shell.nix with GPU support

JAX defers execution to the jaxlib library for execution. In order to use GPU support you'll need a <a href="NVIDIA" class="wikilink" title="NVIDIA">NVIDIA</a> GPU and <a href="OpenGL" class="wikilink" title="OpenGL">OpenGL</a>. In your `/etc/nixos/configuration.nix`:

``` nix
# NVIDIA drivers are unfree
nixpkgs.config.allowUnfree = true;
services.xserver.videoDrivers = [ "nvidia" ];
hardware.opengl.enable = true;
```

Then you can use the `jaxlibWithCuda` package (equivalent to setting the `cudaSupport` parameter):

``` nix
let
  # Last updated 01/31/2022. Check status.nixos.org for updates.
  pkgs = import (fetchTarball("https://github.com/NixOS/nixpkgs/archive/376934f4b7ca6910b243be5fabcf3f4228043725.tar.gz")) {};
in pkgs.mkShell {
  buildInputs = with pkgs; [
    python3
    python3Packages.jax
    python3Packages.jaxlibWithCuda
  ];
}
```

You can test that JAX is using the GPU as intended with

``` bash
# after version 0.8.0
python -c "import jax.extend as ex; print(ex.backend.get_backend().platform)"
 
# before version 0.8.0
python -c "from jax.lib import xla_bridge; print(xla_bridge.get_backend().platform)"
```

It should print either `cpu`, `gpu`, or `tpu`.

## FAQ

### How do I package JAX libraries?

Never ever ever put `jaxlib` in `propagatedBuildInputs`. However, it may live happily in `buildInputs` or `checkInputs`. See <https://github.com/NixOS/nixpkgs/pull/156808> for context.

### RuntimeError: Unknown: no kernel image is available for execution on the device

This usually indicates that you have a driver version that is too old for the CUDA toolkit version the package is built with. The easiest fix is to set the environment variable `XLA_FLAGS="--xla_gpu_force_compilation_parallelism=1"`. Also consider upgrading your CUDA driver.

See <https://github.com/google/jax/issues/5723#issuecomment-913038780>.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a>
