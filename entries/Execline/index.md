<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Execline -->

[execline](https://skarnet.org/software/execline/index.html) is an interpreter and a collection of utilities for composing Unix commands into scripts. The syntax of execline makes it better suited for code generation from Nix than interactive shell languages like <a href="Bash" class="wikilink" title="Bash">Bash</a>.

## execlineb

[execlineb](https://skarnet.org/software/execline/execlineb.html) is the interpreter for execline scripts. It reads a file, produces a command-line, and executes into that command line. `execlineb` manages the environment of the command that it executes and optionally substitutes the arguments a script receives into the command-line. `execlineb` also handles the quoting of strings using `""` and blocks using `{}`. Blocks are described later in this article.

## Wrappers

Consider the scenario of wrapping a program to override or set a default value for the `EDITOR` enviroment variable.

The following example is a script that uses the [export](https://skarnet.org/software/execline/export.html) program to set `EDITOR`. Here the `-s0` option is used to replace `$1` and `$@` within the command-line with the first and remaining arguments received by the script.

If the script is executed as `wrap-editor.el nano mutt` then the command-line executed by execlineb would be `export nano mutt`.

To create a wrapper that would provide a default `EDITOR` the [importas](https://skarnet.org/software/execline/importas.html) program would be used. In the following example the `EDITOR` value is imported from the calling enviroment, with a default value specified by `-D`, and any instance of `$editor` is replaced by that value. The `export` program exports the value of `$editor` after substitution.

### Generating a wapper from Nix

To generate a wrapper with a fixed default for `EDITOR` the Nix function at `execline.passthru.writeScript` can be used:

``` nix
{ pkgs ? import <nixpkgs> { } }:

pkgs.execline.passthru.writeScript "wrap-nano" "-s0" ''
  importas -D ${pkgs.nano}/bin/nano EDITOR E
  export EDITOR $E
  $@
''
```

## Blocks

Some execline programs take code blocks as their arguments. Blocks are delimited by `{}` in execlineb scripts. In the following example the `pipeline` program executes a block of commands in the background with a pipe connecting the stdin of that block to the stdout of the command-line following the block.

``` nix
{ pkgs ? import <nixpkgs> { } }:

pkgs.execline.passthru.writeScript "wrap-cowsay" "-s0" ''
  pipeline -w { ${pkgs.lib.getExe pkgs.cowsay} "-r" }
  $@
''
```

### Block quoting

execlineb parses `{}` blocks and constructs a command-line where each block item is prepended with a whitespace (\x20) and terminated with an empty string. This quoting can be done in pure Nix.

Given the function `quoteExecline` as

``` nix
builtins.foldl' (acc: arg: acc ++ (
  if builtins.isList arg
    then map (_: " ${_}") (quoteExecline arg) ++ [ "" ]
    else [ arg ]
  )) [ ];
```

then the expression

``` nix
args: lib.escapeShellArgs (quoteExecline [ "pipeline" "-w" [ (lib.getExe pkgs.cowsay) "-r" ] ] ++ args)
```

would produce the command-line executed by `execlineb` in the previous "wrap-cowsay" example when given the same arguments.

## See also

execline scripts can be found in the following repositories:

- [Spectrum](https://spectrum-os.org/git/spectrum/)
- [Finix](https://github.com/search?q=repo%3Aaanderse%2Ffinix%20execline&type=code)

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
