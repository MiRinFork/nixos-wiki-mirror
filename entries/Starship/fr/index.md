<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Starship/fr -->

<languages/>

<div class="mw-translate-fuzzy">

[Starship](https://starship.rs/) est un prompt rapide, personnalisable et minimal pour n'importe quel shell. Écrit en Rust, il affiche des informations pertinentes comme le répertoire actuel, le statut Git, les versions d'exécution, et plus encore, s'adaptant au contexte avec une configuration minimale. Il prend en charge plusieurs shells, y compris **Bash**, [**Zsh**](https://wiki.nixos.org/wiki/Zsh), [**Fish**](https://wiki.nixos.org/wiki/Fish), **PowerShell** et de nombreux autres shells, et votre configuration restera persistante sur tous ces shells, tout en étant conçue pour la rapidité et l'efficacité.

</div>

## Installation

<span id="Using_nix-shell"></span>

### en utilisant nix-shell

``` bash
nix-shell -p starship
```

<span id="Using_Global_Configuration"></span>

### en utilisant Global Configuration

``` nix
environment.systemPackages = [
  pkgs.starship
];
```

Après avoir modifié votre configuration, appliquez les modifications en exécutant:

``` bash
sudo nixos-rebuild switch
```

<span id="Using_Home_Manager"></span>

<div class="mw-translate-fuzzy">

### en utilisant Home Configuration

</div>

``` nix
home.packages = [ 
  pkgs.starship 
];
```

Après avoir modifié votre configuration, appliquez les modifications en exécutant:

``` bash
home-manager switch
```

## Configuration

<span id="Basic"></span>

### Basique

``` nix
programs.starship.enable = true;
```

<div class="mw-translate-fuzzy">

après avoir installé Starship, vous devez le sourcer dans votre shell

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Bash:

</div>

``` bash
eval "$(starship init bash)"
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Zsh:

</div>

``` zsh
eval "$(starship init zsh)"
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Fish:

</div>

``` fish
starship init fish | source
```

<div lang="en" dir="ltr" class="mw-content-ltr">

if you use other shells than what I just mentioned please head to this [page](https://starship.rs/guide/#step-2-set-up-your-shell-to-use-starship)

</div>

<span id="Advanced"></span>

### Avancé

<div lang="en" dir="ltr" class="mw-content-ltr">

you can customize Starship with Nix (here's a snippet to understand) :

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

since we can't include every option on Starship here's a GitHub link <noinclude> [containing every configuration option](https://gist.github.com/s-a-c/0e44dc7766922308924812d4c019b109#file-starship-nix/) </noinclude> and here's the official documentation to explain each option [Starship configuration guide](https://starship.rs/config/)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

good luck :D

</div>

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
