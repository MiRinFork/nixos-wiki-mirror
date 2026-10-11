<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ONLYOFFICE -->

[ONLYOFFICE](https://www.onlyoffice.com) is a software suite that offers online and offline tools for document editing, collaboration, and management. It is developed by Ascensio System SIA, a company based in Riga, Latvia. ONLYOFFICE consists of several components, such as Docs, Workspace, Desktop Editors, and Mobile Apps. It is an open-source project that aims to provide a secure and compatible alternative to other office suites.

## Installation

Add following line to your configuration to enable ONLYOFFICE

### Install missing corefonts

By default, NixOS doesn't ship with any of the Microsoft fonts OOTB, to get the Microsoft corefonts, add the following to your NixOS config:

## Troubleshooting

### OnlyOffice can't see or use any system fonts

According to one [upstream bug](https://github.com/ONLYOFFICE/DocumentServer/issues/1859) ONLYOFFICE DesktopEditors is unable to locate <a href="Fonts" class="wikilink" title="font">font</a> files on NixOS.

Currently, the best workaround to first apply the fix mentioned in <a href="Fixes_for_non-Nix_applications#Flatpak,_Distrobox,_Appimage_and_other_non-Nix_applications_can&#39;t_find_system_fonts/icons/themes" class="wikilink" title="Fixes for non-Nix applications#Flatpak, Distrobox, Appimage and other non-Nix applications can&#39;t find system fonts/icons/themes">Fixes for non-Nix applications#Flatpak, Distrobox, Appimage and other non-Nix applications can't find system fonts/icons/themes</a>, then, as ONLYOFFICE DeskopEditors is currently packaged with FHSEnv and bwrap as of NixOS 26.05, pass the `/usr/share/fonts` directory inside the bubblewrap/FHSEnv sandbox:

``` nixos
# onlyoffice-font-fix.nix

{ config, pkgs, ... }:

{
  # Expose installed fonts under /run/current-system/sw/share/X11/fonts
  fonts.fontDir.enable = true;

  # OnlyOffice font fix
  nixpkgs.overlays = [
    (final: prev: {
      onlyoffice-desktopeditors = prev.buildFHSEnv (
        prev.onlyoffice-desktopeditors.passthru.args
        // {
          extraBwrapArgs = (prev.onlyoffice-desktopeditors.passthru.args.extraBwrapArgs or [ ]) ++ [
            # Bind mount host system fonts into the FHS container's /usr/share/fonts:
            "--ro-bind"
            "/usr/share/fonts"
            "/usr/share/fonts"
          ];
        }
      );
    })
  ];
}
```

Another workaround is to install missing or additional fonts and copy them to the user directory

``` console
$ mkdir -p ~/.local/share/fonts
$ # Query store path to the corefonts package
$ NIXPKGS_ALLOW_UNFREE=1 nix-store --query --outputs $(nix-instantiate '<nixpkgs>' -A corefonts)
$ # Change the store path according to result of the command above
$ cp /nix/store/ssw7d3cl2dzps6y1c88c01xclsigmjqf-corefonts-1/share/fonts/truetype/* ~/.local/share/fonts/
$ chmod 644 ~/.local/share/fonts/*
```

## See also

- <a href="LibreOffice" class="wikilink" title="LibreOffice">LibreOffice</a>, personal productivity suite that gives you six feature-rich applications for all your document production and data processing needs: Writer, Calc, Impress, Draw, Math and Base.
- <a href="ONLYOFFICE_DocumentServer" class="wikilink" title="ONLYOFFICE DocumentServer">ONLYOFFICE DocumentServer</a>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
