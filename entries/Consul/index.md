<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Consul -->

## Consul

Consul by Hashicorp is a distributed key/value store along with other things.

Setting up Consul can be as easy as:

``` nix
  services.consul.enable = true;
```

But there are some [consul specific options](https://search.nixos.org/options?query=services.consul) that might be useful.

Setting up Consul in a production setting is beyond the scope of this wiki, see the consul documentation for particulars.

One advice is that if you have systemd services depending on Consul via `After=consul.service`, you may want to switch consul service type no `notify`, to make sure that dependent services don't try to run until Consul is ready to accept connections:

``` nix
  systemd.services.consul.serviceConfig.Type = "notify";
```

## Consul-template

currently consul-template is packaged, but does not have nixos options to configure it. Here is an haproxy example that might prove useful:

This turns on haproxy with essentially a blank config then sets up a systemd unit to run haproxy-config, a consul-template service to generate the haproxy configuration from your template.

note, in the configuration below, you will need to change: /path/to/haproxy.consul to the path where your haproxy consul template resides. If you rename the file, be sure to fix the ExecReload line as well.

``` nix
services.haproxy.enable = true;
services.haproxy.config = "#this should be replaced via systemd.services.haproxy-config";
systemd.services.haproxy-config = {
    description = "Consul-Template configuration for HAPROXY.";
    documentation = [ "https://github.com/hashicorp/consul-template" ];
    wantedBy = [ "multi-user.target" ];
    requires = [ "network-online.target" ];
    after = [ "network-online.target" "consul.service" ];
    path = [
      pkgs.coreutils
      pkgs.consul
      pkgs.consul-template
      pkgs.vault
      pkgs.cacert
      pkgs.procps
    ];
    serviceConfig = {
      ExecStart = ''
        ${pkgs.consul-template}/bin/consul-template -template "/path/to/haproxy.consul:/etc/haproxy.cfg:${pkgs.procps}/bin/pkill -SIGUSR2 haproxy"
        '';
      ExecReload = "${pkgs.procps}/bin/pkill -HUP -f haproxy.consul";
      KillMode = "process";
      KillSignal = "SIGINT";
      LimitNOFILE = "infinity";
      LimitNPROC = "infinity";
      Restart = "on-failure";
      RestartSec = "2";
      StartLimitBurst = "3";
      StartLimitIntervalSec="10";
      TasksMax = "infinity";
      # we run as root, because /etc/ is not writable by the haproxy user, the config file should really exist in /etc/haproxy/
      #User = "${config.services.haproxy.user}";
      User = "root";
    };

    environment = {
      #systemd environment for haproxy-config
    };
  };
systemd.services.haproxy-config.enable = true;
```

<a href="Category:Applications" class="wikilink" title="Category:Applications">Category:Applications</a>
