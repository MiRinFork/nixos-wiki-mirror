<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nvim-r -->

}} This plugin turns vim/Neovim into a fully fledged R IDE[^1]. Once added as a <a href="vim" class="wikilink" title="vim">vim</a> plugin it will try to compile a backend executable called nvimcom[^2].

## If nvimcom Installation Fails

This Just Works ™ but you have to explictly install GCC on [system packages](https://nixos.org/nixos/manual/index.html#sec-package-management) so the plugin script can find it and compile the code it needs. If GCC is not explicitly installed, then it will print an "updating nvimcom" message and then a cryptic compilation error log.

## Installation via Home-Manager

An example installation of nvim-r using home-manager is shown below.

nvim-R requires build dependencies: which, vim and zip

**~/.config/nixpkgs/vim.nix**

``` nix
with import <nixpkgs> {};
let customPlugins = {
  nvim-r = vimUtils.buildVimPlugin {
    name = "nvim-r";
    src = fetchgit {
      url= "https://github.com/jalvesaq/nvim-r";
      rev =  "c53b5a402a26df5952718f483c7461af5bb459eb";
      sha256 = "13xbb05gnpgmyaww6029saplzjq7cq2dxzlxylcynxhhyibz5ibv";
      };
    buildInputs = [ which vim  zip];
  };
};

...
...
in vim_configurable.customize {
  name = "vim";
  vimrcConfig.customRC = ''
  vimrc things go here
  '';
    vimrcConfig.vam.knownPlugins = pkgs.vimPlugins // customPlugins;
    vimrcConfig.vam.pluginDictionaries = [
      { names = [
        "nvim-r"
        "other normal vim plugins"
      ]; }
    ];
}
```

**~/.config/nixpkgs/home.nix**

``` nix
  home= {
    packages = with pkgs; [
      (import ./vim.nix)
      # other packages
  ];
};
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Text_Editor{{#translation:}}" class="wikilink" title="Category:Text Editor{{#translation:}}">Category:Text Editor{{#translation:}}</a>

[^1]: <https://medium.freecodecamp.org/turning-vim-into-an-r-ide-cd9602e8c217?gi=a7ef030c5ed2>

[^2]: <https://github.com/jalvesaq/Nvim-R>
