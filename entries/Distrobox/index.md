<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Distrobox -->

[Distrobox](https://distrobox.it) offers you to use any linux distribution inside your terminal as a simple wrapper for <a href="Podman" class="wikilink" title="Podman">Podman</a>, <a href="Docker" class="wikilink" title="Docker">Docker</a> or Lilipod.

## Setup

Distrobox uses Docker internally to fetch and run system images. Easily get started by enabling Podman with Docker-compatibility mode.

``` nix
virtualisation.podman = {
  enable = true;
  dockerCompat = true;
};

environment.systemPackages = [ pkgs.distrobox ];
```

## Usage

Setup container with latest [Arch Linux](https://archlinux.org) image

``` console
distrobox create --root --name archlinux --init --image archlinux:latest
```

Enter Arch Linux container

``` console
distrobox enter --root archlinux
```

For further usage, please refer to the [Distrobox](https://distrobox.it/#distrobox) documentation.

## Tips and tricks

### Using different architecture

The following example will run an Ubuntu container with a different architecture than the host, in this case arm64.

Add following line to your system configuration, apply it and then reboot the system.

``` nix
boot.binfmt.emulatedSystems = [ "aarch64-linux" ];
```

Run a Debian container with arm64 architecture

``` nix
sudo podman run --rm --privileged multiarch/qemu-user-static --reset -p yes
distrobox create -n debian --image arm64v8/debian
distrobox enter debian
```

### "potentially insufficient UIDs and GUIDs" error

When setting up containers that do not run as root, as `podman` does by default, you may see an error along the following lines: (this example uses podman, lilipod has a different error)

``` console
# distrobox create container
...
Error: copying system image from manifest list: writing blob: adding layer with blob ...:
unpacking failed (error: exit status 1;
output: potentially insufficient UIDs or GIDs available in user namespace (requested 1000:1000 for /home/container): Check /etc/subuid and /etc/subgid if configured locally and run "podman system migrate": lchown /home/container: invalid argument)
```

To fix it, adding the following to your config might help:

``` nix
  users.users.YOURUSERNAME = {
      extraGroups = [ "podman" ];
      subGidRanges = [
          {
              count = 65536;
              startGid = 1000;
          }
      ];
      subUidRanges = [
          {
              count = 65536;
              startUid = 1000;
          }
      ];
  };
```

Rebuild your system, run `podman system migrate`, and try creating the distrobox container again.

### Exposing your profile

If you get errors like `/home/user/.zshenv:.:2: no such file or directory: /etc/profiles/per-user/user/etc/profile.d/hm-session-vars.sh` or `_atuin_preexec: command not found: atuin` that is because your shell init is referencing paths that are not accessible to Distrobox. By default, Distrobox only gets access to your home directory. You can mount additional volumes with `distrobox create --volume /your/custom/volume/path`, but it is more convenient to define defaults in `distrobox.conf`:

``` nix
environment.etc."distrobox/distrobox.conf".text = ''
  container_additional_volumes="/nix/store:/nix/store:ro /etc/profiles/per-user:/etc/profiles/per-user:ro /etc/static/profiles/per-user:/etc/static/profiles/per-user:ro"
''; 
```

## Known Issues

### Distrobox Fails With Arch Linux and init

This is a cross-distro (not NixOS-specific) issue resulting from a [util-linux](https://github.com/util-linux/util-linux/) runuser regression.[^1][^2] A fix has recently been merged, and the issue should be resolved in the next release (v2.43).[^3].

## References

<references/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>

[^1]: <https://github.com/89luca89/distrobox/issues/2069>

[^2]: <https://github.com/89luca89/distrobox/issues/2065>

[^3]: <https://github.com/util-linux/util-linux/pull/4185>
