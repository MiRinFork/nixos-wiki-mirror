<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Podman -->

[Podman](https://podman.io/) can run rootless containers and be a drop-in replacement for <a href="Docker" class="wikilink" title="Docker">Docker</a>

## Setup

A reboot or re-login might be required for the permissions to take effect after applying changes

## Tips and tricks

### **podman compose**

podman compose is a thin wrapper around an external compose provider such as [docker-compose](https://github.com/docker/compose) or [podman-compose](https://github.com/containers/podman-compose). This means that `podman compose` is executing another tool that implements the compose functionality but sets up the environment in a way to let the compose provider communicate transparently with the local Podman socket. The specified options as well as the command and argument are passed directly to the compose provider.

The default compose providers are `docker-compose` and `podman-compose`. If installed, `docker-compose` takes precedence since it is the original implementation of the Compose specification.

To change the default behavior or have a custom installation path for your provider of choice:

``` nix
{
  services.podman.settings.containers = { compose_providers = ["/path/to/provider"] };
}
```

You may also set the `PODMAN_COMPOSE_PROVIDER` environment variable:

``` bash
PODMAN_COMPOSE_PROVIDER="/path/to/provider" podman compose up -d
```

or:

``` nix
{
  environment.sessionVariables = {
    PODMAN_COMPOSE_PROVIDER = "/path/to/provider";
  };
}
```

By default, `podman compose` will emit a warning saying that it executes an external command. This warning can be disabled by setting `compose_warning_logs` to false in `services.podman.settings.containers` or setting the `PODMAN_COMPOSE_WARNING_LOGS` environment variable to false.

``` nix
{
  services.podman.settings.containers = {
    compose_providers = ["/path/to/provider"];
    compose_warning_logs = false;
  };
}
```

``` nix
{
  environment.sessionVariables = {
    PODMAN_COMPOSE_PROVIDER = "/path/to/provider";
    PODMAN_COMPOSE_WARNING_LOGS = false;
  };
}
```

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

### **Rootless Podman containers**

Rootless Podman containers can be run using Home Manager's `services.podman` module

Create a user to run the rootless container: Allow the new user to use Home Manager: Set up Home Manager configuration for the new user, e.g. in your `flakes.nix`: Set up the container using Home Manager's `services.podman` module. Ensure `${config.home.homeDirectory}/www` exists beforehand

#### Limitations and quirks

- Rootless containers can't bind to ports below 1024 by default. You can allow it system-wide with `boot.kernel.sysctl."net.ipv4.ip_unprivileged_port_start" = 80;`, or map a high port instead (`-p 8080:80`)
- Rootless images and volumes are stored in `~/.local/share/containers/storage`, separate from root's storage
- Files that a non-root container writes to a bind mount are owned by an unprivileged host UID (for example `100000–165535`), not by you. Use `:U` parameter on the volume mount to ensure the mount is owned by the user and group the container runs , or `--userns=keep-id` to change the UID inside the container to the one of the host user [^1]

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>

[^1]: <https://docs.podman.io/en/latest/markdown/podman-run.1.html#volume-v-source-volume-host-dir-container-dir-options>
