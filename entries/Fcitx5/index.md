<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Fcitx5 -->

<languages/> <translate> [Fcitx5](https://fcitx-im.org/wiki/Fcitx_5) is a lightweight input method framework with add-on support.

## Installation

### System Setup

The following is a snippet for a NixOS configuration that sets up fcitx5, its GUI config tool, and two add-ons. </translate> <translate>

## Configuration

Fcitx5 can be configured declaratively (though this is <strong>optional</strong>) using or [i18n.inputMethod.fcitx5.settings](https://home-manager-options.extranix.com/?query=i18n.inputMethod.fcitx5.settings) (<a href="Special:MyLanguage/Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>). The former generates a config file in and the latter in .

It would be easier to edit the Fcitx5 profile through GUI tools (i.e. ) [as recommended in Arch Wiki](https://wiki.archlinux.org/title/Fcitx5#Configuration_tool), then convert the generated configuration files to Nix configuration;

- (if exists) to

- (if exists) to

</translate> <translate>

## Troubleshooting

### Add-ons Not Detected

**Do not** install fcitx5 using `environment.systemPackages` can interfere with add-on detection. Make sure to only add fcitx5 to your config as shown in <a href="Special:MyLanguage/Fcitx5#Setup" class="wikilink" title=" Setup"> Setup</a>.

</translate> ![<translate>Fcitx5 failing to load IME module (claims "使用不可" (unusable))</translate>](Fcitx5-mozc-load-fail.jpg "Fcitx5 failing to load IME module (claims "使用不可" (unusable))") <translate>

Another possibility is that you are calling `${pkgs.fcitx5}/bin/fcitx5` instead of the patched `fcitx5-with-addons` (`/run/current-system/sw/bin/fcitx5`). For example in <a href="Special:MyLanguage/Hyprland" class="wikilink" title="Hyprland">Hyprland</a>:

</translate>

` # ~/.config/hypr/hyprland.conf`  
` exec-once=fcitx5 -d # not ${pkgs.fcitx5}/bin/fcitx5 !`

<translate>

### Fcitx5 Doesn't Start When Using WM

If using a Window Manager (WM), such as <a href="Special:MyLanguage/Sway" class="wikilink" title="Sway">Sway</a>, you may need to add `services.xserver.desktopManager.runXdgAutostartIfNone = true;` to your NixOS configuration.

### Using Wayland

Set boolean `i18n.inputMethod.fcitx5.waylandFrontend` to true to suppress warnings about environment variables.

For more details on how to correctly set fcitx5 for different compositors and applications, refer to the [fcitx5 wiki](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland).

### SVG Themes Broken

Themes using SVG format might not be rendered correctly. You need to introduce `librsvg`. The easiest way to do so is </translate>

``` nix
programs.gdk-pixbuf.modulePackages = [ pkgs.librsvg ];
```

<translate> See also [1](https://github.com/NixOS/nixpkgs/pull/451267)[2](https://github.com/NixOS/nixpkgs/pull/428697). </translate>

<a href="Category:Applications{{#translation:}}" class="wikilink" title="Category:Applications{{#translation:}}">Category:Applications{{#translation:}}</a>
