<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fzf -->

[fzf](https://github.com/junegunn/fzf) is a general-purpose command-line fuzzy finder.

# Shell extensions

fzf provides additional key bindings (CTRL-T, CTRL-R, and ALT-C) for shells

First install `fzf` in your profile, then use one of the following methods:

## Bash

### With Home-manager

There is option to enable fzf bash integration

``` nix
programs.fzf.enableBashIntegration = true;
```

### Without Home-manager

To enable fzf in bash add the following line to `$HOME/.bashrc`

``` bash
eval "$(fzf --bash)"
```

## Zsh

You can enable fzf in <a href="zsh" class="wikilink" title="zsh">zsh</a>.

### With Home-manager

There is option to enable fzf zsh integration

``` nix
programs.fzf.enableZshIntegration = true;
```

### Without Home-manager

To enable fzf in zsh add the following line to `$HOME/.zshrc`

``` bash
eval "$(fzf --zsh)"
```

## Fish

To enable fzf in <a href="fish" class="wikilink" title="fish">fish</a>.

### With Home-manager

There is option to enable fzf fish integration

``` nix
programs.fzf.enableFishIntegration = true;
```

### Without Home-Manager

To enable fzf in fish add the following line to `$HOME/.config/fish/functions/fish_user_key_bindings.fish`

``` fish
fzf --fish | source
```

# Examples

## Search all nix packages

You can interactively search the list of available packages with:

``` bash
nix-env -qa | fzf
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
