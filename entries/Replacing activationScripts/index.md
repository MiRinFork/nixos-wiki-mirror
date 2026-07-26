<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Replacing activationScripts -->

NixOS used to rely on so called activation scripts that were defined in `system.activationScripts` for various tasks that need to be performed during the boot and also when switching to a new system with switch-to-configuration. These scripts, however, are quite inflexible and unnecessarily serialize the boot process.

There is a [larger effort to replace all activation scripts](https://github.com/NixOS/nixpkgs/issues/475305) with other means and it is now already possible to build NixOS systems without any activation scripts. To fully deprecated activation scripts, however, occurrences inside Nixpkgs and outside still need to be migrated. This page describes effective strategies to replace activation scripts in the order you should consider them.

#### [`systemd-tmpfiles`](https://www.freedesktop.org/software/systemd/man/latest/tmpfiles.d.html)

Simple activation scripts that only create files, move them, change permissions, etc. can usually be converted to systemd-tmpfiles configs via [`systemd.tmpfiles.settings`](https://search.nixos.org/options?channel=unstable&query=systemd.tmpfiles.settings). To create a cache directory for `some-service` for example:

``` nix
systemd.tmpfiles.settings."some-service" = {
  "/var/cache/some-service".d = {
    mode = "0750";
    user = "some-user";
    group = "some-group";
  };
};
```

#### [`ExecStartPre=`](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#ExecStartPre=)

There are some more complex scenarios where activation scripts are used to prepare the system for some other service. These scripts can usually be run directly before the systemd service in question is started instead of as an activation script via a command or full script in `ExecStartPre=`. To run `my-script` right before `some-service` is started, for example:

``` nix
systemd.service."some-service".serviceConfig.ExecStartPre = [
  "${pkgs.myScript}/bin/my-script"
];
```

#### Dedicated systemd service

For the very rare activation scripts that are very complicated, you can write an entire systemd service to execute the script. This service can then be ordered via the full systemd capabilities. To run `my-service` after all users and groups have been created:

``` nix
systemd.service."my-service".after = [ "userborn.service" ];
```
