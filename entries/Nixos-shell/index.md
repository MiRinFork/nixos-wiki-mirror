<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nixos-shell -->

}} [nixos-shell](https://github.com/Mic92/nixos-shell) is a small helper script for spawning lightweight NixOS virtual machines in a shell.

## Installation

Add following line to your system configuration to install the program

``` nix
environment.systemPackages = [ pkgs.nixos-shell ];
```

## Usage

### Simple port forward

Create a single example file containing the system configuration for the virtual machine

In this example, we'll have a virtual guest machine running an instance of <a href="DokuWiki" class="wikilink" title="DokuWiki">DokuWiki</a> on port `80`. Start the VM while forwarding port `8080` on the host to port `80` on the guest

``` bash
QEMU_NET_OPTS="hostfwd=tcp::8080-:80" nixos-shell myvm.nix
```

After the VM is successfully booted, DokuWiki will be available on <http://localhost:8080>

### Reference local nixpkgs folder

Using the `-I nixpkgs` parameter, you could choose to use a local *nixpkgs* repository, for example to test unfinished packages or modules:

``` bash
nixos-shell -I nixpkgs=/home/myuser/projects/nixpkgs myvm.nix
```

### Graphical session

Following snippet will spawn a QEMU session with a graphical screen running GNOME, configured to auto login the user `nixos`.If you want auto screen resize support and clipboard-sharing between host and guest to work, append the following lines to your guest config.

### Mounting host directories

This snippet mounts the directory `calendar` which resides in the working directory where you run nixos-shell on the host. It gets mounted to `/var/lib/nextcloud/store-apps/calendar` on the guest. The target directory must exist before mounting gets executed.

Mounting is done through the network filesystem protocol 9p. Currently [it's not possible](https://github.com/Mic92/nixos-shell/issues/71) to mount the target directory with a specific UID/GID, so you'll have to change the permissions on the host directory according to your needs.

### Inside Nix Flake

Using following <a href="Flakes" class="wikilink" title="Flakes">Flakes</a> example, you can start a virtual machine using nixos-shell by just typing `nix run`

The configuration of the virtual machine is inside the file `myvm.nix` in the same directory. The virtual machine will use the nixpkgs source defined in the flake inputs.

<a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>
