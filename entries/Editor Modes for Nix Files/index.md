<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Editor Modes for Nix Files -->

Nix language has decent syntax highlighting (SH) support among popular code editors, but refactoring/autocomplete is still rare. Below is a list of editor modes for Nix syntax.

## Language servers

Most popular editors have support for the [language server protocol](https://microsoft.github.io/language-server-protocol), the following language servers can be used to provide features like completions and go-to-definition.

- [nil](https://github.com/oxalica/nil)
- [nixd](https://github.com/nix-community/nixd)
- [rnix-lsp](https://github.com/nix-community/rnix-lsp) (deprecated)

## Emacs

- [nix-mode official](https://github.com/NixOS/nix-mode) available in [melpa](https://melpa.org/)
- [@marsam's nix-mode](https://github.com/emacs-pe/nix-mode)
- [nix-buffer](https://github.com/shlevy/nix-buffer)
- [nix-update-el](https://github.com/jwiegley/nix-update-el)

## Vim

### vim-addon-nix

This plugin supports syntax highlighting and simple syntax and undeclared variable checking.

- [vim-addon-nix on github](https://github.com/MarcWeber/vim-addon-nix)

Usage with **VAM** package manager:

``` nix
{ # /etc/nixos/configuration.nix
  environment.systemPackages = [
    (pkgs.vim_configurable.customize {
      name = "vim";
      vimrcConfig.vam.pluginDictionaries = [
        # vim-nix handles indentation better but does not perform sanity
        { names = [ "vim-addon-nix" ]; ft_regex = "^nix\$"; }
      ];
    })
  ];
}
```

### vim-nix

vim-nix \*only\* supports syntax-highighting.

- [vim-nix on github](https://github.com/LnL7/vim-nix)

Usage with **vim package manager**:

``` nix
{ # /etc/nixos/configuration.nix
  environment.systemPackages = [
    (pkgs.vim_configurable.customize {
      name = "vim";
      vimrcConfig.packages.myplugins = with pkgs.vimPlugins; {
        start = [ vim-nix ]; # load plugin on startup
      };
    })
  ];
}
```

## Neovim

In addition to the Vim plugins listed above, [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) also has support for nix.

``` nix
{
  programs.neovim = {
    configure = {
      packages.all.start = with pkgs.vimPlugins; [
        (nvim-treesitter.withPlugins (ps: [ ps.nix ]))
        # or
        nvim-treesitter.withAllGrammars # to install all grammars (including nix)
      ];
    };
  };
}
```

## IntelliJ IDEA

- [nix-idea on github](https://github.com/NixOS/nix-idea)

## Eclipse

- [nix-eclipse](https://github.com/NixOS/nix-eclipse) - development stopped in 2010

## Sublime Text

- [sublime-nix on github](https://github.com/wmertens/sublime-nix)

## Atom

- [atom-nix on github](https://github.com/wmertens/atom-nix)

## Visual Studio Code

- [vscode-nix on github](https://github.com/bbenoist/vscode-nix)
- [vscode-nix-ide on GitHub and VSCode Store](https://github.com/jnoortheen/vscode-nix-ide) with support to format and lint

## Howl

- [howl-nix on github](https://github.com/rokf/howl-nix)

## Far2l

- [far2l with nix syntax highlighting patch in nixpkgs](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/misc/far2l/default.nix)

## nano

- [nanonix](https://github.com/seitz/nanonix)

## micro

Syntax highlighting is built-in. LSP support is available through the [`lsp` plugin](https://github.com/AndCake/micro-plugin-lsp).

## Codemirror

- [codemirror-lang-nix](https://github.com/replit/codemirror-lang-nix)

## Zed

- [zed-nix on github](https://github.com/hasit/zed-nix)

## Relevant pages

- <a href="Overview_of_the_Nix_Expression_Language" class="wikilink" title="Overview of the Nix Expression Language">Overview of the Nix Expression Language</a>
- <a href="Nix_Expression_Language:_Tips_&amp;_Tricks" class="wikilink" title="Nix Expression Language: Tips &amp; Tricks">Nix Expression Language: Tips &amp; Tricks</a>
- <a href="Nix_Expression_Language:_Learning_resources" class="wikilink" title="Learning resources">Learning resources</a>

<a href="Category:Nix_Language" class="wikilink" title="Category:Nix Language">Category:Nix Language</a> <a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>
