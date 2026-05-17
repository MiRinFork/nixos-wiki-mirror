<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: PCManFM -->

<a href="wikipedia:PCMan_File_Manager" class="wikilink" title="PCManFM">PCManFM</a> is a free file manager application and the standard file manager of LXDE.

## Installation

Install the `pcmanfm` package.

### Additional features

Add `lxmenu-data` to be offered a list of "Installed applications" when opening a file.

Add `shared-mime-info` to recognise different file types.

#### USB Automounting

For USB mounting support, add the following line to your configuration:

``` nix
    services.gvfs.enable = true;
```

If automounting still does not work you may need to explicitly enable `devmon` and `udisks2`. Keep in mind that all removable media will automatically mounted even without pcmanfm running.

`configuration.nix`

``` nix
    services.udisks2.enable = true;
    services.devmon.enable = true;
```

#### SAMBA mount support

Configuration can be found under the <a href="Samba#Browsing_samba_shares_with_PCManFM" class="wikilink" title="Samba wiki page">Samba wiki page</a>.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>
