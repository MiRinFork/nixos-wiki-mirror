<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Git -->

[Git](https://en.wikipedia.org/wiki/Git_(software)) is the <a href="wikipedia:Version_control" class="wikilink" title="version control system (VCS)">version control system (VCS)</a> developed by Junio C Hamano and designed by <a href="wikipedia:Linus_Torvalds" class="wikilink" title="Linus Torvalds">Linus Torvalds</a> (Creator of the <a href="Linux_kernel" class="wikilink" title="Linux kernel">Linux kernel</a>). Git is used to maintain NixOS packages, as well as many other projects, including sources for the Linux kernel.

## Installing and configuring Git

On NixOS, Git can be installed and configured at either the system level with the NixOS module or the user level with <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.

### System-wide installation

Git can be installed system-wide either by adding it to the list of system environment packages:

Or by enabling the NixOS Git module:

Additional Git module configuration options can be found at .

### User-level configuration with Home Manager

Git can be configured using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

``` nix
programs.git = {
  enable = true;
  settings.user = {
    name  = "John Doe";
    email = "johndoe@example.com";
  };
};
```

Aliases can be added with:

``` nix
programs.git = {
  enable = true;
  settings.alias = {
    ci = "commit";
    co = "checkout";
    s = "status";
  };
};
```

Git [LFS](https://git-lfs.com/) can be enabled with:

``` nix
programs.git = {
  enable = true;
  lfs.enable = true;
};
```

Configure git-credential-helper with `libsecret`:

``` nix
{ pkgs, ... }:

{
  programs.git = {
    enable = true;
    package = pkgs.git.override { withLibsecret = true; };
    settings = {
      credential.helper = "libsecret";
    };
  };
}
```

To add additional configuration you can specify options in an attribute set, so to add something like this:

``` ini
[push]
        autoSetupRemote = true
```

To your `~/.config/git/config`, you can add the below to `settings`

``` nix
{ pkgs, ... }:

{
  programs.git = {
    enable = true;
    settings = {
      push = { autoSetupRemote = true; };
    };
  };
}
```

#### Using your public SSH key as a signing key

To configure git to automatically sign your commits using your public SSH key like so:

``` nix
{
  programs.git = {
    enable = true;
    signing = {
      key = "ssh-ed25519 AAAAAAAAAAAA...AA username@hostname";
      signByDefault = true;
    };
    settings = {
      gpg = {
        format = "ssh";
      };
    };
  };
}
```

However, note that this will also require Home Manager to manage your SSH configuration:

``` nix
{    
  programs.ssh = {
    enable = true;
    addKeysToAgent = "yes";
  };
}
```

### Enabling Git UI

Install `tk` to use the git gui:

``` console
$ git citool
```

Or you may wish to install the `gitFull` package, which includes `git gui`, `gitk`, etc. This can be installed either through system environment packages or by setting the package module option:

``` nix
programs.git = {
  enable = true;
  package = pkgs.gitFull;
};
```

## Management of the `nixpkgs` git repository

`nixpkgs` has become a git repository of quite substantial size with \> 1M commits[^1] (as of 2026). This brings many unoptimized tools to their limits, leading to long waiting times on certain operations. Here we’ll collect useful info on how to manage that.

### Garbage collecting

Normal `git gc` should work as usual, but you should force a full garbage collect every half a year or so. `git gc --aggressive` is the command for that. For the author it did not work on the first try, since their laptop’s memory was too small, and it went out of memory. According to [StackOverflow](https://stackoverflow.com/a/4829883/1382925%7Cthis) answer it suffices to set some local repository config variables.

``` console
$ git config pack.windowMemory 2g
$ git config pack.packSizeLimit 1g
```

This worked well on a machine with about 6–8 GB of free RAM and two processor threads, and reduced the size of the `nixpkgs` checkout from ~1.3 GB to ~0.95 GB.

# Serve Git repos via SSH

This section implements [Git on the Server - Setting Up the Server](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server) on NixOS.

See also: <a href="gitolite" class="wikilink" title="gitolite">gitolite</a>.

## Configuration

``` nix
{ config, pkgs, ... }: {
  users.users.git = {
    isSystemUser = true;
    group = "git";
    home = "/var/lib/git-server";
    createHome = true;
    shell = "${pkgs.git}/bin/git-shell";
    openssh.authorizedKeys.keys = [
      # FIXME: Add pubkeys of authorized users
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF38sHxXn/r7KzWL1BVCqcKqmZA/V76N/y5p52UQghw7 example"
    ];
  };

  users.groups.git = {};

  services.openssh = {
    enable = true;
    extraConfig = ''
      Match user git
        AllowTcpForwarding no
        AllowAgentForwarding no
        PasswordAuthentication no
        KbdInteractiveAuthentication no
        PermitTTY no
        X11Forwarding no
    '';
  };
}
```

## Usage

1\. Run this on the server to create repo `myproject` accessible by user `git`

``` console
$ sudo -u git bash -c "git init --bare ~/myproject.git"
```

(`~` here is the home of the user `git`, which is `/var/lib/git-server`)

2\. Push to the server repo from another system

``` console
$ mkdir myproject
$ cd myproject
$ echo "hello" > a
$ git init
$ git add .
$ git commit -m "init"
$ git remote add origin git@myserver:myproject.git
$ git push origin master
```

3\. Clone and edit the server repo from another system

``` console
$ git clone git@myserver:myproject.git
$ cd myproject
$ cat a
$ echo "world" >> a
$ git commit -am "hello"
$ git push origin master
```

## Bisecting Nix regressions

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:CLI_Applications" class="wikilink" title="Category:CLI Applications">Category:CLI Applications</a> <a href="Category:Version_control" class="wikilink" title="Category:Version control">Category:Version control</a>

[^1]: <https://github.com/NixOS/nixpkgs>
