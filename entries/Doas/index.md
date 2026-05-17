<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Doas -->

<languages/> <translate> [doas](https://en.wikipedia.org/wiki/Doas) is a utility to execute commands as a different user, typically the super user. It is often installed as a replacement for sudo, due to its ease of configuration and greater simplicity. </translate> <translate> It is not recommended to use doas due to compatibility issues with sudo. </translate> <translate> Flake based configurations require git to be installed as a system package in order to rebuild. </translate> <translate>

## Configuration

</translate> <translate> The following configuration will give the user `foo` the ability to execute commands as the super user via `doas`, while disabling the `sudo` command. </translate> <translate>

``` nix
{ pkgs, ... }: {
  security.sudo.enable = false;

  security.doas.enable = true;
  security.doas.extraRules = [{
    users = ["foo"];
    # Optional, retains environment variables while running commands 
    # e.g. retains your NIX_PATH when applying your config
    keepEnv = true; 
    persist = true;  # Optional, don't ask for the password for some time, after a successfully authentication
  }];

  # If using a flakes-based configuration, you'll need `git` in your system packages for system rebuilds
  environment.systemPackages = [ pkgs.git ];
}
```

</translate> <translate>

## Rebuilding without Git in system packages

</translate> <translate> If you've forgotten to add Git to your system packages, and you need to rebuild your system, you can either:

1.  Reboot to select the last generation without doas
2.  Enter a Nix shell as root, with the git package. Then, run your `nixos-rebuild` command with git being in your `environment.systemPackages`.

</translate> <translate>

` $ doas su`  
``  $ nix shell nixpkgs#git  # Or you can use the legacy syntax `nix-shell -p git` ``  
` $ nixos-rebuild --flake /path/to/your/flake#your-hostname test`

</translate> <translate> If everything looks good, you can now add your rebuild to your boot options. </translate> <translate>

` $ exit`  
` $ doas nixos-rebuild --flake /path/to/your/flake#your-hostname switch`

</translate>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
