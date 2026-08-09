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

### Using host fonts/icons/themes inside Distrobox containers

By default, Distrobox tries to bind mount the host's `/run/host/usr/share/{fonts, icons, themes}` directory inside the container as `/usr/local/share/{fonts, icons, themes}`[1](https://github.com/89luca89/distrobox/blob/d925c3f10315b72ec38a0405e57fe06c87edc754/distrobox-init#L997-L1000). However, on NixOS, the directory is non-existent due to NixOS not following the [FHS Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html).

If you have already installed fonts/icons/themes on your NixOS system and want them to be accessible inside Distrobox containers by default, follow the instructions provided in this page: <a href="Fixes_for_non-Nix_applications#Flatpak,_Distrobox,_Appimage_and_other_non-Nix_applications_can&#39;t_find_system_fonts/icons/themes" class="wikilink" title="Fixes for non-Nix applications#Flatpak, Distrobox, Appimage and other non-Nix applications can&#39;t find system fonts/icons/themes">Fixes for non-Nix applications#Flatpak, Distrobox, Appimage and other non-Nix applications can't find system fonts/icons/themes</a> .

Note that although the aforementioned solution only bindmounts paths to `/usr/share/`, the container manager being used with Distrobox (`podman`, `docker`, `lilypod` etc) will automatically make the host's root filesystem (`/`) accessible inside the container as `/run/host/`, making the paths needed by Distrobox accessible as usual, thus the aforementioned fix is sufficient.

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

### Distrobox is not location independent

The symptom is that a distrobox container created in the past can not run, because it references a non-existing "distrobox-init" script as a necessary bind mount.

Historically, this was a known issue[^4] affecting users who have created a container with a different version of distrobox than the one that is currently running. It can surface after running GC. The root cause is that the container is created with bind mounts for essential scripts, one of which is the entrypoint itself, the source of which is often an absolute path, such as: `/nix/store/XXXXX-distrobox/bin/distrobox-init`. The problem is that once a container was created with a bind mount, its source has to be available every time the container is re-executed.

This issue was solved 2 times upstream, both in 2022:

The first solution[^5] replaces the bind-mount with copying the scripts into the container during distrobox-enter.

The second solution[^6] reverts the first solution, due to problems the former had introduced with btrfs. In order to avoid regressions for Nix users, it introduces a weaker solution for mounting the scripts: instead of `realpath`, it makes use of: `cd "$(dirname "${0}")" && pwd`. That works, but only as long as:

1.  The "\$0" argument is preserved. There was an [issue in nixpkgs](https://github.com/NixOS/nixpkgs/issues/478154), fixed in 2026[^7], with non-preservation of "\$0" in the "distrobox" command wrapper. Direct calls to `distrobox-create` were unaffected.
2.  In every future execution of the container, the distrobox utilities will remain in the same path. This is workable when the installation is fixed on a path like `/run/current-system/sw/bin/distrobox-init`.

Notably, if you were affected by the first issue, then your container will not work even after the fixes that have since come out. The second issue is not resolved due to decisions upstream.

## References

<references/>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Container" class="wikilink" title="Category:Container">Category:Container</a>

[^1]: <https://github.com/89luca89/distrobox/issues/2069>

[^2]: <https://github.com/89luca89/distrobox/issues/2065>

[^3]: <https://github.com/util-linux/util-linux/pull/4185>

[^4]: <https://github.com/89luca89/distrobox/issues/315>

[^5]: <https://github.com/89luca89/distrobox/commit/52a34fbd52e1f0f035657b167ebe997d41db0993>

[^6]: <https://github.com/89luca89/distrobox/commit/1ad3204ee78dfb8ee772cdd81788f3cbb3f4bd1b>

[^7]: <https://github.com/NixOS/nixpkgs/commit/2f87ef8fdbabc6df0fbaf59ad14598864711ed4c>
