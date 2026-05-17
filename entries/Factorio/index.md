<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Factorio -->

<strong>[Factorio](https://www.factorio.com)</strong> is a video game created by [Wube Software](https://www.factorio.com/game/about). Factorio has a multiplayer mode that requires a dedicated server, which is available on Nixpkgs and can be installed on NixOS.

## Installation

To install the Factorio server, add the following to your <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="NixOS configuration">NixOS configuration</a>:

It is important to only install `factorio-headless` instead of `factorio` because the headless version is a redistributable download that does not require login credentials.

## Configuration

Here is a minimum viable configuration for the Factorio server:

This will run a unprotected server that binds to the `0.0.0.0` local IP address and uses the default UDP port of `34197`, with an auto-generated save file. Factorio servers support IPv6 by setting `bind = "[::]";`. All default settings can be seen here:

### Mods

The NixOS module for Factorio supports [third-party modifications](https://wiki.factorio.com/Modding), or <i>mods</i>, which are just compressed archives with extra game content. While technically you can create a full derivation for mods, in practice this can get complicated, especially since authentication is required to download mods from the official mod site.

Instead, you can download the mods you need imperatively from <https://mods.factorio.com/>, place them in a folder such as `/etc/nixos/factorio-mods`, and put this code in your <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="NixOS configuration">NixOS configuration</a>:

This code was developed by [nicball](https://github.com/nicball/nuc-nixos-configuration/blob/fccfa8441cba60c835aa2eb4238ae6f53bb781bb/factorio.nix#L16-L37).

## See also

- [The Factorio wiki page on Multiplayer](https://wiki.factorio.com/Multiplayer)

<a href="Category:Gaming" class="wikilink" title="Category:Gaming">Category:Gaming</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
