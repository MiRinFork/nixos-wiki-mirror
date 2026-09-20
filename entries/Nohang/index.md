<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Nohang -->

[Nohang](https://github.com/hakavlad/nohang) is a daemon for Linux which can prevent out of memory (OOM) conditions of a running system. It keeps responsiveness by sending SIGTERM events to target processes in low memory state and SIGKILL if the process doesn't respond.

### Setup

To enable *nohang*, simply add following line to your system configuration.

``` nix
services.nohang.enable = true;
```
