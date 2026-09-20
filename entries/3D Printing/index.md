<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: 3D Printing -->

NixOS can be used as a [Klipper](https://github.com/Klipper3d/klipper/) host. This is a great alternative to a [KIAUH](https://github.com/dw-0/kiauh) installation.

## Installation

Below is a basic configuration example that can be used to install Klipper, Moonraker and Mainsail/Fluidd:

``` nix
users.users.klipper = {
  group = "klipper";
  extraGroups  = [ "dialout" ];
  isSystemUser = true;
};

users.groups.klipper = {};

networking.firewall.allowedTCPPorts = [ 80 7125 ];

systemd.tmpfiles.settings = {
  "klipper" = {
    "/srv/printer_data" = {
      d = {
        group = "klipper";
        mode = "0755";
        user = "klipper";
      }; 
    };
  };
};

services.mainsail.enable = true; 
#services.fluidd.enable = true;  

systemd.services.klipper.serviceConfig = {
  ReadWritePaths = [ 
    "/srv/printer_data"
  ];
};

services.klipper = {
  configFile = "/srv/printer_data/config/printer.cfg";
  enable = true;
  configDir = "/srv/printer_data/config";
  mutableConfig = true;
};

services.moonraker = {
  enable = true;
  user = "klipper";
  stateDir = "/srv/printer_data";
  settings = {
    authorization = {
      trusted_clients = [
        "127.0.0.1"
        "::1"
        "10.0.0.0/8"
        "192.168.0.0/16"
        "172.16.0.0/12"
        "fe80::/10"
      ];
      
      cors_domains = [
        "http://*.lan"
        "http://*.local"
        "https://*.local"
        "https://*.lan"
        "https://my.mainsail.xyz"
        "http://my.mainsail.xyz"
        "https://app.fluidd.xyz"
        "http://app.fluidd.xyz"
      ];
    };
  };
}; 
```

This configuration, similarly to KIAUH, sets up a printer_data directory at /srv/printer_data. Copy your printer.cfg into /srv/printer_data/config.

Klipper can also be configured declaratively:

``` nix
services.klipper = {
  enable = true;
  mutableConfig = false;
  settings = {
    mcu = {
      baud   = 250000;
    };
  };
};
```

## Webcam

[Ustreamer](https://github.com/pikvm/ustreamer) can be configured for access to a webcam in Mainsail or Fluidd. Below is an example configuration of a 720p webcam.

``` nix
services.ustreamer = {
  enable = true;
  autoStart = true;
  device = "/dev/v4l/by-id/YOUR_DEVICE_HERE";
  extraArgs = [
    "-r 1280x720"
    "--encoder=HW"
    "--persistent"
  ];
  listenAddress = "0.0.0.0:8080";
};

networking.firewall.allowedTCPPorts = [ 8080 ];
```

The stream URL for your webcam will be <http://><YOUR_IP>:8080/stream. The snapshot URL will be <http://><YOUR_IP>:8080/snapshot.

## Extensions

### Installing extensions

Add the repo with your extension as a flake input:

``` nix
inputs = {
  kiauh = {
    url = "github:dw-0/kiauh/master";
    flake = false;
  };     
};
```

Override klipper's postInstall to add your extensions to extras. The example below install the gcode_shell_command extension:

``` nix
services.klipper.package = = pkgs.klipper.overrideAttrs ({ postInstall ? "", ... }: {
  postInstall = postInstall + ''
    chmod +rw $out/lib/klippy -R
    cp ${inputs.kiauh}/kiauh/extensions/gcode_shell_cmd/assets/gcode_shell_command.py $out/lib/klipper/extras
  '';
});
```

### gcode_shell_command

To run custom scripts with gcode_shell_command, you need to add your programs to the PATH of the Klipper service. You may do so using systemd.services.klipper.path:

``` nix
systemd.services.klipper.path = [pkgs.<YOUR_PACKAGE> pkgs.<YOUR_SECOND_PACKAGE>];
```

## Compiling firmware

Clone into the Klipper [repository](https://github.com/Klipper3d/klipper) and go into a nix shell with the correct gcc package (either `gcc`, `gcc-arm-embedded`, `pkgsCross.or1k.buildPackages.gcc` or `pkgsCross.avr.buildPackages.gcc`), gnumake, and python:

``` shell

~ $ git clone https://github.com/Klipper3d/klipper
~ $ cd klipper
~/klipper $ nix-shell -p gnumake python3 YOUR_GCC_PACKAGE
```

Now, inside the Klipper directory, you can run `make menuconfig` and `make` like you normally would.

<a href="Category:Guide" class="wikilink" title="Category:Guide">Category:Guide</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
