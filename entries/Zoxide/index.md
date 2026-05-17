<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Zoxide -->

[Zoxide](https://github.com/ajeetdsouza/zoxide) is a smarter *cd* (change directory) command that supports all major shells.

## Installation

A basic user-specific installation with <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> may look like this:

``` nix
home-manager.users.myuser = {
  programs.zoxide.enable = true;
};
```

Change `myuser` to the username of the user you want to configure.

It may also be necessary to add `zoxide` to `home.packages` if it hasn't already been installed by some other method:

``` nix
home.packages = with pkgs; [
  zoxide
];
```

## Shell Integration

You can choose which [shell integrations](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.zoxide.enableBashIntegration) to enable with the `enable*Integration` options. By default all are enabled.

``` nix
programs.zoxide.enableBashIntegration= true;
programs.zoxide.enableFishIntegration= true;
programs.zoxide.enableNushellIntegration = true;
programs.zoxide.enableZshIntegration = true;
```

It may be necessary to also ensure that Home Manager can modify your rc file; for example, bash may require: \<syntaxhighlight lang="nix\> programs.bash.enable = true;

</syntaxhighlight>

After adding Zoxide, you will have to restart your shell to gain access to the `z` command.

## Extra Options

You can pass [extra flags](https://github.com/ajeetdsouza/zoxide?tab=readme-ov-file#flags) to Zoxide using `programs.zoxide.options` as follows:

``` nix
programs.zoxide.options = [
  "--cmd cd"
];
```

<a href="Category:Shell" class="wikilink" title="Category:Shell">Category:Shell</a>
