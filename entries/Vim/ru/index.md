<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vim/ru -->

<languages/> \[www.vim.org Vim\] (vi improved) - свободный текстовый редактор, созданный на основе более старого vi. Ныне это мощный текстовый редактор с полной свободой настройки и автоматизации, возможными благодаря расширениям и надстройкам.

<span id="Installation"></span>

## Установка

<span id="Basic_Install"></span>

### Начальная Установка

\<syntaxhighlight lang="nix\>

` programs.vim.enable = true;`

</syntaxhighlight>

или

``` nix
  programs.vim = {
    enable = true;
    package = pkgs.vim-full;
  };
```

или

``` nix
  environment.systemPackages = with pkgs; [ vim-full ];
```

<span id="Using_Home_Manager"></span>

### Используя Home-Manager

<div lang="en" dir="ltr" class="mw-content-ltr">

Vim can easily be set up using <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. Here's a minimal example:

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

See [1](https://github.com/rycee/home-manager/blob/master/modules/programs/vim.nix) for the full set of options.

</div>

<span id="Vim_Spell_Files"></span>

### Файлы Правописания Vim

<div class="mw-translate-fuzzy">

Вы можете настроить на установку файлов правописания в каталог пользователя через home-manager, упаковывая отдельные файлы правописания. Вот пример для neovim и французского языка:

</div>

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

<span id="NeoVim_with_Coc_for_Python"></span>

#### NeoVim с Coc.nvim для Python

<div lang="en" dir="ltr" class="mw-content-ltr">

For NeoVim use this home manager config: <https://github.com/NixOS/nixpkgs/issues/98166#issuecomment-725319238>

</div>

<span id="System_wide_vim/nvim_configuration"></span>

## Глобальная настройка vim/nvim

<div lang="en" dir="ltr" class="mw-content-ltr">

If you want a system wide "baseline" configuration for vim/nvim here are two examples:.

</div>

On unstable ветке:

``` nix
{ pkgs, ... }:
{
  programs.vim = {
    enable = true;
    defaultEditor = true;
    package = (pkgs.vim-full.override {  }).customize{
      name = "vim";
      <div lang="en" dir="ltr" class="mw-content-ltr">
# Install plugins for example for syntax highlighting of nix files
</div>
      vimrcConfig.packages.myplugins = with pkgs.vimPlugins; {
        start = [ vim-nix vim-lastplace ];
        opt = [];
      };
      vimrcConfig.customRC = ''
        <div lang="en" dir="ltr" class="mw-content-ltr">
" your custom vimrc
</div>
        set nocompatible
        set backspace=indent,eol,start
        " Включить подсветку синтаксиса по умолчанию
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
        <div lang="en" dir="ltr" class="mw-content-ltr">
" your custom vimrc
</div>
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

импортируйте их в свой `configuration.nix` и

``` nix
{    
  imports =    
    [
      ./vim.nix
    ];
  # ...
}
```

<span id="Custom_setup_without_using_Home_Manager"></span>

## Пользовательская настройка без использования Home Manager

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

Плагины Vim могут быть установлены с помощью Nix. Вы можете не использовать менеджеры плагинов и сделать все самостоятельно в `.nixpkgs/config`.

<div lang="en" dir="ltr" class="mw-content-ltr">

A lot of documentation about package management and configuration of vim in nix is stored at [2](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md) in nixpkgs.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Customizations

</div>

И в vim, и в neovim можно дополнительно включенить ваши любимые плагины и дополнительные библиотеки. Чтобы получить список всех доступных плагинов vim, выполните команду `nix search nixpkgs#vimPlugins`.

Добавьте следующий код в ваш `~/.nixpkgs/config.nix`

``` nix
{
  packageOverrides = pkgs: with pkgs; {
    myVim = vim-full.customize {
      name = "vim-with-plugins";
      # добавьте сюда код из секции с примером
    };
    myNeovim = neovim.override {
      configure = {
        customRC = ''
          # здесь должна находится ваша пользовательская конфигурация!
        '';
        packages.myVimPackage = with pkgs.vimPlugins; {
          # смотрите примеры ниже чтобы узнать как использовать пользовательские пакеты
          start = [ ];
          opt = [ ];
        }; 
      };     
    };
  };
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

After that you can install your special grafted \`myVim\` or \`myNeovim\` packages.

</div>

<span id="Examples"></span>

### Примеры

<span id="Apply_custom_vimrc_configuration"></span>

#### Добавить пользовательские настройка в вашу конфигурацию vimrc

<div lang="en" dir="ltr" class="mw-content-ltr">

NB: you *must* use `vimrcConfig.customRC` rather than installing a `~/.vimrc` by hand, since the customized Vim will silently ignore any vimrc in your home directory.

</div>

``` nix
vim-full.customize {
  name = "vim-with-plugins";
  # добавьте пользовательские строки в .vimrc, например, такие:
  vimrcConfig.customRC = ''
    set hidden
    set colorcolumn=80 
  '';
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

If you need to run code before plugins are added, you can use `vimrcConfig.beforePlugins` (be sure to include `set nocompatible` if you override [the default value](https://github.com/NixOS/nixpkgs/blob/c3df8057dad986bf7f3928de1b5233fadb52bb15/pkgs/misc/vim-plugins/vim-utils.nix#L264-L267)).

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

### Using vim's builtin packaging capability

</div>

``` nix
vim-full.customize {
  vimrcConfig.packages.myVimPackage = with pkgs.vimPlugins; {
    <div lang="en" dir="ltr" class="mw-content-ltr">
# loaded on launch
</div>
    start = [ YouCompleteMe fugitive ];
    <div lang="en" dir="ltr" class="mw-content-ltr">
# manually loadable by calling `:packadd $plugin-name`
</div>
    opt = [ phpCompletion elm-vim ];
    <div lang="en" dir="ltr" class="mw-content-ltr">
# To automatically load a plugin when opening a filetype, add vimrc lines like:
</div>
    # autocmd FileType php :packadd phpCompletion
  }
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Note that dynamically loading with opt may be buggy and the workaround is to use [start instead](https://vi.stackexchange.com/a/20818/30821).

</div>

<span id="Using_Pathogen_as_manager"></span>

### Использование Pathogen в качестве менеджера плагинов

<div lang="en" dir="ltr" class="mw-content-ltr">

There is a pathogen implementation as well, but its startup is slower and \[VAM\] has more features.

</div>

``` nix
vimrcConfig.pathogen.knownPlugins = vimPlugins; # optional
vimrcConfig.pathogen.pluginNames = [ "vim-addon-nix" "youcompleteme" ];
```

<span id="Using_Vim-Plug_as_manager"></span>

### Использование Vim-plug в качестве менеджера плагинов

``` nix
vimrcConfig.plug.plugins = with pkgs.vimPlugins; [vim-addon-nix youcompleteme];
```

<span id="Adding_new_plugins"></span>

### Добавление новых плагинов

<div lang="en" dir="ltr" class="mw-content-ltr">

Please see <https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md>.

</div>

<span id="Notes_Regarding_Plugins"></span>

#### Плагины заслуживающие внимания

<div lang="en" dir="ltr" class="mw-content-ltr">

For additional info, you may wish to look at [documentation on the nixpkgs repository](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md).

</div>

<span id="Add_a_new_custom_plugin_to_the_users_packages"></span>

### Добавьте новый пользовательский плагин в пользовательские пакеты

Иногда вы не хотите изменять плагины, находящиес в upstream, для этого вы можете использовать `vimUtils.buildVimPlugin` для создания своего собственного плагина:

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

<span id="Using_flake"></span>

#### Используя Flake

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

<div lang="en" dir="ltr" class="mw-content-ltr">

Then we can update the package with `nix flake lock --update-input winresizer-vim`, or update all inputs in flake.nix with `nix flake update`.

</div>

<span id="Vim_as_a_Python_IDE"></span>

### Vim в качестве Python IDE

<div class="mw-translate-fuzzy">

Следующий фрагмент создаст полнофункциональную IDE для python.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

#### Using language client

</div>

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

<div lang="en" dir="ltr" class="mw-content-ltr">

Then put the following expression in `environment.systemPackages` or in the home-manager package list, to install python-language-server:

</div>

``` nix
(python3.withPackages(ps: [
  ps.python-language-server
  <div lang="en" dir="ltr" class="mw-content-ltr">
# the following plugins are optional, they provide type checking, import sorting and code formatting
</div>
  ps.pyls-mypy ps.pyls-isort ps.pyls-black
]))
```

<span id="Real_life_examples"></span>

### Примеры из реальной жизни

<div lang="en" dir="ltr" class="mw-content-ltr">

- [Jagajaga’s config](https://github.com/jagajaga/my_configs/blob/master/.nixpkgs/common.nix)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [andrewrk's config](https://github.com/andrewrk/dotfiles/blob/master/.nixpkgs/config.nix)

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- [wagnerf42's config (good for rust language)](https://github.com/wagnerf42/nixos-config/blob/master/config/my_vim.nix)

</div>

### YouCompleteMe

<div lang="en" dir="ltr" class="mw-content-ltr">

Currently the youcompleteme plugin uses [unwrapped clang on linux](https://github.com/NixOS/nixpkgs/blob/8e7b1f2ac2e261d5a644fef860a0d050ea227c06/pkgs/misc/vim-plugins/default.nix#L695). This causes it to not find `stdlib.h`. There is a [workaround](https://github.com/andrewrk/genesis/blob/5f49cd9a8c2b61b9859a22102bc3f732add9461a/.ycm_extra_conf.py) you can put in your `.ycm_extra_conf.py` file, which works by executing the C/C++ compiler and getting it to output the list of search paths - which includes the search path to find `stdlib.h`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A better alternative to youcompleteme for C/C++ is to use [cquery](https://github.com/cquery-project/cquery/) in combination with the [LanguageClient-neovim](https://github.com/autozimu/LanguageClient-neovim). It will also find in c header files when used in a nix-shell if you install cquery from nixpkgs as it uses a custom [shell wrapper](https://github.com/NixOS/nixpkgs/commit/04f3b76dcec21f2fcba6b1b0afbb3ed224165050#diff-11cdfc0385b9e017089c1ac09c5b838e)

</div>

<span id="gvim_and_gview"></span>

## Gvim и Gview

<div lang="en" dir="ltr" class="mw-content-ltr">

You can enable `guiSupport` to make `gvim` available, though this won't give you `gview`:

</div>

``` nix
(pkgs.vim-full.customize {
  guiSupport = true;
})
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor{{#translation:}}" class="wikilink" title="Category:Text Editor{{#translation:}}">Category:Text Editor{{#translation:}}</a>
