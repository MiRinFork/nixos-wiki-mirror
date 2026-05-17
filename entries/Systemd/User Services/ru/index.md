<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/User Services/ru -->

Systemd поддерживает запуск отдельного экземпляра systemd для конкретного пользователя, позволяя ему управлять своими собственными службами.

В NixOS пользовательский сервис может быть выражен с помощью , как описано здесь: <https://search.nixos.org/options?query=systemd.user.services>.

Это может быть полезно, если вы хотите, чтобы пользователь мог запускать, останавливать и перезапускать свой собственный экземпляр службы без необходимости делать его sudoer.

Пример сервиса:

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

По умолчанию пользовательские сервисы будут остановлены, когда пользователь выйдет из системы, и запустятся снова, когда пользователь снова войдет в систему, благодаря тому, что мы установили в примере.

<span id="Keeping_user_services_running_after_logout"></span>

## Продолжение работы пользовательских служб после выхода из системы

Если вам нужно, чтобы пользовательский сервис продолжал работать после выхода пользователя из системы, вам нужно включить "[lingering](https://search.nixos.org/options?channel=unstable&show=users.users.%3Cname%3E.linger&from=0&size=50&sort=relevance&type=packages&query=users.users.%3Cname%3E.linger)", установив .

Вы также, вероятно, захотите изменить , чтобы служба запускалась во время загрузки.

<div lang="en" dir="ltr" class="mw-content-ltr">

## Enabling a service for specific users

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

By default, enabling a user service enables it for every user for which systemd spawns a service manager. If you wish for the service to be run only for specific users (say, and ), use ():

</div>

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "UserA|UserB";
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Likewise, you can also disable a service for a specific user:

</div>

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "!root";
};
```

<div lang="en" dir="ltr" class="mw-content-ltr">

## Usage

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To interact with user-specific systemd services, use the `--user` flag with the `systemctl` command. For example, to check the status of a user service:

</div>

``` console
 $ systemctl --user status my-cool-user-service 
```

<div lang="en" dir="ltr" class="mw-content-ltr">

To view logs for a specific user service, use `journalctl` with the `--user-unit` option:

</div>

``` console
 $ journalctl --user-unit my-cool-user-service 
```

<div lang="en" dir="ltr" class="mw-content-ltr">

To list all active user units:

</div>

``` console
 $ systemctl --user list-units 
```

<div lang="en" dir="ltr" class="mw-content-ltr">

</div>

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
