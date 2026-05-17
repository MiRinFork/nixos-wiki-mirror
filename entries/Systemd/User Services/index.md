<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/User Services -->

<translate> Systemd supports running a separate instance of systemd for a given user, allowing the user to control their own services. See here for more information: <https://wiki.archlinux.org/title/Systemd/User>

In NixOS, a user service can be expressed with , as documented here: <https://search.nixos.org/options?query=systemd.user.services>

This may be useful if you want a user to be able to start, stop, and restart their own instance of a service without needing to make the user a sudoer.

Here is an example: </translate>

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

<translate> By default, user services will be stopped when the user logs out and will start again when the user logs back in due to us setting in the example.

## Enabling the user management service and user process lingering

Without the user management unit , commands such as will fail, and configured options under will not take effect. This is typically observed on minimal systems without a desktop environment.

When lingering is enabled for a user, the user management service is spawned at boot and can run services independently of the user's session, including keeping services running after a user logs out.

You can enable "[lingering](https://search.nixos.org/options?channel=unstable&show=users.users.%3Cname%3E.linger&from=0&size=50&sort=relevance&type=packages&query=users.users.%3Cname%3E.linger)" by setting or running .

For a user service to start at boot, change the service configuration to .

## Enabling a service for specific users

By default, enabling a user service enables it for every user for which systemd spawns a service manager. If you wish for the service to be run only for specific users (say, and ), use (): </translate>

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "UserA|UserB";
};
```

<translate> Likewise, you can also disable a service for a specific user: </translate>

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "!root";
};
```

<translate>

## Usage

To interact with user-specific systemd services, use the `--user` flag with the `systemctl` command. For example, to check the status of a user service: </translate>

``` console
 $ systemctl --user status my-cool-user-service 
```

<translate> To view logs for a specific user service, use `journalctl` with the `--user-unit` option: </translate>

``` console
 $ journalctl --user-unit my-cool-user-service 
```

<translate> To list all active user units: </translate>

``` console
 $ systemctl --user list-units 
```

<translate> </translate>

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
