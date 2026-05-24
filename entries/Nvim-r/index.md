<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nvim-r -->

}} This plugin turns <a href="Vim" class="wikilink" title="Vim">Vim</a>/<a href="Neovim" class="wikilink" title="Neovim">Neovim</a> into a fully fledged <a href="R" class="wikilink" title="R">R</a> IDE[^1]. Once added as a Vim plugin, it will try to compile a backend executable called `nvimcom`[^2].

## If nvimcom Installation Fails

This Just Works ™ but you have to explictly install GCC on [system packages](https://nixos.org/nixos/manual/index.html#sec-package-management) so the plugin script can find it and compile the code it needs. If GCC is not explicitly installed, then it will print an "updating nvimcom" message and then a cryptic compilation error log.

## Installation via Home-Manager

An example installation of `nvim-r` using <a href="home-manager" class="wikilink" title="home-manager">home-manager</a> is shown below.

nvim-R requires build dependencies: `which`, `vim` and `zip`

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Text_Editor{{#translation:}}" class="wikilink" title="Category:Text Editor{{#translation:}}">Category:Text Editor{{#translation:}}</a>

[^1]: <https://medium.freecodecamp.org/turning-vim-into-an-r-ide-cd9602e8c217?gi=a7ef030c5ed2>

[^2]: <https://github.com/jalvesaq/Nvim-R>
