<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Awesome -->

[awesome](https://awesomewm.org/) is a highly configurable, next generation framework window manager for X. It is very fast, extensible and licensed under the GNU GPLv2 license.

## Enabling

To enable awesomeWM set `services.xserver.windowManager.awesome.enable` to `true`. For example:

Similar configuration using <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a>.

Reference: <https://github.com/rycee/home-manager/blob/master/modules/services/window-managers/awesome.nix#blob-path>

## AwesomeWM Flake

If you wish to run the development build of AwesomeWM (i.e. the source code at the git master branch), you can use a flake as shown below: And here's how you can install the package: Note: This uses an unofficial third party flake which is not officially associated with the AwesomeWM project

Flake reference: <https://github.com/Souheab/awesomewm-git-nix-flake>

## References

- [Getting started](https://awesomewm.org/apidoc/documentation/07-my-first-awesome.md.html#)
- [Default configuration file documentation](https://awesomewm.org/apidoc/documentation/05-awesomerc.md.html#3)

<a href="Category:Window_managers" class="wikilink" title="Category:Window managers">Category:Window managers</a> <a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
