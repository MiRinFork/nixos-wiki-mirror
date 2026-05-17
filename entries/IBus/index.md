<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: IBus -->

[IBus](https://en.wikipedia.org/wiki/Intelligent_Input_Bus) is a bus for various input methods.

## Installation

Enabling IBus is described in the [manual](https://nixos.org/nixos/manual/index.html#module-services-input-methods-ibus). To enable it is as follows:

Available engines are listed under the `pkgs.ibus-engines` attribute set. The list of available engines can be viewed in the documentation for the option.

After rebuilding and switching to the new configuration, you still need to logout from your session and login again for ibus to work correctly.

## Troubleshooting

### Custom emojis

Custom emojis can be added to the emoji selection dialog of IBus. This can be used to workaround the fact that GTK does not support compose rules which output more than one unicode codepoint. Here an example <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> snippet.

Then, pressing `Ctrl+Shift+e` and then typing `shrug`, then hitting `Space` and `Return` will insert `¯\_(ツ)_/¯`.

## See also

- <a href="Locales" class="wikilink" title="Locales">Locales</a>

<a href="Category:Configuration" class="wikilink" title="Category:Configuration">Category:Configuration</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
