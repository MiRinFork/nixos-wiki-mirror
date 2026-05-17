<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Ollama -->

[Ollama](https://ollama.ai) is an open-source framework designed to facilitate the deployment of large language models on local environments. It aims to simplify the complexities involved in running and managing these models, providing a seamless experience for users across different operating systems.

## Setup

You can add Ollama in two ways to your system configuration.

As a standalone package:

``` nix
environment.systemPackages = [ pkgs.ollama ];
```

As a systemd service:

``` nix
services.ollama = {
  enable = true;
  # Optional: preload models, see https://ollama.com/library
  loadModels = [ "llama3.2:3b" "deepseek-r1:1.5b"];
};
```

## Configuration of GPU acceleration

Acceleration is configured by selecting a package:

- ollama-cpu: disable GPU, only use CPU
- ollama-rocm: supported by most modern AMD GPUs
- ollama-cuda: supported by most modern NVIDIA GPUs
- ollama-vulkan: supported by most modern GPUs on Linux

Example: Enable GPU acceleration for Nvidia graphic cards

As a standalone package:

``` nix
environment.systemPackages = [
   (pkgs.ollama.override { 
      acceleration = "cuda";
    })
  ];
```

As a systemd service:

``` nix
services.ollama = {
  enable = true;
  package = pkgs.ollama-cuda;
};
```

To find out whether a model is running on CPU or GPU, you can either look at the logs of

``` bash
$ ollama serve 
```

and search for "looking for compatible GPUs" and "new model will fit in available VRAM in single GPU, loading"

or while a model is answering run in another terminal

``` bash
$ ollama ps
NAME         ID              SIZE      PROCESSOR    UNTIL
gemma3:4b    c0494fe00251    4.7 GB    100% GPU     4 minutes from now
```

In this example we see "100% GPU".

## Usage via CLI

### Download a model and run interactive prompt

Example: Download and run Mistral LLM model as an interactive prompt

``` bash
$ ollama run mistral
```

For other models see [Ollama library](https://ollama.ai/library).

### Send a prompt to ollama

Example: To download and run codellama with 13 billion parameters in the "instruct" variant and send a prompt:

``` bash
$ ollama run codellama:13b-instruct "Write an extended Python program with a typical structure. It should print the numbers 1 to 10 to standard output."
```

### See usage and speed statistics

Add "--verbose" to see statistics after each prompt:

``` bash
$ ollama run codellama:13b-instruct --verbose "Write an extended Python program..."
...
total duration:       50.302071991s
load duration:        50.912267ms
prompt eval count:    49 token(s)
prompt eval duration: 4.654s
prompt eval rate:     10.53 tokens/s <- how fast it processed your input prompt
eval count:           182 token(s)
eval duration:        45.595s
eval rate:            3.99 tokens/s  <- how fast it printed a response
```

## Usage via web API

Other software can use the web API (default at: <http://localhost:11434> ) to query Ollama. This works well e.g. in Intellij-IDEs with the "ProxyAI" and the "Ollama Commit Summarizer" plugins.

Alternatively, on enabling "open-webui", a web portal is available at: <http://localhost:8080/>:

`services.open-webui.enable = true;`

## Troubleshooting

### AMD GPU with open source driver

Use the ollama-rocm nix package:

``` nix
environment.systemPackages = [ pkgs.ollama-rocm ];
```

And make sure the kernel loads the amdgpu driver:

``` nix
  boot.initrd.kernelModules = [ "amdgpu" ];
```

In certain cases Ollama might not allow your system to use GPU acceleration if it cannot be sure your GPU/driver is compatible.

However you can attempt to force-enable the usage of your GPU by overriding the LLVM target. [^1]

You can get the version for your GPU from the logs or like so:

``` bash
# classical
$ nix-shell -p "rocmPackages.rocminfo" --run "rocminfo" | grep "gfx"
Name:                    gfx1031

# flakes
$ nix run nixpkgs#"rocmPackages.rocminfo" -- --run "rocminfo" | grep "gfx"
Name:                    gfx1031
```

In this example the LLVM target is "gfx1031", that is, version "10.3.1", you can then override that value for Ollama for the systemd service:

``` nix
services.ollama = {
  enable = true;
  package = pkgs.ollama-rocm;
  environmentVariables = {
    HCC_AMDGPU_TARGET = "gfx1031"; # used to be necessary, but doesn't seem to anymore
  };
  # results in environment variable "HSA_OVERRIDE_GFX_VERSION=10.3.0"
  rocmOverrideGfx = "10.3.0";
};
```

or via an environment variable in front of the standalone app

``` bash
HSA_OVERRIDE_GFX_VERSION=10.3.0 ollama serve
```

If there are still errors, you can attempt to set a similar value that is listed [here](https://github.com/ollama/ollama/blob/main/docs/gpu.md#overrides).

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a>

[^1]: <https://github.com/ollama/ollama/blob/main/docs/gpu.mdx#overrides-on-linux>
