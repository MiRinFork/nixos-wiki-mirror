<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fixes for non-Nix applications -->

### Flatpak, Distrobox, Appimage and other non-Nix applications can't find system fonts/icons/themes

Flatpak, Distrobox, Appimage and alot of other non-Nix applications sometimes have hardcoded FHS path assumptions for locating fonts, icons and themes. These applications usually expect fonts, icons and themes to be available under `/usr/share/fonts`, `/usr/share/icons` and `/usr/share/themes`, respectively.

For these applications, instead of using a complicated `fhsEnv` solution, users can choose to simply bindmount the directories from `/run/current-system/sw/share` to their respective locations inside `/usr/share`.

Note that the following fix uses `bindfs` instead of normal bindmounting or symlinking. This is because of edgecases like [OnlyOffice](https://github.com/ONLYOFFICE/DocumentServer/issues/1859) that will not follow symlinks while evaluating resources under `/usr/share`. Thus, the [`resolve-symlink`](https://bindfs.org/docs/bindfs.1.html#sect10) functionality of `bindfs` becomes crucial for covering even the most niche corner cases.

``` nixos
# misc-usr-fix.nix
{ pkgs, ... }:

let
  # Mount options for the bind mounts
  mountOptions = [
    "ro"
    "x-gvfs-hide"
    # Resolves symlinks as if they were real files
    # Needed for things like OnlyOffice
    "resolve-symlinks"
  ];
in
{
  # Bind mounts fonts, icons and themes from
  # The /run/current-system/sw/share/* paths
  # to their /usr/share/* equivalents

  # Expose all fonts
  # under /run/current-system/sw/share/X11/fonts
  fonts.fontDir.enable = true;

  # Flatpak: Bind mounts /usr/share/* directories
  system.fsPackages = [ pkgs.bindfs ];

  # Fonts
  fileSystems."/usr/share/fonts" = {
    device = "/run/current-system/sw/share/X11/fonts";
    fsType = "fuse.bindfs";
    options = mountOptions;
  };

  # Icons
  fileSystems."/usr/share/icons" = {
    device = "/run/current-system/sw/share/icons";
    fsType = "fuse.bindfs";
    options = mountOptions;
  };

  # Themes
  fileSystems."/usr/share/themes" = {
    device = "/run/current-system/sw/share/themes";
    fsType = "fuse.bindfs";
    options = mountOptions;
  };
}
```

<a href="Category:Software" class="wikilink" title="Category:Software">Category:Software</a> <a href="Category:Fonts" class="wikilink" title="Category:Fonts">Category:Fonts</a>
