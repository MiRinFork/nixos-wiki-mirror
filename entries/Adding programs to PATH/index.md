<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Adding programs to PATH -->

Here is a collection of methods to add a program to the `PATH` environment variable with <a href="Nix_(package_manager)" class="wikilink" title="Nix (package manager)">Nix (package manager)</a> with packages from <a href="Nixpkgs" class="wikilink" title="Nixpkgs">Nixpkgs</a>.

The `PATH` environment variable (often referred to as "the PATH") is an environment variable that tells programs where to find other programs. When you run a command `hello` in a bash shell, it basically searches for an executable named `hello` in every directory listed in `PATH`.

The NixOS method supports installing <a href="udev" class="wikilink" title="udev">udev</a> rules, which may be required for programs interacting with hardware. Services should be enabled and configured with NixOS options rather than by adding them manually to `environment.systemPackages`.

Here we are using the package `hello` as an example. Unless stated otherwise, package attribute names (with necessary prefixes like `nixpkgs\#` or `pkgs.`) can be repeated to add more packages.

## Persistent

These methods install the packages globally (not local to a specific development shell), persist the installation between reboots and symlink paths together into a specific directory (see the NixOS options and for details).

### NixOS

Modify your Home Manager configuration to include the meaning of the following example.

### <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>

Modify your Home Manager configuration to include the meaning of the following example.

### `nix-env`

`nix-env -iA hello`

### `nix profile` (Flakes)

`nix profile install nixpkgs\#hello`

## Temporary

These installation methods are temporary and local to the specific development shell. Only environment variables are modified; symbolic links to packages will not be created outside the Nix store. As such, applications installed with these methods will not show up in your desktop environment's application menu as their `.desktop` files are not in the global `XDG_DATA_DIRS` environment variable's paths.

### Ad-hoc shell using `nix-shell -p`

Run the following command to create a new shell with the `hello` package from Nixpkgs.

``` shell-session
[username@hostname:~]$ nix-shell -p hello

[nix-shell:~]$ hello
Hello, world!

[nix-shell:~]$
```

### Ad-hoc shell using `nix shell` (Flakes)

Run the following command to create a new shell with the `hello` package from the `nixpkgs` <a href="Flakes" class="wikilink" title="flake">flake</a> added to the `PATH` environment variable.

``` shell-session
[username@hostname:~]$ nix shell nixpkgs\#hello

[username@hostname:~]$ hello
Hello, world!

[username@hostname:~]$
```

You may also consider the `nix run` command useful. It reads the package's `meta.mainProgram` attribute and runs it.

``` shell-session
[username@hostname:~]$ nix run nixpkgs\#hello
Hello, world!

[username@hostname:~]$
```

### Declarative shell using `shell.nix` and `nix-shell`

Write the file below and run the command `nix-shell`.

### Declarative shell using `flake.nix` and `nix develop` (Flakes)

Below is a minimal example using flakes. Write the file below and run the command `nix develop`.Here is an example of a it working:

``` shell-session
[username@hostname:/tmp/example]$ hello
-bash: hello: command not found

[username@hostname:/tmp/example]$ nix develop
warning: creating lock file "/tmp/example/flake.lock":
• Added input 'nixpkgs':
    'github:NixOS/nixpkgs/00c21e4c93d963c50d4c0c89bfa84ed6e0694df2?narHash=sha256-AYqlWrX09%2BHvGs8zM6ebZ1pwUqjkfpnv8mewYwAo%2BiM%3D' (2026-02-04)
[username@hostname:/tmp/example]$ hello
Hello, world!

[username@hostname:/tmp/example]$
```

<a href="Category:Tutorial" class="wikilink" title="Category:Tutorial">Category:Tutorial</a>
