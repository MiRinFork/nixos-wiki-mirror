<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Sudo/ru -->

<div lang="en" dir="ltr" class="mw-content-ltr">

[Sudo](https://www.sudo.ws) allows a system administrator to delegate authority to give certain <a href="User_management" class="wikilink" title="users">users</a> - or groups of users - the ability to run commands as root or another user while providing an audit trail of the commands and their arguments.

</div>

<div class="mw-translate-fuzzy">

## Использование

</div>

Следующая простая настройка позволит всем пользователям, входящим в группу `wheel`, выполнять команды, указанные в `extraRules`, от имени суперпользователя с помощью <codd>sudo</code> без необходимости вводить пароль пользователя.

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
