<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Flameshot -->

[Flameshot](https://flameshot.org/) is a powerful screenshot and screenshot annotation tool. Flameshot allows the user to take a screenshot and then draw, write text, blur, crop, and otherwise edit screenshots with ease.

## Install

For X11 you can install Flameshot by simply adding it to your configuration file.

### Install on Wayland

In order to use Flameshot on Wayland you will need to install [Grim](https://gitlab.freedesktop.org/emersion/grim) and configure Flameshot to use it.

#### Install Grim

#### Configure Flameshot

You may do this through Home Manager, or you may configure it manually in ~/.config/flameshot.

## Home Manager

You can configure Flameshot settings through Home Manager with the following syntax. Additional settings may be found on the [Flameshot](https://github.com/flameshot-org/flameshot/blob/master/flameshot.example.ini) Github and adapted into Nix. See documented settings in the [Home Manager Appendix - services.flameshot](https://nix-community.github.io/home-manager/options.xhtml#opt-services.flameshot.enable).

## Setting Shortcuts

Setting shortcuts is different depending on your Desktop Environment. You can can check Flameshot CLI commands that you can use for shortcuts by running `man flameshot`.

### Sway

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
