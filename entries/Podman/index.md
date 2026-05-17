<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Podman -->

[Podman](https://podman.io/) can run rootless containers and be a drop-in replacement for <a href="Docker" class="wikilink" title="Docker">Docker</a>

## Setup

A reboot or re-login might be required for the permissions to take effect after applying changes

## Tips and tricks

### podman-compose

`podman-compose` is a drop-in replacement for `docker-compose`

See [the official documentation](https://docs.podman.io/en/stable/markdown/podman-compose.1.html)

### With ZFS

Rootless can't use <a href="ZFS" class="wikilink" title="ZFS">ZFS</a> directly but the overlay needs POSIX ACL enabled for the underlying ZFS filesystem, ie., `acltype=posixacl`

Best to mount a dataset under `/var/lib/containers/storage` with property `acltype=posixacl`.

### Within nix-shell

From <https://gist.github.com/adisbladis/187204cb772800489ee3dac4acdd9947> :

> 

Note that rootless podman requires newuidmap (from shadow). If you're not on NixOS, this cannot be supplied by the Nix package 'shadow' since [setuid/setgid programs are not currently supported by Nix](https://nixos.org/manual/nix/unstable/expressions/derivations.html).

### Containers as systemd services

``` nix
{
  virtualisation.oci-containers.backend = "podman";
  virtualisation.oci-containers.containers = {
    container-name = {
      image = "container-image";
      autoStart = true;
      ports = [ "127.0.0.1:1234:1234" ];
    };
  };
}
```

### Cross-architecture containers using binfmt/qemu

``` nix
boot.binfmt = {
  emulatedSystems = [ "aarch64-linux" ];
  preferStaticEmulators = true; # required to work with podman
};
```

``` console
$ podman run --arch arm64 'docker.io/alpine:latest' arch
aarch64
```

### DevContainers

Using Podman, it is possible that the process of creation of DevContainers' containers to become stuck at the "Please select an image URL" step.

To avoid this issue, you might restrict its registries configuration.

You can change the global registries with:

``` nix
virtualisation.containers.registries.search = [ "docker.io" ];
```

For user-scoped registries you can do using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> manually:

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>
