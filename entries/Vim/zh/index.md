<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Vim/zh -->

<languages/> [Vim](https://www.vim.org/)（vi 增强版）是一个高度可配置的终端模态文本编辑器。

<span id="Installation"></span>

## 安装

<span id="Basic_Install"></span>

### 基础安装

\<syntaxhighlight lang="nix\>

` programs.vim.enable = true;`

</syntaxhighlight>

或者

``` nix
  programs.vim = {
    enable = true;
    package = pkgs.vim-full;
  };
```

或者

``` nix
  environment.systemPackages = with pkgs; [ vim-full ];
```

<span id="Using_Home_Manager"></span>

### 使用 Home Manager

使用 <a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> 可以轻松设置 Vim。这是一个简单的例子：

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

有关所有选项，请参阅 [1](https://github.com/rycee/home-manager/blob/master/modules/programs/vim.nix)。

<span id="Vim_Spell_Files"></span>

### Vim 拼写文件

你可以配置 home-manager，通过打包单个拼写文件的方式将拼写文件安装到你的用户目录中。以下是 <a href="neovim" class="wikilink" title="neovim">neovim</a> 检查法语的示例：

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

#### NeoVim 配置带有 Python 支持的 Coc

对于 NeoVim，请使用以下 home-manager 配置： <https://github.com/NixOS/nixpkgs/issues/98166#issuecomment-725319238>

<span id="System_wide_vim/nvim_configuration"></span>

## 系统范围的 vim/nvim 配置

如果您想要一个 vim/nvim 的系统范围“基本”配置，这里有两个示例：

unstable 分支：

``` nix
{ pkgs, ... }:
{
  programs.vim = {
    enable = true;
    defaultEditor = true;
    package = (pkgs.vim-full.override {  }).customize{
      name = "vim";
      # 安装插件，例如用于 nix 文件的语法高亮
      vimrcConfig.packages.myplugins = with pkgs.vimPlugins; {
        start = [ vim-nix vim-lastplace ];
        opt = [];
      };
      vimrcConfig.customRC = ''
        " 你的自定义 vimrc
        set nocompatible
        set backspace=indent,eol,start
        " 默认打开语法高亮
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
        " 你的自定义 vimrc
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

将这些导入到您的 `configuration.nix` 中并使用

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

## 不使用 Home Manager 的自定义设置

Vim 插件可以通过 nix 安装。您可以不使用 vim 插件管理器，直接在 `.nixpkgs/config` 中完成所有操作。

在 nix 中对 vim 进行包管理和配置的大部分文档存储在 nixpkgs 的 [2](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md) 中。

<span id="Customizations"></span>

### 自定义

vim 和 neovim 都可以进一步配置，以包含您喜欢的插件和其他库。要列出所有可用的 vim 插件，请运行 `nix search nixpkgs#vimPlugins`。

将以下代码添加到您的`~/.nixpkgs/config.nix`：

``` nix
{
  packageOverrides = pkgs: with pkgs; {
    myVim = vim-full.customize {
      name = "vim-with-plugins";
      # 在此处添加示例部分的代码
    };
    myNeovim = neovim.override {
      configure = {
        customRC = ''
          # 您的自定义配置就在这里！
        '';
        packages.myVimPackage = with pkgs.vimPlugins; {
          # 请参阅以下示例了解如何使用自定义包
          start = [ ];
          opt = [ ];
        }; 
      };     
    };
  };
}
```

之后，您可以安装特殊移植的 \`myVim\` 或 \`myNeovim\` 包。

<span id="Examples"></span>

### 示例

<span id="Apply_custom_vimrc_configuration"></span>

#### 应用自定义 vimrc 配置

注意：您必须使用 `vimrcConfig.customRC` 而不是手动安装 `~/.vimrc`，因为自定义 Vim 会默认忽略您主目录中的任何 vimrc 文件。

``` nix
vim-full.customize {
  name = "vim-with-plugins";
  # 添加自定义的 .vimrc 行，例如：
  vimrcConfig.customRC = ''
    set hidden
    set colorcolumn=80 
  '';
}
```

如果您需要在添加插件之前运行代码，可以使用 `vimrcConfig.beforePlugins`（如果您要覆盖 [默认值](https://github.com/NixOS/nixpkgs/blob/c3df8057dad986bf7f3928de1b5233fadb52bb15/pkgs/misc/vim-plugins/vim-utils.nix#L264-L267)，请务必包含 `set nocompatible`）。

<span id="Using_vim&#039;s_builtin_packaging_capability"></span>

### 使用 vim 的内置打包功能

``` nix
vim-full.customize {
  vimrcConfig.packages.myVimPackage = with pkgs.vimPlugins; {
    # 启动时加载
    start = [ YouCompleteMe fugitive ];
    # 可通过调用 `:packadd $plugin-name` 手动加载
    opt = [ phpCompletion elm-vim ];
    # 要在打开文件类型时自动加载插件，请添加如下 vimrc 行：
    # autocmd FileType php :packadd phpCompletion
  }
};
```

请注意，使用 opt 动态加载可能存在错误，解决方法是改用 [start](https://vi.stackexchange.com/a/20818/30821)。

<span id="Using_Pathogen_as_manager"></span>

### 使用 Pathogen 作为管理器

这 pathogen 的另一实现，原有插件启动速度较慢，而 \[VAM\] 具有更多功能。

``` nix
vimrcConfig.pathogen.knownPlugins = vimPlugins; # optional
vimrcConfig.pathogen.pluginNames = [ "vim-addon-nix" "youcompleteme" ];
```

<span id="Using_Vim-Plug_as_manager"></span>

### 使用 Vim-Plug 作为管理器

``` nix
vimrcConfig.plug.plugins = with pkgs.vimPlugins; [vim-addon-nix youcompleteme];
```

<span id="Adding_new_plugins"></span>

### 添加新插件

请参阅 <https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md>。

<span id="Notes_Regarding_Plugins"></span>

#### 关于插件的说明

如需更多信息，您可以查看 [nixpkgs 存储库上的文档](https://github.com/NixOS/nixpkgs/blob/master/doc/languages-frameworks/vim.section.md)。

<span id="Add_a_new_custom_plugin_to_the_users_packages"></span>

### 向用户包添加一个新的自定义插件

有时您不想修改上游插件，为此您可以使用 `vimUtils.buildVimPlugin` 创建自己的插件：

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

#### 使用 Flakes

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

然后我们可以使用 `nix flake lock --update-input winresizer-vim` 更新软件包，或者使用 `nix flake update` 更新 flake.nix 中的所有输入。

<span id="Vim_as_a_Python_IDE"></span>

### 将 Vim 用作 Python IDE

以下代码片段将创建一个功能齐全的 <a href="python" class="wikilink" title="python">python</a> IDE。

<span id="Using_language_client"></span>

#### 使用语言客户端

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

然后将以下表达式添加到 \``environment.systemPackages`\` 或 home-manager 包列表中，以安装 python-language-server：

``` nix
(python3.withPackages(ps: [
  ps.python-language-server
  # 以下插件为可选插件，它们提供类型检查、导入排序和代码格式化功能。
  ps.pyls-mypy ps.pyls-isort ps.pyls-black
]))
```

<span id="Real_life_examples"></span>

### 真实示例

- [Jagajaga 的配置](https://github.com/jagajaga/my_configs/blob/master/.nispkgs/common.nix)

<!-- -->

- [andrewrk 的配置](https://github.com/andrewrk/dotfiles/blob/master/.nixpkgs/config.nix)

<!-- -->

- [wagnerf42 的配置（适用于 Rust 语言）](https://github.com/wagnerf42/nixos-config/blob/master/config/my_vim.nix)

### YouCompleteMe

目前 youcompleteme 插件在 Linux 上使用 [unwrapped clang](https://github.com/NixOS/nixpkgs/blob/8e7b1f2ac2e261d5a644fef860a0d050ea227c06/pkgs/misc/vim-plugins/default.nix#L695)。这导致它找不到 `stdlib.h`。您可以在您的 `.ycm_extra_conf.py` 文件中添加 [使其正常运行的示例](https://github.com/andrewrk/genesis/blob/5f49cd9a8c2b61b9859a22102bc3f732add9461a/.ycm_extra_conf.py)，其工作原理是执行 C/C++ 编译器并使其输出搜索路径列表，其中包括查找 `stdlib.h` 的搜索路径。

对于 C/C++ 来说，比 youcompleteme 更好的替代方案是使用 [cquery](https://github.com/cquery-project/cquery/) 并结合 [LanguageClient-neovim](https://github.com/autozimu/LanguageClient-neovim)。如果您从 nixpkgs 安装 cquery，它在 nix-shell 中使用时也能找到 C 头文件，因为它使用了一个自定义的 [shell 包装器](https://github.com/NixOS/nixpkgs/commit/04f3b76dcec21f2fcba6b1b0afbb3ed224165050#diff-11cdfc0385b9e017089c1ac09c5b838e)。

<span id="gvim_and_gview"></span>

## gvim 和 gview

您可以启用 `guiSupport` 来使 `gvim` 可用，但这不会让您获得 `gview`：

``` nix
(pkgs.vim-full.customize {
  guiSupport = true;
})
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor{{#translation:}}" class="wikilink" title="Category:Text Editor{{#translation:}}">Category:Text Editor{{#translation:}}</a>
