<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tmux -->

[tmux](https://github.com/tmux/tmux/wiki) is a "terminal multiplexer: it enables a number of terminals (or windows), each running a separate program, to be created, accessed, and controlled from a single screen. *tmux* may be detached from a screen and continue running in the background, then later reattached."

## Installation

#### Shell

To temporarily use tmux in a shell environment without modifying your system configuration, you can run:

``` console
$ nix-shell -p tmux
```

This makes the tmux available in your current shell. You can then launch tmux by typing `tmux`.

#### System setup

To install tmux system-wide, making it available to all users, add the following to your configuration: Alternatively, enable the NixOS module to manage tmux declaratively: After rebuilding your system with `nixos-rebuild switch`, tmux will be installed and accessible.

## Configuration

can be configured globally from `/etc/nixos/configuration.nix`.

As an example:

Note that `extraConfig` writes directly to `/etc/tmux.conf`

#### Using Plugins

Tmux plugins can be also configured using `programs.tmux.plugins`. They can be found as NixOS packages: [tmuxPlugins](https://search.nixos.org/packages?type=packages&query=tmuxPlugins). Each of the tmux plugin is run via `run-shell` automatically.

Some plugins need to be run after having had some custom configuration done\>, but extraConfig gets executed after. For example `tmuxPlugins.cpu` needs the status line be declared before the plugin is run. For that scenario, `run-shell` can be added within `extraConfig`:

#### Per-user configuration

However, if you want to configure per user, you could use <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>. This also grants you with more options available directly through nix, as opposed to through an extra config option. Though it should be noted that a few of the options have different names.

## See also

- [Arch Wiki page on tmux](https://wiki.archlinux.org/index.php/Tmux)
- [tmux repository](https://github.com/tmux/tmux)

<a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a>
