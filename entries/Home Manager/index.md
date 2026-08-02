<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Home Manager -->

[Home Manager](https://github.com/nix-community/home-manager) is a system for managing a user environment using the Nix package manager. In other words, Home Manager lets you

- install software declaratively in your user profile, rather than using nix-env
- manage dotfiles in the home directory of your user.

Home Manager has many [options](https://nix-community.github.io/home-manager/options.xhtml), which can look daunting at first, but most of those options only boil down to creating some dotfiles and installing some software in a similar way to nix-env.

## Configuration

Home Manager can be configured as a user in `~/.config/home-manager/home.nix` or as a module inside configuration.nix.

### Installation as a user

Follow the [official guide](https://nix-community.github.io/home-manager/installation/standalone.html)

Your configuration is stored in `~/.config/home-manager/home.nix`. Each time you modify it, rerun `home-manager switch` for changes to have effect.

To work correctly, Home Manager needs your shell to source `~/.nix-profile/etc/profile.d/hm-session-vars.sh`. The most convenient way to do so is to have Home Manager manage your whole shell configuration, eg `programs.bash.enable = true;` or `programs.zsh.enable = true;`. But in this case your whole bashrc is managed with Home Manager: the years of customization you accumulated in your former .bashrc must be migrated to Home Manager options, which may take some time. The quick and dirty way to do the migration is to move your bashrc to some other location and source it from Home Manager:

``` nix
{ pkgs, ...}: {
  programs.bash = {
    enable = true;
    bashrcExtra = ''
      . ~/oldbashrc
    '';
  };
}
```

### Usage as a NixOS module

Here is a nixos module template you can use:

``` nix
{ config, pkgs, ... }:
let
  home-manager = builtins.fetchTarball "https://github.com/nix-community/home-manager/archive/master.tar.gz";
in
{
  imports = [
    (import "${home-manager}/nixos")
  ];

  home-manager.users.my_username = {
    /* The home.stateVersion option does not have a default and must be set */
    home.stateVersion = "18.09";
    /* Here goes the rest of your home-manager config, e.g. home.packages = [ pkgs.foo ]; */
  };
}
```

It can either be incorporated in `/etc/nixos/configuration.nix` or be placed in a standalone file and imported in configuration.nix: `imports = [ ./thefile.nix ]`.

Whenever you change you Home Manager configuration, you must rerun `nixos-rebuild switch`. With this method, changing the configuration of an unprivileged user requires to run a command as root.

### Usage as a NixOS module in a Flake

Here is the skeleton of how to add Home Manager as a module to your system(s) via your <a href="Flakes" class="wikilink" title="flake">flake</a>:

``` nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    home-manager = {
      url = "github:nix-community/home-manager/release-25.05";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = { self, nixpkgs, home-manager, ... } @ inputs:
    {
      nixosConfigurations.<HOSTNAME> = nixpkgs.lib.nixosSystem { # replace <HOSTNAME> with your actual hostname
        system = "x86_64-linux";
        modules = [
          ./configuration.nix
          home-manager.nixosModules.default
          {
            home-manager = {
              useGlobalPkgs = true;
              useUserPackages = true;
              extraSpecialArgs = { inherit inputs; } #If you want access to inputs in your home.nix
              users.<USERNAME> = ./home.nix; # replace <USERNAME> with your actual username
            };
          }
        ];
      };
    };
}
```

Here's an example of Home Manager configuration in ./home.nix

``` nix
{ config, pkgs, ... }:

{
  # This value determines the Home Manager release that your
  # configuration is compatible with. This helps avoid breakage
  # when a new Home Manager release introduces backwards
  # incompatible changes.
  #
  # You can update Home Manager without changing this value. See
  # the Home Manager release notes for a list of state version
  # changes in each release.
  home.stateVersion = "24.11";
}
```

Of course you'll probably want to keep more stuff in there than just a state version, but the state version is required.

The downside to doing it this way over the User config is that you have to do a full system rebuild; the Home Manager config is part of the full system, and so must be built as root or at least a trusted user.

## Usage

### Using Home Manager to install package declaratively

Nix-env has problematic behavior due to its imperative nature. For example, after installing java 8 with `nix-env -i jdk8`, running `nix-env --upgrade` upgrades java to 10 despite the fact that we initially explicitly requested java 8.

Installing software with Home Manager avoids this problem:

``` nix
{ pkgs, ...}: {
  home.packages = [ pkgs.jdk8 ];
}
```

It is a perfectly valid use case for Home Manager to only install software with `home.packages` without managing dotfiles at all.

### Usage on non-NixOS Linux

Home Manager has an option to automatically set some environment variables that will ease usage of software installed with nix on non-NixOS linux (fixing local issues, settings XDG_DATA_DIRS, etc.):

``` nix
{ pkgs, ...}: {
  targets.genericLinux.enable = true;
}
```

### Managing your dotfiles

Home Manager has options to configure many common tools. As an example, adding the following

``` nix
  programs.git = {
    enable = true;
    settings = {
      user = {
        name = "my_git_username";
        email = "my_git_username@gmail.com";
      };
    };
  };
```

will make Home Manager generate a `.config/git/config` file for you.

Even for programs for which Home Manager doesn't have configuration options, you can use it to manage your dotfiles directly, e.g.

``` nix
  xdg.configFile."i3blocks/config".source = ./i3blocks.conf;
  home.file.".gdbinit".text = ''
      set auto-load safe-path /nix/store
  '';
```

This will create symlink `$XDG_CONFIG_HOME/i3blocks/config` and `~/.gdbinit`.

You have the whole list of the options available in Home Manager [here](https://nix-community.github.io/home-manager/options.xhtml)

### Examples

- [Yurii Rashkovskii's home.nix](https://github.com/yrashk/nix-home/blob/master/home.nix)
- [bsima's configs](https://git.sr.ht/~ben/config)
- [drupol's config, with flakes](https://github.com/drupol/nixos-x260)

## FAQ

### I cannot set GNOME or Gtk themes via Home Manager

If you get [an error about or ](https://nix-community.github.io/home-manager/index.xhtml#_why_do_i_get_an_error_message_about_literal_ca_desrt_dconf_literal_or_literal_dconf_service_literal) on NixOS, add

``` nix
programs.dconf.enable = true;
```

to your system configuration.

### Installed apps don’t show up in Ubuntu's/GNOME's "Show Applications"

Consider some of the workarounds here: <https://github.com/nix-community/home-manager/issues/1439>.

### Workaround with `home on tmpfs` and standalone installation

home-on-tmpfs users who installed Home Manager standalone may meet problems that cannot load configs after reboot, caused by auto cleaning symlink under the toplevel of the home directory. You need to ensure `/home/`<user>`/.nix-profile` exists since the standalone install will not act symlink while the system boots.

If your toplevel of home is on tmpfs, one possible workaround is manually write `activationScripts` to link the directory:

``` nix
  system.activationScripts = {
    # workaround with tmpfs as home and home-manager, since it not preserve
    # ~/.nix-profile symlink after reboot.
    profile-init.text =
      ''
        ln -sfn /home/${user}/.local/state/nix/profiles/profile /home/${user}/.nix-profile
      '';
  };
```

Other files may also need to manually symlink in this case.

## Templates

- <https://github.com/juspay/nix-dev-home> A Home Manager template providing useful tools & settings for Nix-based development.

## Alternatives

- <a href="Wrappers_vs._Dotfiles" class="wikilink" title="Wrappers vs. Dotfiles">Wrappers vs. Dotfiles</a> shows how (per-user) wrapper scripts can be used in place of dotfiles in the user's home directory
- [wrapper-manager](https://github.com/viperML/wrapper-manager), an implementation of the idea above using the module system

## See also

- Starting from a machine with a minimal freshly installed NixOS ISO (KDE Plasma version), this video outlines the basics of using Home Manager as of 2021: [Wil T's "*NixOS Installation Guide*" (Home Manager section starts at 27:22)](http://enia.cc/r/wilt-nixos-install-home-manager)

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Home_Manager" class="wikilink" title="Category:Home Manager">Category:Home Manager</a>
