<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Netdata -->

<strong>[Netdata](https://www.netdata.cloud/)</strong> is a metrics tool, which comes with a lot of sane pre-configuration. It contains various plugins, which may need specific steps to be enabled.

## Installation

Add the following to your <a href="Overview_of_the_NixOS_Linux_distribution#Declarative_Configuration" class="wikilink" title="NixOS configuration">NixOS configuration</a> to setup and use Netdata:

Netdata's basic instance will then be available at [`http://localhost:19999`](http://localhost:19999) on the local network.

## Configuration

You may wish to aggregate multiple machines' Netdata information, in which case, you can subscribe to the Netdata Cloud service, or you can self-host <a href="Prometheus" class="wikilink" title="Prometheus">Prometheus</a> and <a href="Grafana" class="wikilink" title="Grafana">Grafana</a> as a self-hosted solution.

#### Adding node to cloud

- Enable the Netdata service as described above.
- override package to be built \`withCloud\`
- When adding a new node in the web interface, you get a token; copy that token to `/var/lib/netdata/cloud.d/token`.
- As root, run the `netdata-claim.sh` script.

###### Declare claim token ([option docs](https://search.nixos.org/options?show=services.netdata.claimTokenFile))

``` nixos
services.netdata = {
  package = pkgs.netdata.override { withCloud = true; };
  claimTokenFile = config.sops.secrets.netdata-token.path; # mounted by sops-nix, in this example
};
```

### Streaming node setup

#### Receiver node

#### Sender node

If you don't need any web UI and want to consume minimal resources on the sender node, use:

This way, it will neither spawn a web UI, nor store any metric locally.

<span id="python-plugins"></span>

## Tips and Tricks

#### Modern Web UI

Netdata comes with an old, unmaintained but open source web UI that is accessible at port `19999`. Netdata Inc. will not fix any bugs in the old UI and it may to become more and more broken as time goes on. There is however, a newer, maintained but proprietary web UI that can be optionally enabled to replace the old UI. To use this new UI, override Netdata's package:

### Python Plugins

#### nvidia-smi

To enable the `nvidia-smi` plugin, you have to ensure that `nvidia-smi` can be called by `netdata`:

#### samba

To enable the `samba` plugin, additional permissions and configurations will need to be set:
