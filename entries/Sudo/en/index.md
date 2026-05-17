<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Sudo/en -->

[Sudo](https://www.sudo.ws) allows a system administrator to delegate authority to give certain <a href="User_management" class="wikilink" title="users">users</a> - or groups of users - the ability to run commands as root or another user while providing an audit trail of the commands and their arguments.

## Usage

Enable sudo-usage for the example user `myuser`.

``` nix
users.users.myuser.extraGroups = [ "wheel" ];
```

Following simple configuration will allow all users which are part of the group `wheel` to execute commands specified inside `extraRules` as super user using `sudo` without the need to supply a user password.

``` nix
security.sudo = {
  enable = true;
  extraRules = [{
    commands = [
      {
        command = "${pkgs.systemd}/bin/systemctl suspend";
        options = [ "NOPASSWD" ];
      }
      {
        command = "${pkgs.systemd}/bin/reboot";
        options = [ "NOPASSWD" ];
      }
      {
        command = "${pkgs.systemd}/bin/poweroff";
        options = [ "NOPASSWD" ];
      }
    ];
    groups = [ "wheel" ];
  }];
  extraConfig = with pkgs; ''
    Defaults:picloud secure_path="${lib.makeBinPath [
      systemd
    ]}:/nix/var/nix/profiles/default/bin:/run/current-system/sw/bin"
  '';
};
```

<a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
