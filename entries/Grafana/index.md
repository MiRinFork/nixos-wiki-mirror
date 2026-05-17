<!-- Generated from https://wiki.nixos.org/wikidump.xml.zst. Do not edit by hand. -->

<!-- Source page: Grafana -->

**[Grafana](https://grafana.com/grafana/)** is an open-source, general purpose visualization and dashboarding tool, which runs as a web application. It can be used to create time-series graphs and display logs. For data sources, it supports <a href="Prometheus" class="wikilink" title="Prometheus">Prometheus</a>, graphite, InfluxDB, opentsdb, <a href="Grafana_Loki" class="wikilink" title="Grafana Loki">Grafana Loki</a>, <a href="PostgreSQL" class="wikilink" title="PostgreSQL">PostgreSQL</a> and more.

## Installation

Grafana is available as NixOS module: . [Official documentation](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/) for the options inside `settings`. Here is a basic config:

## Usage

Grafana can be used through tunnels, like a SSH tunnel, or a VPN tunnel like Wireguard or Headscale. This way, Grafana can be completely shielded from the outside.

Another way is to make it publicly available, usually behind a reverse proxy.

#### Nginx

Here is how to setup <a href="Nginx" class="wikilink" title="Nginx">Nginx</a> such that it proxies `your.domain/grafana` to your Grafana instance:

#### Traefik

<a href="Traefik" class="wikilink" title="Traefik">Traefik</a> is another common reverse proxy, for which the configuration relevant to Grafana would like this:

Alternatively, to use Grafana on `grafana.your.domain` instead of `your.domain/grafana`, you could change line 5 above to:

``` diff
-rule = "Host(`your.domain`) && PathPrefix(`/grafana`)";
+rule = "Host(`grafana.your.domain`)";
```

## Configuration

Everything (data sources, users, dashboards, ...) can be configured either in the Web UI or provisioned as code using Nix.

### Via Web UI

Log into the Grafana web application (using default user: admin, password: admin). Refer to the official documentation on how to do it:

- [Add a data source](https://grafana.com/docs/grafana/latest/datasources/add-a-data-source/)
- [Add a user](https://grafana.com/docs/grafana/latest/administration/manage-users-and-permissions/manage-server-users/add-user/)
- [Create dashboard](https://grafana.com/docs/grafana/latest/dashboards/dashboard-create/)

### Declarative configuration

Grafana supports [provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/) data sources, dashboards and alerting using . Note that removing a provision and switching to the new NixOS configuration does not currently remove the provisioned items; you have to define them, for example, in `deleteDatasources`.

## External Links

- [wiki.archlinux.org/Grafana](https://wiki.archlinux.org/title/Grafana)
- [grafana.com](https://grafana.com/)
- [How to Setup Prometheus, Grafana and Loki on NixOS](https://xeiaso.net/blog/prometheus-grafana-loki-nixos-2020-11-20)

<a href="Category:Server" class="wikilink" title="Category:Server">Category:Server</a> <a href="Category:Web_Applications" class="wikilink" title="Category:Web Applications">Category:Web Applications</a>
