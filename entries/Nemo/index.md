<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nemo -->

[Nemo](https://github.com/linuxmint/nemo) is the default file manager for <a href="Cinnamon" class="wikilink" title="Cinnamon">Cinnamon</a>. It is a fork of <a href="Nautilus" class="wikilink" title="GNOME&#39;s Nautilus">GNOME's Nautilus</a>.

## Installation

Install the or package.

## Configuration

### Set Nemo as default file browser

#### Home-Manager

To set Nemo as the default file browser, <a href="Default_applications" class="wikilink" title="create a desktop entry">create a desktop entry</a> and set it as a default application using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>:

#### NixOS

On NixOS, you don't need to create a nemo.desktop file. Just add the following to your configuration:

``` nixos
# configuration.nix

{ config, pkgs, ... }:
{
  # ...
  xdg = {
    mime.defaultApplications = {
      "inode/directory" = [ "nemo.desktop" ];
      "application/x-gnome-saved-search" = [ "nemo.desktop" ];
    };
  };
  # ...
}
```

### Change the default terminal emulator for Nemo

To change the default terminal emulator for Nemo, set dconf.settings in the Home Manager config:

### Set keyboard shortcut for "Open in terminal"

To edit keyboard shortcuts, set dconf.settings and edit `~/.gnome2/accels/nemo` using Home Manager (replacing "F4" with the desired key combination):

, , and can be used as key modifiers (for example, ).

### With extensions

When using , the default Mint installation plugins (aside from nemo-share) are provided by default: , , , and are provided.

``` nixos
# configuration.nix

{ config, pkgs, ... }:
{
  environment.systemPackages = (with pkgs; [
    (nemo-with-extensions.override {
      extensions = with pkgs; [ nemo-seahorse ];
      # useDefaultExtensions = false;  # Uncomment to not add default extensions
    })
  ]);
}
```

### Declarative preference configuration

Nemo preferences can be configured decoratively.

``` nixos
{
  programs.dconf.profiles.user.databases = [
    {
      settings = {
        "org/nemo/preferences" = {
          click-policy = "double";
          date-format = "iso";
          show-advanced-permissions = true;
          show-hidden-files = true;
          show-toggle-extra-pane-toolbar = true;
          size-prefixes = "base-10";
          tooltips-in-icon-view = false;
          tooltips-in-list-view = false;
        };
        "org/nemo/preferences/menu-config" = {
          selection-menu-open-as-root = false;
          selection-menu-open-in-new-tab = false;
          selection-menu-pin = false;
        };
      };
    }
  ];
}
```

You can use to view existing dconf entries made through the Nemo preferences menu, or use [dconf-to-nixos](https://github.com/Denperidge/scripts/blob/main/development/dconf-to-nixos) to export your current preferences into copy-pasteable NixOS settings.

See [Nemo - ArchWiki](https://wiki.archlinux.org/index.php?title=Nemo) for further information.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:File_Manager" class="wikilink" title="Category:File Manager">Category:File Manager</a>
