<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Firefox -->

<languages/> <translate> <strong>Firefox</strong>[^1] is a free and open-source web browser developed by the Mozilla Foundation. It is known for its focus on privacy, security, and user freedom, offering a customizable experience through a rich ecosystem of add-ons and themes.

## Installation

#### Shell

</translate>

``` console
$ nix-shell -p firefox
```

<translate> The command above makes `firefox` available in your current shell without modifying any configuration files.

#### System setup

</translate>

<translate> After rebuilding with `nixos-rebuild switch`, Firefox will be installed system-wide.

## Configuration

#### Basic

</translate>

<translate> The snippet above enables Firefox for all users (or the current Home Manager profile, if placed in `home.nix`).

#### Advanced

Home Manager allows for deep customization of Firefox, including extensions, search engines, bookmarks, and themes. The example below shows a configuration for adding custom search engines with aliases. </translate>

<translate> [More options are available on Home Manager's site.](https://nix-community.github.io/home-manager/options.xhtml#opt-programs.firefox.enable) [More options for policies can be found on Mozilla's site.](https://firefox-admin-docs.mozilla.org/reference/policies/)

To reload uBlock Origin settings from `policies.json`, open the uBlock Origin dashboard and choose *Reset to default settings*.

## Firefox Variants

There are several Firefox variants available. To choose one, set the `programs.firefox.package` option accordingly. </translate>

<translate>

### Variant: Official Binaries

Mozilla provides official pre-built Firefox binaries via the `firefox-bin` package, which are downloaded directly from Mozilla's servers.

### Variant: Extended Support Release (ESR)

`firefox-esr` is a variant that receives security updates for a longer period with a slower feature implementation cadence. It also allows for more extensive policy-based configuration.

### Variant: Nightly

Nightly builds are daily builds from the central Mozilla repository.

#### Method 1: Using nix-community/flake-firefox-nightly

This method is reproducible but may lag behind the upstream version. First, add the input to your flake: </translate>

<translate> Then, add the package to your system: </translate>

<translate>

#### Method 2: Using mozilla/nixpkgs-mozilla

This method is not necessarily reproducible without a flake-like system but will always be the latest version. </translate>

<translate> Using this method requires the `--impure` flag for Nix commands, for example: </translate>

``` console
$ nixos-rebuild switch --impure
```

<translate>

## Tips and Tricks

#### Force XWayland (X11) instead of Wayland

Firefox defaults to native Wayland when running under a Wayland compositor. To force it to use XWayland (X11) instead: </translate>

<translate> This is useful when troubleshooting Wayland-specific issues or when certain features work better under X11.

#### Touchpad Gestures and Smooth Scrolling

Enable `xinput2` to improve touchscreen support and enable additional touchpad gestures and smooth scrolling. </translate>

<translate>

#### KDE Plasma Integration

1\. Add the native messaging host package to your configuration: </translate>

<translate> 2. Install the corresponding [browser add-on](https://addons.mozilla.org/en-US/firefox/addon/plasma-integration/).

#### Use KDE file picker

To use the KDE file picker instead of the GTK one, set the following preference: </translate>

<translate>

## Troubleshooting

#### Native Messaging Hosts Fail to Load

Native messaging hosts (used for extensions like Plasma Integration) do not work with the `-bin` variants of Firefox or with Firefox installed imperatively via `nix-env`. You must use a variant built from source via your NixOS or Home Manager configuration.

#### Policies Failed to Load when using Home Manager

If the policies are not configured when using Home Manager, ensure that the package is installed via your Home Manager configuration rather than your NixOS configuration. Additionally, some options are only available when using the `firefox-esr` variant of the package.

#### ALSA audio instead of PulseAudio

To force Firefox to use ALSA, you can override it with a wrapper: </translate>

<translate>

#### Screen Sharing under Wayland

Screen sharing on Wayland requires enabling PipeWire and the appropriate XDG Desktop Portals. </translate>

<translate>

## See also

- <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> – Declarative per-user configuration
- [NixOS options for Firefox](https://search.nixos.org/options?channel=unstable&query=programs.firefox)
- [Policy template options for Firefox](https://firefox-admin-docs.mozilla.org/reference/policies/)

## References

</translate>

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Web_Browser" class="wikilink" title="Category:Web Browser">Category:Web Browser</a>

[^1]: Mozilla Foundation, "Firefox", Official Website, Accessed June 2025. <https://www.mozilla.org/firefox>
