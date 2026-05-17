<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Konqueror -->

<languages/> <translate> Konqueror is a file manager application preinstalled in KDE/Plasma Desktop Environments.

## Running without KDE

Since NixOS makes it easy to run individual KDE applications without running the KDE Plasma desktop manager, one can easily install Konqueror as a file manager; but (as of NixOS Stable 22.11) it won't show thumbnails (which it calls "preview icons").

The fix (again, as of NixOS Stable 22.11) seems to be to install these packages in environment.systemPackages, in addition to libsForQt5.konqueror:

- ffmpegthumbnailer
- libsForQt5.kdegraphics-thumbnailers
- libsForQt5.ffmpegthumbs
- libsForQt5.kio-extras

</translate>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>
