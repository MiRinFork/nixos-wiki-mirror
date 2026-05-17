<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zsh -->

[Zsh](https://www.zsh.org/) is a powerful Unix [shell](https://wiki.nixos.org/wiki/Command_Shell) that functions both as an interactive shell and a scripting language interpreter. It extends the Bourne Shell (sh) with features from bash, ksh, and tcsh, offering [advanced tab completion](http://zsh.sourceforge.net/Guide/zshguide06.html), improved [globbing](http://zsh.sourceforge.net/Doc/Release/Expansion.html), and extensive customization options. Though not POSIX sh-compatible by default, it can be configured to be so with `emulate sh`.

Key features include highly customizable prompts, enhanced command history, spelling correction, and robust job control. The Oh My Zsh framework simplifies managing plugins and themes. Zsh is cross-platform, available on Unix-like systems including Linux and macOS, and is popular among developers and system administrators for its advanced features and user-friendly enhancements.

The [Zsh FAQ](http://zsh.sourceforge.net/FAQ/zshfaq01.html#l4) offers more reasons to use Zsh.

## Installation

### NixOS system installation

To install zsh for a user on a regular nixos system:

Replace `myuser` with the appropriate username.

See <a href="Command_Shell" class="wikilink" title="Command Shell">Command Shell</a> for more information.

### Home Manager

For a user-specific installation managed by <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, use the following configuration:

Replace `myuser` with the appropriate username.

You can enable the zsh shell and manage zsh configuration and plugins with Home Manager, but to enable vendor zsh completions provided by Nixpkgs you will also want to enable the zsh shell:

## Configuration

### NixOS system configuration

The following example demonstrates how to configure zsh system-wide through the NixOS configuration:

For a full list of zsh module options, refer to .

#### Plugins

The most straightforward way to manage Zsh plugins on NixOS is by enabling the `ohMyZsh` plugin manager, as demonstrated in the example below:

Alternatively, individual Zsh plugins are available as packages within Nixpkgs. When using this method, plugins must be manually sourced within the Zsh configuration file.

### Home Manager

The configuration below is using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>, but a more limited version of it can be achieved if system-wide.

The home manager options are defined in the following [Home Manager Options Manual](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.zsh.enable) or can be looked up at [Home Manager Option Search](https://home-manager-options.extranix.com/?query=zsh&release=master).

The system-wide options are listed on [programs.zsh.\*](https://search.nixos.org/options?query=programs.zsh).

#### Plugins

Home manager has four ways of managing plugins: **[Zplug](http://zplug.github.io/)**, **[Oh-My-Zsh](https://ohmyz.sh/), [Antidote](https://getantidote.github.io/)** and **manually**.

An example of less verbatim approach to sourcing packaged plugins can be [found here](https://discourse.nixos.org/t/zsh-users-how-do-you-manage-plugins/9199/8) and [here](https://discourse.nixos.org/t/zsh-users-how-do-you-manage-plugins/9199/10).

## Troubleshooting

#### Zsh-autocomplete not working

You may have some issues with the plugin on NixOS. That's because the default NixOS configuration overrides keybinds for up and down arrow keys. To fix this issue, you need to add this somewhere in your .zshrc (either manually if your .zshrc is not managed by Nix, or with )

``` bash
bindkey "''${key[Up]}" up-line-or-search
```

#### SHA Mismatch during manual plugin installation

If manual plugin installation fails with SHA mismatch, generating a valid hash as part of the error message can be achieved by temporarily switching to:

``` nix
sha256 = lib.fakeSha256;
```

This will print a valid SHA to the console and then can be used as final value for the sha256 field. Redoing this is mandatory if one wants to update to a newer commit of the targeted plugin repository.

#### GDM does not show user when zsh is the default shell

GDM only shows users that have their default shell set to a shell listed in /etc/shells. Setting the default shell using the following does not update /etc/shells.

``` nix
users.defaultUserShell = pkgs.zsh;
```

To add the zsh package to /etc/shells you must update environment.shells.

``` nix
environment.shells = with pkgs; [ zsh ];
```

#### Hide configuration for new users

Meaning this message:

``` zsh
This is the Z Shell configuration function for new users,
zsh-newuser-install.
You are seeing this message because you have no zsh startup files
(the files .zshenv, .zprofile, .zshrc, .zlogin in the directory
~).  This function can help you with a few settings that should
make your use of the shell easier.

You can:

(q)  Quit and do nothing.  The function will be run again next time.

(0)  Exit, creating the file ~/.zshrc containing just a comment.
     That will prevent this function being run again.

(1)  Continue to the main menu.

--- Type one of the keys in parentheses --- 
```

You can hide this message by adding following line to the system configuration:

``` nixos
# Prevent the new user dialog in zsh
system.userActivationScripts.zshrc = "touch .zshrc";
```

## References

1.  <https://www.zsh.org/>
2.  <http://zsh.sourceforge.net/Guide/zshguide06.html>
3.  <http://zsh.sourceforge.net/Doc/Release/Expansion.html>
4.  <http://zsh.sourceforge.net/FAQ/zshfaq01.html#l4>
5.  <https://nix-community.github.io/home-manager/options.xhtml#opt-programs.zsh.enable>
6.  <https://search.nixos.org/options?query=programs.zsh>

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
