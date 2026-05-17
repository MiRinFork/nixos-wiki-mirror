<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Kodi -->

[Kodi](https://kodi.tv) (formerly known as XBMC) is an award-winning free and open source (GPL) software media player and entertainment hub that can be installed on Linux, OSX, Windows, iOS and Android, featuring a 10-foot user interface for use with televisions and remote controls.

## Basic module usage

The NixOS module for Kodi sets Kodi up as a desktop session. With this configuration Kodi will run automatically on boot:

``` nix
{
  services.xserver.enable = true;
  services.xserver.desktopManager.kodi.enable = true;
  services.xserver.displayManager.autoLogin.enable = true;
  services.xserver.displayManager.autoLogin.user = "kodi";

  services.xserver.displayManager.lightdm.greeter.enable = false;

  # Define a user account
  users.extraUsers.kodi.isNormalUser = true;
}
```

## Access from other machines

For this to work Kodi's remote interface must be enabled in the Kodi configuration. Kodi uses by default udp/tcp port 8080, which must be allowed in the firewall:

``` nix
{
  networking.firewall = {
    allowedTCPPorts = [ 8080 ];
    allowedUDPPorts = [ 8080 ];
  };
}
```

## Autostart kodi-gbm, with HDMI audio passthrough

From ArchWiki: currently the most feature rich. It is the only one of the three options (x11, wayland, gbm) able to display HDR content, may be a good choice for standalone operations since it runs directly on the GPU without the need for the added X11 layer. A complete list of features lacking compared to other back-ends can be found in Kodi issue 14876.

``` nix
{ pkgs, ... }:
{
  # use alsa; which supports hdmi passthrough
  services.pulseaudio.enable = false;
  services.pipewire.enable = false;

  environment.systemPackages = with pkgs; [
    kodi-gbm
  ];

  users.users = {
    kodi = {
      initialHashedPassword = "passwordHash";
      extraGroups = [
        # allow kodi access to keyboards
        "input"
      ];
      isNormalUser = true;
    };
  };


  # auto-login and launch kodi
  services.getty.autologinUser = "kodi";
  services.greetd = {
    enable = true;
    settings = {
      initial_session = {
        command = "${pkgs.kodi-gbm}/bin/kodi-standalone";
        user = "kodi";
      };
      default_session = {
        command = "${pkgs.greetd.greetd}/bin/agreety --cmd sway";
      };
    };
  };

  programs.sway = {
    enable = true;
    xwayland.enable = false;
  };
}
```

## With Wayland

Especially on less-powerful ARM boards the wayland variant is faster. In this example cage, kiosk compositor for Wayland, will run Kodi as its only application:

``` nix
{ pkgs, ... }: {
  # Define a user account
  users.extraUsers.kodi.isNormalUser = true;
  services.cage.user = "kodi";
  services.cage.program = "${pkgs.kodi-wayland}/bin/kodi-standalone";
  services.cage.enable = true;
}
```

## Plugins

There are two different ways to install plugins.

You can either set the relevant option (search pkgs/top-level/all-packages.nix for "wrapKodi" for a list) through NixOS or home-manager:

``` nix
nixpkgs.config.kodi.enableAdvancedLauncher = true;
```

Or you can override Kodi to include the plugins (see pkgs/applications/video/kodi/plugins.nix for a list or search in the `kodiPackages` namespace):

``` nix
environment.systemPackages = [
    (pkgs.kodi.withPackages (kodiPkgs: with kodiPkgs; [
        jellyfin
    ]))
];
```

When using the setup from the <a href="Kodi#Autostart_kodi-gbm,_with_HDMI_audio_passthrough" class="wikilink" title="kodi-gbm section above">kodi-gbm section above</a>, the plugins will not be available unless you use the same definition in the greetd command section. To make this easier, you can define the set as a variable like this and reference it later:

``` nix
{ config, pkgs, ... }:

let
    myKodi = (with pkgs; (kodi-gbm.withPackages (p: with p; [
        jellycon 
        ])));
in
{
    # Replace occurences of kodi-gbm with myKodi,
    # specifically:
    environment.systemPackages = with pkgs; [
        myKodi
    ];
    # and
    services.greetd.settings.initial_session.command = "${myKodi}/bin/kodi-standalone";
}
```

Or if using as the startup desktop service:

``` nix
  services.xserver.desktopManager.kodi.package =
    pkgs.kodi.withPackages (pkgs: with pkgs; [
    jellycon
    ]))
];
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a>
