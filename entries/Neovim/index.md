<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Neovim -->

<languages/>

<translate>

  
*See also: <tvar name=vim><a href="Special:MyLanguage/Vim" class="wikilink" title="Vim">Vim</a></tvar>*

[Neovim](https://neovim.io/)[^1] is a highly extensible and open source text editor that aims to improve upon and modernize the popular <tvar name=vim><a href="Special:MyLanguage/Vim" class="wikilink" title="Vim">Vim</a></tvar>[^2] editor. It's designed to be a drop-in replacement for Vim, maintaining compatibility with most Vim plugins and configurations while offering additional features and improvements. Neovim focuses on extensibility, usability, and performance.

It introduces a powerful plugin architecture that allows for asynchronous plugin execution, which can significantly improve performance for certain operations. It also includes a built-in terminal emulator, allowing users to run shell commands directly within the editor. The project emphasizes code quality and maintainability, with a clean, well-documented codebase that makes it easier for developers to contribute.

## Installation

#### Shell

To temporarily use Neovim in a shell environment without modifying your system configuration, you can run: </translate>

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

## Tips and Tricks

#### Package Variations

Have a look at the [Neovim Nightly Overlay](https://github.com/nix-community/neovim-nightly-overlay)[^3] to install the most recent current nightly version of Neovim.

You can run the master version via the following command: </translate>

<translate>

#### Plugin Management

</translate>

<translate>

#### Frameworks

If you prefer not to configure your system manually, NixOS offers several predefined configurations and community-supported options. Here are a few of them:

- [LazyVim](https://www.lazyvim.org/)[^4]
- [AstroNvim](https://astronvim.com/)[^5]
- [NVChad](https://nvchad.com/)[^6]

LazyVim, by default, will prevent loading plugins that are not managed by LazyVim. This includes all plugins installed via Nix. If you want to install plugins with both Nix and LazyVim, add the following to your LazyVim setup: </translate>

<translate> [Source](https://github.com/folke/lazy.nvim/issues/402#issuecomment-2084997594)

#### FHS wrapper

You can create a custom neovim FHS wrapper </translate>

<translate> This FHS wrapper example is based on a contribution to nixpkgs[^7]. For an extended configuration that includes setting up `mason.nvim` with a similar FHS environment, see this [NixOS/nixpkgs issue comment](https://github.com/NixOS/nixpkgs/issues/281219#issuecomment-2284713258).

## Troubleshooting

#### lua-language-server: Dynamically linked executable error

In your `~/.local/state/nvim/lsp.log`, you have the following error: </translate>

<translate> A solution for this issue can be found on Stack Overflow[^8].

## See also

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – For declarative Neovim configuration at the user level: [Neovim module in Home Manager](https://nix-community.github.io/home-manager/options.html#opt-programs.neovim.enable)
- [Official Documentation](https://neovim.io/doc/) – Official Neovim documentation.
- [NixOS options for Neovim](https://search.nixos.org/options?channel=unstable&query=programs.neovim) – System-level Neovim configuration.
- [Neovim discussions on NixOS Discourse](https://discourse.nixos.org/search?q=neovim) – Community tips, troubleshooting, and use cases.
- [Neovim Overlay on Nixpkgs](https://github.com/nix-community/neovim-overlay) – For nightly builds and additional Neovim packages.

## References

</translate>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Text_Editor" class="wikilink" title="Category:Text Editor">Category:Text Editor</a>

[^1]: Neovim Team, "Home - Neovim", Neovim Official Website, Last updated March 2025, Accessed June 2025. <https://neovim.io/>

[^2]: NixOS Wiki Community, "Vim", NixOS Wiki, Last edited 24 February 2025, Accessed June 2025. <https://wiki.nixos.org/wiki/Vim>

[^3]: Nix Community, "neovim-nightly-overlay", GitHub, Last updated June 2025, Accessed June 2025. <https://github.com/nix-community/neovim-nightly-overlay>

[^4]: LazyVim Team, "Getting Started", LazyVim Official Website, © 2025, Accessed June 2025. <https://www.lazyvim.org/>

[^5]: AstroNvim Team, "AstroNvim", AstroNvim Official Website, N/A, Accessed June 2025. <https://astronvim.com/>

[^6]: Siduck, "NvChad", NvChad Official Website, © 2025, Accessed June 2025. <https://nvchad.com/>

[^7]: NixOS, "Feature: Custom Neovim FHS Wrapper" (Pull Request \#334032), GitHub, 2025, Accessed June 2025. <https://github.com/NixOS/nixpkgs/pull/334032>

[^8]: Stack Overflow Contributor, "Answer to 'Could not start dynamically linked executable... on NixOS'", Stack Overflow, 2025, Accessed June 2025. <https://stackoverflow.com/a/78215911/27134695>
