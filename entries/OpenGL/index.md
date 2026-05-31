<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenGL -->

\_\_FORCETOC\_\_

You can enable OpenGL by setting `hardware.graphics.enable = true;`[^1] in your `/etc/nixos/configuration.nix`.

OpenGL must break purity due to the need for hardware-specific linkage. Intel, AMD, and Nvidia have different drivers for example. On NixOS, these libraries are symlinked under

` /run/opengl-driver/lib`

and optionally (if `hardware.graphics.enable32Bit`[^2] is enabled)

` /run/opengl-driver-32/lib`

When a program is installed in your environment, these libraries should be found automatically. However, this is not the case in a \`nix-shell\`. To fix, add this line to your shell.nix:

``` nix
LD_LIBRARY_PATH="/run/opengl-driver/lib:/run/opengl-driver-32/lib";
```

## Testing Mesa updates

To avoid a lot of rebuilds there's an internal NixOS option to override the Mesa drivers: `hardware.opengl.package`

It can be used like this:

``` nix
hardware.opengl.package = (import /srv/nixpkgs-mesa { }).pkgs.mesa.drivers;
```

However, since Mesa 21.0.2 this doesn't necessarily work anymore and something like the following might be required:

``` nix
system.replaceRuntimeDependencies = [
  ({ original = pkgs.mesa; replacement = (import /srv/nixpkgs-mesa { }).pkgs.mesa; })
  ({ original = pkgs.mesa.drivers; replacement = (import /srv/nixpkgs-mesa { }).pkgs.mesa.drivers; })
];
```

**Note:** Both of these approaches are impure and only work to a certain degree (many limitations!). If you want to use a different version of Mesa your best option is to use an overlay or a Git worktree where you use the same Nixpkgs revision and only alter `pkgs/development/libraries/mesa/` for one of the two approaches mentioned above.

## Debugging Mesa issues

There are a lot of useful environment variables for debugging purposes: <https://docs.mesa3d.org/envvars.html>

The most important one is `LIBGL_DEBUG=verbose` and helps with debugging error like:

    libGL error: MESA-LOADER: failed to open $DRIVER (search paths /run/opengl-driver/lib/dri)
    libGL error: failed to load driver: $DRIVER

### glxinfo

Use to load 3D acceleration debug information.

If `glxinfo` returns `Error: couldn't find RGB GLX visual or fbconfig`, ensure you have `hardware.opengl.extraPackages = [ pkgs.mesa.drivers ];` set.

## Notes

<references group=note />

## Related

<a href="Nixpkgs_with_OpenGL_on_non-NixOS" class="wikilink" title="Nixpkgs with OpenGL on non-NixOS">Nixpkgs with OpenGL on non-NixOS</a>

<a href="Category:_Video" class="wikilink" title="Category: Video">Category: Video</a>

[^1]: Renamed from `hardware.opengl.enable` in <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 24.11

[^2]: Renamed from `hardware.opengl.driSupport32Bit` in <a href="NixOS" class="wikilink" title="NixOS">NixOS</a> 24.11
