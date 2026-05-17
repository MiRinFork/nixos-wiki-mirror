<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Weechat -->

[WeeChat](https://weechat.org/) is an extensible chat client with a command line interface.

This article is an extension to the documentation in the [NixOS manual](https://nixos.org/manual/nixos/stable/#module-services-weechat).

## Module

To use WeeChat using the NixOS module, you should note that additional configuration is required. This is because of the screen security wrapper.

``` nix
  services.weechat.enable = true;
  programs.screen.screenrc = ''
    multiuser on
    acladd USER # TODO: change to your local user
    term screen-256color
  '';
```

After that you may attach the screen session using `$ screen -x weechat/weechat-screen`.

## Scripts

WeeChat can be extended with scripts. Those can be written in a variety of scripting languages. As these scripts may depend on external libraries, we need to take care that those are found by WeeChat. This can either be done by adding already packaged scripts or by extending WeeChat's extraBuildInputs.

### Packaged WeeChat Scripts

There are multiple prepackaged `weechatScripts` in the nixpkgs. Those are Nix packages for a WeeChat script with the script's extra dependencies. The easiest way is to create an <a href="Overlays" class="wikilink" title=" overlay"> overlay</a>.

``` nix
self: super:
{
  weechat = super.weechat.override {
    configure = { availablePlugins, ... }: {
      scripts = with super.weechatScripts; [
        weechat-otr
        wee-slack
      ];
      # Uncomment this if you're on Darwin, there's no PHP support available. See https://github.com/NixOS/nixpkgs/blob/e6bf74e26a1292ca83a65a8bb27b2b22224dcb26/pkgs/applications/networking/irc/weechat/wrapper.nix#L13 for more info.
      # plugins = builtins.attrValues (builtins.removeAttrs availablePlugins [ "php" ]);
    };
  };
}
```

### WeeChat extraBuildInputs

For example the [Jabber script](https://weechat.org/scripts/source/jabber.py.html/) depends on the `xmpppy` python library, which is provided in a separate nix package. To make WeeChat find the library, we can override the `weechat` nix package and add the dependency as an extra build input, e.g. by changing the `~/.nixpkgs/config.nix` as follows:

``` nix
{
  packageOverrides = pkgs: rec {
    weechat = pkgs.weechat.override { extraBuildInputs = [ pkgs.xmpppy ]; };
  };
}
```

### Problem loading multiline.pl

The script <b>multiline.pl</b> depends on the Pod::Select module. However, since perl version v5.31.1 Pod::Select has been removed. You can either install PodParser or use nix-shell to wrap weechat so it can find it:

``` shell
nix-shell -p perl -p perl532Packages.PodParser --run weechat
```

This script was also packaged as `weechatScripts.multiline` and is currently available in the [unstable release](https://github.com/NixOS/nixpkgs/blob/nixos-unstable/pkgs/applications/networking/irc/weechat/scripts/multiline/default.nix).

## Glowing Bear, nginx, TLS, and Oauth2 Proxy

One can set up Glowing Bear as a web client to Weechat. However, its best to proxy inbound connections from the internet through a more robust service with TLS enabled. Lastly, it's convenient to reuse an auth provider to provide access to internal applications.

This configuration snippet can illustrate how to configure it:

``` nix
{ config, pkgs, ... }:
{
  services.weechat.enable = true;

  # Go read the terms at https://letsencrypt.org/repository/
  security.acme.acceptTerms = false;
  security.acme.email = "";

  services.nginx = {
    enable = true;
    recommendedGzipSettings = true;
    recommendedOptimisation = true;
    recommendedProxySettings = true;
    recommendedTlsSettings = true;
    # You'd think this is a good idea, but Safari doesn't support 1.3 on websockets yet from my testing in 2020.  If one is only using Chrome, consider it.
    # sslProtocols = "TLSv1.3";
    virtualHosts = {
      "irc.your.fqdn.goes.here" = {
        forceSSL = true;
        enableACME = true;
        locations."^~ /weechat" = {
          proxyPass = "http://127.0.0.1:9000/weechat/";
          proxyWebsockets = true;
        };
        locations."/" = {
          root = pkgs.glowing-bear;
        };
      };
    };

    services.oauth2.proxy = {
      enable = true;
      email.addresses = ''
        # your email goes here for authorization
      '';
      nginx.virtualhosts = [
        "irc.your.fqdn.goes.here"
      ];
      clientID = "";
      keyFile = "";
    };
}
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:NixOS_Manual" class="wikilink" title="Category:NixOS Manual">Category:NixOS Manual</a>
