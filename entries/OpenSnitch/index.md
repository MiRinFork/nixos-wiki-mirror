<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: OpenSnitch -->

[Opensnitch](https://github.com/evilsocket/opensnitch) is a configurable inbound and outbound firewall with support for configurable rules by application, port, host, etc.

## Installation

Add the following line to your system configuration to install and enable OpenSnitch:

``` nix
services.opensnitch.enable = true;
```

OpenSnitch will start blocking connections as soon as the client application `opensnitch-ui` is connected. For <a href="Home_Manager" class="wikilink" title="Home Manager">Home Manager</a> users, you can automatically start it in the background with the following configuration:

``` nix
home-manager.users.myuser = {
  services.opensnitch-ui.enable = true;
};
```

Using this minimal and default configuration, an application which tries to connect to the outside network will be blocked. You'll see a popup window asking you to grant or deny connectivity for the specific application.

## Configuration

You can preconfigure which connections are allowed or blocked by default. The following rules will allow internet connectivity for the binaries `systemd-resolved` and `systemd-timesyncd`. All other connection requests will be blocked and require a manual exception.

``` nix
services.opensnitch = {
  enable = true;
  rules = {
    systemd-timesyncd = {
      created = "2018-04-07T14:13:27.903996051+02:00";
      name = "systemd-timesyncd";
      enabled = true;
      action = "allow";
      duration = "always";
      operator = {
        type ="simple";
        sensitive = false;
        operand = "process.path";
        data = "${lib.getBin pkgs.systemd}/lib/systemd/systemd-timesyncd";
      };
    };
    systemd-resolved = {
      created = "2018-04-07T14:13:27.903996051+02:00";
      name = "systemd-resolved";
      enabled = true;
      action = "allow";
      duration = "always";
      operator = {
        type ="simple";
        sensitive = false;
        operand = "process.path";
        data = "${lib.getBin pkgs.systemd}/lib/systemd/systemd-resolved";
      };
    };
  };
};
```

Please refer to the [upstream documentation](https://github.com/evilsocket/opensnitch/wiki/Rules) for configuration syntax and additional examples.

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a> <a href="Category:Security" class="wikilink" title="Category:Security">Category:Security</a>
