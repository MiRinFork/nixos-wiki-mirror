<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tensorflow -->

[TensorFlow](https://www.tensorflow.org/) is a free and open-source software library for machine learning and artificial intelligence.

# Tensorflow

### Quick shell [^1]

`nix-shell --arg config '{ cudaSupport = true; allowUnfree = true; }' -p 'python3.withPackages (ps: [ ps.tensorflow ]``)'`

This starts a shell with tensorflow and it has GPU support.

### Shell config

A basic shell config would look something like this:

<code>`# shell.nix`  
`{ pkgs ? import `<nixpkgs>` {}, config ? {} }:`  
`let`  
`  pythonPackages = pkgs.python3.withPackages (ps: [ ps.tensorflow ]);`  
`in`  
`pkgs.mkShell {`  
`  name = "tf";`  
`  buildInputs = [`  
`    (pythonPackages)`  
`  ];`  
`  shellHook = ''`  
`    export PYTHONPATH="${pythonPackages}:${PYTHONPATH:-}"`  
`  '';`  
`}`</code>

To make this configuration work, edit `~/.config/nxpkgs/config.nix`:

<code>`# ~/.config/nxpkgs/config.nix`  
`{ cudaSupport = true; allowUnfree = true;  }`</code>

## References

[^2]

<a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a>

[^1]: <https://discourse.nixos.org/t/cuda-tensorflow-my-setup-is-really-hacky-would-appreciate-help-unhackying-it/43912/2>

[^2]:
