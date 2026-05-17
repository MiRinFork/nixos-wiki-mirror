<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Sudo/zh -->

[Sudo](https://www.sudo.ws) 允许系统管理员委托权限，授予某些<a href="Special:MyLanguage/User_Management" class="wikilink" title="用户">用户</a>（或用户组）以 root 或其他用户身份运行命令的能力，同时提供命令及其参数的审计跟踪。

## 用法

为示例用户 `myuser` 启用 sudo。

``` nix
users.users.myuser.extraGroups = [ "wheel" ];
```

通过简单的配置，将允许属于 `wheel` 组的所有用户以超级用户身份且无需提供该用户的密码使用 `sudo` 执行 `extraRules` 中指定的命令。

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
