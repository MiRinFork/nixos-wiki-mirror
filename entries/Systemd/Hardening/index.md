<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Systemd/Hardening -->

<translate> Systemd's service options are quite lax by default, and so it is often desirable to look at ways to harden systemd services. </translate> <translate> A good way to get started on a given service is to look at the output of the command `systemd-analyze security myService`. From there, you can look at the documentation for the options you see in the output, often in `man systemd.exec` or `man systemd.resource-control`, and set the appropriate options for your service. </translate> <translate>

## Accessing the network with a different RootDirectory

</translate> <translate> To be able to access the network while having a RootDirectory specified, you need to give access to `/etc/ssl`, `/etc/static/ssl` and `/etc/resolv.conf`. The simplest way of doing this is by simply putting `/etc` in the `BindReadOnlyPaths` option. </translate> <translate> A more granular way, would be to put these 3 paths into `BindReadOnlyPaths`, and wait for the creation of `/etc/resolv.conf` through a `systemd.path` unit. </translate> <translate>

## Dropping a shell inside a systemd service

</translate> <translate> While hardening a service, it often happens that you want a shell inside a hardened systemd unit, for example to check access to files, or check the network connectivity. Since systemd v258, one may run `systemd-analyze unit-shell `<service> to accomplish this. Note that this [currently](https://mastodon.social/@zihco/114823612021351075) only works for running services. Alternatively, one might use tmux to create a session inside the service, and attaching to it outside of the service. </translate> <translate> Simple example: </translate>

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

<translate> Example with a `RootDirectory` specified: </translate> <translate>

``` nix
{ pkgs }:
{
  systemd.services.myService = {
    serviceConfig = {
      ExecStart = "${pkgs.tmux}/bin/tmux -S /run/myService/tmux.socket new-session -s my-session -d";
      ExecStop = "${pkgs.tmux}/bin/tmux -S /run/myService/tmux.socket kill-session -t my-session";
      Type = "forking";

      <!--T:11-->
# Used as root directory
      RuntimeDirectory = "myService";
      RootDirectory = "/run/myService";

      <!--T:12-->
BindReadOnlyPaths = [
        "/nix/store"

        <!--T:13-->
# So tmux uses /bin/sh as shell
        "/bin"
      ];

      <!--T:14-->
# This sets up a private /dev/tty
      # The tmux server would crash without this
      # since there would be nothing in /dev
      PrivateDevices = true;
    };
  };
}
```

</translate> <translate> To attach to the shell, simply execute `tmux -S /path/to/tmux.socket attach`. </translate> <translate>

## Hardening examples

</translate> <translate> This list contains proposed hardening options that are not yet upstreamed. Please use with caution, and please notify the author of the change if something breaks: </translate> <translate>

- Chrony: <https://github.com/NixOS/nixpkgs/pull/104944/files>
- Isso: <https://github.com/NixOS/nixpkgs/pull/140840/files>
- Mautrix-based bridge: <https://github.com/mautrix/docs/pull/18/files>
- Postfix: <https://github.com/NixOS/nixpkgs/pull/93305/files>
- TheLounge: <https://github.com/thelounge/thelounge-deb/pull/78>

</translate> <translate>

## Related links

</translate> <translate>

- SHH, systemd hardening helper: [systemd hardening made easy with SHH](https://www.synacktiv.com/en/publications/systemd-hardening-made-easy-with-shh)

</translate>

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a> <a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a> <a href="Category:systemd" class="wikilink" title="Category:systemd">Category:systemd</a>
