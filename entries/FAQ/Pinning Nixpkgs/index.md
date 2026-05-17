<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: FAQ/Pinning Nixpkgs -->

It is possible (and indeed, fairly easy) to pin a specific version of Nixpkgs. This can be used to upgrade individual applications separately on their own terms, and to ensure their deployability is not impacted by other systems' requirements.

Another reason why one would want to pin nixpkgs is to get older versions of a specific software. [This site](https://lazamar.co.uk/nix-versions/) can show you all the versions a package went through, and what nixpkgs revision to use to get your specific version.

Note: You can `sudo nix-channel --remove nixpkgs`, but you still need a nix-channel for nixos

Be aware that this also pins all dependencies of the application which often causes issues for GUI applications and also brings in back outdated and potentially vulnerable dependencies.

    sudo nix-channel --list
    nixos https://nixos.org/channels/nixos-21.05

Nix 2.0 introduces new builtins, `fetchTarball` and `fetchGit`, which make it possible to fetch a specific version of nixpkgs without depending on an existing one:

``` nix
import (builtins.fetchTarball {
  # Descriptive name to make the store path easier to identify
  name = "nixos-unstable-2018-09-12";
  # Commit hash for nixos-unstable as of 2018-09-12
  url = "https://github.com/nixos/nixpkgs/archive/ca2ba44cab47767c8127d1c8633e2b581644eb8f.tar.gz";
  # Hash obtained using `nix-prefetch-url --unpack <url>`
  sha256 = "1jg7g6cfpw8qvma0y19kwyp549k1qyf11a5sg6hvn6awvmkny47v";
}) {}
```

Or, to use git for fetching:

``` nix
import (builtins.fetchGit {
  # Descriptive name to make the store path easier to identify
  name = "nixos-unstable-2018-09-12";
  url = "https://github.com/nixos/nixpkgs/";
  # Commit hash for nixos-unstable as of 2018-09-12
  # `git ls-remote https://github.com/nixos/nixpkgs nixos-unstable`
  ref = "refs/heads/nixos-unstable";
  rev = "ca2ba44cab47767c8127d1c8633e2b581644eb8f";
}) {}
```

If the `ref` attribute is omitted, we get an error like this:

    fatal: not a tree object: 3d70d4ba0b6be256974910e635fadcc0e9579b2a
    error: while evaluating the attribute 'buildInputs' of the derivation 'nix-shell' at /nix/store/b93cq865x6qxpn4dw9ivrk3yjcsm8r97-nixos-19.09/pkgs/build-support/mkshell/default.nix:28:3:
    while evaluating 'getOutput' at /nix/store/b93cq865x6qxpn4dw9ivrk3yjcsm8r97-nixos-19.09/lib/attrsets.nix:464:23, called from undefined position:
    while evaluating anonymous function at /nix/store/b93cq865x6qxpn4dw9ivrk3yjcsm8r97-nixos-19.09/pkgs/stdenv/generic/make-derivation.nix:142:17, called from undefined position:
    program 'git' failed with exit code 128

## Pinning an unstable service

How to upgrade a single package and service to an unstable version

There is probably a better way, especially once flakes come around. Some packages let you specify which `package` to run as an option but most don't. The following is a generic way that also works for those which don't.

add to configuration.nix a set allowing unstable packages. This assumes a channel named `nixpkgs-unstable` exists, like so:

``` bash
nix-channel --add https://nixos.org/channels/nixpkgs-unstable nixpkgs-unstable
nix-channel --update
```

then in `configuration.nix` allow unstable packages:

``` nix
# Allow unstable packages.
nixpkgs.config = {
  allowUnfree = true;
  packageOverrides = pkgs: {
    unstable = import <nixpkgs-unstable> {
      config = config.nixpkgs.config;
    };
  };
};
```

This means you can now refer to unstable packages as `pkgs.unstable.nameofpackage` which is great. For example:

``` nix
environment.systemPackages = with pkgs; [
  unstable.bind
  unstable.dnsutils
  vim
];
```

This will use unstable bind and dnsutils, but the stable vim.

Except bind is a service, and if you want a service....usually you just do something like:

``` nix
services.bind.enable = true;
...
```

Except services will refer to `pkgs.bind`, not `pkgs.unstable.bind`

so disable services.bind and create your own:

``` nix
users.users.named = {
  uid = config.ids.uids.bind;
  description = "BIND daemon user";
};
systemd.services.mybind = {
  description = "BIND Domain Name Server";
  unitConfig.Documentation = "man:named(8)";
  after = [ "network.target" ];
  wantedBy = [ "multi-user.target" ];
  preStart = ''
    mkdir -m 0755 -p /etc/bind
    if ! [ -f "/etc/bind/rndc.key" ]; then
      ${pkgs.unstable.bind.out}/sbin/rndc-confgen -c /etc/bind/rndc.key -u named -a -A hmac-sha256 2>/dev/null
    fi
    ${pkgs.coreutils}/bin/mkdir -p /run/named
    chown named /run/named
  '';
  serviceConfig = {
    ExecStart = "${pkgs.unstable.bind.out}/sbin/named -u named -4 -c /etc/bind/named.conf -f";
    ExecReload = "${pkgs.unstable.bind.out}/sbin/rndc -k '/etc/bind/rndc.key' reload";
    ExecStop = "${pkgs.unstable.bind.out}/sbin/rndc -k '/etc/bind/rndc.key' stop";
  };
};
```

where all the stuff just comes from the bind services definition(which you can get from the source link on the nixos options page.) Just replace named variables, and replace `${pkgs.bind.out` with `${pkgs.unstable.bind.out}`

## See also

- [Pinning Nixpkgs](https://nix.dev/reference/pinning-nixpkgs)
- [Towards Reproducibility: Pinning Nixpkgs](https://nix.dev/tutorials/first-steps/towards-reproducibility-pinning-nixpkgs)
- [Dependency Management](https://nix.dev/guides/recipes/dependency-management.html)
