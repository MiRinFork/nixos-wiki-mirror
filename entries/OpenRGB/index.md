<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenRGB -->

[OpenRGB](https://openrgb.org/) is a powerful open-source software for controlling RGB lighting on various computer components and peripherals. It provides a unified interface for managing RGB devices from different manufacturers, eliminating the need for multiple proprietary software solutions. With OpenRGB, users can <strong>customize</strong> their PC's lighting effects, <strong>synchronize</strong> colors across devices, and create <strong>dynamic</strong> lighting profiles. This tool is particularly useful for users who want to maintain full control over their system's RGB lighting without relying on closed-source applications.

## Installation

<div style="border: 1px solid var(--border-color-error); background: var(--background-color-error-subtle); padding: 30px; border-radius: 5px; margin: 10px 0px; display: flex; align-items: center;">

<div style="color: var(--border-color-error); font-size: 40px; margin-right: 15px; background: var(--background-color-error-subtle); display: flex; line-height: 0;  align-items: center;">

⚠

</div>

<div style="color: var(--border-color-error); font-size: 15px; font-style: normal; font-weight: 400; line-height: normal; text-align: left;">

Please do note that installing this package by itself will lead to udev rules not being set up correctly. It is recommended to have both services.hardware.openrgb.enable = true; and the package installed (either openrgb or openrgb-with-all-plugins)

</div>

</div>

#### Using nix-shell

``` bash
nix-shell -p openrgb
```

#### Using Global Configuration

``` text
environment.systemPackages = [
  pkgs.openrgb
];
```

After modifying your configuration, apply the changes by running:

``` bash
sudo nixos-rebuild switch
```

#### Using Home Configuration

``` text
home.packages = [ 
  pkgs.openrgb 
];
```

After updating your configuration, apply the changes by running:

``` bash
home-manager switch
```

## Configuration

#### Basic

``` nix
services.hardware.openrgb.enable = true; 
```

#### Advanced

``` nix
services.hardware.openrgb = { 
  enable = true; 
  package = pkgs.openrgb-with-all-plugins; 
  motherboard = "amd"; 
  server.port = 6742; 
};
```

## Tips and Tricks

#### Location of Options

The global options are listed on [services.hardware.openrgb.\*](https://search.nixos.org/options?query=services.hardware.openrgb).

#### Turn off RGB

If you'd like to turn off all RGB devices supported by OpenRGB, consider something like:

``` nix
{ pkgs, lib, ... }:
let
  no-rgb = pkgs.writeScriptBin "no-rgb" ''
    #!/bin/sh
    NUM_DEVICES=$(${pkgs.openrgb}/bin/openrgb --noautoconnect --list-devices | grep -E '^[0-9]+: ' | wc -l)

    for i in $(seq 0 $(($NUM_DEVICES - 1))); do
      ${pkgs.openrgb}/bin/openrgb --noautoconnect --device $i --mode static --color 000000
    done
  '';
in {
  config = {
    services.udev.packages = [ pkgs.openrgb ];
    boot.kernelModules = [ "i2c-dev" ];
    hardware.i2c.enable = true;

    systemd.services.no-rgb = {
      description = "no-rgb";
      serviceConfig = {
        ExecStart = "${no-rgb}/bin/no-rgb";
        Type = "oneshot";
      };
      wantedBy = [ "multi-user.target" ];
    };
  };
}
```

## Troubleshooting

## References

- <https://openrgb.org/>
- <https://search.nixos.org/options?query=services.hardware.openrgb>

<a href="Category:Hardware" class="wikilink" title="Category:Hardware">Category:Hardware</a>
