<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Llama-cpp -->

The `llama-cpp` package in [nixpkgs](https://search.nixos.org/packages?channel=25.11&query=llama-cpp#show=llama-cpp) contains several tools provided by the [llama.cpp](https://github.com/ggml-org/llama.cpp) repository. A non-exhaustive example includes: `llama-cli`, `llama-server`, and `llama-bench`

The package comes in 3 flavors:

- `llama-cpp`: the umbrella package, it uses the CPU if it doesn't find any GPU. On Mac Sillicon, it automatically detects that it should use the Metal backend. And for NVIDIA CUDA, you need to enable cudaSupport and unfree packages.
- `llama-cpp-rocm`: for [AMD ROCm](https://en.wikipedia.org/wiki/ROCm) software stack. Under the shell, it's just `llama-cpp` with rocmSupport enabled.
- `llama-cpp-vulkan`: for [Vulkan](https://en.wikipedia.org/wiki/Vulkan), which works with multiple CPU's and GPU's. Under the shell, it's just `llama-cpp` with vulkanSupport enabled. In some situations, it may perform even better than ROCm.

You can install any of the 3 in your system depending on your configuration. If your system is not covered by one of those packages, you can probably still install `llama-cpp` and with some customization make it fit your system

## Customization

### Nvidia CUDA

Nvidia CUDA contains <a href="Unfree_software" class="wikilink" title="Unfree software">Unfree software</a>, so you have to enable it first, either in your NixOS configuration or via environmental variables.

#### in NixOS

After enable Unfree software in NixOS add CUDA to your packages

``` nixos
{
  environment.systemPackages = [
    (pkgs.llama-cpp.override { cudaSupport = true; })
  ];
}
```

And do a switch to the new configuration

`sudo nixos-rebuild switch`

#### in a shell

If you want take the CUDA package for a spin, before adding it to your system, you can open it in a shell:

``` bash
export NIXPKGS_ALLOW_UNFREE=1
nix shell --impure --expr '(import (builtins.getFlake "nixpkgs") {}).llama-cpp.override { cudaSupport = true; }'
```

### BLAS Support

BLAS support is automatically enabled if none of the GPU accelerators are enabled. You can still manually enable it in your nix configuration by doing:

``` nixos
{
  environment.systemPackages = [
    (pkgs.llama-cpp.override { blasSupport = true; })
  ];
}
```

### AMD ROCm

Sometimes, ROCm might not be using the correct GPU architecture, or you simply want to try a different one, because it might work better. To tell ROCm which GPU architecture to use, you can use the `HSA_OVERRIDE_GFX_VERSION` environmental variable.

E.g:

``` bash
export HSA_OVERRIDE_GFX_VERSION='11.5.1'
```

| Arch             | Version | Example card      |
|------------------|---------|-------------------|
| RDNA 3 APU       | 11.0.0  | 780M              |
| Strix Point      | 11.5.0  | 880M              |
| Strix Halo       | 11.5.1  | Radeon 8060S      |
| RDNA 4 "Navi 48" | 12.0.1  | Radeon RX 9070 XT |

## Models

When usage `llama-cli` or `llama-server`, you can tune the parameters of the model.

Open models, usually include a card in their model page explaining how to optimize the parameters for different tasks.

For example, [Qwen3-Coder-Next-GGUF](https://huggingface.co/unsloth/Qwen3-Coder-Next-GGUF#best-practices) reads:

> To achieve optimal performance, we recommend the following sampling parameters: temperature=1.0, top_p=0.95, top_k=40.

And more general purpose models, may include multiple options sets for different purposes, e.g: chat, coding, agent, etc.

### How much RAM do I need?

To calculate how much RAM you are going to need, the first signal is the number of parameters. You can make a loose estimate that 80B params will require 80GB RAM.

A better signal, is the size of the model. An 80B params model may be quantized, and the final size might be 60GB. By adding a 15% for context buffer, you would need an aprox. of 69 GB RAM.

When your **GPU doesn't have enough RAM**, with `llama-cli` or `llama-server` you can **offload** some of it to your system's RAM, by using the flag `-ngl`. Read the [cli reference](https://github.com/ggml-org/llama.cpp/blob/master/docs/multi-gpu.md#command-line-arguments-reference)

### What are Mixture of Experts (MoE)?

MoE refers to models with a high param count (e.g: 35B), but they only activate a small amount during usage (e.g: 3B).

This ends up improving performance, but the model still needs to fit in RAM.

For example, `Qwen3.6-35B-A3B` has 35B param count, but only 3B are active.

### Performance

Performance is **bottle-necked by memory bandwidth**. You can keep an eye for new developments and breakthroughs. But otherwise, it's hard to squeeze more performance from a model.

Don't confuse GPU's memory bandwidth with GPU's memory (RAM).

| System | Memory bandwith | Est. Tokens/Sec (8B, Q4) | Notes |
|----|----|----|----|
| Nvidia RTX 5090 | 1792 GB/s | ~310 – 330 t/s |  |
| Nvidia RTX 4090 | 1008 GB/s | ~180 – 200 t/s |  |
| Apple M3 Ultra | 800 GB/s | ~145 – 155 t/s |  |
| Radeon RX 9070 XT | 640 GB/s | ~110 – 125 t/s |  |
| Strix Halo (AI Max+ 395+) | 256 GB/s | ~45 – 50 t/s |  |
| Strix Point (HX 370) | 89 – 136 GB/s | ~12 – 25 t/s | Depends on the type of RAM used |

## llama-cli

Once you've made `llama-cpp` available in your system. You can use `llama-cli`, which is a straightforward to use tool.

In your shell:

``` bash
llama-cli \ 
  -hf unsloth/Qwen3-Coder-Next-GGUF:UD-Q4_K_M \ 
  --temp 1.0 --top-p 0.95 --top-k 40 \ 
  -p "briefly explain journalctl in one paragraph"
```

## llama-server

`llama-server` runs a server, and it can run models on demand. It supports OpenAI API standard. It's quite similar to <a href="Ollama" class="wikilink" title="Ollama">Ollama</a>.

You can manually start the server from your terminal, it's usage, is not that different from `llama-cli`,

``` bash
llama-server \
    -hf unsloth/Qwen3-Coder-Next-GGUF:UD-Q4_K_M \ 
    --temp 1.0 --top-p 0.95 --top-k 40 
```

Or alternatively, you can **enable the NixOS service** for llama-cpp, which runs the server.

``` nixos
{
  services.llama-cpp = {
    enable = true;
    package = pkgs.llama-cpp-vulkan;
    # package = (pkgs.llama-cpp.override { cudaSupport = true; })
    # package = pkgs.llama-cpp-rocm;

    # Takes care of downloading if model not present
    modelsPreset = {
      "Qwen3-Coder-Next" = {
        hf-repo = "unsloth/Qwen3-Coder-Next-GGUF";
        hf-file = "Qwen3-Coder-Next-UD-Q4_K_XL.gguf";
        alias = "unsloth/Qwen3-Coder-Next";
        temp = "1.0";
        top-p = "0.95";
        top-k = "40";
      };
    };
  };
}
```

And do a switch to the new configuration

    sudo nixos-rebuild switch

### Web UI

The llama-cpp service includes a web interface, where you can chat. To access you must navigate to <http://localhost:8080> . Or the `services.llama-cpp.port` configured.

### Troubleshooting

#### Failed to create //.cache for shader cache

This is a known issue ([441531](https://github.com/NixOS/nixpkgs/issues/441531)), until it gets fixed, you can add to your conf:

``` nixos
{
  systemd.services.llama-cpp = {
    environment = {
      XDG_CACHE_HOME = "/var/cache/llama-cpp";
      MESA_SHADER_CACHE_DIR = "/var/cache/llama-cpp";
    };
  };
}
```

#### Migration to nixos-unstable (RFC42)

Since [RFC42](https://github.com/NixOS/rfcs/blob/master/rfcs/0042-config-option.md) was approved, services are being migrated to use `.settings`, including `llama-cpp`. This is already the case for `nixos-unstable`. If you are using unstable, this is how you can migrate your service:

``` diff
{
  services.llama-cpp = {
    enable = true;
    package = pkgs.llama-cpp-vulkan;
-    port = 8083;
-    modelsPreset = {
+    settings.port = 8083;
+    settings.models-preset = (pkgs.formats.ini { }).generate "models-preset.ini" {
      "Qwen3-Coder-Next" = {
        hf-repo = "unsloth/Qwen3-Coder-Next-GGUF";
        hf-file = "Qwen3-Coder-Next-UD-Q4_K_XL.gguf";
        alias = "unsloth/Qwen3-Coder-Next";
        temp = "1.0";
        top-p = "0.95";
        top-k = "40";
      };
    };
  };
}
```
