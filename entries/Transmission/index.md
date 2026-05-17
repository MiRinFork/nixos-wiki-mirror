<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Transmission -->

[Transmission](https://transmissionbt.com/) is a lightweight, open-source BitTorrent client for Linux that provides both GUI and command-line interfaces for efficient torrent downloading and seeding.

## Installation

Install by adding transmission_4-qt or transmission_4-gtk to your packages list

``` nix
environment.systemPackages = with pkgs; [ transmission_4-qt ];
```

``` nix
environment.systemPackages = with pkgs; [ transmission_4-gtk ];
```

Transmission 3 has been deprecated in the 25.05 channel and removed in favor of version 4 in the 25.11 channel onwards. If you still rely on it, consider making a backup before upgrading to transmission 4.

## Service configuration

The transmission daemon can be enabled declaratively as a `systemd` service with the settings under `services.transmission.settings`. [View the documentation for more info](https://search.nixos.org/options?type=packages&query=transmission.settings).

Note that `services.transmission.package` defaults to:

- `transmission_3` in the deprecated 25.05 channel
- `transmission_4` from 25.11 onwards

Example:

``` nix
services.transmission.settings = {
  download-dir = "${config.services.transmission.home}/Downloads";
};
```

### Password-protected RPC

The default method of editing the configuration and restarting the daemon will **not work** because of the way the configuration is handled. It is however possible to once set it in clear in the settings, and then copy the generated hash to the setting, removing the in-clear copy from the configuration.

### Example: allow remote access

To control the daemon remotely, put the following lines in your `/etc/nixos/configuration.nix`:

``` nix
services.transmission = { 
    enable = true; #Enable transmission daemon
    openRPCPort = true; #Open firewall for RPC
    settings = { #Override default settings
      rpc-bind-address = "0.0.0.0"; #Bind to own IP
      rpc-whitelist = "127.0.0.1,10.0.0.1"; #Whitelist your remote machine (10.0.0.1 in this example)
    };
  };
```

<a href="Category:_Applications" class="wikilink" title="Category: Applications">Category: Applications</a>
