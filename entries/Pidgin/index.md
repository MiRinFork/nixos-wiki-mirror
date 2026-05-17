<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Pidgin -->

Pidgin is a multi-protocol messaging client.

[Pidgin](https://pidgin.im/) is available in NixOS, as are many popular plugins such as pidgin-otr.

## Installing plugins

NixOS provides Pidgin plugins as packages such as `pidginotr`, but installing them via `nix-env` or `environment.systemPackages` will not work. The plugin packages must be configured as part of the `pidgin-with-plugins` package via a package override.

### User-scope installation

To install Pidgin with desired plugins only for the current user:

1.  In `~/.config/nixpkgs/config.nix`, add:

` ...`  
` packageOverrides = pkgs: rec {`  
`   pidgin-with-plugins = pkgs.pidgin.override {`  
`     ## Add whatever plugins are desired (see nixos.org package listing).`  
`     plugins = [ pkgs.pidgin-otr ];`  
`   };`  
` };`  
` ...`

}

</syntaxhighlight>

1.  Install pidgin with `nix-env -iA nixos.pidgin-with-plugins`

### System-scope installation

To install Pidgin with desired plugins for all users on the system:

1.  Amend `/etc/nixos/configuration.nix` to add `pidgin-with-plugins` to `systemPackages`:

` ...`  
` environment.systemPackages = with pkgs; [`  
`   pidgin-with-plugins`  
` ];`  
` ...`

}

</syntaxhighlight>

1.  Override `pidgin-with-plugins` to add the desired plugins:

` ...`  
` nixpkgs.config = {`  
`   allowUnfree = true;`  
`   packageOverrides = pkgs: with pkgs; {`  
`     pidgin-with-plugins = pkgs.pidgin.override {`  
`       ## Add whatever plugins are desired (see nixos.org package listing).`  
`       plugins = [ pidgin-otr ];`  
`     };`  
`   };`  
` };`  
` ...`

}

</syntaxhighlight>

1.  Run `nixos-rebuild switch` as root to apply changes.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
