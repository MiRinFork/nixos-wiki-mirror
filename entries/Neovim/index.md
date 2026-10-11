<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Neovim -->

<languages/>

<translate>

  
*See also: <tvar name=vim><a href="Special:MyLanguage/Vim" class="wikilink" title="Vim">Vim</a></tvar>*

\[<tvar name=1><https://neovim.io/></tvar> Neovim\][^1] is a highly extensible and open source text editor that aims to improve upon and modernize the popular <tvar name=vim><a href="Special:MyLanguage/Vim" class="wikilink" title="Vim">Vim</a></tvar>[^2] editor. It's designed to be a drop-in replacement for Vim, maintaining compatibility with most Vim plugins and configurations while offering additional features and improvements. Neovim focuses on extensibility, usability, and performance.

It introduces a powerful plugin architecture that allows for asynchronous plugin execution, which can significantly improve performance for certain operations. It also includes a built-in terminal emulator, allowing users to run shell commands directly within the editor. The project emphasizes code quality and maintainability, with a clean, well-documented codebase that makes it easier for developers to contribute.

## Installation

#### Shell

To temporarily use Neovim in a shell environment without modifying your system configuration, you can run: </translate>

``` console
$ nix-shell -p neovim
```

<translate> This makes the Neovim editor available in your current shell. You can then launch Neovim by typing `nvim`.

#### System setup

To install Neovim system-wide, making it available to all users, add the following to your configuration: </translate>

<translate> After rebuilding your system with `nixos-rebuild switch` or `home-manager switch`, Neovim will be installed and accessible.

## Configuration

#### Basic

</translate>

<translate>

#### Advanced

</translate>

<translate>

## Tips and tricks

#### Nix configuration frameworks

\[<tvar name=1><https://github.com/nix-community/nixvim></tvar> Nixvim\] and \[<tvar name=2><https://github.com/NotAShelf/nvf></tvar> nvf\] provide a framework for declaratively configuring neovim with <tvar name=3><a href="Nix_(language)" class="wikilink" title="Nix">Nix</a></tvar>. They support, among the other things, plugin configuration, as well as mixing in plain Lua config snippets. Linux and Darwin platforms are supported using standalone Nix, <tvar name=4><a href="Special:MyLanguage/NixOS" class="wikilink" title="NixOS">NixOS</a></tvar> or <tvar name=5><a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a></tvar> modules.

#### Package variations

Have a look at the \[<tvar name=1><https://github.com/nix-community/neovim-nightly-overlay></tvar> Neovim Nightly Overlay\][^3] to install the most recent current nightly version of Neovim.

You can run the master version via the following command: </translate>

``` console
$ nix run "github:nix-community/neovim-nightly-overlay"
```

<translate>

#### Plugin management

</translate>

<translate>

#### Pre-made distributions

If you prefer not to configure your system manually, NixOS offers several predefined configurations and community-supported options. Here are a few of them:

- \[<tvar name=1><https://www.lazyvim.org/></tvar> LazyVim\][^4]
- \[<tvar name=3><https://astronvim.com/></tvar> AstroNvim\][^5]
- \[<tvar name=5><https://nvchad.com/></tvar> NVChad\][^6]
- [Nixvim](https://nix-community.github.io/nixvim/)[^7]

LazyVim, by default, will prevent loading plugins that are not managed by LazyVim. This includes all plugins installed via Nix. If you want to install plugins with both Nix and LazyVim, add the following to your LazyVim setup: </translate>

<translate> \[<tvar name=1><https://github.com/folke/lazy.nvim/issues/402#issuecomment-2084997594></tvar> Source\]

#### FHS wrapper

You can create a custom neovim FHS wrapper </translate>

<translate> This FHS wrapper example is based on a contribution to nixpkgs[^8]. For an extended configuration that includes setting up `mason.nvim` with a similar FHS environment, see this \[<tvar name=1><https://github.com/NixOS/nixpkgs/issues/281219#issuecomment-2284713258></tvar> NixOS/nixpkgs issue comment\].

## Troubleshooting

#### lua-language-server: Dynamically linked executable error

In your `~/.local/state/nvim/lsp.log`, you have the following error: </translate>

<translate> A solution for this issue can be found on Stack Overflow[^9].

## See also

- <tvar name=0><a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a></tvar> – For declarative Neovim configuration at the user level: \[<tvar name=1><https://nix-community.github.io/home-manager/options.html#opt-programs.neovim.enable></tvar> Neovim module in Home Manager\]
- \[<tvar name=2><https://neovim.io/doc/></tvar> Official Documentation\] – Official Neovim documentation.
- \[<tvar name=3><https://search.nixos.org/options?channel=unstable&query=programs.neovim></tvar> NixOS options for Neovim\] – System-level Neovim configuration.
- \[<tvar name=4><https://discourse.nixos.org/search?q=neovim></tvar> Neovim discussions on NixOS Discourse\] – Community tips, troubleshooting, and use cases.

## References

</translate>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>

[^1]: Neovim Team, "Home - Neovim", Neovim Official Website, Last updated March 2025, Accessed June 2025. <tvar name=1><https://neovim.io/></tvar>

[^2]: NixOS Wiki Community, "Vim", NixOS Wiki, Last edited 24 February 2025, Accessed June 2025. <tvar name=2><https://wiki.nixos.org/wiki/Vim></tvar>

[^3]: Nix Community, "neovim-nightly-overlay", GitHub, Last updated June 2025, Accessed June 2025. <tvar name=2><https://github.com/nix-community/neovim-nightly-overlay></tvar>

[^4]: LazyVim Team, "Getting Started", LazyVim Official Website, © 2025, Accessed June 2025. <tvar name=2><https://www.lazyvim.org/></tvar>

[^5]: AstroNvim Team, "AstroNvim", AstroNvim Official Website, N/A, Accessed June 2025. <tvar name=4><https://astronvim.com/></tvar>

[^6]: Siduck, "NvChad", NvChad Official Website, © 2025, Accessed June 2025. <tvar name=6><https://nvchad.com/></tvar>

[^7]: Nixvim [documentation](https://nix-community.github.io/nixvim/)

[^8]: NixOS, "Feature: Custom Neovim FHS Wrapper" (Pull Request \#334032), GitHub, 2025, Accessed June 2025. <tvar name=0><https://github.com/NixOS/nixpkgs/pull/334032></tvar>

[^9]: Stack Overflow Contributor, "Answer to 'Could not start dynamically linked executable... on NixOS'", Stack Overflow, 2025, Accessed June 2025. <tvar name=1><https://stackoverflow.com/a/78215911/27134695></tvar>
