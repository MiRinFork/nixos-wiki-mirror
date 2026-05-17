<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixos-rebuild -->

**nixos-rebuild** is the NixOS command used to apply changes made to the system configuration. It can also be used for a variety of other tasks related to managing the state of a NixOS system.

`nixos-rebuild-ng` is a rewrite of `nixos-rebuild` in Python instead of Bash which has better performance and more features, and will become the default in NixOS 25.11.

## Usage

NixOS follows a "declarative configuration" approach, which means that the proper way to modify your system is to make changes to your system configuration (typically `/etc/nixos/configuration.nix`), and then *rebuild* your system with `nixos-rebuild`:

``` console
$ # Edit your configuration
$ sudo nano /etc/nixos/configuration.nix
$ # Rebuild your system
$ sudo nixos-rebuild switch
```

The `switch` subcommand will rebuild your system, activate the new generation immediately and make it the default boot option. There are also a couple of other sub-commands available:

- `boot`: Build the configuration and make it the default boot option, but don't activate it until the next reboot
- `test`: Build the configuration and activate it, but don't add it to the bootloader menu
- `build`: Build the configuration and place a symlink called `result` pointing to the derivation in the Nix store in the current directory
- `dry-activate`: Build the configuration, but do not activate it. Instead, show the changes that would be performed by activating the new generation.
- `build-vm`: Build a QEMU VM that runs the new configuration. It leaves a symlink called `result` in the current directory that contains the built VM. To run it, use `result/bin/run-`<hostname>`-vm`

Useful options include:

- `--rollback`: Don't build the new configuration, but use the previous generation instead. Useful for quickly reverting erroneous changes, i. e. `nixos-rebuild --rollback switch`
- `--upgrade`: Update the `nixos` channel of the root user before building the configuration.

### Deploying on other machines

`nixos-rebuild` can also be used to build and deploy system configurations on remote hosts via SSH. To use a remote host to build your system and deploy it on the current host, use:

``` console
# nixos-rebuild --build-host user@example.com switch
```

Add the flag `--use-substitutes` to make the remote host use substitutes instead of copying from your host to the remote host.

To build the system locally and deploy it on a remote host, use:

``` console
$ nixos-rebuild --target-host user@example.com switch
```

Note that this will often require using a different configuration than the one in `/etc/nixos`. See the **Specifying a different configuration location** section for details. `--build-host` and `--target-host` can be used simultaneously, even with different hosts.

If you are rebuilding a remote host as a non-root user, use the `--sudo` option to elevate on the remote machine during the rebuilding process:

``` console
$ nixos-rebuild --target-host user@example.com --sudo switch
```

To enter a password while using remote sudo, prefix the command with `NIX_SSHOPTS="-o RequestTTY=force"`, or add `--ask-sudo-password` with `nixos-rebuild-ng`.

For a full list of sub-commands and options, see the `nixos-rebuild` man page.

#### Deploying on a different architecture

There is currently a regression within `nixos-rebuild` that causes the local `nixos-rebuild` to invoke the binaries for the target architecture on the local system. This will naturally fail, throwing an *"Exec format error".*[^1] This can be bypassed by running `nixos-rebuild` with the `--fast` flag.

### Rolling back to a specific generation

As noted earlier, it possible to switch to the previous generation using the command `nixos-rebuild switch --rollback`

As of December 2024, `nixos-rebuild` doesn't have built-in functionality to switch to a generation earlier than the previous. However, there is an [open pull request](https://github.com/NixOS/nixpkgs/pull/105910/files) that adds this functionality.

It is possible to manually simulate the behavior from this PR in the meantime. Run the following command to list your generations:

``` console
$ nixos-rebuild list-generations
Generation    Build-date           NixOS version           Kernel  Configuration Revision  Specialisation
1054 current  2024-12-02 08:47:16  24.11.20241130.62c435d  6.12.1                          *
1053          2024-12-02 08:44:23  24.11.20241130.62c435d  6.12.1                          *
1052          2024-12-02 08:25:54  24.11.20241130.62c435d  6.12.1                          *
...
```

Run the command `/nix/var/nix/profiles/system-N-link/bin/switch-to-configuration switch` where `N` is the generation number you want to switch to.

You can manually see that `/nix/var/nix/profiles/` contains symlinks to the system closures associated with the listed generations by `nixos-rebuild list-generations` above:

``` console
$ ls -l /nix/var/nix/profiles/
lrwxrwxrwx - root root  2 12月 08:25 system-1052-link -> /nix/store/a5sh1kam9j42gcgca11ax5wg0iaiccab-nixos-system-onyx-24.11.20241130.62c435d
lrwxrwxrwx - root root  2 12月 08:44 system-1053-link -> /nix/store/nhba65kybj6y0gyd307mf9wj3089rf08-nixos-system-onyx-24.11.20241130.62c435d
lrwxrwxrwx - root root  2 12月 08:47 system-1054-link -> /nix/store/97wrfk1dmgbivw35wrkmrg0d0c1zhviw-nixos-system-onyx-24.11.20241130.62c435d
```

### Specifying a different configuration location

#### without Flakes

By default, `nixos-rebuild` builds the configuration in the file specified by the `nixos-config` field in the `NIX_PATH` environment variable, which is set to `/etc/nixos/configuration.nix` by default. This can be overwritten with:

``` console
# nixos-rebuild switch -I nixos-config=path/to/configuration.nix
```

To permanently change the location of the configuration, modify the `NIX_PATH` variable of your system with the `nix.nixPath` config option:

``` nix
{
  nix.nixPath = [ "nixos-config=/path/to/configuration.nix" ];
}
```

#### with Flakes

`nixos-rebuild` will look for the file `/etc/nixos/flake.nix` by default and build the `nixosConfigurations` item matching the current host name of the system. To specify a different flake directory, use:

``` console
# nixos-rebuild switch --flake path/to/flake/directory
```

To specify a different host name, use:

``` console
# nixos-rebuild switch --flake /etc/nixos#hostname
```

### Internals

`nixos-rebuild` is a Bash script that performs a relatively simple sequence of tasks. In the case of `nixos-rebuild switch`, these are:

- Build the `config.system.build.toplevel` derivation of the current configuration. This can be manually done by:

``` console
$ # without Flakes
$ nix-build <nixpkgs/nixos> -A config.system.build.toplevel -I nixos-config=path/to/configuration.nix
$ # with Flakes
$ nix build /etc/nixos#nixosConfigurations.hostname.config.system.build.toplevel
```

- Add the resulting derivation to the system profile in `/nix/var/nix/profiles`, i. e. create a new generation in the system profile.
- Add the new generation to the bootloader menu as the new default and activate it. If you've manually built the system derivation, this can also be done with `result/bin/switch-to-configuration switch`.

## See also

- [Magic Deployments with nixos-rebuild, Nixcademy](https://nixcademy.com/posts/nixos-rebuild/)
- [Remote Deployments with nixos-rebuild, Nixcademy](https://nixcademy.com/posts/nixos-rebuild-remote-deployment/)

## References

<references />

<a href="Category:NixOS" class="wikilink" title="Category:NixOS">Category:NixOS</a>

[^1]: <https://github.com/NixOS/nixpkgs/issues/166499>
