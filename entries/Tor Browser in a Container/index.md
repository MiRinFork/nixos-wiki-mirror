<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Tor Browser in a Container -->

Here are a few steps to run Tor Browser in NixOS Container w/ Pulse, Media Support. Most of the time, using <a href="SSH" class="wikilink" title="SSH">SSH</a>, `ssh -X` would have sufficed. Nevertheless, to route audio, the following is required.

``` nix
containers.browser = {
  autoStart = false;
  privateNetwork = true;
  hostAddress = "192.168.7.10";
  localAddress = "192.168.7.11";
  config = {config, pkgs, ... }: {
    services.openssh = {
      enable = true;
      forwardX11 = true;
    };

    users.extraUsers.browser = {
      isNormalUser = true;
      home = "/home/browser";
      openssh.authorizedKeys.keys = [ SSH-KEYS-GO-HERE ];
      extraGroups = ["audio" "video"];
    };
  };
};

# Open necessary ports
networking.firewall.allowedTCPPorts = [ 4713 6000 ];
hardware.pulseaudio = {
  enable = true;
  systemWide = true;
  support32Bit = true;
  tcp = { enable = true; anonymousClients = { allowedIpRanges = ["127.0.0.1" "192.168.7.0/24"]; }; };
};

# Configuring NAT
networking.nat.enable = true;
networking.nat.internalInterfaces = ["ve-browser"];
networking.nat.externalInterface = "YOUR-EXTERNAL-INTERFACE";

# Depending on your use of global or home configuration, you will have to install "socat"
environment.systemPackages = [
  pkgs.socat
];
```

Mind to fill the <a href="SSH_public_key_authentication" class="wikilink" title="SSH keys">SSH keys</a> in. Then, follow the steps:

``` bash
nixos-rebuild switch

nixos-container start browser # switch "start" with "root-login" for root
```

Now the container should be in a sane state to work on. Install the browser and apulse:

``` bash
[root@browser:~]$ su - browser
[browser@browser:~]$ nix repl
Welcome to Nix version 2.2. Type :? for help.

nix-repl> pkgs = import <nixpkgs> {}
nix-repl> :i pkgs.callPackage <nixpkgs/pkgs/applications/networking/browsers/tor-browser-bundle-bin> { mediaSupport = true; pulseaudioSupport = true; }
installing 'tor-browser-bundle-bin-8.0.6.drv'
nix-repl> :i pkgs.callPackage <nixpkgs/pkgs/misc/apulse> {}
installing 'apulse-0.1.11.1.drv'
these paths will be fetched (0.04 MiB download, 0.20 MiB unpacked):
  /nix/store/mi6kyfjymb3bdpwic3hy9y64hv21hflc-apulse-0.1.11.1
copying path '/nix/store/mi6kyfjymb3bdpwic3hy9y64hv21hflc-apulse-0.1.11.1' from 'https://cache.nixos.org'...
building '/nix/store/r00d47r40v7mhblly9rqas434x2d53js-user-environment.drv'...
created 121 symlinks in user environment
nix-repl>
```

The following two scripts are needed. Put them in ~/bin or any other directory included in the path.

``` bash
# run-tor-browser.sh (executed by the host)

#!/bin/sh
socat -d TCP-LISTEN:6000,fork,bind=192.168.7.10 UNIX-CONNECT:/tmp/.X11-unix/X0 &
xhost +
ssh -X browser@192.168.7.11 run-tor-browser.sh
```

``` bash
# run-tor-browser.sh (executed in the container (guest) by the previous one executed on the host)

#!/bin/sh
PULSE_SERVER=tcp:192.168.7.10:4713 XAUTHORITY="/home/browser/.Xauthority" DBUS_SESSION_BUS_ADDRESS="" DISPLAY=192.168.7.10:0.0 apulse tor-browser $@
```

Now you should be able to run the browser in a container and have media and audio support. Alternatively, you could use Xpra over SSH

``` bash
xpra start ssh://browser@192.168.7.11/ --start=tor-browser
```

<a href="Category:Cookbook" class="wikilink" title="Category:Cookbook">Category:Cookbook</a>
