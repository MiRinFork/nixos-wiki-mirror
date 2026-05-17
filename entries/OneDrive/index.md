<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OneDrive -->

OneDrive is Microsoft's cloud file storage service. If you have a OneDrive account, for example from your organization or your Office 365 subscription, NixOS has software to let you sync it to a OneDrive directory your home directory.

## Setup

Add the following to your `/etc/nixos/configuration.nix`:

and rebuild your system.

Then as the user, run the following:

``` bash
onedrive
```

You will be given a login URL, open it in your browser, log in to the appropriate Microsoft account to which your OneDrive account is linked to, and after you are logged in, you get an empty screen. This is good, just copy the URL you are redirected to and paste it back in the terminal.

Then run the following:

``` bash
systemctl --user enable onedrive@onedrive.service
systemctl --user start onedrive@onedrive.service
```

this will enable and start the systemd user service. Note: this makes a symlink that is unmanaged by NixOS. When the onedrive service is updated, be sure to disable and enable the Systemd service again.

Check that the service started successfully and is running:

``` bash
systemctl --user status onedrive@onedrive.service
```

To view the log, run the following:

``` bash
journalctl --user -t onedrive | less
```

.

## See Also

- [Microsoft OneDrive](https://onedrive.live.com)
- [OneDrive client for Linux](https://github.com/abraunegg/onedrive)
- [nixpkgs OneDrive client package definition](https://github.com/NixOS/nixpkgs/blob/master/pkgs/applications/networking/sync/onedrive/default.nix)

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
