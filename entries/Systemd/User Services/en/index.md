<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/User Services/en -->

Systemd supports running a separate instance of systemd for a given user, allowing the user to control their own services. See here for more information: <https://wiki.archlinux.org/title/Systemd/User>

In NixOS, a user service can be expressed with , as documented here: <https://search.nixos.org/options?query=systemd.user.services>

This may be useful if you want a user to be able to start, stop, and restart their own instance of a service without needing to make the user a sudoer.

Here is an example:

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

By default, user services will be stopped when the user logs out and will start again when the user logs back in due to us setting in the example.

## Keeping user services running after logout

If you need a user service to stay running after a user logs out, you need to enable "[lingering](https://search.nixos.org/options?channel=unstable&show=users.users.%3Cname%3E.linger&from=0&size=50&sort=relevance&type=packages&query=users.users.%3Cname%3E.linger)" by setting

You'll also likely want to change to so the service starts at boot time.

## Enabling a service for specific users

By default, enabling a user service enables it for every user for which systemd spawns a service manager. If you wish for the service to be run only for specific users (say, and ), use ():

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "UserA|UserB";
};
```

Likewise, you can also disable a service for a specific user:

``` nix
systemd.user.services.my-cool-user-service = {
  unitConfig.ConditionUser = "!root";
};
```

## Usage

To interact with user-specific systemd services, use the `--user` flag with the `systemctl` command. For example, to check the status of a user service:

``` console
 $ systemctl --user status my-cool-user-service 
```

To view logs for a specific user service, use `journalctl` with the `--user-unit` option:

``` console
 $ journalctl --user-unit my-cool-user-service 
```

To list all active user units:

``` console
 $ systemctl --user list-units 
```

<a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
