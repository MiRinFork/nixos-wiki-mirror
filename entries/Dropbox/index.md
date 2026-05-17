<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Dropbox -->

## Using the package

Install the `dropbox` package after enabling <a href="Unfree_software" class="wikilink" title="unfree software">unfree software</a>. Then start the dropbox command, which will download the real dropbox binary and start it.

## Configure Dropbox as a Service on NixOS

As of right now (16 Mar 2025) there is no dropbox module in nixpkgs, however [peterhoeg at discourse.nixos.org](https://discourse.nixos.org/t/using-dropbox-on-nixos/387/6) shared the service code he is using:

``` nix
{
  environment.systemPackages = with pkgs; [
    # dropbox - we don't need this in the environment. systemd unit pulls it in
    dropbox-cli
  ];

  networking.firewall = {
    allowedTCPPorts = [ 17500 ];
    allowedUDPPorts = [ 17500 ];
  };

  systemd.user.services.dropbox = {
    description = "Dropbox";
    wantedBy = [ "graphical-session.target" ];
    environment = {
      QT_PLUGIN_PATH = "/run/current-system/sw/" + pkgs.qt5.qtbase.qtPluginPrefix;
      QML2_IMPORT_PATH = "/run/current-system/sw/" + pkgs.qt5.qtbase.qtQmlPrefix;
    };
    serviceConfig = {
      ExecStart = "${lib.getBin pkgs.dropbox}/bin/dropbox";
      ExecReload = "${lib.getBin pkgs.coreutils}/bin/kill -HUP $MAINPID";
      KillMode = "control-group"; # upstream recommends process
      Restart = "on-failure";
      PrivateTmp = true;
      ProtectSystem = "full";
      Nice = 10;
    };
  };
}
```

A [pull request](https://github.com/NixOS/nixpkgs/pull/85699) has been created to add Dropbox as a Nixos module which builds on this code snippet (21 Apr 2020). As of 16 Mar 2025, this has been closed and abandoned.

## Configure Dropbox as a Service in HomeManager

The dropbox package is better maintained than the dropbox-cli package. The follow sets up dropbox as a service in home manager (working in Sept. 2024).

``` nix
{
    systemd.user.services.dropbox = {
        Unit = {
            Description = "Dropbox service";
        };
        Install = {
            WantedBy = [ "default.target" ];
        };
        Service = {
            ExecStart = "${pkgs.dropbox}/bin/dropbox";
            Restart = "on-failure";
        };
    };
}
```

## Alternative Open Source Client

There is also an open source alternative called [Maestral](https://maestral.app/): `maestral` as CLI and `maestral-gui` for a GUI.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
