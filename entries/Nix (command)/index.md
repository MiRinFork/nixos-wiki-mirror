<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nix (command) -->

This article is about the new `nix` command and all of its subcommands. The new `nix` command is intended to unify many different Nix package manager utilities that exist currently as many separate commands, eg. `nix-build`, `nix-shell`, etc.

See the [Nix manual](https://nix.dev/manual/nix/stable/command-ref/experimental-commands.html) for a complete reference.

## Enabling the nix command

In nix 2.4, the nix command must be explicitly enabled. You can do this in a few different ways.

### As an individual invocation

``` console
nix --experimental-features nix-command build ...
```

### By setting it in the nix configuration

### On NixOS, by setting it in the NixOS configuration

*On NixOS you can't edit `/etc/nix/nix.conf` directly, so you have to set it through the NixOS configuration instead*

## Switching from `nix profile` to `nix-env`

Once you installed a package with `nix profile`, you get the following error message when using `nix-env`:

``` console
$ nix-env -f '<nixpkgs>' -iA 'hello'
error: --- Error ----------------------------------------------------------------------------------------------------------------- nix-env
profile '/nix/var/nix/profiles/per-user/joerg/profile' is incompatible with 'nix-env'; please use 'nix profile' instead
```

To migrate from `nix profile` to `nix-env`, you need to delete your current profile:

``` console
$ rm -rf /nix/var/nix/profiles/per-user/$USER/profile
```

## New equivalents to old commands

``` shell
# create a store derivation for a package defined in the current directory's default.nix
old$ nix-instantiate -A somepackage
# assumes you are now using flakes
new$ nix eval .#somepackage.drvPath
# alternative option
new$ nix derivation show .#somepackage | jq '.[keys[0]]' | nix derivation add
```

<a href="Category:Nix" class="wikilink" title="Category:Nix">Category:Nix</a>
