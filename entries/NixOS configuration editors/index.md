<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: NixOS configuration editors -->

Creating graphical editors for NixOS configurations is hard because of the amount and complexity of options and the resulting possibilities.

## Text editors

To improve the editing experience of `configuration.nix`, it is recommend to use a text editor with syntax highlighting and language server (autocompletion, formatting, refactoring).

See also: <a href="Editor_Modes_for_Nix_Files" class="wikilink" title="Editor Modes for Nix Files">Editor Modes for Nix Files</a>

### Editing as normal user

The configuration files in `/etc/nixos/` are owned by root, so for every "save" operation, the editor will ask for the sudo password. To avoid this, we can move the config files to a user's home folder:

    mkdir ~/etc
    sudo mv /etc/nixos ~/etc/
    sudo chown -R $(id -un):users ~/etc/nixos
    sudo ln -s ~/etc/nixos /etc/

Now you can run `codium /etc/nixos` to edit the config with VSCodium, and `sudo nixos-rebuild switch` to build the config.

It's also a good idea to track the config files with `git`, and to make backups.

## Graphical editors

It is also possible to use a graphical config manager, which can't express all features of NixOS, but is simple to use.

### nix-gui by lapp0

- <https://github.com/nix-gui/nix-gui>
- <https://discourse.nixos.org/t/nix-gui-use-nixos-without-coding/15409>
- python + qt5 desktop program
- 580+ GitHub stars

### nix-software-center by snowfallorg

- <https://github.com/snowfallorg/nix-software-center>
- rust + libadwaita + gtk4 + relm4
- 747 GitHub stars

### nixos-manager by pmiddend

- <https://github.com/pmiddend/nixos-manager>
- <https://discourse.nixos.org/t/nixos-manager-manage-your-nixos-configuration-graphically/6685>
- haskell + gtk desktop program
- 160+ GitHub stars
- last commit: 2020

### nixos-conf-editor by vlinkz

- <https://github.com/vlinkz/nixos-conf-editor>
- <https://discourse.nixos.org/t/nixos-conf-editor-a-gtk4-libadwaita-configuration-editor/19426>
- <https://www.reddit.com/r/NixOS/comments/w1pwmd/nixos_configuration_editor_a_gtk4libadwaita_app/>
- rust + gtk4 desktop program
- 210+ GitHub stars
- backend tool: <https://github.com/vlinkz/nix-editor> - 50+ GitHub stars
- package manager: <https://github.com/vlinkz/nix-software-center> - 250+ GitHub stars

### nixui by matejc

- <https://github.com/matejc/nixui>
- <https://blog.matejc.com/blogs/myblog/graphical-ui-for-nix>
- 40+ GitHub stars
- last commit: 2015

### Nixos-Gui by Celestialme

- <https://github.com/Celestialme/Nixos-Gui>
- <https://www.reddit.com/r/NixOS/comments/vfywyv/nix_gui_application_to_manage_nixos_build_with/>
- svelte + tauri desktop program
- 20+ GitHub stars

## Web-based editors

### mynixos.com

<https://mynixos.com/>

"create and share software configurations using the NixOS ecosystem"

## See also

- <a href="Configuration_Collection" class="wikilink" title="Configuration Collection">Configuration Collection</a>
- <https://www.reddit.com/r/NixOS/comments/cu4dle/should_nix_have_a_gui/>
- <https://discourse.nixos.org/t/how-would-your-nixos-configuration-tool-look/1380>
- <https://www.reddit.com/r/nosyntax> - structural editors
- <a href="Nixos-rebuild#Specifying_a_different_configuration_location" class="wikilink" title="Nixos-rebuild#Specifying a different configuration location">Nixos-rebuild#Specifying a different configuration location</a>
- <https://discourse.nixos.org/t/use-vscode-editor-configuration-nix-cant-save/14119>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
