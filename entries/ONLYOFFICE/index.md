<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: ONLYOFFICE -->

[ONLYOFFICE](https://www.onlyoffice.com) is a software suite that offers online and offline tools for document editing, collaboration, and management. It is developed by Ascensio System SIA, a company based in Riga, Latvia. ONLYOFFICE consists of several components, such as Docs, Workspace, Desktop Editors, and Mobile Apps. It is an open-source project that aims to provide a secure and compatible alternative to other office suites.

## Installation

Add following line to your configuration to enable ONLYOFFICE

## Troubleshooting

### Install and use missing corefonts

According to one [upstream bug](https://github.com/ONLYOFFICE/DocumentServer/issues/1859) ONLYOFFICE is unable to locate <a href="Fonts" class="wikilink" title="font">font</a> files on NixOS. A workaround is to install missing or additional fonts and copy them to the user directory

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
