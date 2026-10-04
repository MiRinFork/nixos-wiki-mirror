<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: MTP -->

The [Media Transfer Protocol (MTP)](https://en.wikipedia.org/wiki/Media_Transfer_Protocol) can be used to transfer media files to and from many mobile phones (mostly <a href="Android" class="wikilink" title="Android">Android</a> devices) and media players (e.g. Creative Zen).

MTP devices are usually mounted via [FUSE](https://wiki.archlinux.org/title/FUSE) and then appear as a more or less regular file system.

### go-mtpfs

[`go-mtpfs`](https://github.com/hanwen/go-mtpfs) is a simple implementation of the MTP filesystem, which has its own limitations, but the main advantage is that it does not need to be installed. You can just run:

Sometimes, `go-mtpfs` can crash, and you have to first run `umount mnt` before restarting `go-mtpfs`.

### jmtpfs

Install `jmtpfs`:

To mount the only available device:

If there are several connected devices, use `-l` to find them and `-device=` to specify which one to mount.

To unmount:

### gvfs

On NixOS, file managers that support gvfs, such as PCManFM, can mount mtp devices by adding this to `configuration.nix`:

``` nix
{ 
  services.gvfs.enable = true;
}
```

The above should suffice, but there also exists a more manual method. This method apparently only works well with GTK/Gnome-based desktops like <a href="GNOME" class="wikilink" title="Gnome Shell">Gnome Shell</a> or <a href="Xfce" class="wikilink" title="Xfce">Xfce</a>. It relies on having `gvfs` listed in the environment variable `GIO_EXTRA_MODULES`, for example:

`GIO_EXTRA_MODULES=/nix/store/my9jjhq7s19l05zqk969h69jhrrijpkz-gvfs-1.34.2/lib/gio/modules`

First identify your device with `lsusb`: The adress of the device will then be `mtp://[usb:002,007]/`.

You need the `gio` from the `glib` package. Then: to mount and to unmount.

The device will appear in your favorite file manager.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
