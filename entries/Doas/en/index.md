<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Doas/en -->

<languages/> [doas](https://en.wikipedia.org/wiki/Doas) is a utility to execute commands as a different user, typically the super user. It is often installed as a replacement for sudo, due to its ease of configuration and greater simplicity. It is not recommended to use doas due to compatibility issues with sudo. Flake based configurations require git to be installed as a system package in order to rebuild.

## Configuration

The following configuration will give the user `foo` the ability to execute commands as the super user via `doas`, while disabling the `sudo` command.

``` nix
security.doas.enable = true;
security.sudo.enable = false;
security.doas.extraRules = [{
  users = ["foo"];
  # Optional, retains environment variables while running commands 
  # e.g. retains your NIX_PATH when applying your config
  keepEnv = true; 
  persist = true;  # Optional, don't ask for the password for some time, after a successfully authentication
}];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
