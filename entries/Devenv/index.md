<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Devenv -->

## Installation

``` nixos
environment.systemPackages = [
  pkgs.devenv
];
```

## Binding to privileged ports (eg. 80 and 443)

The [Wordpress example](https://devenv.sh/integrations/wordpress/) in the guide suggests the following script:

``` nix
scripts.caddy-setcap.exec = ''
  sudo setcap 'cap_net_bind_service=+ep' ${pkgs.caddy}/bin/caddy
'';
```

But this does not work on NixOS. It fails with `Failed to set capabilities on file 'setcap': Read-only file system`

We can work around this by creating a local copy of Caddy, running `setcap` on that, and then copying the Caddy process exec command but referring it to our local binary.

``` nix
# This creates a local copy of Caddy that can bind to privileged ports like 80 and 443
scripts.caddy-setcap.exec = lib.mkForce ''
  mkdir -p ./bin
  cp ${pkgs.caddy}/bin/caddy ./bin/caddy
  sudo setcap 'cap_net_bind_service=+ep' ./bin/caddy
'';

# This launces the local Caddy
processes.caddy-local.exec = ''${lib.replaceString "${pkgs.caddy}" "." config.processes.caddy.exec}'';
```

It is most useful to do this in `devenv.local.nix`, so your non-NixOS colleagues can still use the default setup.
