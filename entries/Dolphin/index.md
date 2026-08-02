<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dolphin -->

Dolphin is the <a href="KDE" class="wikilink" title="KDE">KDE</a> desktop's file manager. When using dolphin without KDE, you may want to install some optional dependencies.

## Troubleshooting

### **Open with menu fix**

When using dolphin on other Desktop or Window Managers, the Open With menu may not show any applications.

A comprehensive solution can be found with [rumboon's dolphin-overlay](https://github.com/rumboon/dolphin-overlay), but a more straight-forward fix would be to add the following line to your configuration file:

### Icons

By default, dolphin by itself is not packaged with support for svg icons. This may result in blank icons.

To fix it, simply add the following package:

### KIO-Fuse

If you need to mount network shares you can use KIO-Fuse:

### Install

### File previews

<https://wiki.archlinux.org/title/Dolphin#File_previews>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>
