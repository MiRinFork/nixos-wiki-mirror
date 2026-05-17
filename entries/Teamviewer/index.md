<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Teamviewer -->

[Teamviewer](https://www.teamviewer.com) is a proprietary software application for remote control, desktop sharing, online meetings, web conferencing and file transfer between computers.

### Installation

To perform full installation with a service, add this to your `configuration.nix`:

``` nix
  services.teamviewer.enable = true;
```

Please be aware, that installing Teamviewer by adding it to the `environment.systemPackages` of your `configuration.nix`:

``` nix
  environment.systemPackages = with pkgs; [
  ...
  teamviewer
  ...
  ];
```

or installing it via `nix-env -i teamviewer` will **not** install its corresponding service. This will allow Teamviewer to start outgoing connections, but will not allow it to receive connections from the Internet. Upon the start, Teamviewer will hence display *Not ready. Please check your connection* message.

### Wayland support

There is upstream support for connecting to a system that is running wayland, but this does not yet appear to work under NixOS (https://github.com/NixOS/nixpkgs/issues/404645). Perhaps a different <a href="Remote_Desktop" class="wikilink" title="Remote Desktop">Remote Desktop</a> option might help?

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a>
