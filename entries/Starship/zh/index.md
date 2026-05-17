<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Starship/zh -->

<languages/> [Starship](https://starship.rs/) 是一个快速、可自定义且极简的 shell 提示符。它使用 Rust 编写，显示当前目录、Git 状态、运行时版本等相关信息，并以极简配置适应上下文。它支持多种 shell，包括 <a href="Special:MyLanguage/Bash" class="wikilink" title="Bash">Bash</a>、[Zsh](https://wiki.nixos.org/wiki/Zsh)、[Fish](https://wiki.nixos.org/wiki/Fish)、PowerShell 以及其他许多 shell，并且您的配置将在所有这些 shell 中保持一致，其设计旨在提高速度和效率。

<span id="Installation"></span>

## 安装

<span id="Using_nix-shell"></span>

### 使用 nix-shell

``` bash
nix-shell -p starship
```

<span id="Using_Global_Configuration"></span>

### 使用全局配置

``` nix
environment.systemPackages = [
  pkgs.starship
];
```

修改配置后，运行以下命令应用更改：

``` bash
sudo nixos-rebuild switch
```

<span id="Using_Home_Manager"></span>

### 使用 Home Manager

``` nix
home.packages = [ 
  pkgs.starship 
];
```

配置更新完成后，运行以下命令应用更改：

``` bash
home-manager switch
```

<span id="Configuration"></span>

## 配置

<span id="Basic"></span>

### 基础

``` nix
programs.starship.enable = true;
```

安装 Starship 后，你需要在 shell 中执行 source 命令

Bash：

``` bash
eval "$(starship init bash)"
```

Zsh：

``` zsh
eval "$(starship init zsh)"
```

Fish：

``` fish
starship init fish | source
```

如果您使用我刚才提到的其他 shell，请前往此 [页面](https://starship.rs/guide/#step-2-set-up-your-shell-to-use-starship)

<span id="Advanced"></span>

### 进阶

你可以使用 Nix 自定义 Starship（这里有一个代码片段以供理解） :

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

由于我们无法包含 Starship 上的每个选项，因此这里有一个 GitHub 链接 <noinclude> [包含每个配置选项](https://gist.github.com/s-a-c/0e44dc7766922308924812d4c019b109#file-starship-nix/) </noinclude> 这里有官方文档来解释每个选项, [Starship 配置指南](https://starship.rs/config/)

祝你好运 :D

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
