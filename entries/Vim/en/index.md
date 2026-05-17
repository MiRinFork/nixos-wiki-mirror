<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vim/en -->

<languages/> [Vim](https://www.vim.org/) (vi improved) is a highly configurable modal text editor program for the terminal.

## Installation

### Basic Install

\<syntaxhighlight lang="nix\>

` programs.vim.enable = true;`

</syntaxhighlight>

or

``` nix
  programs.vim = {
    enable = true;
    package = pkgs.vim-full;
  };
```

or

``` nix
  environment.systemPackages = with pkgs; [ vim-full ];
```

### Using Home Manager

Vim can easily be set up using <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. Here's a minimal example:

\<syntaxhighlight lang="nix\>

` programs.vim = {`  
`   enable = true;`  
`   plugins = with pkgs.vimPlugins; [ vim-airline ];`  
`   settings = { ignorecase = true; };`  
`   extraConfig = ''`  
`     set mouse=a`  
`   '';`  
` };`

</syntaxhighlight>

See [1](https://github.com/rycee/home-manager/blob/master/modules/programs/vim.nix) for the full set of options.

### Vim Spell Files

You can configure home-manager to install spelling files into your user directory by packaging individual spell files. Here' an example for <a href="neovim" class="wikilink" title="neovim">neovim</a> and French:

``` nix
let
nvim-spell-fr-utf8-dictionary = builtins.fetchurl {
  url = "http://ftp.vim.org/vim/runtime/spell/fr.utf-8.spl";
  sha256 = "abfb9702b98d887c175ace58f1ab39733dc08d03b674d914f56344ef86e63b61";
};

nvim-spell-fr-utf8-suggestions = builtins.fetchurl {
  url = "http://ftp.vim.org/vim/runtime/spell/fr.utf-8.sug";
  sha256 = "0294bc32b42c90bbb286a89e23ca3773b7ef50eff1ab523b1513d6a25c6b3f58";
};

nvim-spell-fr-latin1-dictionary = builtins.fetchurl {
  url = "http://ftp.vim.org/vim/runtime/spell/fr.latin1.spl";
  sha256 = "086ccda0891594c93eab143aa83ffbbd25d013c1b82866bbb48bb1cb788cc2ff";
};

nvim-spell-fr-latin1-suggestions = builtins.fetchurl {
  url = "http://ftp.vim.org/vim/runtime/spell/fr.latin1.sug";
  sha256 = "5cb2c97901b9ca81bf765532099c0329e2223c139baa764058822debd2e0d22a";
};
in
{
  xdg.configFile."nvim/spell/fr.utf-8.spl".source = nvim-spell-fr-utf8-dictionary;
  xdg.configFile."nvim/spell/fr.utf-8.sug".source = nvim-spell-fr-utf8-suggestions;
  xdg.configFile."nvim/spell/fr.latin1.spl".source = nvim-spell-fr-latin1-dictionary;
  xdg.configFile."nvim/spell/fr.latin1.sug".source = nvim-spell-fr-latin1-suggestions;
}
```

#### NeoVim with Coc for Python

For NeoVim use this home manager config: <https://github.com/NixOS/nixpkgs/issues/98166#issuecomment-725319238>

## System wide vim/nvim configuration

If you want a system wide "baseline" configuration for vim/nvim here are two examples:.

On unstable:

``` nix
{ pkgs, ... }:
{
  programs.vim = {
    enable = true;
    defaultEditor = true;
    package = (pkgs.vim-full.override {  }).customize{
      name = "vim";
      # Install plugins for example for syntax highlighting of nix files
      vimrcConfig.packages.myplugins = with pkgs.vimPlugins; {
        start = [ vim-nix vim-lastplace ];
        opt = [];
      };
      vimrcConfig.customRC = ''
        " your custom vimrc
        set nocompatible
        set backspace=indent,eol,start
        " Turn on syntax highlighting by default
        syntax on
        " ...
      '';
    };
  };
}
```

``` nix
{ pkgs, ... }:
{
  programs.neovim = {
    enable = true;
    defaultEditor = true;
    vimAlias = true;
    configure = {
      customRC = ''
        " your custom vimrc
        set nocompatible
        set backspace=indent,eol,start
        " ...
      '';
      packages.myPlugins = with pkgs.vimPlugins; {
        start = [ vim-lastplace vim-nix ]; 
        opt = [];
      };
    };
  };
}
```

import these in your `configuration.nix` and

``` nix
{    
  imports =    
    [
      ./vim.nix
    ];
  # ...
}
```

## Custom setup without using Home Manager

Vim plugins can be installed with the help of nix. You can omit using vim plugin managers and do everything in your `.nixpkgs/config`.

A lot of documentation about package management and configuration of vim in nix is stored at [2](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md) in nixpkgs.

### Customizations

Both vim and neovim can be further configured to include your favorite plugins and additional libraries. To list all available vim plugins, run `nix search nixpkgs#vimPlugins`.

Add the following code to your `~/.nixpkgs/config.nix`:

``` nix
{
  packageOverrides = pkgs: with pkgs; {
    myVim = vim-full.customize {
      name = "vim-with-plugins";
      # add here code from the example section
    };
    myNeovim = neovim.override {
      configure = {
        customRC = ''
          # here your custom configuration goes!
        '';
        packages.myVimPackage = with pkgs.vimPlugins; {
          # see examples below how to use custom packages
          start = [ ];
          opt = [ ];
        }; 
      };     
    };
  };
}
```

After that you can install your special grafted \`myVim\` or \`myNeovim\` packages.

### Examples

#### Apply custom vimrc configuration

NB: you *must* use `vimrcConfig.customRC` rather than installing a `~/.vimrc` by hand, since the customized Vim will silently ignore any vimrc in your home directory.

``` nix
vim-full.customize {
  name = "vim-with-plugins";
  # add custom .vimrc lines like this:
  vimrcConfig.customRC = ''
    set hidden
    set colorcolumn=80 
  '';
}
```

If you need to run code before plugins are added, you can use `vimrcConfig.beforePlugins` (be sure to include `set nocompatible` if you override [the default value](https://github.com/NixOS/nixpkgs/blob/c3df8057dad986bf7f3928de1b5233fadb52bb15/pkgs/misc/vim-plugins/vim-utils.nix#L264-L267)).

### Using vim's builtin packaging capability

``` nix
vim-full.customize {
  vimrcConfig.packages.myVimPackage = with pkgs.vimPlugins; {
    # loaded on launch
    start = [ YouCompleteMe fugitive ];
    # manually loadable by calling `:packadd $plugin-name`
    opt = [ phpCompletion elm-vim ];
    # To automatically load a plugin when opening a filetype, add vimrc lines like:
    # autocmd FileType php :packadd phpCompletion
  }
};
```

Note that dynamically loading with opt may be buggy and the workaround is to use [start instead](https://vi.stackexchange.com/a/20818/30821).

### Using Pathogen as manager

There is a pathogen implementation as well, but its startup is slower and \[VAM\] has more features.

``` nix
vimrcConfig.pathogen.knownPlugins = vimPlugins; # optional
vimrcConfig.pathogen.pluginNames = [ "vim-addon-nix" "youcompleteme" ];
```

### Using Vim-Plug as manager

``` nix
vimrcConfig.plug.plugins = with pkgs.vimPlugins; [vim-addon-nix youcompleteme];
```

### Adding new plugins

Please see <https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md>.

#### Notes Regarding Plugins

For additional info, you may wish to look at [documentation on the nixpkgs repository](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md).

### Add a new custom plugin to the users packages

Sometimes you do not want to change upstream plugins, for this you can use `vimUtils.buildVimPlugin` to create your own:

``` nix
let
  vim-better-whitespace = pkgs.vimUtils.buildVimPlugin {
    name = "vim-better-whitespace";
    src = pkgs.fetchFromGitHub {
      owner = "ntpeters";
      repo = "vim-better-whitespace";
      rev = "984c8da518799a6bfb8214e1acdcfd10f5f1eed7";
      sha256 = "10l01a8xaivz6n01x6hzfx7gd0igd0wcf9ril0sllqzbq7yx2bbk";
    };
  };
in {
  users.users.<yourNickname>.packages = [
    (pkgs.vim-full.customize {
      vimrcConfig.packages.myVimPackage = with pkgs.vimPlugins; {
        start = [ vim-better-whitespace ];
      };
    })
  ];
};
```

#### Using flake

`configuration.nix`:

``` nix
{ inputs, ... }:
{
  nixpkgs = {
    overlays = [
      (self: super:
        let
          winresizer-vim = super.vimUtils.buildVimPlugin {
            name = "winresizer-vim";
            src = inputs.winresizer-vim;
          };
        in
        {
          vimPlugins =
            super.vimPlugins // {
              inherit winresizer-vim;
            };
        }
      )
    ];
  };
```

`flake.nix`:

``` nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.05";
    winresizer-vim = {
      url = "github:simeji/winresizer";
      flake = false;
    };
  };

  outputs = inputs@{ nixpkgs, ... }: {
    nixosConfigurations.nixos = nixpkgs.lib.nixosSystem {
      system = "x86_64-linux";
      specialArgs = { inherit inputs; };
      modules = [
        ./configuration.nix
        ./hardware-configuration.nix
        { nix.registry.nixpkgs.flake = nixpkgs; }
      ];
    };
  };
}
```

Then we can update the package with `nix flake lock --update-input winresizer-vim`, or update all inputs in flake.nix with `nix flake update`.

### Vim as a Python IDE

The following snippet will make a full featured <a href="python" class="wikilink" title="python">python</a> IDE.

#### Using language client

``` nix
vim-full.customize {
  vimrcConfig = {
    customRC = ''
      let g:LanguageClient_serverCommands = {
        \ 'python': ['pyls']
        \ }
       nnoremap <F5> :call LanguageClient_contextMenu()<CR>
       nnoremap <silent> gh :call LanguageClient_textDocument_hover()<CR>
       nnoremap <silent> gd :call LanguageClient_textDocument_definition()<CR>
       nnoremap <silent> gr :call LanguageClient_textDocument_references()<CR>
       nnoremap <silent> gs :call LanguageClient_textDocument_documentSymbol()<CR>
       nnoremap <silent> <F2> :call LanguageClient_textDocument_rename()<CR>
       nnoremap <silent> gf :call LanguageClient_textDocument_formatting()<CR>
    '';
    packages.myVimPackage = with pkgs.vimPlugins; {
      start = [ LanguageClient-neovim ];
    }
};
```

Then put the following expression in `environment.systemPackages` or in the home-manager package list, to install python-language-server:

``` nix
(python3.withPackages(ps: [
  ps.python-language-server
  # the following plugins are optional, they provide type checking, import sorting and code formatting
  ps.pyls-mypy ps.pyls-isort ps.pyls-black
]))
```

### Real life examples

- [Jagajaga’s config](https://github.com/jagajaga/my_configs/blob/master/.nixpkgs/common.nix)

<!-- -->

- [andrewrk's config](https://github.com/andrewrk/dotfiles/blob/master/.nixpkgs/config.nix)

<!-- -->

- [wagnerf42's config (good for rust language)](https://github.com/wagnerf42/nixos-config/blob/master/config/my_vim.nix)

### YouCompleteMe

Currently the youcompleteme plugin uses [unwrapped clang on linux](https://github.com/NixOS/nixpkgs/blob/8e7b1f2ac2e261d5a644fef860a0d050ea227c06/pkgs/misc/vim-plugins/default.nix#L695). This causes it to not find `stdlib.h`. There is a [workaround](https://github.com/andrewrk/genesis/blob/5f49cd9a8c2b61b9859a22102bc3f732add9461a/.ycm_extra_conf.py) you can put in your `.ycm_extra_conf.py` file, which works by executing the C/C++ compiler and getting it to output the list of search paths - which includes the search path to find `stdlib.h`.

A better alternative to youcompleteme for C/C++ is to use [cquery](https://github.com/cquery-project/cquery/) in combination with the [LanguageClient-neovim](https://github.com/autozimu/LanguageClient-neovim). It will also find in c header files when used in a nix-shell if you install cquery from nixpkgs as it uses a custom [shell wrapper](https://github.com/NixOS/nixpkgs/commit/04f3b76dcec21f2fcba6b1b0afbb3ed224165050#diff-11cdfc0385b9e017089c1ac09c5b838e)

## gvim and gview

You can enable `guiSupport` to make `gvim` available, though this won't give you `gview`:

``` nix
(pkgs.vim-full.customize {
  guiSupport = true;
})
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor{{#translation:}}" class="wikilink" title="Category:Text Editor{{#translation:}}">Category:Text Editor{{#translation:}}</a>
