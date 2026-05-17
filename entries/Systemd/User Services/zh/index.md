<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/User Services/zh -->

<div lang="en" dir="ltr" class="mw-content-ltr">

Systemd supports running a separate instance of systemd for a given user, allowing the user to control their own services. See here for more information: <https://wiki.archlinux.org/title/Systemd/User>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

In NixOS, a user service can be expressed with , as documented here: <https://search.nixos.org/options?query=systemd.user.services>

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This may be useful if you want a user to be able to start, stop, and restart their own instance of a service without needing to make the user a sudoer.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

Here is an example:

</div>

``` nix
systemd.user.services.my-cool-user-service = {
  enable = true;
  after = [ "network.target" ];
  wantedBy = [ "default.target" ];
  description = "My Cool User Service";
  serviceConfig = {
      Type = "simple";
      ExecStart = ''/my/cool/user/service'';
  };
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

By default, user services will be stopped when the user logs out and will start again when the user logs back in due to us setting in the example.

</div>

<span id="Keeping_user_services_running_after_logout"></span>

## 注销后保持用户服务运行

<div lang="en" dir="ltr" class="mw-content-ltr">

If you need a user service to stay running after a user logs out, you need to enable "[lingering](https://search.nixos.org/options?channel=unstable&show=users.users.%3Cname%3E.linger&from=0&size=50&sort=relevance&type=packages&query=users.users.%3Cname%3E.linger)" by setting

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

You'll also likely want to change to so the service starts at boot time.

</div>

<span id="Enabling_a_service_for_specific_users"></span>

## 为特定用户启用服务

<div lang="en" dir="ltr" class="mw-content-ltr">

By default, enabling a user service enables it for every user for which systemd spawns a service manager. If you wish for the service to be run only for specific users (say, and ), use ():

</div>

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "UserA|UserB";
};
```

同样，您也可以为特定用户禁用某项服务：

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "!root";
};
```

<span id="Usage"></span>

## 用法

要与用户相关的 systemd 服务交互，请在 `systemctl` 命令中使用 `--user` 标志。例如，要检查用户服务的状态：

``` console
 $ systemctl --user status my-cool-user-service 
```

要查看特定用户服务的日志，请使用 `journalctl` 和 `--user-unit` 选项：

``` console
 $ journalctl --user-unit my-cool-user-service 
```

列出所有活跃用户单位：

``` console
 $ systemctl --user list-units 
```

<a href="Category:systemd" class="wikilink" title="分类：systmed">分类：systmed</a>
