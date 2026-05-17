<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Starship -->

<languages/> <translate> [Starship](https://starship.rs/) is a fast, customizable, and minimal prompt for any shell. It is written in Rust and displays relevant information like the current directory, Git status, runtime versions, and more, adapting to the context with minimal configuration. It supports multiple shells, including <tvar name=bash><a href="Special:MyLanguage/Bash" class="wikilink" title="Bash">Bash</a></tvar>, <tvar name=zsh>[Zsh](https://wiki.nixos.org/wiki/Zsh)</tvar>, <tvar name=fish>[Fish](https://wiki.nixos.org/wiki/Fish)</tvar>, PowerShell and a lot of other shells, and your configuration will stay persistent across all these shells and is designed for speed and efficiency.

## Installation

### Using nix-shell

</translate>

``` bash
nix-shell -p starship
```

<translate>

### Using Global Configuration

</translate>

``` nix
environment.systemPackages = [
  pkgs.starship
];
```

<translate> After modifying your configuration, apply the changes by running: </translate>

``` bash
sudo nixos-rebuild switch
```

<translate>

### Using Home Manager

</translate>

``` nix
home.packages = [ 
  pkgs.starship 
];
```

<translate> After updating your configuration, apply the changes by running: </translate>

``` bash
home-manager switch
```

<translate>

## Configuration

### Basic

</translate>

``` nix
programs.starship.enable = true;
```

<translate> after you have installed Starship you need to source it in your shell

Bash: </translate>

``` bash
eval "$(starship init bash)"
```

<translate> Zsh: </translate>

``` zsh
eval "$(starship init zsh)"
```

<translate> Fish: </translate>

``` fish
starship init fish | source
```

<translate> if you use other shells than what I just mentioned please head to this [page](https://starship.rs/guide/#step-2-set-up-your-shell-to-use-starship)

### Advanced

you can customize Starship with Nix (here's a snippet to understand) : </translate>

``` nix
programs.starship = {
  enable = true;
  settings = {
    add_newline = true;
    command_timeout = 1300;
    scan_timeout = 50;
    format = "$all$nix_shell$nodejs$lua$golang$rust$php$git_branch$git_commit$git_state$git_status\n$username$hostname$directory";
    character = {
      success_symbol = "[](bold green) ";
      error_symbol = "[✗](bold red) ";
    };
  };
};
```

<translate> since we can't include every option on Starship here's a GitHub link <noinclude> [containing every configuration option](https://gist.github.com/s-a-c/0e44dc7766922308924812d4c019b109#file-starship-nix/) </noinclude> and here's the official documentation to explain each option [Starship configuration guide](https://starship.rs/config/)

good luck :D </translate>

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
