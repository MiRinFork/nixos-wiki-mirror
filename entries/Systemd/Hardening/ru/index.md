<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/Hardening/ru -->

Опции служб Systemd по умолчанию довольно слабые по защищённости, поэтому часто бывает желательно рассмотреть способы усиления безопасности служб Systemd.

<div lang="en" dir="ltr" class="mw-content-ltr">

A good way to get started on a given service is to look at the output of the command `systemd-analyze security myService`. From there, you can look at the documentation for the options you see in the output, often in `man systemd.exec` or `man systemd.resource-control`, and set the appropriate options for your service.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Accessing the network with a different RootDirectory

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To be able to access the network while having a RootDirectory specified, you need to give access to `/etc/ssl`, `/etc/static/ssl` and `/etc/resolv.conf`. The simplest way of doing this is by simply putting `/etc` in the `BindReadOnlyPaths` option.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

A more granular way, would be to put these 3 paths into `BindReadOnlyPaths`, and wait for the creation of `/etc/resolv.conf` through a `systemd.path` unit.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Dropping a shell inside a systemd service

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

While hardening a service, it often happens that you want a shell inside a hardened systemd unit, for example to check access to files, or check the network connectivity. One way to do this is to use tmux to create a session inside the service, and attaching to it outside of the service.

</div>

Простой пример:

``` nix

{ pkgs, ... }:
{
  systemd.services.myService = {
    serviceConfig = {
      ExecStart = "${pkgs.tmux}/bin/tmux -S /tmp/tmux.socket new-session -s my-session -d";
      ExecStop = "${pkgs.tmux}/bin/tmux -S /tmp/tmux.socket kill-session -t my-session";
      Type = "forking";

      # ...
    };
  };
}
```

<div lang="en" dir="ltr" class="mw-content-ltr">

Example with a `RootDirectory` specified:

</div>

``` nix
{ pkgs }:
{
  systemd.services.myService = {
    serviceConfig = {
      ExecStart = "${pkgs.tmux}/bin/tmux -S /run/myService/tmux.socket new-session -s my-session -d";
      ExecStop = "${pkgs.tmux}/bin/tmux -S /run/myService/tmux.socket kill-session -t my-session";
      Type = "forking";

      <div lang="en" dir="ltr" class="mw-content-ltr">
# Used as root directory
      RuntimeDirectory = "myService";
      RootDirectory = "/run/myService";
</div>

      BindReadOnlyPaths = [
        "/nix/store"

        <div lang="en" dir="ltr" class="mw-content-ltr">
# So tmux uses /bin/sh as shell
        "/bin"
      ];
</div>

      <div lang="en" dir="ltr" class="mw-content-ltr">
# This sets up a private /dev/tty
      # The tmux server would crash without this
      # since there would be nothing in /dev
      PrivateDevices = true;
    };
  };
}
```

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

To attach to the shell, simply execute `tmux -S /path/to/tmux.socket attach`.

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

## Hardening examples

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

This list contains proposed hardening options that are not yet upstreamed. Please use with caution, and please notify the author of the change if something breaks:

</div>

<div lang="en" dir="ltr" class="mw-content-ltr">

- Chrony: <https://github.com/NixOS/nixpkgs/pull/104944/files>
- Isso: <https://github.com/NixOS/nixpkgs/pull/140840/files>
- Mautrix-based bridge: <https://github.com/mautrix/docs/pull/18/files>
- Postfix: <https://github.com/NixOS/nixpkgs/pull/93305/files>
- TheLounge: <https://github.com/thelounge/thelounge-deb/pull/78>

</div>

<span id="Related_links"></span>

## См. Также

<div lang="en" dir="ltr" class="mw-content-ltr">

- SHH, systemd hardening helper: [systemd hardening made easy with SHH](https://www.synacktiv.com/en/publications/systemd-hardening-made-easy-with-shh)

</div>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
