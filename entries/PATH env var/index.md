<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PATH env var -->

## PATH

### NixOS Folders

NixOS bin folders are added to the PATH through PAM in <https://github.com/NixOS/nixpkgs/blob/master/nixos/modules/config/system-environment.nix>

### Adding folders for all users

For systemd to include this PATH, you must include it in one of the following places.

In \`/etc/environment.d\` :

``` nix
  environment.etc."environment.d/00-custom-path.conf".text = ''
    PATH="${PATH}:<path-to-new-folder>"
  '';
```

Or in \`/etc/systemd/user.conf\` :

``` nixos
systemd.user.extraConfig = ''
  DefaultEnvironment="PATH=<custom-path>"
'';
```

### Adding folders for a specific user

In `$HOME/.config/environment.d/*.conf`

### Sources

- <https://superuser.com/a/1649689>
- <https://wiki.archlinux.org/title/Systemd/User#Environment_variables>

### Related articles

- <a href="Environment_variables" class="wikilink" title="https://wiki.nixos.org/wiki/Environment_variables"><span>https://wiki.nixos.org/wiki/Environment_variables</span></a>

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a>
