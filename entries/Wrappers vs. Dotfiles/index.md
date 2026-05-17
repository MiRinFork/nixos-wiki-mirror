<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Wrappers vs. Dotfiles -->

Usually user applications (like editors, etc.) get configured through dotfiles in the user's home directory. An alternative, declarative approach is to create wrappers for application on a per-user basis, like this:

``` nix
{
  users.users.root.packages = [
    (pkgs.writeScriptBin "htop" ''
      #! ${pkgs.bash}/bin/bash
      export HTOPRC=${pkgs.writeText "htoprc" ...}
      exec ${pkgs.htop}/bin/htop "$@"
    '')
  ];
}
```

The disadvantage of this way is that it doesn't propagate man pages and other paths from the old derivation. Please refer to <a href="Nix_Cookbook#Wrapping_packages" class="wikilink" title="Nix_Cookbook#Wrapping_packages">Nix_Cookbook#Wrapping_packages</a> to possible solutions to retain all outputs.

You can use this simple function which takes care of wrapping the script & symlinking

``` nix
 writeShellScriptBinAndSymlink = name: text: super.symlinkJoin {
    name = name;
    paths = [
      (super.writeShellScriptBin name text)
      super."${name}"
    ];
  };
```

### Downside of the Wrapper Approach

- There might be applications that don't provide means to specify configuration. One could override `$HOME`, but then there might be applications that require `$HOME` for other stuff than configuration.
- Applications cannot write their configuration anymore, e.g. `htop` will just terminate without error and nothing changed.

### Alternatives

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> manages dotfiles in the user's home directory

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
