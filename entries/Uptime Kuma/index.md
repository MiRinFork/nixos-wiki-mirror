<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Uptime Kuma -->

[Uptime Kuma](https://uptime.kuma.pet/) is a self-hosted, open-source monitoring tool that allows you to track the uptime of your websites and services. It offers a user-friendly interface, supports various notification services, and enables the creation of customizable status pages.

## Setup

To enable Uptime Kuma on your NixOS instance, add following to your system config and apply

``` nixos
services.uptime-kuma.enable = true;
```

Go to <http://localhost:3001> to setup a user account and to configure the app.

## See also

- <a href="Nagios" class="wikilink" title="Nagios">Nagios</a>, monitoring daemon and web interface
- <a href="Prometheus" class="wikilink" title="Prometheus">Prometheus</a>, event monitoring and alerting

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
