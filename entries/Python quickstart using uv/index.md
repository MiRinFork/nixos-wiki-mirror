<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Python quickstart using uv -->

This tutorial shows the most straightforward way to install and use [uv](https://github.com/astral-sh/uv) with Python on NixOS. It covers installation, project initialization, adding dependencies, and handling the most common error.

It is also important to note that, as mentioned in the <a href="Python#using_uv" class="wikilink" title="Python#using_uv">Python#using_uv</a> article, **you do not need to install Python as a system package**, and you can instead install it through uv itself.

You can find more information regarding uv and how it works in the [uv documentation](https://docs.astral.sh/uv/concepts/projects/),

## Install uv

Add uv to your system packages in `/etc/nixos/configuration.nix`:

``` nix
environment.systemPackages = with pkgs; [
  uv
];
```

Then rebuild:

``` bash
sudo nixos-rebuild switch
```

## Initialize a Project

Navigate to your project directory and run:

``` bash
uv init
```

This, among other files for your project, creates a `pyproject.toml` file to place your dependencies into.

## Add Dependencies

Add dependencies to your `pyproject.toml`, for example:

``` toml
[project]
name = "example"
version = "0.1.0"
requires-python = ">=3.13,<=3.14"

dependencies = [
   "playwright>=1.54.0,<2.0.0",
   
]
```

## Sync Dependencies

Run:

``` bash
uv sync
```

### Common Error

On NixOS, you may see this error:

    error: Querying Python at `/home/<user>/.local/share/uv/python/cpython-3.13.5-linux-x86_64-gnu/bin/python3.13` failed with exit status exit status: 127

    [stderr]
    Could not start dynamically linked executable: /home/<user>/.local/share/uv/python/cpython-3.13.5-linux-x86_64-gnu/bin/python3.13
    NixOS cannot run dynamically linked executables intended for generic
    linux environments out of the box. For more information, see:
    https://nix.dev/permalink/stub-ld

This happens because "NixOS cannot run dynamically linked executables intended for generic Linux environments out of the box."[^1]

## Fix with nix-ld

The quickest solution is to enable [nix-ld](https://wiki.nixos.org/wiki/Nix-ld) In your `/etc/nixos/configuration.nix`, add:

``` nix
programs.nix-ld.enable = true;
```

Then rebuild:

``` bash
sudo nixos-rebuild switch
```

After this, `uv sync` will work correctly.

**You now have a working uv setup with Python on NixOS.**

## See also

<references />

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a> <a href="Category:Python" class="wikilink" title="Category:Python">Category:Python</a> <a href="Category:Uv" class="wikilink" title="Category:Uv">Category:Uv</a>

[^1]: <https://nix.dev/guides/faq#how-to-run-non-nix-executables>
